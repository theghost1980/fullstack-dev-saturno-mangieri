# Alter — especificación

Alter es el asistente del sitio de Saturno Mangieri: un personaje animado que responde
preguntas sobre Saturno y su trabajo. Este documento describe cómo es, cómo se comporta y
cómo está construido. Para instalarlo y publicarlo, ver `INSTRUCCIONES-PARA-LA-IA.md`.

## 1. Qué hace

- Vive en la página: en pantallas anchas se sienta sobre el panel de demos del hero; al
  bajar, o en móvil, se queda en la esquina inferior derecha.
- Al pulsarlo abre un panel de chat con preguntas sugeridas y un campo de texto.
- Las **preguntas sugeridas** tienen la respuesta escrita en `src/data/alter.ts`. No llaman
  a la IA y no cuestan nada.
- Las **preguntas escritas** van a `/api/alter`, una función de Netlify que consulta a un
  modelo de IA a través de **OpenRouter** (por defecto, DeepSeek) usando como única fuente
  los datos del propio sitio.
- Puede dar las **tarifas de partida por hora** de Saturno, y solo esas (sección 5).
- Cada respuesta trae un estado de ánimo (cara de Alter) y, a veces, una acción: un botón
  que lleva al proyecto o a la sección de la que habla, o a contactar con Saturno.

## 2. El personaje

Un planeta con anillo y ojos, dibujado como un fotograma de anime: contorno en tinta, una
sombra de borde duro y un reflejo. La mitad izquierda es lisa y la derecha se deshace en
píxeles (diseño y código en la misma pieza).

**Construcción** (SVG, `viewBox="0 0 200 200"`, generado por `src/lib/alter-svg.js`):

| Parte | Medidas |
|---|---|
| Planeta | círculo de radio 56 centrado en (100, 100) |
| Costura liso/píxeles | vertical en x = 120 |
| Píxeles | rejilla de 9 px; cuadrados de 7,2 px que encogen hasta 2,4 px hacia el borde; 6 cuadrados sueltos fuera del planeta |
| Luz | desde arriba a la izquierda; queda en sombra lo que cae fuera de un círculo de radio 58 centrado en (88, 86) |
| Anillo | banda inclinada −18°, de 10 px de grosor por delante y 4 px por detrás; se parte en mitad trasera (tapada por el planeta) y mitad delantera |
| Cara | centrada en x = 83 sobre la mitad lisa; ojos de 23 × 25 px separados 9 px |
| Ojos | párpado superior anguloso y grueso, iris en degradado vertical, pupila y dos brillos |
| Destellos | tres estrellas de cuatro puntas alrededor |

**Paleta** (variables CSS en `src/styles/alter-character.css`):

| Variable | Claro | Oscuro | Uso |
|---|---|---|---|
| `--alter-a / -m / -b` | `#2ba6d6` `#0d7ea8` `#008673` | `#3db4e2` `#1389b3` `#0a9a86` | cuerpo, lado iluminado |
| `--alter-sa / -sm / -sb` | `#0b5c82` `#074f6d` `#00594f` | `#0d5f86` `#0a5573` `#06655a` | cuerpo, lado en sombra |
| `--alter-line` | `#072a3c` | `#061f2d` | contorno, párpados, cejas, boca |
| `--alter-ring` | `#14212c` | `#e8eef2` | anillo |
| `--alter-spark` | `#00a693` | `#7fe9dc` | destellos |
| `--alter-moon` | `#ff6b4a` | igual | luna que gira al pensar |
| `--alter-blush` | `#ff9079` | igual | rubor (solo contento) |
| Iris (fijo) | `#06283d` → `#12b5b8` → `#9bf7e6` | igual | |

**Estados** (clase `is-<estado>` en el `<svg>`):

| Estado | Cuándo | Qué cambia |
|---|---|---|
| `idle` | esperando | flota, parpadea, sigue el cursor con los ojos |
| `listening` | mientras el visitante escribe | ojos algo más grandes, cejas arriba, cabeza ladeada |
| `thinking` | esperando la respuesta | mira arriba a la izquierda, los píxeles se dispersan, una luna coral recorre el anillo |
| `speaking` | mientras se escribe la respuesta | mueve la boca, se balancea |
| `happy` | supo responder, o señala algo | ojos y boca forman `</>`, rubor, dos saltos |
| `unsure` | no sabe, límite alcanzado o error | una ceja levantada, boca ondulada, signo `?` |
| `sleeping` | 60 s sin actividad en la página | ojos cerrados, `z z`; cualquier movimiento lo despierta |

