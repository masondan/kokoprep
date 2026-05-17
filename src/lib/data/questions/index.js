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
 * Ratios based on actual Common Entrance paper proportions:
 *   Comprehension: ~24% (5 of 21), Lexis & Structure: ~71% (15 of 21), Phonetics: ~5% (1 of 21)
 *
 * Simplified fixed counts:
 *   5 questions:  1 comprehension group, 3 lexis-structure, 1 phonetics
 *   10 questions: 2 comprehension groups, 6 lexis-structure, 2 phonetics
 *
 * For other counts, we scale proportionally and round.
 */
function getEnglishCounts(target) {
	if (target <= 5) {
		return { comprehensionGroups: 1, lexis: 3, phonetics: 1 };
	}
	if (target <= 10) {
		return { comprehensionGroups: 2, lexis: 6, phonetics: 2 };
	}
	// For larger sets (Beat the Clock), scale up proportionally
	const comprehensionGroups = Math.max(1, Math.round(target * 0.2));
	const phonetics = Math.max(1, Math.round(target * 0.1));
	const lexis = target - (comprehensionGroups * 3) - phonetics; // each group = 3 questions
	return { comprehensionGroups, lexis: Math.max(1, lexis), phonetics };
}

/**
 * Get a weighted English question set with passage-grouped comprehension.
 *
 * Comprehension questions are selected as complete passage groups (all questions
 * sharing the same passageId are included together). This ensures students always
 * see the passage before answering related questions.
 *
 * @param {number} target - Total number of questions needed
 * @param {string[]} missedIds - IDs of previously missed questions (prioritised)
 * @returns {Array} Ordered array: comprehension groups first, then lexis, then phonetics
 */
export function getWeightedEnglishQuestions(target, missedIds = []) {
	const counts = getEnglishCounts(target);

	// ── Comprehension: select by passage group ──────────────────────────────
	const compQuestions = englishQuestions.filter(q => q.subcategory === 'comprehension');

	// Build a map of passageId → questions[]
	const passageMap = {};
	for (const q of compQuestions) {
		if (!passageMap[q.passageId]) passageMap[q.passageId] = [];
		passageMap[q.passageId].push(q);
	}

	// Get all available passage IDs, prioritising those with missed questions
	const allPassageIds = Object.keys(passageMap);
	const missedPassageIds = allPassageIds.filter(pid =>
		passageMap[pid].some(q => missedIds.includes(q.id))
	);
	const freshPassageIds = allPassageIds.filter(pid => !missedPassageIds.includes(pid));

	// Select passage groups (missed first, then fresh)
	const shuffledMissed = shuffle([...missedPassageIds]);
	const shuffledFresh = shuffle([...freshPassageIds]);
	const selectedPassageIds = [
		...shuffledMissed,
		...shuffledFresh
	].slice(0, counts.comprehensionGroups);

	// Flatten selected passage groups into ordered question arrays
	const comprehensionSelected = selectedPassageIds.flatMap(pid => passageMap[pid]);

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

	// ── Combine: comprehension groups first, then lexis, then phonetics ─────
	// Comprehension groups stay in order (passage questions consecutive)
	// Lexis and phonetics are shuffled together after
	const nonComp = shuffle([...lexisSelected, ...phonSelected]);

	return [...comprehensionSelected, ...nonComp];
}
