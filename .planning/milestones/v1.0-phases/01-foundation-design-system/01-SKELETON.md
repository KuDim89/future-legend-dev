# Walking Skeleton — Future Legend Dev

**Phase:** 1 — Foundation & Design System
**Created:** 2026-05-19
**Status:** Authoritative — downstream phases build on decisions recorded here without renegotiating

---

## What the Walking Skeleton Delivers

The thinnest possible end-to-end slice of the full system. After Phase 1:

- A static Next.js site builds without errors (`next build` exits 0)
- The build output (`./out/`) deploys to GitHub Pages via a single `git push main`
- The deployed site loads at `https://dkukharuk.github.io/future-legend-dev/` with all assets (CSS, JS, fonts) loading correctly — no 404s
- A developer visiting the site sees a design system demo page with working light/dark theme toggle, no FOUC, smooth scroll, and a GSAP ScrollTrigger fade-in animation confirming the Lenis proxy is wired

---

## Architectural Decisions (locked for all future phases)

### Framework

| Decision | Value | Rationale |
|----------|-------|-----------|
| Framework | Next.js 16.x | Pre-decided; only framework supporting `output: 'export'` with App Router |
| Build mode | `output: 'export'` | GitHub Pages is static-only; no SSR |
| Router | App Router (`app/`) | Next.js 13+ standard; Pages Router is legacy |
| Language | TypeScript | Pre-decided |

### Routing Structure

```
app/
  layout.tsx            — Minimal shell layout (no <html><body> — delegated to [lang])
  page.tsx              — Server Component: redirect('/ua')
  [lang]/
    layout.tsx          — Root layout: fonts, ThemeProvider, SmoothScrollProvider
    page.tsx            — Design system demo page (Phase 1) → replaced by home in Phase 2
```

- Locale segment: `app/[lang]/` with `generateStaticParams` returning `['ua', 'en']`
- Root redirect: `redirect('/ua')` in `app/page.tsx` (Server Component; compiles to meta-refresh in static export)
- `params` must be awaited: `const { lang } = await params` (Next.js 16 requirement)
- `export const dynamicParams = false` in `app/[lang]/layout.tsx` (reject unknown locales)

### GitHub Pages Deployment

| Config Key | Value | Why |
|------------|-------|-----|
| `basePath` | `/future-legend-dev` | Repo name = GitHub Pages sub-path (D-01) |
| `assetPrefix` | `/future-legend-dev/` | Forces asset URLs to include basePath |
| `trailingSlash` | `true` | GitHub Pages expects `index.html` inside trailing-slash dirs |
| `images.unoptimized` | `true` | Static export cannot run Next.js image optimization server |
| `output` | `'export'` | Generates `./out/` static directory |

CI/CD: GitHub Actions `deploy.yml`
- Trigger: `push` to `main` + `workflow_dispatch`
- Permissions: `contents: read`, `pages: write`, `id-token: write`
- Actions used: `checkout@v4`, `setup-node@v4` (Node 20), `cache@v4`, `upload-pages-artifact@v3`, `deploy-pages@v5`
- `actions/configure-pages` is NOT used (conflicts with manually set `basePath`)
- Build artifact path: `./out`
- `.nojekyll` in `public/` prevents GitHub Pages Jekyll from stripping `_next/`

### Styling System

| Decision | Value |
|----------|-------|
| Styling approach | SCSS Modules (`*.module.scss`) + global `globals.scss` |
| NO Tailwind | Project rule — custom premium design system |
| Token sharing | `sassOptions.additionalData` in `next.config.ts` auto-imports tokens + mixins |
| Token file | `styles/_tokens.scss` — CSS custom properties for all color, spacing, type |
| Theme switching | `data-theme` attribute on `<html>` (not CSS classes) |

SCSS file hierarchy:
```
styles/
  _tokens.scss     — CSS custom properties (color, spacing, type scale)
  _typography.scss — Font role definitions (element → token mapping)
  _mixins.scss     — Responsive breakpoint mixin (respond-to)
  globals.scss     — Imports all partials; base resets
```

`sassOptions.additionalData` value:
```
`@use '@/styles/tokens' as *; @use '@/styles/mixins' as *;`
```
Fallback if `@use` conflicts: `@import '@/styles/tokens'; @import '@/styles/mixins';`

### Theme System

| Decision | Value |
|----------|-------|
| Library | `next-themes` v0.4.6 |
| Attribute | `data-theme` (not `class`) |
| Default theme | `dark` (D-07 — dark always on first visit, ignores system preference) |
| System preference | `enableSystem={false}` |
| Storage key | `fl-theme` |
| FOUC prevention | `:root` and `[data-theme='dark']` share same CSS values (dark is the default) |
| `suppressHydrationWarning` | On `<html>` tag only |

ThemeProvider location: `components/providers/Providers.tsx` (`'use client'`)
Mounted at: `app/[lang]/layout.tsx` wrapping `<body>` children

