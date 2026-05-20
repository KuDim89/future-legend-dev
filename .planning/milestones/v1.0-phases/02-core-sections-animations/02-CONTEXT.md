# Phase 2: Core Sections & Animations - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the Phase 1 design system demo page with a fully scout-facing cinematic homepage. Build and animate five content sections (Hero, About/Profile, Trophies, Club, Team) plus three stub sections for Phase 3 content (Highlights, Gallery, Contact). The result: a scout can scroll the full page, read the player's complete profile, and experience the cinematic scroll journey — with no broken nav links.

Phase 2 does NOT build: YouTube embeds, photo gallery lightbox, contact form submission, or i18n string files. Those are Phases 3–4.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **D-01:** Hero background is a dark navy + crimson gradient placeholder (`--color-bg` → `--color-accent` glow/gradient). The image slot is intentionally left for later when real player photo is available — structure must support a `background-image` swap.
- **D-02:** Hero text content: player name (large Oswald, uses `--text-hero: 5rem`), position label beneath, and a single CTA button that scrolls to the `#contact` anchor.
- **D-03:** Hero has a complex GSAP parallax — the gradient background moves at a slower speed than the text content as the user scrolls down. Implemented with GSAP ScrollTrigger inside `useGSAP()`.
- **D-04:** Hero text entrance on page load: staggered Framer Motion reveal — player name → position → CTA button each animate in sequentially (opacity 0→1, y +20→0). Framer Motion owns mount animations (CLAUDE.md rule).
- **D-05:** Player data in `content/player.ts` uses realistic placeholder data (not lorem ipsum) — a believable Ukrainian football player profile. All required fields present with correct TypeScript types.

### Scroll Animation System
- **D-06:** All non-hero sections use a consistent fade+slide entrance: elements fade in and translate up (opacity 0→1, y +40→0) as they enter the viewport. The hero has its own separate complex GSAP treatment.
- **D-07:** ScrollTrigger trigger point: `start: 'top 80%'` — matches Phase 1 ScrollFadeSection prototype. Consistent across all sections.
- **D-08:** Staggered within sections: section title animates first, then content items follow with a stagger delay (same pattern as Phase 1 `stagger: 0.1`).
- **D-09:** Animations run once — play on section entry, stay visible. `scrub: false`, no `toggleActions` override. Elements never animate out.
- **D-10:** Shared reusable hook `useScrollReveal()` lives in `lib/animations/useScrollReveal.ts`. All sections call this hook instead of duplicating the `useGSAP` block. Keeps section components clean.

### Player Profile / About Section
- **D-11:** Profile bio grid: Name, Position, Working foot (with a foot icon), Date of birth — structured info grid for scout quick-scan.
- **D-12:** Below the grid: a 2–3 sentence unique creative characteristic bio sourced from `content/player.ts` (a `bio` string field). Not generic — must feel authored and specific to this player.
- **D-13:** Key attributes displayed as FIFA-style stat bars: each attribute has a label, a numeric value (1–100), and a filled bar. 6 core attributes: Pace, Dribbling, Shooting, Passing, Physical, Defending.
- **D-14:** Stat bars animate in with GSAP when the profile section enters the viewport — bars fill from 0% to their value. This is a scroll-triggered GSAP animation (not Framer Motion — scroll rule applies).

### Supporting Sections
- **D-15:** Trophies section: trophy cards in a grid. Each card: trophy name, year won, competition/tournament name. Sourced from `content/player.ts` as a `trophies[]` array.
- **D-16:** Club section: current club with name, logo placeholder (image slot for Phase 3+), and a short description. Sourced from `content/player.ts` as a `club` object.
- **D-17:** Team section: current team name, logo placeholder, and a short 1–2 sentence description. Sourced from `content/player.ts` as a `team` object. No teammate photos — that's Phase 3.

### Missing Phase 3 Sections
- **D-18:** Phase 3 sections (Highlights, Gallery, Contact) exist in Phase 2 as stubs so nav links resolve correctly. No broken anchors.
- **D-19:** Stub appearance: dark section with the section title only — no "coming soon" text. Indistinguishable from a real (but minimal) section to a non-technical visitor.
- **D-20:** Stubs are a single reusable `SectionStub` component in `components/sections/SectionStub.tsx` — accepts `id` and `title` props. Phase 3 swaps each stub for the real section component.
- **D-21:** `app/[lang]/page.tsx` assembles all 8 sections in nav order: HeroSection, AboutSection, TrophiesSection, ClubSection, TeamSection, then SectionStub × 3 (highlights, gallery, contact).

### Claude's Discretion
- Exact parallax speed ratio for hero (e.g., background at 30% scroll speed vs. text at 100%) — planner/researcher picks a cinematic value
- Trophy card layout (grid columns, card proportions, crimson accent treatment) — researcher decides based on design token system
- Stat bar visual style details (bar height, border-radius, accent color fill vs. track color) — stays within `--color-accent` and `--color-bg-elevated` tokens
- Section heading style (uppercase Oswald with a crimson underline accent, or other treatment) — planner decides what looks most premium

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- `.planning/PROJECT.md` — Core value, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — Phase 2 requirements: HOME-01, HOME-02, HOME-03, HOME-04, PLAYER-01, PLAYER-02, PLAYER-03, PLAYER-04, SECT-01, SECT-02, SECT-03
- `.planning/ROADMAP.md` — Phase 2 success criteria (4 criteria that must all be TRUE)
- `SPEC.md` — Product goals, architecture overview, content storage structure

