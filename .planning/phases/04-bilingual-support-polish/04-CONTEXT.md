# Phase 4: Bilingual Support & Polish - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Thread Ukrainian and English translations through every visible string, wire up a language switcher in the Nav, and establish a root redirect that sends first-time visitors to `/ua/` and returning visitors to their stored locale preference. The result: `/ua/` and `/en/` both exist as pre-rendered static HTML with zero hardcoded strings in any component file.

Phase 4 does NOT build: new sections, new animations, CMS integration, or any backend changes. The contact pipeline, video, and gallery sections from Phase 3 are untouched except for replacing their hardcoded strings with dictionary lookups.

</domain>

<decisions>
## Implementation Decisions

### Dictionary Structure
- **D-01:** JSON shape is **nested by section** — e.g., `{ "nav": { "home": "Home", "about": "About" }, "hero": { "cta": "Contact" }, "contact": { "errorMessage": "Something went wrong...", "successMessage": "Your message has been sent." } }`. Groups keys by section, auditable, and produces a single TypeScript `Dictionary` type.
- **D-02:** **Full sweep** — every visible string goes in dictionaries: nav labels, section titles, body paragraphs, CTAs, form field labels, form placeholders, button text, error messages, success messages, and aria-labels. No hardcoded English anywhere in component files after Phase 4.
- **D-03:** Contact form strings are fully translated: error message (`"Something went wrong... email at dimakyh@ukr.net"`), success message (`"Your message has been sent. We'll be in touch soon."`), button labels (`"Send Message"`, `"Sending..."`), field placeholders, required/optional labels.
- **D-04:** TypeScript type is **auto-inferred from `en.json`** — `lib/getDictionary.ts` uses `typeof import('../dictionaries/en.json')` as the `Dictionary` type. TypeScript catches missing keys in `ua.json` automatically. No manual interface maintenance.

### Language Switcher Design
- **D-05:** Switcher lives **inside the Nav, next to ThemeToggle**, in the `controls` row. Also rendered inside the mobile menu overlay (at bottom of the link list). No separate floating button.
- **D-06:** Visual style: **flag emoji + locale code** — `🇺🇦 UA` and `🇬🇧 EN`. Both locales always visible; active one is underlined with `--color-accent`.
- **D-07:** Clicking a locale: saves preference to `localStorage` (key: `'locale'`), then navigates to `/${newLang}/${currentSectionAnchor}` — preserving the user's scroll position as a hash anchor. Requires the Nav to track the current active section (via IntersectionObserver or scroll position read).
- **D-08:** Active locale indicator: **bottom underline** in `--color-accent` (crimson). Inactive locale is muted/dimmed — no accent.

### Root Redirect Behavior
- **D-09:** `app/page.tsx` (root route) does a **client-side redirect** using `useEffect`: reads `localStorage.getItem('locale')`. If a stored value exists → `window.location.replace('/${storedLocale}/')`. If not → `window.location.replace('/ua/')`. First-time visitors land on `/ua/` by default. Return visitors land on their stored preference.
- **D-10:** Preference stored in **`localStorage` only** (key: `'locale'`, values: `'ua'` or `'en'`). No cookies.
- **D-11:** Preference written to `localStorage` **only when the user clicks the language switcher**. Page load does not overwrite the stored preference.

### Player Content Migration
- **D-12:** **Narrative/translatable text moves to dictionaries; factual data stays in `player.ts`.** Dictionaries get: bio text, position label, club name, club description, team description, attribute labels (Pace, Dribbling, Shooting, Passing, Physical, Defending). `player.ts` retains: stats numbers (pace: 85), dob, working foot code, trophy years, video IDs, photo paths.
- **D-13:** **Player's actual name (`Dmytro Kovalenko`) stays in `player.ts`** — proper noun, identical in both languages. Sections read it from `player.ts`, not dictionaries.
- **D-14:** **Trophy names and competition names go in dictionaries** under a `trophies` section — e.g., `{ "trophies": { "items": [ { "name": "Regional Youth Championship", "competition": "Kyiv Oblast Youth League" } ] } }`. The trophy array in dictionaries must match the trophy array length in `player.ts` — planner must enforce this constraint.

