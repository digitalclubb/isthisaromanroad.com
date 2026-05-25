/**
 * Canonical hex values for the Editio II palette. The CSS in `src/app.css`
 * is the runtime source of truth for the page itself; this module mirrors
 * the same values for the three contexts that *can't* read CSS custom
 * properties:
 *
 *   - MapLibre paint properties (Map.svelte, style-parchment.ts)
 *   - html-to-image rasterisation (ShareCard.svelte — computed styles
 *     resolve vars, but inline hex avoids font-family roundtrips and makes
 *     the captured CSS smaller)
 *   - Resvg SVG rendering at build time (scripts/generate-icons.ts)
 *
 * If `src/app.css` palette tokens change, update this file in the same
 * commit. Both files reference the same names so a diff is trivial.
 */

export const PALETTE = {
	parchment: {
		bg: "#efe4cd",
		surface: "#f6ecd6",
		surfaceDeep: "#e4d5b7",
		ink: "#2a1f17",
		inkSoft: "#6b5a47",
		brand: "#a24b36",
		brandDeep: "#6e2a22",
		ok: "#3d6e66",
		gold: "#9e7b3f",
		goldSoft: "#c8a35a",
	},
	walnut: {
		bg: "#1b1410",
		surface: "#2a1f18",
		surfaceDeep: "#36281e",
		ink: "#f0e6d2",
		inkSoft: "#b8a98f",
		brand: "#d2735a",
		brandDeep: "#d77a5d",
		ok: "#6fa89e",
		gold: "#d4a75a",
		goldSoft: "#e9c887",
	},
} as const;

export type PaletteName = keyof typeof PALETTE;
export type PaletteColours = (typeof PALETTE)[PaletteName];
