# Phase 5: Player Identity - Research

**Researched:** 2026-05-20
**Domain:** Content swap — TypeScript data files, JSON locale dictionaries, page metadata, video placeholder component variant
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** `fullName` → `"Artem Kukharuk"`
- **D-02:** `dateOfBirth` → `"2017-01-23"`
- **D-03:** `workingFoot` → `"Right"` (no change)
- **D-04:** `nationality` → `"Ukrainian"` (no change)
- **D-05:** Stats adjusted to defender profile, moderate/realistic range (60–78). Higher `defending` and `pace`; lower `shooting` and `dribbling`. Claude picks specific values.
- **D-06:** Trophies → single entry `{ year: 2026 }`. Competition: Starballs CUP (2016 birth year category).
- **D-07:** No real YouTube highlight IDs available yet.
- **D-08:** Keep Highlights section visible — render 3 disabled "coming soon" cards.
- **D-09:** Disabled card text: `"Highlights coming soon"` — add translation key to both dictionaries.
- **D-10:** Disabled cards are visually muted/greyed with a placeholder icon. Not clickable.
- **D-11:** `VideoEntry` interface gains `isPlaceholder?: boolean`. All 3 entries set to `isPlaceholder: true`.
- **D-12:** `hero.position` → `"Defender"` (EN) / `"Захисник"` (UA)
- **D-13:** `hero.ctaAriaLabel` → `"Contact Artem Kukharuk"` (EN) / `"Зв'язатися з Артемом Кухаруком"` (UA)
- **D-14:** `about.bio` → rewritten by Claude. Audience: scouts/coaches. Current defensive qualities + future potential. ~3 sentences.
- **D-15:** `trophies.items` → single entry: `{ name: "Starballs CUP Participant", competition: "Starballs CUP — 2016 Birth Year Category" }` (EN) + Ukrainian equivalent.
- **D-16:** `club.name` → `"Viva Cup"`. `club.description` → Claude describes Viva Cup as youth football club/competition.
- **D-17:** `team` section — update to clean placeholder (not "Ukraine U18 National Team"). Exact wording: planner/executor discretion.
- **D-18:** `contact.errorSubmit` — remove hardcoded `dimakyh@ukr.net` email. Replace with generic fallback text only.
- **D-19:** Replace all `"Dmytro"` refs with `"Artem"` in gallery alt text. Replace `"Dynamo Kyiv U21"` with `"Viva Cup"`. Replace `"Ukraine U18 National Team"` with `"Viva Cup"`.
- **D-20:** Update page `title` and `description` in `app/[lang]/layout.tsx` to reference Artem Kukharuk, Defender, Viva Cup.
- **D-21:** Bio in both EN and UA written by Claude during execution.

### Claude's Discretion
- Specific stat values within 60–78 range, defender profile
- Exact bio wording EN and UA
- Exact `club.description` text for Viva Cup
- Exact `team` section placeholder wording
- Exact disabled video card component visual treatment (greyed/muted, consistent with existing VideoCard design)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| IDENT-01 | User sees Artem Kukharuk's real name, position (Defender), club (Viva Cup), and age (9) on every section | All identity-bearing files inventoried below — player.ts, both dictionaries, gallery.ts, layout.tsx |
| IDENT-02 | User reads an accurate bio for Artem in both Ukrainian and English | `about.bio` key confirmed in both `en.json` and `ua.json`; bio rewrite follows D-14/D-21 |
| VIDEO-01 | YouTube video slots show real highlight IDs, or clearly documented placeholder messaging visible only in edit mode | `isPlaceholder` flag pattern documented below; HighlightsSection + VideoCard integration path confirmed |
</phase_requirements>

---

## Summary

Phase 5 is a pure content swap with one focused component extension. All six target files have been read and inventoried. There are no structural surprises — every key the decisions reference exists at the exact path expected, and the only new code needed is a disabled/placeholder visual variant in VideoCard plus a single new dictionary key (`highlights.comingSoon`) in both locale files.

