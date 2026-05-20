# Phase 4: Bilingual Support & Polish - Research

**Researched:** 2026-05-20
**Domain:** Next.js 15 static export i18n, dictionary architecture, language switcher, root redirect
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** JSON shape is nested by section — e.g., `{ "nav": { "home": "Home" }, "hero": { "cta": "Contact" } }`. Groups keys by section, auditable, single TypeScript `Dictionary` type.
- **D-02:** Full sweep — every visible string goes in dictionaries: nav labels, section titles, body paragraphs, CTAs, form labels, placeholders, button text, error messages, success messages, aria-labels.
- **D-03:** Contact form strings fully translated: error message, success message, button labels, field placeholders, required/optional labels.
- **D-04:** TypeScript type auto-inferred from `en.json` — `lib/getDictionary.ts` uses `typeof import('../dictionaries/en.json')` as the `Dictionary` type. TypeScript catches missing keys in `ua.json` automatically.
- **D-05:** Switcher lives inside the Nav, next to ThemeToggle, in the `controls` row. Also rendered inside the mobile menu overlay (at bottom of the link list).
- **D-06:** Visual style: flag emoji + locale code — `🇺🇦 UA` and `🇬🇧 EN`. Both locales always visible; active one is underlined with `--color-accent`.
- **D-07:** Clicking a locale: saves preference to `localStorage` (key: `'locale'`), then navigates to `/${newLang}/${currentSectionAnchor}` — preserving scroll position as a hash anchor.
- **D-08:** Active locale indicator: bottom underline in `--color-accent` (crimson). Inactive locale is muted/dimmed.
- **D-09:** `app/page.tsx` does a client-side redirect using `useEffect`: reads `localStorage.getItem('locale')`. If stored → `window.location.replace('/${storedLocale}/')`. If not → `window.location.replace('/ua/')`. First-time visitors land on `/ua/`.
- **D-10:** Preference stored in `localStorage` only (key: `'locale'`, values: `'ua'` or `'en'`). No cookies.
- **D-11:** Preference written to `localStorage` only when the user clicks the language switcher. Page load does not overwrite.
- **D-12:** Narrative/translatable text moves to dictionaries; factual data stays in `player.ts`. Dictionaries get: bio text, position label, club name, club description, team description, attribute labels (Pace, Dribbling, Shooting, Passing, Physical, Defending).
- **D-13:** Player's actual name (`Dmytro Kovalenko`) stays in `player.ts` — proper noun, identical in both languages.
- **D-14:** Trophy names and competition names go in dictionaries under a `trophies` section — `{ "trophies": { "items": [ { "name": "...", "competition": "..." } ] } }`. The trophy array in dictionaries must match the trophy array length in `player.ts` — planner must enforce this constraint.

### Claude's Discretion

- Exact section anchor detection strategy for the language switcher (IntersectionObserver vs. scroll position read vs. URL hash).
- Mobile menu placement of the switcher within the existing mobile overlay DOM structure.
- Exact `getDictionary.ts` async loader implementation — must be compatible with `output: 'export'` static constraint.

### Deferred Ideas (OUT OF SCOPE)

- Hreflang meta tags for SEO — deferred to a future SEO phase.
- `Accept-Language` browser detection for first visit (server-side) — not possible with static export.
- Ukrainian Cyrillic transliteration of player name.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| I18N-01 | Site available in UA and EN at separate URL paths (`/ua/` and `/en/`) | `generateStaticParams` already returns both locales; page.tsx needs `getDictionary(lang)` wiring |
| I18N-02 | Visitor can switch between UA and EN via a language toggle; preference persists across browser sessions | `LanguageSwitcher` component with `localStorage` write + `window.location.replace` navigation |
| I18N-03 | All UI strings, section titles, CTA copy, and player bio text defined in locale dictionary files | Full string catalogue in Hardcoded Strings Inventory below; 8 components + Nav to update |
| I18N-04 | Both locale versions pre-rendered as static HTML at build time (zero runtime i18n overhead) | Already works — `generateStaticParams` drives SSG; dictionary loaded via `await import()` at build |

</phase_requirements>

---

## Summary

Phase 4 wires Ukrainian and English translations through every visible string in the site. The core i18n scaffold — `app/[lang]/layout.tsx` with `generateStaticParams` returning `[{ lang: 'ua' }, { lang: 'en' }]` and `dynamicParams = false` — is already in place and already produces two pre-rendered static HTML files (`out/ua/index.html`, `out/en/index.html`). The build currently succeeds with `next build` and both locale routes exist. Zero new npm packages are required for this phase.

The work has four distinct areas: (1) create `lib/getDictionary.ts` using dynamic `import()` and thread `dict` through `app/[lang]/page.tsx` to all 8 section components; (2) fill `dictionaries/en.json` and `dictionaries/ua.json` with nested section keys; (3) update all 8 section components and Nav to accept and use `dict` prop instead of hardcoded strings; (4) replace `app/page.tsx`'s broken server-side `redirect('/ua')` with a client-side `useEffect` redirect that reads `localStorage` for returning visitors.

