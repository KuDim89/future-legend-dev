# Common Pitfalls

**Project:** Future Legend — Football Player Portfolio Website
**Researched:** 2026-05-18
**Confidence:** HIGH (critical claims verified against official Next.js docs and GSAP official docs)

---

## CRITICAL PITFALLS

### Pitfall 1: Next.js built-in i18n routing is incompatible with static export

- **What goes wrong:** `i18n:` config in `next.config.js` does nothing with `output: 'export'` — no server exists to detect `Accept-Language` or issue redirects
- **Why:** i18n routing requires server middleware at request time; static export has no server
- **Consequences:** Locale detection silently fails; all users get default locale; `/ua/` URL prefix may return 404
- **Prevention:** Use App Router `app/[lang]/page.tsx` + `generateStaticParams([{lang:'ua'},{lang:'en'}])`. Manage locale preference in `localStorage` + URL segment.
- **Detection:** After deploy, navigating to `/ua` returns 404; locale switcher has no effect
- **Phase:** Foundation / i18n setup — must solve before any content work
- **Confidence:** HIGH — official Next.js Pages Router docs explicitly state the incompatibility

---

### Pitfall 2: `next/image` default loader fails with static export

- **What goes wrong:** Build fails with "Image Optimization using the default loader is not compatible with `next export`", OR images are served as raw originals with no WebP/responsive srcsets
- **Why:** Image optimization is a server-side runtime feature
- **Consequences:** Build failure OR massive unoptimized images destroying LCP scores on mobile
- **Prevention:** Set `images: { unoptimized: true }`. Pre-process all images to WebP + multiple sizes using a `sharp`-based build script or Cloudinary. Always set explicit `width` and `height` on every `<Image>`.
- **Detection:** `next build` fails with image optimization error; Lighthouse flags 3–10 MB hero images
- **Phase:** Foundation phase — must configure before adding any images
- **Confidence:** HIGH — official Next.js docs confirm this limitation

---

### Pitfall 3: Missing `basePath` causes all assets to 404 on GitHub Pages

- **What goes wrong:** GitHub Pages serves at `username.github.io/repo-name/` but assets use root-relative paths like `/_next/static/...` — all return 404
- **Why:** `basePath` is inlined at build time; without it, all paths assume the site is at root
- **Consequences:** Deployed site shows blank page; browser network tab shows dozens of 404s for every JS chunk and CSS file
- **Prevention:** Set `basePath: '/repo-name'` and `assetPrefix: '/repo-name/'` in `next.config.js`. Set `trailingSlash: true`. Use `next/link` and `next/image` everywhere (they auto-prepend `basePath`). Manually prepend `process.env.NEXT_PUBLIC_BASE_PATH` for raw `<img>` and CSS `url()` pointing to `/public/`.
- **Detection:** First deploy shows blank page; network tab shows `/_next/` paths returning 404
- **Phase:** Foundation/deployment phase — must be configured before any CI/CD pipeline runs
- **Confidence:** HIGH

---

### Pitfall 4: GSAP running outside `useEffect`/`useGSAP` breaks static export build

- **What goes wrong:** `gsap.to(...)`, `ScrollTrigger.create(...)` at module scope or in Server Components throws "window is not defined" during `next build`
- **Why:** Static export prerendering executes component code in Node.js where `window`/`document` don't exist
- **Consequences:** Build failure or React hydration mismatch errors in browser console
- **Prevention:** Mark all animation components `'use client'`. All GSAP calls inside `useGSAP()` from `@gsap/react`. Register plugins at the top of `'use client'` files: `gsap.registerPlugin(ScrollTrigger)`. Use `dynamic(() => import('./HeroAnimation'), { ssr: false })` for animation-heavy components.
- **Detection:** `next build` throws "ReferenceError: window is not defined"
- **Phase:** Animation foundation phase — establish pattern before building any animated section
- **Confidence:** HIGH — official Next.js lazy loading docs + GSAP React docs confirm this

---

## MODERATE PITFALLS

### Pitfall 5: Framer Motion and GSAP animate the same element — transform conflict

- **What goes wrong:** Both libraries write to `element.style.transform`. The last writer per frame wins, causing jank or snapping.
- **Prevention:** Strict boundary — Framer Motion owns mount/unmount transitions and hover/tap micro-interactions. GSAP owns scroll-triggered sequences and cinematic timelines. Never apply both to the same element simultaneously.
- **Detection:** Animation "fights" — element jumps between positions; browser inspector shows `transform` being rapidly overwritten
- **Phase:** Animation architecture phase — decide boundary before writing any animation
- **Confidence:** MEDIUM

---

### Pitfall 6: GSAP ScrollTrigger calculates positions before layout is complete

- **What goes wrong:** ScrollTrigger uses wrong measurements if initialized before fonts load, before images have dimensions, or before CSS paints. Animations trigger at wrong scroll positions.
- **Prevention:** Call `ScrollTrigger.refresh()` after `document.fonts.ready`. Always specify `width`/`height` on every `<Image>`. Call `ScrollTrigger.refresh()` after any dynamic content renders.
- **Detection:** Scroll animations trigger too early or too late; pinned sections release at wrong positions
- **Phase:** Scroll animation phase
- **Confidence:** HIGH — confirmed by GSAP official docs