The content flow is: `content/player.ts` + `content/videos.ts` → `app/[lang]/page.tsx` → section components receiving typed `data` props and `dict` slices. Dictionaries are typed via `getDictionary.ts` which infers `Dictionary` from `en.json` as the source of truth. Adding a new key to `en.json` automatically extends the `Dictionary` type; the same key must appear in `ua.json` or TypeScript will not complain (it casts `ua.json` as `Dictionary`), but at runtime the UA locale will be missing the string — so both files must be updated together.

**Primary recommendation:** Execute as two sequential plans — 05-01 (player.ts + dictionaries + gallery.ts + layout.tsx) and 05-02 (VideoEntry interface + VideoCard placeholder variant + HighlightsSection conditional render). Plan 05-01 has zero TypeScript risk; Plan 05-02 has one interface change that TypeScript will surface immediately at build time.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Player identity data (name, DOB, stats, foot) | Content file (`content/player.ts`) | — | Non-translatable typed data; no dict involvement per D-12 decision |
| Translatable identity strings (position, bio, club name, etc.) | Dictionary files (`dictionaries/*.json`) | — | D-12 Option A — all translatable strings live exclusively in dictionaries |
| Page metadata (title, description) | `app/[lang]/layout.tsx` | — | Next.js `metadata` export; static, not locale-aware in this implementation |
| Video placeholder behavior | `content/videos.ts` (flag) + `components/ui/VideoCard.tsx` (render) | `components/sections/HighlightsSection.tsx` (conditional pass) | Data-driven: flag in content layer, rendering in UI component |
| Gallery alt text | `content/gallery.ts` | — | Alt text is in content file directly (not translatable); this is established pattern |

---

## Standard Stack

No new packages are installed in this phase. All work uses existing dependencies already in the project.

| Technology | Version (installed) | Role in this phase |
|------------|--------------------|--------------------|
| TypeScript | existing | Interface extension (`VideoEntry.isPlaceholder?`) |
| SCSS Modules | existing | New `.placeholder` styles in `VideoCard.module.scss` |
| Framer Motion | existing | Optional: animate placeholder card in if desired (consistent with existing enter animations) |
| lucide-react | existing | `Clock` or `Film` icon for placeholder card visual (already used: `Play` icon in VideoCard) |

### Package Legitimacy Audit

No new packages installed in this phase. Audit not applicable.

---

## Architecture Patterns

### System Architecture Diagram

```
content/player.ts          →  app/[lang]/page.tsx  →  AboutSection, HeroSection,
  [typed data: DOB, stats]                             TrophiesSection, ClubSection, TeamSection

content/videos.ts          →  app/[lang]/page.tsx  →  HighlightsSection
  [VideoEntry[] + isPlaceholder flag]                    └── VideoCard (normal or placeholder variant)

content/gallery.ts         →  app/[lang]/page.tsx  →  GallerySection
  [GalleryEntry[] with alt text]

dictionaries/en.json       →  getDictionary(lang)  →  all section dict props
dictionaries/ua.json              ↑ typed as Dictionary = typeof en.json

app/[lang]/layout.tsx      →  Next.js metadata export  →  page <title> + <meta description>
```

### Recommended File Edit Order

```
1. content/player.ts          — name, DOB, stats, trophies (no type changes)
2. dictionaries/en.json       — all keyed strings + new highlights.comingSoon
3. dictionaries/ua.json       — same keys in Ukrainian (must match en.json structure)
4. content/gallery.ts         — alt text string replacements
5. app/[lang]/layout.tsx      — metadata title + description
6. content/videos.ts          — add isPlaceholder?: boolean to VideoEntry interface; flag all 3 entries
7. components/ui/VideoCard.tsx — accept isPlaceholder, render disabled variant
8. VideoCard.module.scss      — .placeholderSlot styles
9. components/sections/HighlightsSection.tsx — no prop changes needed (passes video object through)
```

Steps 1–5 are purely value replacements with zero TypeScript risk. Steps 6–9 involve a small interface extension that TypeScript will validate immediately on build.

### Pattern: isPlaceholder Flag in VideoCard

The existing `VideoCard` receives `video: VideoEntry`. After the interface extension, it checks `video.isPlaceholder` and renders either the existing play-button thumbnail path, or a new static placeholder slot.

