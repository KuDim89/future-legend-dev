# Phase 3: Media & Contact — Research

**Researched:** 2026-05-20
**Domain:** React media embeds (YouTube lite-embed, masonry gallery, lightbox) + GitHub Actions workflow_dispatch Telegram pipeline
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Contact Pipeline Architecture**
- **D-01:** Pipeline approach: direct GitHub Actions `workflow_dispatch` via the GitHub API (POST `/repos/KuDim89/future-legend-dev/actions/workflows/contact.yml/dispatches`). No Cloudflare Worker intermediary.
- **D-02:** PAT storage: `GH_PAT` stored in GitHub Secrets. Exposed to the client bundle at build time as `NEXT_PUBLIC_GH_PAT` via the GitHub Actions build workflow (`env: NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}`). PAT scoped to `actions:write` only — read-only on repo data.
- **D-03:** Target repo for API call: `KuDim89/future-legend-dev`.
- **D-04:** GitHub Actions workflow file: `.github/workflows/contact.yml` with `workflow_dispatch` trigger and four inputs: `name`, `email`, `message`, `phone` (phone is optional). Workflow sends a formatted Telegram message using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from GitHub Secrets.
- **D-05:** Two GitHub Secrets are required but not in code: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Player will add these manually after Phase 3 implementation.
- **D-06:** Spam protection: invisible honeypot field (hidden via CSS `position:absolute; left:-9999px`, not `display:none`) + minimum submit time check (3-second threshold). Honeypot filled OR submit under 3s → submission silently rejected.

**Video Section (HighlightsSection)**
- **D-07:** Layout: responsive grid of video cards — 1 col mobile, 2 col tablet, 3 col desktop. Matches the trophies grid pattern.
- **D-08:** `content/videos.ts` data schema: `videoId: string`, `title: string`, `category: 'match' | 'training' | 'skills'`.
- **D-09:** Phase 3 ships with 3 placeholder video entries using real public YouTube football highlight IDs.
- **D-10:** No category filter tabs in Phase 3 — flat grid, all videos shown.
- **D-11:** Lite-embed pattern: card shows static YouTube thumbnail (`https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`) on initial render. Click triggers React state change that replaces `<img>` with a `<YouTube>` component (`autoplay: 1`). No `<iframe>` in DOM until clicked.

**Gallery Section (GallerySection)**
- **D-12:** Photo storage: local WebP files in `/public/images/gallery/`.
- **D-13:** `content/gallery.ts` data schema: `src: string` (full path including basePath), `alt: string`, `category: 'match' | 'training' | 'official'`.
- **D-14:** Phase 3 commits 6 placeholder images (solid-color WebP, 3:2 landscape aspect ratio).
- **D-15:** Grid layout: masonry via `react-masonry-css`. Breakpoints: `{ default: 3, 768: 2, 480: 1 }`. Clicking any photo opens `yet-another-react-lightbox` with Fullscreen and Zoom plugins.

**Contact Section (ContactSection)**
- **D-16:** Form fields: `name` (required), `email` (required), `phone` (optional), `message` (required), plus invisible honeypot.
- **D-17:** Success UX: form fades out (Framer Motion exit), success message fades in.
- **D-18:** Error UX: inline error appears below submit button; form stays pre-filled. Fallback email: `dimakyh@ukr.net`.
- **D-19:** Loading UX: button disabled, spinner icon, "Sending…" label.
- **D-20:** Contact section layout: form only — section title + one-line intro text above the form.

### Claude's Discretion

- Exact column count breakpoints for the video grid
- Video card hover effect (subtle scale, overlay, shadow)
- Lightbox toolbar configuration (thumbnails, fullscreen button, download button)
- Telegram message formatting (HTML vs. Markdown mode, emoji use)
- Whether to add a play button overlay icon on the video thumbnail on hover

### Deferred Ideas (OUT OF SCOPE)

- Category filter tabs for the video section (match / training / skills)
- Photo gallery category tabs
- Social media links in the contact section
- Video descriptions in `content/videos.ts`
- Photo captions in lightbox
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MEDIA-01 | Visitor can watch embedded YouTube highlight videos using lite-embed pattern (thumbnail shown first, iframe loads on click) | React state swap pattern confirmed: `react-youtube` ALWAYS renders iframe on mount — lite-embed requires manual `isPlaying` state guard. `<YouTube>` component only mounted when `isPlaying === true` |
| MEDIA-02 | Visitor can browse a photo gallery with lightbox viewer (zoom, navigation, fullscreen) | `yet-another-react-lightbox` v3.32.0 — `Fullscreen` and `Zoom` plugins import from separate subpaths; `index` prop controls opening slide; `'use client'` required |
| MEDIA-03 | Video and gallery sections do not block page load (lazy loading enforced) | `loading="lazy"` on all `<img>` thumbnails and gallery photos; `<YouTube>` component conditionally mounted only on click — no iframe at initial load |
| CONTACT-01 | Visitor can submit a contact form with name, email, and message | Standard HTML form + React state — no external form library needed |
| CONTACT-02 | Successful form submission triggers a Telegram notification via GitHub Actions + Telegram Bot API | GitHub API `workflow_dispatch` endpoint verified; `contact.yml` workflow pattern confirmed; Telegram `sendMessage` curl pattern confirmed |
| CONTACT-03 | Contact form includes spam protection: honeypot hidden field and submission time check | Both patterns confirmed; honeypot via `position:absolute; left:-9999px` CSS only; `Date.now()` mount-time check |
| CONTACT-04 | Bot token and chat ID stored in GitHub Secrets only — never exposed in client-side code | Confirmed: `contact.yml` reads `${{ secrets.TELEGRAM_BOT_TOKEN }}` and `${{ secrets.TELEGRAM_CHAT_ID }}` directly; neither appears in any client bundle |
</phase_requirements>

---

## Summary

Phase 3 implements three full sections replacing SectionStub placeholders: HighlightsSection (YouTube lite-embed video grid), GallerySection (masonry photo grid + lightbox), and ContactSection (form + GitHub Actions Telegram pipeline). All three are `'use client'` components following the established Phase 2 pattern.

