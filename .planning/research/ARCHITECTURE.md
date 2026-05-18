# Architecture

**Project:** Future Legend — Football Player Portfolio Website
**Researched:** 2026-05-18
**Confidence:** HIGH for i18n and GSAP patterns (verified via official docs); MEDIUM for component structure and theme system

---

## Folder Structure

```
future-legend-dev/
├── app/
│   └── [lang]/                    # Dynamic locale segment (ua | en)
│       ├── layout.tsx             # Root layout: ThemeProvider, fonts, meta, i18n
│       ├── page.tsx               # Home — assembles all section components
│       └── globals.scss           # Global reset + CSS custom property tokens
├── components/
│   ├── sections/                  # Full-page sections (Hero, About, Media, etc.)
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.scss
│   │   ├── About/
│   │   ├── BestMoments/
│   │   ├── Gallery/
│   │   ├── Trophies/
│   │   ├── Club/
│   │   ├── Team/
│   │   └── Contact/
│   ├── ui/                        # Reusable primitives (Button, Badge, VideoCard, etc.)
│   └── layout/                    # Nav, Footer, ThemeToggle, LanguageSwitcher
├── content/
│   ├── player.ts                  # Player bio, position, stats, photo paths
│   ├── club.ts                    # Current club info
│   ├── videos.ts                  # YouTube video IDs + metadata
│   ├── gallery.ts                 # Photo paths + captions
│   ├── trophies.ts                # Achievements list
│   └── team.ts                    # Team member info
├── dictionaries/
│   ├── en.json                    # English UI strings
│   └── ua.json                    # Ukrainian UI strings
├── lib/
│   ├── getDictionary.ts           # Async dictionary loader by locale key
│   └── animations/
│       ├── variants.ts            # Framer Motion animation variants
│       └── gsap/                  # GSAP timeline factory functions
├── styles/
│   ├── _tokens.scss               # CSS custom property definitions (theme vars)
│   ├── _typography.scss           # Font scale
│   └── _mixins.scss               # SCSS utility mixins
├── public/
│   ├── images/                    # Pre-optimized WebP player photos
│   ├── .nojekyll                  # Required for GitHub Pages _next/ directory
│   └── CNAME                      # Optional: custom domain
└── .github/
    └── workflows/
        ├── deploy.yml             # Build → gh-pages deployment
        └── contact.yml            # Contact form → Telegram Bot API
```

---

## i18n Architecture (App Router Static Export)

**Pattern:** `app/[lang]/` dynamic segment + `generateStaticParams` — zero runtime dependencies.

```typescript
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ua' }]
}

// Renders /en/index.html and /ua/index.html at build time
```

```typescript
// lib/getDictionary.ts
const dictionaries = {
  en: () => import('../dictionaries/en.json').then(m => m.default),
  ua: () => import('../dictionaries/ua.json').then(m => m.default),
}

export const getDictionary = async (locale: 'en' | 'ua') => dictionaries[locale]()
```

**Why not next-i18next:** Not compatible with App Router.
**Why not next-intl:** Requires middleware, which is unsupported in static export (or requires `localePrefix: 'always'` config and careful setup). For 2 locales on a portfolio site, the built-in `[lang]` pattern is simpler and dependency-free.

**Locale switching:** Store user preference in `localStorage`. Language switcher component reads current `params.lang` from URL and renders `<Link href={`/${otherLang}`}>`.

---

## Theme System (Light/Dark)

**Pattern:** CSS custom properties on `data-theme` attribute on `<html>`. No JS token system — SCSS references CSS variables directly.

```scss
// styles/_tokens.scss
:root {
  --color-bg: #ffffff;
  --color-text: #0a0a0a;
  --color-accent: #e63946;
  --color-surface: #f5f5f5;
}

[data-theme='dark'] {
  --color-bg: #0a0a0a;
  --color-text: #f5f5f5;
  --color-accent: #e63946;
  --color-surface: #161616;
}
```

**FOUC prevention:** Blocking inline script in `<head>` reads `localStorage` before first paint:

```typescript
// app/[lang]/layout.tsx
const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
`
// Render as: <script dangerouslySetInnerHTML={{ __html: themeScript }} />
```

**next-themes** can be used as the React-level theme context (for the toggle button state), but the CSS variable system is the source of truth for styling — not class names.

---

## Animation Architecture

### Framer Motion vs GSAP Responsibility Split

| Library | Owns | Examples |
|---------|------|---------|
| Framer Motion | React component lifecycle | Page transitions (`AnimatePresence`), mount/unmount fades, hover states, layout animations |
| GSAP + ScrollTrigger | Scroll-sequenced cinematic sequences | Hero parallax, text reveal on scroll, pinned sections, counter animations, timeline-synced sequences |
| Neither | Static CSS | Hover color changes, focus rings, cursor changes |

**Critical rule:** Never apply both libraries to the same DOM element simultaneously. Use a wrapper pattern:

```tsx
// Framer Motion controls opacity (mount/unmount)
<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
  {/* GSAP controls transform (scroll-driven parallax) */}
  <div ref={gsapRef} className={styles.heroVisual}>
    <Image ... />
  </div>
