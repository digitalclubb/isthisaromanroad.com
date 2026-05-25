<script lang="ts">
import RoadMap from "$lib/components/Map.svelte";
import {
	bearingToCompass,
	formatDistance,
	roadDisplayName,
	roadNarrative,
	roadSubtitle,
} from "$lib/format.js";
import { geocode } from "$lib/geocode.js";
import type { LookupResult, RoadIndex } from "$lib/roads.js";

const ON_ROAD_THRESHOLD_M = 50;
const TITLE = "Is this a Roman road?";
const DESCRIPTION =
	"Tap a button and find out instantly if you are standing on (or near) a Roman road in Britain. Geolocation, postcode search, and historical context for over a thousand Roman routes.";

let idx = $state<RoadIndex | null>(null);
let result = $state<LookupResult | null>(null);
let userPoint = $state<[number, number] | null>(null);
let searchQuery = $state("");
let loading = $state(false);
let error = $state<string | null>(null);
let queried = $state(false);

let pendingIndex: Promise<RoadIndex> | null = null;
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
						? "Location permission denied. Try the search below instead."
						: err.code === err.POSITION_UNAVAILABLE
							? "Your location couldn't be determined."
							: "Locating timed out — try again or use search.";
				reject(new Error(msg));
			},
			{ enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 },
		);
	});
}

async function checkHere() {
	error = null;
	queried = true;
	loading = true;
	try {
		const i = await ensureIndex();
		const pos = await getGeolocation();
		userPoint = [pos.coords.longitude, pos.coords.latitude];
		result = i.findNearest(pos.coords.longitude, pos.coords.latitude);
	} catch (e) {
		error = e instanceof Error ? e.message : "Something went wrong";
		result = null;
	} finally {
		loading = false;
	}
}

async function searchAndCheck(event: SubmitEvent) {
	event.preventDefault();
	const q = searchQuery.trim();
	if (!q) return;
	error = null;
	queried = true;
	loading = true;
	try {
		const i = await ensureIndex();
		const hits = await geocode(q);
		if (hits.length === 0) {
			error = `No place matched "${q}".`;
			result = null;
			return;
		}
		userPoint = [hits[0].lng, hits[0].lat];
		result = i.findNearest(hits[0].lng, hits[0].lat);
	} catch (e) {
		error = e instanceof Error ? e.message : "Search failed.";
		result = null;
	} finally {
		loading = false;
	}
}

const onRoad = $derived(result ? result.distanceMeters <= ON_ROAD_THRESHOLD_M : null);

const headline = $derived.by(() => {
	if (loading) return "Looking…";
	if (!queried) return "Tap to find out";
	if (error) return "Hmm.";
	if (result === null) return "No Roman roads found nearby.";
	return onRoad ? "Yes!" : "No.";
});

const subline = $derived.by(() => {
	if (loading || !queried || error || !result) return null;
	const dist = formatDistance(result.distanceMeters);
	const dir = bearingToCompass(result.bearingFromUser);
	const name = roadDisplayName(result.road);
	if (onRoad) {
		return `You're on ${name} — about ${dist} from its centreline.`;
	}
	return `The nearest is ${name}, ${dist} ${dir}.`;
});
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

