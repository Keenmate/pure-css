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

## What's New in 2.0.0-rc01

> **Upgrade note: breaking. This release syncs pure-css with `@keenmate/base-css-variables` 2.0.0.**
> Many `$base-*` / `--base-*` / `--pc-*` names changed, and none of the old names still work as
> aliases. If a theme sets an old name, Sass silently ignores it and that token falls back to the
> Corporate default. Before upgrading, grep your themes and markup for `accent`, `color-N`,
> `-bg-light`, `-text-light`, `ring` and `.text-secondary` — and move Sass themes from `@import` to
> `@use '…/variables' with (…)` (see Quick Start).

- **Theming — `accent` → `primary`, `color-N` → `palette-N`, names state their type** — this release mirrors the base-css-variables 2.0.0 renames in every layer (`$base-*`, framework `$*`, `--base-*`, `--pc-*`). `$base-accent-color` becomes `$base-primary-color`, and `--pc-accent` / `--pc-accent-light` / `--pc-accent-hover` become `--pc-primary-color` / `--pc-primary-bg-subtle` / `--pc-primary-bg-subtle-hover`. The last one is renamed by what it actually was: a low-alpha tint, not a darker hover. Palette slots go from `--base-color-N` to `--base-palette-N`, with the text pair `--base-on-palette-N-text-color`. Text and outline tokens now say what kind of value they hold (`-text-color`, `-outline`, `$base-outline-width`, `$base-input-text-color`, `$base-on-<role>-text-color`). Utility class names (`.text-color-N`, `.bg-color-N`, …) are unchanged.
- **Theming — derived defaults are the contract formulas** — only the inputs are still Sass colours: surfaces, `text-color-1`, role colours, on-fill text, overlay, shadow and the palette. Every other `$base-*` now defaults to the same CSS formula `base-variables.css` uses. Examples: `text-color-2…4` are mixed from `text-color-1`, the `subtle` / `elevated` / `disabled` / `border-color` surfaces are OKLCH lightness shifts, and role hover/active steps are `color-mix` values that go lighter in dark mode. So a theme that only sets the inputs gets every derived token computed per mode scope. Before this, every dark theme inherited light-mode literals such as `--base-input-border-color: #e2e8f0`. One Sass-level break: derived defaults are now CSS strings, so you can't pass them to `color.adjust()` / `rgba()`.
- **Theming — `--pc-*` follow `--base-*` at runtime** — `--pc-main-bg`, `--pc-subtle-bg`, the status roles and their `-text-color` tokens used to be emitted as build-time literals. A runtime `--base-*` override therefore reached the web components but not pure-admin. They are now `var(--base-*, <build value>)` like the rest of the tokens. The new `--pc-primary-color-hover` / `--pc-primary-color-active` are live steps too, and `--pc-primary-bg-subtle` now reads `--base-primary-bg-subtle` (10% / 20% light/dark), so pure-admin and the web components show the same primary tint. Compiled values are unchanged across all 16 themes.
- **Theming — one shadow tone** — every shadow now takes its colour from `--base-shadow-color` (`light-dark()` 15% / 40% black). That covers the `$shadow-sm…2xl` / `$shadow-sidebar*` presets, the `.shadow*` utilities, the collapsed-sidebar flyouts and `$base-dropdown-box-shadow`. A theme sets the tone once per mode, and pure-css, pure-admin and the web components all match. Dark-mode shadows were nearly invisible at 10–15%.
- **Utilities — secondary is a full role; `.text-muted` for muted text** — the new `--pc-secondary-color` adds `.bg-secondary` / `.text-on-secondary` / `.surface-secondary`, matching the other roles. **Breaking:** `.text-secondary` is now the secondary role colour, so muted text moves to the new `.text-muted` (`--pc-text-color-2`). `.text-muted` follows the theme's text hierarchy in dark mode; the role colour doesn't.
- **Theming — item-state tokens** — new `--base-highlighted-*` (bg / bg-hover / text-color / outline) and `--base-focused-*` tokens, plus `--base-outline-width`, mirrored from the contract. They give one shared look for the selected set and the keyboard cursor in list options, tree rows and grid rows. The primary-derived defaults track `--base-primary-color` live.
- **Sass — one configurable module, no `@import`** — the variable layer is loaded with `@use` / `@forward` (`variables/_index.scss` forwards `base`, `typography`, `spacing`, `colors`, `layout`, `system`), so pure-css builds with zero deprecation warnings and is ready for Dart Sass 3, which removes `@import`. A theme now configures the vocabulary once — `@use '…/variables' with (…)` — and every entry point, including the full `pure-css` bundle, gets those values. This also fixes a silent bug: under `@import`, the shell partials (navbar, sidebar, layout) loaded the variables as a separate module and ignored a theme's Sass overrides. **Breaking for Sass themes:** the old layer recipe (`$base-*` set, then `@import 'base-css-variables'`) now fails to compile ("both define a variable"), and `@import`-ing the bundle ignores the override — move to `@use … with`. The compiled `dist/css` is byte-identical.
- **Theming — control outlines, focus halo, footer text** — `--base-input-border-color` is no longer the divider hairline: it mixes `--base-text-color-1` 45% / 35% (light / dark) into `--base-main-bg`, about 2–3.4:1 against the surface, and `--base-checkbox-border-color` follows it, so fields and outline buttons stay visible while `--base-border-color` stays the quiet divider. The new `--base-input-shadow-color-focus` / `--base-input-box-shadow-focus` give the focus halo its own 5% tone instead of the fill tint. In the shell, `.pc-layout__footer` reads an optional `--pc-footer-text`, and `.pc-footer__muted` (optional `--pc-footer-text-secondary`, else 80% of the footer's text) replaces page utilities for version and build lines on coloured footers.
- **Theming — dead and duplicate tokens removed** — removed: `--base-<role>-bg` (copies of `-color`), `-text-light`, `-border`, `-bg-light` (the single role tint is now `-bg-subtle`), `--base-inverse-bg`, `--base-text-inverted`, `--base-tooltip-color`, and the four extraction leftovers `--base-hover-overlay` / `--base-active-overlay` / `--base-focus-ring-*`. `scripts/check-base-parity.mjs` no longer needs an allow-list: pure-css's emitted `--base-*` now matches the canonical contract exactly.

## What's New in 1.3.0-rc01

- **Shell — `sidebar-flyout.js`, viewport-aware positioning for collapsed submenu flyouts** — in icon-collapse mode the rail's submenu flyouts were pure CSS (`position: absolute; top: 0` relative to their item) with no collision detection, so a flyout on an item low in a tall menu always opened downward and its lower entries were clipped off the bottom of the viewport. The new engine measures the flyout with `getBoundingClientRect` (no Floating-UI dependency, the same hand-positioning approach as `fit.js`) and shifts it up so its bottom edge stays on-screen. When it's taller than the viewport it caps the height and lets the flyout scroll, and when it would overflow the end edge it flips to the start side, honouring RTL via the computed `direction`. It's event-delegated on `document`, so it survives SPA route changes and LiveView DOM patches. It self-inits, only acts while `body.sidebar-hidden` is set, and is registered at `pureCss.components.sidebarFlyout` (`init` / `position` / `clearAll`).
- **Shell — collapsed-rail flyouts read as elevated floating cards** — the flyouts used the sunken `--base-subtle-bg` tone, which on dark themes was actually darker than the rail, plus a weak shadow and an attached three-sided border, so they looked like a muted extension of the sidebar. They now float: two new opt-in tokens, `--pc-sidebar-flyout-bg` (falls back to `--base-main-bg`) and `--pc-sidebar-flyout-text` (falls back to `--base-text-color-1`), give a lifted surface with paired readable text. An 8% white elevation film keeps the panel lighter than the rail even when theme surface tones are close. A full rounded border and a pronounced `0 12px 32px rgba(0,0,0,.5)` shadow make it read as a detached card on dark themes too.
- **Shell — hover-intent grace on collapsed flyouts** — flyouts toggled `display: none ↔ block`, which can't transition, so the menu vanished the instant the cursor left the trigger's hitbox and there was no way to travel onto it. They now hide via `visibility` / `opacity` with a ~0.4s hide delay and show with zero delay, and hovering the flyout itself still keeps it open (`_sidebar-states.scss`).
- **Shell — submenus keep full reading size at every depth** — levels 2 and 3 (and the collapsed-rail flyouts, including the nested level-3 flyout) stepped the text down `base → md → sm → xs` (16 → 15 → 14 → 12px), which made multilevel flyouts hard to read. Indentation already conveys depth, so every submenu level now uses `$font-size-base` (`_sidebar.scss`, `_sidebar-states.scss`).

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
interactive and item states (hover, active, highlighted, focused), shadow, palette slots, typography,
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
