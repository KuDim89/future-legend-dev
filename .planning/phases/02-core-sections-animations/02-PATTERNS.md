# Phase 2: Core Sections & Animations - Pattern Map

**Mapped:** 2026-05-19
**Files analyzed:** 14 (9 TypeScript/TSX + 5 SCSS modules)
**Analogs found:** 14 / 14

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `content/player.ts` | model | transform (data shape) | `app/[lang]/page.tsx` (inline swatch data) | partial — same build-time static pattern |
| `lib/animations/useScrollReveal.ts` | hook | event-driven (scroll) | `app/[lang]/ScrollFadeSection.tsx` | **exact** — direct extraction |
| `components/sections/HeroSection.tsx` | component | request-response (mount) | `components/layout/Nav.tsx` (Framer Motion) + `app/[lang]/ScrollFadeSection.tsx` (GSAP) | role-match (dual-system) |
| `components/sections/HeroSection.module.scss` | config | — | `app/[lang]/page.module.scss` | exact |
| `components/sections/AboutSection.tsx` | component | CRUD (stat bars) | `app/[lang]/ScrollFadeSection.tsx` | role-match |
| `components/sections/AboutSection.module.scss` | config | — | `app/[lang]/page.module.scss` | exact |
| `components/sections/TrophiesSection.tsx` | component | CRUD (grid render) | `app/[lang]/ScrollFadeSection.tsx` | role-match |
| `components/sections/TrophiesSection.module.scss` | config | — | `app/[lang]/page.module.scss` | exact |
| `components/sections/ClubSection.tsx` | component | CRUD (single object) | `app/[lang]/ScrollFadeSection.tsx` | role-match |
| `components/sections/ClubSection.module.scss` | config | — | `app/[lang]/page.module.scss` | exact |
| `components/sections/TeamSection.tsx` | component | CRUD (single object) | `app/[lang]/ScrollFadeSection.tsx` | role-match |
| `components/sections/TeamSection.module.scss` | config | — | `app/[lang]/page.module.scss` | exact |
| `components/sections/SectionStub.tsx` | component | static | `app/[lang]/page.tsx` (section elements) | partial — server component static section |
| `components/sections/SectionStub.module.scss` | config | — | `app/[lang]/page.module.scss` | exact |
| `app/[lang]/page.tsx` | route | transform (page assembly) | current `app/[lang]/page.tsx` | **exact** — replace body only |

---

## Pattern Assignments

### `content/player.ts` (model, transform)

**Analog:** `app/[lang]/page.tsx` (inline static data arrays, lines 5–27)

**Current state (lines 1–4):** The file already exists but is a stub:
```typescript
export const player = {
  name: 'Player Name',
  position: 'Midfielder',
};
```
This must be replaced with the full typed interfaces and realistic placeholder data from UI-SPEC.

**Target pattern — TypeScript interface + export const:**
```typescript
// Modelled after page.tsx's inline typed data arrays.
// No imports needed — pure TypeScript data file.
// page.tsx is the ONLY consumer (CLAUDE.md content data flow rule).

export interface PlayerStats {
  pace: number;
  dribbling: number;
  shooting: number;
  passing: number;
  physical: number;
  defending: number;
}

export interface Trophy {
  name: string;
  year: number;
  competition: string;
}

export interface Club {
  name: string;
  logo: string | null;
  description: string;
}

export interface Team {
  name: string;
  logo: string | null;
  description: string;
}

export interface Player {
  fullName: string;
  position: string;
  workingFoot: 'Right' | 'Left' | 'Both';
  dateOfBirth: string;   // "YYYY-MM-DD"
  nationality: string;
  bio: string;
  stats: PlayerStats;
  trophies: Trophy[];
  club: Club;
  team: Team;
}

export const player: Player = { /* UI-SPEC authored data */ };
```

**No `'use client'`** — this is a pure TypeScript data module, no React.

---

### `lib/animations/useScrollReveal.ts` (hook, event-driven)

**Analog:** `app/[lang]/ScrollFadeSection.tsx` — **direct extraction**

