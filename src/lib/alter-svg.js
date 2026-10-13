/* Alter, the character: returns the SVG markup as a string.

   It is plain JavaScript on purpose, so the site (at build time) and
   scripts/alter-graphics.mjs (to export image files) can both use it.

     uid    prefix for the ids of gradients, clips and masks. Must be unique
            when several Alters are on the same page.
     state  idle | listening | thinking | speaking | happy | unsure | sleeping
     label  accessible name. Leave "" when the SVG is decoration inside a
            button that already has a text label.

   How it looks is in src/styles/alter-character.css. The full description
   is in docs/alter/SPEC.md. */
export const ALTER_STATES = ["idle", "listening", "thinking", "speaking", "happy", "unsure", "sleeping"];

export function alterSVG({ uid = "alter", state = "idle", label = "" } = {}) {
  const u = uid;
  const cx = 100, cy = 100, R = 56, seam = 120;
  const n = (v) => v.toFixed(1);
  // light comes from the upper left: whatever falls outside this offset circle is in shadow
  const sx = cx - 12, sy = cy - 14, sr = R + 2;
  // ----- the pixel side: squares that shrink toward the edge
  let px = "";
  const pitch = 9, s0 = 7.2;
  const square = (x, y, s, o) => {
    const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1;
    const shade = Math.hypot(x - sx, y - sy) > sr;
    const k = 8 + ((Math.round(x) * 7 + Math.round(y) * 13) % 11) * 1.6;      // how far it drifts while thinking
    return `<rect class="a-px" x="${n(x - s / 2)}" y="${n(y - s / 2)}" width="${n(s)}" height="${n(s)}" rx="1" fill="url(#${u}${shade ? "s" : "g"})"${o < 1 ? ` opacity="${o}"` : ""} style="--o:${o};--dx:${n(k * (0.6 + dx / d))};--dy:${n(k * dy / d * 0.9)};--d:${(((Math.round(x) + Math.round(y)) % 7) * -0.22).toFixed(2)}s"/>`;
  };
  for (let i = 0; i < 6; i++) for (let j = -7; j < 7; j++) {
    const x = seam + 1.5 + i * pitch + s0 / 2, y = cy + j * pitch + pitch / 2;
    if (Math.hypot(x - cx, y - cy) > R - 0.5) continue;
    const t = Math.min(1, (x - seam) / (cx + R - seam));
    px += square(x, y, Math.max(2.4, s0 * (1 - 0.6 * Math.pow(t, 1.2))), 1);
  }
  // a few squares that have already left the planet
  [[166, 58, 3.4, .8], [175, 47, 2.6, .55], [161, 45, 2.4, .6], [165, 113, 3, .75], [172, 127, 2.4, .5], [161, 141, 2.6, .6]]
    .forEach(([x, y, s, o]) => { px += square(x, y, s, o); });

  // ----- the ring: a flat band, thicker in front, split into the half behind the planet and the half in front
  const ang = -18, rot = `rotate(${ang} ${cx} ${cy})`;
  const band = `M${cx - 94} ${cy}a94 24 0 1 0 188 0a94 24 0 1 0 -188 0ZM${cx - 88} ${cy - 3}a88 17 0 1 0 176 0a88 17 0 1 0 -176 0Z`;
  const mid = cy - 1.5;                                                        // centre line of the band
  const frontLine = `M${cx - 91} ${mid}A91 20.5 0 0 0 ${cx + 91} ${mid}`;
  const orbit = `M${cx + 91} ${mid}A91 20.5 0 0 1 ${cx - 91} ${mid}A91 20.5 0 0 1 ${cx + 91} ${mid}`;   // front half first, then behind

  // ----- the eyes: drawn once for the left, mirrored for the right (the highlights are not mirrored)
  const MIR = `translate(${2 * 92} 0) scale(-1 1)`;
  const LID = "M66.5 86.4L70.2 80.6Q79 77.6 88 82.6L89.8 88.4C89 97 83.5 102.6 77 102.6C70.5 102.6 66 96.6 66.5 86.4Z";
  const GAP = 2.5;                                                             // each eye is pushed this far away from the nose
  const eye = (side) => {
    const m = side === "r" ? ` transform="${MIR}"` : "";
    const ix = side === "r" ? 105.2 : 78.8;
    return `
    <g transform="translate(${side === "r" ? GAP : -GAP} 0)"><g class="a-eye a-eye-${side}">
      <g class="a-open">
        <path class="a-sclera" d="${LID}"${m}/>
        <g clip-path="url(#${u}e${side})">
          <rect class="a-sclera-shade" x="${ix - 14}" y="76" width="28" height="9.6"/>
          <g class="a-iris">
            <ellipse cx="${ix}" cy="92.5" rx="7.8" ry="9.8" fill="url(#${u}i)" stroke="var(--alter-line)" stroke-width="1.5"/>
            <ellipse cx="${ix}" cy="93" rx="3.1" ry="4.4" fill="#04141f"/>
            <ellipse class="a-hl" cx="${ix - 3}" cy="88" rx="2.5" ry="3.1" transform="rotate(-18 ${ix - 3} 88)"/>
            <circle class="a-hl" cx="${ix + 3.2}" cy="97.6" r="1.25" opacity=".85"/>
          </g>
        </g>
        <g${m}>
          <path class="a-lash" d="M65.4 87.4L69.6 80.2Q79 76.9 88.5 82.2L90.6 88.8"/>
          <path class="a-lid-low" d="M72 103.3Q77 104.8 81.5 103"/>
        </g>
      </g>
      <path class="a-closed" d="M67 93Q78 99 89 93"${m}/>
    </g></g>`;
  };
  const brow = "M62 70.6Q73 66 85.5 73.2";
  const spark = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="a-spark" style="--d:${d}s" d="M0-8C.9-2.5 2.5-.9 8 0C2.5.9.9 2.5 0 8C-.9 2.5-2.5.9-8 0C-2.5-.9-.9-2.5 0-8Z"/></g>`;
  const stops = (a, m, b) => `<stop offset="0" style="stop-color:var(${a})"/><stop offset=".55" style="stop-color:var(${m})"/><stop offset="1" style="stop-color:var(${b})"/>`;
  return `
<svg class="alter is-${state}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" ${label ? `role="img" aria-label="${label}"` : `aria-hidden="true" focusable="false"`}>
  <defs>
    <linearGradient id="${u}g" gradientUnits="userSpaceOnUse" x1="55" y1="50" x2="140" y2="152">${stops("--alter-a", "--alter-m", "--alter-b")}</linearGradient>
    <linearGradient id="${u}s" gradientUnits="userSpaceOnUse" x1="55" y1="50" x2="140" y2="152">${stops("--alter-sa", "--alter-sm", "--alter-sb")}</linearGradient>
    <linearGradient id="${u}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06283d"/><stop offset=".5" stop-color="#12b5b8"/><stop offset="1" stop-color="#9bf7e6"/></linearGradient>
    <clipPath id="${u}c"><rect x="0" y="0" width="${seam}" height="200"/></clipPath>
    <clipPath id="${u}f"><rect x="0" y="${mid}" width="200" height="60"/></clipPath>
    <clipPath id="${u}k"><rect x="0" y="${mid - 60}" width="200" height="60"/></clipPath>
    <clipPath id="${u}el"><path d="${LID}"/></clipPath>
    <clipPath id="${u}er"><path d="${LID}" transform="${MIR}"/></clipPath>
    <mask id="${u}m" maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240"><rect x="-20" y="-20" width="240" height="240" fill="#fff"/><path d="${frontLine}" transform="${rot}" fill="none" stroke="#000" stroke-width="18"/></mask>
    <mask id="${u}b" maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240"><rect x="-20" y="-20" width="240" height="240" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="#000"/></mask>
    <mask id="${u}h" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="#fff"/><circle cx="${sx}" cy="${sy}" r="${sr}" fill="#000"/></mask>
  </defs>
  <ellipse class="a-shadow" cx="100" cy="186" rx="44" ry="6"/>
  <g class="a-float"><g class="a-look"><g class="a-tilt">
    ${spark(49, 46, .8, 0)}${spark(37, 62, .4, -1.2)}${spark(170, 156, .5, -.6)}
    <g mask="url(#${u}b)"><g transform="${rot}"><path class="a-ring" d="${band}" clip-path="url(#${u}k)"/></g></g>
    <g class="a-moons" transform="${rot}"><circle class="a-moon" r="6.5" mask="url(#${u}b)"><animateMotion dur="2.4s" repeatCount="indefinite" path="${orbit}"/><animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" calcMode="discrete" values="0;1" keyTimes="0;0.5"/></circle></g>
    <g mask="url(#${u}m)">
      <g clip-path="url(#${u}c)">
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}g)"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}s)" mask="url(#${u}h)"/>
      </g>
      ${px}
      <path class="a-outline" d="M${seam} ${n(cy - Math.sqrt(R * R - (seam - cx) ** 2))}A${R} ${R} 0 1 0 ${seam} ${n(cy + Math.sqrt(R * R - (seam - cx) ** 2))}"/>
      <path class="a-rim" d="M63.2 63.2A52 52 0 0 1 92.8 48.5"/><circle class="a-rim-dot" cx="101.8" cy="48" r="1.8"/>
    </g>
    <g transform="${rot}"><path class="a-ring" d="${band}" clip-path="url(#${u}f)"/></g>
    <g class="a-moons" transform="${rot}"><circle class="a-moon" r="6.5"><animateMotion dur="2.4s" repeatCount="indefinite" path="${orbit}"/><animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes="0;0.5"/></circle></g>
    <g class="a-face"><g transform="translate(-9 0)">
    <g class="a-brow a-brow-l"><path class="a-line" d="${brow}"/></g>
    <g class="a-brow a-brow-r"><path class="a-line" d="${brow}" transform="${MIR}"/></g>
    ${eye("l")}${eye("r")}
    <path class="a-blush" d="M62 109.5l2.6-4.6M66 110.5l2.6-4.6M70 111.5l2.6-4.6M109 111.5l2.6-4.6M113 110.5l2.6-4.6M117 109.5l2.6-4.6"/>
    <g class="a-chev"><path class="a-sign-out" d="M86 81 72 91 86 101M98 81 112 91 98 101"/><path class="a-sign-in" d="M86 81 72 91 86 101M98 81 112 91 98 101"/></g>
    <path class="a-mouth-smile a-line" d="M85.5 111.6Q91 114 98.5 110.9"/>
    <ellipse class="a-mouth-open" cx="92" cy="112.4" rx="4.2" ry="3.6" fill="#04141f"/>
    <g class="a-mouth-slash"><path class="a-sign-out" d="M96 102 88 116"/><path class="a-sign-in" d="M96 102 88 116"/></g>
    <path class="a-mouth-flat a-line" d="M87.5 112.2h9"/>
    <path class="a-mouth-wavy a-line" d="M85 112.6q3.5-3 7 0t7 0"/>
    </g></g>
    <text class="a-q a-extra" x="130" y="40">?</text>
    <text class="a-zz a-extra" x="124" y="40" font-size="18">z z</text>
  </g></g></g>
</svg>`;
}