Tras `happy` (2,4 s) o `unsure` (3,8 s) vuelve a `idle`.

**Tamaños**: 96 px sentado en el hero, 76 px en la esquina (escritorio), 64 px en móvil.
A 64 px se leen ojos y cejas; los píxeles sueltos y destellos ya no.

**Movimiento reducido** (`prefers-reduced-motion`): sin flotar, sin parpadeo, sin seguir el
cursor, sin luna; las respuestas aparecen de golpe y los estados cambian solo la cara.

## 3. Dónde se coloca

`src/scripts/alter.js` mueve un único elemento fijo (`.alter-dock`):

- **Sentado** (`is-perched`): solo con ancho ≥ 980 px, panel cerrado, y mientras el panel de
  demos esté en pantalla y quepa bajo la cabecera. Se apoya en el borde superior derecho.
- **En la esquina**: en cualquier otro caso. Abrir el chat siempre lo lleva a la esquina.
- Al cambiar de sitio se desliza (0,55 s); mientras se hace scroll va pegado al panel.
- Lleva una etiqueta ("Pregúntame por Saturno") hasta que el visitante lo abre una vez en
  la sesión.

## 4. La conversación

- Saludo al abrir, y tres preguntas sugeridas visibles (de siete); las usadas desaparecen.
- Pregunta escrita: máximo 300 caracteres. Se envían los últimos 6 mensajes como contexto.
- Respuesta: máximo 3 frases cortas y unas 60 palabras, en el idioma de la página, sin
  listas ni jerga. Habla de Saturno en tercera persona.
- **Solo hechos del sitio.** Si no está en los datos, dice que no lo sabe y ofrece escribir a
  Saturno. No inventa clientes, cifras, fechas, precios ni disponibilidad.
- Preguntas de contratación o plazos: responde con lo que dicen los datos y ofrece agendar
  una llamada.
- Temas ajenos a Saturno: responde en una frase que solo contesta sobre él.
- Se presenta como asistente de IA y el panel lo recuerda al pie.

**Acciones** (botón bajo la respuesta):

| Acción | Qué hace |
|---|---|
| `show_project` + slug | quita el filtro, abre ese proyecto en la lista, hace scroll y lo resalta; cierra el panel |
| `goto` + sección | scroll a `work`, `services`, `how`, `experience`, `partners` o `contact` |
| `book_call` | abre el calendario de Cal.com, el mismo diálogo que los botones "Book a call" del sitio (`bookAttrs` en `src/data/site.ts`; lo abre `src/scripts/site.js`) |
| `email` | enlace al correo |

La IA solo puede elegir entre los proyectos y secciones que existen; el servidor descarta
cualquier otro destino.

## 5. Tarifas

Las tarifas están en `src/data/rates.ts` y son los **únicos precios** que Alter puede decir:

| Desde | Para |
|---|---|
| $20 la hora | proyectos largos, con más de 2 meses de ejecución |
| $40 la hora | proyectos urgentes que hay que entregar cuanto antes |

Moneda: USD. Reglas que sigue Alter:

- Siempre las da como "desde" esa cantidad y dice a qué tipo de proyecto corresponde cada una.
- Añade que son tarifas de partida y que el precio exacto llega con el alcance, antes de empezar.
- No calcula totales, presupuestos, número de horas ni descuentos.
- No da tarifa para un tipo de proyecto que no esté en la lista: dice que el precio llega con
  el alcance y ofrece agendar una llamada.

La pregunta sugerida "¿Cuánto cobra?" se redacta sola a partir de ese archivo, así que la
respuesta escrita y la de la IA siempre coinciden. Si `items` se deja vacío, Alter deja de
hablar de precios y la pregunta sugerida desaparece.

## 6. Proveedor de IA: OpenRouter

`netlify/functions/alter.mjs` llama a OpenRouter con `fetch`, sin librerías. OpenRouter usa
el formato de "chat completions" de OpenAI.

| Dato | Valor |
|---|---|
| URL | `POST https://openrouter.ai/api/v1/chat/completions` |
| Cabeceras | `Authorization: Bearer <OPENROUTER_API_KEY>`, `Content-Type: application/json`, y opcionales `HTTP-Referer` (la URL del sitio) y `X-OpenRouter-Title: Alter` |
| Modelo | `deepseek/deepseek-v4.1-flash` por defecto; se cambia con la variable `ALTER_MODEL` |
| Mensajes | uno `system` (reglas + datos del sitio) y después la conversación |
| Opciones | `max_tokens: 350`, `temperature: 0.3`, `provider: { sort: "price" }`, `reasoning: { effort: "none" }`, `response_format: { type: "json_object" }` |
| Respuesta | el texto está en `choices[0].message.content`; el consumo en `usage.prompt_tokens`, `usage.completion_tokens` y, si viene, `usage.cost` |

