<script lang="ts">
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

		map = new maplibregl.Map({
			container,
			style: {
				version: 8,
				sources: {
					basemap: {
						type: "raster",
						tiles: [
							"https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
							"https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
							"https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
							"https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
						],
						tileSize: 256,
						attribution:
							'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a> · Roads © <a href="https://itiner-e.org">Itiner-e</a> (CC BY 4.0)',
					},
				},
				layers: [{ id: "basemap", type: "raster", source: "basemap" }],
			},
			center: [-2.5, 54],
			zoom: 5,
			attributionControl: { compact: true },
		});
		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

		map.on("load", () => {
			if (!map) return;
			// Colours inline below mirror the design tokens in src/app.css.
			// (MapLibre paint props don't read CSS custom properties.)
			const COLOUR_CREAM = "#fcf8ec"; // --surface
			const COLOUR_VERMILION = "#c8312b"; // --brand (Pompeii red)
			const COLOUR_GOLD = "#d4a437"; // --gold (Imperial gold)
			const COLOUR_BLUE = "#1034a6"; // --blue (Egyptian blue)

			map.addSource("road", { type: "geojson", data: emptyFc() });
			map.addLayer({
				id: "road-line-casing",
				type: "line",
				source: "road",
				paint: {
					"line-color": COLOUR_CREAM,
					"line-width": 9,
					"line-opacity": 0.95,
				},
				layout: { "line-cap": "round", "line-join": "round" },
			});
			map.addLayer({
				id: "road-line",
				type: "line",
				source: "road",
				paint: { "line-color": COLOUR_VERMILION, "line-width": 4 },
				layout: { "line-cap": "round", "line-join": "round" },
			});
			map.addSource("point-on-road", { type: "geojson", data: emptyFc() });
			// On-road pin: dark fill with a gold halo so it doesn't camouflage
			// against the vermilion road line (gold + red are adjacent warms).
			map.addLayer({
				id: "point-on-road-halo",
				type: "circle",
				source: "point-on-road",
				paint: {
					"circle-radius": 15,
					"circle-color": COLOUR_GOLD,
					"circle-opacity": 0.42,
				},
			});
			map.addLayer({
				id: "point-on-road",
				type: "circle",
				source: "point-on-road",
				paint: {
					"circle-radius": 7,
					"circle-color": "#1f1a14",
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
					"circle-radius": 16,
					"circle-color": COLOUR_BLUE,
					"circle-opacity": 0.16,
				},
			});
			map.addLayer({
				id: "user",
				type: "circle",
				source: "user",
				paint: {
					"circle-radius": 7,
					"circle-color": COLOUR_BLUE,
					"circle-stroke-color": COLOUR_CREAM,
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

	// Fit to the relevant geometry
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
			{ padding: 80, maxZoom: 15, duration: 800 },
		);
	} else if (userPoint) {
		map.flyTo({ center: userPoint, zoom: 13, duration: 800 });
	}
});
</script>

<div bind:this={container} class="map" aria-label="Map showing your location and the nearest Roman road"></div>

<style>
	.map {
		width: 100%;
		height: 100%;
		min-height: 320px;
		background: var(--surface-warm, #fbeaca);
	}
	.map :global(.maplibregl-ctrl-attrib) {
		font-size: 11px;
	}
</style>
