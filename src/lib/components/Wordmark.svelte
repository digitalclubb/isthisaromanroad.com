<script lang="ts">
type Props = { minimised?: boolean };
let { minimised = false }: Props = $props();
</script>

<h1 class="wordmark" class:minimised>Is this a Roman road?</h1>

<style>
	/* font-size animation is layout-affecting, but one-shot per phase change.
	   contain: layout limits the heading's internal layout work — the grid
	   row above still resizes; reduced-motion snaps the whole thing. */
	.wordmark {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.7rem, 5vw, 2.4rem);
		line-height: 1.1;
		margin: 0;
		color: var(--ink);
		letter-spacing: -0.015em;
		contain: layout;
		transition: font-size 280ms var(--ease), opacity 280ms var(--ease);
	}
	.wordmark.minimised {
		font-size: 0.78rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
	}
</style>
