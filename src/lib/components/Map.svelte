<script lang="ts">
import { type StyleVariant, buildStyle } from "$lib/map/style-parchment.js";
import { PALETTE } from "$lib/theme.js";
import type { Feature, LineString, MultiLineString } from "geojson";
import type { GeoJSONSource, Map as MaplibreMap } from "maplibre-gl";
import { onMount } from "svelte";

type Props = {
	userPoint: [number, number] | null;
	roadFeature: Feature<LineString | MultiLineString> | null;
	pointOnRoad: [number, number] | null;
};

const { userPoint, roadFeature, pointOnRoad }: Props = $props();

let container: HTMLDivElement;
let map: MaplibreMap | null = null;
let loaded = $state(false);

let roadColour: string = PALETTE.parchment.brand;
let casingColour: string = PALETTE.parchment.surface;
let drawnRoadKey: string | null = null;
let drawAnimFrame = 0;

onMount(() => {
	let disposed = false;
	(async () => {
		const maplibregl = (await import("maplibre-gl")).default;
		if (disposed) return;

		const variant: StyleVariant = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "walnut"
			: "parchment";

		map = new maplibregl.Map({
			container,
			style: buildStyle(variant),
			center: [-2.5, 54],
			zoom: 5,
			attributionControl: { compact: true },
			maxPitch: 0,
		});
		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

		map.on("load", () => {
			if (disposed || !map) return;
			const p = PALETTE[variant];
			const COLOUR_VELLUM = p.surface;
			const COLOUR_TERRACOTTA = p.brand;
			const COLOUR_GOLD = p.gold;
			const COLOUR_VERDIGRIS = p.ok;
			const COLOUR_INK = p.ink;

			// lineMetrics: true is required for the line-gradient + line-progress
			// "draw-on" animation below.
			map.addSource("road", {
				type: "geojson",
				data: emptyFc(),
				lineMetrics: true,
			});
			map.addLayer({
				id: "road-line-casing",
				type: "line",
				source: "road",
				paint: {
					"line-color": COLOUR_VELLUM,
					"line-width": 10,
					"line-opacity": 0.92,
				},
				layout: { "line-cap": "round", "line-join": "round" },
			});
			map.addLayer({
				id: "road-line",
				type: "line",
				source: "road",
				paint: { "line-color": COLOUR_TERRACOTTA, "line-width": 4 },
				layout: { "line-cap": "round", "line-join": "round" },
			});

			// Cache the final colours on the map object so the draw-on animation
			// outside this scope can reach them without re-computing.
			roadColour = COLOUR_TERRACOTTA;
			casingColour = COLOUR_VELLUM;
			map.addSource("point-on-road", { type: "geojson", data: emptyFc() });
			map.addLayer({
				id: "point-on-road-halo",
				type: "circle",
				source: "point-on-road",
				paint: {
					"circle-radius": 16,
					"circle-color": COLOUR_GOLD,
					"circle-opacity": 0.38,
				},
			});
			map.addLayer({
				id: "point-on-road",
				type: "circle",
				source: "point-on-road",
				paint: {
					"circle-radius": 6,
					"circle-color": COLOUR_INK,
					"circle-stroke-color": COLOUR_GOLD,
					"circle-stroke-width": 2.5,
				},
			});
			map.addSource("user", { type: "geojson", data: emptyFc() });
			map.addLayer({
				id: "user-halo",
				type: "circle",
				source: "user",
				paint: {
					"circle-radius": 18,
					"circle-color": COLOUR_VERDIGRIS,
					"circle-opacity": 0.22,
				},
			});
			map.addLayer({
				id: "user",
				type: "circle",
				source: "user",
				paint: {
					"circle-radius": 7,
					"circle-color": COLOUR_VERDIGRIS,
					"circle-stroke-color": COLOUR_VELLUM,
					"circle-stroke-width": 2.5,
				},
			});
			loaded = true;
		});
	})();

	return () => {
		disposed = true;
		if (drawAnimFrame) cancelAnimationFrame(drawAnimFrame);
		map?.remove();
		map = null;
	};
});

function emptyFc(): GeoJSON.FeatureCollection {
	return { type: "FeatureCollection", features: [] };
}

function roadKey(f: Feature<LineString | MultiLineString> | null): string | null {
	if (!f) return null;
	if (f.id != null) return String(f.id);
	// Fall back to first coord — stable enough for distinct feature detection
	const g = f.geometry;
	const first = g.type === "LineString" ? g.coordinates[0] : g.coordinates[0]?.[0];
	return first ? `${first[0]},${first[1]}` : null;
}

/**
 * Animates the road's line-gradient so the Roman line draws itself onto the
 * parchment from start to end. Uses line-progress (requires lineMetrics on
 * the source). Respects prefers-reduced-motion by snapping to the final
 * solid colour with no animation.
 */
