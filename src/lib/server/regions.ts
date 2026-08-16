/**
 * Build-time only. Joins the country assignment produced by
 * `scripts/build-regions.ts` with the road features themselves, so the
 * /roads/[country] pages can report real figures per country.
 *
 * Like roads-data.ts this is server-only and memoised: it runs once across all
 * prerenders and is never sent to the browser.
 */
import regionData from "../../../data/regions.json" with { type: "json" };
import { featureLengthMeters, totalLengthKm } from "../geometry.js";
import { canonicalRoadNameKey, isDisplayableRoadName } from "../road-names.js";
import { itineraryRoadName } from "../roads.js";
import type { RoadFeature } from "../roads.js";
import { loadAllFeatures } from "./roads-data.js";

type RawRegion = { slug: string; name: string; featureIds: string[] };

/**
 * The United Kingdom deliberately has no /roads/[country] page: /roads already
 * covers Britain in more depth, with hand-written histories. Publishing both
 * would be two pages competing for the same query with overlapping content.
 */
const EXCLUDED_SLUGS = new Set(["united-kingdom"]);

/**
 * A country earns a page if the survey names at least one road in it, OR if it
 * has enough segments that the map and the figures carry the page on their
 * own. Itiner-e attributes no `itinerary` token at all in twelve countries,
 * Spain included despite 1,466 segments, so a rule based purely on named roads
 * would drop some of the largest networks in the empire.
 *
 * Countries clearing neither bar get no page. Five did: they were running at
 * ~180 words of visible text, a third of it the shared navigation, which is
 * exactly the thin-content shape that gets a whole site demoted rather than
 * one page.
 */
const MIN_SEGMENTS_WITHOUT_NAMED_ROADS = 100;

export type NamedRoad = { name: string; segmentCount: number; lengthKm: number | null };

export type Region = {
	slug: string;
	name: string;
	segmentCount: number;
	lengthKm: number | null;
	/** Road names the dataset attributes within this country, longest first by mapped length. */
	namedRoads: NamedRoad[];
	/** Segment counts by Itiner-e certainty class, descending. */
	certainty: { label: string; count: number }[];
	/** Segment counts by Itiner-e road type, descending. */
	types: { label: string; count: number }[];
};

let cache: Promise<Region[]> | null = null;

export function loadRegions(): Promise<Region[]> {
	if (!cache) cache = build();
	return cache;
}

export async function findRegion(slug: string): Promise<Region | null> {
	return (await loadRegions()).find((r) => r.slug === slug) ?? null;
}

/** Every feature belonging to a region, for the map overlay. */
export async function featuresForRegion(slug: string): Promise<RoadFeature[]> {
	const raw = (regionData.regions as RawRegion[]).find((r) => r.slug === slug);
	if (!raw) return [];
	const ids = new Set(raw.featureIds);
	return (await loadAllFeatures()).filter((f) => ids.has(String(f.id)));
}

function countDescending(values: (string | undefined)[]): { label: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const v of values) {
		const label = (v ?? "").trim();
		if (!label) continue;
		counts.set(label, (counts.get(label) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([label, count]) => ({ label, count }))
		.sort((a, b) => b.count - a.count);
}

async function build(): Promise<Region[]> {
	const features = await loadAllFeatures();
	const byId = new Map(features.map((f) => [String(f.id), f]));

	const regions: Region[] = [];
	for (const raw of regionData.regions as RawRegion[]) {
		if (EXCLUDED_SLUGS.has(raw.slug)) continue;

		const owned = raw.featureIds.map((id) => byId.get(id)).filter((f): f is RoadFeature => !!f);
		if (owned.length === 0) continue;

		// Group by displayable road name, tracking length so the list can be
		// ordered by how much of the country each road actually covers. Keyed on
		// the canonical spelling so "Via Iulia Augusta" and "Via Julia Augusta"
		// are one road; the spelling shown is whichever the dataset uses more.
		const named = new Map<
			string,
			{ spellings: Map<string, number>; segmentCount: number; meters: number }
		>();
		for (const f of owned) {
			const name = itineraryRoadName(f.properties.itinerary);
			if (!name || !isDisplayableRoadName(name)) continue;
			const key = canonicalRoadNameKey(name);
			const entry = named.get(key) ?? { spellings: new Map(), segmentCount: 0, meters: 0 };
			entry.spellings.set(name, (entry.spellings.get(name) ?? 0) + 1);
			entry.segmentCount++;
			entry.meters += featureLengthMeters(f);
			named.set(key, entry);
		}

		const namedRoads = [...named.values()]
			.map((v) => ({
				name: [...v.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0],
				segmentCount: v.segmentCount,
				meters: v.meters,
				lengthKm: v.meters >= 1000 ? Math.round(v.meters / 1000) : null,
			}))
			// By length, matching both the doc comment and the km the page shows.
			.sort((a, b) => b.meters - a.meters)
			.map(({ meters, ...rest }) => rest);

		if (namedRoads.length === 0 && owned.length < MIN_SEGMENTS_WITHOUT_NAMED_ROADS) continue;

		regions.push({
			slug: raw.slug,
			name: raw.name,
			segmentCount: owned.length,
			lengthKm: totalLengthKm(owned),
			namedRoads,
			certainty: countDescending(owned.map((f) => f.properties.certainty)),
			types: countDescending(owned.map((f) => f.properties.type)),
		});
	}

	return regions.sort((a, b) => b.segmentCount - a.segmentCount);
}
