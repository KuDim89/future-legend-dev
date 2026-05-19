# Phase 2: Core Sections & Animations — Research

**Researched:** 2026-05-19
**Domain:** Next.js 15 static export / GSAP ScrollTrigger / Framer Motion / SCSS Modules — cinematic section layout and animation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Hero background is a dark navy + crimson gradient placeholder. Image slot is intentionally left empty — structure must support a `background-image` swap. No real player photo in Phase 2.
- **D-02:** Hero text: player name (Oswald `--text-hero` 5rem), position label beneath, CTA button scrolling to `#contact`.
- **D-03:** Hero has a complex GSAP parallax — gradient background moves slower than text as user scrolls. Implemented with GSAP ScrollTrigger inside `useGSAP()`.
- **D-04:** Hero text entrance on page load: staggered Framer Motion reveal — name → position → CTA each animate in sequentially (opacity 0→1, y +20→0). Framer Motion owns mount animations.
- **D-05:** Player data in `content/player.ts` uses realistic placeholder data — believable Ukrainian football player profile. All required fields with correct TypeScript types.
- **D-06:** All non-hero sections use a consistent fade+slide entrance: elements fade in and translate up (opacity 0→1, y +40→0) as they enter the viewport.
- **D-07:** ScrollTrigger trigger point: `start: 'top 80%'` — matches Phase 1 ScrollFadeSection prototype.
- **D-08:** Staggered within sections: section title animates first, then content items follow with a stagger delay (stagger: 0.1s).
- **D-09:** Animations run once — play on section entry, stay visible. `scrub: false`. Elements never animate out.
- **D-10:** Shared reusable hook `useScrollReveal()` lives in `lib/animations/useScrollReveal.ts`. All sections call this hook instead of duplicating the `useGSAP` block.
- **D-11:** Profile bio grid: Name, Position, Working foot (with Lucide `Footprints` icon), Date of birth.
- **D-12:** Below the grid: 2–3 sentence unique creative characteristic bio from `content/player.ts` (`bio` string field).
- **D-13:** Key attributes as FIFA-style stat bars: 6 attributes (Pace, Dribbling, Shooting, Passing, Physical, Defending), each with label, numeric value, and filled bar.
- **D-14:** Stat bars animate in with GSAP when profile section enters viewport — bars fill from 0% to their value. GSAP scroll-triggered (not Framer Motion).
- **D-15:** Trophies section: trophy cards in a grid. Each card: trophy name, year won, competition name. Sourced from `content/player.ts` as a `trophies[]` array.
- **D-16:** Club section: current club with name, logo placeholder, and short description. Sourced from `content/player.ts` as a `club` object.
- **D-17:** Team section: current team name, logo placeholder, and short 1–2 sentence description. Sourced from `content/player.ts` as a `team` object. No teammate photos.
- **D-18:** Phase 3 sections (Highlights, Gallery, Contact) exist as stubs so nav links resolve correctly.
- **D-19:** Stub appearance: dark section with section title only — no "coming soon" text.
- **D-20:** Stubs are a single reusable `SectionStub` component in `components/sections/SectionStub.tsx` — accepts `id` and `title` props.
- **D-21:** `app/[lang]/page.tsx` assembles all 8 sections in nav order: HeroSection, AboutSection, TrophiesSection, ClubSection, TeamSection, SectionStub × 3.

### Claude's Discretion

- Exact parallax speed ratio for hero (e.g., background at 30% scroll speed vs. text at 100%)
- Trophy card layout (grid columns, card proportions, crimson accent treatment)
- Stat bar visual style details (bar height, border-radius, accent color fill vs. track color)
- Section heading style (uppercase Oswald with a crimson underline accent, or other treatment)

### Deferred Ideas (OUT OF SCOPE)

- Career timeline (clubs + seasons): PLAYER-V2-02 — not Phase 2
- Teammates showcase with photos: Phase 3+
- Real player photo for hero: will be added as content update after Phase 2
- Real club/team logos: placeholder slots built in Phase 2, logos filled in later
- Player logo / AI-generated visuals: post-Phase 2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Visitor lands on a cinematic hero section with player name, position, and a high-impact full-screen visual | Hero section architecture: `min-height: 100svh`, gradient background, GSAP parallax |
| HOME-02 | Hero section includes scroll-triggered entrance animations (text reveal, image parallax) using GSAP ScrollTrigger | D-03 GSAP parallax on background layer, D-04 Framer Motion entrance on text layer — separate DOM elements |
| HOME-03 | Hero section includes a clear CTA button directing scouts to the contact section | `<a href="#contact">` element, `--color-accent` background, scrolls via Lenis |
| HOME-04 | Page sections transition smoothly using Framer Motion and GSAP animations; page feels cinematic not static | `useScrollReveal()` hook for all non-hero sections; hero parallax adds cinematic scroll depth |
| PLAYER-01 | Visitor can view full profile: full name, position, working foot, nationality, date of birth, current club | AboutSection bio grid from `player.ts` — all fields present |
| PLAYER-02 | Visitor can view a high-quality real photo | **GAP NOTED:** D-01 defers real photo. Phase 2 satisfies structural requirement (slot exists) but not the "real photo" criterion — see Open Questions |
| PLAYER-03 | Visitor can view key player statistics/attributes (configurable from content/player.ts) | Stat bars: 6 attributes from `player.stats` — animated GSAP fill |
| PLAYER-04 | Player information section tells the player's story through imagery and short narrative text | `player.bio` narrative paragraph in AboutSection |
| SECT-01 | Visitor can view trophies / achievements section | TrophiesSection with `player.trophies[]` grid |
| SECT-02 | Visitor can view information about the player's current club | ClubSection with `player.club` object |
| SECT-03 | Visitor can view a team section | TeamSection with `player.team` object |
</phase_requirements>

