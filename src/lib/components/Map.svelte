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
			map.addSource("road", { type: "geojson", data: emptyFc() });
			map.addLayer({
				id: "road-line-casing",
				type: "line",
				source: "road",
				paint: {
					"line-color": "#fbf6ef",
					"line-width": 8,
					"line-opacity": 0.9,
				},
			});
			map.addLayer({
				id: "road-line",
				type: "line",
				source: "road",
				paint: {
					"line-color": "#8b1e2a",
					"line-width": 4,
				},
			});
			map.addSource("point-on-road", { type: "geojson", data: emptyFc() });
			map.addLayer({
				id: "point-on-road",
				type: "circle",
				source: "point-on-road",
				paint: {
					"circle-radius": 6,
					"circle-color": "#8b1e2a",
					"circle-stroke-color": "#fff",
					"circle-stroke-width": 2,
				},
			});
			map.addSource("user", { type: "geojson", data: emptyFc() });
			map.addLayer({
				id: "user-halo",
				type: "circle",
				source: "user",
				paint: {
					"circle-radius": 14,
					"circle-color": "#1d4ed8",
					"circle-opacity": 0.18,
				},
			});
			map.addLayer({
				id: "user",
				type: "circle",
				source: "user",
				paint: {
					"circle-radius": 7,
					"circle-color": "#1d4ed8",
					"circle-stroke-color": "#fff",
					"circle-stroke-width": 2,
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
		background: #e8e3d7;
	}
	.map :global(.maplibregl-ctrl-attrib) {
		font-size: 11px;
	}
</style>
