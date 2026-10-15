# Hanging lamp

The pull-string light bulb from duckweather, saved exactly as it looked there. Pull the string (click or tap it) to switch the page between light and dark. The bulb glows and lights up the area around it when it's on, and it goes clear and unlit when it's off.

Open `demo.html` in a browser to see it on its own.

## Files

- `lamp.css`: the lamp's look, its colors in both modes, and its animations. It has its own colors, so it looks the same on any page.
- `lamp.js`: the pull. It switches the theme with a smooth whole-page fade, plays the tug-and-swing, and remembers the choice.
- `demo.html`: a small page showing it working.

## Adding it to a page

1. In `<head>`, link the stylesheet and add the no-flash snippet so a saved choice applies before the page appears:

   ```html
   <link rel="stylesheet" href="lamp/lamp.css">
   <script>
     try {
       const theme = localStorage.getItem("lamp.theme");
       if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
     } catch {}
   </script>
   ```

2. Paste the glow and the lamp inside the element it should hang from. That element needs `position: relative`. The lamp hangs from its top edge, centered.

   ```html
   <div class="lamp-glow" aria-hidden="true"></div>
   <button class="lamp" id="lamp" type="button" aria-label="Turn the light off" title="pull the string">
     <span class="lamp-cord"></span>
     <svg viewBox="0 0 44 58" aria-hidden="true">
       <rect class="socket" x="15" y="1" width="14" height="16" rx="3"/>
       <path class="twine" d="M13.5 4.5Q22 7.5 30.5 4.5M13.5 9Q22 12 30.5 9M13.5 13.5Q22 16.5 30.5 13.5"/>
       <path class="glass" d="M16 17C16 23 7 27 7 39a15 15 0 0 0 30 0c0-12-9-16-9-22z"/>
       <path class="filament" d="M18.5 18v13M25.5 18v13M18.5 31h7M18.5 31q-2.5 6 1.2 7.5 1.8-3.5-1.2-7.5M22 31q-1.8 7 0 8 1.8-1 0-8M25.5 31q2.5 6-1.2 7.5-1.8-3.5 1.2-7.5"/>
     </svg>
   </button>
   ```

3. Before `</body>`, add `<script src="lamp/lamp.js"></script>`.

## Giving the page a dark mode

The lamp switches itself and sets `data-theme="dark"` or `data-theme="light"` on `<html>`, but the page needs its own dark colors to follow it. Put the page's colors in CSS variables and add a dark set the same way `demo.html` does:

```css
:root { --bg: #f5ede1; --ink: #33261d; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #1d1713; --ink: #f3e8da; }
}
:root[data-theme="dark"] { --bg: #1d1713; --ink: #f3e8da; }
```

Until someone pulls the string, the page follows the computer's light/dark setting. After that, their choice is remembered.

## Notes

- To change the lamp's colors, edit the `--lamp-…` variables at the top of `lamp.css`.
- The whole-page fade works in Chrome, Edge and Safari 18+. Other browsers switch instantly.
- When the computer is set to reduce motion, the sway and tug are turned off and the theme switches instantly.
- The cord is 44px long. To hang the bulb lower, change `--cord` on `.lamp`. The bottom of `lamp.css` has the phone sizing duckweather used.
