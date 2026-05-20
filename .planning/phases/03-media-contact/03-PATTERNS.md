# Phase 3: Media & Contact — Pattern Map

**Mapped:** 2026-05-20
**Files analyzed:** 12 new/modified files
**Analogs found:** 10 / 12

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `components/sections/HighlightsSection.tsx` | section | request-response (scroll reveal + click) | `components/sections/TrophiesSection.tsx` | exact |
| `components/sections/HighlightsSection.module.scss` | styles | — | `components/sections/TrophiesSection.module.scss` | exact |
| `components/ui/VideoCard.tsx` | component | event-driven (click toggles state) | `components/sections/HeroSection.tsx` | role-match (Framer Motion patterns) |
| `components/ui/VideoCard.module.scss` | styles | — | `components/sections/TrophiesSection.module.scss` | role-match |
| `components/sections/GallerySection.tsx` | section | event-driven (click opens lightbox) | `components/sections/TrophiesSection.tsx` | role-match |
| `components/sections/GallerySection.module.scss` | styles | — | `components/sections/TrophiesSection.module.scss` | role-match |
| `components/sections/ContactSection.tsx` | section | request-response (form → fetch → GitHub API) | `components/sections/AboutSection.tsx` | role-match (GSAP + Framer Motion dual pattern) |
| `components/sections/ContactSection.module.scss` | styles | — | `components/sections/AboutSection.module.scss` | role-match |
| `content/videos.ts` | content | batch (static data) | `content/player.ts` | exact |
| `content/gallery.ts` | content | batch (static data) | `content/player.ts` | exact |
| `app/[lang]/page.tsx` | page | — | `app/[lang]/page.tsx` (self-modification) | exact |
| `.github/workflows/contact.yml` | config/workflow | event-driven (workflow_dispatch → Telegram) | `.github/workflows/deploy.yml` | role-match |

---

## Pattern Assignments

### `components/sections/HighlightsSection.tsx` (section, scroll-reveal + click)

**Analog:** `components/sections/TrophiesSection.tsx`

**Imports pattern** (lines 1–7):
```typescript
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Trophy } from '@/content/player';
import styles from './TrophiesSection.module.scss';
```

Copy the same shape; swap the type import:
```typescript
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { VideoCard } from '@/components/ui/VideoCard';
import type { VideoEntry } from '@/content/videos';
import styles from './HighlightsSection.module.scss';
```

**Component signature + useScrollReveal hook** (lines 8–14):
```typescript
interface Props {
  trophies: Trophy[];
}

export function TrophiesSection({ trophies }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);
```

**Core grid pattern** (lines 16–34):
```tsx
return (
  <section id="trophies" ref={containerRef} className={styles.section}>
    <h2 className={`${styles.sectionTitle} reveal-item`}>Trophies</h2>
    <ul role="list" className={styles.grid}>
      {trophies.map((trophy) => (
        <li
          key={`${trophy.name}-${trophy.year}`}
          role="listitem"
          className={`${styles.card} reveal-item`}
        >
          <p className={styles.trophyName}>{trophy.name}</p>
        </li>
      ))}
    </ul>
  </section>
);
```

For HighlightsSection, the `<li>` body is replaced with `<VideoCard video={video} />`. The `<li>` carries `reveal-item` — the `<VideoCard>` itself is NOT a reveal-item (GSAP scope boundary). Key difference: add an intro `<p>` with `reveal-item` between the title and the grid (per UI-SPEC).

---

### `components/sections/HighlightsSection.module.scss` (styles)

**Analog:** `components/sections/TrophiesSection.module.scss`

**SCSS header comment pattern** (line 1–3):
```scss
// TrophiesSection.module.scss
// Mixins auto-injected via sassOptions.additionalData — no @use needed
// Tokens: use var(--token) — NOT $scss-variable
```

**Section padding pattern** (lines 5–11):
```scss
.section {
  padding: var(--space-16) var(--space-4);

  @include respond-to('lg') {
    padding: var(--space-24) var(--space-8);
  }
}
```

**Section title with accent underbar** (lines 13–34):
```scss
.sectionTitle {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: var(--space-12);

  @include respond-to('md') {
    font-size: var(--text-4xl);
  }

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background-color: var(--color-accent);
    margin-top: var(--space-2);
  }
}
```

