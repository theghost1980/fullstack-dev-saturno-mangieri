import type { APIRoute } from "astro";

/* Allows everything and points crawlers at the sitemap. Uses `site` from astro.config.mjs. */
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", site).href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
