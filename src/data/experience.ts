import type { L10n } from "../i18n";

/* The timeline in the Experience section.

   These entries were put together from the dates of your public commits on
   GitHub and from the project facts you gave. Check periods and titles, and
   edit freely: nothing else depends on this file. */
export interface Job {
  period: L10n;
  title: L10n;
  org: string;
  summary: L10n;
  stack: string[];
}

export const experience: Job[] = [
  {
    period: "2026",
    title: { en: "Design and development: AI reporting platform", es: "Diseño y desarrollo: plataforma de informes con IA" },
    org: "AutoMastery",
    summary: {
      en: "A platform that turns the phone calls of auto repair shops into client reports: AI reads each call, code checks every quote against the transcript and a person reviews what is still in doubt. First working version in 2 months.",
      es: "Una plataforma que convierte las llamadas de talleres mecánicos en informes para clientes: la IA lee cada llamada, el código comprueba cada cita contra la transcripción y una persona revisa lo que sigue en duda. Primera versión funcionando en 2 meses.",
    },
    stack: ["Generative AI"],
  },
  {
    period: { en: "2025 to today", es: "2025 a hoy" },
    title: { en: "Independent engineer: products and client work", es: "Ingeniero independiente: productos y trabajo para clientes" },
    org: "",
    summary: {
      en: "AegisPad, RenovaYa, the Rocco Mangieri site and the NaN Systems redesign, plus open-source tools for the Hive blockchain.",
      es: "AegisPad, RenovaYa, el sitio de Rocco Mangieri y el rediseño de NaN Systems, además de herramientas de código abierto para la blockchain Hive.",
    },
    stack: ["Next.js", "TypeScript", "React", "Node.js", "Generative AI"],
  },
  {
    period: "2022 – 2024",
    title: { en: "Engineer on the product team", es: "Ingeniero en el equipo de producto" },
    org: "Hive Keychain",
    summary: {
      en: "Mobile app and browser extension of a crypto wallet with 10,000+ users. Redesigned core screens and shipped 12+ features, among them the swap widget and Android home-screen widgets in native Java. 1,500+ commits across both codebases.",
      es: "App móvil y extensión de navegador de una wallet cripto con más de 10.000 usuarios. Rediseñé pantallas principales y publiqué más de 12 funciones, entre ellas el widget de swap y widgets para la pantalla de inicio de Android en Java nativo. Más de 1.500 commits entre los dos códigos.",
    },
    stack: ["React Native", "React", "TypeScript", "Java (Android)"],
  },
  {
    period: "2021",
    title: { en: "Design and development", es: "Diseño y desarrollo" },
    org: "JobABoard",
    summary: {
      en: "A marketplace for jobs and services paid in cryptocurrency on the Hive blockchain, front end and back end.",
      es: "Un marketplace de trabajos y servicios pagados en criptomonedas sobre la blockchain Hive, front end y back end.",
    },
    stack: ["Gatsby", "React", "Node.js", "MongoDB"],
  },
  {
    period: { en: "2020 to today", es: "2020 a hoy" },
    title: { en: "Design and development", es: "Diseño y desarrollo" },
    org: "NaN Systems",
    summary: {
      en: "Bilingual site, blog and CV for an engineering consultant in Austin, Texas. Live since 2020, redesigned in 2026.",
      es: "Sitio bilingüe, blog y CV de una consultora de ingeniería en Austin, Texas. En línea desde 2020, rediseñado en 2026.",
    },
    stack: ["Gatsby", "React", "DatoCMS"],
  },
];
