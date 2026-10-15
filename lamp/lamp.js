// Hanging lamp — pull the string to switch the page between light and dark.
// Saved from duckweather. Sets data-theme="light" / "dark" on <html> and remembers
// the choice; the page's own CSS can key its dark colors off the same attribute.
(() => {
  const lamp = document.getElementById("lamp");
  if (!lamp) return;

  const root = document.documentElement;
  const STORE_KEY = "lamp.theme";
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // An explicit choice (set by the lamp) wins; otherwise follow the OS.
  const currentTheme = () => root.dataset.theme || (darkQuery.matches ? "dark" : "light");

  function syncLabel() {
    lamp.setAttribute("aria-label", currentTheme() === "light" ? "Turn the light off" : "Turn the light on");
  }

  lamp.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem(STORE_KEY, next); } catch { /* private mode etc. */ }
      syncLabel();
    };

    // Cross-fade the whole page where the browser supports it; otherwise switch instantly.
    if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(apply);
    else apply();

    lamp.classList.remove("tug");
    void lamp.offsetWidth; // restart the tug animation on quick repeat pulls
    lamp.classList.add("tug");
  });

  lamp.addEventListener("animationend", (e) => {
    if (e.animationName === "lamp-tug") lamp.classList.remove("tug");
  });
  darkQuery.addEventListener("change", syncLabel);
  syncLabel();
})();
