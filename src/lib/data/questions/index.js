import mathematicsQuestions from './mathematics.json';
import englishQuestions from './english.json';
import basicScienceQuestions from './basic-science.json';
import basicTechnologyQuestions from './basic-technology.json';
import socialStudiesQuestions from './social-studies.json';
import civicEducationQuestions from './civic-education.json';
import christianReligiousStudiesQuestions from './christian-religious-studies.json';
import computerStudiesQuestions from './computer-studies.json';
import agricultureScienceQuestions from './agriculture-science.json';

/**
 * All questions indexed by category key
 */
const questionsByCategory = {
	mathematics: mathematicsQuestions,
	english: englishQuestions,
	'basic-science': basicScienceQuestions,
	'basic-technology': basicTechnologyQuestions,
	'social-studies': socialStudiesQuestions,
	'civic-education': civicEducationQuestions,
	'christian-religious-studies': christianReligiousStudiesQuestions,
	'computer-studies': computerStudiesQuestions,
	'agriculture-science': agricultureScienceQuestions
};

/**
 * All questions as a flat array for 'mix' mode.
 * Comprehension questions are EXCLUDED from mix — they require a passage context
 * and should only appear when English Language is selected directly.
 */
export const allQuestions = Object.entries(questionsByCategory)
	.flatMap(([key, questions]) => {
		if (key === 'english') {
			// Only include non-comprehension English questions in mix
			return questions.filter(q => q.subcategory !== 'comprehension');
		}
		return questions;
	});

/**
 * Get questions for a given category.
 * For 'mix', returns all questions excluding comprehension.
 * For 'english', returns all English questions (weighting handled separately).
 *
 * @param {string} category - Category key or 'mix'
 * @returns {Array} Array of question objects
 */
export function getQuestionsByCategory(category) {
	if (category === 'mix') {
		return allQuestions;
	}
	return questionsByCategory[category] ?? [];
}

/**
 * Shuffle an array in place using Fisher-Yates. Returns the array.
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Sample n items from an array without mutating the original.
 * @param {Array} arr
 * @param {number} n
 * @returns {Array}
 */
function sampleN(arr, n) {
	return shuffle([...arr]).slice(0, Math.min(n, arr.length));
}

/**
 * English question counts per session size.
 * Updated distribution for better UX:
 *   5 questions:  0 comprehension, 4 lexis-structure, 1 phonetics
 *   10 questions: 3 comprehension (from 1 passage), 6 lexis-structure, 1 phonetics
 *
 * For Beat the Clock (larger sets), no comprehension questions.
 */
function getEnglishCounts(target) {
	if (target <= 5) {
		return { comprehensionQuestions: 0, lexis: 4, phonetics: 1 };
	}
	if (target <= 10) {
		return { comprehensionQuestions: 3, lexis: 6, phonetics: 1 };
	}
	// For larger sets (Beat the Clock), no comprehension
	return { comprehensionQuestions: 0, lexis: target - 1, phonetics: 1 };
}

/**
 * Get a weighted English question set.
 *
 * For Brain Gym 5 questions: No comprehension, 4 lexis, 1 phonetics
 * For Brain Gym 10 questions: 3 comprehension (from 1 fresh passage), 6 lexis, 1 phonetics
 * For Beat the Clock: No comprehension, rest lexis+phonetics
 *
 * Comprehension questions are selected individually from a single passage,
 * prioritising missed questions within that passage. The passage is rotated
 * to ensure variety.
 *
 * @param {number} target - Total number of questions needed
 * @param {string[]} missedIds - IDs of previously missed questions (prioritised)
 * @param {string|null} lastCompPassage - Last used comprehension passage ID (for rotation)
 * @param {function} updateLastPassage - Callback to save the selected passage ID
 * @returns {Array} Ordered array: comprehension questions (if any), then lexis, then phonetics
 */
export function getWeightedEnglishQuestions(target, missedIds = [], lastCompPassage = null, updateLastPassage = null) {
	const counts = getEnglishCounts(target);

	let comprehensionSelected = [];

	// ── Comprehension: select 3 questions from a fresh passage ──────────────
	if (counts.comprehensionQuestions > 0) {
		const compQuestions = englishQuestions.filter(q => q.subcategory === 'comprehension');

		// Build a map of passageId → questions[]
		const passageMap = {};
		for (const q of compQuestions) {
			if (!passageMap[q.passageId]) passageMap[q.passageId] = [];
			passageMap[q.passageId].push(q);
		}

		// Get all passage IDs except the last one (for rotation)
		const allPassageIds = Object.keys(passageMap);
		const availablePassageIds = lastCompPassage
			? allPassageIds.filter(pid => pid !== lastCompPassage)
			: allPassageIds;

		// If all passages have been used, reset the cycle
		const passageIds = availablePassageIds.length > 0 ? availablePassageIds : allPassageIds;

		// Shuffle and pick one passage
		const selectedPassageId = shuffle([...passageIds])[0];

		// Get all questions from the selected passage
		const passageQuestions = passageMap[selectedPassageId];

		// Split into missed and fresh within this passage
		const passMissed = passageQuestions.filter(q => missedIds.includes(q.id));
		const passFresh = passageQuestions.filter(q => !missedIds.includes(q.id));

		// Prioritise missed questions within the passage, then fill with fresh
		shuffle(passMissed);
		shuffle(passFresh);
		const missedToUse = passMissed.slice(0, counts.comprehensionQuestions);
		const freshToUse = passFresh.slice(0, counts.comprehensionQuestions - missedToUse.length);
		comprehensionSelected = [...missedToUse, ...freshToUse];

		// Update the last passage ID if callback provided
		if (updateLastPassage) {
			updateLastPassage(selectedPassageId);
		}
	}

	// ── Lexis & Structure ───────────────────────────────────────────────────
	const lexisPool = englishQuestions.filter(q => q.subcategory === 'lexis-structure');
	const lexisMissed = lexisPool.filter(q => missedIds.includes(q.id));
	const lexisFresh = lexisPool.filter(q => !missedIds.includes(q.id));
	const lexisMissedSlots = Math.max(1, Math.floor(counts.lexis * 0.2));
	const lexisMissedPick = sampleN(lexisMissed, lexisMissedSlots);
	const lexisFreshPick = sampleN(lexisFresh, counts.lexis - lexisMissedPick.length);
	const lexisSelected = shuffle([...lexisMissedPick, ...lexisFreshPick]);

	// ── Phonetics ───────────────────────────────────────────────────────────
	const phonPool = englishQuestions.filter(q => q.subcategory === 'phonetics');
	const phonMissed = phonPool.filter(q => missedIds.includes(q.id));
	const phonFresh = phonPool.filter(q => !missedIds.includes(q.id));
	const phonMissedSlots = Math.max(1, Math.floor(counts.phonetics * 0.2));
	const phonMissedPick = sampleN(phonMissed, phonMissedSlots);
	const phonFreshPick = sampleN(phonFresh, counts.phonetics - phonMissedPick.length);
	const phonSelected = shuffle([...phonMissedPick, ...phonFreshPick]);

	// ── Combine: comprehension first, then lexis + phonetics ─────
	const nonComp = shuffle([...lexisSelected, ...phonSelected]);

	return [...comprehensionSelected, ...nonComp];
}