---

### Pitfall 7: Dark/light theme flash on page load (FOUC)

- **What goes wrong:** Theme preference stored in `localStorage` is read in `useEffect` — after hydration. Browser renders default theme for ~100–300ms before JS sets the correct theme class. Visible white flash for dark theme users.
- **Prevention:** Inject a **blocking** inline `<script>` in `<head>` (in App Router `layout.tsx` via `dangerouslySetInnerHTML`) that reads `localStorage.getItem('theme')` synchronously and sets the theme class on `<html>` before first paint. Use CSS variables for all theme colors.
- **Detection:** CPU throttle 4x in DevTools, hard reload — observe white flash before dark theme applies
- **Phase:** Design system / theme implementation phase
- **Confidence:** MEDIUM — established Next.js community pattern

---

### Pitfall 8: Contact form has no spam or CSRF protection

- **What goes wrong:** Without a honeypot/CAPTCHA, bots flood the Telegram channel. If the bot token appears in client-side code, it can be called directly from anywhere.
- **Prevention:** Bot token must be in GitHub Secrets only — never in client code. Use a serverless intermediary (Cloudflare Workers free tier) to hold the token. Add a honeypot field (hidden input that bots fill; reject if populated). Add a time-check (form submitted in < 2 seconds = bot).
- **Phase:** Contact form implementation phase

---

### Pitfall 9: YouTube `<iframe>` embeds destroy mobile LCP scores

- **What goes wrong:** Standard `<iframe src="youtube.com/embed/...">` loads YouTube's entire JS runtime on page load, blocking main thread during hydration. LCP delayed by 2–5 seconds on slow connections.
- **Prevention:** Use the lite-embed pattern — render video thumbnail as `<img>` with play button overlay; on click replace with real `<iframe>`. Add `<link rel="preconnect" href="https://www.youtube.com">` for above-fold videos.
- **Detection:** Lighthouse performance score below 70 on mobile; network panel shows `youtube.com` requests on initial load
- **Phase:** Media system implementation phase

---

### Pitfall 10: GSAP ScrollTrigger instances leak across SPA navigation

- **What goes wrong:** Components unmount but ScrollTrigger instances remain globally active. After several navigations, duplicate triggers accumulate causing animations to fire multiple times per scroll event.
- **Prevention:** Use `useGSAP()` from `@gsap/react` — it automatically kills all ScrollTrigger instances created within its callback on unmount. React Strict Mode (double mount/unmount in dev) will expose missing cleanup.
- **Phase:** Animation implementation phase
- **Confidence:** HIGH — GSAP React integration docs confirm this behavior

---

### Pitfall 11: Animating layout CSS properties causes mobile jank

- **What goes wrong:** Animating `width`, `height`, `top`, `left`, `padding`, `margin` triggers full page reflow every frame. On mobile CPUs this drops below 60fps and causes visible jank.
- **Prevention:** Animate only `transform` and `opacity`. Use `will-change: transform` sparingly. Test on real device or Chrome 4x CPU throttle. Implement `prefers-reduced-motion` media query to disable non-essential animations.
- **Phase:** Animation implementation phase — establish rule before writing animations
- **Confidence:** HIGH

---

## MINOR PITFALLS

### Pitfall 12: `trailingSlash` mismatch causes 404 on GitHub Pages

Set `trailingSlash: true` in `next.config.js`. This causes Next.js to emit `out/page/index.html` instead of `out/page.html`, which GitHub Pages serves correctly.

### Pitfall 13: Missing `.nojekyll` file breaks `_next/` assets

GitHub Pages uses Jekyll which strips underscore-prefixed directories by default. Add an empty `.nojekyll` file to `public/` so it copies to `out/` and prevents `_next/` from being ignored.

### Pitfall 14: `window`/`document` at module scope breaks build

Any browser API outside a function or hook throws during `next build`. Guard all browser API access with `typeof window !== 'undefined'` or move into `useEffect`. Use `dynamic({ssr: false})` for libraries that access browser globals at import time.

---

## Phase-Specific Warning Table

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| next.config.js setup | Missing `basePath`, `assetPrefix`, `trailingSlash` | Configure all three before any CI/CD |
| Image system | `next/image` default loader fails at build | `unoptimized: true`; pre-process images for production |
| i18n setup | Built-in `i18n:` config incompatible with static export | App Router `[lang]` + `generateStaticParams` |
| First GSAP animation | DOM access outside `useGSAP` breaks build | `'use client'` + `useGSAP` pattern; `dynamic({ssr:false})` |
| Animation boundary | Framer Motion + GSAP fighting over same element | Define ownership split before writing any animations |
| Theme system | FOUC on page load for dark theme | Blocking inline script in `<head>` to set theme class before paint |
| Media section | YouTube iframes tank mobile LCP | Lite-embed pattern (thumbnail + click-to-load) |
| Contact form | Bot token exposure and spam | Token in GitHub Secrets only; honeypot field |
| Mobile QA | Animation jank on mid-range devices | Animate only `transform`/`opacity`; CPU throttle testing |
| Scroll sections | Stale ScrollTrigger or wrong measurements | `useGSAP` for cleanup; `ScrollTrigger.refresh()` after fonts/images load |

---

*Researched: 2026-05-18*