---

## Summary

Phase 2 replaces the Phase 1 design system demo page with a fully scout-facing cinematic homepage. The work divides into four areas: (1) the `content/player.ts` data layer defining the TypeScript interfaces all sections consume, (2) the `lib/animations/useScrollReveal.ts` hook extracted from the existing ScrollFadeSection.tsx prototype, (3) five content sections (Hero, About, Trophies, Club, Team) each with their own SCSS module and animation, and (4) three stub sections (Highlights, Gallery, Contact) as anchor targets.

The animation system is already wired and proven from Phase 1. The GSAP + Lenis integration works correctly — `autoRaf: false`, GSAP ticker drives Lenis RAF, ScrollTrigger fires at correct positions. Phase 2 is an application of these established patterns, not new infrastructure.

The only new package required is `lucide-react` for the `Footprints` icon in the bio grid. All other packages are already installed. The hero is the most technically complex component — it has TWO animation systems on two separate DOM elements (GSAP on background layer, Framer Motion on text layer), which is explicitly permitted by CLAUDE.md as long as the same element is never animated by both.

**Primary recommendation:** Extract `useScrollReveal()` from ScrollFadeSection.tsx first (task 0 of the phase). Every subsequent section component depends on it. The hero is built last, or in a dedicated wave, because it requires both animation systems simultaneously and is the highest-risk component.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hero parallax (background layer) | Browser / Client (GSAP) | — | GSAP ScrollTrigger drives `yPercent` on DOM element — must be `'use client'` |
| Hero text entrance (text layer) | Browser / Client (Framer Motion) | — | `motion.div` with `initial/animate` — must be `'use client'` |
| Section scroll reveals | Browser / Client (GSAP via hook) | — | `useScrollReveal()` inside `'use client'` section components |
| Stat bar animation | Browser / Client (GSAP) | — | `[data-stat-fill]` animated by GSAP inside scoped `useGSAP()` |
| Player data (`content/player.ts`) | Build time / Static | — | TypeScript data file — read at build time, passed as props |
| Page assembly (`app/[lang]/page.tsx`) | Next.js Server Component | — | Imports player data, passes to sections as props (no `'use client'`) |
| Section layout / SCSS | CSS / Global | — | SCSS Modules per-component; tokens auto-injected via sassOptions |
| Stub sections | Server Component | — | Static HTML only, no animation, no `'use client'` needed |

---

## Standard Stack

### Core (all already installed)

| Library | Installed Version | Purpose | Phase 2 Role |
|---------|-------------------|---------|--------------|
| next | 15.5.18 | App framework, static export | Page assembly, static params |
| gsap | ^3.15.0 | Scroll-triggered animations | Hero parallax, section reveals, stat bar fills |
| @gsap/react | ^2.1.2 | `useGSAP()` hook | SSR-safe GSAP in all animated client components |
| framer-motion | ^12.39.0 | Component lifecycle animations | Hero text mount stagger |
| lenis | ^1.3.23 | Smooth scroll | Already wired in `SmoothScrollProvider` — Phase 2 just benefits |
| sass | ^1.99.0 | SCSS Modules | Per-section `.module.scss` files |
| typescript | ^5 | Type safety | `Player`, `PlayerStats`, `Trophy`, `Club`, `Team` interfaces |

[VERIFIED: npm registry — package.json + installed node_modules, 2026-05-19]

### New Package Required

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| lucide-react | 1.16.0 (latest) | `Footprints` icon for bio grid | D-11 requires a foot icon; lucide-react is tree-shakeable (only one icon enters bundle), MIT license, static-export compatible, 0 runtime dependencies |

[VERIFIED: npm registry 2026-05-19] [slopcheck: OK]

**Installation:**
```bash
npm install lucide-react
```

**Version verification:**
```
npm view lucide-react version  →  1.16.0
npm view lucide-react scripts.postinstall  →  (empty — no suspicious postinstall)
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `lucide-react` | `react-icons` | react-icons includes entire icon sets, bloating the bundle; lucide-react tree-shakes to a single SVG |
| `lucide-react` | Inline SVG in JSX | Inline SVG works but no type safety, no accessibility defaults, and requires manual maintenance |
| `useScrollReveal()` hook | Duplicating `useGSAP` block in every section | A hook eliminates copy-paste, ensures consistent ScrollTrigger config, and centralizes the `.reveal-item` class contract |

---

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| lucide-react | npm | 4+ yrs (2020-10-19) | 2M+/wk | github.com/lucide-icons/lucide | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

All other packages were audited in Phase 1 research and remain approved. No additional packages required.

---

## Architecture Patterns

### System Architecture Diagram

```
content/player.ts  (TypeScript data — build time)
        │
        ▼
app/[lang]/page.tsx  (Server Component — assembles sections)
        │
        ├── <Nav />  (existing — no changes)
        ├── <HeroSection data={player} />
        │     ├── bgRef → GSAP ScrollTrigger (yPercent: 30, scrub: 1)
        │     └── textLayer → Framer Motion (stagger mount: name → pos → CTA)
        │
        ├── <AboutSection data={player} />
        │     ├── containerRef → useScrollReveal() → .reveal-item stagger
        │     └── statRef → GSAP gsap.from('[data-stat-fill]', power2.out)
        │
        ├── <TrophiesSection trophies={player.trophies} />
        │     └── containerRef → useScrollReveal() → .reveal-item (title + cards)
        │
        ├── <ClubSection club={player.club} />
        │     └── containerRef → useScrollReveal() → .reveal-item
        │
        ├── <TeamSection team={player.team} />
        │     └── containerRef → useScrollReveal() → .reveal-item
        │
        ├── <SectionStub id="highlights" title="Highlights" />  ← no animation
        ├── <SectionStub id="gallery" title="Gallery" />        ← no animation
        └── <SectionStub id="contact" title="Contact" />        ← no animation

