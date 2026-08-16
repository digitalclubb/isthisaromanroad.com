<script lang="ts">
import { type Crumb, SITE, breadcrumbSchema, jsonLd } from "$lib/breadcrumbs.js";
import RoadMap from "$lib/components/Map.svelte";
import RuleGold from "$lib/components/RuleGold.svelte";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteMasthead from "$lib/components/SiteMasthead.svelte";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { county, segments, roads, others } = $derived(data);

const canonical = $derived(`${SITE}/roads/britain/${county.slug}`);
const title = $derived(`Roman Roads in ${county.name}: Map and Guide`);
const description = $derived(
	`${county.segmentCount} mapped Roman road segments in ${county.name}${
		county.lengthKm ? `, some ${county.lengthKm} km of surveyed line` : ""
	}. See them on a map, read about the named roads that cross the county, and find out if you are standing on one.`,
);
const ogImage = $derived(`${SITE}/og/county-${county.slug}.png`);
const crumbs: Crumb[] = $derived([
	{ name: "Is this a Roman road?", href: "/" },
	{ name: "The roads", href: "/roads" },
	{ name: "By county", href: "/roads/britain" },
	{ name: county.name },
]);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	{@html `<script type="application/ld+json">${jsonLd([breadcrumbSchema(crumbs)])}</` + `script>`}
</svelte:head>

<main>
	<SiteMasthead {crumbs} />

	<article>
		<h1>Roman roads in {county.name}</h1>
		<RuleGold animated />

		<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
		<div class="prose lead">{@html `<p>${county.note}</p>`}</div>

		<div class="map-frame">
			<RoadMap
				userPoint={null}
				roadSegments={segments}
				matchedRoadKey={null}
				pointOnRoad={null}
				maxZoom={11}
			/>
		</div>

		<dl class="facts">
			<div>
				<dt>Mapped segments</dt>
				<dd>{county.segmentCount.toLocaleString("en-GB")}</dd>
			</div>
			{#if county.lengthKm !== null}
				<div>
					<dt>Surveyed length</dt>
					<dd>{county.lengthKm.toLocaleString("en-GB")} km</dd>
				</div>
			{/if}
			<div>
				<dt>Named roads</dt>
				<dd>{roads.length}</dd>
			</div>
		</dl>
		<p class="note">
			Measured from the <em>Itiner-e</em> survey within the modern county boundary, which for
			Yorkshire, Cheshire and the other counties broken up in 1974 means the traditional area
			reassembled from its present-day parts. The survey maps far more road than it attributes
			to a named route, so the segment count counts everything, and the named roads below are
			only those with a history recorded here.
		</p>

		<h2 class="section">Where to see it</h2>
		<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
		<div class="prose">{@html `<p>${county.seeing}</p>`}</div>

		<h2 class="section">Named roads through {county.name}</h2>
		<ul class="roads" role="list">
			{#each roads as road (road.key)}
				<li>
					<h3 class="road-name"><a href="/road/{road.key}">{road.name}</a></h3>
					{#if road.from && road.to}
						<p class="road-route">
							<em class="roman">{road.from}</em> to <em class="roman">{road.to}</em>
						</p>
					{/if}
				</li>
			{/each}
		</ul>

		<a class="cta" href="/">Am I standing on one?</a>

		<nav class="others" aria-labelledby="others-title">
			<h2 class="section" id="others-title">Other counties</h2>
			<ul role="list">
				{#each others as o (o.slug)}
					<li><a href="/roads/britain/{o.slug}">{o.name}</a></li>
				{/each}
			</ul>
			<p class="all"><a href="/roads">All the Roman roads of Britain →</a></p>
		</nav>
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
		font-size: clamp(2.4rem, 9vw, 4.2rem);
		line-height: 1;
		letter-spacing: -0.035em;
		color: var(--ink);
		margin: clamp(1rem, 3vh, 1.5rem) 0 0.7rem;
	}

	.section {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(1.35rem, 3.6vw, 1.65rem);
		line-height: 1.15;
		letter-spacing: -0.015em;
		color: var(--ink);
		margin: clamp(2rem, 5vh, 2.75rem) 0 0;
	}

	.prose {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.05rem, 2.8vw, 1.2rem);
		line-height: 1.65;
		color: var(--ink);
		max-width: 62ch;
		margin: clamp(1.5rem, 4vh, 2rem) 0 0;
	}
	.prose :global(p) {
		margin: 0;
	}
	.prose :global(em) {
		font-style: italic;
	}

	.map-frame {
		margin-top: clamp(1.5rem, 4vh, 2rem);
		height: clamp(320px, 50vh, 520px);
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow);
		border: 1px solid var(--surface-deep);
		background: var(--surface);
	}

	.facts {
		margin: clamp(1.25rem, 3vh, 1.6rem) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1px;
		background: color-mix(in srgb, var(--gold) 38%, transparent);
		border: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.facts > div {
		background: var(--surface);
		padding: 0.9rem 1rem;
	}
	.facts dt {
		font-family: var(--font-body);
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-soft);
	}
	.facts dd {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.45rem;
		color: var(--ink);
		margin: 0.25rem 0 0;
		font-feature-settings: "onum";
	}

	.note {
		font-family: var(--font-body);
		font-size: 0.8rem;
		line-height: 1.55;
		color: var(--ink-soft);
		margin: 0.8rem 0 0;
		max-width: 62ch;
	}
	.note em {
		font-style: italic;
	}

	.roads {
		list-style: none;
		margin: 1.1rem 0 0;
		padding: 0;
		max-width: 62ch;
	}
	.roads li {
		padding: 0.85rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	.roads li:first-child {
		border-top: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	.road-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.3rem;
		line-height: 1.15;
		margin: 0;
	}
	.road-name a {
		color: var(--ink);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
	.road-name a:hover {
		color: var(--brand);
	}
	.road-route {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1rem;
		color: var(--ink-soft);
		margin: 0;
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

	.others ul {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.5rem;
	}
	.others li a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.5rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--gold) 70%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 10%, transparent);
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1rem;
		text-decoration: none;
		transition: border-color 200ms var(--ease), color 200ms var(--ease);
	}
	.others li a:hover {
		border-color: var(--gold);
		color: var(--brand);
	}
	.others .all {
		margin: 1.1rem 0 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
	}
	.others .all a {
		color: var(--brand);
		text-decoration: none;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
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
