import nearestPointOnLine from "@turf/nearest-point-on-line";
import type { Feature, LineString, MultiLineString, Position } from "geojson";

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

export type LookupResult = {
	road: RoadFeature;
	distanceMeters: number;
	pointOnRoad: [number, number];
	bearingFromUser: number;
};

/** The shape of static/roads/manifest.json produced by scripts/build-roads.ts. */
export type Manifest = {
	cellSizeDeg: number;
	/** Keys (`<ix>_<iy>`) of every non-empty cell, so we never fetch an empty one. */
	cells: string[];
};

export type CellFetchResponse = { ok: boolean; status: number; json: () => Promise<unknown> };
export type CellFetch = (url: string) => Promise<CellFetchResponse>;

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

// Conservative "1° of latitude in metres" — converts a metre distance to the
// degree (and thence cell) radius guaranteed to enclose it.
const METRES_PER_DEGREE_LAT = 111_320;

// Mirrors OUT_OF_REACH_M in format.ts: beyond this the UI says "out of reach"
// regardless of the exact figure, so there's no point refining the distance.
const OUT_OF_REACH_M = 50_000;

/**
 * Itiner-e's `itinerary` field is a comma-separated list of the ancient
 * sources a segment appears in. Some entries are bibliographic *catalogues*
 * shared across the whole empire (the Antonine Itinerary, the Peutinger Table,
 * the Ravenna Cosmography…); others are genuine road names (Watling Street,
 * Via Appia, Via Egnatia). A catalogue is never a road identity — keying on one
 * would lump thousands of unrelated segments together — so we filter them out.
 */
function isCatalogueToken(token: string): boolean {
	const t = token.trim().toLowerCase();
	return t === "" || /^itinerarium\b/.test(t) || /^tabula\b/.test(t) || t.includes("cosmograph");
}

/**
 * The first genuine road-name token in a feature's `itinerary` (catalogues
 * removed), or null if it lists only catalogues. e.g.
 * "Itinerarium Antonini, Watling Street" → "Watling Street";
 * "Tabula Peutingeriana, Itinerarium Antonini" → null.
 */
export function itineraryRoadName(itinerary: string | undefined): string | null {
	if (!itinerary) return null;
	for (const token of itinerary.split(",")) {
		const t = token.trim();
		if (t && !isCatalogueToken(t)) return t;
	}
	return null;
}

/**
 * Normalises a road feature into a grouping key so the many segments of one
 * road can be reassembled. Prefers a real road name from the itinerary; falls
 * back to the segment's own `name` (an "A-B" endpoint label that still groups a
 * point-to-point road's pieces). Returns an empty string when nothing usable
 * remains — `segmentsOfRoad` then returns just the input feature.
 */
export function roadKey(road: RoadFeature): string {
	const roadName = itineraryRoadName(road.properties.itinerary);
	if (roadName) return roadName.toLowerCase();
	return (road.properties.name ?? "").trim().toLowerCase();
}

function nearestOnFeature(
	feature: RoadFeature,
	point: Position,
): { distanceMeters: number; pointOnRoad: [number, number] } | null {
	const g = feature.geometry;
	const lines = g.type === "LineString" ? [g.coordinates] : g.coordinates;
	let best: { distanceMeters: number; pointOnRoad: [number, number] } | null = null;
	for (const coords of lines) {
		if (coords.length < 2) continue;
		const line: Feature<LineString> = {
			type: "Feature",
			properties: {},
			geometry: { type: "LineString", coordinates: coords },
		};
		const r = nearestPointOnLine(line, point, { units: "kilometers" });
		const distM = (r.properties?.dist ?? 0) * 1000;
		if (best === null || distM < best.distanceMeters) {
			const pt = r.geometry.coordinates;
			best = { distanceMeters: distM, pointOnRoad: [pt[0], pt[1]] };
		}
	}
	return best;
}

/**
 * Lazy, location-partitioned road index. The dataset is split at build time
 * into 1°×1° cells (see scripts/build-roads.ts). Rather than load the whole
 * world, we fetch only the cells around a query point, expanding outward until
 * a road is found — so the grid itself is the spatial index. Loaded features
 * are deduped by id (a feature spanning a cell boundary appears in both files).
 */
export class RoadIndex {
	private readonly cellSet: Set<string>;
	private readonly cellSize: number;
	private readonly fetchFn: CellFetch;
	private readonly baseUrl: string;

	// Loaded features accumulate across queries for the session: a long roaming
	// session keeps growing this set (and scanNearest's linear scan with it).
	// Fine for the expected use — a few taps near one place — and cleared on
	// reload; revisit with a cap only if long sessions ever prove a problem.
	private readonly featuresById = new Map<string | number, RoadFeature>();
	private readonly cellPromises = new Map<string, Promise<void>>();
	private roadCellsPromise: Promise<Record<string, string[]>> | null = null;
	private roadCells: Record<string, string[]> | null = null;

	constructor(manifest: Manifest, opts: { fetchFn: CellFetch; baseUrl: string }) {
		this.cellSet = new Set(manifest.cells);
		this.cellSize = manifest.cellSizeDeg;
		this.fetchFn = opts.fetchFn;
		this.baseUrl = opts.baseUrl;
	}

	/** Number of distinct features pulled into memory so far this session. */
	get loadedFeatureCount(): number {
		return this.featuresById.size;
	}

	private indexOf(coord: number): number {
		return Math.floor(coord / this.cellSize);
	}