lib/animations/useScrollReveal.ts  (shared GSAP hook)
        │ consumed by AboutSection, TrophiesSection, ClubSection, TeamSection
        ▼
GSAP ScrollTrigger → Lenis proxy (already wired in SmoothScrollProvider)
```

### Recommended Project Structure (additions for Phase 2)

```
app/[lang]/
  page.tsx              # REPLACE: remove demo content, assemble 8 sections
  ScrollFadeSection.tsx # KEEP: reference — not removed, just not used in new page
components/
  sections/             # NEW directory
    HeroSection.tsx
    HeroSection.module.scss
    AboutSection.tsx
    AboutSection.module.scss
    TrophiesSection.tsx
    TrophiesSection.module.scss
    ClubSection.tsx
    ClubSection.module.scss
    TeamSection.tsx
    TeamSection.module.scss
    SectionStub.tsx
    SectionStub.module.scss
content/                # NEW directory
  player.ts             # PlayerStats, Trophy, Club, Team, Player interfaces + data
lib/
  animations/           # NEW directory
    useScrollReveal.ts  # Extracted GSAP hook — useGSAP({ scope }) + .reveal-item
```

### Pattern 1: `useScrollReveal()` Hook

**What:** Extracts the established ScrollFadeSection pattern into a reusable hook. All non-hero sections call this instead of duplicating the `useGSAP` block.

**When to use:** Every content section except Hero and SectionStub.

```typescript
// lib/animations/useScrollReveal.ts
// Source: Extracted from app/[lang]/ScrollFadeSection.tsx (Phase 1 pattern)
// [VERIFIED: codebase — ScrollFadeSection.tsx uses exact this pattern]

'use client'  // NOT placed here — this is imported into 'use client' components

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Plugin registration: must happen in every file that uses ScrollTrigger
// OR rely on the central registration in SmoothScrollProvider.tsx
// Safe to register multiple times — GSAP's registerPlugin is idempotent
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useScrollReveal(containerRef: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return; // Skip animation — elements will appear at default opacity/position

      gsap.from('.reveal-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          scrub: false,
        },
      });
    },
    { scope: containerRef }
  );
}
```

**Important:** The `.reveal-item` class selector is scoped to `containerRef` via `{ scope: containerRef }`. This means two sections can each have elements with class `.reveal-item` without conflict — GSAP's scope option restricts the query to within the container element.

**Section component pattern:**
```typescript
// components/sections/TrophiesSection.tsx
'use client'

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Trophy } from '@/content/player';
import styles from './TrophiesSection.module.scss';

interface Props {
  trophies: Trophy[];
}

