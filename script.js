(() => {
  document.documentElement.classList.add("js");

  const themeStorageKey = "gtlabs72-theme";
  const consentStorageKey = "gtlabs72-analytics-consent";
  const gaMeasurementId = "G-KY1963HEJK";
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const sunIcon =
    '<svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41"></path></svg>';
  const moonIcon =
    '<svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true"><path d="M20.354 15.354A9 9 0 1 1 8.646 3.646a7 7 0 0 0 11.708 11.708Z"></path></svg>';
  let analyticsLoaded = false;

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(themeStorageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(themeStorageKey, theme);
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

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  function getConsentValue() {
    try {
      const value = localStorage.getItem(consentStorageKey);
      return value === "granted" || value === "denied" ? value : null;
    } catch {
      return null;
    }
  }

  function setConsentValue(value) {
    try {
      localStorage.setItem(consentStorageKey, value);
    } catch {
      // Ignore storage failures.
    }
  }

  function applyConsentToGoogle(value) {
    const granted = value === "granted";
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  function loadAnalyticsScriptIfNeeded() {
    if (analyticsLoaded) return;
    const existing = document.querySelector('script[data-ga-loader="true"]');
    if (existing) {
      analyticsLoaded = true;
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    script.setAttribute("data-ga-loader", "true");
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, { anonymize_ip: true });
    analyticsLoaded = true;
  }

  function clearAnalyticsCookies() {
    const names = ["_ga", "_gid", "_gat", "_ga_" + gaMeasurementId.replace(/-/g, "_")];
    const host = window.location.hostname;
    const rootDomain = host.split(".").slice(-2).join(".");
    names.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      if (rootDomain && rootDomain !== host) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${rootDomain}`;
      }
    });
  }

  function setAnalyticsConsent(value) {
    setConsentValue(value);
    applyConsentToGoogle(value);
    if (value === "granted") {
      loadAnalyticsScriptIfNeeded();
    } else {
      clearAnalyticsCookies();
    }
  }

  function createConsentBanner() {
    const container = document.createElement("div");
    container.className = "consent-banner";
    container.setAttribute("role", "dialog");
    container.setAttribute("aria-live", "polite");
    container.innerHTML =
      '<div class="consent-inner">' +
      "<p>We use optional analytics cookies (Google Analytics) to understand website usage. You can accept or reject analytics.</p>" +
      '<div class="consent-actions">' +
      '<button type="button" class="btn ghost consent-btn" data-consent-action="deny">Reject</button>' +
      '<button type="button" class="btn consent-btn" data-consent-action="accept">Accept analytics</button>' +
      '<a class="text-link consent-link" href="/privacy.html">Learn more</a>' +
      "</div>" +
      "</div>";
    document.body.appendChild(container);
    return container;
  }

  const consentBanner = createConsentBanner();

  function showConsentBanner() {
    consentBanner.classList.add("show");
  }

  function hideConsentBanner() {
    consentBanner.classList.remove("show");
  }

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  const currentConsent = getConsentValue();
  if (currentConsent === "granted") {
    setAnalyticsConsent("granted");
  } else if (currentConsent === "denied") {
    setAnalyticsConsent("denied");
  } else {
    showConsentBanner();
  }

  consentBanner.querySelectorAll("[data-consent-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-consent-action");
      const value = action === "accept" ? "granted" : "denied";
      setAnalyticsConsent(value);
      hideConsentBanner();
    });
  });

  document.querySelectorAll("[data-open-consent]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      showConsentBanner();
    });
  });

  document.querySelectorAll("[data-analytics-event]").forEach((el) => {
    el.addEventListener("click", () => {
      if (getConsentValue() !== "granted") return;
      if (typeof window.gtag !== "function") return;
      const eventName = el.getAttribute("data-analytics-event");
      const source = el.getAttribute("data-analytics-location") || "unknown";
      const label = (el.textContent || "").trim().slice(0, 80);
      window.gtag("event", eventName, {
        page_path: window.location.pathname,
        event_source: source,
        event_label: label
      });
    });
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
