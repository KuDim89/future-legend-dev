# Future Legend — Football Player Personal Website

## What This Is

A cinematic personal portfolio website for a young football player, designed to professionally present them to scouts, coaches, football clubs, and fans. The site tells the player's story through immersive visuals, animations, and structured player information — built to maximize visibility and drive recruitment opportunities.

## Core Value

A scout or coach visiting the site immediately understands who this player is, what they can do, and how to contact them — within seconds of landing on the page.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Cinematic homepage with hero section, scroll animations, and CTA
- [ ] Player profile section (full name, position, working leg, photo)
- [ ] Media system: YouTube video embeds for training and match highlights
- [ ] Photo gallery for training and match images
- [ ] Trophies / achievements section
- [ ] Current club information section
- [ ] Team section
- [ ] Contact form with Telegram notification via GitHub Actions
- [ ] UA / EN bilingual language support
- [ ] Light / Dark theme support
- [ ] Mobile-responsive layout
- [ ] Fast loading performance (static export)
- [ ] Custom premium visual design system (SCSS Modules, no Tailwind)
- [ ] AI-generated player logo and storytelling content

### Out of Scope

- User registration / authentication — purely informational site, no accounts needed
- Admin panel / CMS — content managed via code/JSON files
- Comments or social interaction — not a social platform
- Payments / monetization — no commercial transactions
- Real-time features — static site, no WebSockets

## Context

- Stack is pre-decided: Next.js (static export), React, TypeScript, SCSS Modules, Framer Motion (UI animations), GSAP (cinematic/advanced animations)
- Deployment: GitHub Pages via GitHub Actions
- Contact system uses GitHub Actions to forward form submissions to Telegram Bot API (bot token in GitHub Secrets)
- Content is stored in local TypeScript/JSON files (`/content/` directory) — no external database
- Site is SPA-style with sections: Home, About Player, Best Moments, Training Gallery, Trophies, Current Club, Team, Contact
- The player this is built for is young and seeking professional opportunities

## Constraints

- **Tech Stack**: Next.js static export + SCSS Modules only — Tailwind CSS explicitly excluded
- **Animations**: Framer Motion for UI animations, GSAP for cinematic sequences — both required
- **Hosting**: GitHub Pages (free static hosting) — no server-side rendering, no API routes at runtime
- **Contact**: Telegram integration via GitHub Actions — no backend server
- **i18n**: Must support Ukrainian (UA) and English (EN) from day one
- **Content**: All content lives in local files — no CMS dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js static export over SSR | GitHub Pages deployment requires static files | — Pending |
| SCSS Modules over Tailwind | Custom premium design requires full CSS control | — Pending |
| Framer Motion + GSAP dual animation | Framer Motion for React component transitions, GSAP for complex timeline/scroll sequences | — Pending |
| GitHub Actions for contact form | No server needed; Telegram bot handles notifications | — Pending |
| Local JSON/TS content files | No CMS cost/complexity; content updated via code | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-18 after initialization*
