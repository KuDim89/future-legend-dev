# Feature Landscape

**Domain:** Football player personal portfolio / athlete showcase website
**Researched:** 2026-05-18
**Confidence:** MEDIUM — based on training knowledge of athlete recruitment platforms (SportsRecruits, NCSA, BeRecruited, Transfermarkt), sports personal branding best practices, and scout/coach UX expectations. WebSearch and WebFetch were unavailable during this research session.

---

## Scout / Coach Perspective (Recruiter Mental Model)

When a scout or coach lands on a player's personal site, they have one question: "Is this player worth my time to pursue?" They scan in roughly this order:

1. **Who is this player?** — Position, age, physical attributes, current club
2. **Can they play?** — Video highlights (first 30 seconds decide everything)
3. **Have they achieved anything?** — Trophies, team level, notable matches
4. **Can I contact them?** — Direct path to reach player or parent/agent
5. **Social proof** — Are other credible entities already interested or vouching for this player?

Every feature decision should pass the test: "Does this help a scout answer one of these five questions faster?"

---

## Table Stakes

Features scouts and coaches expect. Missing them signals the player is not serious about recruitment.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full name + position | Absolute minimum identification | Low | Include preferred position AND secondary positions |
| Date of birth / age | Scouts filter by age bracket immediately | Low | Show age, not just DOB — scouts don't do math |
| Nationality / eligibility | Critical for international recruitment and eligibility windows | Low | Passport nationality matters for club quotas |
| Dominant foot | Every scout asks this on first contact | Low | Also note if two-footed |
| Physical attributes (height, weight) | Used for positional fit assessment | Low | Keep updated — stale stats undermine credibility |
| Current club name | Establishes competitive level immediately | Low | Include league name/division for context |
| Profile photograph | Scouts expect a face — headshot or action shot | Low | High quality; action shot preferred over selfie |
| Video highlights | The single most important feature for recruitment | High | Must load fast; quality > quantity |
| Contact method | Without this the whole site fails its purpose | Medium | At minimum: email or contact form |
| Mobile-responsive layout | Scouts browse on phones at matches and on the go | Medium | Non-responsive = immediately unprofessional |
| Fast load time | Scouts bounce fast; a slow site = player doesn't care about details | High | Core Web Vitals matter; static export helps |

## Differentiators

Features that make this player's site stand out. Not universally expected, but they strongly signal professionalism and seriousness to a recruiter.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cinematic hero / animated landing | Creates immediate "wow" impression; signals player invests in self-presentation | High | GSAP + Framer Motion; must not sacrifice load speed |
| Separate training vs. match highlights | Lets scouts see raw technical ability (training) vs. competitive performance (match) — different scouts value different views | Medium | Categorized video tabs or sections |
| Photo gallery (training + match) | Visual storytelling beyond video; scouts share images internally | Medium | Lazy-loaded grid; lightbox support |
| Achievements / trophies section | Validates competitive level and winning mentality | Low | Even youth trophies matter — scouts want winners |
| Bilingual support (UA / EN) | Extends audience to English-speaking scouts and clubs internationally | Medium | Critical for Ukrainian player seeking international opportunities |
| Light / dark theme | Signals technical polish; dark themes suit cinematic sports aesthetic | Medium | System preference detection as default |
| Player "story" / bio section | Humanizes the player; scouts remember stories, not stats | Low | Short, punchy narrative — not a CV dump |
| AI-generated personal logo | Unique brand identity — rare among youth player sites; sets tone instantly | Medium | Logo used consistently across the site |
| Custom premium design system | Visual quality signals the player values excellence — matches what scouts expect from top talent | High | SCSS Modules for full design control |
| Social media links | Scouts look at Instagram/YouTube independently; link to them rather than hide them | Low | Instagram (training clips), YouTube channel if applicable |
| Current club section with context | Shows team environment, training ground, coaching staff | Low-Med | Can include club crest, brief description |
| Team/squad section | Shows ability to be part of a collective — team photos, context | Low-Med | Scouts often assess team dynamics |
| Scroll-triggered animations | Modern web standard for premium sites; keeps scouts engaged longer | High | Must be subtle — UX before flash |
| Telegram contact integration | Instant notification to player/parent on form submission; speeds response time | Medium | GitHub Actions workflow; no backend needed |

## Anti-Features

