import type { L10n } from "../i18n";

/* =====================================================================
   HOW TO ADD A PROJECT
   Copy one object inside `projects`, paste it where you want it to appear
   and edit the fields. The page, the filter and the layout update on
   their own (works with 1, 4 or 12 projects).

     slug         Short id, lowercase, no spaces. Used in HTML ids.
     name         Project name.
     type         Short label: "Website", "Mobile app"...
     services     Ids from src/data/services.ts. Drives the filter.
     problem / solution / result
                  One sentence each. Leave "" to skip one.
     role         What you did. "" to skip.
     liveUrl      Full URL of the live demo. "" = no "Open live demo" button.
     repoUrl      Public repository. "" = no "View code" link.
     media        Screenshots and videos, in the order they are shown.
                  Put the files in public/media/<slug>/ and describe each one:
                    image: { kind: "image", src, thumb, w, h, frame, alt }
                    video: { kind: "video", webm, mp4, poster, w, h, frame, alt }
                  frame is "browser", "phone" or "plain" (no device around it).
                  w and h are the real pixel size of the file.
                  Optional on any of them:
                    caption  a line shown under the picture (alt is not visible).
                    zoom     true = adds an "Open full size" link (images only).
     clientUrl    The client's own website. "" = no "Client website" link.
     note         A line shown under the buttons, for what a visitor should
                  know before trying it. Replaces the default note of the
                  status (which is only shown when there is no liveUrl).
     illustration Only used when `media` is empty: a drawn stand-in,
                  labelled "Illustration". Today only "aegispad" exists.
     illustrationFrame  "browser" or "phone", for that stand-in.
     hero         true = also shown in the switcher at the top of the page
                  (needs a liveUrl).
     status       "live" | "soon" | "unreleased" | "shipped" | "private" | "archived"

   Any text can be a plain string (same in every language) or
   { en: "...", es: "..." }.
   ===================================================================== */

export type Frame = "browser" | "phone" | "plain";
export type Media =
  | { kind: "image"; src: string; thumb: string; w: number; h: number; frame: Frame; alt: L10n; caption?: L10n; zoom?: boolean }
  | { kind: "video"; webm: string; mp4: string; poster: string; w: number; h: number; frame: Frame; alt: L10n; caption?: L10n };

export interface Project {
  slug: string;
  name: string;
  type: L10n;
  services: string[];
  problem: L10n;
  solution: L10n;
  result: L10n;
  role: L10n;
  liveUrl: string;
  repoUrl: string;
  clientUrl?: string;
  note?: L10n;
  media: Media[];
  illustration?: "aegispad";
  illustrationFrame?: "browser" | "phone";
  hero: boolean;
  status: "live" | "soon" | "unreleased" | "shipped" | "private" | "archived";
}

const designDev: L10n = { en: "Design and development", es: "Diseño y desarrollo" };

