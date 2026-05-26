<script lang="ts">
import RoadMap from "$lib/components/Map.svelte";
import RuleGold from "$lib/components/RuleGold.svelte";
import { roadKey } from "$lib/roads.js";
import type { PageData } from "./$types.js";

type Props = { data: PageData };
let { data }: Props = $props();

const { story, segments } = $derived(data);
const matchedRoadKey = $derived(segments.length > 0 ? roadKey(segments[0]) || null : null);

// First sentence of the story body, stripped of HTML, used as the
// meta description. Falls back to the road name if the body is empty.
const description = $derived(buildDescription(story.body, story.name));

function buildDescription(html: string, fallback: string): string {
	const text = html.replace(/<[^>]+>/g, "").trim();
	if (!text) return fallback;
	const period = text.indexOf(". ");
	const first = period > 40 ? `${text.slice(0, period)}.` : text;
	return first.length > 200 ? `${first.slice(0, 197).trimEnd()}…` : first;
}

const canonical = $derived(`https://isthisaromanroad.com/road/${story.key}`);
const title = $derived(`${story.name} · Is this a Roman road?`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="https://isthisaromanroad.com/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://isthisaromanroad.com/og.png" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Article",
		headline: story.name,
		description,
		url: canonical,
		about: { "@type": "Thing", name: story.name },
		isPartOf: {
			"@type": "WebSite",
			name: "Is this a Roman road?",
			url: "https://isthisaromanroad.com/",
		},
	}).replace(/</g, "\\u003c")}</` + `script>`}
</svelte:head>

<main>
	<header class="masthead">
		<a class="home" href="/" aria-label="Back to the main question">
			<span class="wordmark">Is this a Roman road?</span>
		</a>
	</header>

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

		<div class="map-frame">
			<RoadMap
				userPoint={null}
				roadSegments={segments}
				{matchedRoadKey}
				pointOnRoad={null}
			/>
		</div>

		<a class="cta" href="/">Am I on it?</a>
	</article>

	<footer>
		<span class="edition">Editio · II</span>
		<span class="sep" aria-hidden="true">·</span>
		<a class="url" href="/">isthisaromanroad.com</a>
	</footer>
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

	.masthead {
		padding-top: clamp(0.5rem, 3vh, 1.5rem);
	}
	.home {
		display: inline-flex;
		padding: 12px 8px;
		margin: -12px -8px;
		text-decoration: none;
	}
	.wordmark {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
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
	.roman {
		font-style: italic;
		font-variant-caps: small-caps;
		font-weight: 500;
		color: var(--ink);
		letter-spacing: 0.04em;
		border-bottom: 1px solid var(--gold);
		padding-bottom: 1px;
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

	footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.7rem;
		padding: clamp(1.2rem, 5vh, 2rem) 0 max(env(safe-area-inset-bottom), 1rem);
		font-family: var(--font-body);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--ink-soft);
	}
	footer .sep {
		color: var(--gold);
	}
	footer .url {
		color: inherit;
		text-decoration: none;
	}
	footer .url:hover {
		color: var(--ink);
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
