import type { L10n } from "../i18n";

/* The strip of figures under the hero.

   About the lines-of-code figure: counted on 13 Oct 2026 from the public
   repositories of github.com/theghost1980 plus the two public Hive Keychain
   repositories (extension and mobile). It is the number of lines ADDED in
   commits signed with your e-mail on each default branch, code files only
   (ts, tsx, js, jsx, css, scss, html, java...). Lock files, node_modules,
   build output, coverage reports and merge commits are left out.
   Result: 297,381 lines in 2,308 commits (181,788 of them in Hive Keychain).
   Private repositories are not included, so the real figure is higher. */
export const stats: { value: L10n; label: L10n }[] = [
  { value: "6+", label: { en: "years building software for web and mobile", es: "años creando software para web y móvil" } },
  { value: "10,000+", label: { en: "users on the product I worked on longest", es: "usuarios en el producto donde más tiempo trabajé" } },
  { value: "$10,000+", label: { en: "revenue from a single feature in 5 months", es: "de ingresos con una sola función en 5 meses" } },
  { value: { en: "2 months", es: "2 meses" }, label: { en: "from idea to a working AI product", es: "de la idea a un producto de IA funcionando" } },
  { value: "290,000+", label: { en: "lines of code committed to public repositories", es: "líneas de código subidas a repositorios públicos" } },
];
