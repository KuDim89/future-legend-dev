# Milestones: Future Legend — Football Player Personal Website

---

## v1.0 MVP

**Shipped:** 2026-05-20
**Phases:** 1–4 (4 phases, 14 plans)
**Timeline:** 2026-05-19 → 2026-05-20 (2 days)
**Files:** 113 files, ~24,930 insertions, ~2,100 LOC (TypeScript/TSX/SCSS)

### Delivered

A fully bilingual, cinematic football player portfolio website deployed live on GitHub Pages — scouts and coaches can discover who Dmytro Kovalenko is, watch his highlights, browse his gallery, and contact him via a Telegram-wired form, all in Ukrainian or English.

### Key Accomplishments

1. **Static export + CI/CD** — Next.js static export on GitHub Pages with correct basePath, FOUC-free dark default, Lenis+GSAP scroll proxy
2. **Premium design system** — CSS custom property token system, Oswald+Roboto (Latin+Cyrillic), light/dark themes, fully responsive 375px→1440px+
3. **Cinematic homepage** — GSAP parallax hero, Framer Motion stagger, 8 sections, FIFA-style animated stat bars, trophies grid, club/team sections
4. **Media system** — YouTube lite-embed (iframe on click), masonry photo gallery with yarl lightbox, zero page-load impact
5. **Telegram contact pipeline** — GitHub Actions workflow_dispatch → Telegram Bot, honeypot+timer spam guards, secrets never in client bundle, confirmed live delivery
6. **Full bilingual UA/EN** — `/ua/` and `/en/` pre-rendered static HTML, LanguageSwitcher with localStorage persistence, zero hardcoded strings in components

### Known Gaps

- PLAYER-02: Real player photo (structural slot built; real asset is a content update — deferred post-v1.0)

### Archives

- [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) — Full phase details and decisions
- [v1.0-REQUIREMENTS.md](milestones/v1.0-REQUIREMENTS.md) — Requirements traceability with outcomes

---
