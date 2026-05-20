---
phase: 02-core-sections-animations
plan: "03"
subsystem: ui
tags: [typescript, gsap, gsap-react, lucide-react, scss-modules, about-section, trophies, club, team, stat-bars, scroll-reveal, page-assembly]

# Dependency graph
requires:
  - phase: 02-core-sections-animations
    provides: content/player.ts (Player interfaces + data), lib/animations/useScrollReveal.ts, lucide-react installed, HeroSection, SectionStub, page.tsx scaffold
  - phase: 01-foundation-design-system
    provides: GSAP + Lenis wiring (SmoothScrollProvider), SCSS token system, design tokens

provides:
  - "components/sections/AboutSection.tsx: bio grid (dl/dt/dd) + narrative bio + 6 FIFA-style GSAP stat bars with power2.out scroll animation"
  - "components/sections/AboutSection.module.scss: about layout, bio grid, stat bar track/fill styles (no CSS transition on .statFill)"
  - "components/sections/TrophiesSection.tsx: 3 trophy cards grid with crimson left border stripe and useScrollReveal"
  - "components/sections/TrophiesSection.module.scss: responsive 1->2->3 column grid, card with border-left: 4px solid var(--color-accent)"
  - "components/sections/ClubSection.tsx: club info with 160x160px logo placeholder and useScrollReveal"
  - "components/sections/ClubSection.module.scss: var(--color-bg) background, 160px logo placeholder grid layout"
  - "components/sections/TeamSection.tsx: team info mirroring ClubSection, var(--color-bg-elevated) background"
  - "components/sections/TeamSection.module.scss: identical to ClubSection layout with bg-elevated for alternating surface rhythm"
  - "app/[lang]/page.tsx: complete 8-section assembly in D-21 nav order — HeroSection, AboutSection, TrophiesSection, ClubSection, TeamSection + 3 SectionStubs"
affects: [Phase 3 media/contact, Phase 4 i18n, all consumers of page.tsx assembly]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Two separate useGSAP blocks in one component: containerRef for useScrollReveal (section reveal), statRef for stat bar fill animation — separate scopes prevent selector conflicts"
    - "GSAP data-attribute selector pattern: [data-stat-fill] with data-value for reduced-motion path (el.dataset.value + '%')"
    - "Stat bar flash prevention: initial style={{ width: value% }}, GSAP.from() overrides to 0% during animation — no flash before GSAP initializes"
    - "import type for interface types (Trophy, Club, Team) in section components — satisfies content data flow rule without importing runtime constants"
    - "Alternating section background: ClubSection uses var(--color-bg), TeamSection uses var(--color-bg-elevated)"

key-files:
  created:
    - components/sections/AboutSection.tsx
    - components/sections/AboutSection.module.scss
    - components/sections/TrophiesSection.tsx
    - components/sections/TrophiesSection.module.scss
    - components/sections/ClubSection.tsx
    - components/sections/ClubSection.module.scss
    - components/sections/TeamSection.tsx
    - components/sections/TeamSection.module.scss
  modified:
    - app/[lang]/page.tsx

key-decisions:
  - "Two-block GSAP pattern in AboutSection: useScrollReveal(containerRef) for section-level reveal, separate useGSAP({ scope: statRef }) for stat bars — prevents stat bar GSAP from interfering with section reveal stagger"
  - "import type for Trophy/Club/Team interfaces in section files: satisfies CLAUDE.md content data flow rule (no runtime player constant import) while preserving TypeScript type safety"
  - "Stat bar reduced-motion path: gsap.set('[data-stat-fill]', { width: el.dataset.value + '%' }) sets final widths immediately rather than skipping — ensures bars show correct values even without animation"
  - "PLAYER-02 deferred: HeroSection .heroBg structural slot built in Plan 02-02; real player photo is a content update per D-01 — not a code deliverable for this plan"

