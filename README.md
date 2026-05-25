# isthisaromanroad.com

A single-page PWA that answers a child's question from the back seat: **is this a Roman road?**

Tap *Use my location* (or search a UK town / postcode) and the site checks your point against the full Itiner-e Roman roads dataset for Britain. If you're within 50 m of a known Roman line, it tells you yes — and gives you the road's Roman name, type, certainty, and historical context. Otherwise it shows the nearest, how far away, and which direction.

## Stack

- **SvelteKit 2** (Svelte 5 runes) + TypeScript
- **pnpm** for package management
- **Biome** for lint + format
- **MapLibre GL JS** with free CartoDB Voyager raster tiles (no API key, no billing surprises)
- **Nominatim** for postcode / place geocoding
- **RBush** spatial index + **Turf.js** for distance/nearest-point queries
- **@vite-pwa/sveltekit** (Workbox) for offline PWA
- **Vercel** for hosting (`@sveltejs/adapter-vercel`)
- **Itiner-e** dataset (CC BY 4.0) for road geometry — see `scripts/build-roads.ts`

## Quickstart

```bash
pnpm install
pnpm data:build    # one-time: download Itiner-e (~78 MB) and write static/roads.geojson
pnpm icons:build   # render PWA icons + og.png from inline SVG
pnpm dev           # local dev server
```

Then open http://localhost:5173.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Production build (prerendered index + Vercel adapter output) |
| `pnpm preview` | Serve the production build locally |
| `pnpm check` | `svelte-check` typecheck across .ts and .svelte |
| `pnpm lint` | Biome lint + format check |
| `pnpm fix` | Biome auto-fix |
| `pnpm data:build` | Re-download Itiner-e and rebuild `static/roads.geojson` |
| `pnpm icons:build` | Re-render PWA icons + Open Graph card |

## Project layout

```
src/
  app.css                  # global styles + design tokens
  app.html                 # HTML shell
  routes/
    +layout.{ts,svelte}    # prerender=true, global wrapper
    +page.svelte           # the single page UI
    sitemap.xml/+server.ts # generated sitemap
  lib/
    roads.ts               # RoadIndex (RBush + Turf nearest-point-on-line)
    geocode.ts             # Nominatim wrapper
    format.ts              # display helpers + narrative generator
    components/Map.svelte  # MapLibre lifecycle + overlay layers
scripts/
  build-roads.ts           # Itiner-e download → reproject → UK filter
  generate-icons.ts        # SVG → PNG icon set + OG card
  smoke-test.ts            # sanity check the road index against known UK points
static/
  roads.geojson            # built artefact (UK subset, ~600 KB)
  icons/, og.png, ...      # built artefacts
data/raw/                  # cached Itiner-e download (gitignored)
```

## Data

The road data is **Itiner-e** (de Soto et al., *Scientific Data* 2025, CC BY 4.0): https://itiner-e.org. The build script downloads the empire-wide GeoJSON (~78 MB), reprojects from EPSG:3395 (World Mercator) to WGS84, filters to the UK + Isle of Man + Channel Islands bbox, slims the properties to the fields used by the UI, and writes `static/roads.geojson` (1,392 features, ~600 KB raw / ~150 KB gzipped).

Geometry is matched with a 50 m buffer for the "yes, you're on it" answer (`ON_ROAD_THRESHOLD_M` in `src/routes/+page.svelte`). This is intentionally lenient — Roman road centrelines have positional uncertainty and consumer GPS adds another ~10 m.

## Attribution requirements

If you fork or self-host:

- Itiner-e (CC BY 4.0) — cite de Soto et al. 2025 and link to https://itiner-e.org. Currently in the in-app map attribution and the footer.
- OpenStreetMap + CARTO — required by the basemap tile provider.
- Nominatim — required to identify your app via a custom User-Agent if you serve to a real audience (replace the default fetch headers in `src/lib/geocode.ts`).

## License

Code is unlicensed for now — ask before reusing. The data layer carries the Itiner-e CC BY 4.0 terms regardless.
