<script lang="ts">
import { type StyleVariant, buildStyle } from "$lib/map/style-parchment.js";
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
			// Roman-road overlay colours mirror the design tokens in src/app.css.
			const COLOUR_VELLUM = variant === "walnut" ? "#26201a" : "#f6ecd6";
			const COLOUR_TERRACOTTA = variant === "walnut" ? "#d2735a" : "#a24b36";
			const COLOUR_GOLD = variant === "walnut" ? "#d4a75a" : "#9e7b3f";
			const COLOUR_VERDIGRIS = variant === "walnut" ? "#6fa89e" : "#3d6e66";
			const COLOUR_INK = variant === "walnut" ? "#f0e6d2" : "#2a1f17";

			map.addSource("road", { type: "geojson", data: emptyFc() });
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
		map?.remove();
		map = null;
	};
});

function emptyFc(): GeoJSON.FeatureCollection {
	return { type: "FeatureCollection", features: [] };
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
		font-family: var(--font-body);
	}
	@media (prefers-color-scheme: dark) {
		.map :global(.maplibregl-ctrl-attrib) {
			background: rgb(27 20 16 / 0.75);
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
</style>
