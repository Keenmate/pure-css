# Pure CSS — Foundation Catalog

> **Auto-generated** by `scripts/build-catalog.mjs` from the compiled bundles.
> Do not edit by hand — re-run `npm run catalog` (after `npm run build`) when any `pc-*` class or utility changes.
> Machine-readable form: [`components.json`](./components.json).

Package version **1.2.0** · **11** pc-* components · **381** pc-* selectors · **718** utility classes.

This is the pure-css half of the wrapper-fidelity contract: the foundation (`pc-*` grid + app-shell + engines, and the unprefixed utility classes) that the pure-admin catalog intentionally does **not** track. The svelte / phoenix wrappers validate the non-`pa-*` classes they emit against this catalog.

## pc-* components

| Component | Block | Category | Selectors |
|---|---|---|--:|
| Grid | `pc-row` | Grid | 290 |
| Layout scaffold | `pc-layout` | Layout & shell | 9 |
| Navbar & headers | `pc-navbar` | Layout & shell | 21 |
| Sidebar | `pc-sidebar` | Layout & shell | 22 |
| Footer | `pc-footer` | Layout & shell | 4 |
| Width containers | `pc-container` | Layout & shell | 5 |
| Fit (overflow engine) | `pc-fit` | Engines & state hooks | 6 |
| Responsive visibility | `pc-hide` | Engines & state hooks | 18 |
| Colour mode | `pc-mode` | Engines & state hooks | 2 |
| Container query context | `pc-cq` | Engines & state hooks | 1 |
| Icon hover | `pc-icon-hover` | Icon | 3 |

## Grid

### Grid — `pc-row`

Flexbox grid: pc-row container with pc-col auto / pc-col-auto content-width / pc-col-{5..100} percentage / fraction columns, responsive pc-col-{sm,md,lg,xl}-*, and pc-offset-* spacers. Wrappers emit these from <Column size md…> props.