<main>
	<header class="hero">
		<h1>Is this a Roman road?</h1>
		<p class="tag">
			Stand still, tap, and find out. Powered by the
			<a href="https://itiner-e.org" rel="noopener" target="_blank">Itiner-e</a>
			dataset of nearly 300,000 km of mapped Roman routes.
		</p>
	</header>

	<section class="answer-card">
		<div class="answer-live" aria-live="polite" aria-atomic="true">
			{#if !queried && !loading}
				<div class="answer answer--neutral">
					<span class="answer-text">{headline}</span>
				</div>
			{:else if loading}
				<div class="answer answer--neutral">
					<span class="answer-text">{headline}</span>
				</div>
			{:else if error}
				<div class="answer answer--neutral">
					<span class="answer-text">{headline}</span>
					<p class="answer-sub error">{error}</p>
				</div>
			{:else if result}
				<div class="answer {onRoad ? 'answer--yes' : 'answer--no'}">
					<span class="answer-text">{headline}</span>
					<p class="answer-sub">{subline}</p>
				</div>
			{/if}
		</div>

		<div class="controls">
			<button class="btn btn--primary" type="button" onclick={checkHere} disabled={loading}>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					width="20"
					height="20"
					fill="currentColor"
				>
					<path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 0 0 1.3 0C12.95 21.5 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
				</svg>
				Use my location
			</button>

			<form class="search" onsubmit={searchAndCheck}>
				<label class="visually-hidden" for="search">Search by town or postcode</label>
				<input
					id="search"
					type="search"
					placeholder="Or search a town, postcode…"
					bind:value={searchQuery}
					autocomplete="off"
					autocapitalize="words"
					enterkeyhint="search"
				/>
				<button class="btn btn--ghost" type="submit" disabled={loading || !searchQuery.trim()}>
					Search
				</button>
			</form>
		</div>
	</section>

	<section class="map-wrap" aria-label="Map">
		<RoadMap
			{userPoint}
			roadFeature={result?.road ?? null}
			pointOnRoad={result?.pointOnRoad ?? null}
		/>
	</section>

	{#if result && !error}
		<section class="info">
			<h2>{roadDisplayName(result.road)}</h2>
			{#if roadSubtitle(result.road)}
				<p class="info-sub">{roadSubtitle(result.road)}</p>
			{/if}
			<p>{roadNarrative(result.road)}</p>
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
		</section>
	{/if}

	<footer>
		<p>
			Road data:
			<a href="https://itiner-e.org" rel="noopener" target="_blank">Itiner-e</a>
			(de Soto et al. 2025, CC BY 4.0). Base map © OpenStreetMap contributors, © CARTO.
			Place search via Nominatim.
		</p>
		<p>Made because my son keeps asking.</p>
	</footer>
</main>

<style>
	main {
		max-width: 760px;
		margin: 0 auto;
		padding: clamp(1rem, 2vw, 1.5rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.hero {
		padding-top: 0.5rem;
	}
	.hero h1 {
		font-size: clamp(2rem, 6vw, 3rem);
		margin: 0 0 0.4rem;
		color: var(--brand);
	}
	.tag {
		margin: 0;
		color: var(--ink-soft);
		font-size: 0.95rem;
	}

	.answer-card {
		background: var(--surface);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: clamp(1rem, 2.5vw, 1.5rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.answer {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1rem 1.2rem;
		border-radius: 12px;
		border-left: 6px solid transparent;
	}
	.answer-text {
		font-family: Georgia, serif;
		font-size: clamp(1.8rem, 6vw, 2.6rem);
		line-height: 1;
		font-weight: 700;
	}
	.answer-sub {
		margin: 0;
		color: var(--ink-soft);
		font-size: 1rem;
	}
	.answer-sub.error {
		color: var(--warn);
	}
	.answer--neutral {
		background: color-mix(in srgb, var(--brand) 4%, var(--surface));
		border-left-color: color-mix(in srgb, var(--brand) 25%, var(--surface));
	}
	.answer--yes {
		background: color-mix(in srgb, var(--ok) 8%, var(--surface));
		border-left-color: var(--ok);
	}
	.answer--yes .answer-text {
		color: var(--ok);
	}
	.answer--no {
		background: color-mix(in srgb, var(--brand) 6%, var(--surface));
		border-left-color: var(--brand);
	}
	.answer--no .answer-text {
		color: var(--brand);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.85rem 1.1rem;
		border-radius: 12px;
		font-weight: 600;
		font-size: 1rem;
		border: 1px solid transparent;
		transition: transform 80ms ease, background 120ms ease;
	}
	.btn:active {
		transform: scale(0.98);
	}
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.btn--primary {
		background: var(--brand);
		color: white;
	}
	.btn--primary:hover:not(:disabled) {
		background: var(--brand-deep);
	}
	.btn--ghost {
		background: transparent;
		color: var(--ink);
		border-color: color-mix(in srgb, var(--ink) 18%, transparent);
	}

	.search {
		display: flex;
		gap: 0.5rem;
	}
	.search input {
		flex: 1;
		font: inherit;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
		background: var(--surface);
		color: var(--ink);
		min-width: 0;
	}

	.map-wrap {
		height: clamp(360px, 55vh, 560px);
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow);
	}

	.info {
		background: var(--surface);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: clamp(1rem, 2.5vw, 1.5rem);
	}
	.info h2 {
		margin: 0 0 0.25rem;
		font-size: 1.4rem;
		color: var(--brand);
	}
	.info-sub {
		margin: 0 0 0.75rem;
		color: var(--ink-soft);
		font-size: 0.95rem;
		text-transform: capitalize;
	}
	.info p {
		margin: 0 0 0.5rem;
		line-height: 1.6;
	}
	.cite {
		color: var(--ink-soft);
		margin-top: 0.5rem;
	}

	footer {
		color: var(--ink-soft);
		font-size: 0.85rem;
		text-align: center;
		padding: 1rem 0 2rem;
		line-height: 1.5;
	}
	footer p {
		margin: 0.25rem 0;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
