import type { L10n } from "../i18n";

/* HOW TO ADD A SERVICE
   Add an object here. primary: true = large block. primary: false = one more
   entry in the "Also" row. The `id` is what projects reference in `services`. */
export interface Service {
  id: string;
  name: L10n;
  short?: L10n; // shorter name for the filter buttons
  summary: L10n;
  items: L10n[];
  primary: boolean;
}

export const services: Service[] = [
  {
    id: "web",
    name: { en: "Web Development", es: "Desarrollo web" },
    summary: {
      en: "Sites and platforms that read clearly, load fast and connect to the tools your business already runs on.",
      es: "Sitios y plataformas que se entienden, cargan rápido y se conectan con las herramientas que tu negocio ya usa.",
    },
    items: [
      { en: "Landing pages", es: "Landing pages" },
      { en: "B2B and B2C platforms", es: "Plataformas B2B y B2C" },
      { en: "APIs and integrations", es: "APIs e integraciones" },
    ],
    primary: true,
  },
  {
    id: "mobile",
    name: { en: "Mobile Apps", es: "Apps móviles" },
    summary: {
      en: "Custom apps for iOS and Android, for your customers or for your own team.",
      es: "Apps a medida para iOS y Android, para tus clientes o para tu propio equipo.",
    },
    items: [
      { en: "Custom iOS and Android apps", es: "Apps a medida para iOS y Android" },
      { en: "B2B and B2C", es: "B2B y B2C" },
      { en: "Native Android modules in Java for React Native", es: "Módulos nativos de Android en Java para React Native" },
    ],
    primary: true,
  },
  {
    id: "ai",
    name: { en: "AI Assistants and Agents", es: "Asistentes y agentes de IA" },
    short: { en: "AI", es: "IA" },
    summary: {
      en: "AI assistants that I build and put into operation: as the front end your customers talk to, or as the back end that does the work. And full agents, installed and running on a server or on your own machines.",
      es: "Asistentes de IA que construyo y pongo en marcha: como el front end con el que hablan tus clientes, o como el back end que hace el trabajo. Y agentes completos, instalados y funcionando en un servidor o en tus propios equipos.",
    },
    items: [
      { en: "Assistants as front end", es: "Asistentes como front end" },
      { en: "Assistants as back end", es: "Asistentes como back end" },
      { en: "Full agents: OpenClaw, Hermes", es: "Agentes completos: OpenClaw, Hermes" },
      { en: "On a VPS or on your own hardware", es: "En un VPS o en equipos físicos" },
    ],
    primary: true,
  },
  {
    id: "web3",
    name: "Web3",
    summary: { en: "Wallets and crypto products.", es: "Wallets y productos cripto." },
    items: [],
    primary: false,
  },
];
