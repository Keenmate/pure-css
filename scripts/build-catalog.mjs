#!/usr/bin/env node
// Generates the authoritative @keenmate/pure-css catalog:
//   - components.json  (machine-readable manifest)
//   - COMPONENTS.md    (human-readable catalog)
//
// pure-css owns the FOUNDATION contract that the pure-admin catalog deliberately
// does NOT track: the `pc-*` components (grid, app-shell: navbar / sidebar /
// layout / footer / containers, the fit overflow engine, responsive + mode state
// hooks, icon-hover) AND the unprefixed utility classes (spacing, sizing, colour
// helpers, flexbox, etc.). Wrapper libraries (svelte-pure-admin / keen-pure-admin)
// emit these alongside pa-* components, so they need a source of truth to validate
// generated DOM against — this catalog is the pure-css half of that union.
//
// Extraction is from the COMPILED bundles, on purpose: the grid, visibility and
// offset families are loop-generated with single-dash variants (pc-col-50,
// pc-offset-5, pc-hide-below-md) and the utilities are almost entirely @each
// generated — so the compiled CSS is the only COMPLETE list. (A source-only
// parse, like pure-admin's generator, would skip every interpolated class — and
// those variants ARE the contract wrappers emit.) Run `npm run build` first.
//   • pc-* classes  ← dist/css/pure-css.css (the full bundle)
//   • utilities      ← dist/css/utilities.css (non-pc-*, non-pa-*)
// Each pc-* class is assigned to a component by LONGEST-PREFIX match against the
// hand-authored TAXONOMY. It FAILS if any pc-* class matches no component (drift)
// or if a taxonomy prefix matches nothing (stale), so coverage can't drift.
//
// The SCSS source is still read — but only to attribute each component to its
// defining partial(s). Re-run after changing any pc-* class or utility:
//   npm run catalog

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCSS = join(ROOT, 'src', 'scss');
const DIST = join(ROOT, 'dist', 'css');
const BUNDLE_CSS = join(DIST, 'pure-css.css');
const UTILITIES_CSS = join(DIST, 'utilities.css');

function need(path) {
  if (!existsSync(path)) {
    console.error(`ERROR: ${relative(ROOT, path)} not found — run \`npm run build\` first ` +
      '(the catalog is harvested from the compiled bundles, not the SCSS source).');
    process.exit(1);
  }
  return readFileSync(path, 'utf8');
}