### Architecture & Animation Rules
- `CLAUDE.md` — **CRITICAL**: animation ownership rule (Framer Motion = mount/unmount/hover; GSAP = scroll sequences — never animate the same element with both), GSAP-in-useGSAP rule, directory architecture, content data flow pattern

### Established Phase 1 Patterns (read before building new components)
- `app/[lang]/ScrollFadeSection.tsx` — The established GSAP ScrollTrigger pattern: `useGSAP({ scope: containerRef })`, `start: 'top 80%'`, `stagger: 0.1`. All scroll animations in Phase 2 extend this pattern.
- `components/layout/Nav.tsx` — Existing stub nav with all 8 section anchors already defined. Phase 2 must NOT change the nav's anchor list.
- `styles/_tokens.scss` — All design tokens. `--text-hero: 5rem` is ready for hero. `--color-accent: #E5002B` for crimson. `--color-bg: #0D1B2A` for dark navy base.

### Content Data Flow
- `CLAUDE.md` §Architecture — "content/*.ts → app/[lang]/page.tsx → <SectionComponent data={...} dict={...} />" — sections never import content directly

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/layout/Nav.tsx` — Stub nav already has all 8 section anchors (`#home`, `#about`, `#highlights`, `#gallery`, `#trophies`, `#club`, `#team`, `#contact`). Phase 2 fills the real sections; the nav never needs anchor changes.
- `components/layout/ThemeToggle.tsx` — Already built. Phase 2 sections inherit theme via CSS custom properties automatically.
- `app/[lang]/ScrollFadeSection.tsx` — Direct prototype for the `useScrollReveal()` hook Phase 2 will extract. The pattern is: `useRef` + `useGSAP({ scope: containerRef })` + `gsap.from('.fade-item', { opacity:0, y:40, stagger:0.1, scrollTrigger: { start:'top 80%' } })`.
- `styles/_tokens.scss` — `--text-hero`, `--font-heading`, `--color-accent`, `--color-bg`, `--color-bg-elevated`, `--space-*` all ready. No new tokens needed for Phase 2 core layout.
- `components/providers/Providers.tsx` + `lib/SmoothScrollProvider` — Already in layout. Lenis + GSAP ScrollTrigger proxy is wired. Phase 2 sections just work.

### Established Patterns
- **GSAP scroll animation pattern**: `'use client'` → `useRef<HTMLDivElement>` → `useGSAP(() => { gsap.from(..., { scrollTrigger: { trigger: ref.current, start: 'top 80%' } }) }, { scope: ref })`. Must be followed exactly.
- **Framer Motion mount animation pattern**: `motion.div` with `initial/animate/transition` props. Used in Nav's mobile menu — same pattern for hero text entrance.
- **SCSS Module pattern**: `styles.componentName` class references. No global class names (except `fade-item` class selector used in ScrollFadeSection for GSAP targeting — acceptable for GSAP `.from()` calls).
- **`'use client'` boundary**: Any component with `useRef`, `useGSAP`, `useState`, or Framer Motion animation must be `'use client'`. Server components are for static layout wrappers only.

### Integration Points
- `app/[lang]/page.tsx` — Currently the design demo. Phase 2 replaces its entire body with the 8-section assembly. The `<Nav />` import stays.
- `app/[lang]/layout.tsx` — No changes needed. Providers, fonts, and SmoothScrollProvider are already set up correctly.
- New directory: `components/sections/` — All Phase 2 section components (HeroSection, AboutSection, TrophiesSection, ClubSection, TeamSection, SectionStub) live here.
- New directory: `content/` — `content/player.ts` (profile, attributes, trophies, club, team) is the sole data source for all Phase 2 sections.
- New directory: `lib/animations/` — `useScrollReveal.ts` hook extracted from ScrollFadeSection pattern.

</code_context>

<specifics>
## Specific Ideas

- Hero: the user explicitly said "parallax effect with complex animation use GSAP" — the hero background must have a notable, impressive parallax. Not just a subtle movement — a cinematic GSAP timeline.
- Profile working foot: should display with a visual icon (e.g., a foot/boot icon) alongside the text value, not just text alone.
- Player bio text: must be creative and unique — not generic filler. Planner should treat `content/player.ts` bio as authored content, not placeholder lorem ipsum, even if the player name itself is a placeholder.
- Stat bars: animate on scroll entry specifically with GSAP (not CSS transitions) to stay consistent with the animation ownership rule.

</specifics>

<deferred>
## Deferred Ideas

- Career timeline (clubs + seasons): mentioned in v2 requirements (PLAYER-V2-02) — not Phase 2
- Teammates showcase with photos: Phase 3+ — requires media assets
- Real player photo for hero: will be added as content update after Phase 2, not blocking
- Real club/team logos: same as above — placeholder slots built in Phase 2, logos filled in later
- Player logo / AI-generated visuals (from SPEC.md §8 AI Content): post-Phase 2

</deferred>

---

*Phase: 2-Core Sections & Animations*
*Context gathered: 2026-05-19*
