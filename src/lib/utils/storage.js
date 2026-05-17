/**
 * Load test history and missed question IDs from localStorage
 * @returns {{history: Array, missed: Array}} Loaded data
 */
export function loadFromStorage() {
	try {
		const historyStr = localStorage.getItem('koko_history');
		const missedStr = localStorage.getItem('koko_missed');
		const lastPassageStr = localStorage.getItem('koko_lastCompPassage');

		const history = historyStr ? JSON.parse(historyStr) : [];
		const missed = missedStr ? JSON.parse(missedStr) : [];
		const lastCompPassage = lastPassageStr ? JSON.parse(lastPassageStr) : null;

		return { history, missed, lastCompPassage };
	} catch (error) {
		console.warn('localStorage read error:', error);
		return { history: [], missed: [], lastCompPassage: null };
	}
}

/**
 * Save test history, missed question IDs, and last comprehension passage to localStorage
 * @param {Array} history - Array of HistoryEntry objects
 * @param {Array} missed - Array of missed question IDs
 * @param {string|null} lastCompPassage - Last comprehension passage ID used
 */
export function saveToStorage(history, missed, lastCompPassage = null) {
	try {
		localStorage.setItem('koko_history', JSON.stringify(history));
		localStorage.setItem('koko_missed', JSON.stringify(missed));
		if (lastCompPassage) {
			localStorage.setItem('koko_lastCompPassage', JSON.stringify(lastCompPassage));
		}
	} catch (error) {
		console.warn('localStorage write error (possibly private browsing):', error);
		// Silently continue — app still works without persistence
	}
}

/**
 * Clear all localStorage data (for testing/debugging)
 */
export function clearStorage() {
	try {
		localStorage.removeItem('koko_history');
		localStorage.removeItem('koko_missed');
		localStorage.removeItem('koko_lastCompPassage');
	} catch (error) {
		console.warn('localStorage clear error:', error);
	}
}
