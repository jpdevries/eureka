#!/usr/bin/env node
// Generates the demo's sample media into apps/demo/media (gitignored): SVG
// "photos" in several aspect ratios, logos, a few documents and a short
// audio clip. Deterministic, so every checkout gets the same library.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const MEDIA_ROOT = path.join(here, '..', 'media');

let rngState = 20261102;
const rand = () => { rngState = (rngState * 1664525 + 1013904223) % 4294967296; return rngState / 4294967296; };
const pick = (xs) => xs[Math.floor(rand() * xs.length)];
const skies = [['#d9ecf7', '#f6e7d2'], ['#1b2a41', '#4b6584'], ['#ffd9a0', '#ff8c69'], ['#e8f1e4', '#b7d3c0'], ['#c9d6ff', '#e2e2e2']];
const greens = ['#1f4d2b', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#344e41', '#3a5a40', '#588157'];
const earth = ['#5b3a29', '#7f4f24', '#936639', '#a68a64'];

function tree(x, base, h, w, color) {
  const tiers = 3 + Math.floor(rand() * 3);
  let out = `<rect x="${x - w * 0.08}" y="${base - h * 0.18}" width="${w * 0.16}" height="${h * 0.18}" fill="${pick(earth)}"/>`;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers; const ty = base - h * (0.18 + (1 - 0.18) * t); const tw = w * (1 - t * 0.6); const th = h * 0.32;
    out += `<polygon points="${x},${ty - th} ${x - tw / 2},${ty} ${x + tw / 2},${ty}" fill="${color}" opacity="${0.85 + t * 0.15}"/>`;
  }
  return out;
}

