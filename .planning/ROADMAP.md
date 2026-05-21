# Roadmap: Future Legend — Football Player Personal Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1–4 (shipped 2026-05-20)
- 🚧 **v1.1 Real Content** — Phases 5–7 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–4) — SHIPPED 2026-05-20</summary>

- [x] Phase 1: Foundation & Design System (3/3 plans) — completed 2026-05-19
- [x] Phase 2: Core Sections & Animations (3/3 plans) — completed 2026-05-20
- [x] Phase 3: Media & Contact (4/4 plans) — completed 2026-05-20
- [x] Phase 4: Bilingual Support & Polish (4/4 plans) — completed 2026-05-20

Full details: [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

### 🚧 v1.1 Real Content (In Progress)

**Milestone Goal:** Replace all placeholder content with Artem Kukharuk's real identity so the site looks scout-ready with no obvious placeholders.

- [ ] **Phase 5: Player Identity** — Update all text and data content to Artem Kukharuk (fast, zero asset dependency)
- [ ] **Phase 6: Asset Prompts & Guide** — Produce Midjourney prompts and an integration guide so the user can generate images
- [ ] **Phase 7: Asset Integration** — Wire generated images into the codebase across hero, gallery, and club crest slots

## Phase Details

### Phase 5: Player Identity
**Goal**: Every text reference on the site accurately represents Artem Kukharuk — name, position, club, age, and biography in both languages
**Depends on**: Phase 4
**Requirements**: IDENT-01, IDENT-02, VIDEO-01
**Success Criteria** (what must be TRUE):
  1. Visitor sees "Artem Kukharuk", "Defender", "Viva Cup", and age 9 on every section that displays player identity (hero, about, profile)
  2. Visitor reads a coherent, accurate biography in Ukrainian and in English — no placeholder text visible
  3. YouTube video slots either show real highlight video IDs or display a clean placeholder message; raw YouTube ID strings are never visible to visitors
**Plans**: 2 plans

Plans:

**Wave 1**
- [x] 05-01-PLAN.md — Identity data swap: player.ts, both locale dictionaries, gallery alt text, page metadata

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 05-02-PLAN.md — Video slot update: VideoEntry isPlaceholder flag, VideoCard disabled variant, HighlightsSection wiring

**Cross-cutting constraints:**
- Both trophies.items arrays (en.json + ua.json) must remain the same length (index-based zip in TrophiesSection)
- highlights.comingSoon key added in Wave 1 must exist before Wave 2 is compiled

### Phase 6: Asset Prompts & Guide
**Goal**: The user has everything needed to generate the required images — a set of Midjourney prompts and a drop-in integration guide — before touching any code
**Depends on**: Phase 5
**Requirements**: ASSET-01, ASSET-02
**Success Criteria** (what must be TRUE):
  1. Midjourney prompts exist for hero background, all 6–8 gallery images, and the Viva Cup club crest — each prompt is self-contained and ready to paste
  2. Asset integration guide documents the exact file name, required dimensions, and drop-in path for every content slot so the user can integrate images without opening source files
**Plans**: TBD

Plans:
- [ ] 06-01: Midjourney prompt set — hero, gallery (6–8 shots), club crest
- [ ] 06-02: Asset integration guide — file names, dimensions, drop-in paths per slot

### Phase 7: Asset Integration
**Goal**: The live site displays real or AI-generated images in all visual content slots — hero, gallery, and club crest — with no fallback placeholders visible to visitors
**Depends on**: Phase 6
**Requirements**: ASSET-03, ASSET-04, ASSET-05
**Success Criteria** (what must be TRUE):
  1. Hero section background shows a real or AI-generated player photo — the solid-colour fallback is never the primary visual a visitor sees
  2. Gallery section displays 6–8 real or AI-generated match/training photos — no Unsplash football stock images remain
  3. Club crest slot shows the real or AI-generated Viva Cup logo — no missing image, broken icon, or null placeholder
**UI hint**: yes

**Plans**: TBD

Plans:
- [ ] 07-01: Hero background integration
- [ ] 07-02: Gallery photo replacement
- [ ] 07-03: Club crest slot update

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Design System | v1.0 | 3/3 | Complete | 2026-05-19 |
| 2. Core Sections & Animations | v1.0 | 3/3 | Complete | 2026-05-20 |
| 3. Media & Contact | v1.0 | 4/4 | Complete | 2026-05-20 |
| 4. Bilingual Support & Polish | v1.0 | 4/4 | Complete | 2026-05-20 |
| 5. Player Identity | v1.1 | 1/2 | In Progress|  |
| 6. Asset Prompts & Guide | v1.1 | 0/2 | Not started | - |
| 7. Asset Integration | v1.1 | 0/3 | Not started | - |
