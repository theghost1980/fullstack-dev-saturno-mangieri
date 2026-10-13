# Saturno Mangieri — site

Portfolio and CV site. Built with [Astro](https://astro.build): it compiles to plain
HTML, CSS and a small script, so it can be hosted anywhere.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321  (English)  and  /es/  (Spanish)
npm run build     # writes the finished site to dist/
npm run preview   # serves dist/ to check the build
npm run check     # type-checks the .astro and .ts files
```

Needs Node 22.12 or newer (Astro 7 requires it).

## Before publishing

1. In `astro.config.mjs`, change `site` from `https://example.com` to the real domain.
   It feeds the canonical and language links, the social preview image address,
   `sitemap-index.xml` and `robots.txt`.
2. Check `src/data/experience.ts`: periods and titles were put together from public
   commit dates and should be confirmed.
3. Deploy from the Git repository on **Netlify**. `netlify.toml` already sets the build
   command, the `dist` folder and the functions folder. Do not deploy only `dist/`
   somewhere else: Alter's typed answers need the Netlify function (see "Alter" below).

## Where things are

| To change... | Edit |
|---|---|
| Projects (texts, links, screenshots) | `src/data/projects.ts` |
| Services | `src/data/services.ts` |
| The figures under the hero | `src/data/stats.ts` |
| Experience timeline | `src/data/experience.ts` |
| Partners | `src/data/partners.ts` |
| E-mail, LinkedIn, GitHub, booking link | `src/data/site.ts` |
| Image shown when the link is shared (1200×630, one per language) | `public/og.png`, `public/og-es.png` |
| Headings, buttons and section texts, in both languages | `src/i18n/ui.ts` |
| Colours, type and layout | `src/styles/global.css` |
| Section order | `src/components/Home.astro` |

Every data file starts with a comment that explains its fields.

## Booking (Cal.com)

Every "Book a call" button opens the Cal.com calendar as a dialog. Cal.com's script is
only downloaded on the first click, so the page loads nothing from them until then. If
JavaScript is off, or the script cannot load, the button simply opens the Cal.com page.

- The event (`username/event`) is set once, in `src/data/site.ts`.
- The calendar's colours and layout are in the booking block of `src/scripts/site.js`.
  The dialog follows the site's light or dark theme.
- The footer carries a Cal.com referral link, labelled as such (`calReferral` in
  `site.ts`; set it to `""` to hide it).

## Alter (the AI assistant)

Alter is the animated planet in the corner of the page. Its ready-made questions are
answered from `src/data/alter.ts` and cost nothing. Typed questions go to
`netlify/functions/alter.mjs`, which asks an AI model through OpenRouter and may only use
the facts of the site (`/alter-knowledge.json`, built from `src/data`). The only prices it
can quote are the hourly rates in `src/data/rates.ts`.

- With `npm run dev` typed questions say "I can only answer the questions below": the
  function only exists on Netlify (or with `npx netlify-cli dev`).
- The OpenRouter key lives only in Netlify, as `OPENROUTER_API_KEY`. Never in the repo.
  See `.env.example` for the other variables.
- Full description, limits and privacy: `docs/alter/SPEC.md`. Step-by-step setup and the
  production test table: `docs/alter/INSTRUCCIONES-PARA-LA-IA.md`.
- Its "Book a call" button opens the same Cal.com dialog as the rest of the site.

## Add a project

1. Put its images in `public/media/<slug>/` (WebP, about 1600 px wide for desktop
   captures and 700 px for phone captures, plus a small `-thumb` version).
2. Copy an object in `src/data/projects.ts` and edit it. The page, the filter and the
   list update on their own.

Texts can be a plain string, or `{ en: "...", es: "..." }` when they differ by language.

## Languages

English is served at `/` and Spanish at `/es/`. Both pages render the same component
(`src/components/Home.astro`) with a different `lang`. To add a language: add it in
`src/i18n/index.ts`, add its block in `src/i18n/ui.ts`, add the `es`-style key to the
data files, and create `src/pages/<code>/index.astro`.

## The lines-of-code figure

Counted on 13 Oct 2026 from the public repositories of `github.com/theghost1980` and
the two public Hive Keychain repositories: lines added in commits signed with your
e-mail on each default branch, code files only, without lock files, dependencies, build
output, coverage reports or merge commits. Result: 297,381 lines in 2,308 commits,
shown as "290,000+". Private repositories are not counted.
