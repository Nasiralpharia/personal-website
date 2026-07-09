# Andre Richards — Personal Website

Personal brand site: AI-focused career coaching, speaking, and 1:1 mentoring.
Built with [Astro](https://astro.build). Design spec lives in
`docs/superpowers/specs/2026-07-08-personal-brand-website-design.md`.

## Commands

| Command               | Action                                    |
| --------------------- | ------------------------------------------ |
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
