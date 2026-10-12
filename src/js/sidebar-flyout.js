/**
 * Pure CSS — Sidebar Flyout Positioning
 *
 * Keeps the COLLAPSED icon-rail submenu flyouts inside the viewport. In
 * icon-collapse mode (`body.sidebar-hidden .pc-layout__sidebar--icon-collapse`)
 * a submenu opens as an absolutely-positioned flyout at `inset-inline-start:
 * 100%; top: 0` relative to its item (see `_sidebar-states.scss`). That is pure
 * CSS with NO collision detection, so a flyout on an item near the bottom of a
 * tall menu overflowed below the fold — its lower entries were clipped and
 * unreachable, "always aiming downwards".
 *
 * This engine fixes that WITHOUT a Floating-UI dependency (pure-css ships no
 * external deps — fit.js positions the same way, by hand with
 * getBoundingClientRect). On hover/focus of a collapsed item that owns a
 * submenu it measures the flyout against the viewport and:
 *   • shifts it UP (negative `top`) so its bottom edge stays on-screen;
 *   • if it is taller than the viewport, caps its height and lets it scroll;
 *   • flips it to the START side (`inset-inline-end: 100%`) if it would overflow
 *     the END edge — honouring RTL via the computed `direction`.
 * The adjustment is a per-item inline style, recomputed on every enter, cleared
 * when the sidebar leaves collapsed mode or on viewport resize.
 *
 * Measuring works even before the flyout is shown: the collapsed flyout is
 * hidden with `visibility: hidden` (not `display: none`), so it still has
 * layout and getBoundingClientRect returns its real size.
 *
 * Event-delegated on `document`, so it survives SPA route changes and LiveView
 * DOM patches — load it once, no per-page re-init needed.
 *
 * Public API (pureCss.components.sidebarFlyout): init, position, clearAll.
 */
(function () {
    'use strict';

    var VIEWPORT_MARGIN = 8; // px gap kept between a flyout edge and the viewport
    var bound = false;

    // Collapsed icon-rail mode is the ONLY state with hover flyouts. Outside it
    // (expanded / normal / mobile drawer) submenus are inline accordions and we
    // must not touch their geometry.
    function isCollapsed() {
        return document.body.classList.contains('sidebar-hidden');
    }

    // The direct-child submenu of an item (the flyout this item opens). Not a
    // deep querySelector — a nested submenu belongs to a descendant item.
    function directSubmenu(item) {
        for (var i = 0; i < item.children.length; i++) {
            if (item.children[i].classList &&
                item.children[i].classList.contains('pc-sidebar__submenu')) {
                return item.children[i];
            }
        }
        return null;
    }

    // Drop any inline geometry we set, restoring the stylesheet flyout position.
    function clear(submenu) {
        submenu.style.top = '';
        submenu.style.maxHeight = '';
        submenu.style.overflowY = '';
        submenu.style.insetInlineStart = '';
        submenu.style.insetInlineEnd = '';
    }

    function clearAll() {
        var all = document.querySelectorAll(
            '.pc-layout__sidebar--icon-collapse .pc-sidebar__submenu'
        );
        for (var i = 0; i < all.length; i++) clear(all[i]);
    }

    // Reposition the flyout owned by `item` so it stays within the viewport.
    function position(item) {
        var submenu = directSubmenu(item);
        if (!submenu) return;

        // Only in collapsed icon-rail mode, and only for a flyout actually in a
        // collapsed sidebar. Otherwise make sure we leave no stale inline styles.
        if (!isCollapsed() || !item.closest('.pc-layout__sidebar--icon-collapse')) {
            clear(submenu);
            return;
        }

        // Reset before measuring so a prior adjustment doesn't skew the read.
        clear(submenu);

        var itemRect = item.getBoundingClientRect();
        var menuRect = submenu.getBoundingClientRect(); // real size (visibility:hidden keeps layout)
        var vh = window.innerHeight;
        var vw = window.innerWidth;

        // --- vertical: keep the bottom edge on-screen, cap + scroll if taller ---
        var menuHeight = menuRect.height;
        var naturalTop = itemRect.top; // CSS top:0 → flyout top aligns to item top
        var maxTop = vh - VIEWPORT_MARGIN - menuHeight; // highest viewport top that still fits

        if (menuHeight > vh - VIEWPORT_MARGIN * 2) {
            // Taller than the viewport: pin near the top and scroll inside.
            submenu.style.top = (VIEWPORT_MARGIN - naturalTop) + 'px';
            submenu.style.maxHeight = (vh - VIEWPORT_MARGIN * 2) + 'px';
            submenu.style.overflowY = 'auto';
        } else if (naturalTop > maxTop) {
            // Would spill off the bottom: shift up (negative offset relative to item).
            submenu.style.top = (maxTop - naturalTop) + 'px';
        }
        // else: fits as-is, leave the stylesheet top:0.

        // --- horizontal: flip to the start side if it overflows the end edge ---
        var dir = getComputedStyle(item).direction;
        var endOverflow = dir === 'rtl'
            ? (itemRect.left - menuRect.width < VIEWPORT_MARGIN)       // opens leftwards in RTL
            : (itemRect.right + menuRect.width > vw - VIEWPORT_MARGIN); // opens rightwards in LTR
        if (endOverflow) {
            submenu.style.insetInlineStart = 'auto';
            submenu.style.insetInlineEnd = '100%';
        }
    }

    function onPointer(e) {
        var el = e.target;
        if (!el || !el.closest) return;
        var item = el.closest('.pc-sidebar__item');
        if (item) position(item);
    }

    function init() {
        if (bound) return;
        bound = true;
        // Delegated — fires for current and future items. mouseover + focusin
        // both bubble, covering pointer and keyboard reveal.
        document.addEventListener('mouseover', onPointer);
        document.addEventListener('focusin', onPointer);
        // A viewport change invalidates every cached offset; next hover recomputes.
        if (window.pureCss && window.pureCss.events) {
            window.pureCss.events.on('viewport:resize', clearAll);
        } else {
            window.addEventListener('resize', clearAll);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    var pa = (window.pureCss = window.pureCss || {});
    (pa.components = pa.components || {}).sidebarFlyout = {
        init: init,
        position: position,
        clearAll: clearAll
    };
})();
