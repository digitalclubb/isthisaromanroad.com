import nearestPointOnLine from "@turf/nearest-point-on-line";
import type { Feature, FeatureCollection, LineString, MultiLineString, Position } from "geojson";
import RBush from "rbush";

export type RoadProperties = {
	name?: string;
	type?: string;
	certainty?: string;
	description?: string;
	citation?: string;
	bibliography?: string;
	itinerary?: string;
	lowerDate?: number;
	upperDate?: number;
	constructionPeriod?: string;
};

export type RoadFeature = Feature<LineString | MultiLineString, RoadProperties>;
export type RoadCollection = FeatureCollection<LineString | MultiLineString, RoadProperties>;

type IndexedItem = {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	line: Feature<LineString>;
	feature: RoadFeature;
};

export type LookupResult = {
	road: RoadFeature;
	distanceMeters: number;
	pointOnRoad: [number, number];
	bearingFromUser: number;
};

function lineBbox(coords: Position[]): [number, number, number, number] {
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	for (const c of coords) {
		if (c[0] < minX) minX = c[0];
		if (c[0] > maxX) maxX = c[0];
		if (c[1] < minY) minY = c[1];
		if (c[1] > maxY) maxY = c[1];
	}
	return [minX, minY, maxX, maxY];
}

function toRadians(deg: number): number {
	return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
	return (rad * 180) / Math.PI;
}

function bearing(from: Position, to: Position): number {
	const lng1 = toRadians(from[0]);
	const lat1 = toRadians(from[1]);
	const lng2 = toRadians(to[0]);
	const lat2 = toRadians(to[1]);
	const dLng = lng2 - lng1;
	const y = Math.sin(dLng) * Math.cos(lat2);
	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
	return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

// Conservative "1° at the equator" — used to convert a metre threshold to a
// degree search radius. We always use the latitude-axis figure (largest),
// then divide by cos(lat) to inflate the longitude axis where degrees are
// shorter. Result: a search square that's guaranteed to enclose every road
// whose closest point lies within `distanceMeters` of the query.
const METRES_PER_DEGREE_LAT = 111_320;

/**
 * Normalises a road feature's itinerary/name into a grouping key. Itiner-e
 * splits each road into many LineString segments, often labelled
 * "Itinerarium Antonini, X" for routes from the Antonine Itinerary. We
 * strip that prefix so "Itinerarium Antonini, Watling Street" and bare
 * "Watling Street" group as the same road.
 *
 * Returns an empty string when the feature has no usable identifier — in
 * that case `segmentsOfRoad` returns just the input feature, since we
 * have no basis to group with anything else.
 */
export function roadKey(road: RoadFeature): string {
	const itin = (road.properties.itinerary ?? "").trim();
	// "Itinerarium Antonini" is a meta-tag for routes documented in the
	// Antonine Itinerary; it appears both bare and as a prefix to a named
	// road ("Itinerarium Antonini, Watling Street"). Strip it both ways so
	// only the road's own identifier survives. When the itinerary field
	// holds nothing else, fall back to `name` for grouping.
	const stripped = itin.replace(/^Itinerarium Antonini,?\s*/i, "").trim();
	const name = (road.properties.name ?? "").trim();
	return (stripped || name).toLowerCase();
}

export class RoadIndex {
	private tree = new RBush<IndexedItem>();
	private byKey: Map<string, RoadFeature[]>;
	readonly featureCount: number;

	constructor(fc: RoadCollection) {
		const items: IndexedItem[] = [];
		this.byKey = new Map();
		for (const feature of fc.features) {
			const g = feature.geometry;
			if (g.type === "LineString") {
				items.push(makeItem(g.coordinates, feature));
			} else if (g.type === "MultiLineString") {
				for (const line of g.coordinates) {
					items.push(makeItem(line, feature));
				}
			}
			const k = roadKey(feature);
			if (k) {
				const bucket = this.byKey.get(k);
				if (bucket) bucket.push(feature);
				else this.byKey.set(k, [feature]);
			}
		}
		this.tree.load(items);
		this.featureCount = fc.features.length;
	}

	/**
	 * Returns every segment that shares a `roadKey` with the input — i.e.
	 * the whole of "Watling Street" across the dataset rather than just the
	 * single segment nearest the user. Returns just the input feature when
	 * its key is empty (no name and no itinerary to group on).
	 */
	segmentsOfRoad(road: RoadFeature): RoadFeature[] {
		const k = roadKey(road);
		if (!k) return [road];
		return this.byKey.get(k) ?? [road];
	}

	findNearest(lng: number, lat: number): LookupResult | null {
		// Phase 1: find any candidate via an expanding bbox search. The pads are
		// degrees-of-latitude; ~0.05° ≈ 5.5 km, ~1° ≈ 110 km, ~8° ≈ 880 km.
		const pads = [0.05, 0.2, 1.0, 3.0, 8.0];
		let candidates: IndexedItem[] = [];
		let lastPad = 0;
		for (const p of pads) {
			candidates = this.searchSquare(lng, lat, p);
			lastPad = p;
			if (candidates.length > 0) break;
		}
		if (candidates.length === 0) return null;

		let best = bestAmong(candidates, lng, lat);
		if (best === null) return null;

		// Phase 2: bbox intersection ≠ closest distance. A long road whose bbox
		// sits just outside `lastPad` may still have its closest point nearer
		// than our tentative best. Expand the search to a radius guaranteed to
		// cover any road within `best.distanceMeters`, then re-rank.
		const cosLat = Math.max(Math.cos(toRadians(lat)), 0.2);
		const safePadDeg = best.distanceMeters / METRES_PER_DEGREE_LAT / cosLat + 0.005;
		if (safePadDeg > lastPad) {
			const expanded = this.searchSquare(lng, lat, safePadDeg);
			if (expanded.length > candidates.length) {
				const refined = bestAmong(expanded, lng, lat);
				if (refined && refined.distanceMeters < best.distanceMeters) {
					best = refined;
				}
			}
		}
		return best;
	}

	private searchSquare(lng: number, lat: number, pad: number): IndexedItem[] {
		return this.tree.search({
			minX: lng - pad,
			minY: lat - pad,
			maxX: lng + pad,
			maxY: lat + pad,
		});
	}
}

function makeItem(coords: Position[], feature: RoadFeature): IndexedItem {
	const [minX, minY, maxX, maxY] = lineBbox(coords);
	return {
		minX,
		minY,
		maxX,
		maxY,
		line: {
			type: "Feature",
			properties: {},
			geometry: { type: "LineString", coordinates: coords },
		},
		feature,
	};
}

function bestAmong(items: IndexedItem[], lng: number, lat: number): LookupResult | null {
	const userPoint: Position = [lng, lat];
	let best: LookupResult | null = null;
	for (const item of items) {
		const r = nearestPointOnLine(item.line, userPoint, { units: "kilometers" });
		const distM = (r.properties?.dist ?? 0) * 1000;
		if (best === null || distM < best.distanceMeters) {
			const pt = r.geometry.coordinates;
			const pointOnRoad: [number, number] = [pt[0], pt[1]];
			best = {
				road: item.feature,
				distanceMeters: distM,
				pointOnRoad,
				bearingFromUser: bearing(userPoint, pointOnRoad),
			};
		}
	}
	return best;
}

export async function loadRoadIndex(fetchFn: typeof fetch = fetch): Promise<RoadIndex> {
	const res = await fetchFn("/roads.geojson");
	if (!res.ok) throw new Error(`Failed to load roads.geojson: ${res.status}`);
	const fc = (await res.json()) as RoadCollection;
	return new RoadIndex(fc);
}
