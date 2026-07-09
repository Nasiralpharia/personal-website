# Personal Brand Website — Design Spec

**Date:** 2026-07-08
**Owner:** Andre Richards (richards.andre@gmail.com)
**Status:** Approved by Andre section-by-section in brainstorming session

## Purpose

A personal brand website for Andre Richards that positions him as an AI-focused
career-transformation expert, supporting a future side business (job-search
coaching, 1:1 mentoring) and speaking engagements. Launches unlisted on GitHub
Pages, shared by link only; moves to Vercel with a custom domain if/when the
business goes public. Business launch is a few months out — the site must be
complete but require zero maintenance until then.

## Brand & Positioning

- **Brand = personal name:** "Andre Richards." The previously drafted brand
  "The Pivot Blueprint" is reserved as a possible future sub-brand for the
  coaching product; the word "blueprint" may appear in copy but is not used as
  a product name.
- **Core narrative (central to the brand):** Andre has reinvented his career
  three times — Marine (2000–2005, tactical air defense, Afghanistan) →
  Durham PD detective/supervisor (2006–2018, homicide/SVU) → RTI International
  research analyst (2018–2021) → Cisco enterprise customer success (2021–2026,
  AI certifications) → AI enablement leader. He now helps others engineer
  career pivots using AI.
- **Employer handling (conflict-of-interest guardrails):**
  - Current employer is NEVER named. Described only as "AI enablement leader
    at a Fortune 500 financial services company."
  - Past employers (Marine Corps, Durham PD, RTI International, Cisco) are
    named as career history.
  - Footer disclaimer on every page: "All views and services are my own and
    unaffiliated with my employer."
  - No content sells to, references, or competes with the employer's business.
- **Credibility markers:** PMP, Cisco Certified AI Technical Practitioner,
  Cisco Generative AI Blue Belt, Triangle Business Journal 40 Under 40,
  20+ years across military / law enforcement / research / enterprise tech.

## Offerings (launch scope)

1. **AI-Powered Job Search Coaching** — resume overhaul with an AI workflow,
   application strategy, interview prep. Framed as teaching clients to use AI
   tools effectively, not generic resume writing.
2. **Speaking** — topics at the intersection of AI adoption and career
   transformation.
3. **1:1 Pivot Sessions** — mentoring/office hours for people mid-transition.

Explicitly OUT of launch scope: blog, contact forms, scheduling/booking tools,
pricing, payments, testimonials (none exist yet), analytics. Structure must
allow adding a `/blog` route later without redesign.

## Sitemap & Page Content (5 pages)

- **Home (`/`)** — Serif hero headline "I've reinvented my career three
  times." + subhead about helping others pivot with AI + headshot
  (`LinkedInProfilePic.jpg`) + CTAs: "Work with me" → /services, "My story" →
  /about. Below fold: 3-card offering teaser; credibility strip.
- **About (`/about`)** — Career story as a typographic timeline (no stock
  photos). Each era framed as "what this pivot taught me." Ends with thesis:
  reinvention is a repeatable skill; AI is the biggest lever yet.
- **Services (`/services`)** — Detail on coaching + 1:1 sessions, each with
  "who this is for" and an email CTA. No pricing — "get in touch."
- **Speaking (`/speaking`)** — Short + long speaker bios (copy-paste ready for
  organizers), 3–4 talk topics with one-paragraph abstracts, headshot download
  link, booking-inquiry email CTA. Extensible into a full speaker kit later.
- **Contact (`/contact`)** — Email button (mailto: richards.andre@gmail.com),
  LinkedIn button (linkedin.com/in/andrekrichards), one line on what to reach
  out about, disclaimer repeated.

## Visual Design System — "Warm Storyteller"

Chosen from three mocked-up directions (vs. corporate navy and dark tech).

- **Palette:** background `#faf6f0` (warm paper); text `#2b241d`; accent
  `#b0763c` (muted amber) for CTAs/labels; alternate section background
  `#f3ece2` (soft sand); hairline borders `#e8ded2`. All combinations must
  pass WCAG AA.
- **Typography:** serif headlines (Georgia-family system stack or self-hosted
  Source Serif — NO third-party font CDNs); sans-serif body/UI. Large
  headlines, generous line spacing, editorial feel.
- **Details:** pill-shaped amber CTA buttons; italic "Andre Richards" wordmark
  in nav; typographic era markers on the About timeline.
- **Accessibility:** semantic HTML, alt text, keyboard-navigable collapsed
  mobile nav, `prefers-reduced-motion` respected; animations minimal (subtle
  fade-ins at most).
- **Responsive:** mobile-first; nav collapses to simple menu on phones.

## Architecture & Tech

- **Framework:** Astro (static output, zero client JS by default). Chosen over
  plain HTML (duplicated nav/footer) and Next.js static export (overkill;
  GitHub Pages friction).
- **Structure:**
  - `src/layouts/BaseLayout.astro` — nav, footer, disclaimer, noindex meta
  - `src/components/` — ServiceCard, TimelineEntry, TalkTopic, CTAButton
  - `src/pages/` — index, about, services, speaking, contact
  - `src/styles/global.css` — design tokens (colors, type scale)
  - `public/` — headshot, favicon, downloadable speaker headshot
- **Content model:** copy lives in page files; no CMS.

## Deployment

- **Phase 1 (now):** Public GitHub repo; official Astro GitHub Action deploys
  to GitHub Pages on push to `main`; site at
  `https://<username>.github.io/<repo>/` with Astro `base` configured.
  `<meta name="robots" content="noindex">` in BaseLayout keeps it unlisted;
  link shared privately.
- **Phase 2 (go-public, documented in README):** connect repo to Vercel
  (auto-detects Astro), remove `base` path config and noindex tag, add custom
  domain. Estimated five minutes of work.

## Execution Model

Fable (this session) did planning/design and writes the implementation plan.
Implementation tasks are executed by Sonnet subagents (scaffold, components,
pages, styles, deploy workflow); an Opus subagent may be used for the
story-heavy copywriting (Home hero, About timeline, speaker bios). Fable
reviews all work at the end and proposes an improvement round.

## Verification / Definition of Done

- `astro build` completes with no errors or warnings.
- All internal links resolve; no console errors in preview.
- Every page renders correctly at mobile (375px) and desktop (1280px) widths.
- Color contrast spot-checked against WCAG AA.
- GitHub Actions deploy succeeds; live GitHub Pages URL loads all five pages.
- noindex meta present on every page; disclaimer present in every footer.