The placeholder slot pattern should follow the existing `thumbnailSlot` structure (same `aspect-ratio: 16/9`, same `.card` wrapper) but replace the interactive button with a non-interactive `div`. This preserves grid layout identity so no layout shift occurs when real videos arrive.

**Disabled card render path (pseudocode for executor):**
```tsx
// In VideoCard.tsx — after interface extension
if (video.isPlaceholder) {
  return (
    <article className={styles.card}>
      <div className={styles.thumbnailSlot}>
        <div className={styles.placeholderSlot} aria-hidden="true">
          {/* icon + "coming soon" label */}
        </div>
      </div>
      <p className={styles.cardTitle}>{comingSoonLabel}</p>
    </article>
  );
}
// ... existing play/iframe path unchanged
```

The `comingSoonLabel` string must come from a dictionary prop passed down from HighlightsSection — VideoCard does not import the dictionary directly. Two implementation options:

**Option A (recommended):** Add `comingSoonLabel?: string` prop to `VideoCard`. HighlightsSection passes `dict.highlights.comingSoon` only when `video.isPlaceholder` is true.

**Option B:** VideoCard receives the full `dict.highlights` slice. Less clean — VideoCard is a UI primitive and should not own section-level dict slices.

The planner should pick Option A. `HighlightsSection` already receives `dict: Dictionary['highlights']` — no prop changes at the page level.

### Pattern: Dictionary Key Addition

The `Dictionary` type is inferred from `en.json` via `getDictionary.ts`:
```ts
import type enDict from '../dictionaries/en.json';
export type Dictionary = typeof enDict;
```

Adding `"comingSoon": "Highlights coming soon"` to `en.json` under `"highlights"` automatically adds `highlights.comingSoon` to the `Dictionary` type. The executor must add the same key to `ua.json` (`"Відео з'являться незабаром"` or equivalent). TypeScript will not fail if `ua.json` is missing the key because the cast `as Dictionary` in the loader suppresses the mismatch — but the UA locale will show `undefined` at runtime if omitted.

### Anti-Patterns to Avoid

- **Putting translatable strings in `content/player.ts`:** The D-12 decision explicitly forbids this. `player.ts` holds typed, non-translatable data only (numbers, ISO date, enum values). All human-readable strings (bio, position label, club name) belong in `dictionaries/*.json`.
- **Animating the placeholder card with GSAP:** This phase has no animation changes. Scroll reveal in `HighlightsSection` uses `useScrollReveal(containerRef)` which applies the `reveal-item` class pattern — the existing `.card` wrapper in the grid already carries the `reveal-item` class, so placeholder cards animate into view exactly like real cards with no extra work.
- **Adding a `title` string to `VideoEntry`:** The current `VideoEntry.title` field is used for the real card's `cardTitle` paragraph. For placeholder cards, the title is replaced by the `comingSoon` dict string. The executor should not write a new `title` value for placeholder entries in `videos.ts` — the title field becomes irrelevant when `isPlaceholder: true`. However, it must remain in the interface (optional removal is a separate cleanup task, out of scope).
- **Forgetting the HighlightsSection `key` prop:** The grid uses `key={video.videoId}`. With `isPlaceholder: true`, all three `videoId` values (currently `'Y0H9y0l67bo'`, `'kAvYK_gAr90'`, `'Oj0nkoFJZws'`) are stale YouTube IDs that no longer represent real content. They remain as keys (unique, stable), but must not be used for thumbnail URLs (`img.youtube.com/vi/${video.videoId}/...`) when `isPlaceholder` is true. The placeholder render path must not reference `video.videoId` at all.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Disabled state opacity | Custom CSS filter or JS toggle | `opacity: 0.45` on `.placeholderSlot` using existing `--color-text-muted` as background | Design tokens already define muted treatment; single CSS property is sufficient |
| Placeholder icon | SVG from scratch | `lucide-react` `Clock` or `Film` icon (already a dependency, `Play` is used in VideoCard) | Consistent with existing icon source; zero bundle cost |
| Type augmentation for `isPlaceholder` | Runtime string checks | TypeScript optional field `isPlaceholder?: boolean` on `VideoEntry` | Compile-time safety; `undefined` coerces to falsy — no migration needed for old code paths |

---

## File-by-File Change Inventory