// ---- harvest class selectors from compiled CSS ----------------------------
// pc-* is OUR namespace, so every `.pc-…` token in the bundle is a real class —
// leading (`.pc-navbar {`), compound (`body.pc-container-sm`), or descendant
// (`.pc-layout .pc-sidebar`). Harvest all of them (a preceding `body.` makes a
// boundary-anchored match miss the compound, which is how pc-container-* hid).
function harvestPc(css) {
  return [...new Set([...css.matchAll(/\.(pc-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]))];
}
// Utilities: standalone or class-compounded (`.a.b`) — anchor on a boundary
// (incl. `.`) so a stray `url(x.png)` can't masquerade as a `.png` class.
function harvestUtil(css) {
  return [...new Set(
    [...css.matchAll(/(?:^|[\s,{}()>+~.])\.([a-zA-Z][a-zA-Z0-9_-]*)/g)].map((m) => m[1])
  )];
}

const bundle = need(BUNDLE_CSS);
const pcClasses = harvestPc(bundle).sort();

// ---- TAXONOMY: every pc-* class must match exactly one component by prefix --
// `blocks` are PREFIXES: a class C belongs to a block B when C === B, or C starts
// with `B-`, `B__` or `B--`. Longest matching prefix wins, so e.g. pc-col-auto
// and pc-col-50 both map via `pc-col` while pc-app-header is its own block.
const TAXONOMY = [
  // ---------------- Grid ----------------
  { key: 'grid', name: 'Grid', category: 'Grid',
    desc: 'Flexbox grid: pc-row container with pc-col auto / pc-col-auto content-width / pc-col-{5..100} percentage / fraction columns, responsive pc-col-{sm,md,lg,xl}-*, and pc-offset-* spacers. Wrappers emit these from <Column size md…> props.',
    blocks: ['pc-row', 'pc-col', 'pc-offset'] },

  // ---------------- Layout & shell ----------------
  { key: 'layout', name: 'Layout scaffold', category: 'Layout & shell',
    desc: 'App shell scaffold: the pc-layout grid (inner / main / content / sidebar / footer regions) with sticky + icon-collapse modifiers.',
    blocks: ['pc-layout'] },
  { key: 'navbar', name: 'Navbar & headers', category: 'Layout & shell',
    desc: 'Top navbar (start / center / end, burger, inner, profile button), the navbar search pill, the nav menu, and the app-header / page-header regions.',
    blocks: ['pc-navbar', 'pc-navmenu', 'pc-app-header', 'pc-page-header'] },
  { key: 'sidebar', name: 'Sidebar', category: 'Layout & shell',
    desc: 'Collapsible sidebar (item / link / label / icon / chevron / submenu / toggle / search) with the resize handle and resized / resizing state hooks.',
    blocks: ['pc-sidebar'] },
  { key: 'footer', name: 'Footer', category: 'Layout & shell',
    desc: 'App footer with start / center / end regions.',
    blocks: ['pc-footer'] },
  { key: 'container', name: 'Width containers', category: 'Layout & shell',
    desc: 'Max-width content containers at each breakpoint (sm / md / lg / xl / 2xl).',
    blocks: ['pc-container'] },

  // ---------------- Engines & state hooks ----------------
  { key: 'fit', name: 'Fit (overflow engine)', category: 'Engines & state hooks',
    desc: 'The fit degradation engine\'s self-contained "•••" overflow flyout (relocation target for data-pc-fit-target="floating-menu") plus the pc-fit-hidden state class the engine toggles.',
    blocks: ['pc-fit'] },
  { key: 'visibility', name: 'Responsive visibility', category: 'Engines & state hooks',
    desc: 'Breakpoint show / hide hooks: pc-hide / pc-show, their per-breakpoint and -below variants.',
    blocks: ['pc-hide', 'pc-show'] },
  { key: 'mode', name: 'Colour mode', category: 'Engines & state hooks',
    desc: 'Light / dark mode root hooks (pc-mode-light / pc-mode-dark) that select which --pc-* / --base-* value set applies.',
    blocks: ['pc-mode'] },
  { key: 'container-query', name: 'Container query context', category: 'Engines & state hooks',
    desc: 'Marks an element as a container-query context so descendant components can respond to the element\'s width rather than the viewport.',
    blocks: ['pc-cq'] },

  // ---------------- Icon ----------------
  { key: 'icon-hover', name: 'Icon hover', category: 'Icon',
    desc: 'Per-set icon hover strategy hooks: pc-icon-hover with -fill / -highlight variants (FA weight-flip / recolour / two-asset swap configured per icon set).',
    blocks: ['pc-icon-hover'] },
];

// prefix membership test
function prefixMatches(cls, block) {
  return cls === block || cls.startsWith(block + '-') ||
    cls.startsWith(block + '__') || cls.startsWith(block + '--');
}
// all (block, component) prefixes, longest first so the most specific wins
const PREFIXES = TAXONOMY.flatMap((c) => c.blocks.map((b) => ({ block: b, key: c.key })))
  .sort((a, b) => b.block.length - a.block.length);
function componentOf(cls) {
  for (const { block, key } of PREFIXES) if (prefixMatches(cls, block)) return { block, key };
  return null;
}

// ---- validate: no drift, no stale taxonomy --------------------------------
const unmatched = pcClasses.filter((c) => !componentOf(c));
if (unmatched.length) {
  console.error('ERROR: pc-* classes in the compiled bundle that match no component (taxonomy drift):');
  for (const c of unmatched) console.error('  - ' + c);
  process.exit(1);
}
const blockHits = new Map(PREFIXES.map((p) => [p.block, 0]));
for (const c of pcClasses) blockHits.set(componentOf(c).block, blockHits.get(componentOf(c).block) + 1);
const stale = [...blockHits.entries()].filter(([, n]) => n === 0).map(([b]) => b);
if (stale.length) {
  console.error('ERROR: taxonomy block prefixes that match no pc-* class in the bundle (stale):');
  for (const b of stale) console.error('  - ' + b);
  process.exit(1);
}

// ---- owning-partial attribution (from SCSS source) ------------------------
// Nesting-aware leading-selector scan (resolves `&`, skips `#{…}` interpolation
// and comments) — ported from pure-admin's generator. We only need which file
// contains each component's classes as a LEADING selector (i.e. defines them).
function stripComments(t) {
  return t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
}
function leadingSelectors(text) {
  text = stripComments(text);
  const stack = [['']];
  const out = new Set();
  let buf = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '#' && text[i + 1] === '{') {
      i += 2; let depth = 1;
      for (; i < text.length && depth > 0; i++) { if (text[i] === '{') depth++; else if (text[i] === '}') depth--; }
      i--; buf += '#{}'; continue;
    }
    if (c === '{') {
      const sel = buf.trim(); buf = '';
      if (sel.startsWith('@')) { stack.push(stack[stack.length - 1]); continue; }
      const parents = stack[stack.length - 1];
      const resolved = [];
      for (const raw of sel.split(',').map((s) => s.trim()).filter(Boolean)) {
        if (raw.includes('&')) for (const p of parents) resolved.push(raw.replaceAll('&', p));
        else resolved.push(raw);
      }
      for (const part of resolved) {
        // first class token if the segment STARTS with `.pc-…`
        const m = part.match(/^\.(pc-[a-z0-9_-]+)/);
        if (m) out.add(m[1]);
      }
      stack.push(resolved);
    } else if (c === '}') { buf = ''; if (stack.length > 1) stack.pop(); }
    else if (c === ';') { buf = ''; }
    else { buf += c; }
  }
  return out;
}
function walk(dir, filter, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name); const s = statSync(p);
    if (s.isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}
