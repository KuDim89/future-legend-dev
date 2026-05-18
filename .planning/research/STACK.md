# Technology Stack

**Project:** Future Legend — Football Player Personal Portfolio Website
**Researched:** 2026-05-18
**Confidence:** HIGH (all versions verified via npm registry and official Next.js docs v16.2.6)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.2.6 | App framework, static export, routing | Industry standard React meta-framework; `output: 'export'` produces a fully static site deployable to GitHub Pages; App Router supports `[lang]` dynamic segments with `generateStaticParams` for zero-dependency i18n |
| React | 19.2.6 | UI component model | Required by Next.js; React 19 brings concurrent features and improved `use()` hook |
| TypeScript | 6.0.3 | Type safety | Prevents content shape mismatches in local JSON/TS content files; essential for a maintainable solo project |

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| sass | 1.99.0 | SCSS compilation | Next.js has built-in SCSS Modules support; sass package is the required compiler; no Tailwind — SCSS Modules give full CSS control for the premium custom design system required |
| clsx | 2.1.1 | Conditional class names | Lightweight utility for composing SCSS module class names; no runtime overhead |

### Animation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| framer-motion | 12.39.0 | Component-level UI animations | React-native animation API; `whileInView`, `useScroll`, `useTransform`, layout animations, and `AnimatePresence` page transitions cover all component-level cinematic effects; integrates with React state cleanly |
| gsap | 3.15.0 | Complex timeline and scroll-sequenced animations | Best-in-class imperative animation engine; ScrollTrigger plugin enables scrubbed parallax, pinned sections, and video-synced playback; handles animations that Framer Motion cannot (SVG morphing, complex sequenced timelines, canvas) |
| @gsap/react | 2.1.2 | GSAP React integration hooks | Provides `useGSAP` hook that handles cleanup of GSAP contexts on unmount — mandatory for React 18+ strict mode and Next.js App Router to prevent memory leaks and duplicate animation registrations |
| lenis | 1.3.23 | Smooth scroll engine | Provides buttery inertia-based scrolling that pairs with GSAP ScrollTrigger; ScrollTrigger integrates with Lenis via `ScrollTrigger.scrollerProxy`; dramatically improves cinematic scroll feel |

### Internationalization (UA/EN)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Built-in Next.js `app/[lang]/` pattern | (no library) | UA/EN routing and dictionary loading | Next.js App Router's `app/[lang]/layout.tsx` + `generateStaticParams` generates static HTML per locale (`/en/`, `/ua/`) at build time — zero runtime overhead, zero extra dependencies, works perfectly with `output: 'export'`. `next-i18next` is NOT compatible with App Router. `next-intl` requires middleware which is unsupported in static export. For 2 languages on a static site, the built-in pattern is the correct, dependency-free choice. |

**i18n implementation pattern:**
```
app/
  [lang]/
    layout.tsx        # RootLayout with generateStaticParams(['en', 'ua'])
    page.tsx          # Home page receives lang param
  dictionaries/
    en.json           # English strings
    ua.json           # Ukrainian strings
  lib/
    getDictionary.ts  # Lazy-imports the correct JSON by lang key
```

### Theme Switching (Light/Dark)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-themes | 0.4.6 | Light/Dark theme provider | Handles `prefers-color-scheme` detection, localStorage persistence, and flicker-free hydration via `suppressHydrationWarning`; pairs with SCSS custom properties (CSS variables) for theme tokens; compatible with Next.js App Router static export |

**Theme implementation pattern:** Define CSS custom properties (`--color-bg`, `--color-text`, etc.) in SCSS, then set `data-theme="dark"` on `<html>` via next-themes. No Tailwind `dark:` classes needed.

### Media

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-youtube | 10.1.0 | YouTube video embeds | Thin React wrapper around the YouTube IFrame API; handles player lifecycle; lazy-loading via `opts.playerVars`; no heavyweight video.js needed for embed-only use case |
| yet-another-react-lightbox | 3.32.0 | Photo gallery lightbox | Modern, accessible, touch-friendly lightbox with zoom, thumbnails, and fullscreen; tree-shakeable plugins; 0 external CSS dependencies — works with SCSS Modules |

### Deployment & CI

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GitHub Actions | (platform) | Build and deploy automation | Runs `next build` → copies `out/` to `gh-pages` branch; also handles contact form → Telegram Bot API integration via stored secrets; free for public repos |
| GitHub Pages | (platform) | Static hosting | Free, reliable static hosting for the `out/` directory; custom domain support available |

### Dev Tooling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| eslint-config-next | 16.2.6 | Linting | Ships with Next.js; covers React, accessibility, and Next.js-specific rules |
| prettier | 3.8.3 | Code formatting | Standard formatter; configure with `.prettierrc` for SCSS and TypeScript |

---

## Next.js Static Export: Critical Configuration Notes

### next.config.ts (complete recommended config)

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',

  // Required for GitHub Pages deployment to a subdirectory repo
  // If deployed to https://username.github.io/repo-name/:
  basePath: process.env.NODE_ENV === 'production' ? '/repo-name' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/repo-name/' : '',

  // next/image does not support server-side optimization in static export.
  images: {
    unoptimized: true,
  },

  // Generates /page/index.html — required for GitHub Pages to serve paths
  // without the .html extension correctly.
  trailingSlash: true,
}

export default nextConfig
```

### GitHub Actions Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NODE_ENV: production
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

**Note:** Add an empty `.nojekyll` file to `public/` so Next.js copies it to `out/`. This prevents GitHub Pages from ignoring `_next/` asset directories (Jekyll strips underscore-prefixed directories by default).

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| CSS | SCSS Modules | Tailwind CSS | Explicitly excluded by project spec |
| CSS | SCSS Modules | CSS-in-JS | Runtime overhead; poor static export compatibility |
| i18n | Built-in `[lang]` pattern | next-i18next | Not compatible with App Router |
| i18n | Built-in `[lang]` pattern | next-intl | Middleware unsupported in static export |
| Smooth scroll | lenis | native CSS | No ScrollTrigger integration; not cinematic |
| Hosting | GitHub Pages | Vercel | Project spec explicitly requires GitHub Pages |

---

## What NOT to Use

| Library | Reason to Avoid |
|---------|----------------|
| Tailwind CSS | Explicitly excluded; SCSS Modules required |
| next-i18next | Pages Router only; incompatible with App Router |
| styled-components / emotion | Runtime CSS-in-JS; fights SCSS Modules |
| Redux / Zustand | Overkill; React Context + useState is sufficient |
| React Query / SWR | No runtime data fetching; content is local files |
| Three.js / R3F | 500KB+ bundle; GSAP + CSS achieves cinematic without WebGL |
| `next export` CLI | Removed in Next.js 14; use `output: 'export'` in config |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Core framework versions | HIGH | Verified via npm registry |
| Static export config | HIGH | Verified against official Next.js docs v16.2.6 |
| i18n approach | HIGH | Official docs recommend `app/[lang]/` + `generateStaticParams` |
| Animation stack | HIGH | All packages verified from npm; @gsap/react useGSAP is documented approach |
| Theme switching | MEDIUM | next-themes widely deployed; no known static export incompatibility |

---

*Researched: 2026-05-18*