**Primary recommendation:** Execute in three waves — (Wave 1) getDictionary + fill dictionaries + page.tsx wiring; (Wave 2) update all section components + Nav; (Wave 3) LanguageSwitcher component + root redirect fix + build verification.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Dictionary loading | Server Component (build time) | — | `getDictionary` runs at build via `await import()` — zero runtime cost |
| Locale pre-rendering | SSG / Static Export | — | `generateStaticParams` already handles; no new config needed |
| Language switcher UI | Browser / Client | — | Needs `localStorage` access + `usePathname()` — must be `'use client'` |
| Root redirect | Browser / Client | — | `window.location.replace` in `useEffect` — must be `'use client'` |
| Dictionary type system | Build-time TypeScript | — | `typeof import('../dictionaries/en.json')` enforces schema at compile time |
| String prop threading | Server Component | — | `page.tsx` passes `dict` slices to each section as props |

---

## Standard Stack

### Core (all already installed — no new installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.18 | `generateStaticParams` + dynamic `import()` for SSG | Already in use; the exact mechanism needed for static i18n |
| TypeScript | ^5 | `typeof import()` for auto-inferred `Dictionary` type | Already in use; `resolveJsonModule: true` already set in tsconfig |
| `next/navigation` | (Next.js built-in) | `usePathname()` in LanguageSwitcher | Works correctly with `output: 'export'` — verified |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion | ^12.39.0 | LanguageSwitcher hover/press animations | Active locale underline transition, button hover |
| next-themes | ^0.4.6 | Reference pattern only | ThemeToggle is the model component for LanguageSwitcher structure |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `await import()` for dictionaries | `fs.readFile` | `fs` is not available at runtime in static export — `import()` is the only viable approach |
| `typeof import('../dictionaries/en.json')` for Dictionary type | Manual interface | Manual interface requires double-maintenance; auto-inferred type catches `ua.json` gaps automatically |
| `window.location.replace` for redirect | `useRouter().push()` | `useRouter` in static export may not handle basePath correctly; `window.location` is explicit and reliable |
| `usePathname()` for locale detection in switcher | Parse `window.location.pathname` | `usePathname()` is the official Next.js hook and works correctly in `'use client'` components with static export |

**Installation:** No new packages required. All tools already installed.

---

## Package Legitimacy Audit

No new packages are being installed in this phase. All libraries used are existing project dependencies.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
next build
    │
    ├── app/[lang]/layout.tsx
    │   └── generateStaticParams() → [{ lang: 'ua' }, { lang: 'en' }]
    │
    ├── app/[lang]/page.tsx (Server Component, async)
    │   ├── const { lang } = await params
    │   ├── const dict = await getDictionary(lang)        ← NEW
    │   └── passes dict.sectionName to each section       ← NEW
    │        │
    │        ├── <Nav dict={dict.nav} />                  ← UPDATED
    │        ├── <HeroSection data={player} dict={dict.hero} />
    │        ├── <AboutSection data={player} dict={dict.about} />
    │        ├── <TrophiesSection trophies={...} dict={dict.trophies} />
    │        ├── <ClubSection club={...} dict={dict.club} />
    │        ├── <TeamSection team={...} dict={dict.team} />
    │        ├── <HighlightsSection videos={...} dict={dict.highlights} />
    │        ├── <GallerySection photos={...} dict={dict.gallery} />
    │        └── <ContactSection dict={dict.contact} />
    │
    ├── lib/getDictionary.ts (NEW)
    │   └── export async function getDictionary(lang: string): Promise<Dictionary>
    │       └── return (await import(`../dictionaries/${lang}.json`)).default
    │
    ├── dictionaries/en.json (FILL — currently `{}`)
    ├── dictionaries/ua.json (FILL — currently `{}`)
    │
    └── out/
        ├── index.html  (root — client redirect via useEffect)
        ├── ua/index.html  (Ukrainian — pre-rendered)
        └── en/index.html  (English — pre-rendered)

Runtime (browser)
    │
    ├── app/page.tsx ('use client', NEW implementation)
    │   └── useEffect: read localStorage('locale') → window.location.replace
    │
    └── components/layout/LanguageSwitcher.tsx (NEW)
        ├── 'use client'
        ├── usePathname() → extract lang segment
        ├── onClick: localStorage.setItem('locale', newLang)
        └── window.location.href = `/${newLang}/${currentSectionAnchor}`
```

### Recommended Project Structure

```
lib/
  getDictionary.ts      # NEW: async loader returning typed Dictionary
dictionaries/
  en.json               # FILL: complete nested English strings
  ua.json               # FILL: complete nested Ukrainian strings
components/
  layout/
    LanguageSwitcher.tsx         # NEW: 'use client' switcher
    LanguageSwitcher.module.scss # NEW: styles
    Nav.tsx                      # UPDATED: accepts dict prop + LanguageSwitcher
