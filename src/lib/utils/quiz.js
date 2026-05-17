import { getQuestionsByCategory, getWeightedEnglishQuestions } from '$lib/data/questions/index.js';

/**
 * Get a shuffled session of questions based on category, mode, and missed tracking.
 * For English Brain Gym: 5 questions = 0 comprehension + 4 lexis + 1 phonetics
 *                       10 questions = 3 comprehension + 6 lexis + 1 phonetics
 *
 * @param {Array} allQuestions - All available questions (used for 'mix' fallback)
 * @param {string} category - Category key or 'mix'
 * @param {string} mode - 'braingym' | 'beattheclock'
 * @param {number} count - Number of questions for Brain Gym
 * @param {Array} missedIds - IDs of previously missed questions
 * @param {number} [timerMins=1] - Timer minutes (Beat the Clock only): 1 → 5 questions, 2 → 10 questions
 * @param {string|null} [lastCompPassage=null] - Last comprehension passage ID (English only)
 * @param {function} [onUpdatePassage=null] - Callback to save the selected passage ID
 * @returns {Array} Shuffled array of session questions
 */
export function getSessionQuestions(allQuestions, category, mode, count, missedIds = [], timerMins = 1, lastCompPassage = null, onUpdatePassage = null) {
	// Beat the Clock: 5 questions for 1 min, 10 for 2 min
	const btcTarget = timerMins === 2 ? 10 : 5;
	const target = mode === 'braingym' ? count : btcTarget;

	// English: Beat the Clock uses only lexis-structure and phonetics (no comprehension)
	if (category === 'english') {
		if (mode === 'beattheclock') {
			return getBeatTheClockEnglishQuestions(target, missedIds);
		}
		const result = getWeightedEnglishQuestions(target, missedIds, lastCompPassage, onUpdatePassage);
		if (result.length === 0) {
			console.warn('No English questions available.');
		}
		return result;
	}

	// 1. Get pool for this category
	let pool = getQuestionsByCategory(category);

	if (pool.length === 0) {
		console.warn(`No questions found for category: ${category}`);
		return [];
	}

	// Beat the Clock: mathematics uses only easy questions (no long working out)
	if (mode === 'beattheclock' && category === 'mathematics') {
		const easyPool = pool.filter(q => q.difficulty === 'easy');
		if (easyPool.length > 0) {
			pool = easyPool;
		} else {
			console.warn('No easy mathematics questions found — using full pool as fallback.');
		}
	}

	// 2. Split into missed and not missed
	const missed = pool.filter(q => missedIds.includes(q.id));
	const notMissed = pool.filter(q => !missedIds.includes(q.id));

	// 3. Shuffle both arrays
	shuffle(missed);
	shuffle(notMissed);

	// 4. Calculate how many questions to take
	const missedSlots = Math.max(1, Math.floor(target * 0.2)); // prioritise up to 20% missed
	const missedToUse = missed.slice(0, Math.min(missedSlots, missed.length));
	const freshToUse = notMissed.slice(0, target - missedToUse.length);

	// 5. Combine and shuffle
	return shuffle([...missedToUse, ...freshToUse]);
}

/**
 * Get English questions for Beat the Clock — lexis-structure and phonetics only, no comprehension.
 * @param {number} target - Total questions needed
 * @param {string[]} missedIds - Previously missed question IDs
 * @returns {Array} Shuffled array of non-comprehension English questions
 */
function getBeatTheClockEnglishQuestions(target, missedIds = []) {
	const pool = getQuestionsByCategory('english').filter(q => q.subcategory !== 'comprehension');
	const missed = pool.filter(q => missedIds.includes(q.id));
	const notMissed = pool.filter(q => !missedIds.includes(q.id));
	shuffle(missed);
	shuffle(notMissed);
	const missedSlots = Math.max(1, Math.floor(target * 0.2));
	const missedToUse = missed.slice(0, Math.min(missedSlots, missed.length));
	const freshToUse = notMissed.slice(0, target - missedToUse.length);
	return shuffle([...missedToUse, ...freshToUse]);
}

/**
 * Select a balanced mix of diagram-based and text-only questions.
 * Mirrors the real exam ratio of ~5 diagram questions per 26 total.
 *
 * @param {Array} allQuestions - Full pool of questions for a category
 * @param {number} targetCount - Total questions to return (default 26)
 * @returns {Array} Shuffled array with proportional diagram/text split
 */
export function selectBalancedQuestions(allQuestions, targetCount = 26) {
	const diagramTarget = Math.round(targetCount * (5 / 26)); // ~5 per 26
	const textTarget = targetCount - diagramTarget;

	const diagramPool = allQuestions.filter(q => q.imagePath);
	const textPool = allQuestions.filter(q => !q.imagePath);

	shuffle(diagramPool);
	shuffle(textPool);

	const selected = [
		...diagramPool.slice(0, Math.min(diagramTarget, diagramPool.length)),
		...textPool.slice(0, Math.min(textTarget, textPool.length))
	];

	// If diagram pool is short, fill remaining slots from text pool
	if (selected.length < targetCount) {
		const extra = textPool.slice(textTarget, textTarget + (targetCount - selected.length));
		selected.push(...extra);
	}

	return shuffle(selected);
}

/**
 * Fisher-Yates shuffle algorithm — mutates and returns the array
 * @param {Array} arr - Array to shuffle
 * @returns {Array} The shuffled array
 */
export function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Get option letter (A, B, C, D)
 * @param {number} index - 0-based index
 * @returns {string} Letter A-D
 */
export function getOptionLetter(index) {
	return String.fromCharCode(65 + index); // A=65, B=66, C=67, D=68
}

/**
 * Format time as MM:SS
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time
 */
export function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get celebratory message based on score percentage
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Celebratory message
 */
export function getCelebratoryMessage(percentage) {
	if (percentage >= 90) {
		return '🎉 Amazing! You\'re a Koko Champion!';
	} else if (percentage >= 70) {
		return '🌟 Great work! Keep it up!';
	} else if (percentage >= 50) {
		return '👍 Good effort! Review the ones you missed.';
	} else {
		return '💪 Don\'t give up! Try again!';
	}
}

/**
 * Get Brain Gym result message based on score
 * Maps score ranges to encouragement messages
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {string} Result message
 */
export function getBrainGymResultMessage(correct, total) {
	// Determine the ratio
	const ratio = correct / total;

	// Check for perfect score (5/5 or 10/10)
	if (
		(total === 5 && correct === 5) ||
		(total === 10 && correct === 10)
	) {
		return 'Purr-fect score. You rock!';
	}

	// Check for 4/5 or 8-9/10
	if (
		(total === 5 && correct === 4) ||
		(total === 10 && (correct === 8 || correct === 9))
	) {
		return 'Excellent result. Well done.';
	}

	// Check for 3/5 or 6-7/10
	if (
		(total === 5 && correct === 3) ||
		(total === 10 && (correct === 6 || correct === 7))
	) {
		return 'You got this. Good work.';
	}

	// Check for 2/5 or 4-5/10
	if (
		(total === 5 && correct === 2) ||
		(total === 10 && (correct === 4 || correct === 5))
	) {
		return 'Keep pushing. You\'ll get there.';
	}

	// Check for 1/5 or 1-3/10
	if (
		(total === 5 && correct === 1) ||
		(total === 10 && (correct === 1 || correct === 2 || correct === 3))
	) {
		return 'Sorry. Better luck next time.';
	}

	// Fallback for other totals (shouldn't happen, but safe default)
	return 'Better luck next time.';
}
