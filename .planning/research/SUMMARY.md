# Project Research Summary

**Project:** Future Legend — Football Player Personal Portfolio Website
**Domain:** Athlete recruitment portfolio / cinematic personal branding site
**Researched:** 2026-05-18
**Confidence:** HIGH

## Executive Summary

Future Legend is a static, cinematic personal portfolio site for a young Ukrainian football player seeking professional recruitment. The site's sole conversion goal is getting scouts and coaches to contact the player within 60 seconds of landing. Research confirms the correct build strategy is a Next.js static export deployed to GitHub Pages, with zero server-side runtime, content managed via local TypeScript files, and animations layered on top of fully-functional static layouts. The stack is pre-decided and well-suited: Next.js 16 + SCSS Modules + Framer Motion (component transitions) + GSAP + ScrollTrigger (cinematic scroll sequences) + Lenis (smooth scroll).

The recommended approach is to build in strict layers: foundation and infrastructure first (static export config, i18n scaffold, theme system, CI/CD pipeline), then static section layouts with real content, then animations on top, then media, then the contact pipeline. This order prevents the most dangerous class of problems — retrofitting basePath, FOUC theme fixes, and SSR/browser-API conflicts — which are all extremely difficult to add after the fact. The i18n (UA/EN) requirement must be baked in from day one since it threads through every content section.

The biggest risks are all infrastructure-level: missing basePath/assetPrefix configuration causes a complete deployment failure (blank page, all assets 404); Next.js built-in i18n config silently does nothing with static export; and GSAP running outside useGSAP breaks the build during prerendering. All three are easy to prevent but very disruptive to fix mid-project. Animation architecture also requires an explicit ownership split between Framer Motion and GSAP before any animation code is written — mixing the two on the same DOM element causes visible jank.

---

## Key Findings

### Recommended Stack

Next.js 16.2.6 with `output: 'export'` is the only correct deployment target for GitHub Pages. The App Router `app/[lang]/` dynamic segment pattern handles bilingual routing with zero additional dependencies — next-i18next (Pages Router only) and next-intl (requires middleware, incompatible with static export) are both ruled out. Styling is SCSS Modules with sass 1.99.0 (explicitly required; Tailwind excluded). Theme switching uses next-themes 0.4.6 backed by CSS custom properties on the `data-theme` attribute.

The animation stack is intentionally dual-library: Framer Motion 12.39.0 handles React lifecycle (mount/unmount, hover, layout shifts); GSAP 3.15.0 + ScrollTrigger handles scroll-sequenced cinematic sequences, parallax, and pinned sections. Lenis 1.3.23 provides inertia smooth scrolling and must proxy through ScrollTrigger. `@gsap/react` 2.1.2 provides `useGSAP` hook for mandatory cleanup in React 18 strict mode. Media is handled by react-youtube 10.1.0 (embed wrapper) and yet-another-react-lightbox 3.32.0 (photo gallery).

**Core technologies:**
- **Next.js 16.2.6**: App framework, `output: 'export'` for GitHub Pages, App Router for `[lang]` i18n
- **React 19.2.6 + TypeScript 6.0.3**: Component model + type safety for content data shapes
- **sass 1.99.0**: SCSS Modules compiler — full CSS control for premium custom design system
- **framer-motion 12.39.0**: Component-level animations (mount/unmount, hover, page transitions)
- **gsap 3.15.0 + @gsap/react 2.1.2**: Scroll-sequenced cinematic timelines, ScrollTrigger parallax
- **lenis 1.3.23**: Inertia smooth scroll, proxied through GSAP ScrollTrigger
- **next-themes 0.4.6**: Light/dark theme provider with FOUC-safe hydration
- **react-youtube 10.1.0**: YouTube IFrame API wrapper
- **yet-another-react-lightbox 3.32.0**: Touch-friendly photo gallery lightbox
- **GitHub Actions + GitHub Pages**: Build, deploy, and contact form to Telegram pipeline

### Expected Features

