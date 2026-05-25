# CLAUDE.md

Project context for Claude Code sessions on isthisaromanroad.com. Loaded automatically at session start. Keep this current with the codebase.

## What this is

A single-page PWA that tells you whether you're standing on (or near) a Roman road in Britain. Inspired by a child's question from the back seat of a car. Mobile-first, geolocation-driven, single-tap interaction.

## Stack

- **SvelteKit 2** with Svelte 5 (runes mode) + TypeScript
- **pnpm** (lockfile committed; `packageManager` pinned in package.json)
- **Biome** for lint + format (see `biome.json`)
- **MapLibre GL JS** with a bespoke vector style served from OpenFreeMap (`src/lib/map/style-parchment.ts`) — no API key, no rate limits
- **Cormorant Garamond** (display) + **Inter Variable** (body), self-hosted via Fontsource
- **RBush** spatial index + **Turf.js** for nearest-point queries
- **@vite-pwa/sveltekit** (Workbox) for the PWA layer
- **Vercel** adapter for hosting
- **html-to-image** for the shareable answer-card PNG export (dynamic-imported on first share)
- Data: **Itiner-e** dataset (CC BY 4.0) — see `scripts/build-roads.ts`

## Commands

```
pnpm dev               # vite dev server
pnpm build             # production build
pnpm preview           # serve the production build locally
pnpm check             # svelte-check
pnpm lint  / pnpm fix  # biome
pnpm data:build        # rebuild static/roads.geojson from Itiner-e (~78 MB d/l)
pnpm icons:build       # regenerate PWA icons + og.png
node --experimental-strip-types scripts/smoke-test.ts  # sanity-check the road index
```

## Workflow

- **Every change runs through a code review before commit.** Use the `agent-skills:code-reviewer` agent (or the relevant security/test specialist) on the staged/unstaged diff. Address findings worth fixing. Don't batch reviews — do one per logical change.
- **Commit directly to `main`.** Personal project, single contributor, no PR workflow, no feature branches.
- **Keep documentation current.** When stack, scripts, data sources, or user-facing behaviour change, update the README in the same commit.
- **No `--no-verify`, no `--force-push`, no destructive git ops without explicit authorisation.**

## Design Context

### Users

UK drivers and the curious kids in their back seat. The canonical moment is a parent at a junction, phone in one hand, child in the seat behind asking "is this a Roman road?". They want one number: yes or no. If no, how far to the nearest, and which way.

Secondary: history nerds, walkers, school kids, anyone who keeps spotting straight A-roads.

The job is **a single tap, a single answer, sometimes with a moment of historical context.** Not a research tool. Not a route planner. Not a map app.

### Brand Personality

Atmospheric. Historical. Warm. Mysterious. Joyful but professional. The interface should read as a **small artifact** — handmade, slightly old, deliberate — not enterprise GIS software, not generic SaaS.

Three-word personality: **oracle, vellum, hush.**

### Aesthetic Direction

**Editio II — Parchment & Walnut.** Muted Roman material colour grounded in real pigments and stone. Serif-led typography. Mobile-first. Light mode is canonical; walnut dark mode follows system preference.

Palette tokens live in `src/app.css`:

| Token | Hex | Role |
|---|---|---|
| `--bg` Parchment | `#efe4cd` | Page background |
| `--surface` Vellum | `#f6ecd6` | Cards |
| `--surface-deep` Tea-stain | `#e4d5b7` | Inset |
| `--ink` Walnut | `#2a1f17` | Body text |
| `--ink-soft` Smoke | `#6b5a47` | Captions |
| `--brand` Terracotta | `#a24b36` | Primary CTA, road overlay |
| `--brand-deep` Oxblood | `#6e2a22` | Hover |
| `--ok` Verdigris | `#3d6e66` | "YES" affirmation, user pin |
| `--gold` Bronze | `#9e7b3f` | Hairlines, focus rings |
| `--gold-soft` Old gold | `#c8a35a` | Highlights |

Typography:
- Display: **Cormorant Garamond** 700 + 500 italic
- Body: **Inter Variable**
- **Roman names always render in italic small caps with a thin gold underline.** This is the most important typographic convention in the project.
- Old-style numerals (`font-feature-settings: "onum"`) wherever figures sit next to serif type.

References: museum / heritage sites (V&A, British Museum, Pelagios) — editorial type, restrained palette, scholarly tone.

Explicit anti-references — this should never look like:
- Google Maps / enterprise GIS dashboards (no saturated tiles, no layered controls, no data-viewer aesthetic).
- 2024 AI landing pages (no cyan-on-dark, no purple→blue gradients, no glassmorphism, no generic icon-card grids, no neon accents, no dark-mode-default with glowing accents).

### Design Principles

1. **The answer is the page.** Title, gold rule, one word. Everything else subordinates.
2. **One question at a time.** Cold load = wordmark + rule + one CTA. Search is a tertiary text link.
3. **Atmosphere over chrome.** Map is a sketch on parchment. Citation hides in `<details>`. Buttons are typographic pills.
4. **Italic Latin everywhere.** Applied consistently, this single convention does more for "feels Roman" than any colour.
5. **Restraint with one moment of warmth.** The gold rule, the verdigris pin, the road drawing itself on. Decorative but sparing.

### Accessibility

- **WCAG AA floor, AAA where cheap.** Verify contrast on every change.
- `prefers-reduced-motion` honoured globally; explicit overrides where the default reset would degrade contrast (see `Listening.svelte`).
- Every interactive element: ≥44px tap target, 3px gold focus ring with 3px offset.
- Light- and dark-mode palettes both AA-verified. Don't optimise the dark variant just for "looks cool" without re-running contrast.
- Native disclosure (`<details>`) preferred over JS modals.

### Out of scope

- Hero metrics, big-number layouts, supporting-stats grids.
- Card grids. The page has one card-shaped element (the answer block) and it earns its keep.
- Bouncy or elastic easing.
- Glassmorphism, drop-shadow ornament, sparklines as decoration.
- Stock photography. The OG card is typographic.

## Project layout

```
src/
  app.css                       # design tokens + reset + global rules
  app.html                      # shell + theme-color meta
  routes/
    +layout.{ts,svelte}         # prerender=true, global wrapper
    +page.svelte                # state machine + composition
    sitemap.xml/+server.ts      # generated sitemap
  lib/
    roads.ts                    # RoadIndex (RBush + Turf nearest-point-on-line)
    geocode.ts                  # Nominatim wrapper (browser, with timeout)
    format.ts                   # display helpers + bearingToWords
    share.ts                    # html-to-image + Web Share API + download fallback
    map/
      style-parchment.ts        # bespoke MapLibre style, parchment + walnut variants
    components/
      Wordmark.svelte           # H1 in full or minimised modes
      Question.svelte           # cold-load hero
      Listening.svelte          # breathing italic
      Answer.svelte             # three-variant display block
      AskAgain.svelte           # Share + Ask-again bottom bar
      ShareCard.svelte          # off-screen 1080×630 render target
      RuleGold.svelte           # the 48px gold gradient bar
      Map.svelte                # MapLibre lifecycle + draw-on motion
scripts/
  build-roads.ts                # Itiner-e download → reproject → UK filter
  generate-icons.ts             # SVG → PNG icon set + OG card
  smoke-test.ts                 # sanity-check the road index
static/
  roads.geojson                 # 1,392 UK features, ~600 KB
  icons/, og.png, favicon.svg
data/raw/                       # cached Itiner-e download (gitignored)
.impeccable.md                  # canonical Design Context (read by all design skills)
```