function photo(width, height, title) {
  const [a, b] = pick(skies);
  const horizon = height * (0.55 + rand() * 0.2);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${title}</title>`; // the name lives in <title>, not in the graphic
  s += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  s += `<rect width="${width}" height="${height}" fill="url(#sky)"/>`;
  if (rand() > 0.5) s += `<circle cx="${width * (0.2 + rand() * 0.6)}" cy="${horizon * (0.2 + rand() * 0.5)}" r="${Math.min(width, height) * (0.04 + rand() * 0.06)}" fill="#fff6d5" opacity=".85"/>`;
  for (let layer = 0; layer < 3; layer++) {
    const y = horizon + layer * height * 0.12; const col = greens[(layer * 2 + Math.floor(rand() * 2)) % greens.length];
    s += `<rect x="0" y="${y}" width="${width}" height="${height - y}" fill="${col}" opacity="${0.9}"/>`;
    const n = 4 + Math.floor(rand() * 6);
    for (let i = 0; i < n; i++) {
      const x = (i + rand()) * (width / n); const h = height * (0.18 + rand() * 0.25) * (1 + layer * 0.3); const w = h * (0.35 + rand() * 0.2);
      s += tree(x, y + height * 0.02, h, w, pick(greens));
    }
  }
  return s + '</svg>';
}

/**
 * A photo that cycles day → dusk → night → dawn → day on a seamless 24 s loop. Accessibility-first: every animation lives
 * inside @media (prefers-reduced-motion: no-preference), so with reduced motion the file is the daytime scene, and the
 * server flags it `animated` so the browser shows it still until asked to play (02 HTML-66b).
 */
function animatedPhoto(width, height, title) {
  // Strip the base scene's own sun: the cycle supplies a moving one.
  const base = photo(width, height, title).replace(/<circle[^>]*fill="#fff6d5"[^>]*\/>/, '');
  const horizon = height * 0.62;
  const r = Math.min(width, height);
  const stars = Array.from({ length: 48 }, (_, i) => { const x = ((i * 7919) % 1000) / 1000 * width; const y = ((i * 104729) % 1000) / 1000 * horizon * 0.85; return `<circle class="star s${i % 3}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.9 + (i % 3) * 0.5).toFixed(1)}" fill="#fff"/>`; }).join('');
  const px = (n) => `${n.toFixed(0)}px`;
  const style = `<style>
    .night, .stars, .moon, .glow { opacity: 0; }
    .sun, .moon { transform-box: fill-box; transform-origin: center; }
    @media (prefers-reduced-motion: no-preference) {
      /* One 24 s cycle; 0% and 100% are identical so the loop is seamless.
         day 0–28%, sunset 28–40%, night 40–72%, sunrise 72–86%, day. */
      .sun   { animation: sun 24s linear infinite; }
      .moon  { animation: moon 24s linear infinite; }
      .glow  { animation: glow 24s linear infinite; }
      .night { animation: night 24s linear infinite; }
      .stars { animation: stars 24s linear infinite; }
      .star.s0 { animation: twinkle 2.1s ease-in-out infinite alternate; }
      .star.s1 { animation: twinkle 2.9s ease-in-out infinite alternate -1s; }
      .star.s2 { animation: twinkle 3.7s ease-in-out infinite alternate -2s; }
      /* the sun arcs down to the right and back up from the left */
      @keyframes sun {
        0%, 100% { transform: translate(0, 0); fill: #fff6d5; }
        28%      { transform: translate(${px(width * 0.10)}, ${px(horizon * 0.55)}); fill: #ffd27a; }
        36%      { transform: translate(${px(width * 0.14)}, ${px(horizon * 1.0)}); fill: #ff9a5c; }
        40%, 72% { transform: translate(${px(width * 0.14)}, ${px(horizon * 1.25)}); fill: #ff9a5c; }
        80%      { transform: translate(${px(-width * 0.12)}, ${px(horizon * 0.9)}); fill: #ffd27a; }
        86%      { transform: translate(${px(-width * 0.06)}, ${px(horizon * 0.35)}); fill: #fff6d5; }
      }
      @keyframes moon {
        0%, 36%, 100% { opacity: 0; transform: translate(${px(-width * 0.1)}, ${px(horizon * 0.7)}); }
        44%           { opacity: 1; transform: translate(${px(-width * 0.04)}, ${px(horizon * 0.25)}); }
        58%           { opacity: 1; transform: translate(${px(width * 0.06)}, 0); }
        72%           { opacity: 1; transform: translate(${px(width * 0.14)}, ${px(horizon * 0.3)}); }
        78%           { opacity: 0; transform: translate(${px(width * 0.18)}, ${px(horizon * 0.8)}); }
      }
      @keyframes glow  { 0%, 20%, 46%, 68%, 92%, 100% { opacity: 0 } 32% { opacity: 0.85 } 80% { opacity: 0.75 } }
      @keyframes night { 0%, 26%, 100% { opacity: 0 } 36% { opacity: 0.4 } 42%, 70% { opacity: 0.78 } 80% { opacity: 0.35 } 88% { opacity: 0 } }
      @keyframes stars { 0%, 34%, 100% { opacity: 0 } 44%, 68% { opacity: 1 } 78% { opacity: 0 } }
      @keyframes twinkle { from { opacity: 0.35 } to { opacity: 1 } }
    }
  </style>`;
  const defs = `<defs><linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7e5f" stop-opacity="0"/><stop offset="1" stop-color="#ffb26b"/></linearGradient></defs>`;
  const sun = `<circle class="sun" cx="${(width * 0.68).toFixed(0)}" cy="${(horizon * 0.3).toFixed(0)}" r="${(r * 0.065).toFixed(0)}" fill="#fff6d5"/>`;
  const moon = `<circle class="moon" cx="${(width * 0.3).toFixed(0)}" cy="${(horizon * 0.3).toFixed(0)}" r="${(r * 0.045).toFixed(0)}" fill="#f4f1e6"/>`;
  const glow = `<rect class="glow" x="0" y="${(horizon * 0.35).toFixed(0)}" width="${width}" height="${(horizon * 0.7).toFixed(0)}" fill="url(#glow)"/>`;
  // after the sky: glow and stars behind the trees, then sun and moon; the night tint goes over everything
  const skyEnd = base.indexOf('/>', base.indexOf('<rect width=')) + 2;
  const end = base.lastIndexOf('</svg>');
  return base.slice(0, skyEnd) + style + defs + glow + `<g class="stars">${stars}</g>` + sun + moon + base.slice(skyEnd, end) + `<rect class="night" width="${width}" height="${height}" fill="#0b1026"/>` + base.slice(end);
}

function logo(size, label) {
  const bg = pick(greens); const fg = '#f1faee';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><title>${label}</title><rect width="100" height="100" rx="18" fill="${bg}"/><polygon points="50,14 22,62 78,62" fill="${fg}"/><polygon points="50,34 30,76 70,76" fill="${fg}" opacity=".8"/><rect x="46" y="74" width="8" height="14" fill="${fg}"/></svg>`;
}

function wav(seconds = 1.5, freq = 440) {
  const rate = 8000; const n = Math.floor(rate * seconds);
  const buf = Buffer.alloc(44 + n);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate, 28); buf.writeUInt16LE(1, 32); buf.writeUInt16LE(8, 34);
  buf.write('data', 36); buf.writeUInt32LE(n, 40);
  for (let i = 0; i < n; i++) { const env = Math.min(1, (n - i) / (rate * 0.4)); buf[44 + i] = Math.round(128 + 100 * env * Math.sin((2 * Math.PI * freq * i) / rate)); }
  return buf;
}

const pdf = () => {
  const lines = ['%PDF-1.4', '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj', '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj', '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj'];
  const text = 'BT /F1 24 Tf 72 720 Td (Eureka 3 brochure) Tj ET';
  lines.push(`4 0 obj << /Length ${text.length} >> stream\n${text}\nendstream endobj`, '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj', 'trailer << /Root 1 0 R >>', '%%EOF');
  return lines.join('\n');
};

export function seed(root = MEDIA_ROOT, { force = false } = {}) {
  if (fs.existsSync(path.join(root, '.seeded')) && !force) return false;
  fs.rmSync(root, { recursive: true, force: true });
  const write = (rel, data, mtime) => { const abs = path.join(root, rel); fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, data); if (mtime) fs.utimesSync(abs, mtime, mtime); };
  const day = 86400000; const t0 = new Date('2026-06-01T09:00:00Z').getTime();
  const when = (i) => new Date(t0 + i * day * (1 + (i % 5)));

  const shapes = [[1600, 900], [1200, 1600], [1200, 1200], [2400, 600], [1920, 1080], [800, 1200]];
  const photoNames = ['morning-fog', 'ridge-line', 'creek-crossing', 'old-growth', 'canopy', 'trailhead', 'fern-gully', 'golden-hour', 'clearing', 'switchbacks', 'meadow-edge', 'last-light'];
  photoNames.forEach((n, i) => { const [w, h] = shapes[i % shapes.length]; write(`photos/${n}.svg`, photo(w, h, n.replace('-', ' ')), when(i)); });
  for (let i = 1; i <= 18; i++) { const [w, h] = shapes[(i * 7) % shapes.length]; write(`photos/redwoods/redwood-${String(i).padStart(2, '0')}.svg`, photo(w, h, `redwood ${i}`), when(20 + i)); }
  ['tidepools', 'sea-stack', 'dunes', 'headland', 'driftwood', 'estuary', 'bluff-trail', 'low-tide'].forEach((n, i) => { const [w, h] = shapes[(i * 5 + 1) % shapes.length]; write(`photos/coast/${n}.svg`, n === 'bluff-trail' ? animatedPhoto(w, h, n.replace('-', ' ')) : photo(w, h, n.replace('-', ' ')), when(40 + i)); });
  write('Wide Banner (final).svg', photo(2400, 400, 'wide banner'), when(50));
  write('welcome.svg', photo(1600, 900, 'welcome to eureka'), when(51));
  write('eureka-mark.svg', logo(512, 'eureka mark'), when(52));
  write('README.md', '# Demo media\n\nBrowse the photos, logos and docs folders. Everything here was generated by `apps/demo/scripts/seed-media.mjs`; upload, rename and delete freely.\n', when(53));
  [['eureka-mark', 512], ['eureka-mark@2x', 1024], ['favicon', 64], ['app-icon', 180], ['badge', 96], ['sticker', 256]].forEach(([n, s], i) => write(`logos/${n}.svg`, logo(s, n), when(60 + i)));
  write('docs/README.md', '# Demo media\n\nEverything here was generated by `apps/demo/scripts/seed-media.mjs`.\n', when(70));
  write('docs/notes.txt', 'Shot list for the redwoods series.\n- morning fog\n- creek crossing\n- canopy from the trail\n', when(71));
  write('docs/catalog.json', JSON.stringify({ series: ['redwoods', 'coast'], count: 38 }, null, 2), when(72));
  write('docs/brochure.pdf', pdf(), when(73));
  write('docs/chime.wav', wav(), when(74));
  fs.mkdirSync(path.join(root, 'uploads'), { recursive: true });
  write('.seeded', new Date().toISOString());
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const created = seed(MEDIA_ROOT, { force: process.argv.includes('--force') });
  console.log(created ? `seeded ${MEDIA_ROOT}` : `${MEDIA_ROOT} already seeded (use --force to regenerate)`);
}
