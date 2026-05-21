---
plan: 05-02
status: complete
wave: 2
completed: 2026-05-21
---

# Summary: 05-02 Video Placeholder

## What Was Done

Extended VideoEntry with an optional `isPlaceholder` flag, implemented a Clock-icon "coming soon" branch in VideoCard (early return before any YouTube embed logic), added muted SCSS styles for the placeholder slot, and wired HighlightsSection to pass the locale dictionary label conditionally. All 3 video entries are now flagged as placeholders, so no img.youtube.com thumbnail requests are made and no broken YouTube tiles appear.

## Files Changed

- `content/videos.ts` — added `isPlaceholder?: boolean` to VideoEntry interface; flagged all 3 entries `isPlaceholder: true`; updated stale UCL/Dynamo titles to neutral "Coming Soon" text
- `components/ui/VideoCard.tsx` — imported Clock from lucide-react; added `comingSoonLabel?: string` prop; inserted placeholder guard (early return with Clock icon card) after useState hook call
- `components/ui/VideoCard.module.scss` — added `.placeholderSlot` and `.placeholderIcon` classes using `var(--color-*)` token convention
- `components/sections/HighlightsSection.tsx` — changed VideoCard call to pass `comingSoonLabel={video.isPlaceholder ? dict.comingSoon : undefined}`

## Verification Results

- TypeScript: clean (npx tsc --noEmit exited 0)
- Build: clean (npm run build exited 0, both /ua and /en pre-rendered successfully)

## Must-Haves Met

- 3 placeholder cards render — none are clickable YouTube tiles
- No img.youtube.com requests for placeholder entries (early return exits before thumbnail src is constructed)
- Real VideoCard path unchanged — existing play/iframe code untouched below the guard
- Both locales show coming soon text (EN: dict.highlights.comingSoon / UA: equivalent key)

## Deviations from Plan

None - plan executed exactly as written.