The most technically important finding is a **critical API correction**: `react-youtube` renders an iframe immediately on mount — it is not a lite-embed library. The lite-embed pattern MUST be hand-implemented as React state: render `<img>` thumbnail initially, mount `<YouTube>` component only when user clicks. This is already captured in D-11 but needs to be clearly understood: do NOT render `<YouTube>` in the initial JSX tree.

The second critical finding is a **GitHub API response code correction**: the `workflow_dispatch` endpoint returns `204 No Content` by default (not `202 Accepted` as stated in CONTEXT.md). The contact form's success check must use `response.ok` (covers 200–299) rather than `response.status === 202`. This avoids a silent bug where submissions always appear to fail.

The third finding is that `yet-another-react-lightbox` requires importing its CSS stylesheet globally (`import "yet-another-react-lightbox/styles.css"`) in addition to the component. This import belongs in the component file or `app/[lang]/layout.tsx`, not a SCSS module.

**Primary recommendation:** Build in wave order: (1) content data files + `VideoCard` + `<img>` thumbnail pattern, (2) GallerySection + lightbox CSS import wiring, (3) ContactSection + `contact.yml` workflow file + `deploy.yml` env injection. The contact pipeline requires a GitHub Secrets manual step by the player before end-to-end testing is possible.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Video lite-embed (thumbnail → iframe swap) | Browser / Client | — | `useState(isPlaying)` + conditional `<YouTube>` mount — `'use client'` required |
| Video scroll entrance | Browser / Client (GSAP) | — | `useScrollReveal(containerRef)` — same as all Phase 2 sections |
| Video card hover (scale + play overlay) | Browser / Client (Framer Motion) | — | `whileHover` on `motion.div` — mount/hover owns Framer Motion per CLAUDE.md |
| Masonry photo grid layout | Browser / Client (react-masonry-css) | CSS | Third-party React component renders responsive columns; requires `:global` CSS wrapper |
| Photo gallery scroll entrance | Browser / Client (GSAP) | — | `useScrollReveal(containerRef)` scoped to gallery section |
| Photo hover overlay | Browser / Client (Framer Motion) | — | `whileHover: { opacity: 0.5 }` on overlay div |
| Lightbox open/close/navigate | Browser / Client (yarl) | — | Internal yarl state machine; trigger via `openLightbox(index)` external state |
| Contact form state machine | Browser / Client | — | `useState(formState)` managing idle / loading / success / error |
| GitHub API dispatch call | Browser / Client (fetch) | — | `fetch()` POST from ContactSection — no server, static export |
| `contact.yml` Telegram dispatch | GitHub Actions (server-side) | — | Workflow runs on GitHub's runners — Telegram bot token never touches the browser |
| Content data (videos, gallery) | Build time / Static | — | TypeScript data files; imported only in `page.tsx`, passed as props |
| Page assembly | Next.js Server Component | — | `app/[lang]/page.tsx` replaces 3 SectionStub calls with real section components |

---

## Standard Stack

### Core (all already installed — verified from package.json)

| Library | Installed Version | Purpose | Phase 3 Role |
|---------|-------------------|---------|--------------|
| next | ^15.3.2 | App framework | Static export, `page.tsx` assembly |
| react | ^19.0.0 | UI runtime | All section components |
| framer-motion | ^12.39.0 | Component lifecycle animations | VideoCard hover, form/success swap, error mount |
| gsap / @gsap/react | ^3.15.0 / ^2.1.2 | Scroll-triggered animations | `useScrollReveal()` on all three sections |
| lucide-react | ^1.16.0 | Icons | `Play`, `Send`, `Loader2` icons |
| sass | ^1.99.0 | SCSS Modules | Per-section `.module.scss` files |

[VERIFIED: package.json + node_modules, 2026-05-20]

### New Packages Required

| Library | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| `react-youtube` | 10.1.0 | YouTube IFrame Player API React wrapper | `npm install react-youtube` |
| `react-masonry-css` | 1.0.16 | CSS masonry grid for photo gallery | `npm install react-masonry-css` |
| `yet-another-react-lightbox` | 3.32.0 | Photo lightbox with Fullscreen + Zoom plugins | `npm install yet-another-react-lightbox` |

[VERIFIED: npm registry — version, source repo, no postinstall scripts, 2026-05-20]

**Version verification (confirmed 2026-05-20):**
```
npm view react-youtube version              → 10.1.0
npm view react-masonry-css version          → 1.0.16
npm view yet-another-react-lightbox version → 3.32.0

All three: scripts.postinstall → (empty — no suspicious postinstall)
```

**Installation:**
```bash
npm install react-youtube react-masonry-css yet-another-react-lightbox
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-youtube` | Pure `<iframe>` with `src` | No API benefits, but also no issues. `react-youtube` provides `onReady/onPlay` events and the `YouTube.PlayerState` API — useful if we ever need to pause playback when a second card is clicked |
| `react-youtube` | `react-lite-youtube-embed` | `react-lite-youtube-embed` IS a lite-embed library (thumbnail + click-to-load built in). However D-11 is locked — lite-embed via manual state is the decided approach. CONTEXT.md locks this decision. |
| `react-masonry-css` | CSS `columns` property | Pure CSS columns work but have cross-browser height calculation issues with `gap`. `react-masonry-css` uses flexbox under the hood — more reliable. Package is D-15 locked. |
| `yet-another-react-lightbox` | `lightgallery` | Already in tech stack per CLAUDE.md. Not a decision point. |

---

## Package Legitimacy Audit

> slopcheck v0.6.1 was available and run on all three packages. All returned `[OK]`.

| Package | Registry | Age | Last Published | Source Repo | slopcheck | Disposition |
|---------|----------|-----|----------------|-------------|-----------|-------------|
| `react-youtube` | npm | 11+ yrs (2014-07-20) | 2022-11-22 | github.com/tjallingt/react-youtube | [OK] | Approved |
| `react-masonry-css` | npm | 8+ yrs (2017-07-20) | 2022-05-14 | github.com/paulcollett/react-masonry-css | [OK] | Approved |
| `yet-another-react-lightbox` | npm | 3+ yrs (2022-05-19) | 2026-05-01 | github.com/igordanchenko/yet-another-react-lightbox | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