app/
  page.tsx              # REWRITE: 'use client' with useEffect redirect
  [lang]/
    page.tsx            # UPDATED: load dict, pass to sections
```

### Pattern 1: getDictionary async loader

**What:** Build-time dictionary loader using dynamic `import()`.
**When to use:** Called once in `app/[lang]/page.tsx` — runs at build time during `next build`, not at runtime.

```typescript
// lib/getDictionary.ts
// Source: CONTEXT.md D-04 + Next.js static export docs
import type enDict from '../dictionaries/en.json';

export type Dictionary = typeof enDict;

const dictionaries = {
  ua: () => import('../dictionaries/ua.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
};

export async function getDictionary(lang: string): Promise<Dictionary> {
  const loader = dictionaries[lang as keyof typeof dictionaries];
  if (!loader) return dictionaries.en();
  return loader();
}
```

**Why dynamic `import()` not `fs.readFile`:** With `output: 'export'`, Server Components run at build time. The filesystem is available at build time, but `fs.readFile` introduces a runtime dependency that breaks in the static export context. Dynamic `import()` is bundled at build time and works correctly. [VERIFIED: nextjs.org/docs/app/guides/static-exports]

### Pattern 2: page.tsx dictionary threading

**What:** Server Component async page loads dict and passes slices to sections.
**When to use:** `app/[lang]/page.tsx` — the single point of dictionary access.

```typescript
// app/[lang]/page.tsx
// Source: CONTEXT.md code_context + established layout.tsx pattern
export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Nav dict={dict.nav} />
      <main>
        <HeroSection data={player} dict={dict.hero} />
        <AboutSection data={player} dict={dict.about} />
        <TrophiesSection trophies={player.trophies} dict={dict.trophies} />
        <ClubSection club={player.club} dict={dict.club} />
        <TeamSection team={player.team} dict={dict.team} />
        <HighlightsSection videos={videos} dict={dict.highlights} />
        <GallerySection photos={gallery} dict={dict.gallery} />
        <ContactSection dict={dict.contact} />
      </main>
    </>
  );
}
```

### Pattern 3: LanguageSwitcher component

**What:** `'use client'` component that reads current locale, writes `localStorage`, navigates.
**When to use:** Rendered inside `Nav` in `controls` div and inside mobile menu.

```typescript
// components/layout/LanguageSwitcher.tsx
// Source: CONTEXT.md D-06, D-07, D-08
'use client';

import { usePathname } from 'next/navigation';
import styles from './LanguageSwitcher.module.scss';

const LOCALES = ['ua', 'en'] as const;
const FLAGS = { ua: '🇺🇦', en: '🇬🇧' } as const;
const BASE_PATH = '/future-legend-dev';