**Responsive grid pattern** (lines 36–51) — copy verbatim for HighlightsSection:
```scss
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  list-style: none;
  padding: 0;
  margin: 0;

  @include respond-to('sm') {
    grid-template-columns: 1fr 1fr;
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Note: `sm` breakpoint = 640px per `_mixins.scss` line 6. The UI-SPEC says `sm` for 2-col and `lg` for 3-col — this matches TrophiesSection exactly.

---

### `components/ui/VideoCard.tsx` (component, event-driven)

**Analog:** `components/sections/HeroSection.tsx` for Framer Motion patterns; no direct codebase analog for the isPlaying state swap.

**Framer Motion import + motion.* usage pattern** from `HeroSection.tsx` (lines 1–11):
```typescript
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { Player } from '@/content/player';
import styles from './HeroSection.module.scss';
```

For VideoCard, the `motion` import is used for `AnimatePresence`, `motion.button`, `motion.div`. Pattern for `exit` and `animate` props from HeroSection lines 47–74:
```tsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.2, ease: 'easeOut' }}
>
```

**Full VideoCard pattern** (from RESEARCH.md Pattern 1 — no codebase analog exists; copy directly):
```typescript
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
    playerVars: { autoplay: 1 },
  };

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailSlot}>
        <AnimatePresence mode="wait">
          {!isPlaying ? (
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

**CRITICAL:** `<YouTube>` is ONLY rendered inside the `isPlaying === true` branch. It must never appear in the default JSX tree — that would load an iframe at page render and violate MEDIA-03.

---

### `components/ui/VideoCard.module.scss` (styles)

**Analog:** `components/sections/TrophiesSection.module.scss` for card container/border pattern; no codebase analog for aspect-ratio iframe wrapper.

**Card container pattern** from `TrophiesSection.module.scss` (lines 53–60):
```scss
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: var(--space-6);
}
```

For VideoCard, the card has no padding on the thumbnail slot — padding is only on the title area below. The `thumbnailSlot` uses `aspect-ratio` (no codebase analog — use RESEARCH.md pattern):
```scss
// VideoCard.module.scss
// Mixins auto-injected via sassOptions.additionalData — no @use needed
// Tokens: use var(--token) — NOT $scss-variable

.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;      // clips thumbnail to border-radius
}

.thumbnailSlot {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnailBtn {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: block;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.playOverlay {
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playCircle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;   // CSS owns color transition — NOT Framer Motion

  &:hover {
    background: var(--color-accent-hover);
  }
}

.playIcon {
  margin-left: 2px;   // visual centering correction for triangle shape
}

.playerWrapper,
.youtubePlayer,
.youtubeIframe {
  width: 100%;
  height: 100%;
  display: block;
}

.cardTitle {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  padding: var(--space-4);
}
```

---

### `components/sections/GallerySection.tsx` (section, event-driven)

**Analog:** `components/sections/TrophiesSection.tsx` for section shell + `useScrollReveal`; no codebase analog for masonry + lightbox pattern.

**Section shell + useScrollReveal** from `TrophiesSection.tsx` (lines 1–14):
```typescript
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Trophy } from '@/content/player';
import styles from './TrophiesSection.module.scss';

interface Props {
  trophies: Trophy[];
}

export function TrophiesSection({ trophies }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);
```

For GallerySection, add `useState` for lightbox index, the masonry import, lightbox imports, and the yarl CSS import. The full pattern (from RESEARCH.md Pattern 2):
```typescript
'use client';

import { useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';   // MUST be a JS import, not @import in scss
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { GalleryEntry } from '@/content/gallery';
import styles from './GallerySection.module.scss';
```

**Section JSX structure** — mirrors TrophiesSection `<section ref={containerRef}>` shell:
```tsx
return (
  <section id="gallery" ref={containerRef} className={styles.section}>
    <h2 className={`${styles.sectionTitle} reveal-item`}>Gallery</h2>
    <p className={`${styles.intro} reveal-item`}>
      Behind the scenes on the pitch and in training.
    </p>

    <Masonry
      breakpointCols={{ default: 3, 768: 2, 480: 1 }}
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
```

---

### `components/sections/GallerySection.module.scss` (styles)

**Analog:** `components/sections/TrophiesSection.module.scss`

Copy `.section` and `.sectionTitle` verbatim (see shared patterns below). Add masonry global wrappers and photo styles:

```scss
// GallerySection.module.scss
// Mixins auto-injected via sassOptions.additionalData — no @use needed
// Tokens: use var(--token) — NOT $scss-variable

// react-masonry-css injects class names directly onto DOM — must use :global()
// otherwise CSS Modules hashes the class names and masonry layout breaks entirely
:global(.masonry-grid) {
  display: flex;
  margin-left: calc(-1 * var(--space-6));
  width: auto;
}

:global(.masonry-grid_column) {
  padding-left: var(--space-6);
  background-clip: padding-box;
}

.photo {
  width: 100%;
  display: block;
  border-radius: 4px;
  margin-bottom: var(--space-6);   // column item gap
}

.photoWrapper {
  position: relative;
  display: block;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.photoOverlay {
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
  border-radius: 4px;
  pointer-events: none;
}

.intro {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: var(--space-12);
}
```

---

### `components/sections/ContactSection.tsx` (section, request-response)

**Analog:** `components/sections/AboutSection.tsx` for the dual-animation pattern (GSAP scroll reveal + Framer Motion component-level animation).

**Dual-animation structure** from `AboutSection.tsx` (lines 1–55):
```typescript
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import styles from './AboutSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);  // module scope — idempotent

export function AboutSection({ data }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  useScrollReveal(containerRef);   // GSAP scroll entrance

  // ... additional useGSAP block for stat bars ...
```

For ContactSection, `gsap.registerPlugin` is not needed directly (useScrollReveal handles it). The section uses `AnimatePresence` from Framer Motion for the form/success swap. Pattern for `AnimatePresence` exits from HeroSection.tsx (lines 47–75):
```tsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: 'easeOut' }}
>
```

**Full ContactSection structure:**
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import styles from './ContactSection.module.scss';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mountTime = useRef<number>(Date.now());   // spam: time check

  useScrollReveal(containerRef);

  const [formState, setFormState] = useState<FormState>('idle');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot !== '') return;                          // spam: honeypot check
    if (Date.now() - mountTime.current < 3000) return;  // spam: time check
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
          body: JSON.stringify({ ref: 'main', inputs: formData }),
        }
      );
      setFormState(response.ok ? 'success' : 'error');  // response.ok covers 204 default
    } catch {
      setFormState('error');
    }
  }

  return (
    <section id="contact" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Contact</h2>
      <p className={`${styles.intro} reveal-item`}>
        Get in touch — whether you are a scout, coach, or club representative.
      </p>

      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div
            key="success"
            role="status"
            className={`${styles.successMessage} reveal-item`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className={styles.successHeading}>Message Sent</p>
            <p>{"Your message has been sent. We'll be in touch soon."}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={`${styles.form} reveal-item`}
            onSubmit={handleSubmit}
            aria-busy={formState === 'loading'}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Honeypot — hidden via CSS only (NOT display:none) */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Visible fields: name, email, phone, message */}
            {/* ... field groups using styles.field / styles.label / styles.input ... */}

            {/* Submit button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formState === 'loading'}
            >
              {formState === 'loading'
                ? <><Loader2 size={18} className={styles.spinner} aria-label="Sending…" /> Sending…</>
                : <><Send size={18} /> Send Message</>
              }
            </button>

            {/* Inline error — Framer Motion mount */}
            {formState === 'error' && (
              <motion.p
                role="alert"
                className={styles.errorMsg}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                Something went wrong. Please try again or email us directly at{' '}
                <a href="mailto:dimakyh@ukr.net">dimakyh@ukr.net</a>.
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
```

---

### `components/sections/ContactSection.module.scss` (styles)

**Analog:** `components/sections/AboutSection.module.scss` for `.section`, `.sectionTitle` pattern; `AboutSection.module.scss` lines 67–74 for form label typography.

**Label field pattern** from `AboutSection.module.scss` (lines 67–74):
```scss
.bioField {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: var(--font-body);
  margin-bottom: var(--space-1);
}
```

**Input/textarea** (no codebase analog — new UI element):
```scss
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.input,
.textarea {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: var(--space-4);
  width: 100%;
  transition: border-color 0.15s ease;   // CSS only — Framer Motion does NOT own this

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-color: var(--color-accent);
  }
}

.textarea {
  min-height: 140px;
  resize: vertical;
}

.honeypot {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  // NOT display:none — bots skip display:none fields
}

.submitBtn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  text-transform: uppercase;
  color: #ffffff;
  background: var(--color-accent);
  border: none;
  border-radius: 4px;
  padding: var(--space-4) var(--space-8);
  width: 100%;
  cursor: pointer;
  transition: background 0.15s ease;   // CSS only — NOT Framer Motion

  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.spinner {
  animation: spin 1s linear infinite;   // CSS animation — NOT Framer Motion
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.errorMsg {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-4);

  a {
    color: var(--color-accent);
    text-decoration: underline;
  }
}

.form {
  max-width: 640px;
  margin: 0 auto;
  position: relative;   // required for honeypot absolute positioning
}

.successMessage {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  padding: var(--space-12) 0;
}

.successHeading {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}
```

---

### `content/videos.ts` (content, batch/static)

**Analog:** `content/player.ts`

**Interface + export const pattern** from `content/player.ts` (lines 1–14, 41–71):
```typescript
export interface PlayerStats {
  pace: number;
  // ...
}

export interface Trophy {
  name: string;
  year: number;
  competition: string;
}

export const player: Player = {
  fullName: 'Dmytro Kovalenko',
  // ...
};
```

Apply same pattern to `videos.ts`:
```typescript
export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
}

export const videos: VideoEntry[] = [
  {
    videoId: 'dQw4w9WgXcQ',  // replace with real YouTube football highlight ID
    title: 'Match Highlights — FC Dynamo',
    category: 'match',
  },
  // ... 2 more entries
];
```

No default export — named exports only, matching `player.ts` convention.

---

### `content/gallery.ts` (content, batch/static)

**Analog:** `content/player.ts`

Same named-export interface + const pattern:
```typescript
export interface GalleryEntry {
  src: string;     // full path including basePath: /future-legend-dev/images/gallery/photo-01.webp
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

**Critical:** `src` paths must include `/future-legend-dev/` prefix (the basePath from `next.config.ts`). Pattern from CONTEXT.md D-12/D-13.

---

### `app/[lang]/page.tsx` (page, modification)

**Analog:** Self — current state at lines 1–26.

**Current import block** (lines 1–8):
```typescript
import { player } from '@/content/player';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrophiesSection } from '@/components/sections/TrophiesSection';
import { ClubSection } from '@/components/sections/ClubSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { SectionStub } from '@/components/sections/SectionStub';
```

**Current stubs** (lines 20–22):
```tsx
<SectionStub id="highlights" title="Highlights" />
<SectionStub id="gallery" title="Gallery" />
<SectionStub id="contact" title="Contact" />
```

**Target state after Phase 3** — remove `SectionStub` import, add three new section imports and two content imports:
```typescript
import { videos } from '@/content/videos';
import { gallery } from '@/content/gallery';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';

// In JSX — replace the three SectionStub calls:
<HighlightsSection videos={videos} />
<GallerySection photos={gallery} />
<ContactSection />
```

`ContactSection` takes no props — form data is internal state and the GitHub API URL is hardcoded per CONTEXT.md D-03.

---

### `.github/workflows/contact.yml` (config/workflow, event-driven)

**Analog:** `.github/workflows/deploy.yml`

**Workflow file structure** from `deploy.yml` (lines 1–59):
```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build
        run: npx next build
```

For `contact.yml`: trigger is `workflow_dispatch` only (not push). Single job `notify` with a single step. Secrets accessed via `${{ secrets.* }}` (same pattern as `${{ secrets.GITHUB_TOKEN }}` in deploy.yml). Full pattern from RESEARCH.md Pattern 4:

```yaml
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
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

**Also: modify `deploy.yml` (lines 42–43)** — add `env:` block to the Build step:
```yaml
      - name: Build
        run: npx next build
        env:
          NEXT_PUBLIC_GH_PAT: ${{ secrets.GH_PAT }}
```

Insert after line 42 (`run: npx next build`) in the existing `deploy.yml`. This bakes the PAT into the static JS bundle at deploy time.

---

## Shared Patterns

### Section Shell (applies to all 3 new sections)

**Source:** `components/sections/TrophiesSection.tsx` (lines 12–17) + `TrophiesSection.module.scss` (lines 5–34)

All three Phase 3 sections must follow this exact shell:
```tsx
// TSX: ref on <section>, reveal-item on <h2>, useScrollReveal call
const containerRef = useRef<HTMLElement>(null);
useScrollReveal(containerRef);

return (
  <section id="[id]" ref={containerRef} className={styles.section}>
    <h2 className={`${styles.sectionTitle} reveal-item`}>[Title]</h2>
    ...
  </section>
);
```

```scss
// SCSS: section padding + sectionTitle with accent bar — copy verbatim
.section {
  padding: var(--space-16) var(--space-4);
  @include respond-to('lg') { padding: var(--space-24) var(--space-8); }
}

.sectionTitle {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: var(--space-12);
  @include respond-to('md') { font-size: var(--text-4xl); }
  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background-color: var(--color-accent);
    margin-top: var(--space-2);
  }
}
```

### GSAP Scroll Reveal Hook (applies to all 3 new sections)

**Source:** `lib/animations/useScrollReveal.ts` (lines 17–42)

All sections call `useScrollReveal(containerRef)`. The hook targets `.reveal-item` elements inside the `scope: containerRef` — GSAP will NOT leak to sibling sections as long as `containerRef.current` is non-null when the hook fires. Mark the section `<h2>`, intro `<p>`, and grid items (but NOT VideoCard internals) as `reveal-item`.

```typescript
// Hook signature — no parameters beyond the ref
export function useScrollReveal<T extends HTMLElement>(
  containerRef: RefObject<T | null>
): void
```

No direct GSAP import is needed in Phase 3 section components — `useScrollReveal` encapsulates it. The hook does `gsap.registerPlugin(ScrollTrigger, useGSAP)` at module scope already.

### Animation Ownership (applies to all 3 new sections + VideoCard)

**Source:** CLAUDE.md + `HeroSection.tsx` (pattern example)

- **GSAP** owns: scroll entrance (via `useScrollReveal`) on `<section>`, `<h2>`, `<p>`, `<li>` elements.
- **Framer Motion** owns: hover effects (`whileHover`), mount/unmount transitions (`initial`/`animate`/`exit`/`AnimatePresence`).
- **CSS** owns: continuous loops (spinner `@keyframes spin`), focus rings (`:focus-visible`), color transitions on buttons (`:hover`).
- **Never** animate the same element with both GSAP and Framer Motion.

Enforcement example from `HeroSection.tsx` (lines 41–43):
```tsx
{/* Layer 1: Background (GSAP-controlled) — no Framer Motion on this element */}
<div ref={bgRef} className={styles.heroBg} aria-hidden="true" />
{/* Layer 2: Text content (Framer Motion-controlled) — no GSAP on these elements */}
```

### SCSS Module Header Convention (applies to all `.module.scss` files)

**Source:** `TrophiesSection.module.scss` (lines 1–3) and `AboutSection.module.scss` (lines 1–3)

Every new `.module.scss` file starts with:
```scss
// [ComponentName].module.scss
// Mixins auto-injected via sassOptions.additionalData — no @use needed
// Tokens: use var(--token) — NOT $scss-variable
```

Do NOT write `@use '../styles/mixins'` or `@import` — the `respond-to()` mixin is globally injected by `next.config.ts` `sassOptions.additionalData`. Using `var(--token)` CSS custom properties is mandatory — never use bare SCSS variable values.

### Content Data File Pattern (applies to `videos.ts` and `gallery.ts`)

**Source:** `content/player.ts` (lines 1–71)

- Named exports only (no default export).
- Interface defined first, then the `const` data array/object.
- Interfaces exported so section components can import the type for their Props.
- File has no runtime imports — pure TypeScript data.
- Imported only in `app/[lang]/page.tsx`, never inside section components (CLAUDE.md data flow rule).

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/ui/VideoCard.tsx` (isPlaying state swap) | component | event-driven | No existing component in the codebase uses conditional mounting of a third-party embed. Lite-embed pattern is new for Phase 3. Use RESEARCH.md Pattern 1 directly. |
| `.github/workflows/contact.yml` (Telegram notification) | workflow | event-driven | No existing workflow in the codebase triggers Telegram. `deploy.yml` provides structural reference only — the Telegram curl step has no codebase analog. Use RESEARCH.md Pattern 4 directly. |

---

## Metadata

**Analog search scope:** `components/sections/`, `components/ui/`, `content/`, `lib/animations/`, `styles/`, `.github/workflows/`, `app/[lang]/`
**Files scanned:** 11 source files read in full
**Pattern extraction date:** 2026-05-20