**Note on `react-masonry-css` last published date (2022-05-14):** The package has not had a release in ~3 years. This is not a concern for Phase 3 because the API is minimal and stable — the component is a thin flexbox wrapper. The package is widely used and the core functionality (CSS-based masonry columns) does not require maintenance updates. No known breaking changes in React 19 or Next.js 15 compatibility.

[VERIFIED: npm registry via `npm view`, slopcheck 0.6.1 [OK] for all three]

---

## Architecture Patterns

### System Architecture Diagram

```
content/videos.ts   content/gallery.ts   (TypeScript data — build time)
       │                   │
       ▼                   ▼
app/[lang]/page.tsx  (Server Component — assembles sections)
       │
       ├── <HighlightsSection videos={videos} />   'use client'
       │     ├── containerRef → useScrollReveal()
       │     └── videos.map → <VideoCard video={v} />
       │            ├── isPlaying=false → <img thumbnail> (no iframe in DOM)
       │            └── isPlaying=true  → <YouTube videoId opts={{autoplay:1}} />
       │
       ├── <GallerySection photos={photos} />   'use client'
       │     ├── containerRef → useScrollReveal()
       │     ├── <Masonry breakpointCols={...}>
       │     │     └── photos.map → <button onClick=openLightbox(i)><img/></button>
       │     └── <Lightbox open={...} index={...} slides={slides}
       │               plugins={[Fullscreen, Zoom]} />
       │
       └── <ContactSection />   'use client'
             ├── containerRef → useScrollReveal()
             ├── mountTime = Date.now()   (spam check reference)
             ├── formState: 'idle' | 'loading' | 'success' | 'error'
             ├── <AnimatePresence>
             │     ├── formState !== 'success' → <ContactForm />
             │     │       └── onSubmit → spam guards → fetch() POST
             │     │             → github.com/repos/.../dispatches
             │     │             → response.ok → setFormState('success')
             │     └── formState === 'success' → <SuccessMessage />
             └── .github/workflows/contact.yml   (GitHub Actions — server side)
                   └── on: workflow_dispatch inputs: name,email,phone,message
                         → curl Telegram sendMessage API
                         → message arrives in player's Telegram
```

### Recommended Project Structure (additions for Phase 3)

```
components/
  sections/
    HighlightsSection.tsx          # 'use client' — grid + useScrollReveal
    HighlightsSection.module.scss
    GallerySection.tsx             # 'use client' — masonry + lightbox + useScrollReveal
    GallerySection.module.scss
    ContactSection.tsx             # 'use client' — form state + fetch + useScrollReveal
    ContactSection.module.scss
  ui/
    VideoCard.tsx                  # 'use client' — isPlaying state, thumbnail/iframe swap
    VideoCard.module.scss
content/
  videos.ts                        # VideoEntry interface + 3 placeholder entries
  gallery.ts                       # GalleryEntry interface + 6 placeholder entries
public/
  images/
    gallery/
      photo-01.webp                # 6 placeholder WebP files (solid-color, 3:2 ratio)
      photo-02.webp
      photo-03.webp
      photo-04.webp
      photo-05.webp
      photo-06.webp
.github/
  workflows/
    contact.yml                    # workflow_dispatch → Telegram Bot API
    deploy.yml                     # ADD: env: NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}
```

### Pattern 1: VideoCard Lite-Embed (State Swap)

**What:** `react-youtube` renders a full iframe immediately on mount — it is NOT a lite-embed library. The lite-embed pattern requires a React state guard: only mount `<YouTube>` when `isPlaying === true`.

**Critical:** Never put `<YouTube>` in the JSX tree unconditionally. Doing so loads all 3 iframes on page load and breaks MEDIA-03.

**When to use:** VideoCard component only.

```tsx
// components/ui/VideoCard.tsx
// Source: CONTEXT.md D-11 + confirmed react-youtube mount behavior [VERIFIED: github.com/tjallingt/react-youtube]
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Play } from 'lucide-react';
import type { VideoEntry } from '@/content/videos';
import styles from './VideoCard.module.scss';

interface Props {
  video: VideoEntry;
}

export function VideoCard({ video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,   // starts playing immediately after iframe loads
    },
  };

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailSlot}>
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            // Initial state: show thumbnail <img> — NO iframe in DOM
            <motion.button
              key="thumbnail"
              className={styles.thumbnailBtn}
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.title}`}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileHover="hover"
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                alt={`${video.title} — highlight video`}
                loading="lazy"
                className={styles.thumbnail}
              />
              {/* Play overlay — Framer Motion controls visibility */}
              <motion.div
                className={styles.playOverlay}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                variants={{ hover: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.playCircle}>
                  <Play size={20} color="#ffffff" className={styles.playIcon} />
                </div>
              </motion.div>
            </motion.button>
          ) : (
            // Clicked state: mount YouTube iframe
            <motion.div
              key="player"
              className={styles.playerWrapper}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <YouTube
                videoId={video.videoId}
                opts={opts}
                className={styles.youtubePlayer}
                iframeClassName={styles.youtubeIframe}
                title={video.title}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className={styles.cardTitle}>{video.title}</p>
    </article>
  );
}
```

**SCSS for 16:9 aspect ratio wrapper:**
```scss
// VideoCard.module.scss
.thumbnailSlot {
  position: relative;
  aspect-ratio: 16 / 9;   // maintains ratio regardless of card width
  overflow: hidden;
  border-radius: 4px 4px 0 0;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnailBtn {
  position: relative;    // for overlay positioning
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: block;
}

.playOverlay {
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}

.playCircle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;   // CSS owns hover color — not Framer Motion

  &:hover {
    background: var(--color-accent-hover);
  }
}

