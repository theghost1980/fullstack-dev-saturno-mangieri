/* Languages. English lives at "/", Spanish at "/es/". */
export const languages = { en: "English", es: "Español" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "en";

/** A text that is either the same in every language, or one string per language. */
export type L10n = string | { en: string; es?: string };

/** Pick the right language, falling back to English. */
export const tr = (value: L10n | undefined, lang: Lang): string =>
  !value ? "" : typeof value === "string" ? value : (value[lang] ?? value.en);

export const pathFor = (lang: Lang): string => (lang === defaultLang ? "/" : `/${lang}/`);

/** Social preview image (1200x630, in public/) and Open Graph locale of each language. */
export const ogImageFor = (lang: Lang): string => (lang === defaultLang ? "/og.png" : `/og-${lang}.png`);
export const ogLocales: Record<Lang, string> = { en: "en_US", es: "es_ES" };
export const otherLang = (lang: Lang): Lang => (lang === "en" ? "es" : "en");
