<script lang="ts">
import { type Crumb, SITE, breadcrumbSchema, jsonLd } from "$lib/breadcrumbs.js";
import RoadMap from "$lib/components/Map.svelte";
import RuleGold from "$lib/components/RuleGold.svelte";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteMasthead from "$lib/components/SiteMasthead.svelte";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { region, storyKeys, note, extra, segments, others } = $derived(data);

const canonical = $derived(`${SITE}/roads/${region.slug}`);
const title = $derived(`Roman Roads in ${region.name}: Map and Guide`);
const description = $derived(
	`${region.segmentCount.toLocaleString("en-GB")} mapped Roman road segments in ${region.name}${
		region.lengthKm ? `, some ${region.lengthKm.toLocaleString("en-GB")} km of surveyed line` : ""
	}. See the network on a map and find out if you are standing on one.`,
);
const crumbs: Crumb[] = $derived([
	{ name: "Is this a Roman road?", href: "/" },
	{ name: "The roads", href: "/roads" },
	{ name: region.name },
]);

// The dataset's certainty classes as a readable phrase, commonest first.
const certaintySummary = $derived(
	region.certainty
		.map((c) => `${c.label.toLowerCase()} ${c.count.toLocaleString("en-GB")}`)
		.join(", "),
);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="{SITE}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{SITE}/og.png" />
	{@html `<script type="application/ld+json">${jsonLd([breadcrumbSchema(crumbs)])}</` + `script>`}
</svelte:head>

<main>
	<SiteMasthead {crumbs} />

	<article>
		<h1>Roman roads in {region.name}</h1>
		<RuleGold animated />

		{#if note}
			<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
			<div class="prose lead">{@html `<p>${note}</p>`}</div>
		{/if}
		{#if extra}
			<h2 class="section">What to see</h2>
			<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
			<div class="prose">{@html `<p>${extra}</p>`}</div>
		{/if}

		<div class="map-frame">
			<RoadMap
				userPoint={null}
				roadSegments={segments}
				matchedRoadKey={null}
				pointOnRoad={null}
				maxZoom={9}
			/>
		</div>

		<dl class="facts">
			<div>
				<dt>Mapped segments</dt>
				<dd>{region.segmentCount.toLocaleString("en-GB")}</dd>
			</div>
			{#if region.lengthKm !== null}
				<div>
					<dt>Surveyed length</dt>
					<dd>{region.lengthKm.toLocaleString("en-GB")} km</dd>
				</div>
			{/if}
			{#if region.namedRoads.length > 0}
				<div>
					<dt>Named roads</dt>
					<dd>{region.namedRoads.length}</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			Measured from the <em>Itiner-e</em> survey. Segments by certainty of line:
			{certaintySummary}. A conjectured line is one inferred from evidence either side of it, not
			a road whose existence is doubted.
		</p>

		{#if region.namedRoads.length > 0}
			<h2 class="section">Named roads in {region.name}</h2>
			<p class="prose">
				Roads the survey identifies by name here, with the length mapped within
				{region.name}'s modern borders. Most ran further.
			</p>
			<ul class="named" role="list">
				{#each region.namedRoads as road (road.name)}
					<li>
						{#if storyKeys[road.name]}
							<a class="named-name" href="/road/{storyKeys[road.name]}">{road.name}</a>
						{:else}
							<span class="named-name">{road.name}</span>
						{/if}
						<span class="named-stat">
							{#if road.lengthKm}{road.lengthKm} km{:else}{road.segmentCount} segments{/if}
						</span>
					</li>
				{/each}
			</ul>
		{/if}

		{#if region.types.length > 0}
			<h2 class="section">What kind of roads</h2>
			<ul class="types" role="list">
				{#each region.types as t (t.label)}
					<li>
						<span class="type-label">{t.label}</span>
						<span class="type-count">{t.count.toLocaleString("en-GB")} segments</span>
					</li>
				{/each}
			</ul>
		{/if}

		<a class="cta" href="/">Am I standing on one?</a>

		<nav class="others" aria-labelledby="others-title">
			<h2 class="section" id="others-title">Elsewhere in the empire</h2>
			<ul role="list">
				<li><a href="/roads">Britain</a></li>
				{#each others as o (o.slug)}
					<li><a href="/roads/{o.slug}">{o.name}</a></li>
				{/each}
			</ul>
			<p class="all"><a href="/roads">Every country in the survey →</a></p>
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
		margin: 1rem 0 0;
	}
	.prose.lead {
		margin-top: clamp(1.5rem, 4vh, 2rem);
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

	.named {
		list-style: none;
		margin: 1.1rem 0 0;
		padding: 0;
		max-width: 62ch;
		border-top: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	.named li {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
	}
	.named-name {
		font-family: var(--font-display);
		font-style: italic;
		font-variant-caps: small-caps;
		font-weight: 500;
		font-size: 1.15rem;
		letter-spacing: 0.04em;
		color: var(--ink);
	}
	/* Roads with a history page. A deliberate exception to the gold link
	   underline in app.css: these are Roman names, which already carry gold,
	   so terracotta is what marks them as links. The negative margin keeps a
	   44px target without changing the row height. */
	a.named-name {
		display: inline-block;
		text-decoration: underline 1px var(--brand);
		text-underline-offset: 0.2em;
		min-block-size: 44px;
		padding-block: 0.7rem;
		margin-block: -0.7rem;
		transition: color 200ms var(--ease);
	}
	a.named-name:hover {
		color: var(--brand);
	}
	.named-stat {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 500;
		font-size: 0.98rem;
		letter-spacing: 0.01em;
		color: var(--ink-soft);
		white-space: nowrap;
		font-feature-settings: "onum";
	}

	.types {
		list-style: none;
		margin: 1.1rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.types li {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.5rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--gold) 45%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 6%, transparent);
		font-family: var(--font-display);
		font-size: 1rem;
		color: var(--ink);
	}
	.type-count {
		font-family: var(--font-body);
		font-size: 0.72rem;
		color: var(--ink-soft);
		font-feature-settings: "onum";
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
