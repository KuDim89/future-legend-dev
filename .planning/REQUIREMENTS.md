# Requirements: Future Legend — Football Player Personal Website

**Defined:** 2026-05-18
**Core Value:** A scout or coach visiting the site immediately understands who this player is, what they can do, and how to contact them — within seconds of landing on the page.

---

## v1 Requirements

### Foundation & Infrastructure

- [ ] **FOUND-01**: Site builds as a fully static export (`output: 'export'`) and deploys to GitHub Pages via GitHub Actions on every push to `main`
- [ ] **FOUND-02**: All assets load correctly on GitHub Pages (basePath, assetPrefix, trailingSlash, and .nojekyll configured correctly)
- [ ] **FOUND-03**: Next.js App Router project scaffolded with TypeScript, SCSS Modules, and `app/[lang]/` locale routing structure
- [ ] **FOUND-04**: All images pre-optimized as WebP with correct dimensions; `next/image` configured with `unoptimized: true`

### Visual Design System

- [ ] **VIS-01**: CSS custom property token system defined for colors, spacing, and typography — supports light and dark themes via `data-theme` attribute
- [ ] **VIS-02**: User can toggle between light and dark themes; preference persists across sessions with no flash on page load (FOUC prevented)
- [ ] **VIS-03**: Premium typography scale implemented using Next.js font optimization (self-hosted Google Fonts) with both Latin and Cyrillic subsets
- [ ] **VIS-04**: Site is fully mobile-responsive across all sections (375px to 1440px+)
- [ ] **VIS-05**: Smooth inertia-based scrolling via Lenis; GSAP ScrollTrigger integrated with Lenis scroll proxy

### Homepage & Hero

- [x] **HOME-01**: Visitor lands on a cinematic hero section with the player's name, position, and a high-impact full-screen visual (photo or video background)
- [x] **HOME-02**: Hero section includes scroll-triggered entrance animations (text reveal, image parallax) using GSAP ScrollTrigger
- [x] **HOME-03**: Hero section includes a clear Call-to-Action button directing scouts to the contact section
- [x] **HOME-04**: Page sections transition smoothly as user scrolls using Framer Motion and GSAP animations; page feels cinematic not static

### Player Profile

- [x] **PLAYER-01**: Visitor can view the player's full profile: full name, position, working foot, nationality, date of birth, and current club
- [ ] **PLAYER-02**: Visitor can view a high-quality real photo of the player
- [x] **PLAYER-03**: Visitor can view key player statistics or attributes (configurable from `content/player.ts`)
- [x] **PLAYER-04**: Player information section tells the player's story through imagery and short narrative text

### Media System

- [ ] **MEDIA-01**: Visitor can watch embedded YouTube highlight videos (training and match clips) using a lite-embed pattern (thumbnail shown first, iframe loads on click)
- [ ] **MEDIA-02**: Visitor can browse a photo gallery of training and match images with a lightbox viewer (zoom, navigation, fullscreen)
- [ ] **MEDIA-03**: Video and gallery sections do not block page load or hurt Lighthouse performance score (lazy loading enforced)

### Supporting Content Sections

- [ ] **SECT-01**: Visitor can view a trophies / achievements section displaying the player's career honors
- [ ] **SECT-02**: Visitor can view information about the player's current club
- [ ] **SECT-03**: Visitor can view a team section (player's current teammates or squad context)

### Contact System

- [ ] **CONTACT-01**: Visitor can submit a contact form with their name, email, and message
- [ ] **CONTACT-02**: Successful form submission triggers a Telegram notification to the player/agent via GitHub Actions + Telegram Bot API
- [ ] **CONTACT-03**: Contact form includes spam protection: honeypot hidden field and submission time check
- [ ] **CONTACT-04**: Bot token and chat ID are stored in GitHub Secrets only — never exposed in client-side code

### Bilingual Support (UA / EN)

- [ ] **I18N-01**: Site is available in both Ukrainian (UA) and English (EN) at separate URL paths (`/ua/` and `/en/`)
- [ ] **I18N-02**: Visitor can switch between UA and EN languages via a language toggle; preference persists across sessions
- [ ] **I18N-03**: All UI strings, section titles, CTA copy, and player bio text are defined in locale dictionary files (`dictionaries/en.json`, `dictionaries/ua.json`)
- [ ] **I18N-04**: Both locale versions are pre-rendered as static HTML at build time (zero runtime i18n overhead)

---

## v2 Requirements

### Enhanced Player Profile

- **PLAYER-V2-01**: Player can update their own profile data via a simple YAML/JSON edit workflow (no CMS, but documented update process)
- **PLAYER-V2-02**: Profile includes a career timeline section showing clubs and seasons
- **PLAYER-V2-03**: Performance stats section with visual charts or progress bars

### SEO & Discoverability

- **SEO-V2-01**: Structured data (JSON-LD) for person/athlete schema to improve search engine visibility
- **SEO-V2-02**: Open Graph and Twitter card meta tags for all pages (for social sharing by scouts/fans)
- **SEO-V2-03**: Sitemap.xml and robots.txt generated at build time

### Advanced Media

- **MEDIA-V2-01**: Video playlist / highlight reel with chapter markers or categorized tabs (full matches vs. skills vs. training)
- **MEDIA-V2-02**: Photo gallery supports multiple categories (match day, training, official photos)

### Analytics

- **ANALYTICS-V2-01**: Privacy-friendly analytics (Plausible or Fathom) to track which sections scouts visit most

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| User registration / authentication | Purely informational and promotional site — no accounts |
| Admin panel / CMS | Content managed via code and TypeScript files; complexity not justified for a personal site |
| Comments or social interaction | Not a social platform; would dilute the professional focus |
| Payments / monetization | No commercial transactions on this site |
| Server-side rendering at runtime | GitHub Pages is static hosting only; no Node.js server |
| Real-time features (WebSockets, live chat) | Static site architecture; Telegram handles async contact |
| Mobile app | Web-first; no native app |
| Multi-player support / player profiles | This site is dedicated to a single player |
| React Native / Expo | Web only |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| VIS-01 | Phase 1 | Pending |
| VIS-02 | Phase 1 | Pending |
| VIS-03 | Phase 1 | Pending |
| VIS-04 | Phase 1 | Pending |
| VIS-05 | Phase 1 | Pending |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Complete |
| HOME-04 | Phase 2 | Complete |
| PLAYER-01 | Phase 2 | Complete |
| PLAYER-02 | Phase 2 | Pending |
| PLAYER-03 | Phase 2 | Complete |
| PLAYER-04 | Phase 2 | Complete |
| SECT-01 | Phase 2 | Pending |
| SECT-02 | Phase 2 | Pending |
| SECT-03 | Phase 2 | Pending |
| MEDIA-01 | Phase 3 | Pending |
| MEDIA-02 | Phase 3 | Pending |
| MEDIA-03 | Phase 3 | Pending |
| CONTACT-01 | Phase 3 | Pending |
| CONTACT-02 | Phase 3 | Pending |
| CONTACT-03 | Phase 3 | Pending |
| CONTACT-04 | Phase 3 | Pending |
| I18N-01 | Phase 4 | Pending |
| I18N-02 | Phase 4 | Pending |
| I18N-03 | Phase 4 | Pending |
| I18N-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped (TBD): 0

---
*Requirements defined: 2026-05-18*
*Last updated: 2026-05-18 after roadmap creation — traceability complete*