function clearGradient() {
	if (!map) return;
	map.setPaintProperty("road-line", "line-gradient", null);
	map.setPaintProperty("road-line-casing", "line-gradient", null);
	map.setPaintProperty("road-line", "line-color", roadColour);
	map.setPaintProperty("road-line-casing", "line-color", casingColour);
}

function animateDrawOn() {
	if (!map) return;
	if (drawAnimFrame) cancelAnimationFrame(drawAnimFrame);

	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduced) {
		// Clear any gradient left over from a prior animated render so
		// `line-color` actually shows. (line-gradient takes precedence.)
		clearGradient();
		return;
	}

	const start = performance.now();
	const duration = 1100;
	const TRANSPARENT = "rgba(0,0,0,0)";

	const step = (now: number) => {
		if (!map) return;
		const t = Math.min(1, (now - start) / duration);
		const eased = 1 - (1 - t) ** 3; // easeOutCubic
		// Clamp the boundary to (0, 1) — step expression with boundary
		// exactly at 1 leaves the very last pixel transparent.
		const cut = Math.max(0.001, Math.min(0.999, eased));
		map.setPaintProperty("road-line", "line-gradient", [
			"step",
			["line-progress"],
			roadColour,
			cut,
			TRANSPARENT,
		]);
		map.setPaintProperty("road-line-casing", "line-gradient", [
			"step",
			["line-progress"],
			casingColour,
			cut,
			TRANSPARENT,
		]);
		if (t < 1) {
			drawAnimFrame = requestAnimationFrame(step);
		} else {
			// Animation complete — drop the gradient and let the solid
			// line-color render the final state cleanly (no clipped end-pixel,
			// no lingering per-frame cost).
			drawAnimFrame = 0;
			clearGradient();
		}
	};
	drawAnimFrame = requestAnimationFrame(step);
}

$effect(() => {
	if (!loaded || !map) return;

	const userSrc = map.getSource("user") as GeoJSONSource | undefined;
	userSrc?.setData(
		userPoint
			? {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							properties: {},
							geometry: { type: "Point", coordinates: userPoint },
						},
					],
				}
			: emptyFc(),
	);

	const roadSrc = map.getSource("road") as GeoJSONSource | undefined;
	roadSrc?.setData(
		roadFeature ? { type: "FeatureCollection", features: [roadFeature] } : emptyFc(),
	);

	// When the road feature changes, draw the new line onto the parchment.
	const nextKey = roadKey(roadFeature);
	if (nextKey && nextKey !== drawnRoadKey) {
		drawnRoadKey = nextKey;
		animateDrawOn();
	} else if (!nextKey) {
		drawnRoadKey = null;
	}

	const ponrSrc = map.getSource("point-on-road") as GeoJSONSource | undefined;
	ponrSrc?.setData(
		pointOnRoad
			? {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							properties: {},
							geometry: { type: "Point", coordinates: pointOnRoad },
						},
					],
				}
			: emptyFc(),
	);

	if (userPoint && pointOnRoad) {
		const minX = Math.min(userPoint[0], pointOnRoad[0]);
		const maxX = Math.max(userPoint[0], pointOnRoad[0]);
		const minY = Math.min(userPoint[1], pointOnRoad[1]);
		const maxY = Math.max(userPoint[1], pointOnRoad[1]);
		map.fitBounds(
			[
				[minX, minY],
				[maxX, maxY],
			],
			{ padding: 80, maxZoom: 15, duration: 900 },
		);
	} else if (userPoint) {
		map.flyTo({ center: userPoint, zoom: 13, duration: 900 });
	}
});
</script>

<div
	bind:this={container}
	class="map"
	aria-label="Map showing your location and the nearest Roman road"
></div>

<style>
	.map {
		width: 100%;
		height: 100%;
		min-height: 280px;
		background: var(--bg);
	}
	.map :global(.maplibregl-ctrl-attrib) {
		font-size: 10px;
		background: rgb(239 228 205 / 0.7);
		color: var(--ink-soft);
		font-family: var(--font-body);
	}
	.map :global(.maplibregl-ctrl-attrib a) {
		color: var(--ink-soft);
		text-decoration-color: var(--gold);
	}
	.map :global(.maplibregl-ctrl-attrib a:hover) {
		color: var(--brand-deep);
	}
	@media (prefers-color-scheme: dark) {
		.map :global(.maplibregl-ctrl-attrib) {
			background: rgb(27 20 16 / 0.75);
		}
		.map :global(.maplibregl-ctrl-attrib a:hover) {
			color: var(--gold-soft);
		}
	}
	.map :global(.maplibregl-ctrl-group) {
		background: var(--surface);
		box-shadow: var(--shadow);
		border-radius: 999px;
		overflow: hidden;
	}
	.map :global(.maplibregl-ctrl-group button) {
		color: var(--ink);
	}
	.map :global(.maplibregl-ctrl-group button:hover) {
		background: var(--surface-deep);
	}
</style>
