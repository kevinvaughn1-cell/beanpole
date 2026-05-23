# Beanpole Site Layout Redesign

**Date:** 2026-05-23  
**Status:** Approved  

## Overview

Redesign the home page layout to surface GEO content (bio, track list, social links) without cluttering the minimal patch-image aesthetic. The patch stays as the hero. Content is accessible via a pull-up drawer. Social icons move above the patch.

---

## Layout

### Static state (drawer closed)

From top to bottom, all elements are horizontally centered:

1. **Social icons row** — fixed, centered, just above the vertical midpoint of the patch image. Five icons: Facebook, Instagram, Spotify, Apple Music, YouTube. Same 32px SVG gold icons as current implementation.
2. **Patch background image** — full-screen, unchanged.
3. **Drawer handle bar** — fixed, centered, above the player controls. Thin bar showing `▲ BEANPOLE` in Space Mono, gold, uppercase. This is the tap/click target to open the drawer.
4. **Player controls** — fixed at bottom. Unchanged (prev / play / next SVG icons).

### Open state (drawer open)

- Drawer slides up from the bottom, covering ~85% of the screen height.
- A sliver (~15%) of the patch image remains visible above the drawer — serves as a visual "tap to close" affordance.
- Player controls are hidden behind the drawer when open (covered, not removed from DOM).
- Drawer handle text changes to `▼ BEANPOLE` while open.

---

## Drawer

### Appearance

- Background: `rgba(8, 8, 7, 0.97)`
- Top border: `1px solid rgba(196, 149, 10, 0.4)`
- Top of drawer has a drag handle pill (decorative, centered) and `▼ BEANPOLE` label + `✕` close button on the right
- Font: Space Mono throughout
- Text colors: gold `rgba(196, 149, 10, ...)` for headings/labels, cream `rgba(235, 221, 177, ...)` for body

### Content (top to bottom inside drawer)

1. **Header bar** — `▼ BEANPOLE` on the left, `✕` on the right. Clicking either closes the drawer.
2. **Bio section** — Band description paragraph. "Beanpole is a Memphis rock band: big hooks, alternative edge, Americana grit, swamp in the blood. Active since 1992 and streaming everywhere."
3. **Tracks section** — `TRACKS` label, track list in two columns (14 tracks from the existing playlist).
4. **Links section** — `FIND US` label, social platform links as text (Facebook, Instagram, Spotify, Apple Music, YouTube) with the same URLs already in the codebase.

### Open/close mechanics

- **Open:** Click/tap the drawer handle bar
- **Close:** Click/tap the `✕` button, click the patch sliver above the drawer, or press Escape
- **Animation:** CSS `transform: translateY()` transition, `0.35s ease`. No JS animation libraries.
- **Scroll:** Drawer content is scrollable (`overflow-y: auto`) if it exceeds the drawer height on small screens.

---

## Social Icons

- Removed from current fixed bottom position (above player controls).
- Repositioned: fixed, centered horizontally, placed so they sit visually just above the patch badge.
  - CSS: `position: fixed; bottom: 52vh; left: 50%; transform: translateX(calc(-50% - 8px));` — keeps the existing horizontal nudge and places icons just above the visual center of the patch.
- When the drawer is open, icons are covered by the drawer (no special handling needed — they're just behind it).
- Social links are also duplicated as text links inside the drawer (Links section) so they remain accessible when the drawer is open.

---

## GEO / Crawlability

All content (bio, track list, social links) remains in the DOM at all times. The drawer uses CSS `transform` for show/hide — content is never `display:none` or `visibility:hidden`. Crawlers read the full content regardless of drawer state.

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Remove `.siteContent` panels; add drawer markup; reposition social icons; add drawer handle |
| `css/style.css` | Remove layout/panel CSS added in recent commit; add drawer styles; update social icon position |
| `js/main.js` | Add drawer open/close toggle logic (class-based, no new dependencies) |

---

## Out of Scope

- No changes to the audio player logic
- No changes to OG/schema/meta tags
- No new pages
- No mobile-specific breakpoints beyond ensuring the drawer is usable on small screens (scrollable content)