**Must have (table stakes) — scouts bounce without these:**
- Full name, position (primary + secondary), dominant foot — absolute minimum identification
- Date of birth shown as current age — scouts do not do the math
- Nationality and eligibility — critical for international recruitment quotas
- Physical attributes (height, weight) — positional fit assessment; must stay updated
- Current club name and league/division — establishes competitive level
- Profile photograph (action shot preferred)
- Video highlights — the single most important feature; must load fast
- Contact method (email or form) — without this the whole site fails its purpose
- Mobile-responsive layout — scouts browse on phones at matches
- Fast load time (Core Web Vitals) — static export is the solution

**Should have (differentiators) — what makes this site stand out:**
- Cinematic animated hero — creates immediate wow impression
- Separated training vs. match highlights — lets scouts see technical ability vs. competitive performance
- Photo gallery (training + match) — visual storytelling depth; scouts share images internally
- Achievements/trophies section — validates competitive level and winning mentality
- Bilingual UA/EN — extends reach to English-speaking clubs and scouts internationally
- Light/dark theme toggle — signals technical polish; dark suits cinematic sports aesthetic
- Player story/bio section — scouts remember narratives, not stat sheets
- AI-generated personal logo — unique brand identity, rare among youth player sites
- Scroll-triggered animations — modern standard for premium sites
- Telegram contact integration — fast response time matters for scout follow-up

**Defer to v2+:**
- Social media feed embeds (link to profiles instead; live feeds add load weight)
- Match statistics dashboard (not credible for youth without a verified data source)
- Blog/news section (maintenance burden without recruiting value)

### Architecture Approach

The architecture is a single-route static Next.js app with all sections on one scrolling page, organized as `app/[lang]/page.tsx` assembling all section components. Content flows strictly top-down: `content/*.ts` typed data to `page.tsx` (imports content + dictionary) to section components (receive data + dict as props) to UI primitives. Section components never import content files directly. All animations are client-only (`'use client'` directive), all GSAP runs inside `useGSAP`, and Lenis is initialized at root layout level via a `SmoothScrollProvider` wrapper.

**Major components:**
1. **`app/[lang]/layout.tsx`** — Root layout: ThemeProvider, SmoothScrollProvider, fonts, i18n scaffold, FOUC-prevention inline script
2. **`components/sections/`** — One folder per page section (Hero, About, BestMoments, Gallery, Trophies, Club, Team, Contact)
3. **`content/*.ts`** — Typed data files (player.ts, videos.ts, gallery.ts, trophies.ts, team.ts, club.ts)
4. **`dictionaries/en.json` + `ua.json`** — All UI strings; loaded per-locale at build time via getDictionary.ts
5. **`styles/_tokens.scss`** — CSS custom property definitions for light/dark theme tokens
6. **`lib/animations/`** — Framer Motion variants and GSAP timeline factory functions
7. **`.github/workflows/`** — deploy.yml (build to gh-pages) and contact.yml (form to Telegram)

### Critical Pitfalls

1. **Next.js built-in i18n config is silently incompatible with static export** — Use `app/[lang]/` + `generateStaticParams` instead. If missed, `/ua/` routes return 404 after deploy with no build-time error.
2. **Missing basePath/assetPrefix causes a blank page on first GitHub Pages deploy** — Set `basePath: '/repo-name'`, `assetPrefix: '/repo-name/'`, `trailingSlash: true` in `next.config.ts` before any CI runs. Every asset 404s without this.
3. **GSAP outside useGSAP breaks the static export build** — "window is not defined" during prerendering. All GSAP code must be inside `useGSAP()` in `'use client'` components.
4. **next/image default loader fails at build with static export** — Set `images: { unoptimized: true }`. Pre-process images to WebP manually with explicit width/height on every Image component.
5. **Framer Motion + GSAP fighting over the same DOM element** — Define ownership split before writing any animation: Framer Motion owns mount/unmount + hover; GSAP owns scroll-triggered sequences. Never apply both to the same element.

---

## Implications for Roadmap