**Core GSAP pattern** (ScrollFadeSection.tsx lines 1–29):
```typescript
'use client'; // NOT on the hook file itself — placed on consuming components

// Lines 1–9: imports + registration
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './page.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);  // module scope — idempotent

// Lines 14–30: useGSAP pattern with scope
useGSAP(
  () => {
    gsap.from('.fade-item', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'top 40%',
        scrub: false,
      },
    });
  },
  { scope: containerRef }  // CRITICAL: restricts selector to this container
);
```

**Hook output — change `.fade-item` → `.reveal-item`, remove `end`, add reduced-motion guard:**
```typescript
// lib/animations/useScrollReveal.ts
import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useScrollReveal<T extends HTMLElement>(
  containerRef: RefObject<T | null>
): void {
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReduced) return;

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

**Key delta from ScrollFadeSection:** class selector changes from `.fade-item` → `.reveal-item`; `end` property removed; reduced-motion guard added; generic type prevents TypeScript assignability error (see RESEARCH.md Pitfall 4).

---

### `components/sections/HeroSection.tsx` (component, request-response)

**Analogs:**
- GSAP layer: `app/[lang]/ScrollFadeSection.tsx` (lines 1–9, 14–30) — useGSAP + registerPlugin pattern
- Framer Motion layer: `components/layout/Nav.tsx` (lines 62–80) — motion.div with AnimatePresence / initial/animate
- ThemeToggle: `components/layout/ThemeToggle.tsx` (line 41) — `motion.button` with `whileHover`

**Imports pattern** (copy from ScrollFadeSection.tsx lines 1–9, Nav.tsx lines 1–5):
```typescript
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { Player } from '@/content/player';
import styles from './HeroSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);  // module scope
```

**GSAP parallax core pattern** (extended from ScrollFadeSection.tsx lines 14–30):
```typescript
// bgRef is the background DOM element — GSAP touches ONLY this ref
// heroRef is the section container — used as ScrollTrigger trigger
useGSAP(
  () => {
    if (prefersReduced) return;
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,          // smooth scrub — NOT scrub: false like section reveals
      },
    });
  },
  { scope: heroRef }
);
```

**Framer Motion mount pattern** (adapted from Nav.tsx lines 62–70):
```typescript
// motion.h1, motion.p, motion.a — Framer Motion owns text layer
// initial/animate with delay stagger (NOT AnimatePresence — not unmounting)
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
  className={styles.heroName}
>
  {data.fullName}
</motion.h1>
```

**Dual-layer DOM structure:**
```tsx
<section id="home" ref={heroRef} role="banner" className={styles.hero}>
  {/* Layer 1: GSAP-controlled background */}
  <div ref={bgRef} className={styles.heroBg} aria-hidden="true" />

  {/* Layer 2: Framer Motion-controlled text — DIFFERENT DOM NODE than bgRef */}
  <div className={styles.heroContent}>
    <motion.h1 ...>{data.fullName}</motion.h1>
    <motion.p ...>{data.position}</motion.p>
    <motion.a href="#contact" ...>Contact Me</motion.a>
  </div>
</section>
```

**`'use client'` boundary applies** — uses `useRef`, `useGSAP`, `motion.*`.

---

### `components/sections/HeroSection.module.scss` (config, CSS)

**Analog:** `app/[lang]/page.module.scss`

**SCSS structure pattern** (page.module.scss lines 1–14, using `@include respond-to`):
```scss
// Mixins auto-injected via sassOptions.additionalData — no explicit @use needed
// Tokens: use var(--token) — NOT $scss-variable (tokens not injected, only mixins are)

.hero {
  position: relative;
  min-height: 100svh;   // small-viewport-height unit
  min-height: 100vh;    // fallback for browsers without svh support
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;     // CRITICAL: prevents parallax bleed (RESEARCH.md Pitfall 2)
}

.heroBg {
  position: absolute;
  inset: 0;
  height: 115%;         // 15% taller to avoid edge exposure at parallax extremes
  z-index: 0;
  will-change: transform;
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

  @include respond-to('md') {    // mixin available without @use
    padding: 0 var(--space-8);
  }
}

.heroName {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);    // mobile
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.0;
  margin-bottom: var(--space-4);

  @include respond-to('md') {
    font-size: var(--text-hero); // desktop: 80px
  }
}

