import { tr, type L10n } from "../i18n";
import { rates } from "./rates";

/* =====================================================================
   ALTER — the assistant's texts and ready-made answers.

   Two kinds of answers:
   1. `suggestions`: the question buttons. Their answers are written here,
      so they cost nothing and never call the AI.
   2. Anything the visitor types goes to /api/alter (an AI model through OpenRouter), which
      answers from the facts in src/pages/alter-knowledge.json.ts.

   Every answer here must stay true to the rest of the site: if a project
   or a figure changes in src/data, update the matching answer.

   mood    how Alter looks when it finishes: "neutral" | "happy" | "unsure"
   action  what the button under the answer does:
             { type: "show_project", target: "<project slug>" }
             { type: "goto", target: "work" | "services" | "how" | "experience" | "partners" | "contact" }
             { type: "book_call" }   { type: "email" }   or leave it out
   ===================================================================== */

export type AlterMood = "neutral" | "happy" | "unsure";
export type AlterAction =
  | { type: "show_project"; target: string }
  | { type: "goto"; target: string }
  | { type: "book_call" }
  | { type: "email" };

export interface AlterSuggestion {
  id: string;
  question: L10n;
  answer: L10n;
  mood: AlterMood;
  action?: AlterAction;
}

/* The answer to "What does he charge?", written from src/data/rates.ts so the two never disagree. */
const price = (n: number) => `${rates.symbol}${n}`;
const ratesAnswer: L10n = {
  en: rates.items.map((r) => `From ${price(r.from)} an hour for ${tr(r.when, "en")}.`).join(" ") + " " + tr(rates.note, "en"),
  es: rates.items.map((r) => `Desde ${price(r.from)} la hora para ${tr(r.when, "es")}.`).join(" ") + " " + tr(rates.note, "es"),
};