Features that harm credibility, UX, or load performance. Explicitly avoid these.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Auto-play video with audio | Startles the user, triggers browser blocks, burns mobile data — scouts immediately close the tab | Poster image with manual play; consider muted auto-play only for short looping hero clips |
| Excessive animation / parallax overload | Triggers motion sickness, slows the site, distracts from the player — the player IS the content | Use animation to guide attention, not replace it; test with animations off |
| Statistics-heavy dashboards without context | Raw stats (xG, pass %, etc.) mean nothing without context for youth players — scouts know this | Show achievements and highlights instead; stats belong in a PDF scouting report |
| User accounts / login walls | Any friction before seeing the player = scout leaves | Static open site, zero authentication |
| Long-form text walls | Scouts skim; paragraphs longer than 3 lines will not be read | Short punchy copy, bullet points, bold key facts |
| Outdated content (stale club, old age) | Nothing undermines credibility faster than wrong factual information | Make updating easy (local JSON/TS content files); date-stamp the last update |
| Low-quality video embedded directly | Blurry or pixelated video kills the impression instantly | YouTube embeds only; YouTube handles adaptive bitrate and CDN delivery |
| Infinite scroll / social feed | Makes the site feel like social media, not a professional portfolio | Curated sections with intentional structure |
| Flashy intro/loading screens | Every second before content = higher bounce rate; scouts are impatient | Immediate hero render; use skeleton loaders if needed |
| Unstructured contact form (too many fields) | More fields = fewer submissions | Name + email/phone + message — three fields maximum |
| Music / background audio | Universally disliked in professional contexts | Silence is professional |
| Comments section | Opens the site to spam and off-topic content; not a social platform | Remove entirely — the site is an outbound pitch, not a conversation |
| Admin panel / CMS dependency | Adds complexity, ongoing cost, and a potential point of failure | Local JSON/TS content files updated via code |
| Generic template look | Template sites signal low effort — scouts have seen thousands | Custom premium design; unique personal logo |

---

## Feature Dependencies

```
Video highlights (YouTube embed) → Fast load performance (embeds are lazy-loaded)
Contact form → Telegram integration via GitHub Actions → GitHub Secrets (bot token)
Bilingual support → All content sections (every section needs UA + EN copy)
Cinematic hero → GSAP scroll animations → Performance budget (must balance)
Photo gallery → Lazy loading → Mobile performance
Light/dark theme → Design system (CSS custom properties / SCSS variables)
Personal logo → Visual design system (logo used in header, hero, metadata)
```

---

## MVP Recommendation

Given the project's goal (drive recruitment for a young player seeking professional opportunities), prioritize ruthlessly around the scout's first 60-second scan.

**Build first (MVP — must ship together):**
1. Cinematic hero with name, position, and CTA — establishes the brand instantly
2. Player profile section (position, age, foot, height, weight, nationality, current club)
3. Video highlights — YouTube embeds, match + training separated
4. Trophies / achievements section — validates competitive level
5. Contact form with Telegram notification — the only conversion that matters
6. Mobile-responsive layout — scouts use phones
7. UA / EN bilingual — opens international doors from day one

**Build in phase 2 (polish + depth):**
8. Photo gallery — visual storytelling depth
9. Animated scroll sequences (GSAP cinematic) — premium impression
10. Current club section with context
11. Team section
12. Light / dark theme toggle
13. AI-generated personal logo integrated throughout

**Defer or cut:**
- Social media feed embeds — link to profiles instead; live feeds add load weight
- Match statistics dashboard — not credible for youth player without verified data source
- Blog / news section — scope creep; adds maintenance burden without recruiting value

---

## Sources and Confidence

| Area | Confidence | Basis |
|------|------------|-------|
| Scout/recruiter mental model | MEDIUM | Training knowledge of recruitment platforms (NCSA, SportsRecruits, BeRecruited, Transfermarkt) and sports recruitment UX patterns |
| Table stakes features | HIGH | Universal across athlete showcase platforms; directly matches PROJECT.md validated requirements |
| Differentiators | MEDIUM | Based on observed patterns in premium sports personal branding; not independently verified via live research |
| Anti-features | HIGH | Well-established UX/performance anti-patterns; universally documented across web design literature |
| Feature dependencies | HIGH | Technical analysis from PROJECT.md stack (Next.js static, GitHub Actions, Framer Motion, GSAP) |

Note: WebSearch and WebFetch were unavailable. Findings are based on training knowledge through August 2025 and direct analysis of the PROJECT.md specification. A follow-up search of live athlete portfolio examples (e.g., personal sites of professional players, NCSA recruiting profiles, SportsRecruits player pages) could validate or refine the differentiators list.
