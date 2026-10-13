import type { L10n } from "../i18n";

/* HOW TO ADD A PARTNER: add an object here. */
export interface Partner {
  name: string;
  url: string;
  relation: L10n;
  text: L10n;
}

export const partners: Partner[] = [
  {
    name: "Financorp Consulting",
    url: "https://financorpconsulting.com/",
    relation: { en: "In partnership with", es: "En alianza con" },
    text: {
      en: "A US consultancy that designs the financial, legal and strategic systems behind growing companies. When one of those systems is software, I build it: Financorp stays the client's point of contact, I design and code.",
      es: "Consultora de EE. UU. que diseña los sistemas financieros, legales y estratégicos de empresas en crecimiento. Cuando uno de esos sistemas es software, lo construyo yo: Financorp sigue siendo el contacto del cliente y yo diseño y programo.",
    },
  },
];
