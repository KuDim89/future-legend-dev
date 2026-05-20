---
phase: 02-core-sections-animations
plan: "01"
subsystem: ui
tags: [typescript, gsap, gsap-react, lucide-react, player-data, scroll-animation]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: GSAP + Lenis wiring (SmoothScrollProvider), SCSS token system, useGSAP pattern in ScrollFadeSection.tsx
provides:
  - "content/player.ts: PlayerStats, Trophy, Club, Team, Player typed interfaces + Dmytro Kovalenko placeholder data"
  - "lib/animations/useScrollReveal.ts: shared GSAP scroll-reveal hook with reduced-motion guard"
  - "lucide-react@1.16.0 installed as dependency"
affects: [02-02, 02-03, all Phase 2 section components]

# Tech tracking
tech-stack:
  added: [lucide-react@1.16.0]
  patterns:
    - "Generic hook pattern: useScrollReveal<T extends HTMLElement>(ref) to avoid TS RefObject assignability error"
    - "Module-scope gsap.registerPlugin — idempotent, safe across multiple files"
    - "Reduced-motion guard in GSAP hooks: window.matchMedia check with early return"
    - "Pure TypeScript data module: no 'use client', no React imports in content/"

key-files:
  created:
    - content/player.ts
    - lib/animations/useScrollReveal.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Generic hook signature useScrollReveal<T extends HTMLElement>(containerRef: RefObject<T | null>): void prevents TypeScript assignability errors when consumers pass RefObject<HTMLElement> or subtypes"
  - "Selector changed from .fade-item (ScrollFadeSection) to .reveal-item to avoid name collision with Phase 1 demo component"
  - "Removed 'end' property from scrollTrigger config — fires once at top 80%, stays visible (D-09)"
  - "lucide-react installed now (Task 1) so Plan 02-02 AboutSection can immediately use Footprints icon without a separate install step"

patterns-established:
  - "useScrollReveal pattern: import hook in 'use client' section component, pass containerRef, add reveal-item class to animated elements"
  - "content/player.ts shape: five named interface exports followed by export const player: Player — no imports, no 'use client'"

requirements-completed: [PLAYER-01, PLAYER-03, PLAYER-04, HOME-04]

# Metrics
duration: 2min
completed: 2026-05-19
---

# Phase 2 Plan 01: Player Data Layer and Scroll-Reveal Hook Summary

**Typed Player data layer (5 interfaces + Dmytro Kovalenko placeholder data) and shared GSAP useScrollReveal hook extracted from Phase 1 ScrollFadeSection pattern with generic signature and reduced-motion guard**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-19T17:07:14Z
- **Completed:** 2026-05-19T17:09:16Z
- **Tasks:** 2
- **Files modified:** 4 (content/player.ts, lib/animations/useScrollReveal.ts, package.json, package-lock.json)

## Accomplishments

- Replaced the 4-line `content/player.ts` stub with a full typed data module: 5 exported interfaces (PlayerStats, Trophy, Club, Team, Player) and a realistic `player` constant with Dmytro Kovalenko's authored biography, 6 FIFA-style stats, 3 trophies, club, and national team data
- Created `lib/animations/useScrollReveal.ts` — a generic GSAP hook extracted from Phase 1's `ScrollFadeSection.tsx` with the `.reveal-item` selector, `top 80%` trigger, `power1.out` easing, and a `prefers-reduced-motion` guard
- Installed `lucide-react@1.16.0` (required by Plan 02-02 `AboutSection` for the `Footprints` working-foot icon)
- `npx next build` passes with zero errors

## Task Commits

1. **Task 1: Install lucide-react and rewrite content/player.ts** - `d7cb629` (feat)
2. **Task 2: Create lib/animations/useScrollReveal.ts** - `c2b2edd` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `content/player.ts` - Five exported TypeScript interfaces + typed `player` constant with full Dmytro Kovalenko placeholder data; pure data module (no imports, no 'use client')
- `lib/animations/useScrollReveal.ts` - Generic GSAP scroll-reveal hook; targets `.reveal-item` within scoped containerRef; respects prefers-reduced-motion
- `package.json` - Added `lucide-react@1.16.0` dependency
- `package-lock.json` - Lock file updated for lucide-react

## Decisions Made

- **Generic hook signature** (`useScrollReveal<T extends HTMLElement>`): prevents TypeScript RefObject assignability errors when different HTMLElement subtypes are passed — documented in RESEARCH.md Pitfall 4
- **Selector renamed** `.fade-item` → `.reveal-item`: avoids naming collision with the Phase 1 `ScrollFadeSection.tsx` demo component which remains on disk
- **`end` property removed** from scrollTrigger: Phase 1 ScrollFadeSection had `end: 'top 40%'` with scrub enabled; Plan specifies no `end` and `scrub: false` — fires once, stays visible (Decision D-09)
- **lucide-react installed in Task 1**: although the icon is consumed in Plan 02-02, the package install is gated here (Plan 02-01 task 1) per threat model T-02-01 to keep package legitimacy audit co-located with install

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

- `player.club.logo: null` — logo placeholder; real crest will be set as a string path when asset is available (D-16)
- `player.team.logo: null` — same as above for national team crest (D-17)
- PLAYER-02 ("high-quality real photo"): The `.heroBg` CSS layer supports `background-image` swap per D-01. The slot is structurally built in Plan 02-02 HeroSection; the real photo is deferred as a content update. PLAYER-02 is partially satisfied — not fully complete.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. `content/player.ts` is a TypeScript constant — rendered as React text nodes (no `dangerouslySetInnerHTML`). No threat flags.

## Next Phase Readiness

- `content/player.ts` is ready: all Phase 2 section components can import types and the `player` constant is available via `page.tsx`
- `lib/animations/useScrollReveal.ts` is ready: all non-hero sections can call `useScrollReveal(containerRef)` immediately
- `lucide-react` is installed: Plan 02-02 `AboutSection` can import `Footprints` immediately
- Ready for Plan 02-02 (HeroSection + AboutSection + TrophiesSection) and Plan 02-03 (ClubSection + TeamSection + SectionStub + page.tsx assembly)

## Self-Check

- [x] `content/player.ts` exists: FOUND
- [x] `lib/animations/useScrollReveal.ts` exists: FOUND
- [x] Task 1 commit `d7cb629` exists: FOUND
- [x] Task 2 commit `c2b2edd` exists: FOUND
- [x] `npx tsc --noEmit` exits 0: PASS
- [x] `npm ls lucide-react` shows installed: FOUND (1.16.0)
- [x] `next build` exits 0: PASS

## Self-Check: PASSED

---
*Phase: 02-core-sections-animations*
*Completed: 2026-05-19*