Detalles que importan:

- **Sin "pensamiento".** El modelo por defecto razona si no se le dice lo contrario, y eso
  gasta tokens de salida. Por eso se envía `reasoning: { effort: "none" }`.
- **Reintento.** Si el modelo rechaza esas opciones (error 400), la función repite la llamada
  una vez sin `reasoning` ni `response_format` y con más margen de tokens.
- **Formato.** Se le pide un objeto JSON `{text, mood, action, target}`. Si devuelve texto
  suelto, se usa como respuesta con ánimo neutro y sin acción.
- **Errores dentro de un 200.** OpenRouter puede devolver `error` en el cuerpo con estado 200;
  la función lo comprueba.
- **Modelo elegido.** El 13 de octubre de 2026, `deepseek/deepseek-v4.1-flash` era el modelo
  general de DeepSeek más barato en OpenRouter (del orden de 4 centavos de dólar por millón
  de tokens de entrada; el precio de salida mostrado variaba según la página). Los precios y
  modelos cambian: se comprueba en https://openrouter.ai/deepseek .

Variables de entorno (solo en Netlify y, en local, en `.env`):

| Variable | Obligatoria | Qué es |
|---|---|---|
| `OPENROUTER_API_KEY` | sí | la clave de OpenRouter |
| `ALTER_MODEL` | no | identificador del modelo en OpenRouter |
| `ALTER_DAILY_LIMIT` | no | respuestas de IA al día para todo el sitio (por defecto 300) |

## 7. Contrato de `/api/alter`

Petición: `POST`, mismo origen, `content-type: application/json`.

```json
{ "lang": "es", "messages": [ { "role": "user", "content": "¿Qué es RenovaYa?" } ] }
```

Respuesta `200`:

```json
{ "text": "…", "mood": "happy", "action": { "type": "show_project", "target": "renovaya" } }
```

`mood`: `neutral` | `happy` | `unsure`. `action` es opcional.

| Código | `error` | Significa | Qué muestra Alter |
|---|---|---|---|
| 400 | `bad_request` | cuerpo inválido | mensaje de error |
| 403 | `forbidden` | la llamada no viene del propio sitio | mensaje de error |
| 429 | `limit` | límite por visitante o diario, o la clave de OpenRouter se quedó sin crédito | mensaje de límite + agendar llamada |
| 500 | `knowledge` | no pudo leer `/alter-knowledge.json` | mensaje de error |
| 502 | `upstream` | fallo de OpenRouter o del modelo, o respuesta vacía | mensaje de error |
| 503 | `not_configured` | falta `OPENROUTER_API_KEY` | "solo puedo contestar las preguntas de abajo" |
| 503 | `upstream` | OpenRouter saturado o sin proveedor disponible | mensaje de error |

## 8. Límites y consumo

| Límite | Valor | Dónde |
|---|---|---|
| Gasto total | el que se fije | **límite de crédito de la clave en OpenRouter**: es el tope real de dinero |
| Preguntas escritas por sesión de navegador | 8 | `src/data/alter.ts` (`maxQuestionsPerSession`) |
| Llamadas por minuto por visitante | 8 | `config.rateLimit` en la función (lo aplica Netlify) |
| Llamadas por hora por visitante | 15 | `PER_IP_PER_HOUR` en la función (en memoria, aproximado) |
| Respuestas de IA por día, todo el sitio | 300 | variable `ALTER_DAILY_LIMIT` (contador en Netlify Blobs) |
| Longitud de la respuesta | 350 tokens | `MAX_OUTPUT_TOKENS` |

Cada pregunta escrita gasta aproximadamente 2.500 tokens de entrada (reglas y datos del
sitio) y hasta 350 de salida. Las preguntas sugeridas gastan cero. Cuando la clave se queda
sin crédito, Alter dice que no puede atender más preguntas y ofrece agendar una llamada.

## 9. Privacidad

- La clave de OpenRouter solo existe como variable de entorno en Netlify; nunca llega al navegador.
- La función no guarda ni registra lo que escribe el visitante: en el log solo quedan el
  modelo, el número de tokens y el coste.
- En el navegador se usa `sessionStorage` para dos datos: si ya abrió a Alter y cuántas
  preguntas lleva. Se borran al cerrar la pestaña.
