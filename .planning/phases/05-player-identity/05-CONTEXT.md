# Phase 5: Player Identity - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all Dmytro Kovalenko placeholder content with Artem Kukharuk's real identity across every text-bearing file — player data, both locale dictionaries, gallery alt text, video slots, and page metadata. No structural changes, no new components. Pure content swap + video placeholder behavior.

Files in scope:
- `content/player.ts` — name, DOB, stats, foot, trophies
- `content/videos.ts` — add `isPlaceholder` flag; mark all 3 entries as placeholder
- `content/gallery.ts` — alt text (replace "Dmytro"/"Dynamo Kyiv U21" refs)
- `dictionaries/en.json` — all identity-bearing keys
- `dictionaries/ua.json` — all identity-bearing keys
- `app/[lang]/layout.tsx` — page title and meta description

</domain>

<decisions>
## Implementation Decisions

### Player Data (content/player.ts)
- **D-01:** `fullName` → `"Artem Kukharuk"`
- **D-02:** `dateOfBirth` → `"2017-01-23"` (provided by user)
- **D-03:** `workingFoot` → `"Right"` (confirmed, no change)
- **D-04:** `nationality` → `"Ukrainian"` (confirmed, no change)
- **D-05:** Stats adjusted to defender profile, moderate/realistic range (60–78). Higher `defending` and `pace`; lower `shooting` and `dribbling`. Claude picks specific values within that range.
- **D-06:** Trophies → single entry `{ year: 2026 }`. Competition: Starballs CUP (for 2016 birth year category). Add as 2026 achievement now — event is May 24, 2026.

### Video Slots (content/videos.ts + HighlightsSection)
- **D-07:** No real YouTube highlight IDs available for Artem yet.
- **D-08:** Keep Highlights section visible — do NOT hide it. Render 3 disabled "coming soon" cards (preserves grid layout, no layout shift when real videos arrive later).
- **D-09:** Disabled card text: `"Highlights coming soon"` — add translation key to both dictionaries.
- **D-10:** Disabled cards are visually muted/greyed with a placeholder icon — clearly distinct from real video cards. Not clickable.
- **D-11:** `VideoEntry` interface in `videos.ts` gains `isPlaceholder?: boolean` field. All 3 current entries set to `isPlaceholder: true`. When real IDs arrive: swap videoId, remove/flip the flag. No structural changes needed.

### Dictionaries — Identity Keys
- **D-12:** `hero.position` → `"Defender"` (EN) / `"Захисник"` (UA)
- **D-13:** `hero.ctaAriaLabel` → `"Contact Artem Kukharuk"` (EN) / `"Зв'язатися з Артемом Кухаруком"` (UA)
- **D-14:** `about.bio` → rewritten by Claude during execution. Audience: scouts and coaches (professional tone). Focus: current qualities as a young defender + future potential. No specific traits provided by user — Claude decides based on defender position profile for age 9 at Viva Cup.
- **D-15:** `trophies.items` → single entry: `{ name: "Starballs CUP Participant", competition: "Starballs CUP — 2016 Birth Year Category" }` (EN). Claude writes the Ukrainian equivalent.
- **D-16:** `club.name` → `"Viva Cup"` (both locales). `club.description` → updated by Claude to describe Viva Cup as a youth football club/competition for Artem's age group.
- **D-17:** `team` section — Artem is 9 and not on a national team. Update `team.name` and `team.description` to a clean placeholder ("National Team — TBD" or similar). Planner decides exact wording, but must not leave "Ukraine U18 National Team" and Dmytro references visible.
- **D-18:** `contact.errorSubmit` email (`dimakyh@ukr.net`) — remove the hardcoded email address from the error message in both dictionaries. Replace with generic fallback text only (no personal email visible in the UI).

### Gallery Alt Text (content/gallery.ts)
- **D-19:** Replace all `"Dmytro"` references with `"Artem"` in alt text. Replace `"Dynamo Kyiv U21"` with `"Viva Cup"`. Replace `"Ukraine U18 National Team"` with `"Viva Cup"` or equivalent.

### Page Metadata (app/[lang]/layout.tsx)
- **D-20:** Update page `title` and `description` to reference Artem Kukharuk, Defender, Viva Cup.

### Bio
- **D-21:** Claude writes bio draft in both EN and UA inline during 05-01 execution. Bio is written to `about.bio` in both dictionaries. Audience: scouts/coaches. Tone: professional. Covers current defensive qualities + long-term potential. Length: ~3 sentences (matching current bio length).

### Claude's Discretion
- Specific stat values (within 60–78 moderate range, defender profile — higher defending/pace, lower shooting/dribbling)
- Exact bio wording in EN and UA (within the scout/coach audience, current qualities + potential framing)
- Exact `club.description` text for Viva Cup
- Exact `team` section placeholder wording
- Exact disabled video card component behavior (greyed/muted visual treatment) consistent with existing VideoCard design

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Player Data & Content
- `content/player.ts` — Player interface and current placeholder data; `isPlaceholder` field added to VideoEntry here
- `content/videos.ts` — VideoEntry interface; add `isPlaceholder?: boolean`; all 3 entries flagged
- `content/gallery.ts` — GalleryEntry alt text; references "Dmytro"/"Dynamo Kyiv U21" to replace

### Dictionaries
- `dictionaries/en.json` — All EN locale strings; keys that need updating: `hero.position`, `hero.ctaAriaLabel`, `about.bio`, `trophies.items`, `club.name`, `club.description`, `team.name`, `team.description`, `contact.errorSubmit`, plus new highlights placeholder key
- `dictionaries/ua.json` — Same keys in Ukrainian

### Metadata
- `app/[lang]/layout.tsx` — Page title and meta description (lines 14–15 hardcoded with "Dmytro Kovalenko")

### Architecture
- `.planning/PROJECT.md` — Key Decisions table; especially D-12 (translatable strings in dictionaries/, not player.ts)
- `.planning/REQUIREMENTS.md` — IDENT-01, IDENT-02, VIDEO-01 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `VideoCard` component — already handles thumbnail + iframe pattern; needs a new disabled/placeholder visual variant
- `dictionaries/en.json` + `ua.json` — all keys already exist; this phase updates values, no new key structure needed except for highlights placeholder text

### Established Patterns
- **D-12 pattern (v1.0 decision):** Translatable content (bio, position, club names) lives exclusively in `dictionaries/*.json`. `content/player.ts` holds only non-translatable typed data (stats, DOB, foot). This constraint is enforced — do not add string fields to `player.ts`.
- **`isPlaceholder` flag:** Follows the existing `club.logo: null` convention in `content/player.ts` — null/false signals "placeholder state" that Phase 7 will replace.
- **`useGSAP()` rule:** No GSAP changes in this phase — content swap only.

### Integration Points
- `HighlightsSection` receives `videos` array from `content/videos.ts` — needs to check `isPlaceholder` flag and render disabled card variant
- Both locale dictionaries feed the same component props — any new key (e.g., `highlights.comingSoon`) must be added to both `en.json` and `ua.json`

</code_context>

<specifics>
## Specific Ideas

- **Starballs CUP:** Full competition name is "Starballs CUP" for children born in 2016. Year: 2026. User confirmed: list it now even though the event is May 24 (4 days away).
- **DOB:** `2017-01-23` — exact date provided by user.
- **Video placeholder count:** Keep exactly 3 disabled cards to match the existing grid layout. No layout changes.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 5-Player Identity*
*Context gathered: 2026-05-20*
