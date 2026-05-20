# Retrospective: Future Legend

## Milestone: v1.0 MVP

**Shipped:** 2026-05-20
**Phases:** 4 | **Plans:** 14

### What Was Built

- Next.js static export + GitHub Pages CI/CD with FOUC-free dark theme, Lenis+GSAP scroll proxy, and responsive CSS design token system
- Cinematic homepage — GSAP parallax hero, Framer Motion stagger, 8 sections, FIFA-style animated stat bars, trophies grid, club/team sections
- YouTube lite-embed highlights + masonry photo gallery with yarl lightbox — zero page-load impact
- GitHub Actions → Telegram Bot contact pipeline, confirmed live; honeypot + time-check spam guards; secrets never in client bundle
- Full bilingual UA/EN — locale dictionaries, LanguageSwitcher with localStorage, both routes pre-rendered as static HTML, zero hardcoded strings in components

### What Worked

- **GSD wave-based parallel execution** — Plans 04-02 and 04-03 ran concurrently after 04-01 unblocked them; ~50% faster than sequential
- **Must-have truths in PLANs** — Concrete TypeScript assertions in `must_haves.truths` gave executors unambiguous acceptance criteria; zero "what does done look like?" ambiguity
- **Player.ts migration (D-12 Option A)** — Removing translatable fields entirely (not optional) forced TypeScript to surface every section component that needed migration; the compiler was the test suite
- **RESEARCH.md pitfall sections** — Pre-documenting common failure modes (basePath in redirects, `hqdefault.jpg` vs `maxresdefault.jpg`, workflow_dispatch 204 vs 202) prevented the most common gotchas from materializing as bugs
- **Two-day velocity** — 14 plans across a full bilingual portfolio site with live contact pipeline in 2 sessions

### What Was Inefficient

- **REQUIREMENTS.md checkboxes never updated during execution** — The traceability table was stale from day one; milestone close required manual re-audit. Should mark requirements complete inside each plan's commit or immediately after each phase
- **Plan 04-03 timeout** — First execution attempt timed out after 5 tasks; required a retry. The plan covered 8 components in 2 tasks — splitting into smaller per-component tasks would reduce timeout risk
- **Gallery placeholder content** — Gallery photos and video IDs were replaced twice during Phase 3 (executor-generated → real Unsplash → user-provided IDs). Content decisions should be made before plan execution, not during

### Patterns Established

- **Framer Motion + GSAP ownership rule** — Framer Motion owns mount/unmount & hover; GSAP owns scroll-triggered sequences. Enforced via CLAUDE.md; no violations across the entire project
- **`useGSAP()` scope pattern** — All GSAP code in `'use client'` components inside `useGSAP({ scope: ref })` for proper cleanup; prevents SSR errors and memory leaks
- **ThemeToggle mounted guard** — `useState(false)` + `useEffect(() => setMounted(true), [])` + `if (!mounted) return null` prevents hydration mismatch for client-only UI controls; replicated in LanguageSwitcher
- **getDictionary dynamic import** — `import('../dictionaries/ua.json').then(m => m.default as Dictionary)` is the correct static-export-compatible i18n pattern; `fs.readFile` would break at build time
- **Contact form success check** — GitHub workflow_dispatch returns 204 No Content; `response.ok` is the correct check, not `=== 202`

### Key Lessons

- **GSAP `autoRaf: false` is mandatory with ReactLenis** — Lenis must not run its own RAF; GSAP ticker must drive all animation frames to keep ScrollTrigger and Lenis in sync. Without this, scroll position drifts after tab switch.
- **basePath must be in every redirect, every asset path, every internal link** — Missing it on any one instance causes 404 on GitHub Pages. `const BASE_PATH = '/future-legend-dev'` as a module-level constant is the correct pattern.
- **Whitelisting localStorage values before navigation** — `const target = stored === 'en' ? 'en' : 'ua'` — never use raw stored values in `window.location.replace`. Even for non-sensitive preferences, this is the correct pattern.
- **Splitting plans by dependency boundary, not by file count** — Wave 2 had 04-02 (Nav/LanguageSwitcher) and 04-03 (8 section components) run in parallel; splitting by component count (04-02: 2 files, 04-03: 8 files) created an imbalanced wave. Next time, split 04-03 into two plans (hero+about+trophies, club+team+highlights+gallery+contact).

### Cost Observations

- Sessions: 4 execution sessions
- Notable: Wave-based parallel execution cut Phase 4 execution time roughly in half; most individual plans completed in under 5 minutes

---

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 4 |
| Plans | 14 |
| Days | 2 |
| LOC | ~2,100 |
| Timeout incidents | 1 (04-03 retry) |
| Requirements met | 30/31 (97%) |
| Live delivery confirmed | Contact pipeline (Telegram) |
