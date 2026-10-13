/* Small behaviours: theme, menu, demo switcher, project filter and list, galleries, video.
   The page is complete without this file; it only adds the interactive parts. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

/* ---------- Theme: follows the system until the visitor chooses ---------- */
const currentTheme = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
{
  const btn = $("[data-theme-toggle]");
  const label = () => btn && btn.setAttribute("aria-label", currentTheme() === "dark" ? btn.dataset.labelLight : btn.dataset.labelDark);
  label();
  btn?.addEventListener("click", () => {
    root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    label();
  });
}

/* ---------- Mobile menu ---------- */
{
  const btn = $("[data-menu]"), nav = $("[data-nav]");
  if (btn && nav) {
    const set = (open) => { btn.setAttribute("aria-expanded", String(open)); nav.classList.toggle("is-open", open); };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  }
}

/* ---------- Booking: "Book a call" opens Cal.com as a dialog ----------
   Cal.com's script is only fetched on the first click. Without JavaScript, with a
   modified click (new tab) or if the script cannot load, the button is just a link
   to the Cal.com page. The link and event name come from src/data/site.ts. */
{
  const SRC = "https://app.cal.com/embed/embed.js", ORIGIN = "https://app.cal.com";
  const ready = new Set();
  let broken = false;
  const start = (ns, fallback) => {
    if (!window.Cal) {
      /* Cal.com's own loader, as given in their embed code. */
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, SRC, "init");
    }
    if (ready.has(ns)) return;
    ready.add(ns);
    window.Cal("init", ns, { origin: ORIGIN });
    window.Cal.ns[ns]("ui", { cssVarsPerTheme: { light: { "cal-brand": "#14212c" }, dark: { "cal-brand": "#e8eef2" } }, hideEventTypeDetails: false, layout: "month_view" });
    document.querySelector(`script[src="${SRC}"]`)?.addEventListener("error", () => { broken = true; fallback(); });
  };
  /* Not data-cal-*: once loaded, Cal.com's script opens its own dialog for those, on top of ours.
     One listener on the page, so buttons added later (Alter's "Book a call") work too. */
  $$("[data-book-link]").forEach((a) => a.setAttribute("aria-haspopup", "dialog"));
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("[data-book-link]");
    if (!a || broken || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const ns = a.dataset.bookNamespace;
    start(ns, () => { location.href = a.href; });
    /* Cal.com leaves one hidden dialog (and its iframe) behind for every opening: keep only the new one. */
    $$("cal-modal-box").forEach((box) => box.remove());
    window.Cal.ns[ns]("modal", { calLink: a.dataset.bookLink, config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: currentTheme() } });
  });
}

/* ---------- Video: play only while visible, never for visitors who prefer less motion ---------- */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isShown = (el) => !el.closest("[hidden]") && el.offsetParent !== null;
const videos = $$("video[data-autoplay]");
const syncVideo = (v, inView = v._inView) => {
  if (reduceMotion) { v.controls = true; return; }
  if (inView && isShown(v)) v.play().catch(() => {}); else v.pause();
};
const syncVideos = () => videos.forEach((v) => syncVideo(v));
if (videos.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { e.target._inView = e.isIntersecting; syncVideo(e.target); }), { threshold: 0.35 });
  videos.forEach((v) => io.observe(v));
} else {
  videos.forEach((v) => { v.controls = true; });
}

/* ---------- Hero: one tab per live demo ---------- */
$$("[data-tabs]").forEach((box) => {
  const tabs = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
  const select = (i, focus) => {
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    panels.forEach((p, j) => { p.hidden = j !== i; });
    if (focus) tabs[i].focus();
    syncVideos();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
    });
  });
});

/* ---------- Galleries: thumbnails switch the picture ---------- */
$$("[data-gallery]").forEach((g) => {
  const views = $$("[data-view]", g), thumbs = $$("[data-thumb]", g);
  thumbs.forEach((t, i) => t.addEventListener("click", () => {
    views.forEach((v, j) => { v.hidden = j !== i; });
    thumbs.forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
    syncVideos();
  }));
});

/* ---------- Work: filter by service; on wide screens, a list on the left opens one project ---------- */
{
  const projects = $$("[data-project]"), items = $$("[data-index-item]"), chips = $$("[data-filter]"), count = $("[data-count]");
  const selectProject = (i) => {
    items.forEach((b, j) => { if (j === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    projects.forEach((a, j) => a.classList.toggle("is-active", j === i));
    syncVideos();
  };
  items.forEach((b, i) => b.addEventListener("click", () => selectProject(i)));
  const applyFilter = (id) => {
    chips.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === id)));
    let n = 0;
    projects.forEach((el, j) => {
      const show = id === "all" || el.dataset.services.split(" ").includes(id);
      el.hidden = !show;
      if (items[j]) items[j].hidden = !show;
      if (show) n++;
    });
    if (count) count.textContent = n ? count.dataset.showing.replace("{n}", n).replace("{total}", count.dataset.total) : count.dataset.empty;
    if (!projects.some((a) => a.classList.contains("is-active") && !a.hidden)) {
      const first = projects.findIndex((a) => !a.hidden);
      if (first >= 0) selectProject(first);
    }
    syncVideos();
  };
  chips.forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));
}