export const projects: Project[] = [
  {
    slug: "renovaya",
    name: "RenovaYa",
    type: { en: "SaaS platform, mobile-first", es: "Plataforma SaaS, pensada para móvil" },
    services: ["web"],
    problem: {
      en: "Businesses that bill monthly over WhatsApp lose track of who has paid and who is due.",
      es: "Los negocios que cobran cada mes por WhatsApp pierden la cuenta de quién pagó y a quién le toca.",
    },
    solution: {
      en: "One daily board for clients, due dates, payments and reminders, built for the phone first.",
      es: "Un tablero diario con clientes, vencimientos, pagos y recordatorios, pensado primero para el móvil.",
    },
    result: { en: "Live today, in closed beta.", es: "En vivo hoy, en beta cerrada." },
    role: designDev,
    liveUrl: "https://renovaya.vercel.app/",
    repoUrl: "",
    media: [
      {
        kind: "video",
        webm: "/media/renovaya/hero.webm",
        mp4: "/media/renovaya/hero.mp4",
        poster: "/media/renovaya/hero-poster.webp",
        w: 720,
        h: 1280,
        frame: "plain",
        alt: { en: "RenovaYa promo video: a messy chat turns into an ordered payment board", es: "Vídeo de RenovaYa: un chat caótico se convierte en un tablero de cobros ordenado" },
      },
      { kind: "image", src: "/media/renovaya/desktop.webp", thumb: "/media/renovaya/desktop-thumb.webp", w: 1600, h: 812, frame: "browser", alt: { en: "RenovaYa home page on desktop", es: "Página de inicio de RenovaYa en escritorio" } },
      { kind: "image", src: "/media/renovaya/mobile.webp", thumb: "/media/renovaya/mobile-thumb.webp", w: 434, h: 769, frame: "phone", alt: { en: "RenovaYa home page on a phone", es: "Página de inicio de RenovaYa en el móvil" } },
    ],
    hero: true,
    status: "live",
  },
  {
    slug: "hive-keychain",
    name: "Hive Keychain",
    type: { en: "Mobile app + browser extension", es: "App móvil + extensión de navegador" },
    services: ["mobile", "web", "web3"],
    problem: {
      en: "People trust this crypto wallet with their funds, so every screen has to be clear.",
      es: "La gente confía sus fondos a esta wallet cripto, así que cada pantalla tiene que ser clara.",
    },
    solution: {
      en: "As part of the team, I redesigned core screens and shipped 12+ features: among them a swap widget, and Android home-screen widgets written as native Java modules for the React Native app.",
      es: "Como parte del equipo, rediseñé pantallas principales y publiqué más de 12 funciones: entre ellas un widget de swap y widgets para la pantalla de inicio de Android, escritos como módulos nativos en Java para la app en React Native.",
    },
    result: {
      en: "10,000+ users. The swap widget generated $10,000+ in its first 5 months.",
      es: "Más de 10.000 usuarios. El widget de swap generó más de $10.000 en sus primeros 5 meses.",
    },
    role: { en: "Engineer on the product team", es: "Ingeniero en el equipo de producto" },
    liveUrl: "",
    repoUrl: "https://github.com/hive-keychain",
    media: [
      { kind: "image", src: "/media/keychain/swap-widget.webp", thumb: "/media/keychain/swap-widget-thumb.webp", w: 1200, h: 800, frame: "plain", alt: { en: "Keychain swap widget", es: "Widget de swap de Keychain" } },
      {
        kind: "image", src: "/media/keychain/android-widgets.webp", thumb: "/media/keychain/android-widgets-thumb.webp", w: 744, h: 1200, frame: "plain",
        alt: { en: "Android home-screen widgets: price ticker and portfolio", es: "Widgets para la pantalla de inicio de Android: precio y portafolio" },
        caption: {
          en: "Android home-screen widgets, written in native Java (widget providers, list services and shared storage) and fed with data by the React Native app.",
          es: "Widgets para la pantalla de inicio de Android, escritos en Java nativo (proveedores de widget, servicios de lista y almacenamiento compartido) y alimentados con datos por la app en React Native.",
        },
      },
      {
        kind: "image", src: "/media/keychain/android-widget-home.webp", thumb: "/media/keychain/android-widget-home-thumb.webp", w: 379, h: 372, frame: "plain",
        alt: { en: "The price widget on an Android home screen", es: "El widget de precio en una pantalla de inicio de Android" },
        caption: { en: "The price widget on a real home screen, with its chart drawn natively.", es: "El widget de precio en una pantalla de inicio real, con su gráfico dibujado de forma nativa." },
      },
      { kind: "image", src: "/media/keychain/app-wallet.webp", thumb: "/media/keychain/app-wallet-thumb.webp", w: 720, h: 1216, frame: "phone", alt: { en: "Mobile app: wallet screen", es: "App móvil: pantalla de la wallet" } },
      { kind: "image", src: "/media/keychain/app-actions.webp", thumb: "/media/keychain/app-actions-thumb.webp", w: 720, h: 1216, frame: "phone", alt: { en: "Mobile app: token actions", es: "App móvil: acciones de un token" } },
      { kind: "image", src: "/media/keychain/app-menu.webp", thumb: "/media/keychain/app-menu-thumb.webp", w: 720, h: 1216, frame: "phone", alt: { en: "Mobile app: menu in the light theme", es: "App móvil: menú en tema claro" } },
      {
        kind: "image", src: "/media/keychain/swap-widget-config.webp", thumb: "/media/keychain/swap-widget-config-thumb.webp", w: 1600, h: 992, frame: "browser",
        alt: { en: "Swap widget: configuration page for partners", es: "Widget de swap: página de configuración para partners" },
        caption: { en: "The swap widget's configuration page: partners set it up and copy the embed code.", es: "La página de configuración del widget de swap: los partners lo ajustan y copian el código para incrustarlo." },
      },
      { kind: "image", src: "/media/keychain/extension-transactions.webp", thumb: "/media/keychain/extension-transactions-thumb.webp", w: 1280, h: 800, frame: "plain", alt: { en: "Browser extension: transactions", es: "Extensión de navegador: transacciones" } },
      { kind: "image", src: "/media/keychain/extension-themes.webp", thumb: "/media/keychain/extension-themes-thumb.webp", w: 1280, h: 800, frame: "plain", alt: { en: "Browser extension: dark and light themes", es: "Extensión de navegador: temas oscuro y claro" } },
    ],
    hero: false,
    status: "shipped",
  },
  {
    slug: "nan-systems",
    name: "NaN Systems",
    type: { en: "Website, blog and CV", es: "Sitio web, blog y CV" },
    services: ["web"],
    problem: {
      en: "An engineering consultant in Austin, Texas needed one place for her services, portfolio, blog and CV, in English and Spanish.",
      es: "Una consultora de ingeniería en Austin, Texas necesitaba un solo lugar para sus servicios, portafolio, blog y CV, en inglés y español.",
    },
    solution: {
      en: "A bilingual site with a blog she updates from a content manager, and light and dark themes.",
      es: "Un sitio bilingüe con un blog que ella actualiza desde un gestor de contenido, y temas claro y oscuro.",
    },
    result: { en: "Live since 2020. Redesigned in 2026.", es: "En línea desde 2020. Rediseñado en 2026." },
    role: designDev,
    liveUrl: "https://nansystems.us/",
    repoUrl: "",
    media: [
      { kind: "image", src: "/media/nansystems/desktop.webp", thumb: "/media/nansystems/desktop-thumb.webp", w: 1600, h: 754, frame: "browser", alt: { en: "NaN Systems home page on desktop, dark theme", es: "Página de inicio de NaN Systems en escritorio, tema oscuro" } },
      { kind: "image", src: "/media/nansystems/mobile.webp", thumb: "/media/nansystems/mobile-thumb.webp", w: 526, h: 787, frame: "phone", alt: { en: "NaN Systems home page on a phone, in Spanish", es: "Página de inicio de NaN Systems en el móvil, en español" } },
    ],
    hero: true,
    status: "live",
  },
  {
    slug: "aegispad",
    name: "AegisPad",
    type: { en: "AI web app", es: "App web con IA" },
    services: ["web", "ai"],
    problem: {
      en: "Writing, revising and translating one article usually means switching between several tools.",
      es: "Escribir, revisar y traducir un artículo suele obligar a saltar entre varias herramientas.",
    },
    solution: {
      en: "A single editor that reviews the text, translates it and takes voice dictation.",
      es: "Un único editor que revisa el texto, lo traduce y acepta dictado por voz.",
    },
    result: { en: "Live today and open to try.", es: "En vivo hoy y abierto para probar." },
    role: designDev,
    liveUrl: "https://aegis-pad.netlify.app/",
    repoUrl: "https://github.com/theghost1980/aegispad-nextjs-ai",
    media: [
      { kind: "image", src: "/media/aegispad/desktop.webp", thumb: "/media/aegispad/desktop-thumb.webp", w: 1600, h: 689, frame: "browser", alt: { en: "AegisPad home page on desktop, dark theme", es: "Página de inicio de AegisPad en escritorio, tema oscuro" } },
      { kind: "image", src: "/media/aegispad/mobile.webp", thumb: "/media/aegispad/mobile-thumb.webp", w: 342, h: 762, frame: "phone", alt: { en: "AegisPad home page on a phone, dark theme", es: "Página de inicio de AegisPad en el móvil, tema oscuro" } },
    ],
    hero: true,
    status: "live",
  },
  {
    slug: "rocco-mangieri",
    name: "Rocco Mangieri",
    type: { en: "Website", es: "Sitio web" },
    services: ["web"],
    problem: {
      en: "A scholar needed his biography, publications and dossiers in one place, for readers in three languages.",
      es: "Un académico necesitaba su biografía, publicaciones y dosieres en un solo lugar, para lectores en tres idiomas.",
    },
    solution: {
      en: "An academic portfolio in English, Spanish and Italian, with downloadable dossiers and no trackers.",
      es: "Un portafolio académico en inglés, español e italiano, con dosieres descargables y sin rastreadores.",
    },
    result: { en: "Live today. One site, three languages, zero trackers.", es: "En vivo hoy. Un sitio, tres idiomas, cero rastreadores." },
    role: designDev,
    liveUrl: "https://roccomangieri.netlify.app/",
    repoUrl: "",
    media: [
      { kind: "image", src: "/media/rocco/desktop.webp", thumb: "/media/rocco/desktop-thumb.webp", w: 1600, h: 820, frame: "browser", alt: { en: "Rocco Mangieri home page on desktop", es: "Página de inicio de Rocco Mangieri en escritorio" } },
      { kind: "image", src: "/media/rocco/mobile.webp", thumb: "/media/rocco/mobile-thumb.webp", w: 343, h: 763, frame: "phone", alt: { en: "Rocco Mangieri work page on a phone", es: "Página de trabajo de Rocco Mangieri en el móvil" } },
    ],
    hero: true,
    status: "live",
  },
  {
    slug: "jobaboard",
    name: "JobABoard",
    type: { en: "Marketplace on the Hive blockchain", es: "Marketplace sobre la blockchain Hive" },
    services: ["web", "web3"],
    problem: {
      en: "Let people publish jobs and services and get paid in cryptocurrency, wherever they work.",
      es: "Que cualquiera pueda publicar trabajos y servicios y cobrar en criptomonedas, trabaje donde trabaje.",
    },
    solution: {
      en: "A marketplace on Hive: a Gatsby front end and a Node.js back end with MongoDB, its own image CDN and NFT tokens.",
      es: "Un marketplace sobre Hive: front end en Gatsby y back end en Node.js con MongoDB, CDN de imágenes propio y tokens NFT.",
    },
    result: {
      en: "Built end to end in 2021: 370+ commits between front end and back end.",
      es: "Construido de principio a fin en 2021: más de 370 commits entre front end y back end.",
    },
    role: designDev,
    liveUrl: "https://jobaboard.netlify.app/",
    repoUrl: "https://github.com/theghost1980/jobaboard",
    note: {
      en: "The front end is online. The back end runs on request: if you are interested in the NFTs on Hive, write to me ahead of time and I will switch it on for you to try.",
      es: "El front end está en línea. El back end se enciende bajo petición: si te interesan los NFT en Hive, escríbeme con tiempo y lo activo para que lo pruebes.",
    },
    media: [
      { kind: "image", src: "/media/jobaboard/desktop.webp", thumb: "/media/jobaboard/desktop-thumb.webp", w: 1600, h: 741, frame: "browser", alt: { en: "JobABoard home page on desktop", es: "Página de inicio de JobABoard en escritorio" } },
      { kind: "image", src: "/media/jobaboard/mobile.webp", thumb: "/media/jobaboard/mobile-thumb.webp", w: 433, h: 769, frame: "phone", alt: { en: "JobABoard home page on a phone", es: "Página de inicio de JobABoard en el móvil" } },
    ],
    hero: false,
    status: "archived",
  },
  {
    slug: "automastery",
    name: "AutoMastery",
    type: { en: "AI reporting platform for a US marketing agency", es: "Plataforma de informes con IA para una agencia de marketing de EE. UU." },
    services: ["ai", "web"],
    problem: {
      en: "AutoMastery runs marketing for auto repair shops and reviews their phone calls. It needed client reports it could trust, straight from those calls.",
      es: "AutoMastery lleva el marketing de talleres mecánicos y revisa sus llamadas telefónicas. Necesitaba informes para clientes en los que pudiera confiar, sacados directamente de esas llamadas.",
    },
    solution: {
      en: "Code sorts the calls, AI reads each one and quotes the exact words, code checks every quote against the transcript, and a person reviews only what is still in doubt.",
      es: "El código clasifica las llamadas, la IA lee cada una y cita las palabras exactas, el código comprueba cada cita contra la transcripción y una persona revisa solo lo que sigue en duda.",
    },
    result: { en: "First working version in 2 months.", es: "Primera versión funcionando en 2 meses." },
    role: designDev,
    liveUrl: "",
    repoUrl: "",
    clientUrl: "https://automastery.com/",
    media: [
      {
        kind: "video",
        webm: "/media/automastery/explainer.webm",
        mp4: "/media/automastery/explainer.mp4",
        poster: "/media/automastery/explainer-poster.webp",
        w: 1280,
        h: 720,
        frame: "plain",
        alt: { en: "Animation: calls go through code, AI and a human check, and come out as a report", es: "Animación: las llamadas pasan por código, IA y revisión humana, y salen como un informe" },
        caption: { en: "The system in ten seconds: code filters, AI reads, a person confirms, the report comes out.", es: "El sistema en diez segundos: el código filtra, la IA lee, una persona confirma y sale el informe." },
      },
      {
        kind: "image", src: "/media/automastery/diagram.webp", thumb: "/media/automastery/diagram-thumb.webp", w: 2000, h: 1256, frame: "plain", zoom: true,
        alt: { en: "Diagram: from calls to report, which steps are done by code, by AI and by a person", es: "Diagrama: de las llamadas al informe, qué pasos hace el código, la IA y una persona" },
        caption: { en: "Who does what: code, AI, a person and the memory that grows with each review.", es: "Quién hace qué: el código, la IA, una persona y la memoria que crece con cada revisión." },
      },
    ],
    hero: false,
    status: "private",
  },
  {
    slug: "senda",
    name: "Senda",
    type: { en: "Mobile app", es: "App móvil" },
    services: ["mobile"],
    problem: {
      en: "Organisers of expeditions and guided experiences need to prepare each outing from their phone.",
      es: "Quienes organizan expediciones y experiencias guiadas necesitan preparar cada salida desde el móvil.",
    },
    solution: {
      en: "A control panel made for the phone: events with place, dates and a map, kept as drafts until they are ready to publish.",
      es: "Un panel de control pensado para el móvil: eventos con lugar, fechas y mapa, que se guardan como borradores hasta que están listos para publicarse.",
    },
    result: { en: "Built. The client has not released it yet.", es: "Construida. El cliente todavía no la ha publicado." },
    role: designDev,
    liveUrl: "",
    repoUrl: "",
    media: [
      { kind: "image", src: "/media/senda/splash.webp", thumb: "/media/senda/splash-thumb.webp", w: 343, h: 711, frame: "phone", alt: { en: "Senda welcome screen", es: "Pantalla de bienvenida de Senda" } },
      { kind: "image", src: "/media/senda/panel.webp", thumb: "/media/senda/panel-thumb.webp", w: 343, h: 705, frame: "phone", alt: { en: "Senda control panel with draft and published events", es: "Panel de control de Senda con eventos en borrador y publicados" } },
      { kind: "image", src: "/media/senda/events.webp", thumb: "/media/senda/events-thumb.webp", w: 343, h: 702, frame: "phone", alt: { en: "Senda event list with place, dates and map", es: "Lista de eventos de Senda con lugar, fechas y mapa" } },
    ],
    hero: false,
    status: "unreleased",
  },
];
