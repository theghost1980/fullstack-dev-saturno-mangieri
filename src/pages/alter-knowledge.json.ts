/* What Alter knows.

   This file is built into /alter-knowledge.json when the site compiles.
   The Netlify function (netlify/functions/alter.mjs) reads it and gives it
   to the AI as its only source of facts, so Alter always says the same as
   the published site. Nothing to edit here when content changes: it reads
   src/data and src/i18n by itself. */
import type { APIRoute } from "astro";
import { tr } from "../i18n";
import { useUI } from "../i18n/ui";
import { site } from "../data/site";
import { stats } from "../data/stats";
import { services } from "../data/services";
import { projects } from "../data/projects";
import { experience } from "../data/experience";
import { partners } from "../data/partners";
import { rates } from "../data/rates";

export const GET: APIRoute = () => {
  const ui = useUI("en");
  const t = (v: Parameters<typeof tr>[0]) => tr(v, "en");
  const lines: string[] = [];

  lines.push(`# About`);
  lines.push(`${site.name}. ${site.role}. ${ui.approach.p2}`);
  lines.push(`How he works: ${ui.approach.quote} ${ui.approach.p1}`);
  lines.push(`Contact: e-mail ${site.email}. LinkedIn ${site.linkedin}. GitHub ${site.github}.`);
  lines.push(`The site is available in English and Spanish.`);

  lines.push(`\n# Figures`);
  stats.forEach((s) => lines.push(`- ${t(s.value)}: ${t(s.label)}`));

  lines.push(`\n# Services`);
  services.forEach((s) => {
    const items = s.items.map(t).join("; ");
    lines.push(`- ${t(s.name)}${s.primary ? "" : " (secondary)"}: ${t(s.summary)}${items ? ` Includes: ${items}.` : ""}`);
  });

  lines.push(`\n# How a project works`);
  ui.how.steps.forEach((s, i) => lines.push(`${i + 1}. ${s.title}: ${s.text}`));
  lines.push(`\n# Rates`);
  if (rates.items.length) {
    lines.push(`Starting hourly rates, in ${rates.currency}. These are the ONLY prices that exist:`);
    rates.items.forEach((r) => lines.push(`- From ${rates.symbol}${r.from} per hour: ${t(r.when)}.`));
    lines.push(t(rates.note));
    lines.push(`There is no rate for any other kind of project, no fixed prices and no total estimates: those come with the scope.`);
  } else {
    lines.push(`There is no price list. Each project gets a scope and a price before work starts.`);
  }

  lines.push(`\n# Projects`);
  projects.forEach((p) => {
    const parts = [
      `- ${p.name} [slug: ${p.slug}] (${t(p.type)}; status: ${ui.work.status[p.status]}).`,
      t(p.problem) && `Problem: ${t(p.problem)}`,
      t(p.solution) && `Solution: ${t(p.solution)}`,
      t(p.result) && `Result: ${t(p.result)}`,
      t(p.role) && `Role: ${t(p.role)}.`,
      p.liveUrl ? `Live demo: ${p.liveUrl}` : `No public demo.`,
      p.repoUrl && `Code: ${p.repoUrl}`,
      p.clientUrl && `Client website: ${p.clientUrl}`,
      t(p.note) && `Note: ${t(p.note)}`,
    ].filter(Boolean);
    lines.push(parts.join(" "));
  });

  lines.push(`\n# Experience`);
  experience.forEach((j) => {
    lines.push(`- ${t(j.period)}${j.org ? `, ${j.org}` : ""}: ${t(j.title)}. ${t(j.summary)} Stack: ${j.stack.join(", ")}.`);
  });

  lines.push(`\n# Partners`);
  partners.forEach((p) => lines.push(`- ${p.name} (${p.url}): ${t(p.text)}`));

  const body = {
    text: lines.join("\n"),
    /* The only places Alter is allowed to point at. */
    projects: projects.map((p) => ({ slug: p.slug, name: p.name })),
    sections: ["work", "services", "how", "experience", "partners", "contact"],
  };
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json; charset=utf-8" } });
};
