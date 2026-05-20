# Future Legend — Football Player Personal Website

## What This Is

A cinematic personal portfolio website for a young football player, deployed live on GitHub Pages with full UA/EN bilingual support. The site tells Dmytro Kovalenko's story through immersive GSAP/Framer Motion animations, a Telegram-wired contact pipeline, YouTube highlight embeds, and a masonry photo gallery — built to maximize visibility and drive recruitment opportunities with scouts, coaches, and clubs.

## Core Value

A scout or coach visiting the site immediately understands who this player is, what they can do, and how to contact them — within seconds of landing on the page.

## Current Milestone: v1.1 Real Content

**Goal:** Replace all placeholder content with Artem Kukharuk's real identity so the site looks scout-ready with no obvious placeholders.

**Target features:**
- Player identity swap (name, position, club, age) across all content files and both locale dictionaries
- Player bio rewrite in Ukrainian and English
- Midjourney prompt deliverables for hero photo, gallery, and club crest
- Asset integration guide (file naming, dimensions, slot locations)
- YouTube video slot update or clear documentation of placeholder status

## Requirements

### Validated

- ✓ Static export to GitHub Pages with correct basePath/assetPrefix + CI/CD on push to main — v1.0
- ✓ FOUC-free light/dark theme toggle with localStorage persistence — v1.0
- ✓ Premium CSS design token system (CSS custom properties, light + dark themes) — v1.0
- ✓ Responsive layout from 375px to 1440px+; Oswald+Roboto (Latin+Cyrillic) — v1.0
- ✓ Lenis smooth scroll + GSAP ScrollTrigger scroll proxy — v1.0
- ✓ Cinematic hero section (GSAP parallax + Framer Motion stagger + CTA) — v1.0
- ✓ Scroll-triggered animations across all sections (entrance reveals, stat bars) — v1.0
- ✓ Player profile: name, position, working foot, nationality, DOB, club, stats, bio — v1.0
- ✓ Trophies, club, and team sections with scroll reveal — v1.0
- ✓ YouTube highlight videos — lite-embed (thumbnail → iframe on click) — v1.0
- ✓ Photo gallery with masonry layout + yarl lightbox (Fullscreen+Zoom) — v1.0
- ✓ Contact form with Telegram notification via GitHub Actions (confirmed live) — v1.0
- ✓ Spam protection: honeypot + submission time check — v1.0
- ✓ Telegram secrets in GitHub Secrets only, never in client bundle — v1.0
- ✓ UA/EN bilingual locale routes (/ua/ and /en/ pre-rendered as static HTML) — v1.0
- ✓ LanguageSwitcher with localStorage persistence in Nav (desktop + mobile) — v1.0
- ✓ Zero hardcoded strings in component files (all text from locale dictionaries) — v1.0

### Active

- [ ] **IDENT-01**: Player identity updated to Artem Kukharuk (name, position: Defender, club: Viva Cup, age: 9) across all content files
- [ ] **IDENT-02**: Player bio rewritten in Ukrainian and English to reflect real player
- [ ] **ASSET-01**: Midjourney prompts delivered for hero background, gallery photos, and club crest
- [ ] **ASSET-02**: Asset integration guide created (file naming, dimensions, drop-in instructions)
- [ ] **ASSET-03**: Hero photo slot wired with real or AI-generated image
- [ ] **ASSET-04**: Gallery photos replaced (real or AI-generated via Midjourney prompts)
- [ ] **ASSET-05**: Club crest replaced (real or AI-generated via Midjourney prompts)
- [ ] **VIDEO-01**: YouTube video slot updated with real highlight video IDs or clearly documented placeholder

### Out of Scope

- User registration / authentication — purely informational site, no accounts needed
- Admin panel / CMS — content managed via code/JSON files
- Comments or social interaction — not a social platform
- Payments / monetization — no commercial transactions
- Real-time features — static site, no WebSockets
- Mobile app — web-first; GitHub Pages PWA works well
- Multi-player support / multiple player profiles — dedicated single-player site

## Context

**Shipped v1.0 on 2026-05-20.** 4 phases, 14 plans, 2 days, ~2,100 LOC TypeScript/TSX/SCSS.

Stack: Next.js 16.x static export, TypeScript, SCSS Modules, Framer Motion + GSAP + @gsap/react, Lenis, react-youtube, react-masonry-css, yarl, next-themes.

Deployment: GitHub Pages via GitHub Actions (push to `main` → deploy). Live at `https://dkukharuk.github.io/future-legend-dev/`.

Contact: GitHub Actions workflow_dispatch → Telegram Bot API. Token/chat ID in GitHub Secrets only.

i18n: Built-in `app/[lang]/` pattern + `generateStaticParams`. Dictionaries in `dictionaries/en.json` and `dictionaries/ua.json`. Zero runtime overhead — both locales pre-rendered.

Content: TypeScript/JSON files in `/content/` — no external CMS. All translatable strings in `dictionaries/`.

## Constraints

- **Tech Stack**: Next.js static export + SCSS Modules only — Tailwind CSS explicitly excluded
- **Animations**: Framer Motion for UI animations (mount/unmount/hover), GSAP for cinematic scroll sequences — never animate the same element with both
- **Hosting**: GitHub Pages — no SSR, no API routes at runtime
- **Contact**: Telegram integration via GitHub Actions — no backend server
- **i18n**: `app/[lang]/` locale routing only — no next-i18next, no next-intl middleware
- **Content**: All content in local files — no CMS dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js static export over SSR | GitHub Pages deployment requires static files | ✓ Good — CI/CD working, all assets at basePath |
| SCSS Modules over Tailwind | Custom premium design requires full CSS control | ✓ Good — design system clean, no utility class pollution |
| Framer Motion + GSAP dual animation | Framer Motion for React component transitions, GSAP for scroll sequences | ✓ Good — ownership rule maintained throughout, no conflicts |
| GitHub Actions for contact form | No server needed; Telegram bot handles notifications | ✓ Good — confirmed live delivery, token never in client bundle |
| Local JSON/TS content files | No CMS cost/complexity; content updated via code | ✓ Good — simple, type-safe, works at build time |
| `useGSAP()` for all GSAP code | Prevents "window is not defined" during static prerendering | ✓ Good — build always exits 0 |
| `autoRaf: false` on ReactLenis + GSAP ticker | Prevents Lenis/ScrollTrigger drift when GSAP drives the RAF | ✓ Good — scroll behavior stable |
| Dynamic import() in getDictionary | fs.readFile incompatible with static export; dynamic import() works at build time | ✓ Good — both locales pre-rendered correctly |
| D-12 Option A — remove translatable fields from player.ts | Keeps TypeScript honest; compiler enforces migration | ✓ Good — zero hardcoded strings after migration |
| localStorage whitelist in root redirect | Security: `stored === 'en' ? 'en' : 'ua'` — raw stored value never used in navigation | ✓ Good — tampering mitigation T-04-01 satisfied |
| Contact form email field removed | User request; name + phone (optional) + message is sufficient for scout inquiry | ✓ Good — simpler form, phone mask added |
| GitHub workflow_dispatch returns 204 | success check must use `response.ok`, NOT `=== 202` | ✓ Good — contact form works correctly |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-20 after v1.1 milestone start*