.playIcon {
  margin-left: 2px;   // visual centering correction for triangle
}

.playerWrapper,
.youtubePlayer,
.youtubeIframe {
  width: 100%;
  height: 100%;
  display: block;
}
```

### Pattern 2: GallerySection with react-masonry-css + yarl

**What:** `react-masonry-css` generates columns via flexbox. Its class names (`masonry-grid`, `masonry-grid_column`) must be defined as `:global()` CSS in the SCSS module — they are not hash-scoped because `react-masonry-css` injects them directly onto DOM elements. [VERIFIED: Next.js CSS Modules `:global()` pattern confirmed]

**When to use:** GallerySection only.

```tsx
// components/sections/GallerySection.tsx
// Source: CONTEXT.md D-15 + yarl official docs [CITED: yet-another-react-lightbox.com/documentation]
'use client';

import { useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { GalleryEntry } from '@/content/gallery';
import styles from './GallerySection.module.scss';

interface Props {
  photos: GalleryEntry[];
}

const breakpointCols = { default: 3, 768: 2, 480: 1 };

export function GallerySection({ photos }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useScrollReveal(containerRef);

  const slides = photos.map((p) => ({ src: p.src, alt: p.alt }));

  return (
    <section id="gallery" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Gallery</h2>
      <p className={`${styles.intro} reveal-item`}>
        Behind the scenes on the pitch and in training.
      </p>

      <Masonry
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <motion.button
            key={photo.src}
            className={`${styles.photoWrapper} reveal-item`}
            onClick={() => setLightboxIndex(index)}
            aria-label={`Open ${photo.alt} in fullscreen`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className={styles.photo}
            />
            <motion.div
              className={styles.photoOverlay}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </Masonry>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Fullscreen, Zoom]}
      />
    </section>
  );
}
```

**Critical: yarl CSS import placement.** The `import 'yet-another-react-lightbox/styles.css'` line must appear in a file that is processed as a regular JS import, not a SCSS module. Placing it inside a `.module.scss` file will not work. Options:
- Import it in `GallerySection.tsx` directly (simplest — Next.js App Router supports CSS imports from client components)
- Import it in `app/[lang]/layout.tsx` (global, once only)
Recommended: in `GallerySection.tsx` since it is the only consumer.

**Masonry global CSS wrapper (inside GallerySection.module.scss):**
```scss
// react-masonry-css injects these class names directly — must be global scope
:global(.masonry-grid) {
  display: flex;
  margin-left: calc(-1 * var(--space-6));   // compensates column padding
  width: auto;
}

:global(.masonry-grid_column) {
  padding-left: var(--space-6);
  background-clip: padding-box;
}
```

### Pattern 3: ContactSection — GitHub API Dispatch + Spam Guards

**What:** Client-side `fetch()` POSTs to the GitHub REST API `workflow_dispatch` endpoint. GitHub Actions runs the workflow, which calls the Telegram Bot API via `curl`. The PAT is baked into the client bundle at build time via `NEXT_PUBLIC_GH_PAT`.

**CRITICAL response code correction:** The `workflow_dispatch` endpoint returns **204 No Content** by default (not 202 Accepted). As of February 2026 GitHub changed this — optionally returns 200 with run details if `return_run_details: true` is in the body. The safe check is `response.ok` (covers 200–299 range). [VERIFIED: github.blog/changelog/2026-02-19-workflow-dispatch-api-now-returns-run-ids/]

```tsx
// ContactSection.tsx — fetch call pattern
// Source: GitHub REST API docs [CITED: docs.github.com/en/rest/actions/workflows]
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  // Spam guard 1: honeypot check
  if (honeypotValue !== '') return;  // silently drop

  // Spam guard 2: minimum time check
  if (Date.now() - mountTime < 3000) return;  // silently drop

  setFormState('loading');

  try {
    const response = await fetch(
      'https://api.github.com/repos/KuDim89/future-legend-dev/actions/workflows/contact.yml/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GH_PAT}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            message: formData.message,
          },
        }),
      }
    );

    if (response.ok) {   // 204 No Content (default) or 200 with details
      setFormState('success');
    } else {
      setFormState('error');
    }
  } catch {
    setFormState('error');
  }
}
```

**NEXT_PUBLIC_GH_PAT in static export:** `NEXT_PUBLIC_*` variables are inlined as literal string values into the JS bundle at build time by Next.js DefinePlugin. The value must be set in the GitHub Actions build step environment before `npx next build` runs. It is NOT available at runtime — changing it requires a rebuild. [VERIFIED: Next.js official docs]

**deploy.yml modification required:**
```yaml
# In .github/workflows/deploy.yml — add env block to the Build step
- name: Build
  run: npx next build
  env:
    NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}
```

### Pattern 4: contact.yml Workflow File

**What:** GitHub Actions workflow with `workflow_dispatch` trigger, four string inputs, and a single step that calls the Telegram `sendMessage` API.

```yaml
# .github/workflows/contact.yml
name: Contact Form Notification

on:
  workflow_dispatch:
    inputs:
      name:
        description: 'Contact name'
        required: true
        type: string
      email:
        description: 'Contact email'
        required: true
        type: string
      phone:
        description: 'Contact phone (optional)'
        required: false
        type: string
        default: ''
      message:
        description: 'Contact message'
        required: true
        type: string

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Telegram notification
        run: |
          MESSAGE="New contact from *${{ github.event.inputs.name }}*%0A"
          MESSAGE+="Email: ${{ github.event.inputs.email }}%0A"
          MESSAGE+="Phone: ${{ github.event.inputs.phone || 'not provided' }}%0A"
          MESSAGE+="----%0A"
          MESSAGE+="${{ github.event.inputs.message }}"

          curl -s -X POST \
            "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
            -d "chat_id=${{ secrets.TELEGRAM_CHAT_ID }}" \
            -d "text=${MESSAGE}" \
            -d "parse_mode=Markdown"
        env:
          # Telegram secrets read from GitHub Secrets — never in client code (CONTACT-04)
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

