---
plan: 04-01
phase: 04-bilingual-support-polish
status: complete
completed_at: "2026-05-20"
tasks_completed: 4
files_modified: 5
---

# Plan 04-01 Summary: Dictionary Foundation

## What Was Done
- Filled `dictionaries/en.json` with complete 9-namespace English dictionary (nav, hero, about, trophies, club, team, highlights, gallery, contact)
- Filled `dictionaries/ua.json` with Ukrainian translations matching identical key structure
- Created `lib/getDictionary.ts` exporting `Dictionary` type (inferred via `typeof enDict`) and `getDictionary(lang)` async function using dynamic import()
- Rewrote `app/page.tsx` as a 'use client' component with localStorage-aware redirect to `BASE_PATH + whitelisted locale`
- Migrated `content/player.ts` — removed translatable fields from Trophy/Club/Team/Player interfaces and data objects (D-12 Option A)

## Key Decisions
- D-12 Option A: translatable fields removed from interfaces entirely (not kept as optional)
- D-14: trophies.items has exactly 3 entries matching player.ts trophies array length
- ROOT REDIRECT: localStorage 'locale' key whitelisted to 'ua'|'en', defaults to 'ua'
- getDictionary uses dynamic import() (not fs.readFile) for static export compatibility

## Downstream Impact
TypeScript errors now present in section components (reading removed fields) — resolved by Plan 04-03.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED
- dictionaries/en.json: FOUND
- dictionaries/ua.json: FOUND
- lib/getDictionary.ts: FOUND
- app/page.tsx: FOUND (contains 'use client' and window.location.replace)
- content/player.ts: FOUND (translatable fields removed)
- All 4 task commits confirmed in git log
