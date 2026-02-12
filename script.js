(() => {
  const storageKey = "gtlabs72-theme";
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Ignore storage failures.
    }
  }

  function getEffectiveTheme() {
    const explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return mediaQuery.matches ? "dark" : "light";
  }

  function updateThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) return;
    meta.setAttribute("content", theme === "dark" ? "#0b1020" : "#f5f7fb");
  }

  function updateButtons() {
    const current = getEffectiveTheme();
    const nextLabel = current === "dark" ? "Light" : "Dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = nextLabel;
      button.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()} mode`);
      button.setAttribute("aria-pressed", String(current === "dark"));
    });
    updateThemeColor(current);
  }

  function applyStoredTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      root.setAttribute("data-theme", storedTheme);
    } else {
      root.removeAttribute("data-theme");
    }
    updateButtons();
  }

  function toggleTheme() {
    const current = getEffectiveTheme();
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setStoredTheme(next);
    updateButtons();
  }

  applyStoredTheme();
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });
  mediaQuery.addEventListener("change", () => {
    if (!getStoredTheme()) updateButtons();
  });
})();
