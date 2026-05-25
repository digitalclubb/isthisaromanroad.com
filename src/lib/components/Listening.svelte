<script lang="ts">
type Props = { label?: string };
let { label = "Asking the road…" }: Props = $props();
</script>

<div class="listening" role="status" aria-live="polite">
	<span class="line">{label}</span>
</div>

<style>
	.listening {
		text-align: center;
		padding: clamp(2rem, 10vh, 5rem) 0;
	}
	.line {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.1rem, 3.6vw, 1.45rem);
		color: var(--ink-soft);
		animation: breathe 2.4s ease-in-out infinite;
	}
	@keyframes breathe {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}
	/* Reduced motion: the global reset would freeze us at opacity 0.5 (the
	   keyframe at 0%), which fails AA. Pin opacity to 1 explicitly. */
	@media (prefers-reduced-motion: reduce) {
		.line {
			opacity: 1;
		}
	}
</style>
