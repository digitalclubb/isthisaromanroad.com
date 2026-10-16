# isthisaromanroad.com

A single-page PWA that answers a child's question from the back seat: **is this a Roman road?**

Tap *Use my location* (or search any town / postcode) and the site checks your point against the full empire-wide Itiner-e Roman roads dataset. The answer comes in five tiers — walking the line, standing on it, nearly there, probably not, or out of reach — and the bands honour the dataset's own reconstructive uncertainty. You get the road's Roman name, type, certainty, and historical context. Hand-written histories cover the famous roads of Britain and ten great roads of the empire, from the Via Appia to the Via Nova Traiana in Jordan; everywhere else falls back gracefully to the dataset's own record.

Alongside the app there is a set of static, crawlable pages: `/roads` lists every named Roman road in Britain, `/road/<slug>` gives each one its route, the modern roads that follow it, where to see it on the ground, and a short FAQ, `/roads/<country>` covers the network in each of the 26 other modern countries the survey reaches, `/roads/britain/<county>` does the same for 26 British counties, and `/modern-roads` answers the "is the A5 a Roman road?" family of questions in one place rather than a page per road number.

## Stack

- **SvelteKit 2** (Svelte 5 runes) + TypeScript
- **pnpm** for package management
- **Biome** for lint + format
- **MapLibre GL JS** with free CartoDB Voyager raster tiles (no API key, no billing surprises)
- **Nominatim** for postcode / place geocoding
- **Location-partitioned static data** (a 1°×1° cell grid is the spatial index) + **Turf.js** for nearest-point queries
- **@vite-pwa/sveltekit** (Workbox) for offline PWA
- **Cormorant Garamond** (display) + **Inter** (body), self-hosted via Fontsource
- **Vercel** for hosting (`@sveltejs/adapter-vercel`)
- **Itiner-e** dataset (CC BY 4.0) for road geometry — see `scripts/build-roads.ts`

## Design language

The current edition is **Editio II — Parchment & Walnut**: a muted, atmospheric palette grounded in actual Roman material colour (Pompeii terracotta, oxblood, verdigris, travertine, bronze) and a serif-led type system (Cormorant Garamond for the display headlines and italic Latin names, Inter for everything else). Design tokens live in `src/app.css`; the same names work as Tailwind v4 `@theme` variables if the project ever migrates.

## Quickstart

```bash
pnpm install
pnpm data:build    # one-time: download Itiner-e (~78 MB) and write static/roads/ cells
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
| `pnpm data:build` | Re-download Itiner-e and rebuild the `static/roads/` cell grid |
| `pnpm data:smoke` | Probe the partitioned index against known locations (via `tsx`) |
| `pnpm data:regions` | Assign every road segment to a modern country (writes `data/regions.json`) |
| `pnpm data:counties` | Assign British segments to historic counties (writes `data/counties.json`) |
| `pnpm icons:build` | Re-render PWA icons + the site and per-page Open Graph cards |

## Project layout

```
src/
  app.css                  # global styles + design tokens
  app.html                 # HTML shell
  routes/
    +layout.{ts,svelte}    # prerender=true, global wrapper
    +page.svelte           # the single page UI
    roads/                 # /roads hub: every named road, with measured figures
    road/[slug]/           # one prerendered page per famous road
    sitemap.xml/+server.ts # generated sitemap
  lib/
    roads.ts               # lazy cell-based RoadIndex + Turf nearest-point-on-line
    geocode.ts             # Nominatim wrapper
    format.ts              # display helpers + narrative generator
    geometry.ts            # build-time length / date / certainty maths over features
    stories.ts             # 32 road stories, 22 British + 10 empire (also client-side: keep it small)
    road-detail.ts         # long-form road-page copy (server-only, never bundled)
    breadcrumbs.ts         # Crumb type + BreadcrumbList JSON-LD from one source
    region-notes.ts        # authored notes per country (server-only)
    county-notes.ts        # authored notes + named roads per county (server-only)
    modern-roads.ts        # which modern roads follow Roman lines (server-only)
    road-names.ts          # tells a road name from an ancient source in `itinerary`
    server/roads-data.ts   # build-time: reassemble all features from cells (road pages)
    server/regions.ts      # build-time: per-country figures and named roads
    server/counties.ts     # build-time: per-county figures and named roads
    components/Map.svelte  # MapLibre lifecycle + overlay layers
scripts/
  build-roads.ts           # Itiner-e download → reproject → partition into cells
  build-regions.ts         # tag each segment with a modern country (data/regions.json)
  build-counties.ts        # tag British segments with a historic county (data/counties.json)
  geo-assign.ts            # shared point-in-polygon + arc-length sampling
  uk-counties.ts           # local-government area → historic county merge table
  generate-icons.ts        # SVG → PNG icon set + site and per-page OG cards
  smoke-test.ts            # probe the partitioned index against known locations
static/
  roads/                   # built artefacts: cells/<ix>_<iy>.json + manifest + road-cells
  icons/, og.png, ...      # built artefacts