- **Blocks & variants:** `pc-col`, `pc-col-1-12`, `pc-col-1-2`, `pc-col-1-3`, `pc-col-1-4`, `pc-col-1-5`, `pc-col-1-6`, `pc-col-10`, `pc-col-100`, `pc-col-11-12`, `pc-col-15`, `pc-col-2-3`, `pc-col-2-5`, `pc-col-20`, `pc-col-25`, `pc-col-3-4`, `pc-col-3-5`, `pc-col-30`, `pc-col-35`, `pc-col-4-5`, `pc-col-40`, `pc-col-45`, `pc-col-5`, `pc-col-5-12`, `pc-col-5-6`, `pc-col-50`, `pc-col-55`, `pc-col-60`, `pc-col-65`, `pc-col-7-12`, `pc-col-70`, `pc-col-75`, `pc-col-80`, `pc-col-85`, `pc-col-90`, `pc-col-95`, `pc-col-auto`, `pc-col-lg-1-12`, `pc-col-lg-1-2`, `pc-col-lg-1-3`, `pc-col-lg-1-4`, `pc-col-lg-1-5`, `pc-col-lg-1-6`, `pc-col-lg-10`, `pc-col-lg-100`, `pc-col-lg-11-12`, `pc-col-lg-15`, `pc-col-lg-2-3`, `pc-col-lg-2-5`, `pc-col-lg-20`, `pc-col-lg-25`, `pc-col-lg-3-4`, `pc-col-lg-3-5`, `pc-col-lg-30`, `pc-col-lg-35`, `pc-col-lg-4-5`, `pc-col-lg-40`, `pc-col-lg-45`, `pc-col-lg-5`, `pc-col-lg-5-12`, `pc-col-lg-5-6`, `pc-col-lg-50`, `pc-col-lg-55`, `pc-col-lg-60`, `pc-col-lg-65`, `pc-col-lg-7-12`, `pc-col-lg-70`, `pc-col-lg-75`, `pc-col-lg-80`, `pc-col-lg-85`, `pc-col-lg-90`, `pc-col-lg-95`, `pc-col-lg-auto`, `pc-col-md-1-12`, `pc-col-md-1-2`, `pc-col-md-1-3`, `pc-col-md-1-4`, `pc-col-md-1-5`, `pc-col-md-1-6`, `pc-col-md-10`, `pc-col-md-100`, `pc-col-md-11-12`, `pc-col-md-15`, `pc-col-md-2-3`, `pc-col-md-2-5`, `pc-col-md-20`, `pc-col-md-25`, `pc-col-md-3-4`, `pc-col-md-3-5`, `pc-col-md-30`, `pc-col-md-35`, `pc-col-md-4-5`, `pc-col-md-40`, `pc-col-md-45`, `pc-col-md-5`, `pc-col-md-5-12`, `pc-col-md-5-6`, `pc-col-md-50`, `pc-col-md-55`, `pc-col-md-60`, `pc-col-md-65`, `pc-col-md-7-12`, `pc-col-md-70`, `pc-col-md-75`, `pc-col-md-80`, `pc-col-md-85`, `pc-col-md-90`, `pc-col-md-95`, `pc-col-md-auto`, `pc-col-sm-1-12`, `pc-col-sm-1-2`, `pc-col-sm-1-3`, `pc-col-sm-1-4`, `pc-col-sm-1-5`, `pc-col-sm-1-6`, `pc-col-sm-10`, `pc-col-sm-100`, `pc-col-sm-11-12`, `pc-col-sm-15`, `pc-col-sm-2-3`, `pc-col-sm-2-5`, `pc-col-sm-20`, `pc-col-sm-25`, `pc-col-sm-3-4`, `pc-col-sm-3-5`, `pc-col-sm-30`, `pc-col-sm-35`, `pc-col-sm-4-5`, `pc-col-sm-40`, `pc-col-sm-45`, `pc-col-sm-5`, `pc-col-sm-5-12`, `pc-col-sm-5-6`, `pc-col-sm-50`, `pc-col-sm-55`, `pc-col-sm-60`, `pc-col-sm-65`, `pc-col-sm-7-12`, `pc-col-sm-70`, `pc-col-sm-75`, `pc-col-sm-80`, `pc-col-sm-85`, `pc-col-sm-90`, `pc-col-sm-95`, `pc-col-sm-auto`, `pc-col-xl-1-12`, `pc-col-xl-1-2`, `pc-col-xl-1-3`, `pc-col-xl-1-4`, `pc-col-xl-1-5`, `pc-col-xl-1-6`, `pc-col-xl-10`, `pc-col-xl-100`, `pc-col-xl-11-12`, `pc-col-xl-15`, `pc-col-xl-2-3`, `pc-col-xl-2-5`, `pc-col-xl-20`, `pc-col-xl-25`, `pc-col-xl-3-4`, `pc-col-xl-3-5`, `pc-col-xl-30`, `pc-col-xl-35`, `pc-col-xl-4-5`, `pc-col-xl-40`, `pc-col-xl-45`, `pc-col-xl-5`, `pc-col-xl-5-12`, `pc-col-xl-5-6`, `pc-col-xl-50`, `pc-col-xl-55`, `pc-col-xl-60`, `pc-col-xl-65`, `pc-col-xl-7-12`, `pc-col-xl-70`, `pc-col-xl-75`, `pc-col-xl-80`, `pc-col-xl-85`, `pc-col-xl-90`, `pc-col-xl-95`, `pc-col-xl-auto`, `pc-offset-10`, `pc-offset-15`, `pc-offset-20`, `pc-offset-25`, `pc-offset-30`, `pc-offset-35`, `pc-offset-40`, `pc-offset-45`, `pc-offset-5`, `pc-offset-50`, `pc-offset-55`, `pc-offset-60`, `pc-offset-65`, `pc-offset-70`, `pc-offset-75`, `pc-offset-80`, `pc-offset-85`, `pc-offset-90`, `pc-offset-95`, `pc-offset-lg-10`, `pc-offset-lg-15`, `pc-offset-lg-20`, `pc-offset-lg-25`, `pc-offset-lg-30`, `pc-offset-lg-35`, `pc-offset-lg-40`, `pc-offset-lg-45`, `pc-offset-lg-5`, `pc-offset-lg-50`, `pc-offset-lg-55`, `pc-offset-lg-60`, `pc-offset-lg-65`, `pc-offset-lg-70`, `pc-offset-lg-75`, `pc-offset-lg-80`, `pc-offset-lg-85`, `pc-offset-lg-90`, `pc-offset-lg-95`, `pc-offset-md-10`, `pc-offset-md-15`, `pc-offset-md-20`, `pc-offset-md-25`, `pc-offset-md-30`, `pc-offset-md-35`, `pc-offset-md-40`, `pc-offset-md-45`, `pc-offset-md-5`, `pc-offset-md-50`, `pc-offset-md-55`, `pc-offset-md-60`, `pc-offset-md-65`, `pc-offset-md-70`, `pc-offset-md-75`, `pc-offset-md-80`, `pc-offset-md-85`, `pc-offset-md-90`, `pc-offset-md-95`, `pc-offset-sm-10`, `pc-offset-sm-15`, `pc-offset-sm-20`, `pc-offset-sm-25`, `pc-offset-sm-30`, `pc-offset-sm-35`, `pc-offset-sm-40`, `pc-offset-sm-45`, `pc-offset-sm-5`, `pc-offset-sm-50`, `pc-offset-sm-55`, `pc-offset-sm-60`, `pc-offset-sm-65`, `pc-offset-sm-70`, `pc-offset-sm-75`, `pc-offset-sm-80`, `pc-offset-sm-85`, `pc-offset-sm-90`, `pc-offset-sm-95`, `pc-offset-xl-10`, `pc-offset-xl-15`, `pc-offset-xl-20`, `pc-offset-xl-25`, `pc-offset-xl-30`, `pc-offset-xl-35`, `pc-offset-xl-40`, `pc-offset-xl-45`, `pc-offset-xl-5`, `pc-offset-xl-50`, `pc-offset-xl-55`, `pc-offset-xl-60`, `pc-offset-xl-65`, `pc-offset-xl-70`, `pc-offset-xl-75`, `pc-offset-xl-80`, `pc-offset-xl-85`, `pc-offset-xl-90`, `pc-offset-xl-95`, `pc-row`
- **Modifiers / states:** `pc-col--grow`, `pc-col--no-padding`, `pc-col--shrink`, `pc-row--around`, `pc-row--between`, `pc-row--bottom`, `pc-row--center`, `pc-row--end`, `pc-row--middle`, `pc-row--no-gutter`, `pc-row--same-height`, `pc-row--stretch`, `pc-row--top`
- **SCSS:** `_pa-grid.scss`