### Claude's Discretion
- Exact section anchor detection strategy for the language switcher (IntersectionObserver vs. scroll position read vs. URL hash) — researcher/planner picks the most reliable approach for this one-page layout
- Mobile menu placement of the switcher within the existing mobile overlay DOM structure — planner decides where it fits cleanly
- Exact `getDictionary.ts` async loader implementation (dynamic import vs `fs.readFile`) — must be compatible with `output: 'export'` static constraint (no `fs` at runtime; use dynamic `import()`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- `.planning/PROJECT.md` — Core value, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — Phase 4 requirements: I18N-01, I18N-02, I18N-03, I18N-04
- `.planning/ROADMAP.md` — Phase 4 goal and 4 success criteria that must ALL be true

### Architecture & i18n Rules
- `CLAUDE.md` — **CRITICAL**: i18n pattern (`app/[lang]/` + `generateStaticParams` — NO next-i18next, NO next-intl middleware), content data flow pattern (`content/*.ts` → `page.tsx` → section props), animation ownership rules (still apply to any new animated components like LanguageSwitcher)

### Existing i18n Scaffold (read before implementing)
- `app/[lang]/layout.tsx` — Already has `generateStaticParams` returning `[{ lang: 'ua' }, { lang: 'en' }]` and `dynamicParams = false`. The `lang` param is already passed to `<html lang={lang}>`. This is the correct static pre-render entrypoint.
- `app/[lang]/page.tsx` — Currently does NOT load dictionaries or pass `dict` to sections. Phase 4 adds dictionary loading here and threads `dict` as props.
- `dictionaries/en.json` — Exists but empty (`{}`). Phase 4 fills it with the complete nested structure.
- `dictionaries/ua.json` — Exists but empty (`{}`). Phase 4 fills with Ukrainian translations.

### Existing Components to Modify
- `components/layout/Nav.tsx` — Receives the `LanguageSwitcher` component in its `controls` div, next to `ThemeToggle`. Nav also needs its hardcoded `NAV_LINKS` labels replaced with dictionary values (requires `dict` prop or hook).
- `components/layout/ThemeToggle.tsx` — Reference pattern for `LanguageSwitcher` component structure and styling conventions.
- `components/sections/*.tsx` — All section components receive a new `dict` prop alongside existing `data` prop. All hardcoded strings replaced with `dict.sectionName.key` lookups.

### Next.js Static Export Constraint
- Static export (`output: 'export'`) means `lib/getDictionary.ts` MUST use dynamic `import()` (not `fs.readFile`). Pattern: `const dict = await import(\`../dictionaries/${lang}.json\`)` — works at build time in Server Components.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/[lang]/layout.tsx` — `generateStaticParams` already returns `[{ lang: 'ua' }, { lang: 'en' }]`. Phase 4 reads `params.lang` in `page.tsx` and passes it to `getDictionary(lang)`.
- `components/layout/ThemeToggle.tsx` — Model `LanguageSwitcher` after this component's structure: `'use client'`, SCSS Module, minimal DOM, controlled state.
- `lib/SmoothScrollProvider` + `components/providers/Providers.tsx` — Already in layout; LanguageSwitcher inherits the scroll context and can read current section position.
- `styles/_tokens.scss` — `--color-accent` (crimson) used for the active locale underline. No new tokens needed.

### Established Patterns
- **`'use client'` boundary**: `LanguageSwitcher` has `localStorage` access and navigation — must be `'use client'`. `page.tsx` and `layout.tsx` remain Server Components.
- **SCSS Module pattern**: `LanguageSwitcher.module.scss` — same pattern as `ThemeToggle.module.scss`.
- **Content data flow**: `app/[lang]/page.tsx` loads `getDictionary(lang)`, then passes `dict` to each section: `<HeroSection data={player} dict={dict.hero} />`. Sections never call `getDictionary` themselves.
- **Server Component async params**: `page.tsx` uses `const { lang } = await params` (already established in `layout.tsx`).

### Integration Points
- `app/[lang]/page.tsx` — Add `getDictionary(lang)` call; thread `dict` prop to all 8 section components.
- `app/page.tsx` (root) — New file: client component with `useEffect` redirect logic (read localStorage, redirect to stored locale or `/ua/`).
- `components/layout/Nav.tsx` — Add `LanguageSwitcher` import + render in `controls` div and mobile menu. Also needs `dict` for nav link labels.
- `lib/getDictionary.ts` — New file: async loader using dynamic `import()`. Returns typed `Dictionary` (inferred from `en.json`).
- `components/layout/LanguageSwitcher.tsx` — New file: `'use client'` component; reads current path with `usePathname()`, writes to `localStorage`, navigates with `window.location.href`.

</code_context>

<specifics>
## Specific Ideas

- `getDictionary.ts` must use dynamic `import()` not `fs.readFile` — static export has no filesystem at runtime. Pattern: `const dict = (await import(\`../dictionaries/${lang}.json\`)).default`.
- Trophy dictionary array must stay in sync with `player.ts` trophies array by index — planner must include a note for content editors.
- The root `app/page.tsx` redirect: render nothing (or a blank `<div />`) during the `useEffect`, then redirect. No flash of content. Consider adding a minimal loading state or just rendering null.
- Language switcher section anchor tracking: the Nav already uses `window.scrollY` via an effect hook. The same effect can identify the current section by checking which section's top is closest to viewport top, enabling the `/${newLang}/#section-id` navigation.
- The fallback email in contact error messages (`dimakyh@ukr.net`) appears in both dictionary strings — keep it literal in both languages (email addresses don't translate).

</specifics>

<deferred>
## Deferred Ideas

- Hreflang meta tags (`<link rel="alternate" hreflang="ua" href="/ua/" />`) in `layout.tsx` for SEO — useful for Google but not in Phase 4 scope; deferred to a future SEO phase
- `Accept-Language` browser detection for first visit (server-side) — not possible with static export; would require a Cloudflare Worker or similar edge function in a future phase
- Ukrainian Cyrillic transliteration of player name in `ua.json` — currently the name is the same in both locales; deferred content decision

</deferred>

---

*Phase: 4-Bilingual Support & Polish*
*Context gathered: 2026-05-20*
