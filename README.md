# Meridian

A specialty coffee brand coming-soon landing page. Editorial dark/light aesthetic, Supabase-backed waitlist capture, and a three-page funnel (`/` → `/about` → `/thanks`).

> *Coffee at the crossroads of craft and origin.*

## What's here

- **Astro 5 + Tailwind v4** (via `@tailwindcss/vite`), deployed to Vercel with `@astrojs/vercel` (server output).
- **Supabase** — `meridian_waitlist` table with an anon-INSERT RLS policy. `/api/waitlist` validates email, honeypots bots, and inserts.
- **Resend** — a warm confirmation email fires from `onboarding@resend.dev` to each new waitlist member (best-effort, non-blocking).
- **SEO** — `@astrojs/sitemap` (`/sitemap-index.xml`), `robots.txt`, JSON-LD on every page, shared `SEOHead.astro`, canonical URLs, OG/Twitter cards.
- **Theme** — dark/light toggle, persisted in `localStorage`.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Hero + story teaser + opening-roster preview + waitlist form |
| `/about` | Long-form brand story |
| `/thanks` | Post-signup confirmation, `noindex` |

## Local dev

```bash
npm install --legacy-peer-deps
npm run dev
```
