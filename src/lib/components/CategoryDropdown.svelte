<script>
	let isOpen = $state(false);
	let selectedValue = $state('');

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

	export let value = '';
	export let onChange = (val) => {};

	$effect(() => {
		selectedValue = value;
	});

	function handleSelect(key) {
		selectedValue = key;
		value = key;
		onChange(key);
		isOpen = false;
	}

	function handleClickOutside(e) {
		if (!e.target.closest('.custom-dropdown')) {
			isOpen = false;
		}
	}

	const selectedLabel = categoryOptions.find(opt => opt.key === selectedValue)?.label || 'Pick one or mix it up!';
</script>

<svelte:window onmousedown={handleClickOutside} />

<div class="custom-dropdown">
	<button
		class="dropdown-trigger"
		onclick={() => (isOpen = !isOpen)}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span class="dropdown-text">{selectedLabel}</span>
		<span class="dropdown-chevron" class:open={isOpen}>▾</span>
	</button>

	{#if isOpen}
		<div class="dropdown-menu" role="listbox">
			{#each categoryOptions as option, index}
				<button
					class="dropdown-option"
					onclick={() => handleSelect(option.key)}
					role="option"
					aria-selected={selectedValue === option.key}
				>
					<span class="option-icon">{option.icon}</span>
					<span class="option-label">{option.label}</span>
				</button>
				{#if index < categoryOptions.length - 1}
					<div class="option-separator"></div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.custom-dropdown {
		position: relative;
		width: 100%;
	}

	.dropdown-trigger {
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
		color: #333333;
		cursor: pointer;
		min-height: 52px;
		transition: border-color 0.15s, background-color 0.15s;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: left;
	}

	.dropdown-trigger:hover {
		border-color: #f9a8d4;
	}

	.dropdown-trigger:focus {
		outline: none;
		border-color: var(--color-primary);
		background: #fce7f3;
	}

	.dropdown-text {
		flex: 1;
	}

	.dropdown-chevron {
		margin-left: 8px;
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.dropdown-chevron.open {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: #ffffff;
		border: 1.5px solid #fbcfe8;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 100;
		overflow: hidden;
		max-height: 320px;
		overflow-y: auto;
	}

	.dropdown-option {
		width: 100%;
		padding: 12px 16px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 700;
		font-family: var(--font-main);
		color: #333333;
		text-align: left;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background-color 0.15s;
	}

	.dropdown-option:hover {
		background-color: #fce7f3;
	}

	.dropdown-option[aria-selected="true"] {
		background-color: #fce7f3;
		color: var(--color-primary);
	}

	.option-icon {
		flex-shrink: 0;
		font-size: 1.1rem;
	}

	.option-label {
		flex: 1;
	}

	.option-separator {
		height: 1px;
		background: #fbcfe8;
		margin: 0;
	}
</style>
