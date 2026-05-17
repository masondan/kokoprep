<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import {
		mode,
		category,
		questionCount,
		timerMinutes,
		screen,
		sessionQuestions,
		currentIndex,
		answers,
		testHistory,
		missedQuestionIds,
		questions,
		initializeStorage,
		resetSession,
		categoryColor
	} from '$lib/stores/quiz.js';
	import { getSessionQuestions } from '$lib/utils/quiz.js';
	import { saveToStorage } from '$lib/utils/storage.js';
	import { get } from 'svelte/store';
	import TestRoom from '$lib/components/TestRoom.svelte';
	import Results from '$lib/components/Results.svelte';

	onMount(() => {
		initializeStorage();
		resetSession();
	});

	let showAllHistory = $state(false);

	const categoryOptions = [
		{ key: 'mathematics', label: 'Mathematics', icon: '📐' },
		{ key: 'english', label: 'English Language', icon: '📚' },
		{ key: 'basic-science', label: 'Basic Science', icon: '🔬' },
		{ key: 'basic-technology', label: 'Basic Technology', icon: '🔧' },
		{ key: 'social-studies', label: 'Social Studies', icon: '🌍' },
		{ key: 'civic-education', label: 'Civic Education', icon: '🏛️' },
		{ key: 'christian-religious-studies', label: 'Christian Religious Studies', icon: '✝️' },
		{ key: 'computer-studies', label: 'Computer Studies', icon: '💻' },
		{ key: 'agriculture-science', label: 'Agricultural Science', icon: '🌱' },
		{ key: 'mix', label: 'Mix It Up!', icon: '🎲' }
	];


	const categoryMap = {
		mathematics: 'Mathematics',
		english: 'English Language',
		'basic-science': 'Basic Science',
		'basic-technology': 'Basic Technology',
		'social-studies': 'Social Studies',
		'civic-education': 'Civic Education',
		'christian-religious-studies': 'Christian Religious Studies',
		'computer-studies': 'Computer Studies',
		'agriculture-science': 'Agricultural Science',
		mix: 'Mix It Up!'
	};

	function startSession() {
		const sessionQs = getSessionQuestions(
			$questions,
			$category,
			$mode,
			$questionCount,
			$missedQuestionIds,
			$timerMinutes
		);

		if (sessionQs.length === 0) {
			alert('No questions available for this category. Try another!');
			return;
		}

		sessionQuestions.set(sessionQs);
		currentIndex.set(0);
		answers.set(new Array(sessionQs.length).fill(null));
		screen.set('test');
	}


	function retrySession(historyEntry) {
		// Remove this entry from history so it appears fresh when saved after the session
		testHistory.update($history => {
			const updated = $history.filter(e => e.date !== historyEntry.date);
			saveToStorage(updated, get(missedQuestionIds));
			return updated;
		});

		mode.set(historyEntry.mode);
		category.set(historyEntry.category);
		if (historyEntry.mode === 'braingym') {
			questionCount.set(5);
		} else {
			timerMinutes.set(1);
		}
		startSession();
	}

	const canStart = $derived(!!$mode && !!$category);
</script>

<svelte:head>
	<title>KokoPrep</title>
</svelte:head>

