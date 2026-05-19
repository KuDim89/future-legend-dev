# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the deployable technical foundation: Next.js static export scaffold correctly configured for GitHub Pages, working CI/CD pipeline (push to `main` → deploy), SCSS design token system covering both light and dark themes, Lenis smooth scroll + GSAP ScrollTrigger initialized. Phase 1 delivers a developer-facing design system demo page — not content sections. Content sections are Phase 2's job.

</domain>

<decisions>
## Implementation Decisions

### GitHub Pages Configuration
- **D-01:** GitHub repo name is `future-legend-dev` → `basePath: '/future-legend-dev'`, `assetPrefix: '/future-legend-dev/'` in `next.config.ts`
- **D-02:** Full critical config: `output: 'export'`, `basePath: '/future-legend-dev'`, `assetPrefix: '/future-legend-dev/'`, `trailingSlash: true`, `images: { unoptimized: true }`

### Color Palette
- **D-03:** Visual mood is **clean/bold** — white light theme, dark navy dark theme, crimson/red accent
- **D-04:** Light theme background: white/near-white. Dark theme background: dark navy (`#0D1B2A` range)
- **D-05:** Primary accent color: crimson/red (`#E5002B` range) — used for CTAs, highlights, active states, focus rings
- **D-06:** Light theme body text: dark gray (`#111111`) — not pure black, softer and more premium
- **D-07:** Default theme on first visit (no saved preference): **dark always** — opens dark regardless of system preference

### Typography
- **D-08:** Heading font: **Oswald** — condensed, athletic, bold. Used for H1–H6, section titles, player name. Has Cyrillic subset for Ukrainian.
- **D-09:** Body font: **Roboto** — readable, familiar, screen-optimized. Used for paragraphs, bios, descriptions, labels. Has Cyrillic subset.
- **D-10:** Two-font system only — no third display/accent font. Oswald at large sizes is sufficiently dramatic for hero moments.
- **D-11:** Both fonts loaded via Next.js font optimization (self-hosted from Google Fonts) with Latin and Cyrillic subsets

### Phase 1 Page State (Delivered Output)
- **D-12:** Phase 1 delivers a **design system demo page** — a developer reference, not a scout-facing page
- **D-13:** Demo page must show: typography specimens (H1–H6, body, small text), color palette swatches for both themes, working light/dark theme toggle, and a scroll test section with a fade-in animation (verifying Lenis + GSAP ScrollTrigger)
- **D-14:** A **stub nav component** is built in Phase 1 with all final section anchors (Home, About, Media/Highlights, Gallery, Trophies, Club, Team, Contact) — sections are placeholders but nav is real. Phase 2 fills sections; nav never needs rework.

### Claude's Discretion
- Specific spacing scale values and typography size ratios — planner/researcher decides based on premium design principles
- FOUC prevention implementation detail (technical approach with next-themes suppressHydrationWarning + data-theme attribute) — standard approach, user has no preference
- Exact hex values within the stated ranges (e.g., final crimson shade, final navy shade) — researcher can refine

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- `.planning/PROJECT.md` — Core value, constraints, and key decisions (stack is pre-decided, no deviations)
- `.planning/REQUIREMENTS.md` — Phase 1 requirements: FOUND-01, FOUND-02, FOUND-03, FOUND-04, VIS-01, VIS-02, VIS-03, VIS-04, VIS-05
- `.planning/ROADMAP.md` — Phase 1 success criteria (5 criteria that must all be TRUE for phase to be complete)
- `SPEC.md` — Project-level spec: product goals, tech stack, architecture overview, Telegram integration flow

### CLAUDE.md Architecture Rules
- `CLAUDE.md` — Critical animation rule (Framer Motion owns mount/unmount/hover; GSAP owns scroll sequences — never animate same element with both), GSAP rule (all GSAP inside `useGSAP()` from `@gsap/react` inside `'use client'` components only), directory architecture, content data flow

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — codebase is completely empty. Phase 1 builds everything from scratch.

### Established Patterns
- None yet — Phase 1 establishes the patterns that future phases follow.

### Integration Points
- Phase 1 creates the `app/[lang]/layout.tsx` (ThemeProvider, fonts, SmoothScrollProvider) that all future phases depend on
- Phase 1 creates `styles/_tokens.scss` that all component SCSS modules will import
- Phase 1 creates the stub nav that Phase 2 will activate with real section content

</code_context>

<specifics>
## Specific Ideas

- The design system demo page is for developer verification only — it does not need to be gated or removed before Phase 2; Phase 2 will replace it with the real homepage
- The scroll test section on the demo page should demonstrate a real GSAP ScrollTrigger fade-in to confirm the Lenis proxy is correctly wired (not just that the libraries are installed)
- Nav section anchors should match the final site sections: Home, About, Highlights, Gallery, Trophies, Club, Team, Contact

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Foundation & Design System*
*Context gathered: 2026-05-19*
