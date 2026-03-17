"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Theme definitions ─────────────────────────────────────────────────────────
// Each theme maps to a set of CSS custom property overrides applied to :root.
// The 3D WorldCanvas reads these same vars via JS for particle/geometry colors.

export interface ThemeDef {
  id: string;
  label: string;
  accent: string;    // primary accent (cyan slot)
  secondary: string; // secondary accent (purple slot)
  bg: string;        // navy background
  surface: string;   // card surface
  border: string;    // border color
  text: string;      // body text
  muted: string;     // muted text
}

export const THEMES: ThemeDef[] = [
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    accent: "#00d4ff",
    secondary: "#7c3aed",
    bg: "#0a0e1a",
    surface: "#0f1629",
    border: "#1e2a45",
    text: "#e2e8f0",
    muted: "#64748b",
  },
  {
    id: "forest",
    label: "Forest",
    accent: "#4ade80",
    secondary: "#22d3ee",
    bg: "#071a0e",
    surface: "#0c2014",
    border: "#1a3d25",
    text: "#dcfce7",
    muted: "#6b8f72",
  },
  {
    id: "mono",
    label: "Mono",
    accent: "#f1f5f9",
    secondary: "#94a3b8",
    bg: "#0a0a0a",
    surface: "#111111",
    border: "#222222",
    text: "#f1f5f9",
    muted: "#64748b",
  },
  {
    id: "sunset",
    label: "Sunset",
    accent: "#fb923c",
    secondary: "#e11d48",
    bg: "#110a05",
    surface: "#1a0f08",
    border: "#3d1f0f",
    text: "#fef3c7",
    muted: "#a16207",
  },
];

interface ThemeState {
  themeId: string;
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DEFAULT_THEME) || "cyberpunk",
      setTheme: (id) => set({ themeId: id }),
    }),
    { name: "portfolio-theme" }
  )
);

export function getTheme(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