<div class="app-shell" style="--cat-color: {$categoryColor}">
	<!-- Header -->
	<header class="app-header">
		<img src="/logos/logo-kokoprep-logototype.png" alt="KokoPrep" class="header-logo" />
	</header>

	<!-- Main content area -->
	<main class="app-main">
		{#if $screen === 'dashboard'}
			<div class="dashboard">

				<!-- Mode Toggle — joined 50/50 pill -->
					<div class="section-label">Choose your mode</div>
					<div class="toggle-group">
						<button
							onclick={() => mode.set('braingym')}
							class="toggle-btn {$mode === 'braingym' ? 'toggle-active' : 'toggle-inactive'}"
						>
							🧠 Brain Gym
						</button>
						<button
							onclick={() => mode.set('beattheclock')}
							class="toggle-btn {$mode === 'beattheclock' ? 'toggle-active' : 'toggle-inactive'}"
						>
							⏱ Beat the Clock
						</button>
					</div>

				<!-- Category Dropdown -->
					<div class="section-label">Choose a topic</div>
					<div class="select-wrapper">
						<select
							class="topic-select"
							value={$category || ''}
							onchange={(e) => category.set(e.target.value || null)}
						>
							<option value="">Pick one or mix it up!</option>
							{#each categoryOptions as opt}
								<option value={opt.key}>{opt.icon}  {opt.label}</option>
							{/each}
						</select>
						<span class="select-chevron">▾</span>
					</div>

				<!-- Brain Gym: 5 / 10 Questions toggle -->
				{#if $mode === 'braingym'}
					<div class="section-label">Number of questions</div>
					<div class="toggle-group">
						<button
							onclick={() => questionCount.set(5)}
							class="toggle-btn {$questionCount === 5 ? 'toggle-active' : 'toggle-inactive'}"
						>
							5 Questions
						</button>
						<button
							onclick={() => questionCount.set(10)}
							class="toggle-btn {$questionCount === 10 ? 'toggle-active' : 'toggle-inactive'}"
						>
							10 Questions
						</button>
					</div>
				{/if}

				<!-- Beat the Clock: 1 / 2 Minutes toggle -->
					{#if $mode === 'beattheclock'}
						<div class="section-label">Time limit</div>
						<div class="toggle-group">
							<button
								onclick={() => timerMinutes.set(1)}
								class="toggle-btn {$timerMinutes === 1 ? 'toggle-active' : 'toggle-inactive'}"
							>
								1 Minute
							</button>
							<button
								onclick={() => timerMinutes.set(2)}
								class="toggle-btn {$timerMinutes === 2 ? 'toggle-active' : 'toggle-inactive'}"
							>
								2 Minutes
							</button>
						</div>
					{/if}

				<!-- Start Now Button -->
				<button
					onclick={startSession}
					disabled={!canStart}
					class="start-btn {canStart ? 'start-btn-active' : 'start-btn-disabled'}"
				>
					Start Now
				</button>

				<!-- Past Achievements -->
				<div class="past-kocos">
					<h3 class="past-kocos-title">🏆 Scoreboard</h3>
					{#if $testHistory.length === 0}
						<p class="past-kocos-empty">
							No Kocos yet — press Start Now to begin your first one! 🚀
						</p>
					{:else}
						{@const visibleCount = showAllHistory ? 15 : 3}
						<div class="history-list">
							{#each $testHistory.slice(0, visibleCount) as entry (entry.date)}
								<div class="history-item">
									<div class="history-info">
										<div class="history-subject">{categoryMap[entry.category] || entry.category}</div>
										<div class="history-meta">
											{entry.mode === 'braingym' ? '🧠 Brain Gym' : '⏱ Beat the Clock'}
											· {new Date(entry.date).toLocaleDateString()}
										</div>
									</div>
									<div class="history-score-col">
										<div class="history-score">{entry.score}/{entry.total}</div>
										<button
											onclick={() => retrySession(entry)}
											class="retry-btn"
										>
											↩ Try Again
										</button>
									</div>
								</div>
							{/each}
						</div>
						{#if !showAllHistory && $testHistory.length > 3}
							<button class="show-more-btn" onclick={() => showAllHistory = true}>
								Show More
							</button>
						{:else if showAllHistory}
							<button class="show-more-btn" onclick={() => showAllHistory = false}>
								Show Less
							</button>
						{/if}
					{/if}
				</div>

			</div>
		{:else if $screen === 'test'}
			<TestRoom />
		{:else if $screen === 'results'}
			<Results />
		{/if}
	</main>
</div>

<style>
	/* ── Shell ── */
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: #ffffff;
	}

	.app-header {
		background: #f7f7f7;
		padding: 16px 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 1px solid var(--color-primary);
	}

	.header-logo {
		height: 40px;
		width: auto;
		object-fit: contain;
	}

	.app-main {
		flex: 1;
		overflow-y: auto;
		background: #f7f7f7;
	}

	/* ── Dashboard ── */
	.dashboard {
		max-width: 480px;
		margin: 0 auto;
		padding: 24px 20px 40px;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	/* ── Section labels ── */
	.section-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #999999;
		margin-bottom: 8px;
		margin-top: 20px;
	}

	.dashboard > .section-label:first-child {
		margin-top: 0;
	}

	/* ── Joined toggle group ── */
	.toggle-group {
		display: flex;
		border-radius: 12px;
		overflow: hidden;
		border: 1.5px solid #e0e0e0;
		background: #f0f0f0;
	}

	.toggle-btn {
		flex: 1;
		padding: 14px 8px;
		font-size: 0.95rem;
		font-weight: 700;
		font-family: var(--font-main);
		border: none;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
		min-height: 52px;
		line-height: 1.2;
	}

	.toggle-active {
		background: var(--color-primary);
		color: #ffffff;
	}

	.toggle-inactive {
		background: #f0f0f0;
		color: #777777;
	}

	.toggle-inactive:hover {
		background: #e8e8e8;
		color: #333333;
	}


	/* ── Topic dropdown ── */
	.select-wrapper {
		position: relative;
	}

	.topic-select {
		width: 100%;
		appearance: none;
		-webkit-appearance: none;
		background: #fce7f3;
		border: 1.5px solid #fbcfe8;
		border-radius: 12px;
		padding: 14px 44px 14px 16px;
		font-size: 0.95rem;
		font-weight: 700;
		font-family: var(--font-main);
		color: #777777;
		cursor: pointer;
		min-height: 52px;
		transition: border-color 0.15s, background-color 0.15s;
	}

	.topic-select:focus {
		outline: none;
		border-color: var(--color-primary);
		background: #fce7f3;
	}

	.topic-select option {
		font-size: 0.95rem;
		padding: 8px;
		background: #ffffff;
		color: #333333;
	}

	/* placeholder option */
	.topic-select option[value=""] {
		color: #999999;
	}

	.topic-select:hover {
		border-color: #f9a8d4;
	}

	.select-chevron {
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
		color: #999999;
		font-size: 1rem;
		pointer-events: none;
	}

	/* ── Start Now button ── */
	.start-btn {
		width: 100%;
		padding: 16px;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 800;
		font-family: var(--font-main);
		border: none;
		cursor: pointer;
		min-height: 52px;
		margin-top: 24px;
		transition: opacity 0.15s, transform 0.1s;
		letter-spacing: 0.02em;
	}

	.start-btn-active {
		background: var(--color-primary);
		color: #ffffff;
	}

	.start-btn-active:active {
		transform: scale(0.98);
		opacity: 0.9;
	}

	.start-btn-disabled {
		background: #e8e8e8;
		color: #bbbbbb;
		cursor: not-allowed;
	}

	/* ── Past Kocos ── */
	.past-kocos {
		background: #ffffff;
		border-radius: 12px;
		padding: 20px;
		margin-top: 28px;
		border: 1.5px solid #eeeeee;
	}

	.past-kocos-title {
		font-size: 1rem;
		font-weight: 800;
		color: #333333;
		margin-bottom: 12px;
		text-align: center;
	}

	.past-kocos-empty {
		font-size: 0.875rem;
		color: #999999;
		text-align: center;
		padding: 8px 0;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.history-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		border-radius: 10px;
		background: #f7f7f7;
		border: 1px solid #eeeeee;
	}

	.history-info {
		flex: 1;
	}

	.history-subject {
		font-size: 0.875rem;
		font-weight: 700;
		color: #333333;
	}

	.history-meta {
		font-size: 0.75rem;
		color: #999999;
		margin-top: 2px;
	}

	.history-score-col {
		text-align: right;
		flex-shrink: 0;
		margin-left: 12px;
	}

	.history-score {
		font-size: 1rem;
		font-weight: 800;
		color: #333333;
	}

	.history-pct {
		font-size: 0.75rem;
		color: #777777;
	}

	.retry-btn {
		font-size: 0.75rem;
		font-weight: 700;
		font-family: var(--font-main);
		color: var(--color-primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin-top: 4px;
		display: block;
	}

	.retry-btn:hover {
		text-decoration: underline;
	}

	.show-more-btn {
		display: block;
		width: fit-content;
		margin: 12px auto 0;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		font-family: var(--font-main);
		color: #ff0094;
		padding: 4px 8px;
	}

	.show-more-btn:hover {
		text-decoration: underline;
	}
</style>