This is the core of what the planner needs. Every placeholder value to replace, and its target value.

### content/player.ts

| Field | Current Value | Target Value |
|-------|--------------|--------------|
| `fullName` | `'Dmytro Kovalenko'` | `'Artem Kukharuk'` |
| `dateOfBirth` | `'2006-03-14'` | `'2017-01-23'` |
| `trophies` | 3 entries: 2024, 2023, 2023 | 1 entry: `{ year: 2026 }` |
| `stats.pace` | `78` | ~72 (executor picks within 60–78, higher for defender) |
| `stats.dribbling` | `82` | ~62 (lower for defender) |
| `stats.shooting` | `71` | ~61 (lower for defender) |
| `stats.passing` | `88` | ~65 (moderate) |
| `stats.physical` | `74` | ~68 (moderate) |
| `stats.defending` | `69` | ~75 (higher for defender) |

No interface changes. `workingFoot`, `nationality`, `club.logo`, `team.logo` remain unchanged.

### content/videos.ts

Interface change:
```ts
// Before
export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
}

// After
export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
  isPlaceholder?: boolean;
}
```

All 3 entries gain `isPlaceholder: true`. The existing `videoId` and `title` values should be preserved (they serve as unique keys and may be used as human-readable labels when the real video IDs are assigned later). The UCL/Dynamo references in `title` are placeholder text — the executor may update titles to neutral descriptions (`'Match Highlights — Coming Soon'` etc.) to avoid confusing placeholder content visible in edit mode.

### content/gallery.ts

| Entry (by src) | Current `alt` | Target `alt` |
|----------------|--------------|--------------|
| `photo-01.webp` | `'Match action — Dmytro driving forward'` | `'Match action — Artem driving forward'` |
| `photo-02.webp` | `'Match intensity — Dmytro competing for the ball'` | `'Match intensity — Artem competing for the ball'` |
| `photo-03.webp` | `'Training session — technical drills on the pitch'` | No change (no Dmytro reference) |
| `photo-04.webp` | `'Training focus — Dmytro working on dribbling patterns'` | `'Training focus — Artem working on defending patterns'` (or similar — executor adapts to defender) |
| `photo-05.webp` | `'Official photo — Dmytro in Dynamo Kyiv U21 kit'` | `'Official photo — Artem in Viva Cup kit'` |
| `photo-06.webp` | `'Official portrait — Ukraine U18 National Team'` | `'Official portrait — Artem, Viva Cup'` |

### dictionaries/en.json

| Key path | Current value | Target value |
|----------|--------------|--------------|
| `hero.position` | `"Central Midfielder"` | `"Defender"` |
| `hero.ctaAriaLabel` | `"Contact Dmytro Kovalenko"` | `"Contact Artem Kukharuk"` |
| `about.bio` | (Dmytro/Dynamo bio, 3 sentences) | New bio for Artem — Claude writes during execution (D-21) |
| `trophies.items` | 3-item array | 1-item array: `[{ "name": "Starballs CUP Participant", "competition": "Starballs CUP — 2016 Birth Year Category" }]` |
| `club.name` | `"Dynamo Kyiv U21"` | `"Viva Cup"` |
| `club.description` | Dynamo Kyiv U21 description | New Viva Cup description — Claude writes |
| `team.name` | `"Ukraine U18 National Team"` | `"National Team — TBD"` (or equivalent neutral placeholder) |
| `team.description` | Dmytro/international refs | Neutral placeholder — Claude writes |
| `contact.errorSubmit` | `"...email us directly at dimakyh@ukr.net"` | Generic fallback only, no email address |
| `highlights.comingSoon` | **KEY DOES NOT EXIST** | `"Highlights coming soon"` (**new key — must add**) |

### dictionaries/ua.json

Same key paths as `en.json` with Ukrainian values:

| Key path | Current value | Target value |
|----------|--------------|--------------|
| `hero.position` | `"Центральний півзахисник"` | `"Захисник"` |
| `hero.ctaAriaLabel` | `"Зв'язатися з Дмитром Коваленком"` | `"Зв'язатися з Артемом Кухаруком"` |
| `about.bio` | Dmytro/Dynamo UA bio | New Artem bio UA — Claude writes |
| `trophies.items` | 3-item array (Ukrainian names) | 1-item array: `[{ "name": "Учасник Starballs CUP", "competition": "Starballs CUP — категорія 2016 р.н." }]` |
| `club.name` | `"Динамо Київ U21"` | `"Viva Cup"` |
| `club.description` | Dynamo UA description | New Viva Cup description UA |
| `team.name` | `"Збірна України U18"` | Neutral placeholder UA |
| `team.description` | Dmytro/УЄФА refs | Neutral placeholder UA |
| `contact.errorSubmit` | `"...dimakyh@ukr.net"` | Generic fallback, no email |
| `highlights.comingSoon` | **KEY DOES NOT EXIST** | `"Відео з'являться незабаром"` (**new key**) |

### app/[lang]/layout.tsx

| Line | Current value | Target value |
|------|--------------|--------------|
| `metadata.title` (line 14) | `'Dmytro Kovalenko — Football Player'` | `'Artem Kukharuk — Football Player'` |
| `metadata.description` (line 15) | `'Scout profile for Dmytro Kovalenko, Central Midfielder...'` | `'Scout profile for Artem Kukharuk, Defender. View stats, trophies, and club info.'` |

Note: `metadata` is a static Next.js export. It is not locale-aware (same title for both UA and EN). This matches the current implementation — no change to structure, values only.

---

## Component Integration Detail

### VideoCard — Current State

`VideoCard.tsx` has one prop: `video: VideoEntry`. It renders:
1. `thumbnailSlot` (16/9 aspect ratio)
2. Inside: either a `motion.button` (thumbnail + play overlay) or a `motion.div` (YouTube iframe) — switched by `isPlaying` state
3. `cardTitle` paragraph below the slot

The component has no disabled state, no `isPlaceholder` awareness, and no guard against calling `img.youtube.com/vi/${video.videoId}/hqdefault.jpg` with a stale ID.

### VideoCard — Required Extension

The executor must:
1. Accept `comingSoonLabel?: string` as a new optional prop
2. Guard at top of render: `if (video.isPlaceholder && comingSoonLabel) { return <placeholder JSX> }`
3. Placeholder JSX uses `.placeholderSlot` styles inside the existing `.thumbnailSlot` div
4. No `useState(isPlaying)` needed in the placeholder path — it is pure static render

### HighlightsSection — Required Changes

Currently: `<VideoCard video={video} />`

After: `<VideoCard video={video} comingSoonLabel={video.isPlaceholder ? dict.comingSoon : undefined} />`

The `dict` prop is already `Dictionary['highlights']`. After adding `comingSoon` to `en.json`, this is `dict.comingSoon` typed as `string`. TypeScript will enforce it.

No changes to `HighlightsSection`'s own props interface — it already receives `videos: VideoEntry[]` and `dict: Dictionary['highlights']`.

### VideoCard.module.scss — New Styles Required

Add `.placeholderSlot` to the existing SCSS:
- `position: absolute; inset: 0` (same as `.playOverlay`)
- `background: var(--color-bg-elevated)` (matches card surface)
- `display: flex; align-items: center; justify-content: center; flex-direction: column; gap: var(--space-2)`
- Icon color: `var(--color-text-muted)` 
- `opacity: 0.7` for the whole slot (visually muted)
- `cursor: default` (not interactive)

---

## Common Pitfalls

### Pitfall 1: ua.json Missing New Keys
**What goes wrong:** `highlights.comingSoon` is added to `en.json` but not `ua.json`. TypeScript will not catch this because `ua.json` is cast `as Dictionary`. At runtime, Ukrainian users see `undefined` where the "coming soon" label should appear.
**Why it happens:** Dictionary type inference only reads `en.json` as source of truth.
**How to avoid:** Always update both files in the same task. The planner should make this a single atomic task — "Update both en.json and ua.json."
**Warning signs:** Build succeeds but UA locale shows blank/undefined placeholder text.

