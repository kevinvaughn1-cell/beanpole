# Layout Redesign: Pull-Up Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the messy uncommitted content-panel layout with a pull-up drawer for GEO content and reposition social icons just above the patch badge.

**Architecture:** Three files change. `index.html` gets stripped of `.siteContent` panels and replaced with a drawer div + handle bar. `css/style.css` loses all the panel/grid layout CSS and gains drawer + repositioned social icon styles. `js/main.js` gains a drawer open/close toggle. All text content stays in the DOM at all times (CSS `transform`, never `display:none`) so crawlers see it regardless of drawer state.

**Tech Stack:** Vanilla HTML/CSS/JS, Space Mono font, no new dependencies.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `index.html` | Modify | Remove `.siteContent` / panel markup; add `#drawerHandle`; add `#infoDrawer` with bio, tracks, links |
| `css/style.css` | Modify | Remove 190+ lines of panel/grid CSS; add `#drawerHandle`, `#infoDrawer`, and updated `#socialLinks` position |
| `js/main.js` | Modify | Add `openDrawer()`, `closeDrawer()`, wire to handle/X/bgImg/Escape |

---

## Task 1: Reset uncommitted CSS and HTML to last commit, keep llms.txt

The current working tree has ~311 lines of uncommitted changes to `index.html` and `css/style.css` adding content panels, grid layout, gradient overlays, and responsive breakpoints. These are replaced wholesale by the drawer design. Discard them cleanly.

**Files:**
- Modify: `index.html` (discard uncommitted changes)
- Modify: `css/style.css` (discard uncommitted changes)

- [ ] **Step 1: Verify current state**

```bash
git diff --stat HEAD
```

Expected output shows `index.html` and `css/style.css` modified, `llms.txt` modified. Confirm `llms.txt` changes are intentional (disambiguation text + beanpolemusic.com URL) before discarding — those we keep.

- [ ] **Step 2: Reset only the HTML and CSS**

```bash
git checkout HEAD -- index.html css/style.css
```

- [ ] **Step 3: Verify clean baseline**

```bash
git diff --stat HEAD
```

Expected: only `llms.txt` shows as modified. `index.html` and `css/style.css` are clean.

- [ ] **Step 4: Confirm site still loads**

Refresh `http://localhost:8080` — should show the patch image with gold player controls and social icons near the bottom. No content panels.

---

## Task 2: Add drawer and handle markup to index.html

Add the `#drawerHandle` bar (the tap target) and the `#infoDrawer` div (hidden until opened). Both go between the `#socialLinks` div and the `#playerControls` div. The drawer contains all GEO text content.

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the drawer handle and drawer div**

Replace this block in `index.html`:

```html
  <div id="socialLinks">
```

…leave the social links div and playerControls as-is, but insert the following **between** `</div>` (end of `#socialLinks`) and `<div id="playerControls">`:

```html
  <!-- Drawer handle -->
  <div id="drawerHandle" role="button" tabindex="0" aria-expanded="false" aria-controls="infoDrawer">
    <span id="drawerHandleLabel">▲ BEANPOLE</span>
  </div>

  <!-- Pull-up info drawer -->
  <div id="infoDrawer" aria-hidden="true">
    <div id="drawerHeader">
      <button id="drawerClose" aria-label="Close drawer">▼ BEANPOLE</button>
      <button id="drawerX" aria-label="Close drawer">✕</button>
    </div>
    <div id="drawerContent">
      <section class="drawerSection" aria-label="About Beanpole">
        <p>Beanpole is a Memphis rock band: big hooks, alternative edge, Americana grit, swamp in the blood. Active since 1992 and streaming everywhere.</p>
        <p>This is the official site for Beanpole, the Memphis rock band — distinct from other artists and music projects using the Beanpole name.</p>
      </section>
      <section class="drawerSection" aria-label="Track list">
        <h2>TRACKS</h2>
        <ul class="drawerTracks">
          <li>Fall Over Me</li>
          <li>Changed</li>
          <li>Rain</li>
          <li>Lackluster</li>
          <li>Breakdown</li>
          <li>Burn Out</li>
          <li>Bruce Lee</li>
          <li>She's Gone to Dallas</li>
          <li>Exit 303</li>
          <li>Shacked Up in Durango</li>
          <li>Ask Him</li>
          <li>Kalifornia</li>
          <li>Shoes</li>
          <li>Bobby</li>
        </ul>
      </section>
      <section class="drawerSection" aria-label="Find Beanpole online">
        <h2>FIND US</h2>
        <ul class="drawerLinks">
          <li><a href="https://www.facebook.com/beanpolememphis" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="https://www.instagram.com/beanpolemopo/" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://open.spotify.com/artist/4FVH4LNDXH0OlN2KeBn3Eo" target="_blank" rel="noopener">Spotify</a></li>
          <li><a href="https://music.apple.com/us/artist/beanpole/1896580611" target="_blank" rel="noopener">Apple Music</a></li>
          <li><a href="https://www.youtube.com/@beanpole520" target="_blank" rel="noopener">YouTube</a></li>
        </ul>
      </section>
    </div>
  </div>
```

