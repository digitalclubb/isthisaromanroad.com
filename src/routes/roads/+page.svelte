<script lang="ts">
import { type Crumb, SITE, breadcrumbSchema, jsonLd } from "$lib/breadcrumbs.js";
import RuleGold from "$lib/components/RuleGold.svelte";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteMasthead from "$lib/components/SiteMasthead.svelte";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { roads, regions, counties, mappedRoadCount, mappedKm } = $derived(data);

const TITLE = "Roman Roads of Britain: Map and List of Every Named Road";
const DESCRIPTION =
	"Watling Street, the Fosse Way, Ermine Street, Dere Street and every other named Roman road in Britain. Route, length and history for each, with a map.";
const CANONICAL = `${SITE}/roads`;

const crumbs: Crumb[] = [{ name: "Is this a Roman road?", href: "/" }, { name: "The roads" }];
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
			name: "Roman roads of Britain",
			numberOfItems: roads.length,
			itemListElement: roads.map((r, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: r.name,
				url: `${SITE}/road/${r.key}`,
			})),
		},
	])}</` + `script>`}
</svelte:head>

<main>
	<SiteMasthead {crumbs} />

	<article>
		<h1>The roads</h1>
		<RuleGold animated />

		<p class="standfirst">
			These are the named Roman roads of Britain. Most are trunk routes laid out by military
			surveyors in the century after the invasion of AD 43; a couple, like the Icknield Way, are
			older tracks the Romans merely surfaced, and one is the service road that ran behind
			Hadrian's Wall.
		</p>
		<p class="standfirst">
			The <em>Itiner-e</em> survey maps {mappedRoadCount === roads.length ? "every one" : mappedRoadCount}
			of them, accounting for roughly {mappedKm.toLocaleString("en-GB")} kilometres of measured line.
			{#if mappedRoadCount < roads.length}
				The rest are well attested by archaeology but carry no line in the dataset, so no figures
				are shown for them.
			{/if}
		</p>

		<ol class="roads" role="list">
			{#each roads as road (road.key)}
				<li>
					<h2 class="name"><a href="/road/{road.key}">{road.name}</a></h2>
					{#if road.from && road.to}
						<p class="route">
							<em class="roman">{road.from}</em>
							to
							<em class="roman">{road.to}</em>
						</p>
					{/if}
					<p class="teaser">{road.teaser}</p>
					<p class="stats">
						{#if road.lengthKm !== null}
							{road.lengthKm} km mapped
							<span class="sep" aria-hidden="true">·</span>
							{road.segmentCount}
							{road.segmentCount === 1 ? "segment" : "segments"}
						{:else}
							Not named in the <em>Itiner-e</em> survey
						{/if}
					</p>
				</li>
			{/each}
		</ol>

		<a class="cta" href="/">Am I on one right now?</a>

		<section aria-labelledby="counties-title">
			<h2 class="section" id="counties-title">By county</h2>
			<p class="prose">
				Where the roads run, county by county, with the named routes that cross each one, what
				survives on the ground and where to go and look. There is also a guide to
				<a href="/modern-roads">which modern roads follow Roman lines</a>, from the A5 to the
				B2068.
			</p>
			<ul class="countries" role="list">
				{#each counties as c (c.slug)}
					<li><a href="/roads/britain/{c.slug}">{c.name}</a></li>
				{/each}
			</ul>
			<p class="all"><a href="/roads/britain">Every county, with figures →</a></p>
		</section>

		<section class="empire" aria-labelledby="empire-title">
			<h2 class="section" id="empire-title">Elsewhere in the empire</h2>
			<p class="prose">
				The survey covers the whole Roman world, not just Britain. These are the modern countries
				with mapped Roman road, largest network first.
			</p>
			<ul class="countries" role="list">
				{#each regions as r (r.slug)}
					<li><a href="/roads/{r.slug}">{r.name}</a></li>
				{/each}
			</ul>
		</section>
	</article>

	<SiteFooter current="roads" />
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

	h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(3rem, 12vw, 6rem);
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
	.standfirst + .standfirst {
		margin-top: 1rem;
	}
	.standfirst em {
		font-style: italic;
	}

	.roads {
		list-style: none;
		margin: clamp(2rem, 6vh, 3rem) 0 0;
		padding: 0;
	}
	.roads li {
		position: relative;
		padding: clamp(1.1rem, 3vh, 1.5rem) 0.5rem;
		margin: 0 -0.5rem;
		border-radius: 6px;
		transition: background 200ms var(--ease);
	}
	/* A hairline in --surface-deep sits at 1.15:1 on the page background and is
	   effectively invisible in the canonical light mode. Gold at low alpha
	   reads as a rule without shouting. */
	.roads li + li {
		border-top: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	.roads li:hover {
		background: color-mix(in srgb, var(--gold) 7%, transparent);
	}

	.name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.5rem, 4.5vw, 1.9rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--ink);
		margin: 0;
	}
	.name a {
		color: inherit;
		text-decoration: none;
	}
	/* Stretched link: the accessible name stays just the road name, while the
	   whole row remains tappable. Wrapping the entire row in one anchor gave
	   each of the 22 links a ~40-word accessible name. */
	.name a::after {
		content: "";
		position: absolute;
		inset: 0;
	}
	.roads li:hover .name a {
		color: var(--brand);
	}

	.route {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1rem;
		color: var(--ink-soft);
		margin: 0.4rem 0 0;
	}

	.teaser {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--ink);
		margin: 0.6rem 0 0;
		max-width: 62ch;
	}

	.stats {
		font-family: var(--font-body);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
		margin: 0.7rem 0 0;
		font-feature-settings: "onum";
	}
	.stats .sep {
		color: var(--gold);
	}
	.stats em {
		font-style: italic;
		text-transform: none;
		letter-spacing: 0.06em;
	}

	.section {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.35rem, 3.6vw, 1.65rem);
		line-height: 1.15;
		letter-spacing: -0.015em;
		color: var(--ink);
		margin: clamp(2.5rem, 6vh, 3.25rem) 0 0;
	}
	.prose {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.05rem, 2.8vw, 1.15rem);
		line-height: 1.6;
		color: var(--ink);
		max-width: 62ch;
		margin: 0.9rem 0 0;
	}
	.countries {
		list-style: none;
		margin: 1.1rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.5rem;
	}
	.countries a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.5rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--gold) 45%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 6%, transparent);
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1rem;
		text-decoration: none;
		transition: border-color 200ms var(--ease), color 200ms var(--ease);
	}
	.countries a:hover {
		border-color: var(--gold);
		color: var(--brand);
	}
	.prose a,
	.all a {
		color: var(--brand);
		text-decoration: none;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
	}
	.prose a:hover,
	.all a:hover {
		color: var(--brand-deep);
	}
	.all {
		margin: 1.1rem 0 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
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
	.cta:active {
		transform: scale(0.98);
	}
	@media (prefers-color-scheme: dark) {
		.cta {
			background: var(--brand-deep);
		}
		.cta:hover {
			background: var(--brand);
		}
	}

	article {
		animation: fadeUp 600ms var(--ease-out) both;
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