.heroCta {
  display: inline-flex;
  align-items: center;
  padding: var(--space-4) var(--space-8);
  background: var(--color-accent);
  color: var(--color-text);
  font-weight: 700;
  border-radius: 4px;
  text-decoration: none;
  min-height: 48px;              // WCAG touch target
  transition: background-color 150ms ease;  // CSS transition — not Framer Motion

  &:hover {
    background: var(--color-accent-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

---

### `components/sections/AboutSection.tsx` (component, CRUD)

**Analog:** `app/[lang]/ScrollFadeSection.tsx` + `components/layout/ThemeToggle.tsx`

**Imports pattern:**
```typescript
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Footprints } from 'lucide-react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Player } from '@/content/player';
import styles from './AboutSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);
```

**useScrollReveal call pattern** (adapted from ScrollFadeSection.tsx lines 12–30):
```typescript
export function AboutSection({ data }: { data: Player }) {
  const containerRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useScrollReveal(containerRef);  // section title + bio grid animate via hook
```

**Stat bar GSAP animation** (second useGSAP block — scoped to statRef, separate from containerRef):
```typescript
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReduced) {
        gsap.set('[data-stat-fill]', {
          width: (i: number, el: HTMLElement) =>
            (el as HTMLElement & { dataset: DOMStringMap }).dataset.value + '%',
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

**Stat bar JSX pattern:**
```tsx
// Set initial style to real value% — GSAP.from() overrides to 0% during animation
// This prevents the "flash of full-width before animation" (RESEARCH.md Pitfall 5)
<div
  className={styles.statFill}
  data-stat-fill
  data-value={value}
  style={{ width: `${value}%` }}
/>
```

**Bio grid accessibility pattern** (definition list — WCAG 1.3.1):
```tsx
<dl className={styles.bioGrid}>
  <div className={styles.bioCell}>
    <dt className={styles.bioField}>Working Foot</dt>
    <dd className={styles.bioValue}>
      <Footprints size={16} aria-hidden="true" color="var(--color-text-muted)" />
      {data.workingFoot}
    </dd>
  </div>
</dl>
```

**`'use client'` boundary applies** — uses `useRef`, `useGSAP`, `useScrollReveal`.

---

### `components/sections/AboutSection.module.scss` (config, CSS)

**Analog:** `app/[lang]/page.module.scss` (grid patterns lines 42–66, surface patterns lines 93–110)

**SCSS patterns to copy:**
```scss
// Section wrapper — mirrors .scrollTestSection (page.module.scss lines 93–102)
.section {
  padding: var(--space-16) var(--space-4);

  @include respond-to('lg') {
    padding: var(--space-24) var(--space-8);
  }
}

// Two-column layout — mirrors .colGrid (page.module.scss lines 42–50)
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);

  @include respond-to('lg') {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
  }
}

// Bio grid — mirrors .swatchGrid (page.module.scss lines 62–66)
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

// Field label — mirrors .colHeading (page.module.scss lines 52–60)
.bioField {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: var(--font-body);
}

// Stat bar track — mirrors .swatchRect (page.module.scss lines 72–78)
.statTrack {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--color-border);
  overflow: hidden;
}

