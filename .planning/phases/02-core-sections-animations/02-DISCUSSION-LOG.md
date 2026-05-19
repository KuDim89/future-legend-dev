# Phase 2: Core Sections & Animations - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 2-Core Sections & Animations
**Areas discussed:** Hero visual, Animation depth, Player attributes, Missing sections

---

## Hero visual

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, I have a photo ready | Real player photo provided — build hero to use it as background | |
| Not yet — placeholder for now | Dark cinematic placeholder, photo slot filled later | ✓ |

**User's choice:** Placeholder for now

---

| Option | Description | Selected |
|--------|-------------|----------|
| Dark navy + crimson gradient | Matches existing tokens, striking, easy to replace when photo arrives | ✓ |
| Dark with football-field texture overlay | Subtle grass/pitch texture beneath dark overlay | |
| You decide | Claude picks the most cinematic placeholder approach | |

**User's choice:** Dark navy + crimson gradient

---

| Option | Description | Selected |
|--------|-------------|----------|
| Player name + position + CTA button | Clean scout-focused hero | ✓ |
| Player name + position + tagline + CTA | Adds personality with a tagline | |
| Player name + number/age + position + CTA | Adds jersey number or age as accent | |

**User's choice:** Player name + position + CTA button

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — background parallax (GSAP) | Background moves slower than content — classic parallax | |
| No — background fixed, text scrolls out | Simpler, still premium | |
| Other (free text) | User specified custom requirement | ✓ |

**User's choice:** "Here I need to have parallax effect with complex animation use GSAP"
**Notes:** User explicitly wants an impressive, complex GSAP parallax on the hero — not a subtle effect.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — staggered Framer Motion reveal on mount | Name → position → CTA sequential fade+slide up | ✓ |
| Yes — GSAP timeline on mount | More control but breaks animation ownership rule | |
| No entrance animation | Content appears instantly | |

**User's choice:** Staggered Framer Motion reveal on mount (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| I'll provide the real player data | Real name, position, and profile details now | |
| Use placeholder data for now | Realistic Ukrainian footballer placeholder | ✓ |

**User's choice:** Use placeholder data for now

---

## Animation depth

| Option | Description | Selected |
|--------|-------------|----------|
| Consistent fade+slide for all sections | Every section uses same entrance pattern | ✓ |
| Unique personality per section | Each section has distinct animation | |
| Consistent base + one hero special | All sections same EXCEPT hero | |

**User's choice:** Consistent fade+slide for all sections (hero still gets its own complex GSAP treatment)

---

| Option | Description | Selected |
|--------|-------------|----------|
| When top of section hits 80% of viewport | `start: 'top 80%'` — matches Phase 1 prototype | ✓ |
| When section enters viewport at 100% | More conservative, can feel late on mobile | |
| You decide | Use Phase 1 pattern as baseline | |

**User's choice:** When top of section hits 80% of viewport (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Staggered: title first, then content items | Title → items with stagger delay | ✓ |
| All together: entire section fades in as one unit | Whole section animates at once | |

**User's choice:** Staggered: title first, then content items (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Once — play on entry, stay visible | `scrub: false`, no toggleActions | ✓ |
| Replay — animate in and out on each scroll | More dynamic but distracting | |

**User's choice:** Once — play on entry, stay visible (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Shared hook: useScrollReveal() in lib/animations/ | Reusable, keeps sections clean | ✓ |
| Each section has its own inline useGSAP block | Simple but duplicates code | |
| You decide | Claude chooses best pattern | |

**User's choice:** Shared hook: useScrollReveal() in lib/animations/ (Recommended)

---

## Player attributes

| Option | Description | Selected |
|--------|-------------|----------|
| FIFA-style stat bars with numbers | Labeled bar with 1–100 value | ✓ |
| Text badges / tags | Pill badges like [Quick] [Strong left foot] | |
| Simple stat grid (label + value) | Text-only structured grid | |

**User's choice:** FIFA-style stat bars with numbers (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| 6 core attributes: Pace, Dribbling, Shooting, Passing, Physical, Defending | FIFA-inspired, position-agnostic | ✓ |
| 5 position-specific attributes | More accurate for player's position | |
| You decide | Claude picks sensible attribute set | |

**User's choice:** 6 core attributes (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — animated fill using GSAP | Bars fill 0→value on scroll entry | ✓ |
| No — bars appear at full value instantly | Simpler | |

**User's choice:** Yes — animated fill using GSAP (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Info grid: Name, Position, Working foot, DOB | 4-field structured grid | |
| Info grid + short bio paragraph | 4 fields + narrative text | |
| Other (free text) | User specified custom layout | ✓ |

**User's choice:** Info grid with Name, Position, Working foot (with icon), Date of birth + 2-3 sentence unique creative characteristic bio from `content/player.ts`

---

| Option | Description | Selected |
|--------|-------------|----------|
| Current team info: team name, logo placeholder, short description | Simple, maintainable | ✓ |
| Teammates showcase: 3-5 teammates with photos | Social proof but needs more data | |
| Career timeline: all clubs history | Better as v2 | |

**User's choice:** Current team info (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Cards: trophy name, year, competition | Grid of trophy cards | ✓ |
| Visual shelf: large trophy icons | More visual but needs illustrations | |
| You decide | Claude designs for premium look | |

**User's choice:** Trophy cards with name, year, competition (Recommended)

---

## Missing sections

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal stub sections | Visible sections with title, no "coming soon" | ✓ |
| Remove Phase 3 links from nav temporarily | Nav only shows Phase 2 sections | |
| Leave links in as dead links | Worst option — broken UX | |

**User's choice:** Minimal stub sections (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Dark section with section title only | No "coming soon" text, looks intentional | ✓ |
| Section title + "Coming soon" or icon | Explicit placeholder | |

**User's choice:** Dark section with section title only (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| components/sections/ as SectionStub reusable component | Accepts id + title, swap in Phase 3 | ✓ |
| Inline in app/[lang]/page.tsx as plain sections | Less abstraction, needs rework in Phase 3 | |

**User's choice:** SectionStub component in components/sections/ (Recommended)

---

| Option | Description | Selected |
|--------|-------------|----------|
| 8 sections total: 5 real + 3 stubs | All nav anchors resolve | ✓ |
| 5 real sections only — stubs added later | Dead nav links during Phase 2 | |

**User's choice:** 8 sections total (Recommended)

---

## Claude's Discretion

- Exact parallax speed ratio for hero (background vs. text scroll speed)
- Trophy card layout details (grid columns, card proportions, accent treatment)
- Stat bar visual style (bar height, border-radius, fill vs. track color using existing tokens)
- Section heading style (uppercase Oswald treatment, crimson accent details)

## Deferred Ideas

- Career timeline (clubs + seasons) — v2 requirement PLAYER-V2-02
- Teammates showcase with photos — Phase 3+, needs media assets
- Real player photo for hero — content update after Phase 2, not blocking
- Real club/team logos — placeholder slots built now, logos filled later
- Player logo / AI-generated visuals — post-Phase 2 (SPEC.md §8)
