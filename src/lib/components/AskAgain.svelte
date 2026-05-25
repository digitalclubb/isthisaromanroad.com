<script lang="ts">
type Props = {
	onAskAgain: () => void;
	onShare?: () => void;
	onShareStory?: () => void;
	sharing?: boolean;
	shareDisabled?: boolean;
};
let { onAskAgain, onShare, onShareStory, sharing = false, shareDisabled = false }: Props = $props();
</script>

<div class="actions">
	{#if onShare}
		<button
			class="btn share"
			type="button"
			onclick={onShare}
			disabled={sharing || shareDisabled}
			aria-label={sharing ? "Sharing…" : "Share this answer as a landscape image"}
		>
			<svg
				viewBox="0 0 24 24"
				width="18"
				height="18"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
				<polyline points="16 6 12 2 8 6" />
				<line x1="12" y1="2" x2="12" y2="15" />
			</svg>
			<span>{sharing ? "Sharing…" : "Share"}</span>
		</button>
	{/if}
	{#if onShareStory}
		<button
			class="btn"
			type="button"
			onclick={onShareStory}
			disabled={sharing || shareDisabled}
			aria-label="Share this answer as a portrait image for Instagram or TikTok"
		>
			<svg
				viewBox="0 0 24 24"
				width="18"
				height="18"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="7" y="3" width="10" height="18" rx="2" />
				<line x1="11" y1="18" x2="13" y2="18" />
			</svg>
			<span>Story</span>
		</button>
	{/if}
	<button class="btn" type="button" onclick={onAskAgain}>
		<svg
			viewBox="0 0 24 24"
			width="18"
			height="18"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M3 12a9 9 0 1 0 3-6.7" />
			<path d="M3 4v5h5" />
		</svg>
		<span>Ask again</span>
	</button>
</div>

<style>
	.actions {
		display: flex;
		justify-content: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		padding: clamp(1rem, 4vh, 2rem) 0 0;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.15rem;
		border-radius: 999px;
		background: var(--surface);
		color: var(--ink);
		border: 1px solid var(--surface-deep);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 500;
		transition: border-color 200ms var(--ease), transform 80ms ease,
			background 200ms var(--ease);
		min-height: 44px;
	}
	.btn:hover:not(:disabled) {
		border-color: var(--gold);
	}
	.btn:active:not(:disabled) {
		transform: scale(0.98);
	}
	.btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
	.btn svg {
		color: var(--gold);
	}
	.share {
		background: var(--brand);
		color: var(--bg);
		border-color: var(--brand);
	}
	.share svg {
		color: var(--bg);
		opacity: 0.85;
	}
	.share:hover:not(:disabled) {
		background: var(--brand-deep);
		border-color: var(--brand-deep);
	}
</style>
