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
// cookies. The click is counted first-party so the ask can be judged on its
// numbers. Imported from the /sveltekit entry, not ".", deliberately: that
// entry is self-contained and re-exports `track`, so this resolves to the
// same chunk +layout.svelte already dynamic-imports on mount. Importing "."
// instead builds a second 1 KB copy of `track` and costs a round-trip here.
// target="_blank" keeps the page alive, so the queue flush completes.
async function countSupportClick() {
	const { track } = await import("@vercel/analytics/sveltekit");
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
			onclick={() => {
				countSupportClick().catch(() => {});
			}}
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
		/* Both rows enlarge their hit areas with a pseudo-element, and the two
		   grow towards each other: .ask::after reaches ~11px below the support
		   paragraph, a.link::after a full 15px above .meta (whose line-height is
		   `normal`, so there's no half-leading to absorb it). Anything under
		   ~27px lets the meta links, later in the DOM, steal the bottom of the
		   coffee link's target. */
		gap: 1.9rem;
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
		line-height: 1.75;
	}
	/* Colour only — the global `a` rule already supplies the gold hairline
	   underline and the --brand-deep hover, and this link has no reason to
	   diverge from every other link on the site. */
	.ask {
		color: var(--brand);
		position: relative;
		/* An inline element that wraps gives its absolute children a containing
		   block spanning the union of first and last line — a full-width
		   two-line rectangle sitting over the rest of the sentence. Keeping the
		   phrase on one line keeps ::after a tidy box around the words. */
		white-space: nowrap;
	}
	/* The containing block here is the inline content area (~1.21em of Inter,
	   so ~16px at 0.82rem), NOT the line box — line-height buys nothing.
	   16 + 30 = 46px, clearing the project's 44px floor the same way a.link
	   below does at its own size. */
	.ask::after {
		content: "";
		position: absolute;
		inset: -15px -6px;
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