### Font System

| Font | Role | CSS Variable | Subsets | Weights |
|------|------|--------------|---------|---------|
| Oswald | Headings (H1–H6, section titles) | `--font-oswald` → `--font-heading` | latin, cyrillic | 400, 700 |
| Roboto | Body text, labels, nav | `--font-roboto` → `--font-body` | latin, cyrillic | 400, 700 |

Both fonts: `display: 'swap'`, self-hosted via `next/font/google`, CSS variable pattern.
Font class variables applied to `<html>` element (not `<body>`).
Central definition: `app/fonts.ts`

### Animation Ownership (locked rule — never violate)

| Owner | Triggers |
|-------|---------|
| Framer Motion | Component mount/unmount, hover states, press states, page transitions |
| GSAP (inside `useGSAP`) | Scroll-triggered sequences, cinematic timelines |
| Rule | Never animate the same element with both; GSAP only inside `'use client'` components |

### Smooth Scroll

| Decision | Value |
|----------|-------|
| Library | `lenis` v1.3.23 |
| React integration | `ReactLenis` from `lenis/react` |
| GSAP sync | `autoRaf: false` + `gsap.ticker.add(update)` where `update` calls `lenisRef.current?.lenis?.raf(time * 1000)` |
| Lag smoothing | `gsap.ticker.lagSmoothing(0)` |
| Scroll proxy | NOT used — ticker sync is the current pattern for Lenis v1 |
| Lenis options | `lerp: 0.1`, `duration: 1.2`, `syncTouch: true` |

Provider location: `lib/SmoothScrollProvider.tsx` (`'use client'`)
`gsap.registerPlugin(ScrollTrigger)` at module scope in `SmoothScrollProvider.tsx`

### GSAP Usage in Components

```typescript
// All GSAP animation components must:
'use client'
// imports
gsap.registerPlugin(ScrollTrigger, useGSAP)  // module scope
// inside component:
useGSAP(() => {
  // all GSAP code here — cleanup is automatic
}, { scope: containerRef })
```

### Directory Structure (established by Phase 1)

```
app/
  [lang]/
    layout.tsx
    page.tsx
  layout.tsx
  page.tsx
components/
  layout/
    Nav.tsx           — Stub nav (all 8 anchors per D-14)
    ThemeToggle.tsx   — Light/dark toggle (Framer Motion)
  providers/
    Providers.tsx     — ThemeProvider wrapper ('use client')
  ui/                 — Empty; populated in Phase 2
  sections/           — Empty; populated in Phase 2
lib/
  SmoothScrollProvider.tsx
  animations/         — Empty; populated in Phase 2
content/
  player.ts           — TypeScript stub (name, position placeholders)
styles/
  _tokens.scss
  _typography.scss
  _mixins.scss
  globals.scss
dictionaries/
  en.json             — Empty placeholder {}
  ua.json             — Empty placeholder {}
public/
  .nojekyll           — Required for GitHub Pages
.github/
  workflows/
    deploy.yml
app/
  fonts.ts            — Oswald + Roboto definitions
```

### Content Data Flow (locked for all phases)

```
content/*.ts → app/[lang]/page.tsx → <SectionComponent data={...} dict={...} />
```

Sections never import content directly. Content flows through the page component.

---

## What Is NOT in the Skeleton (deferred to later phases)

| Feature | Phase |
|---------|-------|
| Scout-facing hero section | Phase 2 |
| Player profile content | Phase 2 |
| Real player data in `content/player.ts` | Phase 2 |
| YouTube lite-embed | Phase 3 |
| Photo gallery lightbox | Phase 3 |
| Contact form + Telegram | Phase 3 |
| UA/EN dictionary content | Phase 4 |
| Language switcher component | Phase 4 |
| `lib/getDictionary.ts` loader | Phase 4 |

---

## One Real Data Source Read

`content/player.ts` is created in Phase 1 as a TypeScript stub with placeholder data (name and position). The demo page reads from it and renders the player name in the nav brand area. This confirms the `content/*.ts → page.tsx → component` data flow works end-to-end before Phase 2 adds real content.

---

## One Real UI Interaction

The theme toggle (`components/layout/ThemeToggle.tsx`) is a working UI interaction — not a stub. Clicking it toggles between `data-theme="dark"` and `data-theme="light"`, the CSS custom properties respond immediately, and the preference persists in `localStorage` under the key `fl-theme`. On next page load, the saved preference is applied before first paint (no FOUC).

---

## Pre-Deployment Checklist (human-required before first CI run)

Before pushing to `main` for the first time:

1. Go to GitHub repo → Settings → Pages → Source → select "GitHub Actions" (not "Deploy from a branch")
2. No other secrets or tokens required for Phase 1 deployment

---

*Walking Skeleton defined: 2026-05-19*
*Valid for: All phases (do not modify without team agreement on architectural changes)*
