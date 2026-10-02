import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import "../styles/theme-toggle.css";

type Theme = "light" | "dark";
const preferenceKey = "jbta-portfolio-theme";

function readPreference(): Theme | null {
  try {
    const saved = localStorage.getItem(preferenceKey);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  // Match the early head bootstrap, including the pre-stylesheet canvas.
  const canvas = theme === "dark" ? "#090a0c" : "#f8f8f5";
  root.style.backgroundColor = canvas;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", canvas);
}

export default function ThemeToggle() {
  // The head bootstrap resolves the initial theme before the first visible paint.
  const [theme, setTheme] = useState<Theme>(
    () => document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const explicitPreference = useRef(readPreference());

  useEffect(() => {
    if (!window.matchMedia) return;
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (explicitPreference.current) return;
      const next = system.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    // addListener supports older browsers without MediaQueryList EventTarget.
    if (system.addEventListener) system.addEventListener("change", followSystem);
    else system.addListener(followSystem);
    return () => {
      if (system.removeEventListener) system.removeEventListener("change", followSystem);
      else system.removeListener(followSystem);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    explicitPreference.current = next;
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(preferenceKey, next);
    } catch {
      // The choice still applies for this visit if persistence is unavailable.
    }
  };
  const label = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      data-cursor-label={theme === "light" ? "Dark mode" : "Light mode"}
      onClick={toggleTheme}
    >
      {theme === "light" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
    </button>
  );
}
