# RATIO

**Balance colour. Build hierarchy.**

RATIO is a free, browser-based colour visualisation tool built around the 60–30–10 colour
principle. **Phase V1.4** adds contrast and colour-vision guidance — a WCAG contrast engine, six
purposeful contrast checks in a new Accessibility panel, and Protanopia/Deuteranopia/Tritanopia/
Grayscale simulation applied live to the preview canvas. V1.3 added a real, dynamic UI preview
system (Landing Page, Dashboard, Content templates in real HTML/CSS at Desktop/Tablet/Mobile
widths). V1.2 added the colour workspace (editable colours, hex/rgb/hsl engine, live ratio
visualisation, copy/reset). V1.1 established the marketing site, routing, application shell, and
design system.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- Vitest + Testing Library
- ESLint + Prettier

No backend, no database, no authentication, no paid services.

## Getting started

```bash
npm install
npm run dev         # start the dev server
npm run build       # type-check and build for production
npm run preview     # preview the production build
npm run lint         # run ESLint
npm run format       # run Prettier
npm run test         # run the test suite once
npm run test:watch   # run tests in watch mode
```

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
    brand/        Logo, geometric mark
    navigation/    Header, mobile nav, scroll restoration
    layout/        Footer, marketing layout wrapper
    ui/            Reusable primitives (Button, Card, Input, CopyButton, Tabs, ...)
    marketing/      Landing page sections + the RatioStackVisual signature visual
    workspace/      /app shell panels (controls, ratio, preview) + colour input UI
      accessibility/  ContrastCheckCard, ContrastStatusBadge (the Accessibility panel's UI)
    preview/        The V1.3 live UI preview system, plus V1.4's vision-simulation filters
  pages/           Route-level components
  hooks/           usePalette (workspace state), useCopyToClipboard, useDocumentTitle
  lib/             color.ts (colour engine), wcag.ts (thresholds), contrastChecks.ts (the six checks)
  types/           Colour, RatioPalette, RatioRole, preview + accessibility types
  styles/          Design tokens and workspace grid CSS
  test/            Vitest setup (jest-dom, RTL cleanup, ResizeObserver stub)
```

### Accessibility (`src/lib/wcag.ts`, `src/lib/contrastChecks.ts`, `AccessibilityPanel`)

A new "3 · Accessibility" section sits inside the workspace's centre column, below the ratio bar.
It runs six fixed, purposeful contrast checks against the live palette — not an arbitrary sweep
of every colour against every other colour:

1. Primary text on Dominant — the text colour the preview auto-picks for the page background
2. Primary text on Secondary — text inside cards/headers/sidebars
3. Primary text on Accent — text inside accent buttons/highlights
4. White on Accent — the common hardcoded-white-button-text convention
5. Dark text on Accent — the common hardcoded-near-black-text convention
6. Secondary as text on Dominant — the secondary colour itself used as text/icons

Each check reports a ratio, AA/AAA pass for normal text, and a plain-language status —
`✓ Good` / `⚠ Review` / `✕ Fails` — always paired with text, never colour alone. Status is a
direct read of the WCAG AA thresholds (`good` ≥ 4.5:1, `review` ≥ 3:1, `fail` below), not a
separate scoring system. RATIO never changes the user's colours or suggests replacements — only
describes the relationship.

Colour-vision simulation (Normal/Protanopia/Deuteranopia/Tritanopia/Grayscale) is a CSS `filter`
(`feColorMatrix` for the three dichromacy types, `grayscale(1)` for Grayscale) applied to the
preview canvas only, via `VisionFilters` + `PreviewFrame` — RATIO's own chrome and the toolbar
above the canvas are never simulated.

### Preview system (`src/components/preview/`)

- `PreviewFrame` — renders its children at their real device width (1200/834/390px) and scales
  the whole box down with a CSS transform to fit the sidebar. The DOM is genuinely that wide, so
  responsive rules evaluate correctly; only the visual presentation shrinks. Also injects the
  live palette as CSS custom properties (`--preview-dominant/secondary/accent` and matching
  `--preview-on-*` readable-text colours) on one wrapper element.
- `PreviewToolbar` — decorative browser-chrome bar (RATIO's own neutral tones, not the user's
  palette) showing the active template/viewport.
- `PreviewControls` — the functional Landing Page/Dashboard/Content and Desktop/Tablet/Mobile
  switchers.
- `PreviewTemplate` — switches between `LandingPreview` / `DashboardPreview` / `ContentPreview`.
- `shared/` — `PreviewButton`, `PreviewCard`, `PreviewHeader`, `PreviewNavigation`,
  `PreviewSection`, reused across all three templates. None of them take a colour prop — they
  read `var(--preview-*)` directly, so a colour change never re-renders the template subtree.
- Responsive behaviour inside the frame uses **CSS container queries** (`@container`, `@lg:`,
  `@5xl:`), not viewport media queries — the layout must react to the frame's own emulated
  width, not the real browser window.

### Colour engine (`src/lib/color.ts`)

Pure, framework-free functions — no React or DOM dependency:

- `normalizeHex` / `isValidHex` — accepts `#FFF`, `FFF`, `#FFFFFF`, `ffffff`; normalises to `#RRGGBB`
- `hexToRgb` / `rgbToHex`
- `rgbToHsl` / `hslToRgb`
- `relativeLuminance` / `contrastRatio` — WCAG contrast math
- `pickReadableTextColor` — picks ink/paper text for any background using the above
- `toColour` — builds a full `{ hex, rgb, hsl }` record from any accepted input
- `formatRgb` / `formatHsl` — CSS-style display strings

## Deploying

The app is a static Vite build. `vercel.json` rewrites all routes to `index.html` so client-side
routing survives a direct load or refresh on any route.

```bash
npm run build
vercel deploy
```
