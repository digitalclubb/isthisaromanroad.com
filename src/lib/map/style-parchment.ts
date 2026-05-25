import { PALETTE, type PaletteName } from "$lib/theme.js";
/**
 * A bespoke MapLibre style that renders the basemap as aged parchment (or
 * walnut, in dark mode). Tiles come from OpenFreeMap's planet vector tiles
 * (OpenMapTiles schema) — free, no API key, no usage limit. We author our
 * own layers rather than recolouring the positron style so the map stays
 * sparse: only water, vegetation, a quiet road network, and city/town
 * labels in italic. Nothing else fights the answer for attention.
 *
 * Source: https://openfreemap.org/
 */
import type { StyleSpecification } from "maplibre-gl";

const TILES_URL = "https://tiles.openfreemap.org/planet";
const GLYPHS_URL = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";
const ATTRIBUTION =
	'© <a href="https://www.openstreetmap.org/copyright" rel="noopener" target="_blank">OpenStreetMap</a> · © <a href="https://openfreemap.org" rel="noopener" target="_blank">OpenFreeMap</a> · Roads © <a href="https://itiner-e.org" rel="noopener" target="_blank">Itiner-e</a> (CC BY 4.0)';

// Map-only tints (water, vegetation, roads, etc.) aren't part of the
// canonical UI palette in `src/lib/theme.ts`. They live here, derived from
// the base palette in spirit but tuned for cartographic context.
const mapExtras = {
	parchment: {
		water: "#d4c5a3",
		vegetation: "#d8cba5",
		residential: "#ead9b6",
		boundary: "#8a7556",
		roadMajor: "#6b5a47",
		road: "#8a7558",
		labelSoft: "#5a4b3a",
	},
	walnut: {
		water: "#0f0a07",
		vegetation: "#241a13",
		residential: "#26201a",
		boundary: "#5a4533",
		roadMajor: "#a4896a",
		road: "#7d6645",
		labelSoft: "#9c8a72",
	},
} as const;

export type StyleVariant = PaletteName;

export function buildStyle(variant: StyleVariant): StyleSpecification {
	const base = PALETTE[variant];
	const extras = mapExtras[variant];
	const c = {
		bg: base.bg,
		label: base.ink,
		...extras,
	};
	return {
		version: 8,
		glyphs: GLYPHS_URL,
		sources: {
			openmaptiles: {
				type: "vector",
				url: TILES_URL,
				attribution: ATTRIBUTION,
			},
		},
		layers: [
			{
				id: "background",
				type: "background",
				paint: { "background-color": c.bg },
			},

			// Water — tea-stain fill with a faint shoreline
			{
				id: "water",
				type: "fill",
				source: "openmaptiles",
				"source-layer": "water",
				filter: ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
				paint: {
					"fill-color": c.water,
					"fill-antialias": true,
				},
			},

			// Forests, grass, parks
			{
				id: "landcover-vegetation",
				type: "fill",
				source: "openmaptiles",
				"source-layer": "landcover",
				filter: [
					"all",
					["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
					["match", ["get", "class"], ["wood", "grass"], true, false],
				],
				paint: { "fill-color": c.vegetation, "fill-opacity": 0.6 },
			},
			{
				id: "park",
				type: "fill",
				source: "openmaptiles",
				"source-layer": "park",
				filter: ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
				paint: { "fill-color": c.vegetation, "fill-opacity": 0.45 },
			},

			// Built-up areas — barely-there warm tint
			{
				id: "landuse-residential",
				type: "fill",
				source: "openmaptiles",
				"source-layer": "landuse",
				minzoom: 5,
				filter: [
					"all",
					["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
					["match", ["get", "class"], ["residential", "suburb"], true, false],
				],
				paint: {
					"fill-color": c.residential,
					"fill-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.0, 9, 0.5],
				},
			},

			// Country borders — dashed bronze. Fade out at high zoom so they
			// don't read as roads near street level.
			{
				id: "boundary-country",
				type: "line",
				source: "openmaptiles",
				"source-layer": "boundary",
				filter: ["all", ["<=", ["get", "admin_level"], 2], ["!=", ["get", "maritime"], 1]],
				paint: {
					"line-color": c.boundary,
					"line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.4, 10, 1.0],
					"line-dasharray": [3, 2],
					"line-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0.55, 9, 0.55, 12, 0],
				},
			},

			// Major roads
			{
				id: "road-major",
				type: "line",
				source: "openmaptiles",
				"source-layer": "transportation",
				filter: ["match", ["get", "class"], ["motorway", "trunk"], true, false],
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": c.roadMajor,
					"line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.4, 10, 1.4, 14, 3.0],
					"line-opacity": 0.7,
				},
			},

			// Primary + secondary roads
			{
				id: "road-primary",
				type: "line",
				source: "openmaptiles",
				"source-layer": "transportation",
				minzoom: 7,
				filter: ["match", ["get", "class"], ["primary", "secondary"], true, false],
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": c.road,
					"line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.3, 12, 1.0, 16, 2.4],
					"line-opacity": 0.55,
				},
			},

			// Minor roads — only at close zoom
			{
				id: "road-minor",
				type: "line",
				source: "openmaptiles",
				"source-layer": "transportation",
				minzoom: 11,
				filter: ["match", ["get", "class"], ["tertiary", "minor"], true, false],
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": c.road,
					"line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.2, 16, 1.4],
					"line-opacity": 0.4,
				},
			},

			// City labels — italic small caps
			{
				id: "place-city",
				type: "symbol",
				source: "openmaptiles",
				"source-layer": "place",
				filter: ["==", ["get", "class"], "city"],
				layout: {
					"text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
					"text-font": ["Noto Sans Italic", "Noto Sans Regular"],
					"text-size": ["interpolate", ["linear"], ["zoom"], 4, 10, 10, 18],
					"text-letter-spacing": 0.12,
					"text-transform": "uppercase",
					"text-max-width": 9,
				},
				paint: {
					"text-color": c.label,
					"text-halo-color": c.bg,
					"text-halo-width": 1.6,
					"text-halo-blur": 0.5,
				},
			},

			// Town labels — italic, lower priority
			{
				id: "place-town",
				type: "symbol",
				source: "openmaptiles",
				"source-layer": "place",
				filter: ["==", ["get", "class"], "town"],
				minzoom: 7,
				layout: {
					"text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
					"text-font": ["Noto Sans Italic", "Noto Sans Regular"],
					"text-size": ["interpolate", ["linear"], ["zoom"], 7, 9, 12, 13],
					"text-letter-spacing": 0.08,
					"text-max-width": 8,
				},
				paint: {
					"text-color": c.labelSoft,
					"text-halo-color": c.bg,
					"text-halo-width": 1.3,
				},
			},

			// Village labels — only very close
			{
				id: "place-village",
				type: "symbol",
				source: "openmaptiles",
				"source-layer": "place",
				filter: ["==", ["get", "class"], "village"],
				minzoom: 11,
				layout: {
					"text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
					"text-font": ["Noto Sans Italic", "Noto Sans Regular"],
					"text-size": 11,
					"text-letter-spacing": 0.05,
					"text-max-width": 8,
				},
				paint: {
					"text-color": c.labelSoft,
					"text-halo-color": c.bg,
					"text-halo-width": 1,
					"text-opacity": ["interpolate", ["linear"], ["zoom"], 11, 0, 13, 1],
				},
			},
		],
	};
}
