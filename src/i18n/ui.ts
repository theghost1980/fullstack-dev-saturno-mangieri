/* Interface and section texts. Project, service, experience and partner texts live in src/data. */
import type { Lang } from "./index";

const en = {
  meta: {
    title: "Saturno Mangieri: full-stack engineer for web and mobile apps",
    description:
      "Websites, platforms, mobile apps and AI assistants, designed and coded by one full-stack engineer. Open the live demos, then book a call.",
  },
  skip: "Skip to content",
  menu: "Menu",
  themeToDark: "Switch to dark theme",
  themeToLight: "Switch to light theme",
  langSwitch: "Ver en español",
  nav: { work: "Work", services: "Services", experience: "Experience", partners: "Partners", contact: "Contact" },
  cta: { book: "Book a call", bookShort: "Book a call", demos: "See live demos", open: "Open live demo", code: "View code", client: "Client website", zoom: "Open full size" },
  hero: {
    title: "Less talk. More working software.",
    sub: "Websites, platforms, mobile apps and AI assistants, designed and coded by one full-stack engineer. Open the live demos first. Then book a call.",
    stageLabel: "Live demos",
  },
  work: {
    title: "Live demos and shipped work",
    lead: "Don't take my word for it. Open them, click around, try to break them.",
    filterLabel: "Filter by service",
    all: "All",
    showing: "Showing {n} of {total}",
    empty: "No projects under this service yet.",
    illustration: "Illustration",
    gallery: "Screens",
    labels: { problem: "Problem", solution: "Solution", result: "Result", role: "Role" },
    status: { live: "Live", soon: "Coming soon", unreleased: "Not released yet", shipped: "In production", private: "Internal client tool", archived: "Built in 2021" },
    notes: {
      shipped: "A product in production. No public demo.",
      private: "An internal tool. No public demo.",
      archived: "No longer online. The code is public.",
      unreleased: "Built for a client who has not released it yet.",
      soon: "",
    },
    opens: "opens in a new tab",
  },
  services: {
    title: "Three services. Built properly.",
    lead: "From the first screen to the server behind it. One engineer, the whole stack.",
    also: "Also",
  },
  how: {
    title: "How it works",
    lead: "One point of contact from the first call to delivery.",
    steps: [
      { title: "You bring the need", text: "Tell me what the business needs. Plain words are enough. No technical brief required." },
      { title: "Scope and price", text: "You get a clear scope and a price before any work starts." },
      { title: "Build, delivered in parts", text: "Development with partial deliveries, so you see working software while it is being built." },
      { title: "Delivery and support", text: "The finished product is handed over, with support after delivery." },
    ],
  },
  experience: {
    title: "Experience",
    lead: "Six years shipping products, on a team and on my own.",
  },
  approach: {
    quote: "One person designs it. The same person codes it.",
    p1: "Most software loses something between the design and the finished product. Here there is no handoff: how it looks and how it works are decided together, by one person accountable for both.",
    p2: "I am Saturno Mangieri, a senior full-stack engineer with 6+ years in React, Next.js, TypeScript, React Native and Node.js. For you, that means fewer meetings, faster answers and software that matches the plan.",
  },
  partners: {
    title: "Partners",
    lead: "Companies I build with.",
    visit: "Visit",
  },
  contact: {
    title: "Stop patching. Start building.",
    lead: "Tell me what the business needs. I will tell you what it takes.",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  footer: { line: "Web development and mobile apps.", rights: "Saturno Mangieri.", scheduling: "Scheduling with Cal.com", referral: "referral link" },
};

const es: typeof en = {
  meta: {
    title: "Saturno Mangieri: ingeniero full-stack de web y apps móviles",
    description:
      "Sitios web, plataformas, apps móviles y asistentes de IA, diseñados y programados por un solo ingeniero full-stack. Abre los demos en vivo y luego agenda una llamada.",
  },
  skip: "Ir al contenido",
  menu: "Menú",
  themeToDark: "Cambiar a tema oscuro",
  themeToLight: "Cambiar a tema claro",
  langSwitch: "View in English",
  nav: { work: "Proyectos", services: "Servicios", experience: "Experiencia", partners: "Partners", contact: "Contacto" },
  cta: { book: "Agendar llamada", bookShort: "Agendar", demos: "Ver demos en vivo", open: "Abrir demo en vivo", code: "Ver código", client: "Web del cliente", zoom: "Abrir a tamaño completo" },
  hero: {
    title: "Menos charla. Más software funcionando.",
    sub: "Sitios web, plataformas, apps móviles y asistentes de IA, diseñados y programados por un solo ingeniero full-stack. Primero abre los demos en vivo. Después agenda una llamada.",
    stageLabel: "Demos en vivo",
  },
  work: {
    title: "Demos en vivo y trabajo publicado",
    lead: "No te fíes de mi palabra. Ábrelos, haz clic, intenta romperlos.",
    filterLabel: "Filtrar por servicio",
    all: "Todos",
    showing: "Mostrando {n} de {total}",
    empty: "Todavía no hay proyectos en este servicio.",
    illustration: "Ilustración",
    gallery: "Pantallas",
    labels: { problem: "Problema", solution: "Solución", result: "Resultado", role: "Rol" },
    status: { live: "En vivo", soon: "Próximamente", unreleased: "Aún sin publicar", shipped: "En producción", private: "Herramienta interna de cliente", archived: "Hecho en 2021" },
    notes: {
      shipped: "Producto en producción. Sin demo público.",
      private: "Herramienta interna. Sin demo público.",
      archived: "Ya no está en línea. El código es público.",
      unreleased: "Hecha para un cliente que todavía no la ha publicado.",
      soon: "",
    },
    opens: "se abre en una pestaña nueva",
  },
  services: {
    title: "Tres servicios. Bien hechos.",
    lead: "De la primera pantalla al servidor que hay detrás. Un ingeniero, todo el stack.",
    also: "También",
  },
  how: {
    title: "Cómo funciona",
    lead: "Un solo interlocutor desde la primera llamada hasta la entrega.",
    steps: [
      { title: "Tú traes la necesidad", text: "Cuéntame qué necesita el negocio. Basta con palabras sencillas. No hace falta un documento técnico." },
      { title: "Alcance y precio", text: "Recibes un alcance claro y un precio antes de que empiece el trabajo." },
      { title: "Desarrollo con entregas parciales", text: "Vas viendo software que funciona mientras se construye." },
      { title: "Entrega y soporte", text: "Se entrega el producto terminado, con soporte después de la entrega." },
    ],
  },
  experience: {
    title: "Experiencia",
    lead: "Seis años publicando productos, en equipo y por mi cuenta.",
  },
  approach: {
    quote: "Una persona lo diseña. La misma persona lo programa.",
    p1: "La mayoría del software pierde algo entre el diseño y el producto terminado. Aquí no hay traspaso: cómo se ve y cómo funciona se deciden a la vez, y de las dos cosas responde la misma persona.",
    p2: "Soy Saturno Mangieri, ingeniero full-stack senior con más de 6 años en React, Next.js, TypeScript, React Native y Node.js. Para ti eso significa menos reuniones, respuestas más rápidas y un software que coincide con el plan.",
  },
  partners: {
    title: "Partners",
    lead: "Empresas con las que construyo.",
    visit: "Visitar",
  },
  contact: {
    title: "Deja de parchear. Empieza a construir.",
    lead: "Cuéntame qué necesita el negocio. Yo te digo qué hace falta.",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  footer: { line: "Desarrollo web y apps móviles.", rights: "Saturno Mangieri.", scheduling: "Agenda con Cal.com", referral: "enlace de referido" },
};

export const ui = { en, es };
export type UI = typeof en;
export const useUI = (lang: Lang): UI => ui[lang] ?? ui.en;