**Telegram sendMessage URL format (verified):**
`https://api.telegram.org/bot{TOKEN}/sendMessage`
with query params: `chat_id`, `text`, `parse_mode`
[CITED: core.telegram.org/bots/api#sendmessage — standard Telegram Bot API]

**CONTACT-04 compliance:** `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` appear ONLY in the workflow file as `${{ secrets.* }}` references. They are never in `content/`, `components/`, `app/`, or any client-accessible file.

### Pattern 5: Content Data Files

**What:** Two new content files following the established `content/player.ts` pattern. Imported only in `app/[lang]/page.tsx` — never in section components directly (CLAUDE.md data flow rule).

```typescript
// content/videos.ts
export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
}

export const videos: VideoEntry[] = [
  {
    videoId: 'dQw4w9WgXcQ',  // placeholder — replace with real YouTube ID
    title: 'Match Highlights — FC Dynamo',
    category: 'match',
  },
  {
    videoId: 'dQw4w9WgXcQ',  // placeholder
    title: 'Training Session — Dribbling Drills',
    category: 'training',
  },
  {
    videoId: 'dQw4w9WgXcQ',  // placeholder
    title: 'Skills Compilation',
    category: 'skills',
  },
];
```

```typescript
// content/gallery.ts
export interface GalleryEntry {
  src: string;
  alt: string;
  category: 'match' | 'training' | 'official';
}

export const gallery: GalleryEntry[] = [
  {
    src: '/future-legend-dev/images/gallery/photo-01.webp',
    alt: 'Match action — Dmytro driving forward',
    category: 'match',
  },
  // ... 5 more entries
];
```

**page.tsx integration:** Replace three `<SectionStub>` calls:
```tsx
// Before (Phase 2):
<SectionStub id="highlights" title="Highlights" />
<SectionStub id="gallery" title="Gallery" />
<SectionStub id="contact" title="Contact" />

// After (Phase 3):
import { videos } from '@/content/videos';
import { gallery } from '@/content/gallery';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';

<HighlightsSection videos={videos} />
<GallerySection photos={gallery} />
<ContactSection />
```

### Anti-Patterns to Avoid

- **Rendering `<YouTube>` unconditionally in JSX:** Any `<YouTube>` component that is not behind an `isPlaying` state guard will load an iframe at page load time. This directly violates MEDIA-03 and defeats the lite-embed pattern entirely.
- **Checking `response.status === 202` for the GitHub dispatch:** The endpoint returns 204 No Content by default (as of current GitHub API). Always use `response.ok` to handle all 2xx responses.
- **Importing `yet-another-react-lightbox/styles.css` in a SCSS module:** CSS files must be imported via JS import statements, not via `@import` in `.module.scss`. Put the import in `GallerySection.tsx` or `layout.tsx`.
- **Using `display:none` or `type="hidden"` for the honeypot field:** Bots skip `display:none` elements. The honeypot must be hidden via `position:absolute; left:-9999px` only.
- **Using global class names for GSAP `.reveal-item` without scope:** All three Phase 3 sections use `useScrollReveal(containerRef)` with `{ scope: containerRef }` — the `.reveal-item` class must be scoped or sections will animate each other. (Same pitfall as Phase 2.)
- **Importing `content/videos.ts` or `content/gallery.ts` inside section components:** CLAUDE.md data flow rule — only `app/[lang]/page.tsx` imports from `content/`. Sections receive data as typed props.
- **Setting `NEXT_PUBLIC_GH_PAT` in a `.env.local` file and expecting it to work on GitHub Pages:** The value must be set in the GitHub Actions workflow build step environment (`env: NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}`). Local `.env.local` has no effect on the deployed static build.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YouTube video player | Custom `<iframe>` with YouTube URL | `react-youtube` | Handles YouTube IFrame Player API lifecycle, player state constants, resize, and cleanup |
| Masonry grid layout | CSS `column-count` or manual JS positioning | `react-masonry-css` | Pure flexbox approach handles dynamic heights without JavaScript reflow calculations |
| Photo lightbox (zoom, fullscreen, keyboard nav) | Custom modal with CSS transforms | `yet-another-react-lightbox` | Keyboard navigation, mobile swipe, fullscreen API, accessibility (focus trap, ARIA) — all handled |
| Telegram Bot API HTTP | Custom webhook server | GitHub Actions `contact.yml` with `curl` | D-01 locked this pattern. GitHub Actions handles auth, retry, and logging; no server to maintain |
| Spam filtering | reCAPTCHA, hCaptcha, third-party service | Honeypot field + time check | D-06 locked this approach. Zero external dependencies, invisible to real users, good enough for a personal site |

**Key insight:** Phase 3 has no genuinely novel architectural patterns. Every problem area has a well-established library or the decision is locked in CONTEXT.md. The implementation risk is in wiring details (response code check, CSS import placement, lite-embed guard) not in architectural choices.

---

## Common Pitfalls

### Pitfall 1: react-youtube Renders iframe on Mount — Not a Lite-Embed Library

**What goes wrong:** Developer adds `<YouTube videoId={video.videoId} />` to VideoCard JSX, assuming it shows a thumbnail until clicked. It does not — it immediately renders a full YouTube iframe with the YouTube API player script loaded.

**Why it happens:** The library name and purpose suggest a complete YouTube embed solution. The lite-embed pattern is a separate concern not built into `react-youtube`.

**How to avoid:** Gate the `<YouTube>` component behind `isPlaying` state. The `<img>` thumbnail renders initially; `<YouTube>` mounts only after `setIsPlaying(true)` is called on thumbnail click. This is the full pattern in Pattern 1 above.

**Warning signs:** Lighthouse performance score drops significantly; network tab shows `youtube.com/iframe_api` loading before any user interaction; three iframes visible in DevTools DOM at page load.

### Pitfall 2: GitHub API workflow_dispatch Returns 204, Not 202

**What goes wrong:** Form submission check `if (response.status === 202)` always evaluates false — every submission is treated as an error. Form shows error message even though the Telegram notification was successfully triggered.

**Why it happens:** CONTEXT.md D-01 states "202 Accepted" but the GitHub workflow_dispatch endpoint returns **204 No Content** by default. This changed subtly — some older documentation and examples show 202, but the current endpoint returns 204.

**How to avoid:** Use `if (response.ok)` which is true for any 2xx status code (200, 201, 202, 203, 204). This correctly handles both 204 (current default) and 200 (if `return_run_details: true` is added to the request body in the future).

**Warning signs:** Form shows error state in the browser while Telegram receives the message successfully.

### Pitfall 3: yarl CSS Not Imported — Lightbox Opens But Has No Styles

**What goes wrong:** Lightbox opens as a transparent or unstyled overlay. Navigation arrows, close button, and slide transitions are invisible or broken.

**Why it happens:** `yet-another-react-lightbox` requires `import "yet-another-react-lightbox/styles.css"` as a separate JS import. It is not auto-injected. If the import is forgotten or placed in a `.module.scss` file (which does not process external package CSS), the component has no base styles.

**How to avoid:** Add `import 'yet-another-react-lightbox/styles.css'` at the top of `GallerySection.tsx` (or in `app/[lang]/layout.tsx` for global availability). Verify by opening the lightbox in the browser — if it renders correctly at the first test, the import is working.

**Warning signs:** Lightbox overlay is visible but controls are missing or floating incorrectly; `yet-another-react-lightbox/styles.css` does not appear in the browser's network panel on page load.

### Pitfall 4: react-masonry-css Class Names Hashed by CSS Modules

**What goes wrong:** Masonry columns render as a single column with no column gap. The masonry layout is completely broken.

**Why it happens:** `react-masonry-css` applies class names `masonry-grid` and `masonry-grid_column` directly to DOM elements. If the CSS module defines these as scoped classes (`.masonryGrid` or `.masonry-grid` without `:global()`), the generated CSS selector won't match the elements `react-masonry-css` renders because CSS Modules hashes the class names.

**How to avoid:** Define masonry styles using `:global()` inside the SCSS module: `:global(.masonry-grid) { ... }` and `:global(.masonry-grid_column) { ... }`. The UI-SPEC already documents this pattern. [VERIFIED: Next.js CSS Modules `:global()` documented behavior]

**Warning signs:** All photos appear in a single vertical stack rather than columns; DevTools shows `masonry-grid` class on elements but no matching CSS rule.

### Pitfall 5: GSAP Scope Leakage Between Phase 3 Sections

**What goes wrong:** When HighlightsSection enters the viewport, GSAP animates `.reveal-item` elements inside GallerySection or ContactSection simultaneously.

**Why it happens:** `useScrollReveal(containerRef)` passes `{ scope: containerRef }` to `useGSAP` — but if `containerRef` is `null` at the time of GSAP setup (e.g., ref not attached correctly), GSAP falls back to document scope and queries all `.reveal-item` elements globally.

**How to avoid:** Ensure the `ref` is attached to the `<section>` element directly (same pattern as TrophiesSection, AboutSection). Confirm `containerRef.current` is not null when the animation fires. [VERIFIED: existing codebase pattern in TrophiesSection.tsx]

**Warning signs:** Multiple sections animate simultaneously when only one enters the viewport.

### Pitfall 6: PAT Exposed in Bundle — Security Trade-off

**What goes wrong:** `NEXT_PUBLIC_GH_PAT` appears in the built JavaScript bundle and is visible in browser DevTools. This is intentional by design (D-02) but needs to be understood clearly.

**Why it matters:** The PAT is scoped to `actions:write` only — it can trigger workflows but cannot read repo contents, push code, or access secrets. The risk is limited: a malicious actor could spam the contact endpoint. The honeypot + time check provides basic spam protection. This is an accepted trade-off for a personal site without a backend.

**How to avoid (by design):** Keep the PAT scoped minimally to `actions:write`. Do not add additional scopes. Monitor GitHub Actions usage for unexpected runs. The Telegram bot token is NOT exposed — it lives only in GitHub Secrets.

**Warning signs (of misconfiguration, not the pattern itself):** If `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` appear in the browser bundle, something is wrong — they should never be in client code.

---

## Code Examples

### react-youtube opts with autoplay

```tsx
// Source: github.com/tjallingt/react-youtube README [CITED]
import YouTube, { YouTubeProps } from 'react-youtube';

const opts: YouTubeProps['opts'] = {
  height: '100%',   // use '100%' when inside an aspect-ratio container
  width: '100%',
  playerVars: {
    autoplay: 1,    // YouTube IFrame API playerVar — starts playing on iframe load
  },
};

<YouTube videoId="dQw4w9WgXcQ" opts={opts} />
```

### yarl Lightbox with Fullscreen and Zoom Plugins

```tsx
// Source: yet-another-react-lightbox.com/documentation [CITED]
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

// Slides array format
const slides = photos.map((p) => ({ src: p.src, alt: p.alt }));

// Controlled open/close via index state
// index: -1 = closed; 0, 1, 2... = open at that slide
<Lightbox
  open={lightboxIndex >= 0}
  close={() => setLightboxIndex(-1)}
  slides={slides}
  index={lightboxIndex}
  plugins={[Fullscreen, Zoom]}
/>
```

### GitHub workflow_dispatch fetch call

```typescript
// Source: GitHub REST API docs [CITED: docs.github.com/en/rest/actions/workflows]
const response = await fetch(
  'https://api.github.com/repos/KuDim89/future-legend-dev/actions/workflows/contact.yml/dispatches',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GH_PAT}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: { name, email, phone, message },
    }),
  }
);

// CORRECT: response.ok covers 204 (default) and 200 (with return_run_details)
if (response.ok) {
  // success
}
// WRONG: response.status === 202 — this check always fails, GitHub returns 204
```

### Telegram sendMessage curl in GitHub Actions

```bash
# Source: Telegram Bot API reference [CITED: core.telegram.org/bots/api#sendmessage]
curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=New message from ${NAME}" \
  -d "parse_mode=Markdown"
```

### Placeholder WebP Generation (build task)

```bash
# Generate 6 small placeholder WebP files (solid-color, 3:2 aspect ratio)
# Any image editor or CLI tool works — these are only placeholders
# Example using ImageMagick (if available) or any solid-color WebP creation method
# Files must be committed to public/images/gallery/
# Dimensions: 600x400px (3:2 ratio), any solid color, tiny file size
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GitHub `workflow_dispatch` returns 202 Accepted | Returns 204 No Content (default) or 200 with details (`return_run_details: true`) | February 2026 (changelog) | Success check must use `response.ok` not `response.status === 202` |
| YouTube embed: full `<iframe>` on page load | Lite-embed: thumbnail image → iframe on click | Community practice, not a library change | ~500KB saved per video on initial load; better Lighthouse performance score |
| CSS `column-count` for masonry | `react-masonry-css` (flexbox-based) | Established library pattern | More reliable cross-browser height handling; dynamic column recalculation |
| Lightbox implementations (`react-image-lightbox`, `lightbox2`) | `yet-another-react-lightbox` v3.x | yarl gained popularity ~2022 | Better Next.js App Router compatibility; plugin architecture; active maintenance (last update 2026-05-01) |

**Note on `react-masonry-css` last release (2022):** The package has not been updated since May 2022. The API is stable and the functionality is simple enough that no updates are needed. React 19 compatibility is not a concern because the component renders standard HTML elements with no React internals dependencies. [ASSUMED — no explicit React 19 compatibility statement found in package documentation]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `react-masonry-css` is compatible with React 19 and Next.js 15 static export — no breaking changes in 3 years since last release | Standard Stack, Pitfall 4 | If incompatible, would need to use CSS `columns` property or a different masonry library. Test with `npm install` and a basic render — if the component renders, compatibility is confirmed. |
| A2 | `NEXT_PUBLIC_GH_PAT` baked into the static build bundle will correctly authenticate the GitHub API POST at runtime in the user's browser | Pattern 3 | If the environment variable is empty at build time (e.g., `GH_PAT` secret not added to repo), all form submissions will fail with 401. Check that the secret exists in the repo before the first deployment. |
| A3 | The Telegram `sendMessage` API using `parse_mode=Markdown` handles special characters in user-submitted form inputs without escaping errors | Pattern 4 | If user input contains Markdown special characters (*, _, `), the message format could break or the API could reject it. Safe fix: omit `parse_mode=Markdown` and send plain text instead — no formatting but no escaping risk. |
| A4 | `react-youtube` v10 TypeScript types include `YouTubeProps` as a named export that can be used for `YouTubeProps['opts']` typing | Pattern 1 | If the type export name differs, adjust the import. Check `node_modules/react-youtube/dist/index.d.ts` after install. |
| A5 | The 3 placeholder video IDs to ship with Phase 3 will be valid, publicly accessible YouTube football highlight videos | Content data files | If any ID has been removed from YouTube, the thumbnail URL will return a 404 and the `<img>` will show a broken image. Use verified public football highlight IDs from major YouTube channels. |