const partialsByKey = new Map(TAXONOMY.map((c) => [c.key, new Set()]));
for (const file of walk(SCSS, (p) => p.endsWith('.scss'))) {
  const rel = relative(SCSS, file).replaceAll('\\', '/');
  for (const sel of leadingSelectors(readFileSync(file, 'utf8'))) {
    const hit = componentOf(sel);
    if (hit) partialsByKey.get(hit.key).add(rel);
  }
}

// ---- assemble pc-* components ---------------------------------------------
const components = {};
for (const c of TAXONOMY) {
  const sels = pcClasses.filter((s) => componentOf(s).key === c.key).sort();
  const elements = sels.filter((s) => s.includes('__') && !s.includes('--'));
  const modifiers = sels.filter((s) => s.includes('--'));
  const base = sels.filter((s) => !s.includes('__') && !s.includes('--')); // block + dash-variants
  components[c.key] = {
    name: c.name,
    category: c.category,
    description: c.desc,
    block: c.blocks[0],
    selectors: sels,
    base,
    elements,
    modifiers,
    partials: [...partialsByKey.get(c.key)].sort(),
  };
}

// ---- utility harvest (non-pc-*, non-pa-*) ---------------------------------
const utilClasses = harvestUtil(need(UTILITIES_CSS))
  .filter((c) => !c.startsWith('pc-') && !c.startsWith('pa-'))
  .sort();

// Ordered longest-prefix-first family matchers; first hit wins. Colour-palette
// families precede their bare counterparts so `bg-color-3` groups as palette.
const FAMILY_RULES = [
  [/^text-on-color-\d/, 'text-on (palette contrast)'],
  [/^text-on-/, 'text-on (role contrast)'],
  [/^text-color-\d/, 'text colour (palette)'],
  [/^bg-color-\d/, 'background (palette)'],
  [/^surface-color-\d/, 'surface (palette)'],
  [/^border-color-\d/, 'border colour (palette)'],
  [/^bg-/, 'background (role / named)'],
  [/^surface-/, 'surface (role / named)'],
  [/^text-/, 'text (colour / alignment / wrap)'],
  [/^border/, 'border (width / side / style / colour)'],
  [/^rounded/, 'border radius'],
  [/^shadow/, 'box shadow'],
  [/^gap(-[xy])?-/, 'gap'],
  [/^(minwr|maxwr|minw|maxw|mw|wr|w)-/, 'width (incl. min / max, rem variants)'],
  [/^(minhr|maxhr|minh|maxh|min-h|max-h|hr|h)-/, 'height (incl. min / max, rem + viewport)'],
  [/^(mt|mr|mb|ml|mx|my|m)-/, 'margin'],
  [/^(pt|pr|pb|pl|px|py|p)-/, 'padding'],
  [/^flex/, 'flexbox'],
  [/^justify-content-/, 'flexbox'],
  [/^align-items-/, 'flexbox'],
  [/^position-/, 'position'],
  [/^d-/, 'display'],
  [/^font-family-/, 'font family'],
];
function familyOf(cls) {
  for (const [re, label] of FAMILY_RULES) if (re.test(cls)) return label;
  return 'misc';
}
const famMap = new Map();
for (const cls of utilClasses) {
  const fam = familyOf(cls);
  if (!famMap.has(fam)) famMap.set(fam, []);
  famMap.get(fam).push(cls);
}
const miscUtils = (famMap.get('misc') || []).sort();
if (miscUtils.length) {
  console.warn(`WARN: ${miscUtils.length} utility class(es) fell into "misc" — add a FAMILY_RULES entry:`);
  console.warn('  ' + miscUtils.join(', '));
}
const utilityFamilies = [...famMap.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([name, classes]) => ({ name, count: classes.length, examples: classes.slice(0, 6), classes: classes.sort() }));

