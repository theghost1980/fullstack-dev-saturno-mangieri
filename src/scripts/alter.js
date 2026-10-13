/* =====================================================================
   ALTER — behaviour in the browser.
   - moves Alter between the hero's demo panel (wide screens) and the corner
   - makes the eyes follow the pointer, puts it to sleep when nobody is around
   - opens the chat panel, answers the ready-made questions locally and
     sends typed questions to /api/alter
   - turns what the server returns (mood, action) into a face and a button
   The description of every state and rule is in docs/alter/SPEC.md.
   ===================================================================== */
const dock = document.querySelector("[data-alter]");
if (dock) initAlter(dock);

function initAlter(dock) {
  const cfg = JSON.parse(dock.querySelector("[data-alter-config]").textContent);
  const S = cfg.strings;
  const svg = dock.querySelector(".alter");
  const toggle = dock.querySelector(".alter-toggle");
  const panel = dock.querySelector(".alter-panel");
  const log = dock.querySelector("[data-alter-log]");
  const live = dock.querySelector("[data-alter-live]");
  const chips = dock.querySelector("[data-alter-chips]");
  const form = dock.querySelector("[data-alter-form]");
  const input = form.querySelector("input");
  const sendBtn = form.querySelector("button");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- face ---------- */
  const STATES = ["idle", "listening", "thinking", "speaking", "happy", "unsure", "sleeping"];
  let state = "idle", moodTimer = 0;
  const setState = (next) => {
    clearTimeout(moodTimer);
    state = next;
    STATES.forEach((s) => svg.classList.toggle("is-" + s, s === next));
    dock.dataset.state = next;
  };
  /* After an answer: hold the mood for a moment, then back to waiting. */
  const settle = (mood) => {
    if (mood === "happy" || mood === "unsure") { setState(mood); moodTimer = setTimeout(() => setState(input.value ? "listening" : "idle"), mood === "happy" ? 2400 : 3800); }
    else setState(input.value ? "listening" : "idle");
  };

  /* The eyes follow the pointer. */
  if (!reduceMotion) {
    addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * 0.415), dy = e.clientY - (r.top + r.height * 0.46);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160) * 3.4;
      svg.style.setProperty("--px", ((dx / d) * k).toFixed(2));
      svg.style.setProperty("--py", ((dy / d) * k).toFixed(2));
    }, { passive: true });
  }

  /* Asleep after a minute without anyone doing anything; any activity wakes it. */
  let lastActive = Date.now();
  const SLEEP_AFTER_MS = 60000;
  const wake = () => { lastActive = Date.now(); if (state === "sleeping") setState("idle"); };
  ["pointermove", "pointerdown", "keydown", "scroll"].forEach((ev) => addEventListener(ev, wake, { passive: true }));
  setInterval(() => { if (state === "idle" && !busy && Date.now() - lastActive > SLEEP_AFTER_MS) setState("sleeping"); }, 5000);

  /* ---------- where it sits ---------- */
  const stage = document.querySelector(".hero .stage");
  const header = document.querySelector(".top");
  const wide = matchMedia("(min-width: 980px)");
  let open = false, perched = null, frame = 0;
  const place = () => {
    frame = 0;
    const vw = document.documentElement.clientWidth, vh = innerHeight;
    let next = false, x, y, size;
    if (stage && wide.matches && !open) {
      const r = stage.getBoundingClientRect();
      size = 96;
      x = Math.min(r.right - size - 6, vw - size - 8);
      y = r.top - size * 0.78;                         // the planet's underside rests on the panel's top edge
      next = y >= (header ? header.getBoundingClientRect().bottom : 0) + 2 && r.top < vh - 60;
    }
    if (!next) { size = wide.matches ? 76 : 64; x = vw - size - (wide.matches ? 20 : 12); y = vh - size - (wide.matches ? 18 : 12); }
    if (perched !== null && next !== perched) {        // glide when changing place, stick while scrolling
      dock.classList.add("is-moving");
      clearTimeout(place.t); place.t = setTimeout(() => dock.classList.remove("is-moving"), 600);
    }
    perched = next;
    dock.classList.toggle("is-perched", next);
    dock.style.setProperty("--alter-size", size + "px");
    dock.style.setProperty("--alter-x", Math.round(x) + "px");
    dock.style.setProperty("--alter-y", Math.round(y) + "px");
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(place); };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  wide.addEventListener?.("change", schedule);
  place();
  if (store.get("alterMet")) dock.classList.add("is-met");
  dock.classList.add("is-ready");

  /* ---------- conversation ---------- */
  let busy = false, greeted = false, online = true;
  const history = [];                                   // what is sent to the server: [{ role, content }]
  const used = new Set();                               // ready-made questions already asked
  let asked = Number(store.get("alterAsked") || 0);

  const scrollLog = () => { log.scrollTop = log.scrollHeight; };
  const addMessage = (who, text) => {
    const li = document.createElement("li");
    li.className = "alter-msg alter-msg--" + who;
    if (who === "me") li.innerHTML = `<span class="sr">${S.you}: </span>`;
    const span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);
    log.appendChild(li); scrollLog();
    return { li, span };
  };

  /* Writes the answer word by word while Alter "speaks". Screen readers get it once, whole. */
  const speak = (text, mood, action) => new Promise((resolve) => {
    live.textContent = text;
    const { li, span } = addMessage("bot", "");
    span.setAttribute("aria-hidden", "true");
    const finish = () => {
      span.textContent = text; span.removeAttribute("aria-hidden");
      const el = actionElement(action);
      if (el) { li.appendChild(document.createElement("br")); li.appendChild(el); }
      scrollLog(); settle(mood); resolve();
    };
    if (reduceMotion) return finish();
    setState("speaking");
    const words = text.split(" "); let i = 0;
    const tick = () => { i++; span.textContent = words.slice(0, i).join(" "); scrollLog(); if (i < words.length) setTimeout(tick, 34); else finish(); };
    tick();
  });

  /* The button under an answer. Links for contact, buttons for "show me". */
  function actionElement(action) {
    if (!action || !action.type) return null;
    if (action.type === "book_call" || action.type === "email") {
      const a = document.createElement("a");
      a.className = "alter-act" + (action.type === "book_call" ? " alter-act--call" : "");
      if (action.type === "book_call") {
        /* Same attributes as the site's "Book a call" buttons: site.js opens the Cal.com dialog for them. */
        Object.entries(cfg.book).forEach(([name, value]) => a.setAttribute(name, value));
        a.setAttribute("aria-haspopup", "dialog");
      } else a.href = "mailto:" + cfg.email;
      a.textContent = S.actions[action.type];
      return a;
    }
    const b = document.createElement("button");
    b.type = "button"; b.className = "alter-act";
    if (action.type === "show_project") {
      const p = cfg.projects.find((x) => x.slug === action.target);
      if (!p || !document.getElementById("project-" + p.slug)) return null;
      b.textContent = S.actions.show_project.replace("{name}", p.name);
      b.addEventListener("click", () => showProject(p.slug));
    } else if (action.type === "goto") {
      if (!document.getElementById(action.target)) return null;
      b.textContent = S.actions.goto;
      b.addEventListener("click", () => pointAt(document.getElementById(action.target)));
    } else return null;
    return b;
  }
  const pointAt = (el) => {
    setOpen(false);
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    el.classList.add("is-pointed");
    setTimeout(() => el.classList.remove("is-pointed"), 2600);
    setState("happy"); moodTimer = setTimeout(() => setState("idle"), 2400);
  };
  const showProject = (slug) => {
    document.querySelector('[data-filter="all"]')?.click();                       // clear the service filter
    document.querySelector(`[aria-controls="project-${slug}"]`)?.click();          // open it in the project list
    pointAt(document.getElementById("project-" + slug));
  };

  const renderChips = () => {
    chips.innerHTML = "";
    cfg.suggestions.filter((q) => !used.has(q.id)).slice(0, 3).forEach((q) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "alter-chip"; b.textContent = q.question; b.disabled = busy;
      b.addEventListener("click", () => askReady(q));
      chips.appendChild(b);
    });
  };
  const setBusy = (v) => { busy = v; sendBtn.disabled = v; renderChips(); };

  /* A ready-made question: answered here, no AI call. */
  async function askReady(q) {
    if (busy) return;
    used.add(q.id); setBusy(true);
    addMessage("me", q.question);
    history.push({ role: "user", content: q.question }, { role: "assistant", content: q.answer });
    setState("thinking");
    await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 550));
    await speak(q.answer, q.mood, q.action);
    setBusy(false);
  }

  /* A typed question: goes to the server, which asks the AI. */
  async function askFree(text) {
    if (busy) return;
    setBusy(true);
    addMessage("me", text);
    if (!online) { await speak(S.offline, "unsure", { type: "email" }); return setBusy(false); }
    if (asked >= cfg.maxQuestions) { await speak(S.limit, "unsure", { type: "book_call" }); return setBusy(false); }
    history.push({ role: "user", content: text });
    setState("thinking");
    const waiting = document.createElement("li");
    waiting.className = "alter-msg alter-msg--bot";
    waiting.innerHTML = `<span class="alter-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr">${S.thinking}</span>`;
    log.appendChild(waiting); scrollLog();
    let reply;
    try {
      const res = await fetch(cfg.endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang: cfg.lang, messages: history.slice(-6) }) });
      if (res.status === 429) reply = { text: S.limit, mood: "unsure", action: { type: "book_call" }, local: true };
      else if (res.status === 503 || res.status === 404) { online = res.status !== 404 && (await res.json().catch(() => ({}))).error !== "not_configured"; reply = { text: online ? S.error : S.offline, mood: "unsure", action: { type: "email" }, local: true }; }
      else if (!res.ok) throw new Error("status " + res.status);
      else reply = await res.json();
    } catch (err) {
      reply = { text: S.error, mood: "unsure", action: { type: "email" }, local: true };
    }
    waiting.remove();
    if (reply.local) history.pop();                       // nothing was answered: do not keep the question
    else { history.push({ role: "assistant", content: reply.text }); asked++; store.set("alterAsked", String(asked)); }
    await speak(String(reply.text || S.error), reply.mood, reply.action);
    setBusy(false);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim().slice(0, cfg.maxLength);
    if (!text || busy) return;
    input.value = "";
    askFree(text);
  });
  input.addEventListener("input", () => { if (!busy && (state === "idle" || state === "listening")) setState(input.value ? "listening" : "idle"); });

  /* ---------- open / close ---------- */
  function setOpen(next) {
    if (open === next) return;
    open = next;
    toggle.setAttribute("aria-expanded", String(open));
    dock.classList.toggle("is-open", open);
    panel.hidden = !open;
    place();
    if (open) {
      dock.classList.add("is-met"); store.set("alterMet", "1");
      wake();
      if (!greeted) { greeted = true; addMessage("bot", S.greeting); renderChips(); }
      (matchMedia("(hover: hover)").matches ? input : panel).focus({ preventScroll: true });
      scrollLog();
    }
  }
  toggle.addEventListener("click", () => setOpen(!open));
  dock.querySelector("[data-alter-close]").addEventListener("click", () => { setOpen(false); toggle.focus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) { setOpen(false); toggle.focus(); } });
}