data/regions.json          # segment → country assignment (committed, built artefact)
data/counties.json         # British segment → county assignment (committed, built artefact)
data/raw/                  # cached Itiner-e + Natural Earth downloads (gitignored)
```

## Data

The road data is **Itiner-e** (de Soto et al., *Scientific Data* 2025, CC BY 4.0): https://itiner-e.org. The build script downloads the empire-wide GeoJSON (~78 MB), reprojects from EPSG:3395 (World Mercator) to WGS84, slims the properties to the fields used by the UI, and partitions all 14,769 features into a 1°×1° cell grid under `static/roads/` (726 cell files, plus `manifest.json` and `road-cells.json`). The live app fetches only the cells around a query point — a few KB to ~90 KB gzipped per location — so the whole world's data is never shipped at once. The grid is the spatial index; there is no client-side tree to build.

The prerendered `/road/[slug]` pages run at build time and need every feature, so `src/lib/server/roads-data.ts` reassembles the full set from the cells (server-only, memoised) — that file is never sent to the browser.

**How road pages find their line.** Itiner-e's `itinerary` field names only six British roads (Watling Street, Ermine Street, the Fosse Way, Stane Street, Akeman Street and Dere Street), plus one segment matching High Street. The other fifteen stories match on the survey's own segment names instead, Margary-style "A-B" pairs such as `Combretovium-Camulodunum` for the Pye Road, chosen by checking each segment's endpoints against the road's known course (see the `match` arrays in `src/lib/stories.ts`). Before that those pages drew no line, and Google classed the Pye Road page as a soft 404. If a story ever matches nothing, the page says so rather than reporting a length: `totalLengthKm` returns `null`, never `0`, for an empty segment set so it can't be rendered as "0 km surveyed". Each story also carries a hand-written `route` (title) and `summary` (meta description).

**Roads beyond Britain.** Empire stories carry `countries` (the `/roads/[country]` slugs they cross, primary first), which drives the road page's breadcrumb and "Countries it crosses" list and lets each country page link its named roads to their history. Itiner-e names these roads directly in `itinerary`, and itinerary entries are matched whole, so "Via Domitia" does not catch "Via Domitiana". Where the survey reuses a name for two roads ("Via Traiana" is also a road near Aachen) the story sets `bounds` to keep the right one.

Distance is graded into five tiers by `answerTierFor` in `src/lib/format.ts`. The bands respect the road's own certainty rating: ≤10 m is "walking", ≤80 m on a Certain segment (≤150 m on a Conjectured or Hypothetical one) is "standing on the line", ≤500 m is "nearly", ≤50 km is "probably not", beyond that is "out of reach". The wider bands on uncertain segments reflect what the dataset actually claims to know: an Itiner-e line on a Hypothetical reconstruction can sit 50–200 m from the road's true position on the ground.

### Open Graph cards

`pnpm icons:build` renders `static/og.png` for the site plus a card per road, country and county under `static/og/` — 74 files, ~5 MB. Every road page used to share the one generic card, so every share of every page looked identical in a feed. resvg has no text layout engine, so headline size steps down with string length rather than wrapping.

These are excluded from the PWA precache in `vite.config.ts`: they are fetched only by crawlers and social scrapers, and precaching them would cost every visitor over 4 MB for nothing.

### Country pages

The Itiner-e properties carry no country field, so `scripts/build-regions.ts` derives one: it samples five points along each road and assigns the segment to whichever Natural Earth 1:110m country polygon holds the majority. 14,446 of the 14,769 segments resolve; the rest are offshore or in territorial water. A country earns a page if the survey names at least one road in it, or if it has at least 100 segments: twelve countries (Spain among them, despite 1,466 segments) carry no `itinerary` token at all, so a named-roads-only rule would drop some of the largest networks in the empire. Countries clearing neither bar get no page — a map, three numbers and eighty words is the thin-content shape that gets a whole site demoted, not just one page.

The United Kingdom is deliberately excluded from `/roads/<country>` because `/roads` already covers Britain in more depth, and two pages competing for the same query with overlapping content helps neither.

Country maps prerender **simplified** geometry: properties stripped, Douglas-Peucker at a 500 m tolerance, coordinates rounded to three decimals. Without that, Turkey's 2,028 segments inlined a 4.4 MB HTML page; with it the same page is 364 KB raw and 59 KB gzipped, and at country zoom the simplification is well under one screen pixel.

### County pages

`scripts/build-counties.ts` does for Britain what `build-regions.ts` does for the world, using Natural Earth 1:10m Admin 1 (the 110m set has no subdivisions). Its British units are current local-government areas — administrative counties, unitary authorities, metropolitan and London boroughs — so `uk-counties.ts` folds them into the historic counties people actually search for. Nobody looks up "Roman roads in Central Bedfordshire"; Yorkshire is one county rather than four ridings and a dozen boroughs.

Note the framing: the base units are *modern* boundaries, so a "county" here is the traditional area reassembled from its present-day parts, not a pre-1974 boundary survey. Denbighshire, Flintshire, Monmouthshire and Anglesey are left as themselves rather than folded into Clwyd or Gwent, which are 1974 creations abolished in 1996.

A county earns a page only if it has an authored entry in `county-notes.ts`, which by construction means a hand-written paragraph, a place to go and see, and at least one named road with a page on this site. Itiner-e names just six British roads, so a county without that would be a map and two numbers — 26 counties qualify. The 15-segment floor in the build script only bounds the size of the committed artefact; it is not the publish rule and should not be tuned to make a particular county qualify.

County maps simplify at 100 m rather than the country pages' 500 m, because they are zoomable to level 11 where a tile pixel is about 47 m.

## Attribution requirements

If you fork or self-host:

- Itiner-e (CC BY 4.0) — cite de Soto et al. 2025 and link to https://itiner-e.org. Currently in the in-app map attribution and the footer.
- OpenStreetMap + CARTO — required by the basemap tile provider.
- Natural Earth (public domain) — no attribution required, but credit is customary; used only at build time for the country assignment.
- Nominatim — required to identify your app via a custom User-Agent if you serve to a real audience (replace the default fetch headers in `src/lib/geocode.ts`).

## License

Code is unlicensed for now — ask before reusing. The data layer carries the Itiner-e CC BY 4.0 terms regardless.
