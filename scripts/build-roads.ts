/**
 * Downloads the Itiner-e Roman roads dataset from Zenodo, reprojects from
 * EPSG:3395 (World Mercator) to EPSG:4326 (WGS84), filters to a UK bounding
 * box, slims the properties, and writes a static GeoJSON the site loads at
 * runtime.
 *
 * Source: de Soto et al. 2025, Scientific Data — CC BY 4.0
 * https://doi.org/10.5281/zenodo.17122148
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Feature, FeatureCollection, LineString, MultiLineString, Position } from "geojson";
import proj4 from "proj4";

const ITINERE_URL = "https://zenodo.org/api/records/17122148/files/itinere_roads.geojson/content";
const RAW_PATH = "data/raw/itinere_roads.geojson";
const OUT_PATH = "static/roads.geojson";

// Tight UK + Isle of Man + Channel Islands bbox in WGS84
const UK_BBOX: [number, number, number, number] = [-8.65, 49.85, 1.77, 60.85];

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

function reprojectPos(c: Position): [number, number] {
	const [lng, lat] = project.forward([c[0], c[1]]);
	return [lng, lat];
}

function inBbox(lng: number, lat: number): boolean {
	return lng >= UK_BBOX[0] && lng <= UK_BBOX[2] && lat >= UK_BBOX[1] && lat <= UK_BBOX[3];
}

function lineIntersectsUk(coords: Position[]): boolean {
	for (const c of coords) {
		if (inBbox(c[0], c[1])) return true;
	}
	return false;
}

function geomIntersectsUk(geometry: LineString | MultiLineString | null): boolean {
	if (!geometry) return false;
	if (geometry.type === "LineString") {
		return lineIntersectsUk(geometry.coordinates);
	}
	if (geometry.type === "MultiLineString") {
		return geometry.coordinates.some(lineIntersectsUk);
	}
	return false;
}

function round(n: number, places = 5): number {
	const p = 10 ** places;
	return Math.round(n * p) / p;
}

function reprojectLine(line: Position[]): [number, number][] {
	const out: [number, number][] = [];
	for (const c of line) {
		const [lng, lat] = reprojectPos(c);
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

async function main() {
	await download();
	console.log("Parsing…");
	const raw = await readFile(RAW_PATH, "utf8");
	const fc = JSON.parse(raw) as FeatureCollection;
	console.log(`Total features: ${fc.features.length}`);

	// Project the UK bbox into source CRS once so we can fast-reject features
	// without reprojecting their full geometry. ~15k features * dozens of points
	// each is enough work to make this worthwhile.
	const inverse = proj4(DST, SRC);
	const [sw0, sw1] = inverse.forward([UK_BBOX[0], UK_BBOX[1]]);
	const [ne0, ne1] = inverse.forward([UK_BBOX[2], UK_BBOX[3]]);
	const srcBbox: [number, number, number, number] = [
		Math.min(sw0, ne0),
		Math.min(sw1, ne1),
		Math.max(sw0, ne0),
		Math.max(sw1, ne1),
	];
	const srcIntersects = (coords: Position[]): boolean => {
		for (const c of coords) {
			if (c[0] >= srcBbox[0] && c[0] <= srcBbox[2] && c[1] >= srcBbox[1] && c[1] <= srcBbox[3])
				return true;
		}
		return false;
	};
	const srcGeomIntersects = (g: LineString | MultiLineString): boolean =>
		g.type === "LineString" ? srcIntersects(g.coordinates) : g.coordinates.some(srcIntersects);

	const ukFeatures: Feature[] = [];
	let scanned = 0;
	for (const f of fc.features) {
		scanned++;
		const g = f.geometry as LineString | MultiLineString | null;
		if (!g) continue;
		if (!srcGeomIntersects(g)) continue;
		const reprojected = reprojectGeometry(g);
		if (!geomIntersectsUk(reprojected)) continue;
		ukFeatures.push({
			type: "Feature",
			id: f.id,
			properties: cleanProps(f.properties),
			geometry: reprojected,
		});
		if (scanned % 2000 === 0) console.log(`  scanned ${scanned}/${fc.features.length}`);
	}
	console.log(`UK-intersecting features: ${ukFeatures.length}`);

	if (ukFeatures.length > 0) {
		console.log(
			"Sample UK feature:",
			JSON.stringify({ id: ukFeatures[0].id, properties: ukFeatures[0].properties }, null, 2),
		);
	}

	const out: FeatureCollection = {
		type: "FeatureCollection",
		features: ukFeatures,
	};
	await writeFile(OUT_PATH, JSON.stringify(out));
	const s = await stat(OUT_PATH);
	console.log(`Wrote ${OUT_PATH}: ${ukFeatures.length} features, ${(s.size / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