// Stat fill — NO CSS transition (GSAP owns this — RESEARCH.md anti-pattern)
.statFill {
  height: 100%;
  border-radius: 4px;
  background: var(--color-accent);
  // transition: NONE — GSAP owns width animation
}
```

**Section title shared pattern** (applies to AboutSection, TrophiesSection, ClubSection, TeamSection):
```scss
.sectionTitle {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);  // mobile
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: var(--space-12);

  @include respond-to('md') {
    font-size: var(--text-4xl); // desktop
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

---

### `components/sections/TrophiesSection.tsx` (component, CRUD)

**Analog:** `app/[lang]/ScrollFadeSection.tsx` — useScrollReveal hook consumer pattern

**Core pattern:**
```typescript
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Trophy } from '@/content/player';
import styles from './TrophiesSection.module.scss';

export function TrophiesSection({ trophies }: { trophies: Trophy[] }) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="trophies" ref={containerRef} className={styles.section}>
      {/* Title is first in DOM order — stagger flows title → cards (D-08) */}
      <h2 className={`${styles.sectionTitle} reveal-item`}>Trophies</h2>
      <ul role="list" className={styles.grid}>
        {trophies.map((trophy) => (
          <li key={`${trophy.name}-${trophy.year}`}
              role="listitem"
              className={`${styles.card} reveal-item`}>
            {/* card content */}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**`.reveal-item` class note:** This bare class carries NO styles — it is purely a GSAP selector target, scoped to `containerRef` via `{ scope: containerRef }` in the hook. Pattern inherited directly from ScrollFadeSection.tsx's `.fade-item` approach (lines 34–49).

**`'use client'` boundary applies** — uses `useRef`, `useScrollReveal` (which uses `useGSAP`).

---

### `components/sections/TrophiesSection.module.scss` (config, CSS)

**Analog:** `app/[lang]/page.module.scss` grid patterns

```scss
.section {
  padding: var(--space-16) var(--space-4);

  @include respond-to('lg') {
    padding: var(--space-24) var(--space-8);
  }
}

// 3-col grid — mirrors .swatchGrid responsive pattern (page.module.scss lines 62–66)
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  list-style: none;
  padding: 0;

  @include respond-to('sm') {
    grid-template-columns: 1fr 1fr;
  }

  @include respond-to('lg') {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

// Trophy card — mirrors .fadeItem (page.module.scss lines 104–110)
// but adds left border accent (crimson stripe per UI-SPEC)
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent);   // crimson left stripe
  border-radius: 4px;
  padding: var(--space-6);
}
```

---

### `components/sections/ClubSection.tsx` (component, CRUD)

**Analog:** `app/[lang]/ScrollFadeSection.tsx` — same useScrollReveal hook consumer pattern as TrophiesSection

**Core pattern** (mirrors TrophiesSection structure, single object instead of array):
```typescript
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Club } from '@/content/player';
import styles from './ClubSection.module.scss';

export function ClubSection({ club }: { club: Club }) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="club" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Club</h2>
      <div className={`${styles.content} reveal-item`}>
        {/* logo placeholder + club text */}
      </div>
    </section>
  );
}
```

**Logo placeholder pattern (no `<img>` src until real logo available):**
```tsx
<div className={styles.logoPlaceholder}>
  <img
    src={club.logo ?? ''}           // empty string when null — img not rendered
    alt={`${club.name} crest`}      // alt text for accessibility
    className={styles.logoImage}
    style={{ display: club.logo ? 'block' : 'none' }}
  />
  {!club.logo && (
    <span className={styles.logoCaption}>Club crest</span>
  )}
</div>
```

**`'use client'` boundary applies** — uses `useRef`, `useScrollReveal`.

---

### `components/sections/ClubSection.module.scss` (config, CSS)

**Analog:** `app/[lang]/page.module.scss` + Nav.module.scss (`respond-to('md')` two-column pattern)

```scss
.section {
  padding: var(--space-16) var(--space-4);
  background: var(--color-bg);

  @include respond-to('lg') {
    padding: var(--space-24) var(--space-8);
  }
}

// Two-column on desktop — mirrors .colGrid (page.module.scss lines 42–50)
.content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: start;

  @include respond-to('md') {
    grid-template-columns: 160px 1fr;
    gap: var(--space-8);
  }
}

// Logo placeholder box — mirrors .swatchRect (page.module.scss lines 72–78)
.logoPlaceholder {
  width: 160px;
  height: 160px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-2);
}

.logoCaption {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-body);
}
```

---

### `components/sections/TeamSection.tsx` (component, CRUD)

**Analog:** `components/sections/ClubSection.tsx` — **identical pattern**, different prop type

**Core pattern:** Copy ClubSection.tsx exactly, substitute `Club` type with `Team`, change `id="club"` to `id="team"`, title "Club" to "Team", logo caption "Club crest" to "Team crest".

This is the established "single-object section" pattern in this codebase.

---

### `components/sections/TeamSection.module.scss` (config, CSS)

**Analog:** `components/sections/ClubSection.module.scss` — **identical structure**

Copy ClubSection.module.scss exactly. Swap `--color-bg` → `--color-bg-elevated` for the section background to create alternating rhythm (UI-SPEC Team section surface specification).

---

### `components/sections/SectionStub.tsx` (component, static)

**Analog:** Static section elements in `app/[lang]/page.tsx` (lines 36–38 pattern)

**Key difference from content sections:** NO `'use client'` — this is a Server Component. No animation. No `useRef`. Just semantic HTML.

```typescript
// Server Component — no 'use client' directive
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

