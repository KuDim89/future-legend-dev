---
phase: 02-core-sections-animations
plan: "02"
subsystem: ui
tags: [typescript, gsap, gsap-react, framer-motion, scss-modules, hero-section, parallax, animation]

# Dependency graph
requires:
  - phase: 02-core-sections-animations
    provides: content/player.ts (Player interfaces + data), lib/animations/useScrollReveal.ts, lucide-react installed
  - phase: 01-foundation-design-system
    provides: GSAP + Lenis wiring (SmoothScrollProvider), SCSS token system, design tokens, Nav component

provides:
  - "components/sections/HeroSection.tsx: full-screen hero with GSAP parallax on bgRef (yPercent:30 scrub:1) + Framer Motion mount stagger on text layer (0.2/0.5/0.8s delays)"
  - "components/sections/HeroSection.module.scss: hero layout with overflow:hidden, heroBg at height:115%, heroContent at z-index:1"
  - "components/sections/SectionStub.tsx: server component accepting id and title props, no animation"
  - "components/sections/SectionStub.module.scss: min-height 60vh, centered title with crimson accent ::after rule"
  - "app/[lang]/page.tsx: page assembly with Nav + HeroSection + 3 SectionStubs, imports player from content/"
  - "app/[lang]/layout.tsx: updated metadata title to Dmytro Kovalenko — Football Player"

affects: [02-03, all Phase 2 section consumers of page.tsx assembly pattern]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dual-system animation on separate DOM nodes: GSAP on bgRef (scroll/parallax), Framer Motion on text layer (mount) — CLAUDE.md ownership rule satisfied"
    - "useGSAP({ scope: heroRef }) with gsap.to(bgRef.current) for GSAP-only parallax layer"
    - "useReducedMotion() from framer-motion passed as delay override — prefersReduced ? 0 : delay"
    - "Server Component pattern: SectionStub has no 'use client', no useRef, no animation — pure structural anchor target"
    - "page.tsx as sole content/player.ts importer — sections receive data exclusively as typed props"

key-files:
  created:
    - components/sections/HeroSection.tsx
    - components/sections/HeroSection.module.scss
    - components/sections/SectionStub.tsx
    - components/sections/SectionStub.module.scss
  modified:
    - app/[lang]/page.tsx
    - app/[lang]/layout.tsx

key-decisions:
  - "GSAP useGSAP block uses gsap.to (not gsap.from) for parallax — background moves down as user scrolls down, creating depth"
  - "SectionStub intentionally omits 'use client' — it is a Server Component structural anchor, not an animated content section"
  - "page.tsx in Plan 02-02 assembles only Nav + HeroSection + 3 SectionStubs — AboutSection/TrophiesSection/ClubSection/TeamSection deferred to Plan 02-03 (those components do not exist yet)"
  - "layout.tsx metadata updated statically (hardcoded player name) — generateMetadata() deferred to Phase 4 for i18n"
  - "min-height uses both 100vh fallback AND 100svh (svh accounts for mobile browser chrome hiding/showing)"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04]

# Metrics
duration: 3min
completed: 2026-05-19
---

# Phase 2 Plan 02: Hero Section and Page Assembly Summary

**Cinematic hero section with GSAP ScrollTrigger parallax background (yPercent:30) and Framer Motion mount stagger on separate text layer, plus SectionStub server component and page.tsx scaffold wired to player data**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-19T17:11:15Z
- **Completed:** 2026-05-19T17:13:57Z
- **Tasks:** 3
- **Files modified:** 6 (HeroSection.tsx, HeroSection.module.scss, SectionStub.tsx, SectionStub.module.scss, page.tsx, layout.tsx)

## Accomplishments

- Built `HeroSection` with dual-system animation: GSAP ScrollTrigger on `bgRef` (parallax yPercent:30, scrub:1) and Framer Motion stagger on text layer (motion.h1/p/a at 0.2/0.5/0.8s delays) — two separate DOM elements, CLAUDE.md animation ownership rule fully satisfied
- Built `SectionStub` as a pure Server Component (no 'use client', no animation, no useRef) accepting `id` and `title` props — structural nav anchor targets per D-20
- Rewrote `app/[lang]/page.tsx` replacing the entire Phase 1 design system demo with Nav + HeroSection + 3 SectionStubs; page imports `player` from content/ as the sole consumer per CLAUDE.md data flow rule
- Updated `app/[lang]/layout.tsx` metadata title to 'Dmytro Kovalenko — Football Player' with scout-facing meta description
- `npx next build` exits 0; bundle size 43.5kB for /[lang] route

