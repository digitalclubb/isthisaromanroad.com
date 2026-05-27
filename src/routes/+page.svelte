<script lang="ts">
import Answer from "$lib/components/Answer.svelte";
import AskAgain from "$lib/components/AskAgain.svelte";
import Listening from "$lib/components/Listening.svelte";
import RoadMap from "$lib/components/Map.svelte";
import Question from "$lib/components/Question.svelte";
import RoadStory from "$lib/components/RoadStory.svelte";
import ShareCard from "$lib/components/ShareCard.svelte";
import Wordmark from "$lib/components/Wordmark.svelte";
import { answerTierFor, roadNarrative, roadSubtitle } from "$lib/format.js";
import { geocode } from "$lib/geocode.js";
import { type LookupResult, type RoadIndex, roadKey } from "$lib/roads.js";
import { rasterise, shareOrDownload } from "$lib/share.js";
import { findStoryFor } from "$lib/stories.js";

const TITLE = "Is this a Roman road?";
const DESCRIPTION =
	"A small oracle for the road ahead. Tap once on your phone and find out if you stand on (or near) a Roman road in Britain.";

type Phase = "idle" | "listening" | "answered" | "error";

let phase = $state<Phase>("idle");
let result = $state<LookupResult | null>(null);
let userPoint = $state<[number, number] | null>(null);
let error = $state<string | null>(null);

let idx = $state<RoadIndex | null>(null);
let pendingIndex: Promise<RoadIndex> | null = null;

// Each user action increments this. In-flight promises bail if their token
// doesn't match the current one — fixes the race where a slow geolocation
// resolves after the user has hit "ask again".
let requestId = 0;

async function ensureIndex(): Promise<RoadIndex> {
	if (idx) return idx;
	if (!pendingIndex) {
		pendingIndex = import("$lib/roads.js")
			.then((m) => m.loadRoadIndex())
			.then((built) => {
				idx = built;
				return built;
			})
			.catch((e) => {
				pendingIndex = null;
				throw e;
			});
	}
	return pendingIndex;
}

function getGeolocation(): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			reject(new Error("Your browser doesn't support geolocation."));
			return;
		}
		navigator.geolocation.getCurrentPosition(
			resolve,
			(err) => {
				const msg =
					err.code === err.PERMISSION_DENIED
						? "Location permission denied. Try searching a place instead."
						: err.code === err.POSITION_UNAVAILABLE
							? "Your location couldn't be determined."
							: "Locating timed out. Try again or search a place.";
				reject(new Error(msg));
			},
			{ enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 },
		);
	});
}

async function askHere() {
	const id = ++requestId;
	phase = "listening";
	error = null;
	try {
		const [i, pos] = await Promise.all([ensureIndex(), getGeolocation()]);
		if (id !== requestId) return;
		userPoint = [pos.coords.longitude, pos.coords.latitude];
		result = i.findNearest(pos.coords.longitude, pos.coords.latitude);
		phase = "answered";
	} catch (e) {
		if (id !== requestId) return;
		error = e instanceof Error ? e.message : "Something went wrong.";
		result = null;
		phase = "error";
	}
}

async function askForPlace(query: string) {
	const id = ++requestId;
	phase = "listening";
	error = null;
	try {
		const i = await ensureIndex();
		const hits = await geocode(query);
		if (id !== requestId) return;
		if (hits.length === 0) {
			error = `No place matched "${query}".`;
			phase = "error";
			return;
		}
		userPoint = [hits[0].lng, hits[0].lat];
		result = i.findNearest(hits[0].lng, hits[0].lat);
		phase = "answered";
	} catch (e) {
		if (id !== requestId) return;
		error = e instanceof Error ? e.message : "Search failed.";
		phase = "error";
	}
}

function reset() {
	requestId++;
	phase = "idle";
	result = null;
	userPoint = null;
	error = null;
}

