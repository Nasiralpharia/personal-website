# Personal Brand Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Andre Richards' five-page personal brand website (Astro, "Warm Storyteller" design) to GitHub Pages, unlisted via noindex.

**Architecture:** Static Astro site with one shared layout, four small components, and five content pages. Copy lives in page files (no CMS). GitHub Actions deploys to GitHub Pages on push to `main`; README documents the later 5-minute Vercel migration.

**Tech Stack:** Astro ^5, plain CSS (design tokens in `global.css`), Node 18.17+/20+, GitHub CLI (`gh`), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-07-08-personal-brand-website-design.md` — read it before starting. Non-negotiable constraints: current employer NEVER named (say "a Fortune 500 financial services company"); disclaimer in every footer; `noindex` meta on every page; no third-party font/CDN requests; email + LinkedIn are the only contact methods.

**Working directory:** `C:\Users\richa\Downloads\Personal website` (already a git repo on `main`). Commands below are Git Bash / POSIX syntax.

---

### Task 1: Environment check & Astro scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder), `public/headshot.jpg` (copy of existing photo)

- [ ] **Step 1: Verify toolchain**

Run: `node --version && npm --version && gh auth status`
Expected: Node v18.17+ or v20+; npm 9+; `gh` reports "Logged in to github.com". If any fail, STOP and report — do not improvise installs.

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "personal-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check-links": "node scripts/check-links.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

`OWNER` is replaced with the real GitHub username in Task 11 — leave the literal string `OWNER` for now.

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://OWNER.github.io',
  base: '/personal-website',
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Create placeholder `src/pages/index.astro`**

```astro
---
---
<html lang="en">
  <body>
    <h1>Scaffold OK</h1>
  </body>
</html>
```

- [ ] **Step 6: Copy the headshot**

Run: `cp LinkedInProfilePic.jpg public/headshot.jpg` (create `public/` first: `mkdir -p public`)

- [ ] **Step 7: Install and build**

Run: `npm install && npm run build`
Expected: install completes; build prints `1 page(s) built` and exits 0. `dist/index.html` exists.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src public
git commit -m "chore: scaffold Astro project with placeholder page"
```

---

### Task 2: Design tokens & URL helper

**Files:**
- Create: `src/styles/global.css`, `src/lib/url.js`

- [ ] **Step 1: Create `src/styles/global.css`**

