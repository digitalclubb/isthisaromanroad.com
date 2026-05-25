<script lang="ts">
type Props = {
	onAskAgain: () => void;
};
let { onAskAgain }: Props = $props();
</script>

<div class="ask-again">
	<button class="again" type="button" onclick={onAskAgain}>
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M3 12a9 9 0 1 0 3-6.7" />
			<path d="M3 4v5h5" />
		</svg>
		<span>Ask again</span>
	</button>
</div>

<style>
	.ask-again {
		display: flex;
		justify-content: center;
		padding: clamp(1rem, 4vh, 2rem) 0 0;
	}
	.again {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 1.3rem;
		border-radius: 999px;
		background: var(--surface);
		color: var(--ink);
		border: 1px solid var(--surface-deep);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 500;
		transition: border-color 200ms var(--ease), transform 80ms ease;
	}
	.again:hover {
		border-color: var(--gold);
	}
	.again:active {
		transform: scale(0.98);
	}
	.again svg {
		color: var(--gold);
	}
</style>