export const alter = {
  name: "Alter",
  /* How many typed questions one visitor can send per browser session. The server has its own limits too. */
  maxQuestionsPerSession: 8,
  maxQuestionLength: 300,

  strings: {
    role: { en: "Saturno's AI assistant", es: "Asistente de IA de Saturno" },
    hint: { en: "Ask me about Saturno", es: "Pregúntame por Saturno" },
    open: { en: "Open the chat with Alter", es: "Abrir el chat con Alter" },
    close: { en: "Close", es: "Cerrar" },
    minimize: { en: "Minimize Alter", es: "Minimizar a Alter" },
    greeting: {
      en: "Hi, I'm Alter. Ask me about Saturno and his work, or pick a question.",
      es: "Hola, soy Alter. Pregúntame por Saturno y su trabajo, o elige una pregunta.",
    },
    placeholder: { en: "Type your question", es: "Escribe tu pregunta" },
    inputLabel: { en: "Your question for Alter", es: "Tu pregunta para Alter" },
    send: { en: "Send", es: "Enviar" },
    you: { en: "You", es: "Tú" },
    thinking: { en: "Alter is thinking", es: "Alter está pensando" },
    fine: {
      en: "Alter is an AI and can be wrong. For anything important, ask Saturno.",
      es: "Alter es una IA y puede equivocarse. Para lo importante, pregúntale a Saturno.",
    },
    limit: {
      en: "That's all the questions I can take for now. Saturno can answer the rest himself.",
      es: "Hasta aquí puedo contestar por ahora. El resto te lo puede responder Saturno en persona.",
    },
    error: {
      en: "I couldn't answer just now. You can try again, or write to Saturno directly.",
      es: "Ahora mismo no he podido contestar. Puedes intentarlo otra vez o escribirle a Saturno directamente.",
    },
    offline: {
      en: "I can only answer the questions below right now. For anything else, write to Saturno.",
      es: "Ahora mismo solo puedo contestar las preguntas de abajo. Para lo demás, escríbele a Saturno.",
    },
    actions: {
      show_project: { en: "Show me {name}", es: "Enséñame {name}" },
      goto: { en: "Take me there", es: "Llévame ahí" },
      book_call: { en: "Book a call", es: "Agendar llamada" },
      email: { en: "Write to Saturno", es: "Escribirle a Saturno" },
    },
  },

  suggestions: [
    {
      id: "ai",
      question: { en: "What has he built with AI?", es: "¿Qué ha hecho con IA?" },
      answer: {
        en: "His latest is AutoMastery: a platform that turns the phone calls of auto repair shops into client reports, with every quote checked against the transcript. First working version in 2 months. He also built AegisPad, an editor that reviews, translates and takes dictation, and he sets up AI assistants and full agents on a server or on your own machines.",
        es: "Lo último es AutoMastery: una plataforma que convierte las llamadas de talleres mecánicos en informes para clientes, con cada cita comprobada contra la transcripción. Primera versión funcionando en 2 meses. También hizo AegisPad, un editor que revisa, traduce y acepta dictado, y monta asistentes de IA y agentes completos en un servidor o en tus propios equipos.",
      },
      mood: "happy",
      action: { type: "show_project", target: "automastery" },
    },
    {
      id: "mobile",
      question: { en: "Does he build mobile apps?", es: "¿Hace apps móviles?" },
      answer: {
        en: "Yes, for iOS and Android. On Hive Keychain, a crypto wallet with 10,000+ users, he shipped 12+ features, among them Android home-screen widgets written as native Java modules for the React Native app.",
        es: "Sí, para iOS y Android. En Hive Keychain, una wallet cripto con más de 10.000 usuarios, publicó más de 12 funciones, entre ellas widgets para la pantalla de inicio de Android escritos como módulos nativos en Java para la app en React Native.",
      },
      mood: "happy",
      action: { type: "show_project", target: "hive-keychain" },
    },
    ...(rates.items.length
      ? [{
          id: "rates",
          question: { en: "What does he charge?", es: "¿Cuánto cobra?" },
          answer: ratesAnswer,
          mood: "neutral" as AlterMood,
          action: { type: "book_call" } as AlterAction,
        }]
      : []),
    {
      id: "demos",
      question: { en: "What can I try right now?", es: "¿Qué puedo probar ahora mismo?" },
      answer: {
        en: "Four things are live: RenovaYa, NaN Systems, AegisPad and the Rocco Mangieri site. Open them and click around.",
        es: "Hay cuatro cosas en vivo: RenovaYa, NaN Systems, AegisPad y el sitio de Rocco Mangieri. Ábrelas y prueba.",
      },
      mood: "happy",
      action: { type: "goto", target: "work" },
    },
    {
      id: "process",
      question: { en: "How does a project work?", es: "¿Cómo es trabajar con él?" },
      answer: {
        en: "Four steps. You explain what the business needs, in plain words. You get a clear scope and a price before any work starts. He builds it with partial deliveries, so you see working software along the way. Then delivery, with support afterwards.",
        es: "Cuatro pasos. Cuentas qué necesita el negocio, con palabras sencillas. Recibes un alcance claro y un precio antes de empezar. Lo construye con entregas parciales, así ves software funcionando por el camino. Y al final, entrega con soporte.",
      },
      mood: "neutral",
      action: { type: "goto", target: "how" },
    },
    {
      id: "who",
      question: { en: "Who is Saturno?", es: "¿Quién es Saturno?" },
      answer: {
        en: "A senior full-stack engineer with 6+ years in React, Next.js, TypeScript, React Native and Node.js. He designs and codes the product himself, so nothing gets lost between the design and the build.",
        es: "Un ingeniero full-stack senior con más de 6 años en React, Next.js, TypeScript, React Native y Node.js. Diseña y programa el producto él mismo, así que no se pierde nada entre el diseño y la construcción.",
      },
      mood: "neutral",
      action: { type: "goto", target: "experience" },
    },
    {
      id: "contact",
      question: { en: "How do I reach him?", es: "¿Cómo lo contacto?" },
      answer: {
        en: "Write to saturnob612@gmail.com or book a call. Tell him what the business needs and he will tell you what it takes.",
        es: "Escríbele a saturnob612@gmail.com o agenda una llamada. Cuéntale qué necesita el negocio y él te dirá qué hace falta.",
      },
      mood: "happy",
      action: { type: "book_call" },
    },
  ] as AlterSuggestion[],
};
