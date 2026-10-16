<script lang="ts">
import { type Crumb, SITE, breadcrumbSchema, jsonLd } from "$lib/breadcrumbs.js";
import FaqList from "$lib/components/FaqList.svelte";
import RoadMap from "$lib/components/Map.svelte";
import RuleGold from "$lib/components/RuleGold.svelte";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteMasthead from "$lib/components/SiteMasthead.svelte";
import { formatYear } from "$lib/geometry.js";
import { roadKey } from "$lib/roads.js";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { story, segments, siblings, detail, counties, lengthKm, segmentCount, certainty, dates } =
	$derived(data);
const matchedRoadKey = $derived(segments.length > 0 ? roadKey(segments[0]) || null : null);

// Hand-written per road: the story's opening sentence made a poor snippet
// (Stane Street sat at position 8 on 1,275 impressions for one click).
const description = $derived(story.summary);

const canonical = $derived(`${SITE}/road/${story.key}`);
// Per-road share card rendered by `pnpm icons:build`. Every road page used to
// share the one generic og.png, so every share looked identical in the feed.
const ogImage = $derived(`${SITE}/og/road-${story.key}.png`);
const title = $derived(`${story.name}: Roman Road Map, ${story.route}`);
const crumbs: Crumb[] = $derived([
	{ name: "Is this a Roman road?", href: "/" },
	{ name: "The roads", href: "/roads" },
	{ name: story.name },
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
	{@html `<script type="application/ld+json">${jsonLd([
		breadcrumbSchema(crumbs),
		{
			"@context": "https://schema.org",
			// A road is a place, not an article. `LandmarksOrHistoricalBuildings`
			// is the closest schema.org type for a named historic route.
			"@type": "LandmarksOrHistoricalBuildings",
			name: story.name,
			description,
			url: canonical,
			isPartOf: {
				"@type": "WebSite",
				name: "Is this a Roman road?",
				url: `${SITE}/`,
			},
		},
		...(detail && detail.faq.length > 0
			? [
					{
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: detail.faq.map((f) => ({
							"@type": "Question",
							name: f.q,
							acceptedAnswer: { "@type": "Answer", text: f.a },
						})),
					},
				]
			: []),
	])}</` + `script>`}
</svelte:head>

<main>
	<SiteMasthead {crumbs} />

	<article class="road">
		<h1 class="word">{story.name}</h1>
		<RuleGold animated />
		{#if story.from && story.to}
			<p class="subtitle">
				<em class="roman">{story.from}</em>
				to
				<em class="roman">{story.to}</em>
			</p>
		{/if}

		<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
		<div class="body">{@html story.body}</div>

		{#if detail}
			<h2 class="section">The route</h2>
			<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
			<div class="body">{@html detail.route}</div>
		{/if}

		{#if segmentCount > 0}
			<h2 class="section">The surveyed line</h2>
			<div class="map-frame">
				<RoadMap
					userPoint={null}
					roadSegments={segments}
					{matchedRoadKey}
					pointOnRoad={null}
				/>
			</div>

			<dl class="facts">
				<div>
					<dt>Mapped length</dt>
					<dd>{lengthKm} km</dd>
				</div>
				<div>
					<dt>Mapped segments</dt>
					<dd>{segmentCount}</dd>
				</div>
				{#if certainty}
					<div>
						<dt>Line certainty</dt>
						<dd>{certainty.label}</dd>
					</div>
				{/if}
				{#if dates}
					<div>
						<dt>Dated to</dt>
						<dd>{formatYear(dates.from)} – {formatYear(dates.to)}</dd>
					</div>
				{/if}
			</dl>
			{#if certainty}
				<p class="facts-note">
					Measured across every <em>Itiner-e</em> segment attributed to this road.
					{#if certainty.label === "Certain"}
						A certain stretch is one whose course is fixed by excavated or visible remains;
						that covers {certainty.percent}% of the mapped length here.
					{:else if certainty.label === "Hypothetical"}
						A hypothetical stretch is one scholars propose but cannot yet demonstrate; that
						covers {certainty.percent}% of the mapped length here. The road's existence is not
						in doubt, only the line drawn for it.
					{:else}
						A conjectured stretch is one whose course is inferred from evidence either side of
						it; that covers {certainty.percent}% of the mapped length here. This describes how
						precisely the line is known, not whether the road existed.
					{/if}
				</p>
			{/if}
		{:else}
			<h2 class="section">The surveyed line</h2>
			<p class="facts-note standalone">
				The <em>Itiner-e</em> survey maps Roman roads across this part of the empire, but
				attributes no segment to {story.name} by name, so there is no measured line to draw here.
				The road is well attested by archaeology and by the modern roads that still follow it.
			</p>
		{/if}

		{#if detail}
			<h2 class="section">The road today</h2>
			<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
			<div class="body">{@html detail.modern}</div>
			<p class="aside">
				See also: <a href="/modern-roads">which modern roads follow Roman lines</a>, and how
				closely.
			</p>

			<h2 class="section">Where to see it</h2>
			<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, authored -->
			<div class="body">{@html detail.seeing}</div>

			{#if detail.faq.length > 0}
				<h2 class="section">Common questions</h2>
				<FaqList items={detail.faq} />
			{/if}
		{/if}

		{#if counties.length > 0}
			<h2 class="section">Counties it crosses</h2>
			<ul class="counties" role="list">
				{#each counties as c (c.slug)}
					<li><a href="/roads/britain/{c.slug}">{c.name}</a></li>
				{/each}
			</ul>
		{/if}

		<a class="cta" href="/">Am I on it?</a>

		<nav class="siblings" aria-labelledby="siblings-title">
			<h2 class="section" id="siblings-title">The other roads</h2>
			<ul role="list">
				{#each siblings as s (s.key)}
					<li><a href="/road/{s.key}">{s.name}</a></li>
				{/each}
			</ul>
			<p class="all"><a href="/roads">All Roman roads of Britain →</a></p>
		</nav>
	</article>

	<SiteFooter current="road" />
</main>

<style>
	main {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 0;
		padding: clamp(1rem, 3vw, 1.75rem);
		max-width: 760px;
		margin: 0 auto;
	}


	.road {
		animation: fadeUp 600ms var(--ease-out) both;
	}

	.word {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(3rem, 12vw, 6rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: var(--ink);
		margin: clamp(1rem, 3vh, 1.5rem) 0 0.7rem;
	}

	.subtitle {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.05rem, 3vw, 1.25rem);
		color: var(--ink-soft);
		margin: 0.9rem 0 0;
		letter-spacing: 0.01em;
	}

	.body {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: clamp(1.05rem, 2.8vw, 1.2rem);
		line-height: 1.6;
		color: var(--ink);
		margin: clamp(1.5rem, 4vh, 2rem) 0 0;
		max-width: 62ch;
		hyphens: auto;
	}
	.body :global(em) {
		font-style: italic;
		font-weight: 500;
	}
	.body :global(p) {
		margin: 0;
	}
	.body :global(p + p) {
		margin-top: 0.9rem;
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

	.aside {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.05rem;
		color: var(--ink-soft);
		margin: 0.9rem 0 0;
		max-width: 62ch;
	}
	.aside a {
		color: var(--brand);
		text-decoration: none;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
	}
	.aside a:hover {
		color: var(--brand-deep);
	}

	.facts-note.standalone {
		font-family: var(--font-display);
		font-size: clamp(1rem, 2.6vw, 1.1rem);
		font-weight: 500;
		color: var(--ink);
		margin-top: clamp(1.25rem, 3vh, 1.6rem);
		line-height: 1.6;
	}
	.facts-note em {
		font-style: italic;
	}


	.facts-note {
		font-family: var(--font-body);
		font-size: 0.8rem;
		line-height: 1.55;
		color: var(--ink-soft);
		margin: 0.8rem 0 0;
		max-width: 62ch;
	}

	.counties {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.5rem;
	}
	.counties li a {
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
	.counties li a:hover {
		border-color: var(--gold);
		color: var(--brand);
	}

	.siblings ul {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.5rem;
	}
	.siblings li a {
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
	.siblings li a:hover {
		border-color: var(--gold);
		color: var(--brand);
	}
	.siblings .all {
		margin: 1.1rem 0 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
	}
	.siblings .all a {
		color: var(--brand);
		text-decoration: none;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
	}
	.siblings .all a:hover {
		color: var(--brand-deep);
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

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		margin-top: clamp(1.5rem, 4vh, 2rem);
		padding: 0.9rem 1.6rem;
		border-radius: 999px;
		background: var(--brand);
		color: var(--bg);
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.2rem;
		text-decoration: none;
		min-height: 44px;
		box-shadow: 0 1px 2px rgb(31 22 14 / 0.12),
			0 14px 30px -14px var(--brand-deep);
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
