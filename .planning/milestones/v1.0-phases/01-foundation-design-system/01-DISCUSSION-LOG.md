# Phase 1: Foundation & Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 1-Foundation & Design System
**Areas discussed:** GitHub repo name, Color palette direction, Typography selection, Phase 1 page state

---

## GitHub Repo Name

| Option | Description | Selected |
|--------|-------------|----------|
| future-legend-dev (current folder name) | basePath: '/future-legend-dev' — uses the current working directory name as-is. | ✓ |
| future-legend | basePath: '/future-legend' — a cleaner name, the "-dev" suffix dropped for the live repo. | |
| Something else | I'll type the exact repo name. | |

**User's choice:** `future-legend-dev`
**Notes:** Repo name as-is, no rename. basePath and assetPrefix will use `/future-legend-dev`.

---

## Color Palette Direction

### Visual mood

| Option | Description | Selected |
|--------|-------------|----------|
| Dark/cinematic — deep charcoal + gold/amber | Dark backgrounds (near-black), rich gold or amber accents. Think Champions League, premium sports brand. Bold and dramatic. | |
| Clean/bold — white + electric accent | Clean white or light backgrounds, strong electric accent. Think Nike, modern football academy sites. High contrast and energetic. | ✓ |
| Club-inspired — based on the player's current club colors | Base the palette on the player's actual club identity. Strong personal brand connection. | |

**User's choice:** Clean/bold — white + electric accent

### Accent color

| Option | Description | Selected |
|--------|-------------|----------|
| Electric blue (#0066FF range) | Bold, trustworthy, professional. Common in sports tech and scouting platforms. | |
| Vibrant green (#00C853 range) | Energy, growth, speed. Feels modern and youthful. | |
| Crimson/red (#E5002B range) | Passion, intensity, ambition. Very high impact, creates urgency. Works well against white. | ✓ |

**User's choice:** Crimson/red (#E5002B range)

### Dark theme background

| Option | Description | Selected |
|--------|-------------|----------|
| Deep charcoal (#0A0A0A — near black) | Almost black, very cinematic. Accent pops dramatically. Feels premium and serious. | |
| Dark navy (#0D1B2A range) | Dark blue-black. Adds depth and a sporty feel without being pure black. Common in football kits. | ✓ |
| Dark grey (#1A1A2E range) | Soft dark. Less extreme, easier on the eyes for longer browsing. | |

**User's choice:** Dark navy (#0D1B2A range)

### Default theme

| Option | Description | Selected |
|--------|-------------|----------|
| Follow system preference | Respects the visitor's OS dark/light setting automatically. | |
| Dark theme always | Always opens dark. More cinematic first impression, regardless of device preference. | ✓ |
| Light theme always | Always opens light. Safer for professional contexts. | |

**User's choice:** Dark theme always
**Notes:** Cinematic first impression prioritized over system preference. Visitors can still toggle.

### Text color (additional question)

| Option | Description | Selected |
|--------|-------------|----------|
| Dark gray (#111111 — near black, softer) | Premium editorial feel. Slightly easier to read on white. | ✓ |
| Pure black (#000000) | Maximum contrast. Stark and bold. | |

**User's choice:** Dark gray (#111111)

---

## Typography Selection

### Heading font

| Option | Description | Selected |
|--------|-------------|----------|
| Oswald — condensed, bold, athletic | Tall narrow letterforms. Very sporty and impactful. Has Cyrillic. Pairs well with crimson accent. | ✓ |
| Bebas Neue — all-caps, ultra-bold | Maximum impact, pure energy. No lowercase letters. Has Cyrillic. | |
| Montserrat — geometric, premium | Clean and modern. More versatile. Has full Cyrillic support. | |

**User's choice:** Oswald

### Body font

| Option | Description | Selected |
|--------|-------------|----------|
| Inter — clean, screen-optimized, neutral | Designed for digital readability. Full Cyrillic support. Recommended pairing. | |
| Roboto — standard, readable, familiar | Ubiquitous but solid. Works at any size. Full Cyrillic. | ✓ |
| Work Sans — modern, slightly sporty | Has some character without competing with Oswald. Full Cyrillic. | |

**User's choice:** Roboto

### Third display font

| Option | Description | Selected |
|--------|-------------|----------|
| No — Oswald handles everything bold | Two-font system is cleaner. Oswald at large sizes is already very dramatic. | ✓ |
| Yes — add a display font for hero elements | Something like Barlow Condensed or Chakra Petch for the biggest, most cinematic text. | |

**User's choice:** No third font — two-font system (Oswald + Roboto)

---

## Phase 1 Page State

### Page visible output

| Option | Description | Selected |
|--------|-------------|----------|
| Design system demo page | A styled page showing typography specimens, color swatches, spacing scale, and the theme toggle in action. Dev reference. | ✓ |
| Minimal site skeleton | Nav bar, empty section placeholders with headings, smooth scroll and theme toggle work. No content yet. | |
| Fully blank (just CI/CD + config) | Bare minimum: deployable static site, CI runs, no visible UI. | |

**User's choice:** Design system demo page

### Demo page content

| Option | Description | Selected |
|--------|-------------|----------|
| Typography + colors + theme toggle | Font scale specimens, color palette swatches for both themes, working light/dark toggle. | |
| Full token showcase + scroll test | Everything above plus a scroll section to verify Lenis + GSAP ScrollTrigger. | ✓ |
| Minimal — just verify it deploys | Just 'Hello World' with the theme toggle. | |

**User's choice:** Full token showcase + scroll test
**Notes:** Must include a real scroll-triggered fade-in animation to prove GSAP ScrollTrigger + Lenis proxy are correctly wired.

### Nav scaffold

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — stub nav with all section anchors | Nav component with all final links exists; sections below are placeholders. Phase 2 fills sections, nav never needs rework. | ✓ |
| No — minimal/no nav in Phase 1 | Phase 2 builds the nav along with sections. | |

**User's choice:** Yes — stub nav with all final section anchors

---

## Claude's Discretion

- Specific spacing scale values and typography size ratios
- FOUC prevention implementation approach (suppressHydrationWarning + data-theme attribute is standard)
- Exact hex values within stated ranges (final crimson shade, final navy shade)

## Deferred Ideas

None — discussion stayed within Phase 1 scope.