- Las preguntas escritas se envían a OpenRouter, que las pasa al proveedor del modelo
  elegido. Qué hace cada proveedor con esos datos depende de su política; en OpenRouter se
  puede restringir a proveedores que no guardan datos (ajustes de privacidad de la cuenta, o
  `provider: { data_collection: "deny" }` en la petición), a costa de menos proveedores
  disponibles.

## 10. Accesibilidad

- Alter es un `<button>` con nombre accesible; el panel es un diálogo no modal con etiqueta.
- `Esc` cierra y devuelve el foco al botón. Foco visible en todos los controles.
- Las respuestas se anuncian una sola vez, completas, en una región `aria-live`.
- Contraste suficiente en tema claro y oscuro. Objetivos táctiles de 44 px en el formulario.

## 11. Archivos

| Archivo | Qué contiene |
|---|---|
| `src/lib/alter-svg.js` | el dibujo (genera el SVG) |
| `src/styles/alter-character.css` | aspecto y animaciones del personaje |
| `src/styles/alter-widget.css` | posición en la página y panel de chat |
| `src/components/Alter.astro` | el HTML del widget y la configuración que recibe el navegador |
| `src/scripts/alter.js` | comportamiento: posición, ojos, estados, chat, acciones |
| `src/data/alter.ts` | textos y preguntas sugeridas con sus respuestas (EN y ES) |
| `src/data/rates.ts` | las tarifas por hora |
| `src/pages/alter-knowledge.json.ts` | genera lo que Alter sabe, a partir de `src/data` |
| `netlify/functions/alter.mjs` | servidor: límites, reglas para la IA, llamada a OpenRouter |
| `netlify.toml`, `.env.example` | despliegue y variables |
| `scripts/alter-graphics.mjs` | exporta los gráficos de `docs/alter/graphics` |
| `docs/alter/graphics/` | Alter en SVG (animado) y PNG (512 px, fondo transparente), por estado y tema, y `states.html` con todos |

Lo que Alter necesita del resto del sitio:

- `src/i18n` (`tr`, `Lang`, `useUI`) y los datos de `src/data` (`site`, `projects`,
  `services`, `stats`, `experience`, `partners`).
- En el HTML: `.hero .stage` (panel de demos) y `.top` (cabecera) para colocarse; secciones
  con id `work`, `services`, `how`, `experience`, `partners`, `contact`; cada proyecto con
  id `project-<slug>`, un botón `[aria-controls="project-<slug>"]` en la lista y el filtro
  `[data-filter="all"]`.
- Las variables de color de `src/styles/global.css` (`--surface`, `--ink`, `--muted`,
  `--line`, `--teal`, `--coral`, `--on-coral`, `--grad`, `--bg`, `--focus`, `--r`).

## 12. Cambios habituales

- **Tarifas**: `src/data/rates.ts`.
- **Añadir o cambiar una pregunta sugerida**: `src/data/alter.ts`, en `suggestions`, en los dos idiomas.
- **Lo que Alter sabe**: no se edita aparte; sale de `src/data`. Al cambiar un proyecto,
  revisar que las respuestas sugeridas sigan siendo ciertas.
- **Tono o reglas de la IA**: función `systemPrompt` en `netlify/functions/alter.mjs`.
- **Otro modelo**: variable `ALTER_MODEL` en Netlify y nuevo despliegue. Sirve cualquier
  modelo de OpenRouter; después hay que repetir las pruebas de `INSTRUCCIONES-PARA-LA-IA.md`.
- **Colores**: variables al inicio de `src/styles/alter-character.css` (tres bloques: claro,
  oscuro del sistema, oscuro elegido). Después, `node scripts/alter-graphics.mjs`.
- **Quitar a Alter**: borrar `<Alter lang={lang} />` de `src/components/Home.astro`.

## 13. Qué está probado

Probado en local con una API de OpenRouter simulada: control de origen, validación del
cuerpo, límite por visitante, reintento tras un 400, clave sin crédito (402), error dentro
de un 200, respuesta vacía, respuestas mal formadas o con destinos inexistentes; y en
navegador (escritorio y móvil, claro y oscuro, EN y ES) posición, estados, preguntas
sugeridas incluida la de tarifas, pregunta escrita, acciones, tope por sesión y cierre con `Esc`.

**No probado**: la llamada real a OpenRouter y a DeepSeek (y por tanto cómo de bien sigue
ese modelo las reglas), el despliegue en Netlify, el contador diario en Netlify Blobs y la
regla `rateLimit` de Netlify. Eso se comprueba en el primer despliegue siguiendo
`INSTRUCCIONES-PARA-LA-IA.md`.
