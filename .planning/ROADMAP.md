# Roadmap: Future Legend — Football Player Personal Website

## Overview

Four phases take this site from a blank repo to a fully bilingual, cinematic football player portfolio deployed on GitHub Pages. Phase 1 locks in the static export config, CI/CD pipeline, and design system — the infrastructure that everything else depends on and that is catastrophic to retrofit. Phase 2 builds every content section with its animations, delivering the complete scout-facing experience. Phase 3 adds the media system and wires up the Telegram contact pipeline. Phase 4 completes the UA/EN bilingual experience with pre-rendered locale routes and a persistent language switcher.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Design System** - Static export + GitHub Pages CI/CD + SCSS design tokens + light/dark theme + smooth scroll scaffold
- [x] **Phase 2: Core Sections & Animations** - Hero, player profile, about, trophies, club, team — all sections built and animated
- [ ] **Phase 3: Media & Contact** - YouTube lite-embed highlights, photo gallery lightbox, contact form + Telegram pipeline
- [ ] **Phase 4: Bilingual Support & Polish** - UA/EN language system, locale switcher, dictionary files, build-time locale pre-rendering

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: A deployable site scaffold exists on GitHub Pages with the correct static export config, working CI/CD, and a complete design system ready for content
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, VIS-01, VIS-02, VIS-03, VIS-04, VIS-05
**Success Criteria** (what must be TRUE):
  1. Pushing to `main` triggers GitHub Actions and the site deploys to GitHub Pages with all assets loading at the correct basePath URL (no 404s, no blank page)
  2. Visiting the deployed site shows a working light/dark theme toggle with no flash of unstyled content (FOUC) on load, and the preference persists after page refresh
  3. The design token system (`_tokens.scss`) is defined with CSS custom properties for colors, spacing, and typography covering both light and dark themes
  4. The site renders correctly on mobile (375px) through desktop (1440px+) — layout does not break at any viewport
  5. Lenis smooth scroll and GSAP ScrollTrigger are initialized and the scroll proxy is wired — scroll events fire correctly
**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**
- [x] 01-01-PLAN.md — Project bootstrap: Next.js static export config, app/[lang]/ locale routing, GitHub Actions CI/CD pipeline

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-02-PLAN.md — Design token system: SCSS tokens, typography scale, breakpoint mixins, Oswald + Roboto font wiring

**Wave 3** *(blocked on Wave 1 + 2 completion)*
- [x] 01-03-PLAN.md — Demo page: Lenis + GSAP ScrollTrigger, stub Nav (8 anchors), ThemeToggle, full design system demo page

Cross-cutting constraints:
- `npx next build` must exit 0 before any plan is marked done
- All GSAP code must be inside `'use client'` files only (CLAUDE.md rule)
- `basePath: '/future-legend-dev'` must be consistent across all file references

### Phase 2: Core Sections & Animations
**Goal**: A scout visiting the site can immediately identify who the player is, view their profile and career achievements, and experience the full cinematic scroll journey
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, PLAYER-01, PLAYER-02, PLAYER-03, PLAYER-04, SECT-01, SECT-02, SECT-03
**Success Criteria** (what must be TRUE):
  1. Visitor lands on a full-screen cinematic hero section showing the player's name, position, and a high-impact visual — with a visible CTA button that scrolls to the contact section
  2. Scrolling through the page triggers entrance animations (text reveal, parallax, section transitions) that make the experience feel cinematic rather than static
  3. Visitor can read the player's complete profile: full name, position, working foot, nationality, date of birth, current club, and key attributes — all sourced from `content/player.ts`
  4. Visitor can view the player's trophies/achievements section, current club information, and team section — all sections display real content
**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**
- [x] 02-01-PLAN.md — Foundation data layer: content/player.ts full rewrite (Player interfaces + Dmytro Kovalenko data), lib/animations/useScrollReveal.ts hook extraction, lucide-react install

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 02-02-PLAN.md — Hero section + page scaffold: HeroSection (GSAP parallax bg + Framer Motion text stagger), SectionStub component, page.tsx initial assembly (Hero + 3 stubs), layout.tsx metadata update

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 02-03-PLAN.md — Profile + supporting sections + full assembly: AboutSection (bio grid + stat bars), TrophiesSection, ClubSection, TeamSection, page.tsx complete 8-section wiring, final build verification

Cross-cutting constraints:
- `npx next build` must exit 0 before any plan is marked done
- GSAP animation ownership rule: GSAP owns scroll sequences; Framer Motion owns mount/unmount — never animate the same element with both (CLAUDE.md)
- All animated section components must be 'use client'; SectionStub and page.tsx are Server Components
- content/player.ts is the sole data source; sections never import it directly — data flows through page.tsx props
- PLAYER-02 note: photo slot built in HeroSection .heroBg; real photo deferred as content update per D-01

