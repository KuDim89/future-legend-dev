# Phase 4: Bilingual Support & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 4-Bilingual Support & Polish
**Areas discussed:** Dictionary structure, Language switcher design, Root redirect behavior, Player content migration

---

## Dictionary Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Nested by section | `{ "nav": { "home": "Home" }, "hero": { "cta": "Contact" } }` — groups keys by section, TypeScript-friendly | ✓ |
| Flat with dot-notation keys | `{ "nav.home": "Home" }` — simpler but no nested TypeScript inference | |

**User's choice:** Nested by section

---

| Option | Description | Selected |
|--------|-------------|----------|
| Full sweep — every visible string | Nav, titles, CTAs, body text, form labels, errors, success messages, aria-labels | ✓ |
| UI strings only — skip body text | Nav, titles, CTAs only; leave body paragraphs English-only | |

**User's choice:** Full sweep — every visible string

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — translate form strings too | Contact form errors, success messages, button labels, placeholders in dictionaries | ✓ |
| No — keep form strings English only | Form UX strings stay hardcoded | |

**User's choice:** Yes — translate form strings too

---

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-inferred from en.json | `typeof import('../dictionaries/en.json')` — TypeScript catches missing keys automatically | ✓ |
| Manually declared Dictionary interface | Hand-written interface — requires manual sync | |

**User's choice:** Auto-inferred from en.json

---

## Language Switcher Design

| Option | Description | Selected |
|--------|-------------|----------|
| Inside Nav, next to ThemeToggle | All global controls in Nav controls row; also in mobile menu | ✓ |
| Sticky floating button | Fixed-corner button, separate from Nav | |
| Footer only | Language toggle in footer only | |

**User's choice:** Inside Nav, next to ThemeToggle

---

| Option | Description | Selected |
|--------|-------------|----------|
| Flag + code text: 🇺🇦 UA / 🇬🇧 EN | Flag emoji + locale code — scannable for international visitors | ✓ |
| Text only: UA / EN | Clean text toggle, no emojis | |
| You decide | Claude picks consistent with ThemeToggle | |

**User's choice:** Flag + code text: 🇺🇦 UA / 🇬🇧 EN

---

| Option | Description | Selected |
|--------|-------------|----------|
| Navigate to /${newLang}/ | Simple locale root navigation, page reloads | |
| Navigate to /${newLang}/ + section anchor | Switches locale AND preserves scroll position via hash anchor | ✓ |
| You decide | Claude picks simpler approach | |

**User's choice:** Navigate to /${newLang}/ + preserve section anchor

---

| Option | Description | Selected |
|--------|-------------|----------|
| Accent color + bold on active locale | Active locale in crimson + bold | |
| Underline on active locale | Active locale has bottom border in accent color | ✓ |
| You decide | Claude picks matching ThemeToggle style | |

**User's choice:** Underline on active locale

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — inside mobile menu | Switcher at bottom of mobile menu overlay | ✓ |
| No — desktop Nav only | Mobile visitors must edit URL manually | |

**User's choice:** Yes — inside mobile menu

---

## Root Redirect Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side redirect — check localStorage, then default /ua/ | app/page.tsx reads stored locale, defaults to /ua/ for first-time visitors | ✓ |
| Always redirect to /ua/ | app/page.tsx always redirects to /ua/ regardless of preference | |
| No root redirect — player shares locale-specific URL | Root shows nothing; player shares /ua/ or /en/ links directly | |

**User's choice:** Client-side redirect — check localStorage, then default /ua/

---

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage only | Key 'locale', values 'ua' or 'en' | ✓ |
| Both localStorage + cookie | Both mechanisms | |
| URL is the persistence (no storage) | No localStorage, root always redirects to /ua/ | |

**User's choice:** localStorage only

---

| Option | Description | Selected |
|--------|-------------|----------|
| When the user clicks the language switcher | Only saved on explicit user action | ✓ |
| On every page load (from the URL) | lang written to localStorage on every render | |

**User's choice:** When the user clicks the language switcher

---

## Player Content Migration

| Option | Description | Selected |
|--------|-------------|----------|
| Narrative text only — keep factual data in player.ts | Bio, position, club/team descriptions, attribute labels → dictionaries. Stats, dob, video IDs, photo paths stay in player.ts | ✓ |
| Everything translatable goes to dictionaries | Even position string, trophy names, club name all in dictionaries | |

**User's choice:** Narrative text only — keep factual data in player.ts

---

| Option | Description | Selected |
|--------|-------------|----------|
| Stay in player.ts — same in both languages | Name is a proper noun, identical in UA and EN | ✓ |
| In dictionaries too | Allows custom Cyrillic transliteration if ever needed | |

**User's choice:** Stay in player.ts — same in both languages

---

| Option | Description | Selected |
|--------|-------------|----------|
| In dictionaries under a trophies section | `{ "trophies": { "items": [ { "name": "...", "competition": "..." } ] } }` | ✓ |
| Stay in player.ts as locale-variant fields | player.ts gets `name_ua` / `name_en` fields | |
| You decide | Claude picks most consistent approach | |

**User's choice:** In dictionaries under a trophies section

---

## Claude's Discretion

- Section anchor detection strategy for language switcher (IntersectionObserver vs scroll read vs URL hash)
- Mobile menu DOM placement of the switcher
- `getDictionary.ts` implementation details (must use dynamic `import()` for static export compatibility)

## Deferred Ideas

- Hreflang meta tags for SEO — future SEO phase
- `Accept-Language` server-side detection — requires edge function, not possible with static export
- Ukrainian Cyrillic transliteration of player name in ua.json — deferred content decision