// ---- manifest -------------------------------------------------------------
const manifest = {
  '//': 'AUTO-GENERATED by scripts/build-catalog.mjs — do not edit by hand.',
  packageVersion: JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version,
  totals: {
    components: TAXONOMY.length,
    pcSelectors: pcClasses.length,
    utilityClasses: utilClasses.length,
    utilityFamilies: utilityFamilies.length,
  },
  categories: [...new Set(TAXONOMY.map((c) => c.category))],
  components,
  utilities: {
    note: 'Flat, exhaustive allow-list harvested from compiled dist/css/utilities.css. ' +
      'The wrapper-fidelity harness validates emitted non-pc-*/non-pa-* classes against `classes`.',
    total: utilClasses.length,
    families: utilityFamilies,
    classes: utilClasses,
  },
};
writeFileSync(join(ROOT, 'components.json'), JSON.stringify(manifest, null, 2) + '\n');

// ---- render COMPONENTS.md -------------------------------------------------
const md = [];
md.push('# Pure CSS — Foundation Catalog\n');
md.push('> **Auto-generated** by `scripts/build-catalog.mjs` from the compiled bundles.');
md.push('> Do not edit by hand — re-run `npm run catalog` (after `npm run build`) when any `pc-*` class or utility changes.');
md.push('> Machine-readable form: [`components.json`](./components.json).\n');
md.push(`Package version **${manifest.packageVersion}** · **${manifest.totals.components}** pc-* components · ` +
  `**${manifest.totals.pcSelectors}** pc-* selectors · **${manifest.totals.utilityClasses}** utility classes.\n`);
md.push('This is the pure-css half of the wrapper-fidelity contract: the foundation ' +
  '(`pc-*` grid + app-shell + engines, and the unprefixed utility classes) that the ' +
  'pure-admin catalog intentionally does **not** track. The svelte / phoenix wrappers ' +
  'validate the non-`pa-*` classes they emit against this catalog.\n');

md.push('## pc-* components\n');
md.push('| Component | Block | Category | Selectors |');
md.push('|---|---|---|--:|');
for (const c of TAXONOMY) {
  const e = components[c.key];
  md.push(`| ${e.name} | \`${e.block}\` | ${e.category} | ${e.selectors.length} |`);
}
md.push('');

for (const cat of [...new Set(TAXONOMY.map((c) => c.category))]) {
  md.push(`## ${cat}\n`);
  for (const c of TAXONOMY.filter((x) => x.category === cat)) {
    const e = components[c.key];
    md.push(`### ${e.name} — \`${e.block}\`\n`);
    md.push(e.description + '\n');
    const rows = [];
    rows.push(`- **Blocks & variants:** ${e.base.map((x) => `\`${x}\``).join(', ') || '—'}`);
    if (e.elements.length) rows.push(`- **Elements:** ${e.elements.map((x) => `\`${x}\``).join(', ')}`);
    if (e.modifiers.length) rows.push(`- **Modifiers / states:** ${e.modifiers.map((x) => `\`${x}\``).join(', ')}`);
    rows.push(`- **SCSS:** ${e.partials.map((x) => `\`${x}\``).join(', ') || '—'}`);
    md.push(rows.join('\n') + '\n');
  }
}

md.push('## Utilities\n');
md.push(`**${manifest.totals.utilityClasses}** unprefixed utility classes across ` +
  `**${manifest.totals.utilityFamilies}** families (harvested from compiled \`dist/css/utilities.css\`). ` +
  'Full per-class list in [`components.json`](./components.json) → `utilities.classes`.\n');
md.push('| Family | Count | Examples |');
md.push('|---|--:|---|');
for (const f of utilityFamilies) {
  md.push(`| ${f.name} | ${f.count} | ${f.examples.map((x) => `\`${x}\``).join(', ')}${f.count > f.examples.length ? ' …' : ''} |`);
}
md.push('');
writeFileSync(join(ROOT, 'COMPONENTS.md'), md.join('\n'));

console.log(`OK  ${manifest.totals.components} pc-* components · ${manifest.totals.pcSelectors} pc-* selectors · ` +
  `${manifest.totals.utilityClasses} utilities (${manifest.totals.utilityFamilies} families)`);
if (miscUtils.length) console.log(`  ⚠ ${miscUtils.length} utilities in "misc" — see warning above`);
