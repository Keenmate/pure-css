# @keenmate/pure-css

Keenmate's CSS **foundation** — descended from [Yahoo's Pure CSS](https://purecss.io/) and extended into a
more robust, themeable layer for real apps. One small, dependency-free package gives you the
**`--base-*` theming contract** (one block of custom properties re-themes everything at once), a
modern **flexbox grid** (`.pc-row` / `.pc-col`, container-query responsive — replacing Pure's float
grid), a set of **utility classes**, and an optional **app shell + JS runtime** (in the
`pure-css.css` bundle).

It's the shared layer the whole Keenmate stack agrees on:
[`@keenmate/pure-admin-core`](https://github.com/Keenmate/pure-admin) builds its component library on
top of it, and every Keenmate web/Svelte component reads its colours from the same `--base-*`
variables.

## What's New in 1.2.0

> **Upgrade note — additive for pure-css, a coordinated rename downstream.** Every
> change here is purely additive to pure-css itself (new classes and one new token;
> nothing removed), so a pure-css-only upgrade is drop-in. The breaking part is
> downstream: `pure-admin-core` must bump its `@keenmate/pure-css` dependency to
> `^1.2.0` and drop its own copies of the palette / neutral-text helpers (now
> single-sourced here), and in that same cycle the numbered colour utilities lost
> their `pa-` prefix — `.pa-bg-color-N` → `.bg-color-N`, `.pa-text-color-N` →
> `.text-color-N`, etc. Any markup still using the prefixed names must be updated.

- **Utilities — palette + neutral-text helpers graduated from pure-admin-core** — the flat colour-apply helpers that consume pure-css's palette (`--pc-color-N` / `--pc-color-N-text`) and text-hierarchy (`--pc-text-color-N`) tokens now live here beside `.text-color-N`: the property-forms `.bg-color-N` / `.border-color-N` / `.text-on-color-N` and the composite `.surface-color-N` for slots 1–9, plus neutral `.text-body` / `.text-secondary` and the `.text-caption` / `.text-lead` shorthands. They were temporarily homed in `pure-admin-core` so they were demo-able over the `file:` link without a release; this is their permanent home, and pure-admin-core now single-sources them from here (bump its dep to `^1.2.0`).
- **Utilities — role surface helpers (`.bg-{role}` / `.text-on-{role}` / `.surface-{role}`)** — the role parallel of the numeric `-color-N` family, for primary / success / warning / danger / info. `.bg-{role}` paints the role fill (`--pc-{role}`, primary → `--pc-accent`), `.text-on-{role}` supplies the on-fill contrast text (`--base-text-on-{role}`, distinct from the foreground `.text-{role}`), and `.surface-{role}` combines both in one class — all `!important` for cascade parity with the role text utilities.
- **Shell — opt-in desktop overlay sidebar (`.sidebar-overlay`)** — the mobile off-canvas drawer was refactored into a shared `sidebar-drawer-overlay` mixin, and a new `body.sidebar-overlay` caller reuses it on desktop at the normal 288px `$sidebar-width`: a burger opens a temporary floating sidebar (fixed sheet sliding in with a fading backdrop) over usable content, rather than reflowing the layout. RTL and the `body.loaded` first-paint transition gate are preserved.
- **Tooling — foundation component catalog (`COMPONENTS.md` / `components.json`)** — a new `npm run catalog` (`scripts/build-catalog.mjs`) generates a human- and machine-readable manifest of the `pc-*` components and unprefixed utilities from the compiled bundles, so the svelte / phoenix wrappers have a source of truth to validate their emitted DOM against. It assigns every `pc-*` class to a component by longest-prefix match against a hand-authored taxonomy and fails the build on any unclassified class or unused prefix, so coverage can't drift; it's wired into `prepublishOnly` and both files ship in the package.
- **Theming — `--base-checkbox-scale` bridge token** — a new `$base-checkbox-scale` (default `1`) mirrored from `@keenmate/base-css-variables`, emitted as `--base-checkbox-scale`. It multiplies a checkbox's own box width/height (`calc(<base-size> * var(--base-checkbox-scale))`) rather than a `transform: scale()` that would pixel-snap the mask glyph off-centre, so one knob resizes every checkbox in lockstep (paired with `--base-icon-check-size`).

## What's New in 1.1.1

- **Theming — downstream themes can finally override `$base-*` at compile time** — `_base-css-variables.scss` loaded its `$`-vocabulary with `@use 'variables/index' as *`, but Sass won't re-expose a member that already exists in the importing global scope, so any theme that set `$base-*` values *before* importing (the whole point of the `!default` contract) crashed with *"both define a variable named $base-accent-color"* — the workflow documented in that file compiled only when the theme overrode nothing, and the first real theme (`keen-docs-themes/cobalt2`) couldn't build. Switching to `@import 'variables/index'` shares the single global scope the `!default` mechanism relies on (the same reason `variables/_index.scss` uses `@import`), so `$base-*` overrides now land. It's behaviour-preserving for the prebuilt CSS — all seven artifacts rebuilt with every emitted `--base-*` name and value identical — and pure-css's own `@use … as bcv` entry points are unchanged. This landed just after the 1.1.0 tarball was cut, so 1.1.1 is the first release to actually ship it.

## Why

pure-css is a **standalone foundation** you drop onto any surface — a docs site, a marketing page, a
widget host, or a full application. One small, dependency-free package gives you theming, layout and
utilities without buying into a component framework.

Its heart is a single **`--base-*` theming contract**: override one block of custom properties and
everything re-themes at once — the grid, the utilities, the optional app shell, and any component
that reads the same variables. Light and dark are built in via `light-dark()`, there's no build step
to consume it (just link the prebuilt CSS), and it pulls in no runtime dependencies.

```
@keenmate/pure-css  (this package)
  ├─ --base-* theming contract
  ├─ .pc-row / .pc-col grid
  ├─ utility classes
  └─ optional app shell + JS runtime
        ▲  consumed directly, as built CSS, by…
        ├── docs sites · portals · marketing pages · widget & component hosts
        └── @keenmate/pure-admin-core — adds a full component library on top (just one consumer)
```

## Installation

```bash
npm install @keenmate/pure-css
```

## Quick Start

**Prebuilt CSS (simplest):**

```html
<link rel="stylesheet" href="node_modules/@keenmate/pure-css/dist/css/pure-css.css">
```

or cherry-pick:

```html
<link rel="stylesheet" href="…/pure-css/dist/css/base.css">   <!-- variables only -->
<link rel="stylesheet" href="…/pure-css/dist/css/grid.css">   <!-- + grid          -->
```

**SCSS (customize before compiling):**

```scss
// Override the source of truth; everything re-derives.
$base-accent-color: #4f46e5;
$base-page-bg: #0b1020;

@use '@keenmate/pure-css/scss/pure-css';
```

## What's in it

| Artifact | Contents | When to link |
| --- | --- | --- |
| `dist/css/pure-css.css` | everything below, in one file | the common case |
| `dist/css/base.css` | only `:root { --base-*; --pc-*; }` | you just need the theming contract (e.g. to theme embedded web components) or a base for a theme override |
| `dist/css/component-reset.css` | a `:host` reset (box-sizing + inherited typography pinned to `--base-*`) — the Shadow-DOM counterpart to reboot | building a web component: adopt it into the shadow root (e.g. `import '@keenmate/pure-css/component-reset?inline'`) so the host page can't bleed styles in; pair with `base` |
| `dist/css/grid.css` | `.pc-row` / `.pc-col-*` (percentage + fraction columns, container-query responsive) | layout only |
| `dist/css/utilities.css` | spacing / flex / display / width-height utilities (`.m-4`, `.d-flex`, `.w-50`, …) | utilities only |

The `pure-css.css` bundle also includes the **app shell** (navbar, sidebar,
layout container) — `base.css` / `grid.css` / `utilities.css` do not.

### The app-shell runtime (`./js`)

The shell's behaviour (nav fit/collapse, dropdowns, drag-to-resize, container
breakpoints) ships as dependency-free source JS via the `./js` export — no
bundler required, drop it in with a `<script>` and call `initAll`:

```html
<link rel="stylesheet" href="node_modules/@keenmate/pure-css/dist/css/pure-css.css">
<script src="node_modules/@keenmate/pure-css/src/js/pure-css.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/fit.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/navbar-dropdown.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/sidebar-resize.js"></script>
<script>window.pureCss.components.initAll(document);</script>
```

`window.pureCss` also exposes an event bus and live `viewport` / `colorScheme` /
`device` sources. The runtime is optional — shell CSS is authored no-JS-safe, so
the styling stands on its own and the JS only adds the interactive behaviour.

### The `--base-*` contract

`--base-*` is the **single source of truth for theming**. Framework colors, component variables
(`--pc-*`) and web/svelte components all derive from it via fallback chains
(`--ms-accent-color: var(--base-accent-color, #3b82f6)`). Categories: accent, text, background,
border, input, dropdown, tooltip, contextual (success/danger/warning/info), interactive states,
typography, border-radius, spacing/shadow/motion/z-index scales, and icons. The full list is
`src/scss/variables/_base.scss`.

#### Icons

`--base-icon-*` are mask-friendly SVG glyphs (Lucide defaults) for the shared UI affordances, so the
pure-css shell, pure-admin components, and the web/svelte components render the **same** marks and a
theme re-skins them in one place. Each is consumed via `mask: var(--base-icon-x); background:
currentColor`, so the glyph inherits text colour — override a token with any mask-friendly `url()` to
swap the icon set.

| Token | Glyph | Use |
| --- | --- | --- |
| `--base-icon-chevron` | stroked angle `›` | expanders / nav — **rotate-one-glyph** disclosure (points right, rotate 90° when open) |
| `--base-icon-caret-down` / `--base-icon-caret-up` | solid triangles `▾` / `▴` | static dropdown / `<select>` affordance (down) and sort-direction / upward-dropdown counterpart (up) — a caret never rotates |
| `--base-icon-close` | `✕` | dismiss a transient **surface** (dialog, panel, popover, toast) |
| `--base-icon-clear` | `✕` | clear a **field** — distinct purpose, same glyph; **follows** `--base-icon-close`, override alone to diverge |
| `--base-icon-remove` | `✕` | take an **item** out of a collection (chip / tag / row) — non-destructive; follows `--base-icon-close` |
| `--base-icon-expand` / `--base-icon-collapse` | `+` / `−` | **swap-two-glyphs** disclosure (tree nodes, accordions): show `+` when collapsed, `−` when open |
| `--base-icon-add` / `--base-icon-edit` / `--base-icon-delete` | `+` / pencil / trash | **CRUD action** verbs — create / modify / **destroy** (delete is a trash can, *not* an ✕, so it reads as destructive) |
| `--base-icon-search` | magnifying glass | search inputs, command palette — find **by text** |
| `--base-icon-filter` | funnel | refine / **narrow a list** by criteria (filter toggles, faceted search) — distinct from `search` |
| `--base-icon-refresh` | two curved arrows | reload / re-fetch a view or dataset |
| `--base-icon-check` / `--base-icon-indeterminate` | `✓` / `−` | **selection** pair (checkboxes, multiselect, tree nodes): `check` = selected, `indeterminate` = a tri-state parent whose children are a mix |
| `--base-icon-copy` | two overlapping sheets | copy-to-clipboard |
| `--base-icon-ellipsis` | three dots `⋯` | "more / overflow" affordance — **rotate-one-glyph** for the vertical `⋮` variant (rotate 90°) |
| `--base-icon-save` | floppy disk | persist / commit |

Three intentional distinctions:

- **Disclosure models:** **chevron rotates one glyph** (sidebar, multiselect), while **expand/collapse swaps
  two glyphs** (trees, accordions) — a component never rotates a `+` into a `−`.
- **✕ vs trash:** `close` / `clear` / `remove` are three *dismiss* purposes that share the ✕ glyph (and
  cascade off `--base-icon-close`), while `delete` is a separate *destructive* action drawn as a trash can.
  `add` shares the `+` shape with `expand` but is an independent knob (create ≠ disclosure).
- **Selection ≠ disclosure:** `indeterminate` shares the `−` shape with `collapse` but is its own knob —
  a partially-selected checkbox is not a collapsed node.

## Theming

A **theme** is nothing but a set of `--base-*` values. The lightest possible theme is a stylesheet
that redeclares them, loaded *after* `base.css`:

```css
:root {
  --base-accent-color: #4f46e5;
  --base-page-bg: #f6f8fb;
  --base-text-color-1: #1a2233;
}
```

Because pure-admin-core, the components and any consumer all read the same variables, that one block
re-themes all of them at once. This is the same model as
[`@keenmate/pure-admin-themes`](https://github.com/Keenmate/pure-admin-themes), so the same CLI and
publishing infrastructure applies.

### Mode & variant class placement

Light/dark and colour-variant switching is done by toggling a class — `.pc-mode-light` /
`.pc-mode-dark` and `.pa-color-*`. **Apply these to the `:root` element (`<html>`), not `<body>`.**

The mode/variant blocks override input tokens (`--pc-*` / `--base-*`). Many themed tokens are
*derived* from those inputs and emitted once at `:root` — e.g. core emits
`--pa-btn-info-bg: var(--pc-info)`. CSS resolves a custom property's `var()` **at the element that
declares it**, so a derived token declared on `:root` bakes in `:root`'s input value. If the mode
class sits on a *descendant* (`<body>`), the override comes too late and the derived token stays
frozen at the default-mode value — the classic symptom is a role button or surface that doesn't
change colour when you switch modes. Putting the class on `:root` (the same element that declares
the tokens) makes the overrides win and the derived tokens re-resolve.

pure-css re-emits its own base text-tier tokens at `:root, .pc-mode-light, .pc-mode-dark` to tolerate
either placement, but that does not extend to the pure-admin component layer, hence the `:root` rule.

To avoid a colour "flash" on switch, disable transitions for one frame during the swap (add a
`transition: none !important` class to `:root`, change the mode/variant class, force a reflow, then
remove it).

## Build

```bash
make install   # sass
make build     # src/scss -> dist/css (bundle + base + grid + utilities)
make sizes     # show artifact sizes
```

`dist/` is committed so consumers can vendor the built CSS without a Sass toolchain.

## Provenance

The SCSS is the foundation extracted from `pure-admin-core`'s `src/scss` — the `variables/` modules,
`_base-css-variables.scss`, `utilities.scss`, `_fonts.scss`, and the native grid (`_pa-grid.scss`,
formerly core's `core-components/_grid.scss`). **pure-admin-core now consumes this package** as its
single source for the foundation (thin `@import`/`@forward` shims), so the two no longer drift —
core's compiled `--base-*` values and grid output match pure-css exactly.

One intentional difference: `utilities.scss` here `@use`s `_fonts.scss` so the generic
`.font-family-*` classes ship with the other utilities, whereas core keeps `_fonts.scss` standalone.
`_rtl-helpers.scss` and the component layer stay in core.

## License

MIT © Keenmate. The grid is derived from [Pure](https://purecss.io/) (Yahoo!, BSD).