### Pitfall 2: Stale YouTube Thumbnail URL in Placeholder Path
**What goes wrong:** `VideoCard` still constructs `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` inside the placeholder branch, loading a real YouTube thumbnail for an unrelated video.
**Why it happens:** Forgetting to guard the `<img src>` behind the `isPlaceholder` check.
**How to avoid:** The placeholder render branch (`if (video.isPlaceholder)`) must return early before the existing thumbnail `<img>` renders. The stale `videoId` values (`Y0H9y0l67bo` etc.) must never appear in a network request when `isPlaceholder: true`.
**Warning signs:** Browser DevTools Network tab shows requests to `img.youtube.com/vi/Y0H9y0l67bo/...` even in placeholder mode.

### Pitfall 3: trophies.items Array Length Mismatch Between Locales
**What goes wrong:** `en.json` has 1 trophy item but `ua.json` still has 3 items (or vice versa). The TrophiesSection uses index-based zip — `dict.trophies.items[i]` — so a locale mismatch produces `undefined.name` at runtime.
**Why it happens:** Updating only one locale file.
**How to avoid:** Trophy items are updated in the same task as all other dictionary keys — both files together.
**Warning signs:** UA locale trophies section shows 3 items (old data) while EN shows 1 (new data).

### Pitfall 4: stats Values Outside Defender Profile Range
**What goes wrong:** Executor picks stats outside the 60–78 band (e.g., `dribbling: 82` retained from old data) because they didn't read the constraint carefully.
**Why it happens:** Copy-paste from existing values without adjusting.
**How to avoid:** Executor must independently set all 6 stat fields. No field carries over unchanged (the old stats were for a midfielder, not a defender).
**Warning signs:** Stat bar for `dribbling` or `shooting` renders taller than `defending` bar.

### Pitfall 5: `metadata` in layout.tsx is Not Locale-Aware
**What goes wrong:** Executor tries to make `metadata` dynamic or locale-specific, introducing `generateMetadata` — a structural change out of scope for this phase.
**Why it happens:** Thinking the English-only metadata is a bug to fix.
**How to avoid:** The current static `metadata` export is intentional — both UA and EN locales share the same page title. Update values only. Leave `export const metadata: Metadata = {...}` structure unchanged.

---

## Code Examples

### VideoEntry Interface After Extension
```typescript
// Source: content/videos.ts (after edit)
export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
  isPlaceholder?: boolean;   // new optional field
}

export const videos: VideoEntry[] = [
  {
    videoId: 'Y0H9y0l67bo',
    title: 'Match Highlights — Coming Soon',
    category: 'match',
    isPlaceholder: true,
  },
  // ... 2 more entries, all isPlaceholder: true
];
```

### Dictionary Type Extension (automatic — no code change)
```typescript
// getDictionary.ts — unchanged
// After en.json gains highlights.comingSoon, this type automatically includes it:
export type Dictionary = typeof enDict;
// Dictionary['highlights'] now has { title, intro, comingSoon }
```

### HighlightsSection — Updated Card Render
```tsx
// Source: components/sections/HighlightsSection.tsx
<VideoCard
  video={video}
  comingSoonLabel={video.isPlaceholder ? dict.comingSoon : undefined}
/>
```

### VideoCard — Placeholder Branch
```tsx
// Source: components/ui/VideoCard.tsx
interface Props {
  video: VideoEntry;
  comingSoonLabel?: string;  // new optional prop
}

export function VideoCard({ video, comingSoonLabel }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (video.isPlaceholder && comingSoonLabel) {
    return (
      <article className={styles.card}>
        <div className={styles.thumbnailSlot}>
          <div className={styles.placeholderSlot} aria-hidden="true">
            <Clock size={32} className={styles.placeholderIcon} />
          </div>
        </div>
        <p className={styles.cardTitle}>{comingSoonLabel}</p>
      </article>
    );
  }

  // ... existing play/iframe path unchanged below
```

### Placeholder SCSS Addition
```scss
// VideoCard.module.scss — new rule to add
.placeholderSlot {
  position: absolute;
  inset: 0;
  background: var(--color-bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-2);
  opacity: 0.65;
  cursor: default;
}

.placeholderIcon {
  color: var(--color-text-muted);
}
```

---

## State of the Art

This phase uses no new dependencies. All patterns are established within the project.