## Task Commits

1. **Task 1: Create SectionStub component (server component, no animation)** - `98d5d79` (feat)
2. **Task 2: Create HeroSection with dual-system animation (GSAP parallax + Framer Motion mount)** - `27c39df` (feat)
3. **Task 3: Rewrite page.tsx with 8-section assembly and update layout.tsx metadata** - `52a0070` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `components/sections/HeroSection.tsx` - Full-screen hero client component; GSAP ScrollTrigger on bgRef (module-scope registerPlugin), Framer Motion initial/animate on motion.h1/p/a with delay stagger; useReducedMotion guard disables animation when requested
- `components/sections/HeroSection.module.scss` - Hero layout: overflow:hidden, 100svh height, heroBg at height:115% with gradient, heroContent z-index:1, heroCta min-height:48px WCAG touch target
- `components/sections/SectionStub.tsx` - Server Component; no 'use client'; accepts id and title props; renders `<section id={id}>` with centered h2
- `components/sections/SectionStub.module.scss` - min-height 60vh, flex centered, Oswald title with 40x3px crimson ::after accent rule
- `app/[lang]/page.tsx` - Replaced design system demo; imports player from content/ (sole importer); assembles Nav + HeroSection + SectionStubs for highlights/gallery/contact
- `app/[lang]/layout.tsx` - Updated metadata: title 'Dmytro Kovalenko — Football Player', scout-facing meta description

## Decisions Made

- **GSAP uses `gsap.to` not `gsap.from` for parallax:** Background moves from its start position downward as user scrolls, creating a depth effect. `gsap.to` drives the background to yPercent:30 over the hero scroll distance.
- **page.tsx includes only Hero + 3 Stubs in this plan:** AboutSection, TrophiesSection, ClubSection, TeamSection components do not exist yet — they are built in Plan 02-03. Importing non-existent components would break the build. Page scaffold will be extended in Plan 02-03.
- **SectionStub is a Server Component:** No animation required (D-20 specifies "no GSAP, no Framer Motion") — no client APIs needed, so `'use client'` would be wasteful and misleading.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

- `player.club.logo: null` and `player.team.logo: null` — carried forward from Plan 02-01; logo placeholder slots built structurally, real assets deferred as content updates (D-16, D-17)
- PLAYER-02 ("high-quality real photo"): `.heroBg` CSS layer has `background` gradient placeholder; the `background-image` property slot supports a future swap with `url('/images/player.jpg')` per D-01. Real photo is a deferred content update — not a code phase deliverable.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. `data.fullName` in `aria-label` is a TypeScript string constant from content/player.ts — rendered as an HTML attribute, not innerHTML. No XSS vector. No threat flags.

## Next Phase Readiness

- `HeroSection` is wired and buildable — visitor can land on the full-screen cinematic hero with parallax background and staggered text entrance
- `SectionStub` is available for Plan 02-03 to use for all remaining stub anchors
- `page.tsx` scaffold is ready for Plan 02-03 to add AboutSection, TrophiesSection, ClubSection, TeamSection imports
- Build exits 0 — ready for Plan 02-03 (content sections: About, Trophies, Club, Team)

## Self-Check

- [x] `components/sections/HeroSection.tsx` exists: FOUND
- [x] `components/sections/HeroSection.module.scss` exists: FOUND
- [x] `components/sections/SectionStub.tsx` exists: FOUND
- [x] `components/sections/SectionStub.module.scss` exists: FOUND
- [x] `app/[lang]/page.tsx` rewrote (no swatch arrays, no ScrollFadeSection): PASS
- [x] `app/[lang]/layout.tsx` title updated: PASS
- [x] Task 1 commit `98d5d79` exists: FOUND
- [x] Task 2 commit `27c39df` exists: FOUND
- [x] Task 3 commit `52a0070` exists: FOUND
- [x] `npx next build` exits 0: PASS
- [x] `npx tsc --noEmit` exits 0: PASS

## Self-Check: PASSED

---
*Phase: 02-core-sections-animations*
*Completed: 2026-05-19*
