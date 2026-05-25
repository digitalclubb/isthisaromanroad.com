/**
 * Smoke test the road index against known UK locations.
 * Usage: node --experimental-strip-types scripts/smoke-test.ts
 */
import { readFile } from "node:fs/promises";
import { answerTierFor, bearingToCompass } from "../src/lib/format.ts";
import { RoadIndex } from "../src/lib/roads.ts";

const fc = JSON.parse(await readFile("static/roads.geojson", "utf8"));
const idx = new RoadIndex(fc);
console.log(`Indexed ${idx.featureCount} features`);

const cases: Array<{ name: string; lng: number; lat: number }> = [
	// Watling Street (now A2) somewhere east of London
	{ name: "A2 near Bexley (Watling St)", lng: 0.1487, lat: 51.4416 },
	// Fosse Way near Cirencester
	{ name: "Cirencester (Corinium)", lng: -1.9684, lat: 51.7194 },
	// Ermine Street near Lincoln
	{ name: "Lincoln (Lindum)", lng: -0.5406, lat: 53.2307 },
	// London (Londinium)
	{ name: "City of London", lng: -0.0894, lat: 51.5128 },
	// Hounslow centroid — the case that motivated the five-tier refactor
	{ name: "Hounslow (centroid)", lng: -0.367, lat: 51.47 },
	// Edinburgh — way north of Roman Britain proper
	{ name: "Edinburgh", lng: -3.1883, lat: 55.9533 },
	// Middle of the sea (no road nearby)
	{ name: "North Sea (off Norfolk)", lng: 2.5, lat: 53.0 },
];

for (const { name, lng, lat } of cases) {
	const r = idx.findNearest(lng, lat);
	if (!r) {
		console.log(`${name}: no road found`);
		continue;
	}
	const tier = answerTierFor(r.distanceMeters, r.road.properties.certainty);
	console.log(
		`${name}: ${tier.padEnd(8)} ${r.distanceMeters.toFixed(0).padStart(6)}m ${bearingToCompass(r.bearingFromUser)} | ${r.road.properties.itinerary ?? r.road.properties.name ?? "(unnamed)"} | ${r.road.properties.type ?? "?"} | ${r.road.properties.certainty ?? "?"}`,
	);
}
