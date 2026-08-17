# RATIO

**Balance colour. Build hierarchy.**

RATIO is a free, browser-based colour visualisation tool built around the 60–30–10 colour
principle. Pick a Dominant, Secondary, and Accent colour, and RATIO shows you how that balance
actually reads — as a proportional ratio, inside real interface previews, and against WCAG
contrast and colour-vision checks. Nothing is generated for you: RATIO visualises the decisions
you've already made.

Your colours stay in your browser. No account, no backend, no tracking.

## Features

- **Colour workspace** — edit Dominant/Secondary/Accent by hex or native colour picker, with
  live validation, per-role reset, and copy-to-clipboard for hex/RGB/HSL.
- **60/30/10 ratio visualisation** — a proportional bar, not a static graphic, that updates the
  instant a colour changes.
- **Real UI previews** — Landing Page, Dashboard, and Content templates built from actual
  HTML/CSS (no screenshots), rendering your palette at Desktop/Tablet/Mobile widths with genuine
  responsive behaviour.
- **Accessibility guidance** — six purposeful WCAG contrast checks against your live palette,
  each with a ratio, AA/AAA pass state, and a plain-language status. Colour-vision simulation
  (Protanopia/Deuteranopia/Tritanopia/Grayscale) applied live to the preview canvas.
- **Local persistence** — your palette, selected preview, viewport, and vision mode are restored
  automatically on your next visit. Nothing is sent anywhere; it's `localStorage`, and the app
  still works fine if that's unavailable (private browsing, storage disabled) — it just won't
  remember your palette between visits.
- **Export** — copy hex/RGB/HSL, copy ready-to-use CSS custom properties, copy a minimal JSON
  representation, or download the palette as an SVG or PNG.

## What V1 does not include

RATIO V1 is deliberately scoped to *visualising and checking* a palette you've already chosen —
not generating one. It does **not** include:

- Colour ramps or tints/shades generation
- Automatic colour suggestions or "fix this for me" corrections
- Semantic colour mapping or a design-token system
- AI of any kind
- Figma or other design-tool integration
- Accounts, a backend, a database, or analytics

These are reasonable directions for a future version, not gaps in this one.

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- Vitest + Testing Library
- ESLint + Prettier

No backend, no database, no authentication, no paid services, no unnecessary dependencies.

## Local development

```bash
npm install
npm run dev         # start the dev server at http://localhost:5173
```

## Testing

```bash
npm run lint         # ESLint
npx tsc -b            # TypeScript project build (type-check only)
npm run test          # run the test suite once
npm run test:watch    # run tests in watch mode
```

## Build

```bash
npm run build        # type-check, then produce a static build in dist/
npm run preview       # serve the production build locally
```

## Deployment

RATIO is a static Vite build — it can be hosted on any static host (Vercel, Netlify, Cloudflare
Pages, GitHub Pages, S3, etc.). `vercel.json` rewrites all routes to `index.html` so client-side
routing survives a direct load or refresh on any route; replicate that rewrite rule if deploying
elsewhere.

```bash
npm run build
vercel deploy         # or upload dist/ to your static host of choice
```

Before pointing a real domain at a deployment, update the placeholder canonical/Open Graph URLs
in `index.html` (currently `https://ratio.design/`).

## Routes

| Route            | Description                        |
| ----------------- | ----------------------------------- |
| `/`               | Marketing landing page              |
| `/how-it-works`   | Educational page on 60–30–10        |
| `/about`          | About RATIO                         |
| `/app`            | Interactive colour workspace        |

## Project structure

```
src/
  components/
    brand/          Logo, brand mark
    navigation/      Marketing header, mobile nav, scroll restoration
    layout/          Footer, marketing layout wrapper
    ui/              Reusable primitives (Button, Card, Input, CopyButton, Tabs, ToastProvider, ...)
    marketing/        Landing page sections + the RatioStackVisual signature visual
    workspace/        /app shell: top bar, controls, ratio + accessibility panel, preview, export drawer
      accessibility/    ContrastCheckCard, ContrastStatusBadge
    preview/          The live UI preview system + colour-vision simulation filters
  pages/             Route-level components
  hooks/             usePalette, usePreviewSettings (both localStorage-backed), useCopyToClipboard,
                      useDocumentTitle
  lib/               color.ts (colour engine), wcag.ts (contrast thresholds), contrastChecks.ts
                      (the six accessibility checks), exportFormats.ts (CSS/JSON/SVG/PNG builders),
                      storage.ts (safe localStorage wrapper)
  types/             Colour, RatioPalette, RatioRole, preview + accessibility types
  styles/            Design tokens and workspace grid CSS
  test/              Vitest setup (jest-dom, RTL cleanup, ResizeObserver stub)
```

