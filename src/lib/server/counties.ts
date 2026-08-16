/**
 * Build-time only. Joins the county assignment from scripts/build-counties.ts
 * with the road features, for the /roads/britain/[county] pages.
 *
 * The publish rule is stricter than the country one: a county needs an entry
 * in COUNTY_NOTES, which by construction means it has both a hand-written
 * paragraph and at least one named road with a page on this site. Itiner-e
 * names only six British roads in its `itinerary` field, so a county without
 * that authored content would be a map, two numbers and nothing else — and a
 * set of pages like that costs more in site-wide quality signal than the long
 * tail is worth.
 */
import countyData from "../../../data/counties.json" with { type: "json" };
import { COUNTY_NOTES } from "../county-notes.js";
import { totalLengthKm } from "../geometry.js";
import type { RoadFeature } from "../roads.js";
import { STORIES } from "../stories.js";
import { loadAllFeatures } from "./roads-data.js";

type RawCounty = { slug: string; name: string; featureIds: string[] };

export type CountyRoad = { key: string; name: string; from?: string; to?: string };

export type County = {
	slug: string;
	name: string;
	segmentCount: number;
	lengthKm: number | null;
	note: string;
	seeing: string;
	roads: CountyRoad[];
};

let cache: Promise<County[]> | null = null;

export function loadCounties(): Promise<County[]> {
	if (!cache) cache = build();
	return cache;
}

export async function findCounty(slug: string): Promise<County | null> {
	return (await loadCounties()).find((c) => c.slug === slug) ?? null;
}

/**
 * The counties a given road crosses, inverted from COUNTY_NOTES. Without this
 * the county pages were one-hop sinks: they linked down to the road pages and
 * nothing linked back, so the hub carried the whole burden.
 */
export async function countiesForRoad(roadKey: string): Promise<{ slug: string; name: string }[]> {
	return (await loadCounties())
		.filter((c) => c.roads.some((r) => r.key === roadKey))
		.map((c) => ({ slug: c.slug, name: c.name }));
}

/** Every feature in a county, for the map overlay. */
export async function featuresForCounty(slug: string): Promise<RoadFeature[]> {
	const raw = (countyData.counties as RawCounty[]).find((c) => c.slug === slug);
	if (!raw) return [];
	const ids = new Set(raw.featureIds);
	return (await loadAllFeatures()).filter((f) => ids.has(String(f.id)));
}

async function build(): Promise<County[]> {
	const features = await loadAllFeatures();
	const byId = new Map(features.map((f) => [String(f.id), f]));
	const storyByKey = new Map(STORIES.map((s) => [s.key, s]));

	const counties: County[] = [];
	for (const raw of countyData.counties as RawCounty[]) {
		const authored = COUNTY_NOTES[raw.slug];
		if (!authored) continue;

		const owned = raw.featureIds.map((id) => byId.get(id)).filter((f): f is RoadFeature => !!f);
		if (owned.length === 0) {
			// An authored county losing all its segments means a boundary-data
			// refresh has silently unpublished an indexed URL. Say so loudly.
			console.warn(`[counties] "${raw.slug}" has an authored note but no features; page skipped.`);
			continue;
		}

		const roads: CountyRoad[] = [];
		for (const key of authored.roads) {
			const story = storyByKey.get(key);
			// A typo in county-notes.ts would otherwise ship a dead link.
			if (!story) throw new Error(`county ${raw.slug} references unknown road "${key}"`);
			roads.push({ key: story.key, name: story.name, from: story.from, to: story.to });
		}

		counties.push({
			slug: raw.slug,
			name: raw.name,
			segmentCount: owned.length,
			lengthKm: totalLengthKm(owned),
			note: authored.note,
			seeing: authored.seeing,
			roads,
		});
	}

	return counties.sort((a, b) => b.segmentCount - a.segmentCount);
}
