import { writable, derived, get } from 'svelte/store';
import { allQuestions } from '$lib/data/questions/index.js';
import { loadFromStorage, saveToStorage } from '$lib/utils/storage.js';

// All questions available in the bank
export const questions = writable(allQuestions);

// Session config (set on Dashboard)
export const mode = writable('braingym'); // 'braingym' | 'beattheclock'
export const category = writable(null); // mathematics | english | basic-science | basic-technology | social-studies | civic-education | christian-religious-studies | computer-studies | agriculture-science | mix
export const questionCount = writable(5); // 5 | 10 (Brain Gym only)
export const timerMinutes = writable(1); // 1 | 2 (Beat the Clock only)

// Active test state
export const screen = writable('dashboard'); // 'dashboard' | 'test' | 'results'
export const sessionQuestions = writable([]); // Question[] shuffled for this session
export const currentIndex = writable(0); // current question index
export const answers = writable([]); // user's selected option index per question (null = unanswered)
export const startTime = writable(null); // Date when session started
export const timeRemaining = writable(0); // seconds (Beat the Clock only)
export const timerActive = writable(false); // is timer running

// Persistence
export const testHistory = writable([]);
export const missedQuestionIds = writable([]);
export const lastComprehensionPassage = writable(null); // Last used comprehension passage ID (English only)

// Derived store: category color mapping
const categoryColors = {
	mathematics: '#2563eb',
	english: '#7c3aed',
	'basic-science': '#0d9488',
	'basic-technology': '#0369a1',
	'social-studies': '#ea580c',
	'civic-education': '#b45309',
	'christian-religious-studies': '#d97706',
	'computer-studies': '#6d28d9',
	'agriculture-science': '#16a34a',
	mix: '#ff0094'
};

export const categoryColor = derived(category, $category => {
	return categoryColors[$category] || '#ff0094';
});

// Initialize persistent data from localStorage
export function initializeStorage() {
	try {
		const { history, missed, lastCompPassage } = loadFromStorage();
		testHistory.set(history);
		missedQuestionIds.set(missed);
		lastComprehensionPassage.set(lastCompPassage);
	} catch (error) {
		console.warn('Failed to load storage:', error);
	}
}

// Reset session state
export function resetSession() {
	mode.set('braingym');
	category.set(null);
	questionCount.set(5);
	timerMinutes.set(1);
	screen.set('dashboard');
	sessionQuestions.set([]);
	currentIndex.set(0);
	answers.set([]);
	startTime.set(null);
	timeRemaining.set(0);
	timerActive.set(false);
}

// Get current question
export const currentQuestion = derived(
	[sessionQuestions, currentIndex],
	([$sessionQuestions, $currentIndex]) => {
		if ($sessionQuestions && $sessionQuestions.length > 0) {
			return $sessionQuestions[$currentIndex] || null;
		}
		return null;
	}
);

// Calculate session score
export function calculateScore(sessionAnswers, sessionQuestions) {
	if (!sessionAnswers || !sessionQuestions) return { correct: 0, total: 0, percentage: 0 };

	const correct = sessionAnswers.filter((answer, idx) => {
		const question = sessionQuestions[idx];
		return answer !== null && answer === question.correctIndex;
	}).length;

	const total = sessionQuestions.length;
	const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

	return { correct, total, percentage };
}

// Save session to history
export function saveSessionToHistory(correct, total, percentage) {
	testHistory.update($history => {
		const newEntry = {
			date: new Date().toISOString(),
			category: get(category),
			mode: get(mode),
			score: correct,
			total: total,
			percentage: percentage
		};

		const updated = [newEntry, ...$history].slice(0, 15); // cap at 15, oldest dropped
		saveToStorage(updated, get(missedQuestionIds), get(lastComprehensionPassage));
		return updated;
	});
}

// Update missed questions
export function updateMissedQuestions(sessionAnswers, sessionQuestions, allQuestions) {
	missedQuestionIds.update($missed => {
		const allMissedIds = new Set($missed);

		// Add incorrect question IDs
		sessionAnswers.forEach((answer, idx) => {
			const question = sessionQuestions[idx];
			if (answer !== null && answer !== question.correctIndex) {
				allMissedIds.add(question.id);
			}
		});

		// Remove correct question IDs (now known)
		sessionAnswers.forEach((answer, idx) => {
			const question = sessionQuestions[idx];
			if (answer !== null && answer === question.correctIndex) {
				allMissedIds.delete(question.id);
			}
		});

		const updated = Array.from(allMissedIds).slice(0, 50); // cap at 50
		saveToStorage(get(testHistory), updated, get(lastComprehensionPassage));
		return updated;
	});
}

