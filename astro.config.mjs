import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Set `site` to the final domain before deploying: it feeds the canonical and hreflang links,
// the social preview image, the sitemap and robots.txt.
export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap({ i18n: { defaultLocale: "en", locales: { en: "en", es: "es" } } })],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: { prefixDefaultLocale: false },
  },
});
