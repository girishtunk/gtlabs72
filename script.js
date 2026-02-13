(() => {
  document.documentElement.classList.add("js");

  const storageKey = "gtlabs72-theme";
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const sunIcon =
    '<svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41"></path></svg>';
  const moonIcon =
    '<svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true"><path d="M20.354 15.354A9 9 0 1 1 8.646 3.646a7 7 0 0 0 11.708 11.708Z"></path></svg>';

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
    const icon = current === "dark" ? moonIcon : sunIcon;
    const nextLabel = current === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const iconNode = button.querySelector(".theme-icon");
      if (iconNode) iconNode.innerHTML = icon;
      button.setAttribute("aria-label", `Switch to ${nextLabel} mode`);
      button.setAttribute("title", `Switch to ${nextLabel} mode`);
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

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("in"));
  }
})();
