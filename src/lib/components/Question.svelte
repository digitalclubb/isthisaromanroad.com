<script lang="ts">
import RuleGold from "./RuleGold.svelte";
import Wordmark from "./Wordmark.svelte";

type Props = {
	onAsk: () => void;
	onSearch: (q: string) => void;
	disabled?: boolean;
};
let { onAsk, onSearch, disabled = false }: Props = $props();

let showSearch = $state(false);
let query = $state("");
let searchEl: HTMLInputElement | undefined = $state();

$effect(() => {
	if (showSearch && searchEl) {
		queueMicrotask(() => searchEl?.focus());
	}
});

function submit(e: SubmitEvent) {
	e.preventDefault();
	const q = query.trim();
	if (q) onSearch(q);
}

function toggleSearch() {
	// Keep `query` across toggles so a user typing → switching to location →
	// switching back doesn't lose what they typed.
	showSearch = !showSearch;
}
</script>

<div class="question">
	<Wordmark />
	<RuleGold animated />
	<p class="tag">A small oracle for the road ahead.</p>

	{#if !showSearch}
		<button class="ask" type="button" onclick={onAsk} {disabled} aria-label="Use my location to find the nearest Roman road">
			Ask the road
		</button>
		<button class="text-link" type="button" onclick={toggleSearch}>
			or search a place
		</button>
	{:else}
		<form class="search" onsubmit={submit}>
			<input
				bind:this={searchEl}
				bind:value={query}
				type="search"
				placeholder="town, postcode…"
				autocomplete="off"
				autocapitalize="words"
				enterkeyhint="search"
				aria-label="Search by town or postcode"
			/>
			<button class="search-go" type="submit" disabled={disabled || !query.trim()}>
				Ask
			</button>
		</form>
		<button class="text-link" type="button" onclick={toggleSearch}>
			or use my location
		</button>
	{/if}
</div>

<style>
	.question {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.4rem;
		text-align: center;
		animation: fadeUp 600ms var(--ease-out) both;
	}
	.tag {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1rem, 3vw, 1.15rem);
		color: var(--ink-soft);
		margin: -0.4rem 0 0.3rem;
		max-width: 28ch;
		line-height: 1.4;
	}
	.ask {
		min-width: 240px;
		padding: 1.05rem 2rem;
		background: var(--brand);
		color: var(--bg);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.45rem;
		letter-spacing: 0.01em;
		border-radius: 999px;
		transition: background 220ms var(--ease), transform 80ms ease,
			box-shadow 220ms var(--ease);
		box-shadow: 0 1px 2px rgb(31 22 14 / 0.12),
			0 14px 30px -14px var(--brand-deep);
	}
	.ask:hover:not(:disabled) {
		background: var(--brand-deep);
		box-shadow: 0 1px 2px rgb(31 22 14 / 0.15),
			0 18px 36px -14px var(--brand-deep);
	}
	.ask:active:not(:disabled) {
		transform: scale(0.98);
	}
	.ask:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.text-link {
		/* Expands the tap target to meet WCAG 2.2 SC 2.5.8 (24px AA) with
		   headroom toward AAA (44px), without changing the apparent baseline.
		   The inline-flex centring is necessary — min-height alone leaves
		   the text near the top of the 44px box. */
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0.4rem 0.5rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--ink-soft);
		text-decoration: underline;
		text-decoration-color: var(--gold);
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
		border-radius: 4px;
	}
	.text-link:hover {
		color: var(--ink);
	}

	.search {
		display: flex;
		gap: 0.5rem;
		width: min(380px, 100%);
		animation: fadeUp 280ms var(--ease-out) both;
	}
	.search input {
		flex: 1;
		min-width: 0;
		padding: 0.95rem 1.1rem;
		font: inherit;
		font-size: 1.05rem;
		background: var(--surface);
		color: var(--ink);
		border: 1px solid var(--surface-deep);
		border-radius: 999px;
	}
	.search input::placeholder {
		color: var(--ink-soft);
	}
	.search-go {
		padding: 0.95rem 1.4rem;
		background: var(--brand);
		color: var(--bg);
		border-radius: 999px;
		font-weight: 500;
		font-family: var(--font-display);
		font-size: 1.05rem;
		transition: background 200ms var(--ease);
	}
	.search-go:hover:not(:disabled) {
		background: var(--brand-deep);
	}
	@media (prefers-color-scheme: dark) {
		.search-go:hover:not(:disabled) {
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 45%, transparent);
		}
	}
	.search-go:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