patterns-established:
  - "AboutSection dual-GSAP pattern: containerRef + statRef as separate scopes for section reveal and stat bar animation"
  - "Logo placeholder pattern: conditional render — img when logo truthy, span with caption when null"
  - "Section alternating backgrounds: odd sections var(--color-bg), even sections var(--color-bg-elevated)"

requirements-completed: [PLAYER-01, PLAYER-02, PLAYER-03, PLAYER-04, SECT-01, SECT-02, SECT-03]

# Metrics
duration: 3min
completed: 2026-05-19
---

# Phase 2 Plan 03: Player Profile Sections and Complete Page Assembly Summary

**Four player profile sections (About with GSAP stat bar animation, Trophies grid, Club, Team) wired into the complete 8-section scout-facing homepage with `npx next build` exiting 0**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-19T17:16:32Z
- **Completed:** 2026-05-19T17:19:52Z
- **Tasks:** 3
- **Files modified:** 9 (AboutSection.tsx/.scss, TrophiesSection.tsx/.scss, ClubSection.tsx/.scss, TeamSection.tsx/.scss, app/[lang]/page.tsx)

## Accomplishments

- Built `AboutSection` with dl/dt/dd bio grid (Name, Position, Working Foot with Footprints icon, Date of Birth), narrative bio paragraph, and 6 FIFA-style stat bars animated from 0% to value% via GSAP on scroll (power2.out, 1.0s duration, 0.15s stagger). Dual useGSAP scopes: containerRef for section-level reveal, statRef for stat bar fill animation. Reduced-motion guard uses gsap.set() to final widths immediately.
- Built `TrophiesSection` with 3 trophy cards in a responsive grid (1 → 2 → 3 columns) featuring the crimson left border stripe (border-left: 4px solid var(--color-accent)). useScrollReveal provides section title → cards stagger entrance.
- Built `ClubSection` and `TeamSection` with 160×160px logo placeholders (conditional: span caption when logo is null, img when set), club/team name and description, useScrollReveal scroll entrance. Alternating backgrounds: Club uses var(--color-bg), Team uses var(--color-bg-elevated).
- Updated `app/[lang]/page.tsx` to assemble all 8 sections in D-21 nav order. File remains a Server Component (no 'use client') and is the sole importer of content/player.ts.
- `npx next build` exits 0 — /ua and /en pre-rendered as static HTML.

## Task Commits

1. **Task 1: Build AboutSection with bio grid, narrative bio, and GSAP stat bars** - `e207fac` (feat)
2. **Task 2: Build TrophiesSection, ClubSection, TeamSection with scroll reveals** - `a869704` (feat)
3. **Task 3: Complete page.tsx 8-section assembly and run final build** - `a217bfe` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `components/sections/AboutSection.tsx` - 'use client'; bio grid (dl/dt/dd) + narrative bio + 6 stat bars; two useGSAP scopes (containerRef for reveals, statRef for stat bars); Footprints icon aria-hidden="true"; reduced-motion guard with gsap.set()
- `components/sections/AboutSection.module.scss` - Two-column layout, bio grid container with bg-elevated, stat track/fill; .statFill has NO CSS transition (GSAP-owned)
- `components/sections/TrophiesSection.tsx` - 'use client'; ul/li with role="list/listitem"; trophy name/competition/year; useScrollReveal; reveal-item on h2 and each card
- `components/sections/TrophiesSection.module.scss` - Responsive grid repeat(3, 1fr) at lg; .card with border-left: 4px solid var(--color-accent) crimson stripe
- `components/sections/ClubSection.tsx` - 'use client'; conditional logo render (img or span caption); useScrollReveal; reveal-item on h2 and content div
- `components/sections/ClubSection.module.scss` - background: var(--color-bg); 160x160px logoPlaceholder; two-column grid at md
- `components/sections/TeamSection.tsx` - Mirror of ClubSection with Team type and 'Team crest' caption
- `components/sections/TeamSection.module.scss` - Mirror of ClubSection with background: var(--color-bg-elevated) for alternating surface
- `app/[lang]/page.tsx` - Imports all 5 named section components; renders 8 sections in D-21 order; Server Component; sole content/player.ts importer

