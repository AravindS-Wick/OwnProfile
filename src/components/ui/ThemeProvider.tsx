"use client";

import { useEffect } from "react";
import { useThemeStore, getTheme } from "@/lib/themeStore";

// Applies the active theme's CSS vars to :root on every theme change.
export default function ThemeProvider() {
  const themeId = useThemeStore((s) => s.themeId);

  useEffect(() => {
    const theme = getTheme(themeId);
    const root = document.documentElement;
    root.style.setProperty("--cyan", theme.accent);
    root.style.setProperty("--cyan-dim", theme.accent + "cc");
    root.style.setProperty("--cyan-tint", theme.accent + "18");
    root.style.setProperty("--purple", theme.secondary);
    root.style.setProperty("--purple-dim", theme.secondary + "99");
    root.style.setProperty("--navy", theme.bg);
    root.style.setProperty("--navy-85", theme.bg + "d9");
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-muted", theme.muted);
    // Also update body background directly so no flash
    document.body.style.background = theme.bg;
  }, [themeId]);

  return null;
}
