<script lang="ts">
/**
 * The one footer. Previously copy-pasted into three routes, which is how the
 * homepage ended up with a padded 44px link and the road page with a 14px one.
 * `current` suppresses the self-link for whichever page is rendering it.
 */
type Props = { current?: "home" | "roads" | "road" };
let { current = "road" }: Props = $props();

const KOFI = "https://ko-fi.com/digitalclubb";

// A plain link rather than Ko-fi's embedded widget, which sets third-party
// cookies the privacy copy promises aren't here. The click is counted
// first-party so the ask can be judged on its numbers. `track` is
// dynamic-imported to keep @vercel/analytics out of the initial bundle,
// matching how +layout.svelte loads it — by click time the chunk is cached.
async function countSupportClick() {
	const { track } = await import("@vercel/analytics");
	track("support_click", { placement: "footer" });
}
</script>

<footer>
	<!-- The `&nbsp;` opening the hidden span is deliberate: Svelte trims the
	     leading whitespace inside it, and the accessible name would otherwise
	     flatten to "Buy me a coffee(opens in a new tab)". -->
	<p class="support">
		Free to use, with no adverts.
		<a
			class="ask"
			href={KOFI}
			target="_blank"
			rel="external noopener"
			onclick={countSupportClick}
			>Buy me a coffee<span class="sr-only">&nbsp;(opens in a new tab)</span></a
		> if it helped.
	</p>

	<div class="meta">
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
	</div>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* Must exceed the 12px vertical spread of .ask::after below, so the
		   enlarged coffee-link hit area can't reach into the meta row's links. */
		gap: 1.1rem;
		/* Horizontal padding matters when the footer is a body-level child rather
		   than nested inside a padded <main>, as it is on the homepage. */
		padding: clamp(1.2rem, 5vh, 2rem) clamp(1rem, 3vw, 1.75rem)
			max(env(safe-area-inset-bottom), 1rem);
		font-family: var(--font-body);
		color: var(--ink-soft);
	}

	/* The one place on the site that asks for anything. Set in the body face at
	   reading case — the meta row's uppercase tracking is a signature, and a
	   sentence shouted in small caps would read as a banner ad. */
	.support {
		margin: 0;
		max-width: 30rem;
		text-align: center;
		font-size: 0.82rem;
		/* 1.75 gives a ~22px line box; with ::after's ±12px the coffee link
		   clears the project's 44px floor without padding the paragraph. */
		line-height: 1.75;
	}
	.ask {
		color: var(--brand);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
		position: relative;
		transition: color 200ms var(--ease);
	}
	.ask::after {
		content: "";
		position: absolute;
		inset: -12px -6px;
	}
	.ask:hover {
		color: var(--brand-deep);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.7rem;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
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