**Contrast with content sections:** All content sections are `'use client'` and use `useRef` + `useScrollReveal`. SectionStub intentionally has neither — it is a pure structural anchor target per D-20.

---

### `components/sections/SectionStub.module.scss` (config, CSS)

**Analog:** `app/[lang]/page.module.scss` `.section` pattern (lines 6–14)

```scss
.stub {
  min-height: 60vh;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

// Same heading treatment as all other sections
.title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);  // mobile
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  line-height: 1.1;

  @include respond-to('md') {
    font-size: var(--text-4xl);  // desktop
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

---

### `app/[lang]/page.tsx` (route, transform — modify)

**Analog:** Current `app/[lang]/page.tsx` — replace body, keep imports structure

**Current page.tsx pattern to KEEP** (lines 1–2 import style):
```typescript
import { Nav } from '@/components/layout/Nav';
// Keep this import — Nav stays in Phase 2 (CONTEXT.md: "The <Nav /> import stays")
```

**Replace with — new page.tsx pattern** (modelled after current page structure, lines 29–118):
```typescript
// Server Component — NO 'use client'
// SOLE importer of content/player.ts (CLAUDE.md data flow rule)
import { player } from '@/content/player';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrophiesSection } from '@/components/sections/TrophiesSection';
import { ClubSection } from '@/components/sections/ClubSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { SectionStub } from '@/components/sections/SectionStub';

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

**Also update** the `metadata` export in `app/[lang]/layout.tsx` (lines 13–16):
```typescript
// Current (layout.tsx lines 13–16):
export const metadata: Metadata = {
  title: 'Design System — Future Legend Dev',
  description: 'Football player personal website',
};

// Replace with (hardcoded — save generateMetadata() for Phase 4 i18n):
export const metadata: Metadata = {
  title: 'Dmytro Kovalenko — Football Player',
  description: 'Scout profile for Dmytro Kovalenko, Central Midfielder. View stats, trophies, and club info.',
};
```

---

## Shared Patterns

### GSAP Plugin Registration
**Source:** `app/[lang]/ScrollFadeSection.tsx` line 9
**Apply to:** `lib/animations/useScrollReveal.ts`, `HeroSection.tsx`, `AboutSection.tsx`
```typescript
// Module scope — outside component, outside useGSAP
// Registration is idempotent — safe to call in multiple files
gsap.registerPlugin(ScrollTrigger, useGSAP);
```

### `useGSAP` with Scope
**Source:** `app/[lang]/ScrollFadeSection.tsx` lines 14–30
**Apply to:** `lib/animations/useScrollReveal.ts`, `HeroSection.tsx`, `AboutSection.tsx`
```typescript
useGSAP(
  () => { /* animation logic — no registerPlugin here */ },
  { scope: containerRef }  // CRITICAL: prevents cross-section selector leakage
);
```

### Framer Motion Mount Animation
**Source:** `components/layout/Nav.tsx` lines 62–80
**Apply to:** `HeroSection.tsx` text layer only
```typescript
// Pattern: initial={{ opacity: 0, y: 20 }} → animate={{ opacity: 1, y: 0 }}
// with explicit transition={{ duration, delay, ease }}
// NOT using AnimatePresence (not unmounting) — direct initial/animate props
<motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
```

### SCSS Module — Token Usage Rule
**Source:** `app/[lang]/page.module.scss` throughout (e.g., lines 3, 9, 22, 28)
**Apply to:** All `.module.scss` files in Phase 2
```scss
// CORRECT: CSS custom properties — tokens accessible in all .module.scss
background: var(--color-bg);
font-size: var(--text-base);
padding: var(--space-4);

// WRONG: SCSS variables — tokens are NOT injected as SCSS vars
// background: $color-bg;   ← This does NOT work
```