## Decisions Made

- **Two-block GSAP pattern in AboutSection:** containerRef drives useScrollReveal (section title + bio grid reveal), separate statRef drives stat bar fill animation. Separate scopes prevent GSAP from conflating the two animation systems and ensure the stat bars animate independently with the correct easing and stagger.
- **import type for interface types:** TrophiesSection, ClubSection, TeamSection use `import type { Trophy }` / `import type { Club }` / `import type { Team }` — this satisfies the CLAUDE.md content data flow rule (no runtime player constant imported in section components) while keeping TypeScript types.
- **Stat bar reduced-motion path:** Uses gsap.set() to final widths rather than skipping animation entirely — ensures bars display at correct values for users who prefer reduced motion.
- **PLAYER-02 note:** HeroSection's .heroBg slot is structurally built (Plan 02-02). Real player photo is a deferred content update per D-01. PLAYER-02 is marked "Slot built — real asset content update pending."

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

- `player.club.logo: null` and `player.team.logo: null` — carried forward from Plan 02-01; logo placeholder slots built structurally, real assets deferred as content updates (D-16, D-17)
- PLAYER-02 ("high-quality real photo"): `.heroBg` CSS layer supports `background-image` swap per D-01. Slot built in Plan 02-02 HeroSection. Real photo deferred as content update — not a code phase deliverable. PLAYER-02 is partially satisfied.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. All data rendered from TypeScript constants (player.ts) as React text nodes — no dangerouslySetInnerHTML. club.logo and team.logo are null in Phase 2 — conditional rendering prevents any img src from being set. No threat flags.

## Next Phase Readiness

- Phase 2 scout-facing homepage is complete: a scout can scroll through the full cinematic homepage — hero entrance, player profile with animated stat bars, trophies grid, club and team information, and stub placeholders for Phase 3 media and contact sections
- All 8 sections render with correct D-21 nav order — all nav anchor links (#about, #trophies, #club, #team, #highlights, #gallery, #contact) resolve correctly
- `npx next build` exits 0 — production-ready static export for GitHub Pages deployment
- Ready for Phase 3: Media & Contact (YouTube embeds, photo gallery lightbox, contact form)

## Self-Check

- [x] `components/sections/AboutSection.tsx` exists: FOUND
- [x] `components/sections/AboutSection.module.scss` exists: FOUND
- [x] `components/sections/TrophiesSection.tsx` exists: FOUND
- [x] `components/sections/TrophiesSection.module.scss` exists: FOUND
- [x] `components/sections/ClubSection.tsx` exists: FOUND
- [x] `components/sections/ClubSection.module.scss` exists: FOUND
- [x] `components/sections/TeamSection.tsx` exists: FOUND
- [x] `components/sections/TeamSection.module.scss` exists: FOUND
- [x] `app/[lang]/page.tsx` imports all 5 named sections: PASS
- [x] TrophiesSection.module.scss contains `border-left: 4px solid var(--color-accent)`: PASS
- [x] ClubSection.module.scss contains `background: var(--color-bg)`: PASS
- [x] TeamSection.module.scss contains `background: var(--color-bg-elevated)`: PASS
- [x] AboutSection.module.scss .statFill has NO `transition` property: PASS
- [x] AboutSection.tsx contains `data-stat-fill` GSAP selector: PASS
- [x] page.tsx has no 'use client': PASS
- [x] No section component imports player runtime constant from content/: PASS
- [x] Task 1 commit `e207fac` exists: FOUND
- [x] Task 2 commit `a869704` exists: FOUND
- [x] Task 3 commit `a217bfe` exists: FOUND
- [x] `npx next build` exits 0, /ua and /en pre-rendered: PASS

## Self-Check: PASSED

---
*Phase: 02-core-sections-animations*
*Completed: 2026-05-19*