let shareCardEl: HTMLDivElement | undefined = $state();
let sharing = $state(false);
let shareError = $state<string | null>(null);

async function share() {
	if (!shareCardEl || sharing) return;
	sharing = true;
	shareError = null;
	try {
		const blob = await rasterise(shareCardEl, 1200, 630);
		await shareOrDownload(blob, "is-this-a-roman-road.png");
	} catch (e) {
		shareError = e instanceof Error ? e.message : "Couldn't prepare the share image.";
	} finally {
		sharing = false;
	}
}

// Five-tier classifier honours both physical proximity and the road's own
// reconstructive certainty. See `answerTierFor` in src/lib/format.ts.
const tier = $derived(
	result ? answerTierFor(result.distanceMeters, result.road.properties.certainty) : null,
);
const minimised = $derived(phase !== "idle");
const story = $derived(result ? findStoryFor(result.road) : null);

// Whole road: every Itiner-e segment that shares the matched road's
// canonical key. Used for the map overlay and the share-card sketch so
// the user sees the line in its entirety, not just the nearest slice.
const roadSegments = $derived(
	result && idx ? idx.segmentsOfRoad(result.road) : result ? [result.road] : [],
);
const matchedRoadKey = $derived(result ? roadKey(result.road) || null : null);
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href="https://isthisaromanroad.com/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content="https://isthisaromanroad.com/" />
	<meta property="og:image" content="https://isthisaromanroad.com/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="https://isthisaromanroad.com/og.png" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: TITLE,
		description: DESCRIPTION,
		url: "https://isthisaromanroad.com/",
		applicationCategory: "TravelApplication",
		operatingSystem: "Any",
		offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
		about: { "@type": "Thing", name: "Roman roads in Britain" },
	}).replace(/</g, "\\u003c")}</` + `script>`}
</svelte:head>

<main class:answered={phase === "answered" || phase === "error"}>
	<header class="masthead" class:minimised>
		{#if phase !== "idle"}
			<button class="home" type="button" onclick={reset} aria-label="Ask another question">
				<Wordmark minimised />
			</button>
		{:else}
			<Wordmark />
		{/if}
	</header>

	<section class="stage">
		{#if phase === "idle"}
			<Question onAsk={askHere} onSearch={askForPlace} />
		{:else if phase === "listening"}
			<Listening />
		{:else if phase === "answered" && result}
			{#if tier}<Answer {result} {tier} />{/if}

			<div class="map-frame">
				<RoadMap
					{userPoint}
					{roadSegments}
					{matchedRoadKey}
					pointOnRoad={result.pointOnRoad}
				/>
			</div>

			{#if story}
				<RoadStory {story} />
			{/if}

			{#if !story || result.road.properties.citation || result.road.properties.bibliography}
				<details class="more">
					<summary>{story ? "Source" : "More about this road"}</summary>
					<div class="more-body">
						{#if !story}
							{#if roadSubtitle(result.road)}
								<p class="more-sub">{roadSubtitle(result.road)}</p>
							{/if}
							<p>{roadNarrative(result.road)}</p>
						{/if}
						{#if result.road.properties.citation || result.road.properties.bibliography}
							<p class="cite">
								<small>
									Source: {result.road.properties.citation ?? ""}
									{#if result.road.properties.bibliography}
										· {result.road.properties.bibliography}
									{/if}
								</small>
							</p>
						{/if}
					</div>
				</details>
			{/if}

			<AskAgain
				onAskAgain={reset}
				onShare={share}
				{sharing}
			/>
			{#if shareError}
				<p class="share-error" role="alert">{shareError}</p>
			{/if}
		{:else if phase === "error"}
			<div class="error" aria-live="polite">
				<h2 class="word">Hmm.</h2>
				<p class="sub">{error}</p>
			</div>
			<AskAgain onAskAgain={reset} />
		{/if}
	</section>

	<footer>
		<span class="edition">Editio · II</span>
		<span class="sep" aria-hidden="true">·</span>
		<span class="url">isthisaromanroad.com</span>
	</footer>
</main>

<!-- Off-screen render target for the share card. html-to-image rasterises
     this node into PNG. Kept in the DOM (not display:none) so fonts apply;
     positioned far off-screen and aria-hidden + inert. -->
{#if phase === "answered" && result}
	<div class="share-host" bind:this={shareCardEl} aria-hidden="true" inert>
		{#if tier}
			<ShareCard {result} {tier} {roadSegments} {userPoint} />
		{/if}
	</div>
{/if}

<style>
	main {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 0;
		padding: clamp(1rem, 3vw, 1.75rem);
		max-width: 720px;
		margin: 0 auto;
	}

	.masthead {
		padding-top: clamp(0.5rem, 3vh, 1.5rem);
		transition: padding 400ms var(--ease);
	}
	.masthead.minimised {
		padding-top: 0;
	}
	.home {
		display: inline-flex;
		cursor: pointer;
		/* Expand the hit area without changing the visual position so the tiny
		   minimised wordmark still meets a 44px tap target on mobile. */
		padding: 12px 8px;
		margin: -12px -8px;
	}

	.stage {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	/* Vertical-centre the question on the cold load so the page feels like a
	   single thought rather than a UI. Once answered, content stacks naturally
	   from the top. */
	main:not(.answered) .stage {
		justify-content: center;
		min-height: calc(100dvh - 8rem);
	}

	.map-frame {
		margin-top: clamp(1.5rem, 4vh, 2rem);
		height: clamp(280px, 45vh, 460px);
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow);
		border: 1px solid var(--surface-deep);
		background: var(--surface);
	}

	.more {
		margin-top: clamp(1.25rem, 3vh, 1.75rem);
		font-family: var(--font-body);
		color: var(--ink-soft);
	}
	.more summary {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 500;
		cursor: pointer;
		list-style: none;
		/* Bumped from 0.6rem to push toward WCAG 2.2 SC 2.5.5 (AAA, 44px). */
		padding: 0.95rem 0.5rem;
		margin: 0 -0.5rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--ink-soft);
		transition: color 200ms var(--ease);
		border-radius: 4px;
	}
	.more summary::-webkit-details-marker {
		display: none;
	}
	.more summary::after {
		content: "+";
		font-family: var(--font-display);
		font-size: 1.1rem;
		line-height: 1;
		color: var(--gold);
		transition: transform 240ms var(--ease);
	}
	.more[open] summary::after {
		transform: rotate(45deg);
	}
	.more summary:hover {
		color: var(--ink);
	}
	.more-body {
		padding-top: 0.5rem;
		max-width: 60ch;
		font-size: 0.95rem;
		line-height: 1.6;
		animation: fadeUp 300ms var(--ease-out);
	}
	.more-sub {
		font-style: italic;
		margin: 0 0 0.5rem;
		font-size: 0.85rem;
		text-transform: lowercase;
	}
	.cite {
		margin-top: 0.6rem;
		opacity: 0.7;
		font-size: 0.85rem;
	}

	.error {
		text-align: left;
		animation: fadeUp 500ms var(--ease-out) both;
	}
	.error .word {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(2.8rem, 12vw, 5rem);
		line-height: 1;
		color: var(--ink);
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
	}
	.error .sub {
		font-family: var(--font-display);
		font-style: italic;
		color: var(--ink-soft);
		font-size: clamp(1.05rem, 3vw, 1.2rem);
		max-width: 36ch;
		margin: 0.8rem 0 0;
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
	footer .edition {
		font-variant-numeric: oldstyle-nums;
	}
	footer .sep {
		color: var(--gold);
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

	.share-error {
		text-align: center;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--warn);
		margin: 0.6rem 0 0;
	}

	:global(.share-host) {
		position: fixed;
		left: -20000px;
		top: 0;
		pointer-events: none;
	}
</style>