export function TrophiesSection({ trophies }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="trophies" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Trophies</h2>
      <div className={styles.grid}>
        {trophies.map((trophy) => (
          <div key={trophy.name} className={`${styles.card} reveal-item`}>
            {/* card content */}
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Pattern 2: Hero Section Animation (Dual-System)

**What:** Hero background layer is animated by GSAP (scroll parallax). Hero text layer is animated by Framer Motion (mount stagger). These are two separate DOM elements — the animation ownership rule is not violated.

**When to use:** HeroSection.tsx only.

```typescript
// components/sections/HeroSection.tsx
// Source: CONTEXT.md D-03, D-04; UI-SPEC Hero section contract
'use client'

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Player } from '@/content/player';
import styles from './HeroSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  data: Player;
}

export function HeroSection({ data }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return; // No parallax when reduced motion requested
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    { scope: heroRef }
  );

  // Framer Motion variants — mount animation (D-04)
  const nameVariant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section id="home" ref={heroRef} role="banner" className={styles.hero}>
      {/* Layer 1: Background (GSAP-controlled) */}
      <div ref={bgRef} className={styles.heroBg} aria-hidden="true" />

      {/* Layer 2: Text content (Framer Motion-controlled, mount only) */}
      <div className={styles.heroContent}>
        <motion.h1
          variants={nameVariant}
          initial="initial"
          animate={prefersReduced ? 'animate' : undefined}  // skip animation if reduced
          // When not prefersReduced, use animate with delay:
          // animate="animate" + transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className={styles.heroName}
        >
          {data.fullName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.5, ease: 'easeOut' }}
          className={styles.heroPosition}
        >
          {data.position}
        </motion.p>
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.8, ease: 'easeOut' }}
          className={styles.heroCta}
          aria-label={`Contact ${data.fullName}`}
        >
          Contact Me
        </motion.a>
      </div>
    </section>
  );
}
```

**Animation delay table (from UI-SPEC):**
| Element | Delay | Duration |
|---------|-------|----------|
| Player name | 0.2s | 0.7s |
| Position label | 0.5s | 0.6s |
| CTA button | 0.8s | 0.5s |

### Pattern 3: GSAP Stat Bar Animation

**What:** Stat bar fills animate from 0% width to their target value% using GSAP with `power2.out` easing. The `[data-stat-fill]` attribute selector is used instead of a class to avoid conflicts with any `.reveal-item` stagger on the same section.

**When to use:** Inside AboutSection.tsx for the 6 attribute bars.

```typescript
// Inside AboutSection.tsx useGSAP block (scoped to statRef)
// Source: UI-SPEC "FIFA-Style Stat Bars" — GSAP Scroll Animation

useGSAP(
  () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Set bars to their final width immediately — no animation
      gsap.set('[data-stat-fill]', {
        width: (i, el) => el.dataset.value + '%',
      });
      return;
    }
    gsap.from('[data-stat-fill]', {
      width: '0%',
      duration: 1.0,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: statRef.current,
        start: 'top 80%',
        scrub: false,
      },
    });
  },
  { scope: statRef }
);
```

**HTML structure for a stat bar:**
```tsx
// Each stat bar in the render
<div role="listitem" aria-label={`${label}: ${value} out of 100`}>
  <div className={styles.statHeader}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue}>{value}</span>
  </div>
  <div className={styles.statTrack}>
    <div
      className={styles.statFill}
      data-stat-fill   // ← GSAP selector target
      data-value={value}  // ← used by gsap.set in reduced-motion path
      style={{ width: `${value}%` }}  // ← initial width before GSAP runs
    />
  </div>
</div>
```

**Why `data-value` attribute:** The reduced-motion path uses `el.dataset.value` to read the target width without needing a separate lookup. The `style={{ width: \`${value}%\` }}` sets the initial layout width so there is no flash before GSAP initializes.

### Pattern 4: Content Data Flow

**What:** `content/player.ts` exports a typed `player` constant. `app/[lang]/page.tsx` imports it and passes it as props to section components. Sections never import from `content/` directly — per CLAUDE.md architecture rule.

```typescript
// content/player.ts — TypeScript interfaces (exact shape from UI-SPEC)
export interface PlayerStats {
  pace: number; dribbling: number; shooting: number;
  passing: number; physical: number; defending: number;
}
export interface Trophy {
  name: string; year: number; competition: string;
}
export interface Club {
  name: string; logo: string | null; description: string;
}
export interface Team {
  name: string; logo: string | null; description: string;
}
export interface Player {
  fullName: string; position: string;
  workingFoot: 'Right' | 'Left' | 'Both';
  dateOfBirth: string;   // "YYYY-MM-DD"
  nationality: string;
  bio: string;
  stats: PlayerStats;
  trophies: Trophy[];
  club: Club;
  team: Team;
}

export const player: Player = { /* ... authored placeholder data from UI-SPEC ... */ };
```

```typescript
// app/[lang]/page.tsx — server component, replaces demo page
import { player } from '@/content/player';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
// ... etc

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection data={player} />
        <AboutSection data={player} />
        <TrophiesSection trophies={player.trophies} />
        <ClubSection club={player.club} />
        <TeamSection team={player.team} />
        <SectionStub id="highlights" title="Highlights" />
        <SectionStub id="gallery" title="Gallery" />
        <SectionStub id="contact" title="Contact" />
      </main>
    </>
  );
}
```

**Note:** `page.tsx` is a Server Component (no `'use client'`). It reads `content/player.ts` at build time. Client components receive data as serializable props only.

### Pattern 5: `SectionStub` Component

**What:** A minimal server component (no animation, no `'use client'`) that renders a full-width section with only the section title. Accepts `id` and `title` props.

**When to use:** For Highlights, Gallery, Contact anchor targets.

```typescript
// components/sections/SectionStub.tsx
// Server component — no 'use client', no animation (D-20)
import styles from './SectionStub.module.scss';

interface Props {
  id: string;
  title: string;
}

export function SectionStub({ id, title }: Props) {
  return (
    <section id={id} className={styles.stub}>
      <h2 className={styles.title}>{title}</h2>
    </section>
  );
}
```

```scss
// SectionStub.module.scss
.stub {
  min-height: 60vh;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  line-height: 1.1;

  // Crimson accent rule beneath (UI-SPEC section heading treatment)
  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background-color: var(--color-accent);
    margin-top: var(--space-2);
  }
}
```

### Pattern 6: SCSS Module Class Structure for Sections

The `sassOptions.additionalData` in next.config.ts injects `@use '@/styles/mixins' as *` — so `@include respond-to('lg')` is available in every `.module.scss` without an explicit import.

**Important:** The `next.config.ts` does NOT inject `_tokens.scss` via additionalData (by design — the token file uses `:root`/`[data-theme]` selectors which would be duplicated into every SCSS module). Tokens must be used as CSS custom properties (`var(--color-accent)`) not as SCSS variables (`$color-accent`).

```scss
// Template for a content section .module.scss
// Pattern sourced from page.module.scss (Phase 1 established convention)

.section {
  padding: var(--space-16) var(--space-4);  // mobile

  @include respond-to('lg') {
    padding: var(--space-24) var(--space-8);  // desktop
  }
}

.inner {
  max-width: 1280px;
  margin: 0 auto;
}

.sectionTitle {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);  // mobile: one step down
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: var(--space-12);

  @include respond-to('md') {
    font-size: var(--text-4xl);  // desktop: full size
  }

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background-color: var(--color-accent);
    margin-top: var(--space-2);
  }
}
```

**GSAP class selector note:** GSAP targets `.reveal-item` using a bare class selector scoped to the `containerRef`. This bare class does not need to appear in the SCSS module — it is a GSAP coordination class, not a styling class. The pattern from `ScrollFadeSection.tsx` (Phase 1) uses this same approach: `className="fade-item"` on elements, `gsap.from('.fade-item', ...)` in `useGSAP`. The class carries no styles — only GSAP targeting.

### Anti-Patterns to Avoid

- **Animating the same element with both GSAP and Framer Motion:** CLAUDE.md explicitly forbids this. The hero section is safe because the background (`bgRef`) and text content are separate DOM nodes — GSAP touches only `bgRef`, Framer Motion touches only the text elements.
- **Using `gsap.registerPlugin()` inside `useGSAP()` or component function bodies:** Registration must be at module scope (top-level of the file, outside the component). `useGSAP()` only contains animation logic.
- **Importing `content/player.ts` from section components:** Per CLAUDE.md content data flow rule — sections receive data as props from `page.tsx`. This enables Phase 4 i18n to inject dictionary strings at the page level without touching sections.
- **Using `'use client'` on section wrapper if it contains no client-side APIs:** `SectionStub` needs no client APIs — it must be a Server Component. Client-side code only where `useRef`, `useGSAP`, Framer Motion, or browser APIs are used.
- **CSS transitions on stat bar fills:** UI-SPEC explicitly states "Do NOT use CSS transitions on the fill element — GSAP owns this animation." The `data-stat-fill` element must have no CSS transition.
- **Setting `style={{ width: 0 }}` as initial fill width:** This triggers a visible flash — the bar appears empty then jumps to its CSS position before GSAP runs. Instead, set `style={{ width: \`${value}%\` }}` as the real initial width; GSAP's `gsap.from()` temporarily sets it to 0% for the animation duration.
- **Using `.fade-item` class globally (unscoped):** ScrollFadeSection.tsx in the demo uses `.fade-item` without scope problems because it was a standalone demo. In Phase 2, using `.reveal-item` in section components requires `{ scope: containerRef }` in `useGSAP` — without scope, GSAP would animate ALL `.reveal-item` elements on the page when any section enters the viewport.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | Custom IntersectionObserver + CSS class toggling | GSAP ScrollTrigger via `useScrollReveal()` | ScrollTrigger handles Lenis proxy, scrub, pin, refresh, resize, and cleanup automatically |
| Smooth scroll + ScrollTrigger sync | Manual RAF loop | Existing `SmoothScrollProvider` (already wired) | Already solved in Phase 1 — `autoRaf: false` + `gsap.ticker` sync |
| Reduced motion detection | `useEffect` polling `matchMedia` | `useReducedMotion()` from `framer-motion` (for Framer Motion paths); `window.matchMedia(...)` check at GSAP animation time | Both are the idiomatic approaches for their respective systems |
| Icon SVGs | Inline SVG or custom icon component | `lucide-react` Footprints icon | Tree-shakeable, accessible, consistent stroke-width, maintained |
| Theme-aware colors in animations | Computing theme color in JS | CSS custom properties via `getComputedStyle` or just use `--color-accent` string in GSAP (GSAP reads CSS variables) | GSAP 3.x natively resolves CSS custom properties in animation targets |

**Key insight:** Phase 2 is primarily an assembly and application phase. The infrastructure is complete. The primary risks are violating the animation ownership rule and getting GSAP scope wrong — both have clear prevention strategies documented above.

---

## Common Pitfalls

### Pitfall 1: GSAP Scope Leakage Between Sections

**What goes wrong:** When one section scrolls into view, GSAP animates `.reveal-item` elements in OTHER sections that haven't entered the viewport yet.

**Why it happens:** `useScrollReveal()` uses `gsap.from('.reveal-item', ...)` which, without proper scope, queries the entire document. If two sections are close together in the DOM, GSAP may animate both.

**How to avoid:** Always pass `{ scope: containerRef }` to `useGSAP()`. This restricts the GSAP context's selector engine to elements inside `containerRef.current`. Verified: this is the exact pattern in `ScrollFadeSection.tsx` — `{ scope: containerRef }` is already there.

**Warning signs:** Multiple sections animate simultaneously when only one has entered the viewport.

### Pitfall 2: Hero Parallax Breaks with `overflow: hidden` Missing

**What goes wrong:** The background layer's `yPercent: 30` movement pushes the gradient div outside the hero section bounds, creating a visible gap or overflow bar.

**Why it happens:** The background div moves upward during scroll. Without `overflow: hidden` on the parent `<section>`, the shifted content is visible outside the section.

**How to avoid:** The hero `<section>` must have `overflow: hidden` in its SCSS. The background div must be `height: 115%` (15% larger than the container) to avoid revealing edges at the extremes of the parallax movement.

**Warning signs:** Visible strip of page background visible above or below the hero gradient during scroll.

### Pitfall 3: `motion.a` vs `<a>` for CTA Button

**What goes wrong:** Using `<button>` instead of `<a>` for the CTA. This is both semantic and accessibility wrong — the CTA navigates to `#contact`, making it an anchor link, not an action button.

**Why it happens:** Reflex to use `<button>` for anything with an animation or click handler.

**How to avoid:** Use `<motion.a href="#contact">`. Lenis intercepts native anchor clicks and smoothly scrolls to the target. `aria-label="Contact {player.fullName}"` satisfies WCAG 2.5.3 (label in name).

**Warning signs:** Element is `role="button"` in the accessibility tree when it should be a link.

### Pitfall 4: TypeScript Error — `RefObject<HTMLElement | null>` in useScrollReveal

**What goes wrong:** TypeScript error: "Type 'RefObject<HTMLDivElement>' is not assignable to type 'RefObject<HTMLElement | null>'".

**Why it happens:** `useRef<HTMLDivElement>(null)` creates `RefObject<HTMLDivElement>`. The hook signature uses `RefObject<HTMLElement | null>`. These types are incompatible in strict mode because `HTMLDivElement` is a subtype of `HTMLElement`, but `RefObject` is invariant in TypeScript.

**How to avoid:** Use `useRef<HTMLElement>(null)` in all section components, or type the hook as `RefObject<HTMLElement>` and cast in the component. Alternatively, make the hook generic: `function useScrollReveal<T extends HTMLElement>(containerRef: RefObject<T | null>): void`.

**Warning signs:** TypeScript error in section component when passing ref to `useScrollReveal()`.

### Pitfall 5: Stat Bar Width Flash Before GSAP Runs

**What goes wrong:** Stat bars appear at their target width for a frame, then jump to 0%, then animate to the target width.

**Why it happens:** `style={{ width: '0%' }}` is set as initial inline style. The component renders with 0% width, GSAP runs a tiny bit later and does `from({ width: '0%' })`, which creates the jump.

**How to avoid:** Set the initial inline style to the real target width (`style={{ width: \`${value}%\` }}`). GSAP's `.from()` overrides this to 0% for the animation and then fills to the target. This way there's no visible jump — the bar renders at full width server-side (or before JS), then GSAP takes over for the animation.

**Warning signs:** Brief flash of full-width bars before animation starts on slow connections.

### Pitfall 6: `content/player.ts` Imported in Client Component

**What goes wrong:** Build succeeds but data doesn't flow through the i18n-ready architecture.

**Why it happens:** Developer imports `player` directly in a section component for convenience (`import { player } from '@/content/player'`). Phase 4 requires dictionary injection at the page level — if sections own their data imports, Phase 4 refactoring becomes much harder.

**How to avoid:** `page.tsx` is the only file that imports from `content/`. All sections receive data exclusively as props. This is CLAUDE.md's "content data flow" rule. Enforce via code review.

**Warning signs:** `import { player } from '@/content/player'` appears in any file other than `app/[lang]/page.tsx`.

### Pitfall 7: PLAYER-02 "Real Photo" Requirement Gap

**What goes wrong:** PLAYER-02 requires "a high-quality real photo of the player" — but D-01 explicitly defers the real photo. Phase 2 satisfies the structural requirement (the image slot exists and supports `background-image` swap) but does not have a real photo.

**Why it matters:** If the PLAYER-02 checkbox is ticked as complete in Phase 2, it's misleading. The requirement describes the desired end state (real photo), not just the infrastructure.

**How to handle:** Mark PLAYER-02 as "Partially Complete" in Phase 2 verification — structural slot built, real photo deferred. The requirement will be fully complete when real photo assets are provided (likely outside of any phase — a content update).

---

## Code Examples

### SCSS for Bio Grid (About Section)

```scss
// AboutSection.module.scss — bio grid portion
// Source: UI-SPEC About/Profile section contract

.bioGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  background: var(--color-bg-elevated);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 4px;

  @include respond-to('md') {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
}

.bioField {
  // <dt> equivalent
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-1);
  font-family: var(--font-body);
}

.bioValue {
  // <dd> equivalent
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  font-family: var(--font-body);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### SCSS for Hero Background

```scss
// HeroSection.module.scss

.hero {
  position: relative;
  min-height: 100svh;  // small viewport height unit
  min-height: 100vh;   // fallback for browsers without svh support
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;    // CRITICAL: prevents parallax bleed
}

.heroBg {
  position: absolute;
  inset: 0;
  height: 115%;        // 15% larger to avoid edge exposure during parallax
  z-index: 0;
  will-change: transform;  // GPU-promoted layer
  background: linear-gradient(
    135deg,
    var(--color-bg) 0%,
    #1A0A0E 50%,
    rgba(229, 0, 43, 0.15) 100%
  );
}

.heroContent {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 var(--space-4);

  @include respond-to('md') {
    padding: 0 var(--space-8);
  }
}

.heroName {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);  // mobile: --text-5xl (61px)
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.0;
  margin-bottom: var(--space-4);

  @include respond-to('md') {
    font-size: var(--text-hero);  // desktop: --text-hero (80px)
  }
}

.heroPosition {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-8);
}

.heroCta {
  display: inline-flex;
  align-items: center;
  padding: var(--space-4) var(--space-8);
  background: var(--color-accent);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  border-radius: 4px;
  text-decoration: none;
  min-height: 48px;
  transition: background-color 150ms ease;

  &:hover {
    background: var(--color-accent-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

### Lucide React Import Pattern

```typescript
// Source: https://lucide.dev/guide/react (official docs)
// Single named import — tree-shakes to one SVG component in bundle

import { Footprints } from 'lucide-react';

// Usage in bio grid:
<span className={styles.bioValue}>
  <Footprints size={16} color="var(--color-text-muted)" aria-hidden="true" />
  {data.workingFoot}
</span>
```

[VERIFIED: lucide.dev — Footprints icon exists at https://lucide.dev/icons/footprints, lucide-react guide confirms named import pattern]

### Bio Grid Accessibility Pattern (dl/dt/dd)

```tsx
// Source: UI-SPEC Accessibility Contract — bio grid must use definition list
<dl className={styles.bioGrid}>
  <div className={styles.bioCell}>
    <dt className={styles.bioField}>Name</dt>
    <dd className={styles.bioValue}>{data.fullName}</dd>
  </div>
  <div className={styles.bioCell}>
    <dt className={styles.bioField}>Position</dt>
    <dd className={styles.bioValue}>{data.position}</dd>
  </div>
  <div className={styles.bioCell}>
    <dt className={styles.bioField}>Working Foot</dt>
    <dd className={styles.bioValue}>
      <Footprints size={16} aria-hidden="true" />
      {data.workingFoot}
    </dd>
  </div>
  <div className={styles.bioCell}>
    <dt className={styles.bioField}>Date of Birth</dt>
    <dd className={styles.bioValue}>{data.dateOfBirth}</dd>
  </div>
</dl>
```

### Metadata Update for page.tsx

```typescript
// app/[lang]/layout.tsx — update metadata for Phase 2 (not yet added)
// OR in app/[lang]/page.tsx via generateMetadata()

export const metadata: Metadata = {
  title: `${player.fullName} — Football Player`,
  description: `Scout profile for ${player.fullName}, ${player.position}. View stats, trophies, and club info.`,
};
```

**Note:** `metadata` in a Server Component can reference `content/player.ts` data. The UI-SPEC Copywriting Contract defines exactly this title and description pattern.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `gsap.from('.class')` with no scope | `useGSAP(() => {...}, { scope: ref })` | GSAP 3.11 / @gsap/react introduction | Scope prevents cross-component selector leakage |
| `motion.div` with string `animate` prop | `motion.div` with variants object or direct prop values | Framer Motion 11+ | Both still work in v12; variants are cleaner for shared animation configs |
| `framer-motion` v10: `useReducedMotion` from separate import path | `useReducedMotion` from `framer-motion` | Framer Motion v11 | Direct import confirmed working in installed v12.39.0 |
| Setting `style={{ width: 0 }}` before bar animation | `style={{ width: \`${value}%\` }}` + GSAP `.from({ width: '0%' })` | Common practice evolved | Prevents flash-of-full-width on initial render |
| `100vh` for full-screen sections | `100svh` with `100vh` fallback | CSS Values Level 4 (2022+) | `svh` accounts for mobile browser chrome (URL bar) hiding/showing |

**Deprecated/outdated:**
- `page.module.scss` demo styles: These are Phase 1 artifacts. The entire `app/[lang]/page.tsx` and `app/[lang]/page.module.scss` content is replaced in Phase 2 — the old module can be deleted or completely rewritten.
- `app/[lang]/ScrollFadeSection.tsx`: This file was Phase 1's prototype. After Phase 2 extracts `useScrollReveal()`, this file becomes dead code. It can be kept as documentation or deleted — the plan should specify.

---

## PLAYER-02 Gap Analysis

**Requirement:** PLAYER-02 — "Visitor can view a high-quality real photo of the player"

**Decision D-01:** "The image slot is intentionally left for later when real player photo is available"

**Analysis:** These are in direct conflict. The requirement describes the desired end state; the decision acknowledges that real assets don't exist yet.

**Resolution:**
- Phase 2 **builds the slot** — `HeroSection` uses `background-image` on the background layer that currently shows the gradient placeholder. A real photo can be added by setting `background-image: url('/images/player.jpg')` on `.heroBg` with no code changes.
- Phase 2 **does NOT satisfy PLAYER-02 fully** — a scout visiting during Phase 2 sees a gradient, not a real photo.
- **Recommendation for planner:** Tag PLAYER-02 as "Deferred — slot built, real asset not yet available." The requirement will be satisfied as a content update (not a code phase) once real photos are provided. This should be noted in the Phase 2 PLAN.md and VERIFICATION.md.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js build | Yes | 22.14.0 | — |
| npm | Package management | Yes | 10.9.2 | — |
| lucide-react | Bio grid foot icon | Not yet installed | 1.16.0 on registry | None — must install before implementation |
| gsap | Scroll animations | Installed | ^3.15.0 | — |
| framer-motion | Hero mount animations | Installed | ^12.39.0 | — |
| @gsap/react | useGSAP hook | Installed | ^2.1.2 | — |
| lenis | Smooth scroll | Installed | ^1.3.23 | — |

**Missing dependencies with no fallback:**
- `lucide-react` must be installed (`npm install lucide-react`) before the bio grid icon can be implemented.

**Missing dependencies with fallback:**
- None.

---

## Project Constraints (from CLAUDE.md)

| Constraint | Impact on Phase 2 |
|------------|------------------|
| **Animation rule:** Framer Motion = mount/unmount/hover; GSAP = scroll sequences. Never animate same element with both. | Hero section explicitly split: GSAP on `.heroBg`, Framer Motion on text layer elements — different DOM nodes, rule satisfied |
| **GSAP rule:** All GSAP inside `useGSAP()` from `@gsap/react` inside `'use client'` components only | Every animated section component must have `'use client'`. `gsap.registerPlugin()` at module scope outside component body |
| **Static export only** — `output: 'export'`, no SSR | No `useEffect` with server-side data fetching. All data from `content/player.ts` at build time. `'use client'` only for browser APIs |
| **SCSS Modules — NO Tailwind** | Every section has its own `.module.scss`. No utility classes. CSS custom property tokens accessed via `var(--token-name)` |
| **Content data flow:** `content/*.ts` → `app/[lang]/page.tsx` → section props | `page.tsx` is the sole importer of `content/player.ts`. Sections receive typed props only |
| **Architecture:** `components/sections/` for section components | All Phase 2 section files go in this directory |
| **`'use client'` boundary** — any component with `useRef`, `useGSAP`, Framer Motion animation, or `useState` | `SectionStub` — no client APIs → Server Component. All 5 content sections → `'use client'` |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `useReducedMotion()` from `framer-motion` v12 returns a boolean-like value that can be used to skip animation variants | Pattern 2 — Hero | If the return type changed in v12, need to use `const reduced = useReducedMotion(); const animate = reduced ? 'visible' : undefined` instead |
| A2 | GSAP's `gsap.from('[data-stat-fill]')` can use `el.dataset.value` inside the stagger function for reduced-motion path | Pattern 3 — Stat bars | If `el` in the GSAP callback doesn't expose `dataset`, use a different approach to read the target width |
| A3 | `100svh` is supported in all target browsers (modern Chrome, Firefox, Safari); the `100vh` fallback handles older browsers | SCSS — Hero section | If `svh` parsing causes errors in older SCSS/CSS processors, remove `100svh` and use only `100vh` |
| A4 | The `sassOptions.additionalData` only injects mixins (not tokens), so token CSS custom properties must be used via `var(--token)` strings in SCSS — this is already the established pattern from Phase 1 | SCSS structure | Confirmed by reading `next.config.ts` — additionalData is `@use '@/styles/mixins' as *` only; tokens via `var()` is correct |
| A5 | `ScrollFadeSection.tsx` can be left as dead code after Phase 2 without causing build errors | Project structure | If `ScrollFadeSection.tsx` is imported somewhere that isn't being replaced, leaving it causes no harm |

**A4 is marked VERIFIED** — confirmed by reading `next.config.ts` directly. Not assumed.

---

## Open Questions (RESOLVED)

1. **PLAYER-02 "real photo" vs. D-01 deferral**
   - What we know: PLAYER-02 requires a real photo; D-01 explicitly defers it; the slot will be built
   - What's unclear: Should PLAYER-02 be flagged as incomplete in Phase 2, or is "slot built" sufficient?
   - Recommendation: Tag as "Slot built — content update pending" in verification. Do not mark as fully complete.
   - RESOLVED: Plans 02-01 and 02-03 acknowledge the gap explicitly, build the .heroBg structural slot, and tag PLAYER-02 as partially satisfied per D-01.

2. **Should `ScrollFadeSection.tsx` be deleted or kept?**
   - What we know: Phase 2 replaces `page.tsx` body and extracts `useScrollReveal()` from this file
   - What's unclear: Does any other file reference `ScrollFadeSection.tsx`?
   - Recommendation: Check imports before deleting. If unused, delete in the same wave as page.tsx replacement to keep the codebase clean. If the plan deletes it, note that verification must confirm no import errors.
   - RESOLVED: Plan 02-02 Task 3 removes the ScrollFadeSection import from page.tsx; file is left on disk (harmless unused file — deletion deferred to avoid risk).

3. **`page.tsx` metadata — update in layout.tsx or generate dynamically?**
   - What we know: UI-SPEC Copywriting Contract defines `title: "{player.fullName} — Football Player"` which includes the player's name from data
   - What's unclear: `layout.tsx` has a static `metadata` export now. Updating it to dynamic `generateMetadata()` is cleaner but adds complexity.
   - Recommendation: Simple approach — update the static `metadata` const in `app/[lang]/layout.tsx` to hardcode the player name (it's a placeholder anyway). Save `generateMetadata()` for Phase 4 when i18n requires locale-specific titles.
   - RESOLVED: Plan 02-02 Task 3 updates `metadata` export in layout.tsx statically with player name and meta description; generateMetadata() deferred to Phase 4.

---

## Security Domain

`security_enforcement` is absent from config — treated as enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in Phase 2 |
| V3 Session Management | No | No sessions in Phase 2 |
| V4 Access Control | No | Public static site |
| V5 Input Validation | No | No user input in Phase 2 |
| V6 Cryptography | No | No secrets in Phase 2 |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Dependency supply chain via new package (lucide-react) | Tampering | slopcheck [OK], npm postinstall verified clean, official lucide-icons org |
| XSS via player bio text rendered as HTML | Tampering | `player.bio` is a TypeScript constant — rendered as React text node (`{data.bio}`), not `dangerouslySetInnerHTML`. No XSS vector. |

---

## Sources

### Primary (HIGH confidence)

- `app/[lang]/ScrollFadeSection.tsx` — [VERIFIED: codebase] exact GSAP pattern Phase 2 extracts into `useScrollReveal()`
- `styles/_tokens.scss` — [VERIFIED: codebase] all CSS custom property token names
- `styles/_mixins.scss` — [VERIFIED: codebase] `respond-to()` mixin is available in all `.module.scss` files
- `next.config.ts` — [VERIFIED: codebase] `sassOptions.additionalData` injects mixins only (not tokens) — CSS var() required for tokens
- `package.json` + installed `node_modules/next/package.json` — [VERIFIED: codebase] Next.js 15.5.18 installed (note: Phase 1 research claimed 16.2.6, which was incorrect — this is still the 15.x branch)
- `lib/SmoothScrollProvider.tsx` — [VERIFIED: codebase] `autoRaf: false`, GSAP ticker drives Lenis
- `.planning/phases/02-core-sections-animations/02-CONTEXT.md` — locked decisions D-01 through D-21
- `.planning/phases/02-core-sections-animations/02-UI-SPEC.md` — visual and interaction contract, animation ownership table, SCSS patterns
- `https://lucide.dev/icons/footprints` — [VERIFIED: WebSearch] Footprints icon exists in lucide-react
- `https://lucide.dev/guide/react` — [VERIFIED: WebSearch] named import pattern `import { Footprints } from 'lucide-react'`
- `npm view lucide-react` — [VERIFIED: npm registry] version 1.16.0, age 2020-10-19, source github.com/lucide-icons/lucide, no postinstall script
- `slopcheck install lucide-react` — [VERIFIED] returned [OK]
- `framer-motion` installed module — [VERIFIED: codebase] `useReducedMotion` export confirmed via node require

### Secondary (MEDIUM confidence)

- Phase 1 RESEARCH.md — patterns and verified Phase 1 decisions (Lenis ticker sync, useGSAP scope, next-themes data-theme)
- Phase 1 SUMMARY files (01-01, 01-03) — confirmed what was actually built vs. researched

### Tertiary (LOW confidence — none required for this phase)

No LOW confidence sources. All claims are verified from codebase, installed packages, or official package registry.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from installed node_modules
- Architecture patterns: HIGH — all patterns derived from actual codebase code (ScrollFadeSection, SmoothScrollProvider, Nav, page.module.scss)
- Animation patterns: HIGH — GSAP and Framer Motion patterns verified from Phase 1 codebase; ownership rule constraint from CLAUDE.md
- lucide-react: HIGH — registry verified, slopcheck OK, official source repo confirmed, Footprints icon confirmed on lucide.dev
- PLAYER-02 gap: HIGH — direct contradiction between REQUIREMENTS.md and CONTEXT.md D-01, clearly documented

**Research date:** 2026-05-19
**Valid until:** 2026-06-19 (30 days — stable ecosystem; all packages pinned)