| Aspect | Current Pattern | Phase 5 Extension |
|--------|----------------|-------------------|
| Feature flags in content | `club.logo: null` signals placeholder | `isPlaceholder?: boolean` on `VideoEntry` — same convention, typed |
| Zero hardcoded strings | All text from `dict.*` props | `highlights.comingSoon` added to both dicts — rule maintained |
| TypeScript content contracts | `Player`, `VideoEntry`, `GalleryEntry` interfaces | `VideoEntry` gains optional field — backward-compatible |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Clock` from `lucide-react` is available (lucide-react is in the project dependencies) | Code Examples | Executor would need to choose a different icon or use a simple SVG; low impact |
| A2 | `highlights.comingSoon` is the correct key name to introduce | File-by-File Change Inventory | If the planner chooses a different key name (e.g., `highlights.placeholder`), both dict files and the VideoCard prop must use the same name — consistency matters more than the specific name |

No assumptions about architecture, data flow, or file structure — all were verified by direct file reads.

---

## Open Questions

1. **VideoCard `title` field for placeholder entries**
   - What we know: Current titles (`'Match Highlights — UCL Quarter-Final'` etc.) are wrong for a 9-year-old — they reference UCL
   - What's unclear: Should titles be updated to neutral text (`'Match Highlights — Coming Soon'`) or left as-is (they're invisible to visitors when `isPlaceholder` is true and the component renders the `comingSoonLabel` string instead of `video.title`)
   - Recommendation: Update to neutral titles in the same edit — reduces confusion when developers read the file. `video.title` is still used as `aria-label` for the play button in the non-placeholder path, so stale titles are not visible to visitors in this phase, but clean data is worth the 30 extra seconds.

2. **`team` section placeholder wording**
   - What we know: D-17 says update to neutral ("National Team — TBD" or similar). Exact wording is executor's discretion.
   - What's unclear: Whether `"team"` nav label should also change (currently `"Team"` in EN, `"Збірна"` in UA)
   - Recommendation: Leave `nav.team` and `team.title` unchanged — the section still exists and the nav link still works. Only `team.name` and `team.description` need updating.

---

## Environment Availability

Step 2.6: SKIPPED — phase is code/content edits only. No new external tools, services, CLIs, or runtimes required. All dependencies are already installed (`lucide-react`, TypeScript, SCSS).

---

## Validation Architecture

`nyquist_validation` is explicitly set to `false` in `.planning/config.json`. This section is omitted per protocol.

---

## Security Domain

No authentication, no user input handling, no new API calls, no secrets introduced. This phase is content-only. Security domain not applicable.

The one security-relevant change is **D-18** (remove hardcoded email from `contact.errorSubmit`) — this reduces PII exposure in the client bundle. No new security surface is introduced.

---

## Sources

### Primary (HIGH confidence)
All findings in this research are based on direct file reads of the live codebase. No external sources needed.

- `content/player.ts` — current placeholder values, Player/PlayerStats/Trophy interfaces
- `content/videos.ts` — VideoEntry interface, 3 current video entries
- `content/gallery.ts` — GalleryEntry interface, 6 current alt text strings
- `dictionaries/en.json` — all key paths and current values
- `dictionaries/ua.json` — all key paths and current Ukrainian values
- `app/[lang]/layout.tsx` — metadata export, lines 14–15
- `components/sections/HighlightsSection.tsx` — props, render structure, dict slice usage
- `components/ui/VideoCard.tsx` — props, play/iframe state machine, full render path
- `components/ui/VideoCard.module.scss` — existing CSS class names and design tokens used
- `styles/_tokens.scss` — design token names for placeholder visual treatment
- `lib/getDictionary.ts` — Dictionary type inference mechanism
- `app/[lang]/page.tsx` — data flow: content imports → page → section props

---

## Metadata

**Confidence breakdown:**
- File inventory: HIGH — all files read directly from codebase
- Change targets: HIGH — exact line numbers and values confirmed
- VideoCard extension pattern: HIGH — full component read, integration path clear
- Dictionary type extension: HIGH — getDictionary.ts mechanism read directly
- Stat values (executor discretion): MEDIUM — D-05 sets range constraints, specific values are Claude's call

**Research date:** 2026-05-20
**Valid until:** Indefinite — content of static files only changes when edited