## Layout & shell

### Layout scaffold — `pc-layout`

App shell scaffold: the pc-layout grid (inner / main / content / sidebar / footer regions) with sticky + icon-collapse modifiers.

- **Blocks & variants:** `pc-layout`
- **Elements:** `pc-layout__content`, `pc-layout__footer`, `pc-layout__inner`, `pc-layout__main`, `pc-layout__sidebar`, `pc-layout__sidebar__nav`
- **Modifiers / states:** `pc-layout--sticky`, `pc-layout__sidebar--icon-collapse`
- **SCSS:** `_layout-container.scss`, `_layout-responsive.scss`, `_sidebar-states.scss`, `_sidebar.scss`

### Navbar & headers — `pc-navbar`

Top navbar (start / center / end, burger, inner, profile button), the navbar search pill, the nav menu, and the app-header / page-header regions.

- **Blocks & variants:** `pc-app-header`, `pc-navbar`, `pc-navbar-search`, `pc-navmenu`, `pc-page-header`
- **Elements:** `pc-app-header__version`, `pc-navbar__burger`, `pc-navbar__center`, `pc-navbar__end`, `pc-navbar__inner`, `pc-navbar__profile-btn`, `pc-navbar__start`, `pc-navmenu__dropdown`, `pc-navmenu__link`, `pc-navmenu__more-chevron`, `pc-navmenu__more-menu`
- **Modifiers / states:** `pc-navmenu__dropdown--level2`, `pc-navmenu__item--active`, `pc-navmenu__item--has-dropdown`, `pc-navmenu__item--more`, `pc-navmenu__more-menu--open`
- **SCSS:** `_layout-responsive.scss`, `_navbar-elements.scss`, `_navbar.scss`

