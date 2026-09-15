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

## What's New in 1.0.2

- **Icons — `copy`, `ellipsis`, `save` and `refresh` glyphs join the shared `--base-*` contract** — four more mask-friendly Lucide glyphs so every consumer paints the same actions from one theme knob. `--base-icon-copy` (two overlapping sheets) is copy-to-clipboard, `--base-icon-ellipsis` (three dots) is the "more / overflow" mark — its vertical `⋮` variant is the *same glyph rotated 90°* (the rotate-one-glyph discipline already used for `chevron`), so there's no separate token to maintain — `--base-icon-save` (a floppy disk) is persist / commit, and `--base-icon-refresh` (two curved arrows, Lucide `refresh-cw`) is reload / re-fetch, sitting alongside `search` and `filter` in the utility-icon row (consumers typically spin it with a CSS animation while a fetch is in flight). The action trio completes the affordance set pure-admin migrated off Font Awesome: its `--pa-icon-copy` / `-ellipsis` / `-save` already routed through these `--base-icon-*` names with inline fallbacks, so they become fully theme-overridable with zero pure-admin change. All are authored in `variables/_base.scss` and emitted from `output-base-css-variables`, so both the standalone `base.css` and the `pure-css.css` bundle carry them; consume via `mask: var(--base-icon-copy); background: currentColor`.

## What's New in 1.0.1

- **Sidebar search — type-and-go text is legible again on mode-independent sidebars** — the framed sidebar search box (`.pc-sidebar__search`) sits on the *input* surface (`--base-input-bg`), but its field text and `:hover` colour were painted with `--pc-sidebar-text`, a token tuned for the *sidebar* surface. On themes that keep the sidebar one colour across light and dark (e.g. express, whose sidebar is always black → `--pc-sidebar-text: #fff`), that white text landed on the light input background and vanished — white-on-white, so you couldn't read what you were typing. Both `.pc-sidebar__search-field` and `.pc-sidebar__search:hover` now read `--base-input-color`, which is emitted per-mode alongside `--base-input-bg`, so the field text always pairs with its own surface and stays readable in every theme.

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
