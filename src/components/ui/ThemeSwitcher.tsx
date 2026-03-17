"use client";

import { useState } from "react";
import { THEMES, useThemeStore } from "@/lib/themeStore";

export default function ThemeSwitcher() {
  const { themeId, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-6 z-50">
      {/* Theme pill tabs — shown when open */}
      <div
        className="flex flex-col gap-1.5 mb-2 transition-all duration-300 origin-bottom"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTheme(t.id); setOpen(false); }}
            className="flex items-center gap-2 glass px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 hover:scale-105"
            style={{
              borderColor: t.id === themeId ? t.accent : "var(--border)",
              color: t.id === themeId ? t.accent : "var(--text-muted)",
              background: t.id === themeId ? `${t.accent}12` : "rgba(15,22,41,0.8)",
            }}
          >
            {/* Color swatch */}
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})`,
                boxShadow: t.id === themeId ? `0 0 6px ${t.accent}88` : "none",
              }}
            />
            {t.label}
            {t.id === themeId && (
              <span className="ml-auto text-[9px] tracking-widest opacity-60">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="glass border border-[var(--border)] rounded-xl px-3 py-2 flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all duration-200"
        aria-label="Toggle theme switcher"
      >
        <span className="text-sm">◐</span>
        Theme
      </button>
    </div>
  );
}