### Sidebar — `pc-sidebar`

Collapsible sidebar (item / link / label / icon / chevron / submenu / toggle / search) with the resize handle and resized / resizing state hooks.

- **Blocks & variants:** `pc-sidebar-resize`, `pc-sidebar-resized`, `pc-sidebar-resizing`
- **Elements:** `pc-sidebar__chevron`, `pc-sidebar__divider`, `pc-sidebar__icon`, `pc-sidebar__item`, `pc-sidebar__label`, `pc-sidebar__link`, `pc-sidebar__nav`, `pc-sidebar__search`, `pc-sidebar__search-field`, `pc-sidebar__search-icon`, `pc-sidebar__section`, `pc-sidebar__submenu`, `pc-sidebar__toggle`
- **Modifiers / states:** `pc-sidebar-resize--active`, `pc-sidebar__item--open`, `pc-sidebar__link--active`, `pc-sidebar__search--input`, `pc-sidebar__submenu--open`, `pc-sidebar__toggle--active`
- **SCSS:** `_icon-hover.scss`, `_layout-responsive.scss`, `_sidebar-states.scss`, `_sidebar.scss`

### Footer — `pc-footer`

App footer with start / center / end regions.

- **Blocks & variants:** —
- **Elements:** `pc-footer__center`, `pc-footer__end`, `pc-footer__start`
- **Modifiers / states:** `pc-footer__end--vertical`
- **SCSS:** `_layout-container.scss`

### Width containers — `pc-container`

Max-width content containers at each breakpoint (sm / md / lg / xl / 2xl).

- **Blocks & variants:** `pc-container-2xl`, `pc-container-lg`, `pc-container-md`, `pc-container-sm`, `pc-container-xl`
- **SCSS:** —

## Engines & state hooks

### Fit (overflow engine) — `pc-fit`

The fit degradation engine's self-contained "•••" overflow flyout (relocation target for data-pc-fit-target="floating-menu") plus the pc-fit-hidden state class the engine toggles.

- **Blocks & variants:** `pc-fit-hidden`
- **Elements:** `pc-fit-flyout__dots`, `pc-fit-flyout__item`, `pc-fit-flyout__panel`, `pc-fit-flyout__trigger`
- **Modifiers / states:** `pc-fit-flyout__panel--open`
- **SCSS:** `_fit-flyout.scss`, `_navbar-elements.scss`

### Responsive visibility — `pc-hide`

Breakpoint show / hide hooks: pc-hide / pc-show, their per-breakpoint and -below variants.

- **Blocks & variants:** `pc-hide`, `pc-hide-below-lg`, `pc-hide-below-md`, `pc-hide-below-sm`, `pc-hide-below-xl`, `pc-hide-lg`, `pc-hide-md`, `pc-hide-sm`, `pc-hide-xl`, `pc-show`, `pc-show-below-lg`, `pc-show-below-md`, `pc-show-below-sm`, `pc-show-below-xl`, `pc-show-lg`, `pc-show-md`, `pc-show-sm`, `pc-show-xl`
- **SCSS:** `_pa-grid.scss`

### Colour mode — `pc-mode`

Light / dark mode root hooks (pc-mode-light / pc-mode-dark) that select which --pc-* / --base-* value set applies.

- **Blocks & variants:** `pc-mode-dark`, `pc-mode-light`
- **SCSS:** `_base-css-variables.scss`