- [ ] **Step 2: Verify HTML is valid**

```bash
grep -c "id=" index.html
```

Expected: 10 or more (bgImg, audio, playerControls, prevBtn, toggleBtn, nextBtn, socialLinks, drawerHandle, infoDrawer, drawerHeader, drawerClose, drawerX, drawerContent). No parse errors visible in browser console.

---

## Task 3: Reposition social icons in CSS

The social icons need to move from their current bottom position (above the player) to just above the patch badge center. Also add `overflow: hidden` back to body to prevent any scroll bleed.

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Update `#socialLinks` position**

Find this rule in `css/style.css`:

```css
#socialLinks {
  position: fixed;
  bottom: 5.5rem;
  left: 50%;
  transform: translateX(calc(-50% - 8px));
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.4rem;
}
```

Replace with:

```css
#socialLinks {
  position: fixed;
  bottom: 52vh;
  left: 50%;
  transform: translateX(calc(-50% - 8px));
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.4rem;
}
```

- [ ] **Step 2: Verify in browser**

Refresh `http://localhost:8080`. Social icons should now float roughly centered vertically on the page, visually just above the patch badge. Player controls still at the bottom. No other changes visible yet.

---

## Task 4: Add drawer and handle CSS

Add all styles for `#drawerHandle`, `#infoDrawer`, and its child elements. The drawer is hidden off-screen via `transform: translateY(100%)` and revealed with `transform: translateY(0)` when the `open` class is applied.

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append drawer styles to the end of `css/style.css`**

```css
/* ── Drawer handle ── */
#drawerHandle {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  cursor: pointer;
  padding: 0.4rem 1rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(196, 149, 10, 0.55);
  border: 1px solid rgba(196, 149, 10, 0.2);
  transition: color 0.3s, border-color 0.3s;
  white-space: nowrap;
}

#drawerHandle:hover {
  color: rgba(196, 149, 10, 0.9);
  border-color: rgba(196, 149, 10, 0.5);
}

/* ── Info drawer ── */
#infoDrawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 85vh;
  transform: translateY(100%);
  transition: transform 0.35s ease;
  z-index: 25;
  background: rgba(8, 8, 7, 0.97);
  border-top: 1px solid rgba(196, 149, 10, 0.4);
  display: flex;
  flex-direction: column;
}

#infoDrawer.open {
  transform: translateY(0);
}

#drawerHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(196, 149, 10, 0.15);
  flex-shrink: 0;
}

#drawerClose,
#drawerX {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Space Mono', monospace;
  color: rgba(196, 149, 10, 0.6);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.2s;
}

#drawerClose {
  font-size: 0.55rem;
}

#drawerX {
  font-size: 1rem;
  padding: 0 0.25rem;
}

#drawerClose:hover,
#drawerX:hover {
  color: rgba(196, 149, 10, 1);
}

#drawerContent {
  overflow-y: auto;
  padding: 1.25rem;
  flex: 1;
}

.drawerSection {
  margin-bottom: 1.75rem;
}

.drawerSection p {
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  line-height: 1.65;
  color: rgba(235, 221, 177, 0.7);
  margin-bottom: 0.6rem;
}

.drawerSection h2 {
  font-family: 'Space Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(196, 149, 10, 0.75);
  font-weight: 400;
  margin-bottom: 0.75rem;
}

.drawerTracks {
  list-style: none;
  columns: 2;
  column-gap: 1.5rem;
}

.drawerTracks li {
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  color: rgba(235, 221, 177, 0.5);
  line-height: 1.8;
  break-inside: avoid;
}

.drawerLinks {
  list-style: none;
}

.drawerLinks li {
  margin-bottom: 0.5rem;
}

.drawerLinks a {
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  color: rgba(196, 149, 10, 0.65);
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.2s;
}

.drawerLinks a:hover {
  color: rgba(196, 149, 10, 1);
}
```

