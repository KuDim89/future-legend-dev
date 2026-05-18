<!-- GSD:project-start source:PROJECT.md -->
## Project

**Future Legend — Football Player Personal Website**

A cinematic personal portfolio website for a young football player, designed to professionally present them to scouts, coaches, football clubs, and fans. The site tells the player's story through immersive visuals, animations, and structured player information — built to maximize visibility and drive recruitment opportunities.

**Core Value:** A scout or coach visiting the site immediately understands who this player is, what they can do, and how to contact them — within seconds of landing on the page.

**Roadmap:** 4 phases — Foundation & Design System → Core Sections & Animations → Media & Contact → Bilingual Support & Polish

See `.planning/PROJECT.md` and `.planning/ROADMAP.md` for full context.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

- **Framework:** Next.js 16.x with `output: 'export'` (static export only — no SSR)
- **Language:** TypeScript
- **Styling:** SCSS Modules (NO Tailwind CSS — custom premium design system)
- **Animations:** Framer Motion (component lifecycle) + GSAP + @gsap/react (scroll/cinematic) + Lenis (smooth scroll)
- **i18n:** Built-in `app/[lang]/` pattern + `generateStaticParams` — NO next-i18next, NO next-intl middleware
- **Themes:** CSS custom properties (`data-theme` attribute) + next-themes for React context
- **Media:** react-youtube (lite-embed pattern) + yet-another-react-lightbox
- **Deployment:** GitHub Pages via GitHub Actions (push to `main` → deploy)
- **Contact:** GitHub Actions workflow_dispatch → Telegram Bot API (token in GitHub Secrets only)

**Critical config (next.config.ts):**
```ts
output: 'export', basePath: '/repo-name', assetPrefix: '/repo-name/', trailingSlash: true, images: { unoptimized: true }
```

**Animation rule:** Framer Motion owns mount/unmount & hover. GSAP owns scroll-triggered sequences. Never animate the same element with both.

**GSAP rule:** All GSAP code inside `useGSAP()` from `@gsap/react` inside `'use client'` components only.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

```
app/[lang]/           # Dynamic locale segment (ua | en)
  layout.tsx          # Root layout: ThemeProvider, fonts, SmoothScrollProvider
  page.tsx            # Home — assembles all section components
components/
  sections/           # Full-page sections (Hero, About, Media, Contact, etc.)
  ui/                 # Reusable primitives (Button, Badge, VideoCard, etc.)
  layout/             # Nav, Footer, ThemeToggle, LanguageSwitcher
content/              # TypeScript data files (player.ts, videos.ts, gallery.ts, etc.)
dictionaries/         # i18n string files (en.json, ua.json)
lib/
  getDictionary.ts    # Locale dictionary loader
  animations/         # GSAP timeline factories + Framer Motion variants
styles/               # _tokens.scss, _typography.scss, _mixins.scss
public/
  .nojekyll           # Required — prevents GitHub Pages from stripping _next/
```

**Content data flow:** `content/*.ts` → `app/[lang]/page.tsx` → `<SectionComponent data={...} dict={...} />` — sections never import content directly.

**Build order:** Foundation config → Design tokens → Static section layouts → Animation layer → Media → Contact → i18n content fill
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to `.claude/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` — do not edit manually.
<!-- GSD:profile-end -->
