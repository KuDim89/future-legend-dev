---
plan: 05-01
status: complete
wave: 1
completed: 2026-05-21
phase: 05-player-identity
subsystem: content
tags: [identity, content, i18n, metadata]
dependency_graph:
  requires: []
  provides: [player-identity-data, locale-strings-artem, page-metadata]
  affects: [AboutSection, HeroSection, TrophiesSection, ClubSection, TeamSection, GallerySection, HighlightsSection, ContactSection]
tech_stack:
  added: []
  patterns: [content-data-swap, locale-string-update]
key_files:
  modified:
    - content/player.ts
    - content/gallery.ts
    - dictionaries/en.json
    - dictionaries/ua.json
    - app/[lang]/layout.tsx
decisions:
  - trophies.items reduced to single Starballs CUP 2026 entry in both locales — prevents index-zip mismatch in TrophiesSection
  - highlights.comingSoon added as new key in both locales to support future HighlightsSection render path
  - errorSubmit email address removed (T-05-01 threat mitigated)
metrics:
  duration: ~12min
  completed_date: 2026-05-21
  tasks: 3
  files: 5
---

# Phase 5 Plan 01: Identity Data Swap Summary

## One-liner

Replaced all Dmytro Kovalenko placeholder content with Artem Kukharuk's real identity — defender profile, Viva Cup club, single Starballs trophy — across five content files in both locales.

## What Was Done

All five text-bearing files were updated to represent Artem Kukharuk (born 2017-01-23, age 9, Defender) replacing the fictional Dmytro Kovalenko (Central Midfielder) placeholder. No structural changes — data values only. A private email address was removed from the contact error fallback as a security mitigation (T-05-01). A new `highlights.comingSoon` key was added to both locale dictionaries.

## Files Changed

- `content/player.ts` — fullName Artem Kukharuk, DOB 2017-01-23, defender stat profile (defending 76 highest), single trophy {year: 2026}
- `content/gallery.ts` — alt text updated for 5 of 6 entries; no Dmytro or Dynamo Kyiv references remain
- `dictionaries/en.json` — position Defender, ctaAriaLabel, scout-focused bio, Viva Cup club/description, National Team TBD, trophies reduced to 1 item, errorSubmit email removed, highlights.comingSoon added
- `dictionaries/ua.json` — same keys in Ukrainian; trophies.items also 1 item; highlights.comingSoon added
- `app/[lang]/layout.tsx` — metadata title/description reference Artem Kukharuk, Defender

## Verification Results

- TypeScript: passed (npx tsc --noEmit — no errors)
- Build: passed (npm run build — both /ua/ and /en/ pre-rendered, 6/6 static pages)
- out/en/index.html: contains "Artem Kukharuk" and "Defender" — no "Dmytro Kovalenko" or "Central Midfielder"
- out/ua/index.html: contains "Захисник"

## Must-Haves Met

- fullName is "Artem Kukharuk"
- Defender position in both locales
- Viva Cup club
- Single trophy (Starballs CUP 2026)
- highlights.comingSoon key added in both locales
- No email in errorSubmit
- No Dmytro/Dynamo in gallery alt text

## Deviations from Plan

None — plan executed exactly as written. The security mitigation T-05-01 (email removal from errorSubmit) was listed in the plan's threat model and was applied as required.

## Known Stubs

- `club.logo: null` and `team.logo: null` in player.ts — intentional placeholders pending real assets (tracked in plan as "leave unchanged")
- `out/` directory contains build artifacts — not committed

## Threat Flags

T-05-01 mitigated: `dimakyh@ukr.net` removed from `contact.errorSubmit` in both en.json and ua.json.

## Self-Check: PASSED

- content/player.ts modified and committed (6ab92f1)
- content/gallery.ts modified and committed (6ab92f1)
- dictionaries/en.json modified and committed (26bbd98)
- dictionaries/ua.json modified and committed (26bbd98)
- app/[lang]/layout.tsx modified and committed (bf3a3e6)
- All three commit hashes verified in git log