### SCSS Module — Responsive Breakpoints
**Source:** `app/[lang]/page.module.scss` lines 10–13, `components/layout/Nav.module.scss` lines 51–53
**Apply to:** All `.module.scss` files in Phase 2
```scss
// Mixin available without @use — injected via sassOptions.additionalData
@include respond-to('md') { /* overrides */ }
@include respond-to('lg') { /* overrides */ }
```

### `'use client'` Boundary Rule
**Source:** `app/[lang]/ScrollFadeSection.tsx` line 1, `components/layout/Nav.tsx` line 1
**Apply to:** `HeroSection.tsx`, `AboutSection.tsx`, `TrophiesSection.tsx`, `ClubSection.tsx`, `TeamSection.tsx`
```typescript
'use client';  // Required for: useRef, useGSAP, motion.*, useState, useEffect
// NOT required for: SectionStub.tsx, app/[lang]/page.tsx, content/player.ts
```

### Reduced Motion Guard — GSAP
**Source:** RESEARCH.md Pattern 1 (derived from codebase patterns)
**Apply to:** `lib/animations/useScrollReveal.ts`, `HeroSection.tsx` GSAP block, `AboutSection.tsx` stat bar block
```typescript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return;
// OR for stat bars: gsap.set() to final state immediately, then return
```

### Reduced Motion Guard — Framer Motion
**Source:** `components/layout/ThemeToggle.tsx` line 41 (whileHover pattern); RESEARCH.md Pattern 2
**Apply to:** `HeroSection.tsx` text layer
```typescript
import { useReducedMotion } from 'framer-motion';
const prefersReduced = useReducedMotion();
// Use prefersReduced to skip delay or set animate to final state immediately
```

### Content Data Flow (Import Guard)
**Source:** `app/[lang]/page.tsx` lines 1–2 (only file that imports content)
**Apply to:** All section components — they must NOT import from `content/`
```typescript
// ONLY in app/[lang]/page.tsx:
import { player } from '@/content/player';

// In section components: receive data as typed props only
interface Props { data: Player; }        // or trophies: Trophy[], club: Club, etc.
export function SectionName({ data }: Props) { ... }
```

---

## No Analog Found

All Phase 2 files have close analogs in the existing codebase. No files require falling back to RESEARCH.md external patterns exclusively. However, two patterns are **not yet demonstrated** in the current codebase (but are fully specified in RESEARCH.md):

| Pattern | Applied To | Source for Planner |
|---------|-----------|-------------------|
| Dual-system animation (GSAP bg + Framer Motion text on separate DOM nodes) | `HeroSection.tsx` | RESEARCH.md Pattern 2 (complete code example) |
| GSAP `[data-stat-fill]` attribute selector + `data-value` reduced-motion path | `AboutSection.tsx` | RESEARCH.md Pattern 3 (complete code example) |

Both patterns follow directly from the established `ScrollFadeSection.tsx` + `Nav.tsx` building blocks — they are compositions of proven patterns, not novel approaches.

---

## Critical Implementation Order

The RESEARCH.md primary recommendation holds: extract `useScrollReveal.ts` first. Dependency chain:

```
1. content/player.ts         ← no dependencies
2. lib/animations/useScrollReveal.ts  ← no dependencies (extracted from ScrollFadeSection pattern)
3. components/sections/SectionStub.tsx  ← no dependencies (server component)
4. components/sections/TrophiesSection.tsx  ← needs useScrollReveal + content types
5. components/sections/ClubSection.tsx      ← needs useScrollReveal + content types
6. components/sections/TeamSection.tsx      ← needs useScrollReveal + content types
7. components/sections/AboutSection.tsx     ← needs useScrollReveal + stat bar GSAP
8. components/sections/HeroSection.tsx      ← needs content types + both animation systems
9. app/[lang]/page.tsx                      ← needs all sections complete
```

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `styles/`, `content/`
**Files scanned:** 18 (all TypeScript, TSX, and SCSS files in the project)
**Pattern extraction date:** 2026-05-19
