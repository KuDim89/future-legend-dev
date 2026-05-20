# Phase 3: Media & Contact - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 3-Media & Contact
**Areas discussed:** Contact pipeline, Video section layout, Gallery photo sourcing, Contact form UX

---

## Contact Pipeline

| Option | Description | Selected |
|--------|-------------|----------|
| Direct workflow_dispatch + PAT | Client calls GitHub API directly. PAT scoped to actions:write only. Visible in bundle — low risk for personal site. | ✓ |
| Cloudflare Worker intermediary | Worker holds PAT server-side. Zero secrets in browser. Adds Cloudflare dependency. | |
| Skip GitHub Actions — Telegram direct | Worker calls Telegram Bot API directly. Cuts GitHub Actions out of the loop. | |

**User's choice:** Direct workflow_dispatch + PAT

| Option | Description | Selected |
|--------|-------------|----------|
| NEXT_PUBLIC_ env var | PAT set as build-time env var via GitHub Actions step. Inlined into bundle. | ✓ |
| Hardcoded in content/contact.ts | PAT in TypeScript file — visible in git history and to repo collaborators. | |

**User's choice:** NEXT_PUBLIC_ env var (`NEXT_PUBLIC_GH_PAT`)

**Repo target:** User provided `https://github.com/KuDim89/future-legend-dev` — owner is `KuDim89`.

| Option | Description | Selected |
|--------|-------------|----------|
| name, email, message | Matches CONTACT-01 requirements. | |
| name, email, message, phone | Adds optional phone for scouts who prefer calls. | ✓ |

**User's choice:** name, email, message, phone (phone optional)

**Workflow file:** `contact.yml` (default recommended option accepted).

| Option | Description | Selected |
|--------|-------------|----------|
| Honeypot + min submit time | Hidden field + 3-second threshold. Invisible to real users. Covers CONTACT-03. | ✓ |
| Honeypot only | Simpler but weaker. | |
| Honeypot + time + math captcha | Stronger but adds friction. | |

**User's choice:** Honeypot field + min submit time (3s threshold)

---

## Video Section Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Grid of video cards | Responsive grid. Consistent with existing trophies grid. | ✓ |
| Carousel / horizontal slider | More dynamic; needs slider library. | |
| Featured video + playlist | Hero video treatment. | |

**User's choice:** Grid of video cards

| Option | Description | Selected |
|--------|-------------|----------|
| YouTube ID + title + category | Minimal, practical. Thumbnail auto from YouTube. | ✓ |
| YouTube ID + title only | Simplest flat list. | |
| YouTube ID + title + description + category | Richer but more content. | |

**User's choice:** YouTube ID + title + category

| Option | Description | Selected |
|--------|-------------|----------|
| 3 placeholder videos | Proves pattern, easy to update. | ✓ |
| 6 placeholder videos | Fills 2 rows. | |
| 1 placeholder video | Bare minimum. | |

**User's choice:** 3 placeholder videos

| Option | Description | Selected |
|--------|-------------|----------|
| No tabs — flat grid | Categories in data only, no filter UI. | ✓ |
| Yes — filter tabs above grid | Adds state management, more complex. | |

**User's choice:** No tabs — flat grid

| Option | Description | Selected |
|--------|-------------|----------|
| Click thumbnail — replace with iframe | Standard lite-embed pattern. No iframe on load. | ✓ |
| Hover play button + click to load | Same but with hover overlay. | |

**User's choice:** Click thumbnail image — replace with iframe

---

## Gallery Photo Sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| Local files in /public/images/gallery/ | Committed WebP. Works on GitHub Pages. No external dependency. | ✓ |
| External URLs in content/gallery.ts | No repo bloat; requires external hosting. | |

**User's choice:** Local files in /public/images/gallery/

| Option | Description | Selected |
|--------|-------------|----------|
| src + alt + category | Practical minimal schema. | ✓ |
| src + alt only | Flat, no categories. | |
| src + alt + category + caption | Richer; more content to maintain. | |

**User's choice:** src + alt + category

| Option | Description | Selected |
|--------|-------------|----------|
| 6 placeholder images | Two rows of 3. Looks like a real gallery. | ✓ |
| 3 placeholder images | One row only. | |
| 9 placeholder images | Three rows; slightly more build output. | |

**User's choice:** 6 placeholder images

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform 3-column grid | Consistent, simple. No library. | |
| Masonry / Pinterest-style grid | Dynamic; uses react-masonry-css. | ✓ |
| Mixed: hero + thumbnails | Featured photo treatment. | |

**User's choice:** Masonry / Pinterest-style grid

| Option | Description | Selected |
|--------|-------------|----------|
| CSS columns (no library) | Pure CSS, zero deps. | |
| react-masonry-css | Lightweight, true masonry, widely used. | ✓ |
| YARL masonry plugin | Keeps deps low, uses existing YARL. | |

**User's choice:** react-masonry-css

---

## Contact Form UX

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success message replaces form | Form hides, success message fades in. Framer Motion exit animation. | ✓ |
| Toast notification | Form stays, toast appears top-right. | |
| Modal overlay | Centered modal blocks page until dismissed. | |

**User's choice:** Inline success message replaces form

| Option | Description | Selected |
|--------|-------------|----------|
| Inline error below submit button | Error text below button, form stays pre-filled. | ✓ |
| Error toast | Error as toast, form stays. | |
| Error replaces form | Error state with Try Again button. | |

**User's choice:** Inline error message below the submit button

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled button + spinner + "Sending..." | Clear loading state, prevents double-submit. | ✓ |
| Disabled button + loading bar | Progress bar below button. | |
| No visual change | Button just disables. | |

**User's choice:** Disabled button with spinner + "Sending..." text

**Fallback contact email:** User provided `dimakyh@ukr.net` (not the account email).

**Telegram secrets:** User confirmed they will add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to GitHub Secrets manually — not stored in code or context.

| Option | Description | Selected |
|--------|-------------|----------|
| Form only | Clean section, form + intro text. | ✓ |
| Form + social links | Links to Instagram, TikTok, etc. | |
| Form + direct contact info | Email/phone alongside the form. | |

**User's choice:** Form only

---

## Claude's Discretion

- Exact responsive breakpoints for video/gallery grids
- Video card hover effect (scale, shadow, overlay)
- Lightbox toolbar configuration (YARL default options)
- Telegram message formatting (HTML vs Markdown, emoji)
- Play button overlay on video thumbnail (optional enhancement)

## Deferred Ideas

- Category filter tabs for video section → v2 / MEDIA-V2-01
- Category filter tabs for gallery section → v2
- Social media links in contact section → out of scope for Phase 3
- Video descriptions → Phase 4+ polish
- Photo captions in lightbox → Phase 4+ polish