### Phase 3: Media & Contact
**Goal**: Visitors can watch player highlight videos and browse photos without page load penalty, and scouts can submit a contact inquiry that reaches the player via Telegram
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: MEDIA-01, MEDIA-02, MEDIA-03, CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04
**Success Criteria** (what must be TRUE):
  1. Visitor can click a YouTube video thumbnail to load and play the highlight clip — the iframe does not load until the thumbnail is clicked (lite-embed pattern)
  2. Visitor can open a photo in fullscreen lightbox view, navigate between photos, and close the lightbox — without degrading page load performance
  3. Visitor can submit the contact form with name, email, and message — and a Telegram notification arrives in the player's Telegram account within seconds
  4. The bot token and chat ID are not visible in any client-side code, network request, or browser DevTools — they exist only in GitHub Secrets
**Plans**: 4 plans
**UI hint**: yes

Plans:
**Wave 1**
- [x] 03-01-PLAN.md — Foundation: install react-youtube/react-masonry-css/yarl, create content/videos.ts (3 entries), content/gallery.ts (6 entries), 6 placeholder WebP images

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 03-02-PLAN.md — HighlightsSection + VideoCard: lite-embed video grid (thumbnail → YouTube on click, MEDIA-01 + MEDIA-03)
- [x] 03-03-PLAN.md — GallerySection: masonry photo grid + yarl Fullscreen+Zoom lightbox (MEDIA-02 + MEDIA-03)

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 03-04-PLAN.md — ContactSection + contact.yml + page assembly: form state machine, GitHub workflow_dispatch → Telegram, spam guards, replace 3 SectionStubs, final build verification

Cross-cutting constraints:
- `npx next build` must exit 0 before any plan is marked done
- Lite-embed: `<YouTube>` renders ONLY when `isPlaying === true` — never unconditionally (react-youtube renders a full iframe on mount)
- GitHub workflow_dispatch returns 204 No Content — success check must use `response.ok`, NOT `response.status === 202`
- GSAP animation ownership: useScrollReveal hook for scroll entrance; Framer Motion for hover/click/form-state transitions — no element animated by both
- Telegram secrets (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) exist only as `${{ secrets.* }}` in contact.yml — never in any client file

### Phase 4: Bilingual Support & Polish
**Goal**: The site is fully available in both Ukrainian and English at separate pre-rendered URL paths, with a persistent language switcher accessible on every section
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04
**Success Criteria** (what must be TRUE):
  1. Visiting `/ua/` displays the full site in Ukrainian and visiting `/en/` displays it in English — both routes exist as static HTML files in the build output
  2. Visitor can switch between UA and EN via a visible language toggle — the language preference persists across browser sessions (reload keeps the selected language)
  3. Every visible UI string, section title, CTA, and player bio text is sourced from `dictionaries/en.json` or `dictionaries/ua.json` — no hardcoded strings exist in component files
  4. Running `next build` produces both `/ua/` and `/en/` as pre-rendered static HTML with no runtime i18n overhead
**Plans**: 4 plans

Plans:
**Wave 1**
- [ ] 04-01-PLAN.md — Dictionary foundation: fill en.json + ua.json (all ~60 keys), create lib/getDictionary.ts loader, rewrite app/page.tsx client redirect, migrate content/player.ts interfaces (D-12 Option A)

**Wave 2** *(blocked on Wave 1 completion — 04-02 and 04-03 run in parallel)*
- [ ] 04-02-PLAN.md — LanguageSwitcher + Nav integration: create LanguageSwitcher.tsx + SCSS, update Nav with dict prop and LanguageSwitcher in desktop controls and mobile menu
- [ ] 04-03-PLAN.md — Section migration: add dict prop to all 8 section components, replace every hardcoded string with dict key lookups, resolve all TypeScript errors from player.ts migration

**Wave 3** *(blocked on Wave 2 completion)*
- [ ] 04-04-PLAN.md — Final wiring + build verification: thread getDictionary into app/[lang]/page.tsx, pass dict slices to all components, run npx next build confirming out/ua/ and out/en/ pre-render

Cross-cutting constraints:
- `npx next build` must exit 0 before any plan is marked done
- getDictionary uses dynamic import() only — no fs.readFile — compatible with output: 'export'
- Only app/[lang]/page.tsx calls getDictionary — sections never import dictionaries directly (CLAUDE.md content data flow rule)
- BASE_PATH = '/future-legend-dev' hardcoded in both app/page.tsx and LanguageSwitcher.tsx (live bug fix)
- localStorage locale key whitelisted in app/page.tsx: `stored === 'en' ? 'en' : 'ua'` — never raw value
- LanguageSwitcher animations: Framer Motion / CSS hover only — no GSAP (CLAUDE.md animation rule)
- D-14: dict.trophies.items must have exactly 3 entries matching player.ts trophies array length

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 3/3 | Complete | 2026-05-19 |
| 2. Core Sections & Animations | 3/3 | Complete | 2026-05-20 |
| 3. Media & Contact | 4/4 | Complete | 2026-05-20 |
| 4. Bilingual Support & Polish | 0/4 | Not started | - |
