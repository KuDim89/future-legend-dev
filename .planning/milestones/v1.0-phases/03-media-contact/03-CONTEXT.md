# Phase 3: Media & Contact - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the three `SectionStub` placeholders (highlights `#highlights`, gallery `#gallery`, contact `#contact`) with working implementations: a YouTube lite-embed highlights section, a masonry photo gallery with lightbox, and a contact form wired to Telegram via GitHub Actions `workflow_dispatch`.

Phase 3 does NOT build: bilingual string files, language switcher, or i18n locale routing. Those are Phase 4. Phase 3 sections may contain hardcoded English strings — they will be extracted to dictionaries in Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Contact Pipeline Architecture
- **D-01:** Pipeline approach: direct GitHub Actions `workflow_dispatch` via the GitHub API (POST `/repos/KuDim89/future-legend-dev/actions/workflows/contact.yml/dispatches`). No Cloudflare Worker intermediary.
- **D-02:** PAT storage: `GH_PAT` stored in GitHub Secrets. Exposed to the client bundle at build time as `NEXT_PUBLIC_GH_PAT` via the GitHub Actions build workflow (`env: NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}`). PAT scoped to `actions:write` only — read-only on repo data.
- **D-03:** Target repo for API call: `KuDim89/future-legend-dev`.
- **D-04:** GitHub Actions workflow file: `.github/workflows/contact.yml` with `workflow_dispatch` trigger and four inputs: `name`, `email`, `message`, `phone` (phone is optional — scouts who prefer calls). Workflow sends a formatted Telegram message using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from GitHub Secrets.
- **D-05:** Two GitHub Secrets are required but not in code: `TELEGRAM_BOT_TOKEN` (from BotFather) and `TELEGRAM_CHAT_ID` (player's Telegram chat). Player will add these manually after Phase 3 implementation.
- **D-06:** Spam protection: invisible honeypot field (`<input name="website" tabindex="-1" aria-hidden="true" />` hidden via CSS, not `display:none` to avoid bot detection) + minimum submit time check (3-second threshold — form rendered timestamp vs. submit timestamp). Both are invisible to real users. Honeypot filled OR submit under 3s → submission silently rejected (no error shown).

### Video Section (HighlightsSection)
- **D-07:** Layout: responsive grid of video cards — 1 col mobile, 2 col tablet, 3 col desktop. Matches the trophies grid pattern already established in Phase 2.
- **D-08:** `content/videos.ts` data schema per entry: `videoId: string` (YouTube video ID), `title: string` (card label), `category: 'match' | 'training' | 'skills'`.
- **D-09:** Phase 3 ships with 3 placeholder video entries using real public YouTube football highlight IDs (not lorem ipsum IDs). Easy to swap for real player videos later.
- **D-10:** No category filter tabs in Phase 3 — flat grid, all videos shown. Category field stored in data for future Phase filter UI.
- **D-11:** Lite-embed pattern: card shows static YouTube thumbnail (`https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`) on initial render. Click on thumbnail triggers React state change that replaces the `<img>` with a `react-youtube` `<YouTube>` component (`autoplay: 1`). No `<iframe>` in the DOM until clicked — satisfies MEDIA-03.

### Gallery Section (GallerySection)
- **D-12:** Photo storage: local WebP files committed to `/public/images/gallery/`. Served from GitHub Pages at `/future-legend-dev/images/gallery/{filename}`. No external image hosting.
- **D-13:** `content/gallery.ts` data schema per entry: `src: string` (full path including basePath, e.g., `/future-legend-dev/images/gallery/photo-01.webp`), `alt: string`, `category: 'match' | 'training' | 'official'`.
- **D-14:** Phase 3 commits 6 placeholder images (solid-color or gradient WebP files, 3:2 landscape aspect ratio, 2 per category). Small file size. Real player photos added as a content update after Phase 3.
- **D-15:** Grid layout: masonry via `react-masonry-css` (needs `npm install react-masonry-css`). Breakpoints: `{ default: 3, 768: 2, 480: 1 }`. Clicking any photo opens `yet-another-react-lightbox` (`yarl` — already in the tech stack per CLAUDE.md) with keyboard navigation and fullscreen.

### Contact Section (ContactSection)
- **D-16:** Form fields: `name` (text, required), `email` (email, required), `phone` (tel, optional — labeled "Phone (optional)"), `message` (textarea, required). Plus invisible honeypot field.
- **D-17:** Success UX: on GitHub API `202 Accepted`, form fades out (Framer Motion `exit` animation) and a success message fades in replacing it: "Your message has been sent. We'll be in touch soon." Form fields are NOT preserved — clean slate.
- **D-18:** Error UX: on non-202 response or network error, an inline error message appears below the submit button: "Something went wrong. Please try again or email us directly at dimakyh@ukr.net." Form stays visible and pre-filled so the user can retry without retyping.
- **D-19:** Loading UX: submit button disabled during in-flight request. Icon changes to a spinner. Button label changes from "Send Message" to "Sending…". Prevents double-submit.
- **D-20:** Contact section layout: form only — no social links, no secondary contact panel. Section title + one-line intro text above the form.

### Claude's Discretion
- Exact column count breakpoints for the video grid (e.g., 2 col at 768px vs. 900px) — planner picks consistent with the trophies grid breakpoints
- Video card hover effect (subtle scale, overlay, shadow) — stays within design token system
- Lightbox toolbar configuration (thumbnails, fullscreen button, download button) — researcher/planner picks sensible defaults from YARL docs
- Telegram message formatting (HTML vs. Markdown mode, emoji use) — planner decides what looks good in Telegram
- Whether to add a play button overlay icon on the video thumbnail on hover — can decide based on UX clarity

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- `.planning/PROJECT.md` — Core value, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — Phase 3 requirements: MEDIA-01, MEDIA-02, MEDIA-03, CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04
- `.planning/ROADMAP.md` — Phase 3 goal and 4 success criteria that must ALL be true
- `SPEC.md` — Project-level spec: product goals, tech stack, Telegram integration flow

### Architecture & Animation Rules
- `CLAUDE.md` — **CRITICAL**: animation ownership rule (Framer Motion = mount/unmount/hover; GSAP = scroll sequences), GSAP-in-useGSAP rule, `'use client'` boundary rule, content data flow pattern (`content/*.ts` → `page.tsx` → section props)

### Phase 2 Patterns (read before building new sections)
- `components/sections/SectionStub.tsx` — The stubs being replaced. Phase 3 replaces all three (`#highlights`, `#gallery`, `#contact`) with real section components.
- `components/sections/TrophiesSection.tsx` — Grid layout reference: the same responsive grid pattern used for video cards.
- `components/sections/AboutSection.tsx` — GSAP scroll reveal pattern + Framer Motion stat bar animation pattern — reference for how Phase 3 sections should animate.
- `lib/animations/useScrollReveal.ts` — Shared scroll reveal hook. All Phase 3 sections use this for section entrance animations.
- `styles/_tokens.scss` — All design tokens. Phase 3 uses `--color-accent`, `--color-bg`, `--color-bg-elevated`, `--space-*`, etc.

### GitHub Integration
- Repo: `https://github.com/KuDim89/future-legend-dev`
- API target: `POST https://api.github.com/repos/KuDim89/future-legend-dev/actions/workflows/contact.yml/dispatches`
- GitHub Secrets needed (player must add): `GH_PAT` (actions:write scoped PAT), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/sections/SectionStub.tsx` — Three instances (`id: 'highlights'`, `id: 'gallery'`, `id: 'contact'`) in `app/[lang]/page.tsx` are replaced by the three new section components.
- `lib/animations/useScrollReveal.ts` — All Phase 3 sections call this for their scroll entrance animation. Follow the same `start: 'top 80%'`, `stagger: 0.1` pattern.
- `styles/_tokens.scss` — No new tokens needed for Phase 3. Use existing `--color-accent`, `--color-bg-elevated`, `--space-*`, `--font-heading`.
- `components/providers/Providers.tsx` + `lib/SmoothScrollProvider` — Already in layout, Phase 3 sections inherit.

### Established Patterns
- **GSAP scroll pattern**: `'use client'` → `useRef<HTMLDivElement>` → `useScrollReveal(ref)`. All Phase 3 sections follow this.
- **Framer Motion pattern**: `motion.div` with `initial/animate/exit/transition`. Used for: video card hover, lightbox open/close, form success state transition, loading state.
- **SCSS Module pattern**: `.module.scss` per component. No global class names (except GSAP `.fade-item` selectors).
- **Content data flow**: `content/videos.ts` and `content/gallery.ts` are imported only in `app/[lang]/page.tsx`. Section components receive data as props — they never import content directly.
- **`'use client'` boundary**: ContactSection (form state), HighlightsSection (video clicked state), GallerySection (lightbox open state) must all be `'use client'`.

### Integration Points
- `app/[lang]/page.tsx` — Replace three `<SectionStub>` calls with `<HighlightsSection>`, `<GallerySection>`, `<ContactSection>`. Import new content files. Pass data as props.
- `content/` — Add `content/videos.ts` (VideoEntry interface + 3 placeholder entries) and `content/gallery.ts` (GalleryEntry interface + 6 placeholder entries).
- `.github/workflows/` — Add `contact.yml` with `workflow_dispatch`, 4 inputs, curl to Telegram Bot API.
- `.github/workflows/deploy.yml` (or equivalent) — Add `NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}` to the `env:` block of the Next.js build step.

</code_context>

<specifics>
## Specific Ideas

- The lite-embed pattern is the key performance requirement for MEDIA-03 — no `<iframe>` in the DOM on initial page load. Planner must verify that `react-youtube` is not auto-rendering iframes and that the click-to-load state swap fully removes the `<img>` and inserts the `<YouTube>` component.
- Phone field on the contact form is optional (labeled "Phone (optional)") — do not make it `required` in HTML validation.
- Honeypot field must be hidden via CSS (e.g., `position: absolute; left: -9999px`) rather than `display: none` or `type="hidden"` — some bots skip fields that are display:none.
- The submit time check: record `Date.now()` when the component mounts. On submit, reject if `Date.now() - mountTime < 3000`.
- Fallback email shown in error state: `dimakyh@ukr.net`.
- Telegram secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) are never in any code file — workflow reads `${{ secrets.TELEGRAM_BOT_TOKEN }}` and `${{ secrets.TELEGRAM_CHAT_ID }}` directly.

</specifics>

<deferred>
## Deferred Ideas

- Category filter tabs for the video section (match / training / skills) — data structure supports it but filter UI deferred to v2 (MEDIA-V2-01 territory)
- Photo gallery category tabs — same rationale as above
- Social media links in the contact section — not needed for Phase 3 scout-facing goal
- Video descriptions in `content/videos.ts` — kept minimal for Phase 3; add in Phase 4+ polish
- Photo captions in lightbox — deferred; data structure doesn't include captions in Phase 3

</deferred>

---

*Phase: 3-Media & Contact*
*Context gathered: 2026-05-20*
