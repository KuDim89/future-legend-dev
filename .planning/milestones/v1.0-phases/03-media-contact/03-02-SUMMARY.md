---
phase: 03-media-contact
plan: 02
subsystem: ui
tags: [react-youtube, framer-motion, gsap, scroll-reveal, lite-embed, video-card, responsive-grid]

# Dependency graph
requires:
  - phase: 03-media-contact
    plan: 01
    provides: react-youtube 10.1.0 installed, YouTubeProps named export confirmed, content/videos.ts with VideoEntry interface and 3 entries
  - phase: 02-core-sections-animations
    provides: useScrollReveal hook, TrophiesSection grid pattern, Framer Motion import conventions
provides:
  - components/ui/VideoCard.tsx — lite-embed component with isPlaying state guard (YouTube iframe only on click)
  - components/ui/VideoCard.module.scss — 16:9 thumbnailSlot, playCircle CSS transition
  - components/sections/HighlightsSection.tsx — responsive video grid with GSAP scroll reveal
  - components/sections/HighlightsSection.module.scss — 1→2→3 col responsive grid matching TrophiesSection pattern
affects: [03-04-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lite-embed guard: <YouTube> only mounts in isPlaying === true branch — never in default JSX tree (MEDIA-03)"
    - "Animation ownership: GSAP owns scroll entrance via reveal-item on li; Framer Motion owns hover/mount/unmount on VideoCard internals; CSS owns playCircle color transition"
    - "reveal-item placed on <li> wrapper — NOT on <VideoCard> itself (GSAP scope boundary)"

key-files:
  created:
    - components/ui/VideoCard.tsx
    - components/ui/VideoCard.module.scss
    - components/sections/HighlightsSection.tsx
    - components/sections/HighlightsSection.module.scss
  modified: []

key-decisions:
  - "YouTube iframe gated behind isPlaying state — AnimatePresence mode=wait ensures clean thumbnail→player transition"
  - "playCircle color transition owned by CSS (transition: background 0.15s ease) not Framer Motion — continuous interactive state, not lifecycle animation"
  - "HighlightsSection .card li carries list-style:none reset only — VideoCard.module.scss .card supplies its own background, border, border-radius"

patterns-established:
  - "VideoCard lite-embed: useState(false) isPlaying guard, AnimatePresence mode=wait, YouTube only in truthy branch"
  - "Section grid: 1fr → 1fr 1fr (sm) → repeat(3, 1fr) (lg) — mirrors TrophiesSection verbatim"
  - "Section shell: 'use client', useRef<HTMLElement>(null), useScrollReveal(containerRef), reveal-item on h2 + intro p + each li"

requirements-completed: [MEDIA-01, MEDIA-03]

# Metrics
duration: 3min
completed: 2026-05-20
---

# Phase 03 Plan 02: VideoCard + HighlightsSection Summary

**VideoCard lite-embed with isPlaying state guard (no YouTube iframe until click) and a 1→2→3 col responsive HighlightsSection grid using GSAP scroll reveal — MEDIA-01 and MEDIA-03 satisfied**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-20T13:32:18Z
- **Completed:** 2026-05-20T13:34:28Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created VideoCard 'use client' component with isPlaying state guard — YouTube iframe is NEVER in the DOM on initial render; it mounts only after user click (MEDIA-03)
- AnimatePresence mode="wait" provides clean thumbnail-to-player swap: thumbnail exits at opacity 0 (0.15s), player fades in at opacity 0→1 (0.2s)
- Framer Motion owns hover (playOverlay + whileHover="hover" on motion.button) and mount/unmount; CSS owns playCircle background transition; GSAP owns scroll entrance on section elements
- Created HighlightsSection with useScrollReveal(containerRef), reveal-item on h2 + intro paragraph + each `<li>` — reveal-item is correctly NOT on the VideoCard element itself
- Responsive grid mirrors TrophiesSection exactly: 1 col → 1fr 1fr at sm (576px) → repeat(3, 1fr) at lg (1024px)

## Task Commits

Each task was committed atomically:

1. **Task 1: VideoCard with isPlaying lite-embed state swap** - `601c6c7` (feat)
2. **Task 2: HighlightsSection grid wrapping VideoCard** - `fe7c7cc` (feat)

## Files Created/Modified

- `components/ui/VideoCard.tsx` — 'use client' component; isPlaying guard; AnimatePresence mode=wait; thumbnail img with loading=lazy; YouTube mounted only when isPlaying===true
- `components/ui/VideoCard.module.scss` — aspect-ratio: 16/9 thumbnailSlot; playCircle with CSS transition (not Framer Motion); card with overflow:hidden
- `components/sections/HighlightsSection.tsx` — 'use client' section; useScrollReveal(containerRef); videos.map to VideoCard inside li.reveal-item
- `components/sections/HighlightsSection.module.scss` — section/sectionTitle verbatim from TrophiesSection; intro paragraph style; responsive grid; .card li reset only

## Decisions Made

- YouTube iframe gated strictly behind `isPlaying === true` branch — AnimatePresence mode="wait" ensures the thumbnail fully exits before the player div mounts, preventing flicker
- `playCircle` hover color transition owned by CSS (`transition: background 0.15s ease`) not Framer Motion — per animation ownership rule (CLAUDE.md): CSS owns continuous/interactive loops, Framer Motion owns lifecycle
- `.card` in HighlightsSection.module.scss is a pure list-item reset (`list-style: none`) — VideoCard.module.scss's `.card` already provides `background`, `border`, `border-radius`, so no double-boxing occurs

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — TypeScript compiled clean on first attempt for both tasks.

## Threat Surface Scan

| Threat ID | Status |
|-----------|--------|
| T-03-03 (lite-embed guard) | MITIGATED — `<YouTube>` appears only in the `isPlaying === true` branch; acceptance criteria verified by grep |
| T-03-04 (XSS via videoId/title) | ACCEPTED — videoId and title come from build-time content/videos.ts (developer-authored); rendered as React attribute/text nodes, no dangerouslySetInnerHTML |

No new threat surface introduced beyond what was in the plan's threat model.

## Known Stubs

None — all VideoCard data is wired from VideoEntry props; HighlightsSection receives videos array from parent. page.tsx wiring is intentionally deferred to plan 03-04.

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- VideoCard and HighlightsSection are ready for wiring in plan 03-04 (page.tsx integration)
- Import pattern for page.tsx: `import { HighlightsSection } from '@/components/sections/HighlightsSection'` + `import { videos } from '@/content/videos'` → `<HighlightsSection videos={videos} />`
- TypeScript compiles clean with all new files

---
*Phase: 03-media-contact*
*Completed: 2026-05-20*
