# Project notes for Claude

Astro 7 static site, no UI framework. Portfolio and CV of Saturno Mangieri,
in English (`/`) and Spanish (`/es/`).

## Commands
- `npm run dev` — dev server on http://localhost:4321
- `npm run build` — static build into `dist/`
- `npm run preview` — serve the build

## Layout
- `src/pages/index.astro`, `src/pages/es/index.astro` — both render `src/components/Home.astro` with a `lang` prop.
- `src/components/` — one component per page section; `Shot.astro` draws a screenshot or video in a device frame; `ProjectMedia.astro` is the per-project gallery; `Illustration.astro` holds drawn stand-ins for projects without screenshots.
- `src/data/*.ts` — all content. Each file documents its own fields at the top.
- `src/i18n/` — `index.ts` (languages, `tr()` helper, `L10n` type), `ui.ts` (interface strings, `en` and `es` must keep the same shape).
- `src/styles/global.css` — one stylesheet: tokens first (light, then dark twice: system and chosen), then sections in page order.
- `src/scripts/site.js` — theme, menu, hero tabs, project filter and list, galleries, video autoplay, and the Cal.com booking dialog. The page is complete without it.
- Alter, the AI assistant: `src/components/Alter.astro`, `src/scripts/alter.js`, `src/data/alter.ts` (texts, ready-made answers), `src/data/rates.ts` (the only prices it may quote), `src/pages/alter-knowledge.json.ts` (its facts, built from `src/data`), `netlify/functions/alter.mjs` (server, OpenRouter). Spec in `docs/alter/SPEC.md`.
- `public/media/<project>/` — optimised WebP screenshots, thumbnails and the RenovaYa video.

## Conventions
- Content never goes into components: add it to `src/data` or `src/i18n/ui.ts`.
- Any user-facing text must exist in both `en` and `es`.
- Do not invent figures, clients or dates. Facts come from the owner.
- Alter says only what is in `src/data`; when a project or figure changes, check the ready-made answers in `src/data/alter.ts`. Never put the OpenRouter key in a file: it is a Netlify variable.
- Booking buttons use `bookAttrs` from `src/data/site.ts` (`data-book-*`, never `data-cal-*`, or the dialog opens twice).
- Colour roles are fixed (see the comment at the top of `global.css`): blue-to-teal gradient for identity, coral only for the "Book a call" action, signal green only for "Live".
- Keep it accessible: visible focus, sufficient contrast in both themes, `prefers-reduced-motion` respected, real `alt` text for every image.
- Sizes of images are declared in `projects.ts` (`w`, `h`); update them when replacing a file.