</motion.div>
```

### GSAP Integration Pattern (React 18 / App Router)

All GSAP code must follow this pattern:

```typescript
'use client'  // mandatory — GSAP needs browser APIs

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)  // at file scope is fine inside 'use client'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // All GSAP calls here are auto-reverted on unmount
    gsap.from('.hero-text', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })
  }, { scope: containerRef })  // scope prevents class selectors matching outside component

  return <div ref={containerRef}>...</div>
}
```

### Lenis Smooth Scroll Integration

Lenis must be initialized at the root layout level and ScrollTrigger must proxy through it:

```typescript
// components/layout/SmoothScrollProvider.tsx
'use client'
import Lenis from 'lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])
  return <>{children}</>
}
```

---

## Content Data Flow

All content flows strictly top-down. Section components never import content files directly.

```
content/*.ts (typed data)
     ↓
app/[lang]/page.tsx (imports content + dictionary)
     ↓
<SectionComponent data={...} dict={...} /> (receives props)
     ↓
ui/* components (receive primitive props only)
```

**Content file pattern:**

```typescript
// content/player.ts
export interface PlayerProfile {
  name: string
  position: string
  workingFoot: 'left' | 'right' | 'both'
  nationality: string
  dateOfBirth: string
  photoSrc: string
  stats: { label: string; value: string }[]
}

export const player: PlayerProfile = {
  name: 'Future Legend',
  position: 'Forward',
  workingFoot: 'right',
  // ...
}
```

---

## Contact Form → GitHub Actions → Telegram Pipeline

**Flow:**
```
Browser form submit
  → POST to GitHub Actions workflow_dispatch API
  → GitHub Actions job reads form data from event payload
  → curl to Telegram Bot API with formatted message
  → Telegram notification received
```

**Security model:** Bot token stored in GitHub Secrets (never in client code). Contact form POSTs to GitHub API with a Personal Access Token scoped to `workflow` only (minimum permissions). For higher security, use a Cloudflare Workers intermediary to hold all secrets.

**GitHub Actions contact workflow:**

```yaml
# .github/workflows/contact.yml
on:
  workflow_dispatch:
    inputs:
      name: { required: true, type: string }
      email: { required: true, type: string }
      message: { required: true, type: string }

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send to Telegram
        run: |
          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
            -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
            -d text="New contact from ${{ inputs.name }} (${{ inputs.email }}): ${{ inputs.message }}"
```

**Spam protection:** Honeypot field (hidden input bots fill; reject if populated) + time check (< 2 seconds = bot).

---

## Build Order (Suggested Phase Sequence)

| Layer | What | Why first |
|-------|------|-----------|
| 1 — Foundation | `next.config.ts`, `app/[lang]/` scaffold, SCSS token system, theme FOUC fix, `.nojekyll`, GitHub Actions deploy workflow | Everything else depends on this; hard to retrofit |
| 2 — Design System | Global styles, typography scale, CSS custom properties, UI primitives (Button, Badge, SectionWrapper) | Components need tokens and primitives before they can be styled |
| 3 — Static Sections | Hero layout, About, Trophies, Club, Team (no animation yet) | Get visual language established with real content |
| 4 — Animation Layer | Add Lenis, add GSAP ScrollTrigger animations, add Framer Motion transitions | Animate on top of working static layout |
| 5 — Media System | YouTube embed (lite), photo gallery lightbox | Depends on sections being laid out |
| 6 — Contact Form | Form UI, GitHub Actions workflow, Telegram integration, honeypot | Isolated feature; depends on nothing else |
| 7 — i18n Content | Fill dictionaries, connect `getDictionary` to all sections | Can be done after sections are built |
| 8 — Polish & SEO | Meta tags, Open Graph, performance audit, mobile QA | Final pass |

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| i18n static export pattern | HIGH | Verified via official Next.js docs |
| GSAP React integration | HIGH | Verified via official GSAP React docs (`useGSAP`, `scope`) |
| Component structure | MEDIUM | Standard Next.js App Router patterns; project-specific naming |
| Theme system | MEDIUM | CSS custom properties pattern well-established; next-themes compatibility inferred |
| Telegram contact pipeline | LOW | Bot token exposure risk; Cloudflare Workers intermediary recommended for production |

---

*Researched: 2026-05-18*
