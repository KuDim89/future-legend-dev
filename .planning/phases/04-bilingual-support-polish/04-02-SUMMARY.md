---
plan: 04-02
phase: 04-bilingual-support-polish
status: complete
completed_at: "2026-05-20"
tasks_completed: 2
files_modified: 4
---

# Plan 04-02 Summary: LanguageSwitcher + Nav

## What Was Done
- Created `components/layout/LanguageSwitcher.tsx` — 'use client', mounted guard (ThemeToggle pattern), LOCALES/FLAGS constants, BASE_PATH, switchLocale writes localStorage then navigates with hash preservation
- Created `components/layout/LanguageSwitcher.module.scss` — .switcher (flex), .btn (no border/bg, uppercase), .active (var(--color-accent) underline)
- Updated `components/layout/Nav.tsx` — accepts `dict: Dictionary['nav']` prop, removed module-scope NAV_LINKS constant, labels from dict.nav.*, brand from dict.brand, LanguageSwitcher rendered in both desktop controls div and mobile menu overlay

## Key Decisions
- Mounted guard replicates ThemeToggle.tsx pattern exactly — prevents hydration mismatch
- switchLocale preserves URL hash (#section anchor) during locale switch
- No GSAP in LanguageSwitcher — hover uses CSS opacity transition per CLAUDE.md animation rule

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check

- `components/layout/LanguageSwitcher.tsx` — FOUND
- `components/layout/LanguageSwitcher.module.scss` — FOUND
- `components/layout/Nav.tsx` — FOUND (updated)
- Commit 524b556 — FOUND (Task 1)
- Commit 39a165d — FOUND (Task 2)
- TypeScript: no errors in LanguageSwitcher.tsx or Nav.tsx (remaining errors are pre-existing 04-01 section component issues)
