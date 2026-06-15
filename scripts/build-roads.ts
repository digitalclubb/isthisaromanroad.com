/**
 * Downloads the Itiner-e Roman roads dataset from Zenodo, reprojects from
 * EPSG:3395 (World Mercator) to EPSG:4326 (WGS84), slims the properties, and
 * writes a spatially partitioned set of static GeoJSON files the site loads
 * lazily at runtime.
 *
 * Output (all under `static/roads/`):
 *   - `cells/<ix>_<iy>.json`  one FeatureCollection per non-empty 1°×1° cell.
 *                             A feature is written to every cell its line
 *                             passes through, so the nearest-point query for
 *                             any point in a cell is guaranteed to see it.
 *   - `manifest.json`         { cellSizeDeg, cells: [keys…] } — lets the client
 *                             skip cells it knows are empty (no 404 probing).
 *   - `road-cells.json`       { roadKey: [cellKey…] } — so the client can fetch
 *                             every cell holding a matched road's segments and
 *                             draw the whole line, not just the local slice.
 *
 * The dataset is empire-wide; we keep all of it. (It was previously filtered
 * to a UK bounding box — that filter is gone.)
 *
 * Source: de Soto et al. 2025, Scientific Data — CC BY 4.0
 * https://doi.org/10.5281/zenodo.17122148
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { readFile, rm, stat, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Feature, FeatureCollection, LineString, MultiLineString, Position } from "geojson";
import proj4 from "proj4";

const ITINERE_URL = "https://zenodo.org/api/records/17122148/files/itinere_roads.geojson/content";
const RAW_PATH = "data/raw/itinere_roads.geojson";
const OUT_DIR = "static/roads";
const CELLS_DIR = `${OUT_DIR}/cells`;
const LEGACY_GEOJSON = "static/roads.geojson";

// Cell edge length in degrees. 1° keeps a single cell's payload small (tens of
// KB even in dense regions) while a road of average length spans only a handful
// of cells. Index = floor(coord / CELL_DEG), so this generalises if retuned.
const CELL_DEG = 1;

// EPSG:3395 — World Mercator on WGS84 ellipsoid
const SRC = "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
const DST = "+proj=longlat +datum=WGS84 +no_defs";
const project = proj4(SRC, DST);

async function download() {
	if (existsSync(RAW_PATH)) {
		const s = await stat(RAW_PATH);
		console.log(`Cached at ${RAW_PATH} (${(s.size / 1e6).toFixed(1)} MB)`);
		return;
	}
	mkdirSync("data/raw", { recursive: true });
	console.log("Downloading Itiner-e GeoJSON (~78 MB)…");
	const res = await fetch(ITINERE_URL);
	if (!res.ok || !res.body) {
		throw new Error(`Download failed: ${res.status} ${res.statusText}`);
	}
	await pipeline(Readable.fromWeb(res.body as never), createWriteStream(RAW_PATH));
	const s = await stat(RAW_PATH);
	console.log(`Downloaded ${(s.size / 1e6).toFixed(1)} MB.`);
}

function round(n: number, places = 5): number {
	const p = 10 ** places;
	return Math.round(n * p) / p;
}

function reprojectLine(line: Position[]): [number, number][] {
	const out: [number, number][] = [];
	for (const c of line) {
		const [lng, lat] = project.forward([c[0], c[1]]);
		out.push([round(lng), round(lat)]);
	}
	return out;
}

function reprojectGeometry(g: LineString | MultiLineString): LineString | MultiLineString {
	if (g.type === "LineString") {
		return { type: "LineString", coordinates: reprojectLine(g.coordinates) };
	}
	return {
		type: "MultiLineString",
		coordinates: g.coordinates.map(reprojectLine),
	};
}

type SlimProps = {
	name?: string;
	type?: string;
	certainty?: string;
	description?: string;
	citation?: string;
	bibliography?: string;
	lowerDate?: number;
	upperDate?: number;
	constructionPeriod?: string;
	itinerary?: string;
};

function cleanProps(p: Record<string, unknown> | null): SlimProps {
	if (!p) return {};
	const out: SlimProps = {};
	const setStr = (k: keyof SlimProps, v: unknown) => {
		if (typeof v === "string" && v.trim() !== "") {
			(out as Record<string, string>)[k] = v.trim();
		}
	};
	const setNum = (k: keyof SlimProps, v: unknown) => {
		if (typeof v === "number" && Number.isFinite(v) && v !== 9999) {
			(out as Record<string, number>)[k] = v;
		}
	};
	setStr("name", p.Name);
	setStr("type", p.Type);
	setStr("certainty", p.Segment_s);
	setStr("description", p.Descriptio);
	setStr("citation", p.Citation);
	setStr("bibliography", p.Bibliograp);
	setStr("constructionPeriod", p.Cons_per_e);
	setStr("itinerary", p.Itinerary);
	setNum("lowerDate", p.Lower_Date);
	setNum("upperDate", p.Upper_Date);
	return out;
}

/**
 * Normalises a feature's itinerary/name into a grouping key. MUST stay
 * identical to `roadKey` / `itineraryRoadName` in src/lib/roads.ts — replicated
 * here (rather than imported) so the build pipeline doesn't couple to the
 * browser module's evolving exports. Catalogue sources (the Antonine Itinerary,
 * Peutinger Table, Ravenna Cosmography…) are never road identities, so they're
 * filtered out; the first real road name wins, else the segment's own name.
 */
