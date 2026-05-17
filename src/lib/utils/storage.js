/**
 * Load test history and missed question IDs from localStorage
 * @returns {{history: Array, missed: Array}} Loaded data
 */
export function loadFromStorage() {
	try {
		const historyStr = localStorage.getItem('koko_history');
		const missedStr = localStorage.getItem('koko_missed');

		const history = historyStr ? JSON.parse(historyStr) : [];
		const missed = missedStr ? JSON.parse(missedStr) : [];

		return { history, missed };
	} catch (error) {
		console.warn('localStorage read error:', error);
		return { history: [], missed: [] };
	}
}

/**
 * Save test history and missed question IDs to localStorage
 * @param {Array} history - Array of HistoryEntry objects
 * @param {Array} missed - Array of missed question IDs
 */
export function saveToStorage(history, missed) {
	try {
		localStorage.setItem('koko_history', JSON.stringify(history));
		localStorage.setItem('koko_missed', JSON.stringify(missed));
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
	} catch (error) {
		console.warn('localStorage clear error:', error);
	}
}