### Container query context — `pc-cq`

Marks an element as a container-query context so descendant components can respond to the element's width rather than the viewport.

- **Blocks & variants:** `pc-cq`
- **SCSS:** `utilities.scss`

## Icon

### Icon hover — `pc-icon-hover`

Per-set icon hover strategy hooks: pc-icon-hover with -fill / -highlight variants (FA weight-flip / recolour / two-asset swap configured per icon set).

- **Blocks & variants:** `pc-icon-hover`, `pc-icon-hover-fill`, `pc-icon-hover-highlight`
- **SCSS:** `_icon-hover.scss`

## Utilities

**718** unprefixed utility classes across **21** families (harvested from compiled `dist/css/utilities.css`). Full per-class list in [`components.json`](./components.json) → `utilities.classes`.

| Family | Count | Examples |
|---|--:|---|
| background (palette) | 9 | `bg-color-1`, `bg-color-2`, `bg-color-3`, `bg-color-4`, `bg-color-5`, `bg-color-6` … |
| background (role / named) | 5 | `bg-danger`, `bg-info`, `bg-primary`, `bg-success`, `bg-warning` |
| border (width / side / style / colour) | 14 | `border`, `border-0`, `border-bottom`, `border-bottom-0`, `border-dashed`, `border-dotted` … |
| border colour (palette) | 9 | `border-color-1`, `border-color-2`, `border-color-3`, `border-color-4`, `border-color-5`, `border-color-6` … |
| border radius | 8 | `rounded`, `rounded-0`, `rounded-bottom`, `rounded-circle`, `rounded-left`, `rounded-lg` … |
| box shadow | 4 | `shadow`, `shadow-lg`, `shadow-none`, `shadow-sm` |
| display | 6 | `d-block`, `d-flex`, `d-inline`, `d-inline-block`, `d-inline-flex`, `d-none` |
| flexbox | 25 | `align-items-baseline`, `align-items-center`, `align-items-end`, `align-items-start`, `align-items-stretch`, `flex-1` … |
| font family | 4 | `font-family-mono`, `font-family-sans`, `font-family-serif`, `font-family-system` |
| gap | 36 | `gap-0`, `gap-1`, `gap-10`, `gap-12`, `gap-16`, `gap-2` … |
| height (incl. min / max, rem + viewport) | 125 | `h-1-2`, `h-1-3`, `h-1-4`, `h-100`, `h-2-3`, `h-25` … |
| margin | 140 | `m-0`, `m-1`, `m-10`, `m-12`, `m-16`, `m-2` … |
| padding | 133 | `p-0`, `p-1`, `p-10`, `p-12`, `p-16`, `p-2` … |
| position | 5 | `position-absolute`, `position-fixed`, `position-relative`, `position-static`, `position-sticky` |
| surface (palette) | 9 | `surface-color-1`, `surface-color-2`, `surface-color-3`, `surface-color-4`, `surface-color-5`, `surface-color-6` … |
| surface (role / named) | 5 | `surface-danger`, `surface-info`, `surface-primary`, `surface-success`, `surface-warning` |
| text (colour / alignment / wrap) | 12 | `text-body`, `text-caption`, `text-center`, `text-danger`, `text-info`, `text-lead` … |
| text colour (palette) | 9 | `text-color-1`, `text-color-2`, `text-color-3`, `text-color-4`, `text-color-5`, `text-color-6` … |
| text-on (palette contrast) | 9 | `text-on-color-1`, `text-on-color-2`, `text-on-color-3`, `text-on-color-4`, `text-on-color-5`, `text-on-color-6` … |
| text-on (role contrast) | 5 | `text-on-danger`, `text-on-info`, `text-on-primary`, `text-on-success`, `text-on-warning` |
| width (incl. min / max, rem variants) | 146 | `maxw-1-2`, `maxw-1-3`, `maxw-1-4`, `maxw-10`, `maxw-100`, `maxw-15` … |