### Phase 1: Foundation and Infrastructure
**Rationale:** All subsequent work depends on the static export config being correct. basePath, i18n scaffold, theme FOUC fix, CI/CD pipeline, and .nojekyll are extremely difficult to retrofit. Must be solved before any content or animation work begins.
**Delivers:** Deployable (empty) site on GitHub Pages at the correct URL, working UA/EN routes, working light/dark theme, CI/CD pipeline running.
**Addresses:** Static export baseline, mobile-responsive scaffold, fast loading confirmed
**Avoids:** i18n config pitfall, basePath blank page, next/image failure, trailingSlash, .nojekyll

### Phase 2: Design System and Content Architecture
**Rationale:** Section components need the SCSS token system and typed content schemas before they can be built. Establishing _tokens.scss, typography scale, SCSS mixins, and content/*.ts data structures now prevents visual inconsistency and content shape mismatches throughout the project.
**Delivers:** SCSS design system (light/dark tokens, typography, mixins), TypeScript content schemas, stub data for all sections, reusable UI primitives (Button, Badge, SectionWrapper)
**Uses:** sass, CSS custom properties, TypeScript interfaces
**Avoids:** FOUC — blocking inline script established in Phase 1 layout

### Phase 3: Static Section Layouts
**Rationale:** Build all sections as static, unanimated components first. Get visual language, content, and layout correct before adding animation complexity. Animated-on-working is dramatically easier than debugging animation and layout simultaneously.
**Delivers:** All sections visible and correct on both UA and EN: Hero (static), About/Player Profile, Trophies, Club, Team, Contact form UI, footer/nav
**Addresses:** All table-stakes features (player identity, physical attributes, current club, contact), bilingual content
**Uses:** SCSS Modules, content/*.ts data, getDictionary.ts

### Phase 4: Animation Layer
**Rationale:** Animate on top of fully working static layouts. Establish Framer Motion / GSAP ownership split as the first act of this phase to prevent cross-library conflicts. Lenis must be initialized first as it affects all scroll position measurements.
**Delivers:** Lenis smooth scroll, Hero cinematic animation, scroll-triggered section reveals, page transition animations, hover micro-interactions
**Uses:** framer-motion, gsap + ScrollTrigger, @gsap/react (useGSAP), lenis, SmoothScrollProvider
**Avoids:** GSAP + useGSAP pattern, FM + GSAP ownership split, ScrollTrigger.refresh after fonts, ScrollTrigger leak, animate only transform/opacity

### Phase 5: Media System
**Rationale:** Media depends on sections being laid out correctly. YouTube lite-embed pattern and photo gallery lightbox are isolated features with no upstream dependencies at this point.
**Delivers:** Video highlights section (training + match tabs, lite-embed pattern), photo gallery with lightbox, lazy loading
**Uses:** react-youtube, yet-another-react-lightbox
**Avoids:** YouTube iframes destroying mobile LCP — use lite-embed thumbnail-first pattern

### Phase 6: Contact Form and Telegram Pipeline
**Rationale:** Fully isolated feature. GitHub Actions workflow and bot token secret configuration are independent of all other phases. Best done late when the site is otherwise complete and the form can be fully tested end-to-end.
**Delivers:** Contact form (name + email + message, honeypot field), GitHub Actions contact.yml workflow, Telegram Bot notification, spam protection
**Uses:** GitHub Actions, GitHub Secrets (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
**Avoids:** Bot token exposure — token in GitHub Secrets only; honeypot + time check for spam

### Phase 7: Polish, SEO, and Mobile QA
**Rationale:** Final pass after all features are complete. Performance audit, Open Graph meta, prefers-reduced-motion support, mobile QA with CPU throttling, and content review for stale data.
**Delivers:** Lighthouse score targets met, Open Graph sharing cards, reduced-motion variants, verified content accuracy, optional custom domain
**Avoids:** Animation jank on mobile — 4x CPU throttle test required

### Phase Ordering Rationale

- Foundation before everything — static export config, basePath, i18n scaffold, and FOUC fix are architectural; changing them mid-project breaks deployed URLs and requires touching every component
- Design system before sections — SCSS tokens and TypeScript content interfaces are used by every subsequent section; retrofitting them causes cascading rework
- Static layouts before animation — debugging animation on broken layout is exponentially harder; the single most important sequencing decision in the project
- Animation before media — the Lenis + ScrollTrigger layer affects scroll measurements that the media section lazy-loading depends on
- Contact last — fully isolated; requires external Telegram bot setup (GitHub Secrets) that can be done in parallel with any other phase

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 6 (Contact to Telegram):** The workflow_dispatch PAT token approach has a security tradeoff — the scoped PAT is readable in client JS. A Cloudflare Workers intermediary is the more secure alternative but adds scope. Research the tradeoff during Phase 6 planning.
- **Phase 5 (Media):** YouTube lite-embed pattern with React dynamic import (ssr: false) has implementation edge cases; verify the exact pattern before building.

Phases with standard/well-documented patterns (skip extra research):
- **Phase 1 (Foundation):** next.config.ts settings are fully documented and verified in STACK.md and PITFALLS.md. Follow the exact config specified there.
- **Phase 2 (Design System):** CSS custom properties + SCSS Modules is a well-established pattern beyond the FOUC fix already documented.
- **Phase 3 (Static Sections):** Standard Next.js App Router Server Component patterns. Well documented.
- **Phase 4 (Animation):** GSAP + Framer Motion ownership split and useGSAP pattern are fully documented in ARCHITECTURE.md. Follow exactly.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry; static export config verified against official Next.js docs v16.2.6 |
| Features (table stakes) | HIGH | Confirmed against multiple recruitment platforms; matches PROJECT.md requirements |
| Features (differentiators) | MEDIUM | Based on training knowledge of sports personal branding; no live research available |
| Architecture | HIGH (i18n, GSAP) / MEDIUM (component structure) | i18n and GSAP patterns verified via official docs; component structure is standard App Router convention |
| Pitfalls | HIGH | Critical pitfalls verified against official Next.js and GSAP documentation |

**Overall confidence:** HIGH for build approach and technical decisions; MEDIUM for exact differentiator feature priority ordering.

### Gaps to Address

- Telegram contact security model: The workflow_dispatch PAT token leaves a readable token in client JS. Decide during Phase 6 planning: accept the risk (PAT scoped to workflow only, minimal blast radius) or add Cloudflare Workers intermediary.
- Live athlete portfolio benchmarking: Differentiator features were assessed from training knowledge. During Phase 3, review 3-5 live professional youth player portfolio sites to confirm visual and content choices are competitive.
- Image pre-processing pipeline: `images: { unoptimized: true }` requires a manual WebP conversion workflow. Decide during Phase 1/2 planning: sharp-based npm script or Cloudinary free tier.
- Telegram bot setup: Bot token and chat ID require a real Telegram bot to be created before Phase 6. This is an external dependency — resolve early (can run in parallel with any phase) to avoid blocking Phase 6.

---

## Sources

### Primary (HIGH confidence)
- Official Next.js docs v16.2.6 — static export config, app/[lang]/ i18n pattern, generateStaticParams, images.unoptimized, basePath, trailingSlash
- Official GSAP React docs — useGSAP hook, scope option, ScrollTrigger.refresh(), plugin registration
- npm registry — all package versions verified: next@16.2.6, react@19.2.6, framer-motion@12.39.0, gsap@3.15.0, lenis@1.3.23, next-themes@0.4.6

### Secondary (MEDIUM confidence)
- Athlete recruitment platform analysis (NCSA, SportsRecruits, BeRecruited, Transfermarkt) — scout/recruiter mental model and table stakes features
- Next.js community patterns — FOUC prevention via blocking inline script, next-themes + CSS custom properties
- Sports personal branding literature — differentiator features, anti-features

### Tertiary (LOW confidence)
- Telegram Bot API + GitHub Actions contact pipeline — functional pattern documented, but PAT security model needs validation against current GitHub Actions permissions model during Phase 6 planning

---

*Research completed: 2026-05-18*
*Ready for roadmap: yes*