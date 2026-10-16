<script lang="ts">
import { type Crumb, SITE, breadcrumbSchema, jsonLd } from "$lib/breadcrumbs.js";
import RuleGold from "$lib/components/RuleGold.svelte";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteMasthead from "$lib/components/SiteMasthead.svelte";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { counties, totalSegments } = $derived(data);

// Distinct from /roads, which owns "Roman roads in Britain"; the two titles
// used to compete and this page ranked around position 70 for its parent's queries.
const TITLE = "Roman Roads by County: Kent to Cumbria";
const DESCRIPTION =
	"Where the Roman roads run, county by county: Kent, Yorkshire, Hertfordshire, Cumbria, Norfolk and more, each with a map, the named roads that cross it and what survives to see.";
const CANONICAL = `${SITE}/roads/britain`;

const crumbs: Crumb[] = [
	{ name: "Is this a Roman road?", href: "/" },
	{ name: "The roads", href: "/roads" },
	{ name: "By county" },
];
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={CANONICAL} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={CANONICAL} />
	<meta property="og:image" content="{SITE}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{SITE}/og.png" />
	{@html `<script type="application/ld+json">${jsonLd([
		breadcrumbSchema(crumbs),
		{
			"@context": "https://schema.org",
			"@type": "ItemList",
			name: "Roman roads in Britain by county",
			numberOfItems: counties.length,
			itemListElement: counties.map((c, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: c.name,
				url: `${SITE}/roads/britain/${c.slug}`,
			})),
		},
	])}</` + `script>`}
</svelte:head>

<main>
	<SiteMasthead {crumbs} />

	<article>
		<h1>By county</h1>
		<RuleGold animated />

		<p class="standfirst">
			The Roman road network of Britain, broken down by the county it runs through. These
			{counties.length} counties hold {totalSegments.toLocaleString("en-GB")} mapped segments between
			them, and each page gives the roads that cross it, what survives on the ground and where to
			go and look.
		</p>

		<ul class="counties" role="list">
			{#each counties as c (c.slug)}
				<li>
					<h2 class="name"><a href="/roads/britain/{c.slug}">{c.name}</a></h2>
					<p class="stats">
						{c.segmentCount} segments
						{#if c.lengthKm !== null}
							<span class="sep" aria-hidden="true">·</span>
							{c.lengthKm.toLocaleString("en-GB")} km
						{/if}
						<span class="sep" aria-hidden="true">·</span>
						{c.roadCount}
						{c.roadCount === 1 ? "named road" : "named roads"}
					</p>
				</li>
			{/each}
		</ul>

		<a class="cta" href="/">Am I on one right now?</a>
	</article>

	<SiteFooter />
</main>

<style>
	main {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding: clamp(1rem, 3vw, 1.75rem);
		max-width: 760px;
		margin: 0 auto;
	}

	article {
		animation: fadeUp 600ms var(--ease-out) both;
	}

	h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(3rem, 12vw, 5rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: var(--ink);
		margin: clamp(1rem, 3vh, 1.5rem) 0 0.7rem;
	}

	.standfirst {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.05rem, 2.8vw, 1.2rem);
		line-height: 1.6;
		color: var(--ink);
		max-width: 62ch;
		margin: clamp(1.5rem, 4vh, 2rem) 0 0;
		font-feature-settings: "onum";
	}

	.counties {
		list-style: none;
		margin: clamp(2rem, 6vh, 3rem) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 0;
	}
	.counties li {
		position: relative;
		padding: 0.9rem 0.5rem;
		margin: 0 -0.5rem;
		border-top: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
		border-radius: 6px;
		transition: background 200ms var(--ease);
	}
	.counties li:hover {
		background: color-mix(in srgb, var(--gold) 7%, transparent);
	}

	.name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.35rem;
		line-height: 1.15;
		letter-spacing: -0.015em;
		margin: 0;
	}
	.name a {
		color: var(--ink);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		min-height: 32px;
	}
	.name a::after {
		content: "";
		position: absolute;
		inset: 0;
	}
	.counties li:hover .name a {
		color: var(--brand);
	}

	.stats {
		font-family: var(--font-body);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		margin: 0.25rem 0 0;
		font-feature-settings: "onum";
	}
	.stats .sep {
		color: var(--gold);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		margin-top: clamp(2rem, 5vh, 2.75rem);
		padding: 0.9rem 1.6rem;
		border-radius: 999px;
		background: var(--brand);
		color: var(--bg);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.2rem;
		text-decoration: none;
		min-height: 44px;
		box-shadow: 0 1px 2px rgb(31 22 14 / 0.12), 0 14px 30px -14px var(--brand-deep);
		transition: background 220ms var(--ease), transform 80ms ease;
	}
	.cta:hover {
		background: var(--brand-deep);
		color: var(--bg);
	}
	@media (prefers-color-scheme: dark) {
		.cta {
			background: var(--brand-deep);
		}
		.cta:hover {
			background: var(--brand);
		}
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