### Colour engine (`src/lib/color.ts`)

Pure, framework-free functions — no React or DOM dependency:

- `normalizeHex` / `isValidHex` — accepts `#FFF`, `FFF`, `#FFFFFF`, `ffffff`; normalises to `#RRGGBB`
- `hexToRgb` / `rgbToHex`, `rgbToHsl` / `hslToRgb`
- `relativeLuminance` / `contrastRatio` / `contrastRatioHex` — WCAG contrast math
- `pickReadableTextColor` — picks ink/paper text for any background using the above
- `toColour` — builds a full `{ hex, rgb, hsl }` record from any accepted input, or `null`
- `formatRgb` / `formatHsl` — CSS-style display strings

### Accessibility (`src/lib/wcag.ts`, `src/lib/contrastChecks.ts`)

The workspace's "3 · Accessibility" section runs six fixed, purposeful contrast checks against
the live palette — not an arbitrary sweep of every colour against every other colour:

1. Primary text on Dominant — the text colour the preview auto-picks for the page background
2. Primary text on Secondary — text inside cards/headers/sidebars
3. Primary text on Accent — text inside accent buttons/highlights
4. White on Accent — the common hardcoded-white-button-text convention
5. Dark text on Accent — the common hardcoded-near-black-text convention
6. Secondary as text on Dominant — the secondary colour itself used as text/icons

Each reports a ratio, AA/AAA pass for normal text, and a plain-language status — `✓ Good` /
`⚠ Review` / `✕ Fails` — always paired with text, never colour alone. Status is a direct read of
the WCAG AA thresholds (`good` ≥ 4.5:1, `review` ≥ 3:1, `fail` below). RATIO never changes the
user's colours or suggests replacements — only describes the relationship. Colour-vision
simulation is a CSS `filter` (SVG `feColorMatrix` for the three dichromacy types, `grayscale(1)`
for Grayscale) applied to the preview canvas only — RATIO's own chrome is never simulated.

### Preview system (`src/components/preview/`)

- `PreviewFrame` — renders its children at their real device width (1200/834/390px) and scales
  the whole box down with a CSS transform to fit the sidebar. The DOM is genuinely that wide, so
  responsive rules evaluate correctly; only the visual presentation shrinks. Injects the live
  palette as CSS custom properties (`--preview-dominant/secondary/accent` and matching
  `--preview-on-*` readable-text colours) on one wrapper element, so a colour change never
  re-renders the template subtree.
- `PreviewControls` — the Landing Page/Dashboard/Content, Desktop/Tablet/Mobile, and colour-vision
  switchers.
- `PreviewTemplate` — switches between `LandingPreview` / `DashboardPreview` / `ContentPreview`.
- `shared/` — `PreviewButton`, `PreviewCard`, `PreviewHeader`, `PreviewNavigation`,
  `PreviewSection`, reused across all three templates.
- Responsive behaviour inside the frame uses **CSS container queries** (`@container`, `@lg:`,
  `@5xl:`), not viewport media queries — the layout reacts to the frame's own emulated width, not
  the real browser window.

### Persistence (`src/lib/storage.ts`)

One `localStorage` key (`ratio:workspace:v1`), read-modify-written so the palette hook and the
preview-settings hook never clobber each other's fields. All access is wrapped in `try/catch` —
storage can throw in private browsing or with storage disabled, and that never breaks the app; it
just means nothing is remembered for next time. Persisted values are re-validated on load
(`toColour`, and membership checks against the known template/viewport/vision option lists)
before being trusted, so corrupted or hand-edited storage falls back to defaults instead of
crashing.

## Future roadmap (V2+)

Reasonable next directions, none implemented in V1:

- Colour ramps / tints & shades generation
- Automatic role-mapping suggestions from a shortlist of colours
- A semantic design-token export (beyond the current flat CSS variables/JSON)
- Saved/named palettes (would need some form of light persistence beyond a single workspace)
- Figma plugin or design-tool handoff
- Additional preview templates (e.g. mobile app, email)