	private async loadCell(key: string): Promise<void> {
		if (!this.cellSet.has(key)) return; // known-empty: never hit the network
		const existing = this.cellPromises.get(key);
		if (existing) return existing;
		const p = (async () => {
			const res = await this.fetchFn(`${this.baseUrl}/cells/${key}.json`);
			if (!res.ok) throw new Error(`Failed to load cell ${key}: ${res.status}`);
			const fc = (await res.json()) as { features: RoadFeature[] };
			for (const f of fc.features) {
				const id = f.id ?? `${key}:${this.featuresById.size}`;
				if (!this.featuresById.has(id)) this.featuresById.set(id, f);
			}
		})();
		this.cellPromises.set(key, p);
		return p;
	}

	/** Load every cell whose Chebyshev distance from (cx,cy) is in [rFrom, rTo]. */
	private async loadRing(cx: number, cy: number, rFrom: number, rTo: number): Promise<void> {
		const jobs: Promise<void>[] = [];
		for (let r = Math.max(0, rFrom); r <= rTo; r++) {
			if (r === 0) {
				jobs.push(this.loadCell(`${cx}_${cy}`));
				continue;
			}
			for (let ix = cx - r; ix <= cx + r; ix++) {
				for (let iy = cy - r; iy <= cy + r; iy++) {
					if (Math.max(Math.abs(ix - cx), Math.abs(iy - cy)) !== r) continue;
					jobs.push(this.loadCell(`${ix}_${iy}`));
				}
			}
		}
		await Promise.all(jobs);
	}

	private scanNearest(lng: number, lat: number): LookupResult | null {
		const point: Position = [lng, lat];
		let best: LookupResult | null = null;
		for (const feature of this.featuresById.values()) {
			const near = nearestOnFeature(feature, point);
			if (!near) continue;
			if (best === null || near.distanceMeters < best.distanceMeters) {
				best = {
					road: feature,
					distanceMeters: near.distanceMeters,
					pointOnRoad: near.pointOnRoad,
					bearingFromUser: bearing(point, near.pointOnRoad),
				};
			}
		}
		return best;
	}

	async findNearest(lng: number, lat: number): Promise<LookupResult | null> {
		const cx = this.indexOf(lng);
		const cy = this.indexOf(lat);

		// Phase 1: expand the loaded ring until a road turns up. Radii are in
		// cells; with 1° cells, radius 8 reaches ~880 km — well past the app's
		// "out of reach" threshold, so beyond it we genuinely have nothing.
		const radii = [0, 1, 2, 4, 8];
		let best: LookupResult | null = null;
		let loadedRadius = -1;
		for (const r of radii) {
			await this.loadRing(cx, cy, loadedRadius + 1, r);
			loadedRadius = r;
			best = this.scanNearest(lng, lat);
			if (best) break;
		}
		if (!best) return null;

		// Already past "out of reach" — the exact distance won't change the
		// verdict, so skip the (potentially large) phase-2 ring expansion that
		// refining a far-flung ocean/desert point would otherwise trigger.
		if (best.distanceMeters > OUT_OF_REACH_M) return best;

		// Phase 2: the nearest road might sit just outside the ring we stopped
		// at. Expand to a radius guaranteed to cover anything within the current
		// best distance, then re-rank.
		const cosLat = Math.max(Math.cos(toRadians(lat)), 0.2);
		const safePadDeg = best.distanceMeters / METRES_PER_DEGREE_LAT / cosLat + this.cellSize * 0.01;
		const neededRadius = Math.ceil(safePadDeg / this.cellSize);
		if (neededRadius > loadedRadius) {
			await this.loadRing(cx, cy, loadedRadius + 1, neededRadius);
			best = this.scanNearest(lng, lat) ?? best;
		}
		return best;
	}

	private ensureRoadCells(): Promise<Record<string, string[]>> {
		if (this.roadCells) return Promise.resolve(this.roadCells);
		if (!this.roadCellsPromise) {
			this.roadCellsPromise = (async () => {
				const res = await this.fetchFn(`${this.baseUrl}/road-cells.json`);
				if (!res.ok) throw new Error(`Failed to load road-cells.json: ${res.status}`);
				this.roadCells = (await res.json()) as Record<string, string[]>;
				return this.roadCells;
			})();
		}
		return this.roadCellsPromise;
	}

	/**
	 * Returns every segment that shares a `roadKey` with the input — the whole
	 * of "Watling Street" rather than the single nearest segment. Because a road
	 * spans many cells, this consults road-cells.json to fetch the cells holding
	 * its other segments first. Returns just the input feature when its key is
	 * empty, or on any failure to assemble the rest.
	 */
	async segmentsOfRoad(road: RoadFeature): Promise<RoadFeature[]> {
		const k = roadKey(road);
		if (!k) return [road];
		try {
			const map = await this.ensureRoadCells();
			const cells = map[k];
			if (!cells || cells.length === 0) return this.collectByKey(k, road);
			await Promise.all(cells.map((c) => this.loadCell(c)));
			return this.collectByKey(k, road);
		} catch {
			return [road];
		}
	}

	private collectByKey(k: string, fallback: RoadFeature): RoadFeature[] {
		const out: RoadFeature[] = [];
		for (const feature of this.featuresById.values()) {
			if (roadKey(feature) === k) out.push(feature);
		}
		return out.length > 0 ? out : [fallback];
	}
}

export async function loadRoadIndex(
	fetchFn: CellFetch = fetch as unknown as CellFetch,
	baseUrl = "/roads",
): Promise<RoadIndex> {
	const res = await fetchFn(`${baseUrl}/manifest.json`);
	if (!res.ok) throw new Error(`Failed to load roads manifest: ${res.status}`);
	const manifest = (await res.json()) as Manifest;
	return new RoadIndex(manifest, { fetchFn, baseUrl });
}