Accessibility note baked into these tokens: `--accent` (#b0763c) is decorative only (borders, large serif accents). Text labels and button backgrounds use `--accent-strong` (#8a5a28), which passes WCAG AA against both `--bg` and white.

```css
:root {
  --bg: #faf6f0;
  --bg-alt: #f3ece2;
  --text: #2b241d;
  --text-muted: #6b5d4d;
  --accent: #b0763c;
  --accent-strong: #8a5a28;
  --border: #e8ded2;
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-sans: system-ui, 'Segoe UI', Arial, sans-serif;
  --max-width: 68rem;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
}

h1, h2, h3 {
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 0.75rem;
}

h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); }
h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); }
h3 { font-size: 1.25rem; }

p { margin: 0 0 1rem; }

a { color: var(--accent-strong); }

img { max-width: 100%; height: auto; }

.eyebrow {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-strong);
  margin-bottom: 0.75rem;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem;
}

section.band {
  padding: 3.5rem 0;
}

section.band.alt {
  background: var(--bg-alt);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Create `src/lib/url.js`**

Astro's `BASE_URL` may or may not end with a slash depending on config; this helper normalizes so callers always pass a leading-slash path.

```js
export function url(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: exit 0 (nothing imports these yet; this catches syntax errors).

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/lib/url.js
git commit -m "feat: add Warm Storyteller design tokens and base-path URL helper"
```

---

### Task 3: BaseLayout, CTAButton, and all five route stubs

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/CTAButton.astro`
- Create: `src/pages/about.astro`, `src/pages/services.astro`, `src/pages/speaking.astro`, `src/pages/contact.astro`
- Modify: `src/pages/index.astro` (replace placeholder)

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { url } from '../lib/url.js';

interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;

const navLinks = [
  { href: url('/about/'), label: 'About' },
  { href: url('/services/'), label: 'Services' },
  { href: url('/speaking/'), label: 'Speaking' },
  { href: url('/contact/'), label: 'Contact' },
];
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href={url('/favicon.svg')} />
    <title>{title}</title>
  </head>
  <body>
    <header class="site-header">
      <nav class="container" aria-label="Main">
        <a class="wordmark" href={url('/')}>Andre Richards</a>
        <ul>
          {navLinks.map((link) => (
            <li><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>© 2026 Andre Richards</p>
        <p class="disclaimer">
          All views and services are my own and unaffiliated with my employer.
        </p>
      </div>
    </footer>
  </body>
</html>

<style>
  .site-header {
    border-bottom: 1px solid var(--border);
    padding: 1rem 0;
  }
  .site-header nav {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 1.5rem;
  }
  .wordmark {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.35rem;
    color: var(--text);
    text-decoration: none;
  }
  .site-header ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .site-header ul a {
    color: var(--text);
    text-decoration: none;
    font-size: 0.95rem;
  }
  .site-header ul a:hover,
  .site-header ul a:focus-visible {
    color: var(--accent-strong);
    text-decoration: underline;
  }
  .site-footer {
    border-top: 1px solid var(--border);
    padding: 2rem 0 2.5rem;
    margin-top: 4rem;
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  .site-footer p { margin: 0 0 0.25rem; }
</style>
```

- [ ] **Step 2: Create `src/components/CTAButton.astro`**

```astro
---
interface Props {
  href: string;
  variant?: 'solid' | 'text';
}
const { href, variant = 'solid' } = Astro.props;
---
<a class:list={['cta', variant]} href={href}><slot /></a>

<style>
  .cta {
    display: inline-block;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
  }
  .cta.solid {
    background: var(--accent-strong);
    color: #fff;
    padding: 0.7rem 1.6rem;
    border-radius: 999px;
  }
  .cta.solid:hover,
  .cta.solid:focus-visible {
    background: var(--text);
  }
  .cta.text {
    color: var(--text);
    border-bottom: 1px solid var(--text);
    padding-bottom: 0.1rem;
  }
  .cta.text:hover,
  .cta.text:focus-visible {
    color: var(--accent-strong);
    border-color: var(--accent-strong);
  }
</style>
```

- [ ] **Step 3: Replace `src/pages/index.astro` and create the four other route stubs**

Each stub is identical except title/description/h1. Full pages come in Tasks 4–8.

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Andre Richards — Career Pivots, Powered by AI"
  description="Andre Richards helps professionals reinvent their careers with AI: job-search coaching, speaking, and 1:1 mentoring."
>
  <section class="band"><div class="container"><h1>Home</h1></div></section>
</BaseLayout>
```

`src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="My Story — Andre Richards"
  description="From the Marine Corps to AI enablement: the three career pivots behind Andre Richards' approach to reinvention."
>
  <section class="band"><div class="container"><h1>My story</h1></div></section>
</BaseLayout>
```

`src/pages/services.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Services — Andre Richards"
  description="AI-powered job search coaching and 1:1 pivot sessions with Andre Richards."
>
  <section class="band"><div class="container"><h1>Services</h1></div></section>
</BaseLayout>
```

`src/pages/speaking.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Speaking — Andre Richards"
  description="Book Andre Richards to speak on practical AI adoption and career reinvention."
>
  <section class="band"><div class="container"><h1>Speaking</h1></div></section>
</BaseLayout>
```

`src/pages/contact.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Contact — Andre Richards"
  description="Get in touch with Andre Richards about coaching, speaking, or AI."
>
  <section class="band"><div class="container"><h1>Contact</h1></div></section>
</BaseLayout>
```

- [ ] **Step 4: Build and verify layout invariants**

Run: `npm run build`
Expected: `5 page(s) built`, exit 0.

Run: `grep -L 'name="robots" content="noindex"' dist/index.html dist/about/index.html dist/services/index.html dist/speaking/index.html dist/contact/index.html`
Expected: no output (every file has the noindex meta; `grep -L` lists files MISSING it).

Run: `grep -L 'unaffiliated with my employer' dist/index.html dist/about/index.html dist/services/index.html dist/speaking/index.html dist/contact/index.html`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/layouts src/components src/pages
git commit -m "feat: add BaseLayout with nav/footer/noindex, CTAButton, and five route stubs"
```

---

### Task 4: Home page

**Files:**
- Create: `src/components/ServiceCard.astro`
- Modify: `src/pages/index.astro` (replace stub body)

- [ ] **Step 1: Create `src/components/ServiceCard.astro`**

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<article class="service-card">
  <h3>{title}</h3>
  <p><slot /></p>
</article>

<style>
  .service-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.5rem;
  }
  .service-card h3 { margin-bottom: 0.5rem; }
  .service-card p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 2: Replace `src/pages/index.astro` with the full home page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTAButton from '../components/CTAButton.astro';
import ServiceCard from '../components/ServiceCard.astro';
import { url } from '../lib/url.js';
---
<BaseLayout
  title="Andre Richards — Career Pivots, Powered by AI"
  description="Andre Richards helps professionals reinvent their careers with AI: job-search coaching, speaking, and 1:1 mentoring."
>
  <section class="band">
    <div class="container hero">
      <div class="hero-text">
        <p class="eyebrow">Career pivots, powered by AI</p>
        <h1>I've reinvented my career three times.</h1>
        <p class="lead">
          Marine. Detective. Researcher. Enterprise technologist. Today I lead
          AI enablement at a Fortune 500 financial services company — and I
          help professionals write their own next chapter, with AI in their
          corner.
        </p>
        <div class="cta-row">
          <CTAButton href={url('/services/')}>Work with me</CTAButton>
          <CTAButton href={url('/about/')} variant="text">My story →</CTAButton>
        </div>
      </div>
      <img
        class="headshot"
        src={url('/headshot.jpg')}
        alt="Andre Richards"
        width="280"
        height="280"
        loading="eager"
      />
    </div>
  </section>

  <section class="band alt">
    <div class="container">
      <h2>How I can help</h2>
      <div class="cards">
        <ServiceCard title="AI-Powered Job Search Coaching">
          Your resume, applications, and interview prep — rebuilt with an AI
          workflow that makes you stand out instead of blending in.
        </ServiceCard>
        <ServiceCard title="Speaking">
          Story-driven talks on AI adoption and career reinvention, for
          conferences, companies, and community groups.
        </ServiceCard>
        <ServiceCard title="1:1 Pivot Sessions">
          Focused mentoring for professionals in the middle of a career change
          who want a plan, not platitudes.
        </ServiceCard>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="container">
      <p class="credibility">
        PMP® · Cisco Certified AI Technical Practitioner · Cisco Generative AI
        Blue Belt · Triangle Business Journal 40 Under 40 · 20+ years across
        military, law enforcement, research, and enterprise tech
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    display: flex;
    align-items: center;
    gap: 3rem;
    flex-wrap: wrap;
  }
  .hero-text { flex: 1 1 24rem; }
  .lead {
    font-size: 1.15rem;
    color: var(--text-muted);
    max-width: 38rem;
  }
  .cta-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .headshot {
    border-radius: 50%;
    object-fit: cover;
    flex: 0 0 auto;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }
  .credibility {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    margin: 0;
  }
</style>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && grep -c "reinvented my career three times" dist/index.html`
Expected: build exit 0; grep prints `1`.

Run: `grep -c "Fortune 500 financial services company" dist/index.html`
Expected: `1`. (Employer-neutral phrasing present; the word "MetLife" must appear NOWHERE — verify: `grep -ri metlife src dist` → no output.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ServiceCard.astro src/pages/index.astro
git commit -m "feat: build home page with hero, offering cards, and credibility strip"
```

---

### Task 5: About page (timeline)

**Files:**
- Create: `src/components/TimelineEntry.astro`
- Modify: `src/pages/about.astro` (replace stub body)

- [ ] **Step 1: Create `src/components/TimelineEntry.astro`**

```astro
---
interface Props {
  era: string;
  role: string;
  org: string;
}
const { era, role, org } = Astro.props;
---
<article class="entry">
  <p class="era">{era}</p>
  <h3>{role} · {org}</h3>
  <div class="body"><slot /></div>
  <p class="lesson"><strong>What this pivot taught me:</strong> <slot name="lesson" /></p>
</article>

<style>
  .entry {
    border-left: 2px solid var(--accent);
    padding: 0 0 2.5rem 1.5rem;
    position: relative;
  }
  .entry::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 0.35rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent);
  }
  .era {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-strong);
    margin-bottom: 0.25rem;
  }
  .entry h3 { margin-bottom: 0.5rem; }
  .body { color: var(--text-muted); }
  .lesson {
    margin: 0.75rem 0 0;
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 2: Replace `src/pages/about.astro` body**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTAButton from '../components/CTAButton.astro';
import TimelineEntry from '../components/TimelineEntry.astro';
import { url } from '../lib/url.js';
---
<BaseLayout
  title="My Story — Andre Richards"
  description="From the Marine Corps to AI enablement: the three career pivots behind Andre Richards' approach to reinvention."
>
  <section class="band">
    <div class="container narrow">
      <p class="eyebrow">My story</p>
      <h1>Reinvention isn't luck. It's a skill.</h1>
      <p class="lead">
        I've started over three times — each time walking away from an
        identity I'd worked years to build. Here's the path, and what each
        pivot taught me about change.
      </p>
    </div>
  </section>

  <section class="band">
    <div class="container narrow">
      <TimelineEntry era="2000 – 2005" role="Tactical Air Defense Operator" org="United States Marine Corps">
        Five years in uniform, with deployments to Jordan and Afghanistan. The
        Marines took a teenager and taught him standards, discipline, and how
        to perform when the stakes are real.
        <Fragment slot="lesson">
          Discipline beats motivation. Systems beat willpower. You don't rise
          to the occasion — you fall to the level of your training.
        </Fragment>
      </TimelineEntry>

      <TimelineEntry era="2006 – 2018" role="Detective & Supervisor" org="Durham Police Department">
        Nearly twelve years investigating the hardest cases a city produces —
        homicide, property crimes, and the Special Victims Unit — and leading
        the people who worked them.
        <Fragment slot="lesson">
          Every complex problem is a people problem first. Listening under
          pressure is a superpower, and trust is built in small, consistent
          acts.
        </Fragment>
      </TimelineEntry>

      <TimelineEntry era="2018 – 2021" role="Research Analyst" org="RTI International">
        I crossed from the street to the research world, translating between
        academics studying policing and the officers living it — and advising
        software teams building tools for law enforcement.
        <Fragment slot="lesson">
          The person who can translate between two worlds is more valuable
          than an expert in either. That's what a career changer actually is.
        </Fragment>
      </TimelineEntry>

      <TimelineEntry era="2021 – 2026" role="Customer Success Manager" org="Cisco">
        Enterprise tech, from a standing start. I guided Fortune 500 companies
        through technology adoption, earned Cisco's AI Technical Practitioner
        certification and Generative AI Blue Belt, and discovered the pattern
        behind every successful transformation.
        <Fragment slot="lesson">
          Adoption is never a technology problem. It's a confidence problem —
          and confidence can be coached.
        </Fragment>
      </TimelineEntry>

      <TimelineEntry era="Today" role="AI Enablement Leader" org="Fortune 500 Financial Services">
        I now lead AI enablement at a Fortune 500 financial services company,
        helping thousands of professionals work confidently with AI.
        <Fragment slot="lesson">
          The biggest career lever of our generation is sitting in a browser
          tab. Most people just need someone to show them how to pull it.
        </Fragment>
      </TimelineEntry>
    </div>
  </section>

  <section class="band alt">
    <div class="container narrow">
      <h2>The thesis</h2>
      <p>
        Reinvention is a repeatable skill — I've done it from the military to
        policing, policing to research, research to enterprise tech. And AI is
        the biggest lever a career changer has ever had. If you're standing at
        the edge of your own pivot, you don't need more courage. You need a
        blueprint.
      </p>
      <CTAButton href={url('/services/')}>Work with me</CTAButton>
    </div>
  </section>
</BaseLayout>

<style>
  .narrow { max-width: 46rem; }
  .lead {
    font-size: 1.15rem;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && grep -c "What this pivot taught me" dist/about/index.html`
Expected: build exit 0; grep prints `5`.

- [ ] **Step 4: Commit**

```bash
git add src/components/TimelineEntry.astro src/pages/about.astro
git commit -m "feat: build about page with five-era career timeline"
```

---

### Task 6: Services page

**Files:**
- Modify: `src/pages/services.astro` (replace stub body)

- [ ] **Step 1: Replace `src/pages/services.astro` body**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTAButton from '../components/CTAButton.astro';
---
<BaseLayout
  title="Services — Andre Richards"
  description="AI-powered job search coaching and 1:1 pivot sessions with Andre Richards."
>
  <section class="band">
    <div class="container narrow">
      <p class="eyebrow">Services</p>
      <h1>Work with me</h1>
      <p class="lead">
        Two ways to get help — both built on the same idea: AI won't replace
        you, but a candidate who uses it well will outcompete one who doesn't.
      </p>
    </div>
  </section>

  <section class="band alt">
    <div class="container narrow">
      <h2>AI-Powered Job Search Coaching</h2>
      <p>
        This is not a resume-writing service. It's a rebuild of how you run
        your search:
      </p>
      <ul>
        <li>
          <strong>Resume overhaul with an AI workflow</strong> — we rework
          your resume together and set up a repeatable process for tailoring
          it to every posting in minutes, not hours.
        </li>
        <li>
          <strong>Application strategy</strong> — where to aim, how to get
          past automated screening, and how to make an unusual background read
          as an asset.
        </li>
        <li>
          <strong>Interview preparation</strong> — using AI to rehearse
          smarter, anticipate questions, and tell your story with confidence.
        </li>
      </ul>
      <p class="who">
        <strong>Who this is for:</strong> job seekers and career changers who
        suspect their materials are getting filtered out before a human ever
        reads them.
      </p>
      <CTAButton href="mailto:richards.andre@gmail.com?subject=Job%20Search%20Coaching">
        Get in touch
      </CTAButton>
    </div>
  </section>

  <section class="band">
    <div class="container narrow">
      <h2>1:1 Pivot Sessions</h2>
      <p>
        Focused mentoring for professionals in the middle of a career change.
        I've pivoted from the military to policing, policing to research,
        research to enterprise tech — I know what the middle of the jump feels
        like. We'll turn "I want out" into a concrete plan: the skills story
        you'll tell, the bridge roles worth taking, and how to use AI to close
        gaps fast.
      </p>
      <p class="who">
        <strong>Who this is for:</strong> anyone standing at the edge of a
        pivot who wants a plan, not platitudes.
      </p>
      <CTAButton href="mailto:richards.andre@gmail.com?subject=1%3A1%20Pivot%20Session">
        Get in touch
      </CTAButton>
    </div>
  </section>

  <section class="band alt">
    <div class="container narrow">
      <p class="note">
        Pricing and scheduling are coming soon — for now, email me and tell me
        where you're stuck. I read everything.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .narrow { max-width: 46rem; }
  .lead {
    font-size: 1.15rem;
    color: var(--text-muted);
  }
  ul { padding-left: 1.25rem; }
  li { margin-bottom: 0.75rem; }
  .who { margin: 1.25rem 0 1.5rem; }
  .note {
    margin: 0;
    color: var(--text-muted);
    font-style: italic;
  }
</style>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build && grep -c "mailto:richards.andre@gmail.com" dist/services/index.html`
Expected: build exit 0; grep prints `2`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services.astro
git commit -m "feat: build services page with coaching and 1:1 session offerings"
```

---

### Task 7: Speaking page

**Files:**
- Create: `src/components/TalkTopic.astro`
- Modify: `src/pages/speaking.astro` (replace stub body)

- [ ] **Step 1: Create `src/components/TalkTopic.astro`**

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<article class="topic">
  <h3>{title}</h3>
  <p><slot /></p>
</article>

<style>
  .topic {
    border-top: 2px solid var(--accent);
    padding-top: 1rem;
    margin-bottom: 2rem;
  }
  .topic p {
    margin: 0;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Replace `src/pages/speaking.astro` body**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTAButton from '../components/CTAButton.astro';
import TalkTopic from '../components/TalkTopic.astro';
import { url } from '../lib/url.js';
---
<BaseLayout
  title="Speaking — Andre Richards"
  description="Book Andre Richards to speak on practical AI adoption and career reinvention."
>
  <section class="band">
    <div class="container narrow">
      <p class="eyebrow">Speaking</p>
      <h1>Talks that make AI feel possible.</h1>
      <p class="lead">
        I speak about AI adoption and career reinvention — as someone who has
        lived both. Audiences leave with practical next steps, not hype.
      </p>
      <CTAButton href="mailto:richards.andre@gmail.com?subject=Speaking%20Inquiry">
        Book me to speak
      </CTAButton>
    </div>
  </section>

  <section class="band alt">
    <div class="container narrow">
      <h2>Talk topics</h2>
      <TalkTopic title="Reinvention Is a Skill: What Three Career Pivots Taught Me About Change">
        From Marine to detective to enterprise technologist — this keynote
        breaks down the repeatable mechanics of starting over: how to
        translate old skills for a new field, survive the credibility gap,
        and why career changers are precisely the people who thrive in the AI
        era. Story-driven, funny in places, and unflinching about what the
        middle of a pivot really feels like.
      </TalkTopic>
      <TalkTopic title="AI for the Rest of Us: Practical Adoption for Non-Technical Professionals">
        Most AI talks are written for engineers. This one is for everyone
        else. Drawing on enterprise AI enablement work with thousands of
        professionals, it covers what AI actually does well today, the
        workflows worth adopting first, and how to build confidence in teams
        who fear the technology more than they understand it.
      </TalkTopic>
      <TalkTopic title="The AI-Powered Job Search: Standing Out When Everyone Has the Same Tools">
        Every candidate now has access to the same AI. So why do some
        applications get interviews while others vanish into screening
        software? This session shows job seekers how to use AI as a
        force multiplier for research, tailoring, and interview prep — while
        keeping the one thing AI can't fake: a genuine story.
      </TalkTopic>
    </div>
  </section>

  <section class="band">
    <div class="container narrow">
      <h2>Speaker bio</h2>
      <p class="label-line"><strong>Short (for programs):</strong></p>
      <p>
        Andre Richards is an AI enablement leader at a Fortune 500 financial
        services company who has reinvented his career three times — Marine,
        detective, enterprise technologist. He speaks on practical AI
        adoption and career transformation, and is based in the
        Raleigh-Durham area of North Carolina.
      </p>
      <p class="label-line"><strong>Long (for introductions):</strong></p>
      <p>
        Andre Richards leads AI enablement at a Fortune 500 financial
        services company, where he helps thousands of professionals work
        confidently with AI. His path there was anything but typical: five
        years as a Marine Corps tactical air defense operator with
        deployments to Jordan and Afghanistan, nearly twelve years as a
        Durham Police Department detective and supervisor working homicide
        and special victims cases, a research career at RTI International
        bridging academics and practitioners, and five years at Cisco guiding
        Fortune 500 companies through technology adoption. He holds an MBA, a
        PMP certification, and Cisco's AI Technical Practitioner and
        Generative AI Blue Belt credentials, and was named to the Triangle
        Business Journal's 40 Under 40. He speaks about the two things his
        career proves: reinvention is a learnable skill, and AI is the
        biggest lever a professional has ever had.
      </p>
      <p>
        <a href={url('/headshot.jpg')} download="andre-richards-headshot.jpg">
          Download headshot
        </a>
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .narrow { max-width: 46rem; }
  .lead {
    font-size: 1.15rem;
    color: var(--text-muted);
  }
  .label-line {
    margin-top: 1.5rem;
    color: var(--accent-strong);
  }
</style>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && grep -c '<article class="topic' dist/speaking/index.html`
Expected: build exit 0; grep prints `3` (exactly 3 talk topics per spec).

- [ ] **Step 4: Commit**

```bash
git add src/components/TalkTopic.astro src/pages/speaking.astro
git commit -m "feat: build speaking page with three talk topics and speaker bios"
```

---

### Task 8: Contact page & favicon

**Files:**
- Modify: `src/pages/contact.astro` (replace stub body)
- Create: `public/favicon.svg`

- [ ] **Step 1: Replace `src/pages/contact.astro` body**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CTAButton from '../components/CTAButton.astro';
---
<BaseLayout
  title="Contact — Andre Richards"
  description="Get in touch with Andre Richards about coaching, speaking, or AI."
>
  <section class="band">
    <div class="container narrow">
      <p class="eyebrow">Contact</p>
      <h1>Let's talk.</h1>
      <p class="lead">
        Coaching inquiries, speaking requests, or just comparing notes on
        where AI is taking our careers — my inbox is open.
      </p>
      <div class="cta-row">
        <CTAButton href="mailto:richards.andre@gmail.com">Email me</CTAButton>
        <CTAButton href="https://www.linkedin.com/in/andrekrichards" variant="text">
          Connect on LinkedIn →
        </CTAButton>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .narrow { max-width: 46rem; }
  .lead {
    font-size: 1.15rem;
    color: var(--text-muted);
  }
  .cta-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
</style>
```

- [ ] **Step 2: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#b0763c"/>
  <text x="32" y="42" font-family="Georgia, serif" font-size="26" fill="#faf6f0" text-anchor="middle">AR</text>
</svg>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && grep -c "linkedin.com/in/andrekrichards" dist/contact/index.html`
Expected: build exit 0; grep prints `1`. `dist/favicon.svg` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro public/favicon.svg
git commit -m "feat: build contact page and add favicon"
```

---

### Task 9: Internal link checker

**Files:**
- Create: `scripts/check-links.mjs`

- [ ] **Step 1: Create `scripts/check-links.mjs`**

Checks every `href`/`src` in built HTML that points inside the site's base path and fails if the target file doesn't exist in `dist/`.

```js
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
// NOTE: when migrating to Vercel (no base path), change BASE to ''.
const BASE = '/personal-website';

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return p.endsWith('.html') ? [p] : [];
  });
}

let failures = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const link of links) {
    if (!link.startsWith(BASE + '/') && link !== BASE) continue;
    const clean = link.slice(BASE.length).split(/[?#]/)[0];
    let target = join(DIST, clean);
    if (clean === '' || clean.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) {
      console.error(`BROKEN: ${link} (in ${file})`);
      failures++;
    }
  }
}
if (failures > 0) {
  console.error(`${failures} broken internal link(s).`);
  process.exit(1);
}
console.log('All internal links resolve.');
```

- [ ] **Step 2: Run it against a fresh build**

Run: `npm run build && npm run check-links`
Expected: `All internal links resolve.` and exit 0. If it reports broken links, fix the offending page before proceeding — do not weaken the checker.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-links.mjs
git commit -m "test: add internal link checker for built site"
```

---

### Task 10: README with Vercel migration runbook

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Andre Richards — Personal Website

Personal brand site: AI-focused career coaching, speaking, and 1:1 mentoring.
Built with [Astro](https://astro.build). Design spec lives in
`docs/superpowers/specs/2026-07-08-personal-brand-website-design.md`.

## Commands

| Command               | Action                                    |
| --------------------- | ----------------------------------------- |
| `npm install`         | Install dependencies                      |
| `npm run dev`         | Local dev server at `localhost:4321`      |
| `npm run build`       | Build production site to `./dist/`        |
| `npm run preview`     | Preview the production build locally      |
| `npm run check-links` | Verify all internal links in `./dist/`    |

## Editing content

All copy lives directly in `src/pages/*.astro`. Change the text, commit, and
push to `main` — GitHub Actions rebuilds and deploys automatically.

## Current status: unlisted

The site deploys to GitHub Pages but is **not indexed by search engines**
(every page has a `noindex` meta tag in `src/layouts/BaseLayout.astro`).
Share the URL only with people you choose.

## Going public later (Vercel + custom domain, ~5 minutes)

1. On [vercel.com](https://vercel.com): **Add New Project** → import this
   GitHub repo. Vercel auto-detects Astro; accept the defaults.
2. In `astro.config.mjs`: delete the `base:` line and change `site:` to your
   custom domain (e.g. `https://andrerichards.com`).
3. In `src/layouts/BaseLayout.astro`: delete the
   `<meta name="robots" content="noindex" />` line.
4. In `scripts/check-links.mjs`: change `BASE` to `''`.
5. Push. Add your custom domain in the Vercel project settings.
6. Optional: delete `.github/workflows/deploy.yml` and turn off GitHub Pages
   in the repo settings once Vercel is serving the site.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with editing guide and Vercel migration runbook"
```

---

### Task 11: GitHub repo, Pages workflow, deploy, live verification

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `astro.config.mjs` (replace `OWNER` with real username)

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

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
      - name: Build with Astro
        uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Set the real GitHub owner in `astro.config.mjs`**

Run: `OWNER=$(gh api user -q .login) && echo "$OWNER"`
Expected: prints the GitHub username.

Then edit `astro.config.mjs`, replacing the literal string `OWNER` in the `site:` value with that username. Verify: `grep site astro.config.mjs` shows e.g. `site: 'https://andrekrichards.github.io',`.

- [ ] **Step 3: Verify clean build one final time**

Run: `npm run build && npm run check-links && grep -ri metlife src dist || echo CLEAN`
Expected: build exit 0, links clean, final output `CLEAN` (grep found nothing).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml astro.config.mjs
git commit -m "ci: add GitHub Pages deploy workflow and set site owner"
```

- [ ] **Step 5: Create the public repo and push**

Run: `gh repo create personal-website --public --source=. --remote=origin --push`
Expected: repo created at `<owner>/personal-website`, `main` pushed.

- [ ] **Step 6: Enable GitHub Pages with Actions as the build source**

(`$OWNER` does not persist between shell calls — re-derive it in any step that uses it: `OWNER=$(gh api user -q .login)`.)

Run: `OWNER=$(gh api user -q .login) && gh api -X POST "repos/$OWNER/personal-website/pages" -f build_type=workflow`
Expected: JSON response with `"build_type": "workflow"`.
If it returns HTTP 409 (already exists), run instead:
`gh api -X PUT "repos/$OWNER/personal-website/pages" -f build_type=workflow`

- [ ] **Step 7: Re-run the deploy workflow and watch it**

The first push may have run before Pages was enabled. Run:
`gh workflow run deploy.yml && sleep 10 && gh run watch $(gh run list --workflow=deploy.yml --limit 1 --json databaseId -q '.[0].databaseId') --exit-status`
Expected: workflow completes with success.

- [ ] **Step 8: Verify the live site**

Run (all five pages):

```bash
OWNER=$(gh api user -q .login)
for p in "" "about/" "services/" "speaking/" "contact/"; do
  printf '%s: ' "/$p"
  curl -s -o /dev/null -w '%{http_code}\n' "https://$OWNER.github.io/personal-website/$p"
done
```

Expected: five lines, all `200`. (Pages DNS can take a minute or two after the first deploy — retry once after 2 minutes before declaring failure.)

Run: `curl -s "https://$OWNER.github.io/personal-website/" | grep -c noindex`
Expected: `1`.

- [ ] **Step 9: Report the live URL**

Final deliverable: `https://<owner>.github.io/personal-website/` — include this URL in the completion report.