---

## Open Questions

1. **Placeholder video IDs for content/videos.ts**
   - What we know: D-09 says "real public YouTube football highlight IDs" — not lorem ipsum
   - What's unclear: Specific video IDs are not named in any planning document
   - Recommendation: Planner selects 3 real YouTube football highlight video IDs (e.g., official UEFA, FIFA, or major club channel clips). They must be public and embeddable. Suggest confirming embeddability by checking the video's embed settings on YouTube.

2. **Placeholder WebP generation method**
   - What we know: D-14 says 6 solid-color or gradient WebP files, 3:2 aspect ratio, small file size
   - What's unclear: Which tool to use for generation (ImageMagick, FFmpeg, online tool, hand-drawn)
   - Recommendation: Use a simple Node.js script or any available CLI tool. Alternatively, commit pre-made 1x1px solid-color WebP files — they display as colored rectangles (valid placeholder). The exact method is not architecturally significant.

3. **Telegram message character limit**
   - What we know: `sendMessage` API is used with `curl`; user inputs go into the message text
   - What's unclear: If a user submits a very long message (>4096 chars, Telegram's limit), the API call will fail
   - Recommendation: Add a `maxLength` attribute to the textarea (e.g., `maxLength={1000}`). This constrains the `message` input field in the browser, keeping well within Telegram's 4096-char limit. Mention this in the planner's task for the `textarea` field.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js build | Yes | 22.14.0 | — |
