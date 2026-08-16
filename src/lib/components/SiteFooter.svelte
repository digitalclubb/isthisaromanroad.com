<script lang="ts">
/**
 * The one footer. Previously copy-pasted into three routes, which is how the
 * homepage ended up with a padded 44px link and the road page with a 14px one.
 * `current` suppresses the self-link for whichever page is rendering it.
 */
type Props = { current?: "home" | "roads" | "road" };
let { current = "road" }: Props = $props();
</script>

<footer>
	<span class="edition">Editio · II</span>
	<span class="sep" aria-hidden="true">·</span>
	{#if current === "roads"}
		<span class="link">The roads</span>
	{:else}
		<a class="link" href="/roads">The roads</a>
	{/if}
	<span class="sep" aria-hidden="true">·</span>
	{#if current === "home"}
		<span class="link">isthisaromanroad.com</span>
	{:else}
		<a class="link" href="/">isthisaromanroad.com</a>
	{/if}
</footer>

<style>
	footer {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.7rem;
		padding: clamp(1.2rem, 5vh, 2rem) 0 max(env(safe-area-inset-bottom), 1rem);
		font-family: var(--font-body);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--ink-soft);
	}
	.edition {
		font-variant-numeric: oldstyle-nums;
	}
	.sep {
		color: var(--gold);
	}
	a.link {
		color: inherit;
		text-decoration: none;
		position: relative;
		transition: color 200ms var(--ease);
	}
	/* The footer type is 0.72rem, so the text box is ~14px tall. Expanding the
	   hit area with a pseudo-element clears the project's 44px floor without
	   padding the link and stretching the footer. The 0.7rem gap between items
	   means the ±6px horizontal spread can't overlap the neighbouring link. */
	a.link::after {
		content: "";
		position: absolute;
		inset: -15px -6px;
	}
	a.link:hover {
		color: var(--ink);
	}
</style>