- [ ] **Step 2: Verify drawer handle is visible**

Refresh `http://localhost:8080`. You should now see a faint `▲ BEANPOLE` bar between the social icons and the player controls. The drawer itself is not visible yet (no JS wired up). Browser console should show no CSS errors.

---

## Task 5: Wire drawer open/close in main.js

Add the drawer toggle logic. Opening adds the `open` class to `#infoDrawer`. Closing removes it. The existing `bgImg` click handler must be updated so that when the drawer is open, a click on the background closes the drawer instead of toggling audio.

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Add drawer references and functions inside the IIFE, after the existing `bgImg` line**

Find this line in `js/main.js`:

```js
  const bgImg   = document.getElementById('bgImg');
```

Add these lines directly after it:

```js
  const drawer       = document.getElementById('infoDrawer');
  const drawerHandle = document.getElementById('drawerHandle');
  const drawerClose  = document.getElementById('drawerClose');
  const drawerX      = document.getElementById('drawerX');
  const handleLabel  = document.getElementById('drawerHandleLabel');
```

- [ ] **Step 2: Add openDrawer and closeDrawer functions**

Find this function in `js/main.js`:

```js
  function toggle() {
```

Add these two functions directly **before** it:

```js
  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerHandle.setAttribute('aria-expanded', 'true');
    handleLabel.textContent = '▼ BEANPOLE';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerHandle.setAttribute('aria-expanded', 'false');
    handleLabel.textContent = '▲ BEANPOLE';
  }

```

- [ ] **Step 3: Update the bgImg click handler to be drawer-aware**

Find this line:

```js
  if (bgImg)   bgImg.addEventListener('click', toggle);
```

Replace it with:

```js
  if (bgImg) bgImg.addEventListener('click', function () {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      toggle();
    }
  });
```

- [ ] **Step 4: Wire handle, close buttons, and Escape key**

Find this block at the bottom of the IIFE (just before the closing `})();`):

```js
  btnPlay.addEventListener('click', toggle);
  if (btnPrev) btnPrev.addEventListener('click', prev);
  if (btnNext) btnNext.addEventListener('click', next);
```

Add these lines after that block:

```js
  if (drawerHandle) drawerHandle.addEventListener('click', openDrawer);
  if (drawerClose)  drawerClose.addEventListener('click', closeDrawer);
  if (drawerX)      drawerX.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
```

- [ ] **Step 5: Verify in browser**

Refresh `http://localhost:8080`.

- Click `▲ BEANPOLE` handle → drawer slides up. Bio, tracks, links visible. Handle label changes to `▼ BEANPOLE`.
- Click `✕` → drawer slides down.
- Reopen drawer → click the visible patch sliver above drawer → drawer slides down.
- Reopen drawer → press Escape → drawer slides down.
- With drawer closed, click background image → audio toggles (existing behavior preserved).

---

## Task 6: Commit everything

- [ ] **Step 1: Stage all changed files**

```bash
git add index.html css/style.css js/main.js llms.txt
```

- [ ] **Step 2: Verify staged files**

```bash
git diff --cached --stat
```

Expected: `index.html`, `css/style.css`, `js/main.js`, `llms.txt` all staged.

- [ ] **Step 3: Commit**

```bash
git commit -m "redesign layout: pull-up drawer + social icons above patch

- Remove content panel layout (siteContent, grid, overlays)
- Add pull-up drawer with bio, track list, and platform links
- Add drawer handle bar between social icons and player
- Reposition social icons to just above the patch badge
- Wire open/close to handle, X button, patch sliver click, and Escape
- All drawer content in DOM at all times for GEO crawlability

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 4: Push**

```bash
git push
```

---

## Verification Checklist

After push, confirm all of the following in the browser:

- [ ] Patch image fills full screen, no visible text panels over it
- [ ] Social icons float above the badge, centered
- [ ] `▲ BEANPOLE` handle bar visible above player controls
- [ ] Clicking handle opens drawer, label flips to `▼ BEANPOLE`
- [ ] Drawer shows bio, track list in two columns, platform links
- [ ] Closing works via: ✕ button, patch sliver click, Escape key
- [ ] Background click with drawer closed still toggles audio
- [ ] Drawer content scrollable if needed on small viewports
- [ ] No JS console errors
