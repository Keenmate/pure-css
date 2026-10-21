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

## What's New in 2.0.0-rc03

- **Reboot — native form controls take the theme's primary** — `reboot.scss` now sets `html { accent-color: var(--pc-primary-color) }`, so checkboxes, radios, range sliders and progress bars that nothing else styles stop using the browser's default blue and follow the theme (cobalt2's native radios showed blue next to its yellow checkboxes). It matters most on pages that use pure-css without pure-admin. Controls drawn with `appearance: none` — pure-admin's `.pa-checkbox` / `.pa-radio` — ignore it, and `component-reset.css` still resets `accent-color` to `auto` inside web components, so nothing leaks into shadow DOM.

## What's New in 2.0.0-rc02

> **Upgrade note: breaking.** The `--pc-*` role colours were renamed and the physical left / right
> utilities are gone. Grep your CSS and markup for `--pc-(primary|secondary|success|warning|danger|info)`
> and for `ml-` / `mr-` / `pl-` / `pr-` / `-left` / `-right` utility classes.

- **Theming — `--pc-*` role colours end in `-color`** — 2.0.0-rc01 renamed only the derived names, so `--pc-success` sat next to `--pc-success-text-color`. The role colours now follow the same rule as the `--base-*` contract they mirror: `--pc-primary` / `-hover` / `-active` become `--pc-primary-color` / `-color-hover` / `-color-active`, and `--pc-secondary`, `--pc-success`, `--pc-warning`, `--pc-danger`, `--pc-info` become `--pc-<role>-color`. The tints (`--pc-primary-bg-subtle[-hover]`) and `--pc-<role>-text-color` are unchanged.
- **Utilities — inline sides are logical-only** — `.ms-*` / `.me-*` / `.ps-*` / `.pe-*` now come in both the numeric (`ms-2`) and semantic (`ms-sm`) scales with `!important`, and `.border-start` / `.border-end` (plus `-0`) and `.rounded-start` / `.rounded-end` join them. They follow the writing direction, so they mirror under `dir="rtl"`. The physical `.ml-*` / `.mr-*` / `.pl-*` / `.pr-*`, `.border-left` / `-right` and `.rounded-left` / `-right` are removed; rename `-left` → `-start` and `-right` → `-end` (identical in LTR). `.mx-*` / `.px-*` use `margin-inline` / `padding-inline`.
- **Utilities — `.font-family-mono` / `.font-family-system` follow the theme** — they read `--base-font-family-mono` / `--base-font-family` instead of fixed stacks, so they match the framework's own code and UI text. Visible change: `.font-family-mono` was `"Courier New"` and is now the code font (`SFMono-Regular, Menlo, Consolas, …` by default).

## Why

pure-css is a **standalone foundation** you drop onto any surface — a docs site, a marketing page, a
widget host, or a full application. One small, dependency-free package gives you theming, layout and
utilities without buying into a component framework.

Its heart is a single **`--base-*` theming contract**: override one block of custom properties and
everything re-themes at once — the grid, the utilities, the optional app shell, and any component
that reads the same variables. Light and dark are built in via `light-dark()`, there's no build step
to consume it (just link the prebuilt CSS), and it pulls in no runtime dependencies.

The canonical `--base-*` list is owned by
[`@keenmate/base-css-variables`](https://github.com/Keenmate/base-css-variables) (the plain-CSS
contract standalone web components ship with); pure-css mirrors it exactly, so the same theme block
works whether a page loads pure-css, the web components, or both.

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
<link rel="stylesheet" href="…/pure-css/dist/css/base.css">     <!-- variables only      -->
<link rel="stylesheet" href="…/pure-css/dist/css/reboot.css">   <!-- 10px rem base       -->
<link rel="stylesheet" href="…/pure-css/dist/css/grid.css">     <!-- + grid              -->
```

> **Keep `reboot.css` when cherry-picking.** Every `rem` in pure-css assumes
> `html { font-size: 10px }` (`1rem` = 10px; `.m-4` = 1rem, grid gutters 0.8rem). Without the
> reboot the grid and utilities render 1.6× too large on a default 16px root.

**SCSS (compile `$base-*` overrides into the CSS):**

```scss
// Configure the variables ONCE, before anything else loads them — every derived
// token (text tiers, hover/active steps, borders, control outlines…) is computed
// from these inputs. Then load the bundle: it gets the configured variables.
@use '@keenmate/pure-css/src/scss/variables' with (
  $base-primary-color: #4f46e5,
  $base-page-bg: #f6f8fb,
);
@use '@keenmate/pure-css/src/scss/pure-css';
```

Compile with `--load-path=node_modules`. To emit only the token layer (for loading after a
prebuilt `pure-css.css` / `base.css`), `@use` `base-css-variables` instead of the bundle and
include `output-base-css-variables` + `output-pc-css-variables` in `:root`. The configuring
`@use … with` must come first: Sass modules are configured once, so a later `with` (or a
module that already loaded the variables) is an error rather than a silently ignored override.

## What's in it

| Artifact | Contents | When to link |
| --- | --- | --- |
| `dist/css/pure-css.css` | everything below, in one file | the common case |
| `dist/css/base.css` | only `:root { --base-*; --pc-*; }` | you just need the theming contract (e.g. to theme embedded web components) or a base for a theme override |
| `dist/css/reboot.css` | `html { font-size: 10px }` + box-sizing reset + neutral element styling (headings, paragraphs, links) | always, unless you link the bundle — it's the rem contract everything else assumes |
| `dist/css/scrollbars.css` | thin themed scrollbars, coloured from `--pc-*` | you want the browser chrome to match the theme |
| `dist/css/component-reset.css` | a `:host` reset (box-sizing + inherited typography pinned to `--base-*`) — the Shadow-DOM counterpart to reboot | building a web component: adopt it into the shadow root (e.g. `import '@keenmate/pure-css/component-reset?inline'`) so the host page can't bleed styles in; pair with `base` |
| `dist/css/grid.css` | `.pc-row` / `.pc-col-*` (percentage + fraction columns, container-query responsive) | layout only |
| `dist/css/utilities.css` | spacing / flex / display / width-height, borders / rounded / shadows, role and palette colour helpers (`.text-primary`, `.bg-success`, `.surface-color-3`, `.text-muted`, …) and `.font-family-*` | utilities only |

The `pure-css.css` bundle is base + reboot + scrollbars + grid + utilities, plus the **app shell**
(navbar, sidebar, layout container), which ships in no other artifact. `component-reset.css` is
standalone and not part of the bundle.

Every class the package emits is listed in [`COMPONENTS.md`](./COMPONENTS.md) (machine-readable:
`components.json`), regenerated from the built CSS on each publish.

### The app-shell runtime (`./js`)

The shell's behaviour (nav fit/collapse, dropdowns, drag-to-resize, container
breakpoints) ships as dependency-free source JS via the `./js` export — no
bundler required, drop it in with `<script>` tags (`pure-css.js` first):

```html
<link rel="stylesheet" href="node_modules/@keenmate/pure-css/dist/css/pure-css.css">
<script src="node_modules/@keenmate/pure-css/src/js/pure-css.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/fit.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/navbar-dropdown.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/sidebar-resize.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/sidebar-flyout.js"></script>
<script src="node_modules/@keenmate/pure-css/src/js/container-breakpoint.js"></script>
```

Each engine self-initialises on `DOMContentLoaded`. After injecting shell markup later (SPA route
change, server-rendered patch), re-wire it with `window.pureCss.components.initAll(scope)`.

`window.pureCss` also exposes an event bus and live `viewport` / `colorScheme` /
`device` sources. The runtime is optional — shell CSS is authored no-JS-safe, so
the styling stands on its own and the JS only adds the interactive behaviour.

### The `--base-*` contract

`--base-*` is the **single source of truth for theming**. Framework colors, component variables
(`--pc-*`) and web/svelte components all derive from it via fallback chains
(`--ms-accent-color: var(--base-primary-color, #3b82f6)`). Categories: primary / secondary roles,
text, background, border, input, dropdown, tooltip, contextual roles (success/danger/warning/info),
interactive and item states (hover, active, selected, focused), shadow, palette slots, typography,
border-radius, and icons. The canonical list is `@keenmate/base-css-variables`; pure-css's mirror is
`src/scss/variables/_base.scss`, and `scripts/check-base-parity.mjs` fails if the two drift.

Only the **inputs** are fixed values (surfaces, `--base-text-color-1`, role colours, on-fill text,
overlay, shadow, palette). Every other token defaults to a CSS formula over them — text tiers mixed
from `--base-text-color-1`, hover/active steps via `color-mix`, borders and subtle surfaces as OKLCH
lightness shifts — so a theme that sets only the inputs gets a coherent, mode-aware result.

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
| `--base-icon-download` | arrow into tray | download / export |
| `--base-icon-link` / `--base-icon-external-link` | chain links / box with arrow | in-app link vs. opens elsewhere (new tab, other site) |
| `--base-icon-settings` / `--base-icon-user` / `--base-icon-bell` | gear / person / bell | shell chrome: settings, account menu, notifications |
| `--base-icon-info` / `--base-icon-success` / `--base-icon-warning` / `--base-icon-danger` | circled `i` / circled `✓` / triangle `!` / circled `✕` | status marks for alerts, toasts and validation messages, one per role |

`--base-icon-check-size` (default `68%`) sizes the check glyph inside its box, paired with
`--base-checkbox-scale`, which resizes the checkbox itself.

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
  --base-primary-color: #4f46e5;
  --base-page-bg: #f6f8fb;
  --base-text-color-1: #1a2233;
}
```

Because pure-admin-core, the components and any consumer all read the same variables, that one block
re-themes all of them at once. This is the same model as
[`@keenmate/pure-admin-themes`](https://github.com/Keenmate/pure-admin-themes), so the same CLI and
publishing infrastructure applies.

### Light / dark

The defaults are `light-dark()` pairs keyed off the CSS `color-scheme`. `base.css` sets
`color-scheme: light`, so with pure-css alone dark mode is one declaration:

```css
:root { color-scheme: dark; }        /* always dark            */
:root { color-scheme: light dark; }  /* follow the OS setting  */
```

### Mode & variant class placement

Themes (and pure-admin) switch light/dark and colour variants by toggling a class — `.pc-mode-light` /
`.pc-mode-dark`, and pure-admin's `.pa-color-*`. **Apply these to the `:root` element (`<html>`), not
`<body>`.**

The mode/variant blocks override input tokens (`--pc-*` / `--base-*`). Many themed tokens are
*derived* from those inputs and emitted once at `:root` — e.g. core emits
`--pa-btn-info-bg: var(--pc-info-color)`. CSS resolves a custom property's `var()` **at the element that
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
make install                      # npm install (sass; vite + playwright for the demo and tests)
make build                        # src/scss -> dist/css (all 7 artifacts)
make sizes                        # show artifact sizes
npm run dev                       # demo site on http://localhost:12500
npm test                          # Playwright e2e suite (first run: npm run test:e2e:install)
npm run catalog                   # regenerate COMPONENTS.md / components.json
node scripts/check-base-parity.mjs  # --base-* names match @keenmate/base-css-variables
```

`dist/` is committed so consumers can vendor the built CSS without a Sass toolchain.

## Provenance

The SCSS is the foundation extracted from `pure-admin-core`'s `src/scss` — the `variables/` modules,
`_base-css-variables.scss`, `utilities.scss`, `_fonts.scss`, and the native grid (`_pa-grid.scss`,
formerly core's `core-components/_grid.scss`). **pure-admin-core now consumes this package** as its
single source for the foundation (thin `@forward` / `@use` shims), so the two no longer drift —
core's compiled `--base-*` values and grid output match pure-css exactly.

One intentional difference: `utilities.scss` here `@use`s `_fonts.scss` so the generic
`.font-family-*` classes ship with the other utilities, whereas core keeps `_fonts.scss` standalone.
`_rtl-helpers.scss` and the component layer stay in core.

## License

MIT © Keenmate s.r.o. The grid is derived from [Pure](https://purecss.io/) (Yahoo!, BSD).