function isCatalogueToken(token: string): boolean {
	const t = token.trim().toLowerCase();
	return t === "" || /^itinerarium\b/.test(t) || /^tabula\b/.test(t) || t.includes("cosmograph");
}

function roadKeyOf(p: SlimProps): string {
	const itin = p.itinerary ?? "";
	for (const token of itin.split(",")) {
		const t = token.trim();
		if (t && !isCatalogueToken(t)) return t.toLowerCase();
	}
	return (p.name ?? "").trim().toLowerCase();
}

/**
 * Every cell the geometry actually passes through, computed per edge rather
 * than over the whole-feature bounding box. A long diagonal road's overall
 * bbox spans a big rectangle of cells it never enters; each edge's bbox spans
 * only the one or two cells that edge crosses. This stays correct for the
 * nearest-point query — an edge's closest point lies within that edge's bbox,
 * so any cell containing it is included — while shrinking duplication sharply.
 */
function cellKeysForGeometry(g: LineString | MultiLineString): Set<string> {
	const keys = new Set<string>();
	const add = (minLng: number, minLat: number, maxLng: number, maxLat: number) => {
		const ix0 = Math.floor(minLng / CELL_DEG);
		const ix1 = Math.floor(maxLng / CELL_DEG);
		const iy0 = Math.floor(minLat / CELL_DEG);
		const iy1 = Math.floor(maxLat / CELL_DEG);
		for (let ix = ix0; ix <= ix1; ix++) {
			for (let iy = iy0; iy <= iy1; iy++) keys.add(`${ix}_${iy}`);
		}
	};
	const lines = g.type === "LineString" ? [g.coordinates] : g.coordinates;
	for (const line of lines) {
		if (line.length === 1) {
			add(line[0][0], line[0][1], line[0][0], line[0][1]);
			continue;
		}
		for (let i = 0; i < line.length - 1; i++) {
			const a = line[i];
			const b = line[i + 1];
			add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]));
		}
	}
	return keys;
}

async function main() {
	await download();
	console.log("Parsing…");
	const raw = await readFile(RAW_PATH, "utf8");
	const fc = JSON.parse(raw) as FeatureCollection;
	console.log(`Total features: ${fc.features.length}`);

	const cells = new Map<string, Feature[]>();
	const roadCells = new Map<string, Set<string>>();
	let kept = 0;
	let idCounter = 0;
	let scanned = 0;

	for (const f of fc.features) {
		scanned++;
		const g = f.geometry as LineString | MultiLineString | null;
		if (!g || (g.type !== "LineString" && g.type !== "MultiLineString")) continue;

		const geometry = reprojectGeometry(g);
		const properties = cleanProps(f.properties);
		// Ensure a stable id so the client can dedupe a feature that, by spanning
		// a cell boundary, lands in more than one cell file.
		const id = f.id ?? `f${idCounter++}`;
		const feature: Feature = { type: "Feature", id, properties, geometry };

		const keys = cellKeysForGeometry(geometry);
		for (const k of keys) {
			const bucket = cells.get(k);
			if (bucket) bucket.push(feature);
			else cells.set(k, [feature]);
		}

		const rk = roadKeyOf(properties);
		if (rk) {
			let set = roadCells.get(rk);
			if (!set) {
				set = new Set();
				roadCells.set(rk, set);
			}
			for (const k of keys) set.add(k);
		}

		kept++;
		if (scanned % 2000 === 0) console.log(`  scanned ${scanned}/${fc.features.length}`);
	}

	console.log(`Kept ${kept} features across ${cells.size} non-empty cells.`);

	// Fresh output tree: drop any stale cells from a previous (e.g. UK-only) run
	// and the legacy single-file dataset.
	await rm(OUT_DIR, { recursive: true, force: true });
	await rm(LEGACY_GEOJSON, { force: true });
	mkdirSync(CELLS_DIR, { recursive: true });

	let totalBytes = 0;
	let maxBytes = 0;
	let maxKey = "";
	for (const [key, feats] of cells) {
		const body = JSON.stringify({ type: "FeatureCollection", features: feats });
		await writeFile(`${CELLS_DIR}/${key}.json`, body);
		totalBytes += body.length;
		if (body.length > maxBytes) {
			maxBytes = body.length;
			maxKey = key;
		}
	}

	const manifest = {
		cellSizeDeg: CELL_DEG,
		cells: [...cells.keys()].sort(),
	};
	await writeFile(`${OUT_DIR}/manifest.json`, JSON.stringify(manifest));

	const roadCellsObj: Record<string, string[]> = {};
	for (const [rk, set] of roadCells) roadCellsObj[rk] = [...set].sort();
	const roadCellsBody = JSON.stringify(roadCellsObj);
	await writeFile(`${OUT_DIR}/road-cells.json`, roadCellsBody);

	const manifestBytes = JSON.stringify(manifest).length;
	console.log(
		[
			`Wrote ${cells.size} cell files to ${CELLS_DIR}/`,
			`  cells total:   ${(totalBytes / 1e6).toFixed(2)} MB on disk`,
			`  largest cell:  ${maxKey} = ${(maxBytes / 1024).toFixed(1)} KB`,
			`  manifest.json: ${(manifestBytes / 1024).toFixed(1)} KB`,
			`  road-cells.json: ${(roadCellsBody.length / 1024).toFixed(1)} KB (${Object.keys(roadCellsObj).length} keyed roads)`,
		].join("\n"),
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
