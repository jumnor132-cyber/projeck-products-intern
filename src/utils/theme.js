import { useState, useEffect } from "react";

const THEME_KEY = "freshmart_theme_mode";

export const getStoredTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch {}
  return "light";
};

export const applyTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
  window.dispatchEvent(new Event("themeChanged"));
};

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    // Initial sync
    const initial = getStoredTheme();
    applyTheme(initial);

    const handleUpdate = () => {
      setTheme(getStoredTheme());
    };

    window.addEventListener("themeChanged", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("themeChanged", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    return next;
  };

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme: applyTheme,
  };
}