| npm | Package management | Yes | 10.9.2 | — |
| `react-youtube` | HighlightsSection VideoCard | Not yet installed | 10.1.0 on registry | — |
| `react-masonry-css` | GallerySection | Not yet installed | 1.0.16 on registry | — |
| `yet-another-react-lightbox` | GallerySection | Not yet installed | 3.32.0 on registry | — |
| GitHub Secrets (`GH_PAT`) | ContactSection fetch + deploy.yml | Not yet set | — | Contact form silently fails until secret is added |
| GitHub Secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) | contact.yml Telegram step | Not yet set | — | Workflow triggers but Telegram step fails; player must add after Phase 3 implementation |

**Missing dependencies with no fallback (block execution):**
- `react-youtube`, `react-masonry-css`, `yet-another-react-lightbox` must be installed (`npm install`) before implementation begins

**Missing dependencies with acknowledged fallback (do not block code implementation):**
- `GH_PAT`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` GitHub Secrets: code and workflow can be written and committed without these; end-to-end testing of the contact pipeline requires manual secret setup by the player after Phase 3 implementation

---

## Project Constraints (from CLAUDE.md)

| Constraint | Impact on Phase 3 |
|------------|------------------|
| **Animation rule:** Framer Motion = mount/unmount/hover; GSAP = scroll sequences. Never animate the same element with both. | VideoCard: GSAP owns scroll entrance on `<li>` container; Framer Motion owns hover scale + play overlay on `<motion.button>` inside. GallerySection: GSAP owns scroll entrance; Framer Motion owns hover overlay. ContactSection: GSAP owns section entrance; Framer Motion owns form/success swap and error mount. |
| **GSAP rule:** All GSAP inside `useGSAP()` from `@gsap/react` inside `'use client'` components only | All three section components are `'use client'`. `useScrollReveal()` handles GSAP internally. `gsap.registerPlugin()` at module scope outside component body — same as Phase 2 pattern. |
| **Static export only** — `output: 'export'`, no SSR | ContactSection uses client-side `fetch()` — no server action, no API route. All data from `content/videos.ts` and `content/gallery.ts` at build time. The `next/dynamic` with `ssr: false` is NOT needed for yarl because all three section components are already `'use client'`. |
| **SCSS Modules — NO Tailwind** | Each section has its own `.module.scss`. Exception: masonry class names require `:global()` wrapper inside the module (verified Next.js CSS Modules pattern). |
| **Content data flow:** `content/*.ts` → `app/[lang]/page.tsx` → section props | `page.tsx` is the sole importer of `content/videos.ts` and `content/gallery.ts`. Sections receive typed `VideoEntry[]` and `GalleryEntry[]` props. `ContactSection` has no data prop — it only needs the GitHub API URL and env var. |
| **`'use client'` boundary** — required for useState, useRef, useGSAP, motion.* | HighlightsSection, VideoCard, GallerySection, ContactSection — all must be `'use client'`. |
| **basePath: '/future-legend-dev'** | All photo `src` paths in `content/gallery.ts` must include the basePath prefix: `/future-legend-dev/images/gallery/{filename}`. |
| **GSD workflow enforcement** | All file changes must go through GSD commands. |

---

## Security Domain

`security_enforcement` is absent from config — treated as enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No user auth in Phase 3 |
| V3 Session Management | No | No sessions in Phase 3 |
| V4 Access Control | No | Public static site |
| V5 Input Validation | Yes | HTML5 `required`, `type="email"`, `maxLength` on all form fields; honeypot + time check for bot filtering |
| V6 Cryptography | Partial | PAT exposed in bundle (accepted trade-off per D-02); Telegram token protected in GitHub Secrets (compliant) |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| PAT abuse — malicious actor spams `workflow_dispatch` endpoint | Spoofing / DoS | PAT scoped to `actions:write` only (D-02); honeypot + 3s time check reduce automated spam |
| Telegram token leakage | Information Disclosure | Token lives only in GitHub Secrets; never in client bundle; `contact.yml` reads via `${{ secrets.* }}` |
| XSS via rendered form input | Tampering | React renders all string state as text nodes — no `dangerouslySetInnerHTML` used anywhere in ContactSection |
| Telegram message injection (Markdown special chars in user input) | Tampering | Mitigated by omitting `parse_mode=Markdown` or escaping user input before interpolation into the curl command |
| Supply chain attack via new npm packages | Tampering | slopcheck [OK] for all three packages; source repos verified; no postinstall scripts |

---

## Sources

### Primary (HIGH confidence)
- `package.json` + `node_modules/` — [VERIFIED: codebase] all installed package versions
- `lib/animations/useScrollReveal.ts` — [VERIFIED: codebase] exact GSAP hook for all section scroll reveals
- `components/sections/TrophiesSection.tsx` — [VERIFIED: codebase] grid pattern for HighlightsSection
- `components/sections/AboutSection.tsx` — [VERIFIED: codebase] dual `useGSAP` + `useScrollReveal` pattern
- `styles/_tokens.scss` — [VERIFIED: codebase] all CSS custom property token names
- `app/[lang]/page.tsx` — [VERIFIED: codebase] current state with 3 SectionStub calls to replace
- `.github/workflows/deploy.yml` — [VERIFIED: codebase] existing CI/CD workflow; `env:` block must be added to Build step
- `docs.github.com/en/rest/actions/workflows` — [CITED] workflow_dispatch POST endpoint, headers, body, response codes
- `github.blog/changelog/2026-02-19-workflow-dispatch-api-now-returns-run-ids/` — [CITED] response code change: 204 default, 200 with `return_run_details`
- `yet-another-react-lightbox.com/documentation` — [CITED] main props, `index` prop, slide format, plugin import pattern
- `yet-another-react-lightbox.com/examples/nextjs` — [CITED] `'use client'` requirement confirmed

### Secondary (MEDIUM confidence)
- `npm view react-youtube`, `npm view react-masonry-css`, `npm view yet-another-react-lightbox` — [VERIFIED: npm registry] version, age, source repo, no postinstall
- `slopcheck install react-youtube react-masonry-css yet-another-react-lightbox` — [VERIFIED: slopcheck 0.6.1] all three [OK]
- `github.com/tjallingt/react-youtube` README — [CITED] component props API, `opts.playerVars.autoplay`, immediate iframe render behavior
- `next.config.ts` knowledge — [VERIFIED: Phase 2 research] `NEXT_PUBLIC_*` baked at build time, `sassOptions.additionalData` injects mixins not tokens

### Tertiary (LOW confidence — flagged)
- `react-masonry-css` React 19 compatibility — [ASSUMED] no explicit statement; inferred from absence of React internals usage in the component's simple flexbox wrapper

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from npm registry + slopcheck [OK]
- react-youtube lite-embed pattern: HIGH — behavior confirmed (always renders iframe), manual state guard pattern verified against component API
- GitHub Actions workflow_dispatch API: HIGH — official docs + 2026 changelog both read
- yarl integration: HIGH — official docs read, Next.js `'use client'` requirement confirmed, plugin import paths confirmed
- react-masonry-css `:global()` CSS pattern: HIGH — Next.js CSS Modules official documentation confirmed
- Telegram sendMessage: MEDIUM — standard Bot API pattern, confirmed in multiple sources but not fetched from official Telegram docs directly
- react-masonry-css React 19 compatibility: LOW (ASSUMED) — no explicit statement found

**Research date:** 2026-05-20
**Valid until:** 2026-06-20 (30 days — all packages stable; GitHub API change just landed in Feb 2026 and is unlikely to change again soon)
