import type { L10n } from "../i18n";

/* =====================================================================
   RATES — the only prices Alter is allowed to mention.

   Each entry is a STARTING hourly rate for one kind of project. Alter
   quotes them as "from $X an hour", never as a total and never for a case
   that is not listed here. Anything else gets "the price comes with the
   scope" and an offer to book a call.

   To add a rate: copy an entry, change `from` and describe `when` in both
   languages. To stop Alter from talking about prices: leave `items` empty.
   ===================================================================== */
export interface Rate {
  id: string;
  from: number;          // starting price per hour
  when: L10n;            // the kind of project it applies to
}

export const rates = {
  currency: "USD",
  symbol: "$",
  items: [
    {
      id: "long",
      from: 20,
      when: {
        en: "long projects, with more than 2 months of work",
        es: "proyectos largos, con más de 2 meses de ejecución",
      },
    },
    {
      id: "urgent",
      from: 40,
      when: {
        en: "urgent projects that need delivery as soon as possible",
        es: "proyectos urgentes que hay que entregar cuanto antes",
      },
    },
  ] as Rate[],
  /* What Alter adds after quoting a rate. */
  note: {
    en: "These are starting rates. The exact price comes with the scope, before any work starts.",
    es: "Son tarifas de partida. El precio exacto llega con el alcance, antes de empezar a trabajar.",
  } as L10n,
};