export function LanguageSwitcher() {
  const pathname = usePathname();
  // pathname will be e.g. "/future-legend-dev/ua" or "/future-legend-dev/en"
  const currentLang = LOCALES.find((l) => pathname.includes(`/${l}`)) ?? 'ua';

  function switchLocale(newLang: string) {
    localStorage.setItem('locale', newLang);
    // Preserve hash anchor (current section) if present
    const hash = window.location.hash;
    window.location.href = `${BASE_PATH}/${newLang}/${hash}`;
  }

  return (
    <div className={styles.switcher} role="group" aria-label="Language selector">
      {LOCALES.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={`${styles.btn} ${lang === currentLang ? styles.active : ''}`}
          aria-pressed={lang === currentLang}
          aria-label={`Switch to ${lang === 'ua' ? 'Ukrainian' : 'English'}`}
        >
          {FLAGS[lang]} {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

### Pattern 4: Root redirect (`app/page.tsx`)

**What:** Client-side localStorage-aware redirect for first-time and returning visitors.
**When to use:** Replaces the current broken `redirect('/ua')` server-side redirect.

```typescript
// app/page.tsx
'use client';

import { useEffect } from 'react';

const BASE_PATH = '/future-legend-dev';

export default function RootPage() {
  useEffect(() => {
    const stored = localStorage.getItem('locale');
    const target = stored === 'en' ? 'en' : 'ua';
    window.location.replace(`${BASE_PATH}/${target}/`);
  }, []);

  return null; // No flash — renders nothing, redirects immediately
}
```

**Why not `redirect()` from next/navigation:** The existing `redirect('/ua')` emits `NEXT_REDIRECT;replace;/ua;307` as a client-side script in the generated HTML, which redirects to `/ua` — missing the `/future-legend-dev` basePath prefix. This would fail on GitHub Pages where the site lives at `/future-legend-dev/`. The `useEffect` + `window.location.replace` pattern with the explicit basePath is the correct fix. [VERIFIED: inspected out/index.html — confirmed redirect target is `/ua` not `/future-legend-dev/ua`]

### Anti-Patterns to Avoid

- **Calling `getDictionary` inside a section component:** Sections must never import dictionaries directly. Only `page.tsx` calls `getDictionary` and passes `dict` slices as props. (CLAUDE.md content data flow rule)
- **Using `fs.readFile` in getDictionary:** Not available at runtime in static export. Dynamic `import()` only.
- **Importing `dictionaries/en.json` in multiple files for type:** Import the type once in `lib/getDictionary.ts`, export `Dictionary` type from there. Sections import the type from `getDictionary.ts`, not from the JSON file directly.
- **Writing `localStorage` on page load:** Per D-11, `localStorage` is only written when the user clicks the switcher. The root `page.tsx` `useEffect` only reads it.
- **Animating LanguageSwitcher with GSAP:** Framer Motion owns mount/unmount and hover (ThemeToggle pattern). Never GSAP.
- **Using `next/link` for locale switching:** Navigation between locales uses `window.location.href` (full reload) — not client-side navigation — so the Server Component page.tsx re-runs with the new `lang` and fetches the correct dictionary.

---

## Hardcoded Strings Inventory

This is the complete catalogue of every hardcoded string that must move to dictionaries. The planner uses this to enumerate tasks per component.

### Nav.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Home'` | NAV_LINKS label | `nav.home` |
| `'About'` | NAV_LINKS label | `nav.about` |
| `'Highlights'` | NAV_LINKS label | `nav.highlights` |
| `'Gallery'` | NAV_LINKS label | `nav.gallery` |
| `'Trophies'` | NAV_LINKS label | `nav.trophies` |
| `'Club'` | NAV_LINKS label | `nav.club` |
| `'Team'` | NAV_LINKS label | `nav.team` |
| `'Contact'` | NAV_LINKS label | `nav.contact` |
| `'Future Legend'` | brand link text | `nav.brand` |
| `'Toggle navigation menu'` | hamburger aria-label | `nav.menuAriaLabel` |

**Nav implementation note:** `NAV_LINKS` is a module-scope constant — it must become a function that receives `dict.nav` and returns the array, or be defined inline in the render using `dict.nav`. The `href` values (`#home`, `#about`, etc.) are anchor IDs, not translatable — they stay hardcoded.

### HeroSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Contact Me'` | CTA button text | `hero.cta` |
| `` `Contact ${data.fullName}` `` | CTA aria-label | `hero.ctaAriaLabel` (template, or computed with fullName from player.ts) |

**Note:** `data.fullName` and `data.position` are from `player.ts` (D-13 — name stays in player.ts, position per D-12 also goes to dict). Per D-12, position label goes in dictionaries. The actual position string (`'Central Midfielder'`) should move to `hero.position` (or `about.position`). The `data.position` field in `player.ts` becomes a fallback/code value; the dictionary provides the display string.

**Decision point for planner:** Per D-12, `position` is a translatable string. The display text `'Central Midfielder'` must move to the dictionary (e.g., `hero.position`). The `player.ts` `position` field should either be kept as a code value (for non-display use) or removed and sourced only from the dictionary.

### AboutSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'About'` | section `<h2>` | `about.title` |
| `'Name'` | bio grid `<dt>` | `about.labelName` |
| `'Position'` | bio grid `<dt>` | `about.labelPosition` |
| `'Working Foot'` | bio grid `<dt>` | `about.labelWorkingFoot` |
| `'Date of Birth'` | bio grid `<dt>` | `about.labelDob` |
| `'Pace'` | stat label | `about.statPace` |
| `'Dribbling'` | stat label | `about.statDribbling` |
| `'Shooting'` | stat label | `about.statShooting` |
| `'Passing'` | stat label | `about.statPassing` |
| `'Physical'` | stat label | `about.statPhysical` |
| `'Defending'` | stat label | `about.statDefending` |
| `` `${label}: ${value} out of 100` `` | aria-label (stat row) | computed: `about.statAriaLabel` template OR inline |
| `data.bio` (English prose) | bio paragraph | `about.bio` |
| `data.workingFoot` (`'Right'`) | bio grid value | `about.workingFootRight` / `about.workingFootLeft` / `about.workingFootBoth` |

**Implementation note for stats:** The `stats` array is currently built inline from hardcoded labels. It must be rebuilt using dictionary strings. Recommended: keep the `stats` array structure but replace label strings with `dict.about.stat*` keys.

### TrophiesSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Trophies'` | section `<h2>` | `trophies.title` |
| `trophy.name` (e.g., `'Youth League Champion'`) | trophy card | `trophies.items[i].name` |
| `trophy.competition` (e.g., `'UPL Youth League U18'`) | trophy card | `trophies.items[i].competition` |

**D-14 enforcement:** The `trophies.items` array in dictionaries must have exactly 3 entries (matching `player.ts` trophies array length). `trophy.year` stays in `player.ts` (numeric fact, not translatable).

**Planner constraint:** Trophies are rendered by mapping `player.trophies` — each trophy needs its `name` and `competition` from `dict.trophies.items[index]` while `year` comes from `player.trophies[index].year`. The component must zip the two arrays by index.

### ClubSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Club'` | section `<h2>` | `club.title` |
| `` `${club.name} crest` `` | img alt text | computed with `dict.club.name` |
| `'Club crest'` | placeholder caption | `club.crestPlaceholder` |
| `club.name` (data field, per D-12) | club name display | `club.name` |
| `club.description` (data field, per D-12) | club description | `club.description` |

**Per D-12:** `club.name` and `club.description` move from `player.ts` to dictionaries. The `Club` interface in `player.ts` should have `name` and `description` removed (or retained as empty/code values). Alternatively, `player.ts` keeps the English text as a code fallback and dictionaries override it. **Recommendation:** Remove `name` and `description` from `player.ts`'s `Club` and `Team` interfaces since they are translatable — source them from the dictionary only.

### TeamSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Team'` | section `<h2>` | `team.title` |
| `` `${team.name} crest` `` | img alt text | computed with `dict.team.name` |
| `'Team crest'` | placeholder caption | `team.crestPlaceholder` |
| `team.name` (data field, per D-12) | team name display | `team.name` |
| `team.description` (data field, per D-12) | team description | `team.description` |

### HighlightsSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Highlights'` | section `<h2>` | `highlights.title` |
| `'Watch training sessions and match clips from the pitch.'` | intro paragraph | `highlights.intro` |

**Note:** `video.title` is in `content/videos.ts` — these are proper content data fields (video titles), not UI strings. They do not need to move to dictionaries for Phase 4 (they are data, not UI copy). This is consistent with D-12 logic.

### GallerySection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Gallery'` | section `<h2>` | `gallery.title` |
| `'Behind the scenes on the pitch and in training.'` | intro paragraph | `gallery.intro` |
| `'No photos yet.'` | empty state | `gallery.empty` |
| `` `Open ${photo.alt} in fullscreen` `` | button aria-label | computed: `gallery.openPhotoAriaLabel` template |

**Note:** `photo.alt` values are in `content/gallery.ts` — these are image alt text (content data), not UI strings. They should remain in `gallery.ts` as content data.

### ContactSection.tsx

| String | Location | Key path |
|--------|----------|----------|
| `'Contact'` | section `<h2>` | `contact.title` |
| `'Get in touch — whether you are a scout, coach, or club representative.'` | intro paragraph | `contact.intro` |
| `'Message Sent'` | success heading | `contact.successHeading` |
| `"Your message has been sent. We'll be in touch soon."` | success body | `contact.successBody` |
| `'Name'` | name field label | `contact.labelName` |
| `'Your full name'` | name placeholder | `contact.placeholderName` |
| `'Name must be at least 3 characters'` | name validation error | `contact.errorNameMinLength` |
| `'Phone (optional)'` | phone field label | `contact.labelPhone` |
| `'+380 XX XXX XXXX'` | phone placeholder | `contact.placeholderPhone` |
| `'Message'` | message field label | `contact.labelMessage` |
| `'Tell us what you have in mind...'` | message placeholder | `contact.placeholderMessage` |
| `'Send Message'` | submit button (idle) | `contact.btnSend` |
| `'Sending...'` | submit button (loading) | `contact.btnSending` |
| `'Sending...'` | spinner aria-label | `contact.spinnerAriaLabel` |
| `'Something went wrong. Please try again or email us directly at dimakyh@ukr.net'` | error message | `contact.errorSubmit` (email literal stays in both languages) |
| `'Website'` | honeypot label (hidden) | stays hardcoded — hidden from users, no value in translating |

**Implementation note:** The `nameError` state in `ContactSection` is currently a hardcoded string set imperatively (`setNameError('Name must be at least 3 characters')`). With the `dict` prop, this must become `setNameError(dict.contact.errorNameMinLength)`. The `dict` prop must be available in the component's closure when the validation fires.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dictionary type safety | Manual TypeScript interface | `typeof import('../dictionaries/en.json')` | Auto-catches missing keys in ua.json at compile time; no maintenance |
| Build-time locale pre-rendering | Custom static generation | `generateStaticParams` (already in place) | Next.js handles it; already works |
| Locale detection at runtime | Custom header parsing / cookie reading | `usePathname()` from next/navigation | Works with static export; returns the correct path segment |
| Theme persistence | Custom storage logic | `next-themes` `storageKey` (already in use) | Pattern established; locale uses same localStorage approach |

**Key insight:** The entire i18n runtime cost is zero — dictionaries are bundled into the per-locale static HTML at build time. There is no i18n library, no middleware, no runtime lookup. The "library" is a 10-line `getDictionary.ts` file.

---

## Common Pitfalls

### Pitfall 1: basePath missing from root redirect

**What goes wrong:** `window.location.replace('/ua/')` instead of `window.location.replace('/future-legend-dev/ua/')` — on GitHub Pages, this navigates to `github.io/ua/` (the root of the domain), not the site.
**Why it happens:** The server-side `redirect('/ua')` currently in `app/page.tsx` produces the same bug — confirmed by inspecting `out/index.html` which embeds `NEXT_REDIRECT;replace;/ua;307` without basePath. This is a live bug.
**How to avoid:** Hardcode `const BASE_PATH = '/future-legend-dev'` in `app/page.tsx` and `LanguageSwitcher.tsx`. Or read it from `next.config.ts` basePath (not directly importable, but can be duplicated as a constant).
**Warning signs:** After redirecting, browser URL shows `github.io/ua/` instead of `github.io/future-legend-dev/ua/`.

### Pitfall 2: `ua.json` missing keys — TypeScript silent at runtime

**What goes wrong:** `dict.contact.errorSubmit` returns `undefined` at runtime if the key exists in `en.json` but not in `ua.json`. The page renders blank or `[object Object]` in that string slot.
**Why it happens:** TypeScript catches this only if `ua.json` is typed as `Dictionary` (same type inferred from `en.json`). If `getDictionary.ts` returns `Promise<Dictionary>` but `ua.json` is loaded without that type assertion, gaps are silent.
**How to avoid:** In `getDictionary.ts`, the loader for both locales must return `Promise<Dictionary>`. TypeScript will then flag any key missing from `ua.json` as a type error during build. Run `npx tsc --noEmit` as a build gate.
**Warning signs:** `npx next build` succeeds but strings render as `undefined` in Ukrainian — check tsconfig `strict: true` is active.

### Pitfall 3: Trophy array index mismatch (D-14)

**What goes wrong:** `dict.trophies.items[i].name` is `undefined` because `player.ts` has 3 trophies but `ua.json` trophies.items has 2 entries.
**Why it happens:** The trophy names are split across two files — `player.ts` (years + length of record) and dictionaries (names + competitions). They must stay in sync by index.
**How to avoid:** Planner must include a note in the TrophiesSection task: "Verify `dict.trophies.items.length === player.trophies.length` or add a defensive check." The `en.json` and `ua.json` must each have exactly 3 items.
**Warning signs:** One or more trophy cards render with empty name or competition.

### Pitfall 4: `player.ts` interface becomes invalid after D-12 migration

**What goes wrong:** After moving `Club.name`, `Club.description`, `Team.name`, `Team.description`, `Player.bio`, `Player.position` to dictionaries, the `player.ts` interfaces still declare these fields. If the fields are removed from the data object but kept in the interface (or vice versa), TypeScript will error. If they are kept in both, there is duplication.
**Why it happens:** D-12 creates a split — factual data stays in `player.ts`, narrative text moves to dictionaries. The migration must update both the interface and the data object consistently.
**How to avoid:** The planner must decide the exact fate of each migrated field:
  - **Option A (recommended):** Remove the field from `Player` / `Club` / `Team` interfaces and from the data object. Source only from dictionary.
  - **Option B:** Mark the field as optional (`bio?: string`) in the interface and leave the English text as a code comment for reference.
  - This is a planner decision — document explicitly in plan so the executor doesn't guess.

### Pitfall 5: `usePathname()` hydration mismatch warning

**What goes wrong:** On initial render, `usePathname()` returns the prerendered pathname (e.g., `/future-legend-dev/ua`), but before mount the component renders with SSR HTML. If the LanguageSwitcher renders the active locale indicator based on pathname synchronously, there could be a hydration mismatch.
**Why it happens:** The docs note: "If your page is being statically prerendered... reading the pathname with `usePathname()` can result in hydration mismatch errors." [CITED: nextjs.org/docs/app/api-reference/functions/use-pathname]
**How to avoid:** Follow the ThemeToggle pattern: add a `mounted` state, return `null` until mounted. This ensures the active indicator only renders after hydration.

### Pitfall 6: `setNameError` with dict not accessible in validation functions

**What goes wrong:** The `handleNameBlur` and `handleSubmit` functions in `ContactSection` call `setNameError('Name must be at least 3 characters')` — a hardcoded string. After the dict prop is added, these functions must reference `dict.contact.errorNameMinLength` instead.
**Why it happens:** The dict prop is in scope (component closure), but the imperative mutation functions don't automatically update. Easy to overlook when doing a search-and-replace pass.
**How to avoid:** Update all `setNameError(...)` call sites in `ContactSection`, not just the JSX render.

---

## Code Examples

### getDictionary.ts — complete implementation

```typescript
// lib/getDictionary.ts
// Source: CONTEXT.md D-04, Next.js static export docs
import type enDict from '../dictionaries/en.json';

export type Dictionary = typeof enDict;

const dictionaries = {
  ua: () => import('../dictionaries/ua.json').then((m) => m.default as Dictionary),
  en: () => import('../dictionaries/en.json').then((m) => m.default as Dictionary),
};

export async function getDictionary(lang: string): Promise<Dictionary> {
  const loader = dictionaries[lang as keyof typeof dictionaries];
  return loader ? loader() : dictionaries.en();
}
```

### en.json — complete nested structure (template)

```json
{
  "nav": {
    "brand": "Future Legend",
    "home": "Home",
    "about": "About",
    "highlights": "Highlights",
    "gallery": "Gallery",
    "trophies": "Trophies",
    "club": "Club",
    "team": "Team",
    "contact": "Contact",
    "menuAriaLabel": "Toggle navigation menu"
  },
  "hero": {
    "position": "Central Midfielder",
    "cta": "Contact Me",
    "ctaAriaLabel": "Contact Dmytro Kovalenko"
  },
  "about": {
    "title": "About",
    "labelName": "Name",
    "labelPosition": "Position",
    "labelWorkingFoot": "Working Foot",
    "labelDob": "Date of Birth",
    "workingFootRight": "Right",
    "workingFootLeft": "Left",
    "workingFootBoth": "Both",
    "bio": "A technically gifted midfielder who reads the game two moves ahead...",
    "statPace": "Pace",
    "statDribbling": "Dribbling",
    "statShooting": "Shooting",
    "statPassing": "Passing",
    "statPhysical": "Physical",
    "statDefending": "Defending"
  },
  "trophies": {
    "title": "Trophies",
    "items": [
      { "name": "Youth League Champion", "competition": "UPL Youth League U18" },
      { "name": "Cup Winner", "competition": "Kyiv Regional Youth Cup" },
      { "name": "Tournament MVP", "competition": "Dana Cup Denmark" }
    ]
  },
  "club": {
    "title": "Club",
    "name": "Dynamo Kyiv U21",
    "description": "One of Ukraine's most storied clubs...",
    "crestPlaceholder": "Club crest"
  },
  "team": {
    "title": "Team",
    "name": "Ukraine U18 National Team",
    "description": "Representing the national colours at youth level...",
    "crestPlaceholder": "Team crest"
  },
  "highlights": {
    "title": "Highlights",
    "intro": "Watch training sessions and match clips from the pitch."
  },
  "gallery": {
    "title": "Gallery",
    "intro": "Behind the scenes on the pitch and in training.",
    "empty": "No photos yet.",
    "openPhotoAriaLabel": "Open photo in fullscreen"
  },
  "contact": {
    "title": "Contact",
    "intro": "Get in touch — whether you are a scout, coach, or club representative.",
    "successHeading": "Message Sent",
    "successBody": "Your message has been sent. We'll be in touch soon.",
    "labelName": "Name",
    "placeholderName": "Your full name",
    "errorNameMinLength": "Name must be at least 3 characters",
    "labelPhone": "Phone (optional)",
    "placeholderPhone": "+380 XX XXX XXXX",
    "labelMessage": "Message",
    "placeholderMessage": "Tell us what you have in mind...",
    "btnSend": "Send Message",
    "btnSending": "Sending...",
    "spinnerAriaLabel": "Sending...",
    "errorSubmit": "Something went wrong. Please try again or email us directly at dimakyh@ukr.net"
  }
}
```

### Section component prop pattern

```typescript
// Example: HeroSection — shows dict prop addition
// Sections import Dictionary type from getDictionary, not from en.json
import type { Dictionary } from '@/lib/getDictionary';

interface Props {
  data: Player;
  dict: Dictionary['hero'];  // ← narrowed slice, not the full Dictionary
}

export function HeroSection({ data, dict }: Props) {
  return (
    <motion.a
      href="#contact"
      aria-label={dict.ctaAriaLabel}
      className={styles.heroCta}
    >
      {dict.cta}
    </motion.a>
  );
}
```

### Section anchor detection for LanguageSwitcher (Claude's discretion)

**Recommendation: scroll position read approach** — simplest, zero overhead, consistent with the existing Nav scroll hook.

The Nav already tracks `window.scrollY` via `useEffect`. The LanguageSwitcher can use `window.location.hash` at the moment of click (captures whatever anchor the Nav or URL currently shows), or default to no hash and let the destination page load at the top.

**Recommended implementation:** On locale switch, navigate to `/${newLang}/` + `window.location.hash` (the current URL hash). If the page has no hash, the destination loads at the top. This is the simplest correct approach — it does not require IntersectionObserver wiring.

```typescript
function switchLocale(newLang: string) {
  localStorage.setItem('locale', newLang);
  const hash = window.location.hash; // e.g., '#contact' or ''
  window.location.href = `${BASE_PATH}/${newLang}/${hash}`;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params` as sync prop in page | `params` as `Promise<{ lang: string }>` — must `await` | Next.js 15 (v15.0.0) | `const { lang } = await params` — confirmed pattern in existing `layout.tsx` |
| `next export` command | `output: 'export'` in `next.config.ts` | Next.js 14 | Already using correct pattern |
| next-i18next / next-intl | Custom `app/[lang]/` + `getDictionary` | App Router era | Lighter, static-export-compatible; no middleware |

**Deprecated/outdated:**
- `next export` CLI command: Removed in Next.js 14. Already using `output: 'export'`.
- Synchronous `params` access in page: Deprecated in Next.js 15. Already using async pattern in `layout.tsx`.

---

## Open Questions

1. **`player.ts` interface after D-12 migration — Option A vs B**
   - What we know: `bio`, `position`, `club.name`, `club.description`, `team.name`, `team.description` all move to dictionaries per D-12.
   - What's unclear: Should these fields be **removed** from `Player`/`Club`/`Team` interfaces and data objects (Option A), or kept as optional fields (Option B)?
   - Recommendation: Option A (remove) — cleaner, no duplication. Planner must specify this in the migration task for `player.ts`. Sections that currently read `data.bio`, `data.position`, etc. will error at compile time if the fields are removed — those errors guide the migration.

2. **Gallery and video `alt`/`title` — are they translatable content data?**
   - What we know: `photo.alt` in `content/gallery.ts` and `video.title` in `content/videos.ts` are currently English-only strings.
   - What's unclear: D-02 says "every visible string" — `alt` text and video titles are visible to screen readers and in UI.
   - Recommendation: These are **content data**, not UI strings. A Ukrainian `gallery.ts` would require duplicate content files or merging alt text into dictionaries. Per D-12 logic (data stays in `content/*.ts`), these should stay in `content/` files and are out of Phase 4 scope. The planner should confirm this scope boundary.

3. **`ctaAriaLabel` in HeroSection — hardcode name or use template?**
   - What we know: Currently `aria-label={`Contact ${data.fullName}`}`. Per D-13, `fullName` stays in `player.ts`.
   - What's unclear: The dictionary key `ctaAriaLabel` could be `"Contact Dmytro Kovalenko"` (hardcoded in dict) or a template `"Contact {name}"`.
   - Recommendation: Hardcode `"Contact Dmytro Kovalenko"` in both `en.json` and `ua.json`. Template strings in JSON add complexity for no gain here — the player name is fixed and identical in both languages (D-13).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | next build | Yes | v22.14.0 | — |
| Next.js | All i18n | Yes | 15.5.18 | — |
| TypeScript | Dictionary type inference | Yes | ^5 | — |
| `resolveJsonModule` | `typeof import('../dictionaries/en.json')` | Yes | Set in tsconfig.json line 12 | — |

**Missing dependencies with no fallback:** None.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `video.title` and `photo.alt` are content data, not UI strings — excluded from Phase 4 dictionary sweep | Open Questions #2 | Some visible strings remain English-only in Ukrainian locale; low impact |
| A2 | Hardcoding `BASE_PATH = '/future-legend-dev'` in `LanguageSwitcher` and `app/page.tsx` is acceptable — no config import pattern exists | Architecture Patterns | If repo is renamed, constant must be updated in 2 places |

---

## Security Domain

`security_enforcement` is not explicitly set to `false` in `.planning/config.json`. However, this phase has no new authentication, no new API calls, no new form endpoints, no new data storage, and no new secrets. The existing contact form (Phase 3) is unchanged. The only new storage is `localStorage` for locale preference — this is non-sensitive UI state.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No authentication in this phase |
| V3 Session Management | No | localStorage locale key is non-sensitive UI preference |
| V4 Access Control | No | All content is public |
| V5 Input Validation | No | No new user input fields |
| V6 Cryptography | No | No cryptographic operations |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| localStorage locale value injection | Tampering | Validate stored value: `const target = stored === 'en' ? 'en' : 'ua'` — whitelist, never use raw stored value in navigation |

---

## Sources

### Primary (HIGH confidence)
- [nextjs.org/docs/app/guides/static-exports](https://nextjs.org/docs/app/guides/static-exports) — Confirmed `await import()` pattern, `useEffect` for browser APIs, Client Component constraints
- [nextjs.org/docs/app/api-reference/functions/use-pathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) — Confirmed `usePathname()` works in `'use client'` with static export; hydration mismatch warning and mitigation
- `out/index.html` (inspected build output) — Confirmed existing `redirect('/ua')` emits path WITHOUT basePath → live bug
- `tsconfig.json` (local file) — Confirmed `resolveJsonModule: true` already set → `typeof import()` works
- `app/[lang]/layout.tsx` (local file) — Confirmed `const { lang } = await params` pattern is already established
- `app/[lang]/page.tsx` (local file) — Confirmed no `getDictionary` call exists yet; all section components accept no `dict` prop
- All 8 section components (local files) — Complete hardcoded string inventory derived from direct file reads

### Secondary (MEDIUM confidence)
- [nextjs.org dynamic-routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) + [iifx.dev Next.js 15 params](https://iifx.dev/en/articles/457106750/upgrading-to-next-js-15-await-your-params-fixing-dynamic-route-access) — Next.js 15 async params pattern confirmed (matches existing codebase)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new packages; all tools verified in codebase
- Architecture: HIGH — pattern verified against actual Next.js 15.5.18 build output
- Hardcoded strings inventory: HIGH — derived from direct source code reads, not assumptions
- Pitfalls: HIGH — basePath bug verified by inspecting `out/index.html`
- Ukrainian translations: ASSUMED — content not verified (planner/executor must supply Ukrainian text)

**Research date:** 2026-05-20
**Valid until:** 2026-07-20 (Next.js static export i18n pattern is stable; re-verify if upgrading Next.js major version)
