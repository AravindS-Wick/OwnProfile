"use client";

import { useScrollStore, SCENES } from "@/lib/scrollStore";
import type { Profile } from "@/lib/types";

const NAV_LINKS = [
  { label: "About",    scene: 1 },
  { label: "Skills",   scene: 2 },
  { label: "Projects", scene: 3 },
  { label: "Services", scene: 6 },
  { label: "Contact",  scene: 7 },
];

interface NavbarProps { profile: Profile; }

export default function Navbar({ profile }: NavbarProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const scrolled = currentScene > 0;

  const goTo = (scene: number) => {
    (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(scene);
  };

  const pct = (currentScene / (SCENES.length - 1)) * 100;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "var(--navy-85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        paddingTop: scrolled ? "12px" : "20px",
        paddingBottom: scrolled ? "12px" : "20px",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">

        {/* Logo */}
        <button
          type="button"
          onClick={() => goTo(0)}
          className="font-display font-black text-lg tracking-tight"
        >
          <span className="text-gradient">{profile.name.split(" ")[0]}</span>
          <span className="text-[var(--border)]">.</span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.scene === currentScene ||
              (link.label === "Projects" && currentScene >= 3 && currentScene <= 5);
            return (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => goTo(link.scene)}
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                  style={{
                    color: isActive ? "var(--cyan)" : "var(--text-muted)",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-4 right-4 h-px rounded-full"
                      style={{ background: "var(--cyan)" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-4">
          {profile.available && (
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--cyan)] font-semibold tracking-[0.2em] uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--cyan)]" />
              </span>
              Available
            </span>
          )}
          <button
            type="button"
            onClick={() => goTo(7)}
            className="px-5 py-2 rounded-full text-sm font-bold border border-[var(--cyan)] text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-[var(--navy)] transition-all duration-300"
          >
            Hire Me
          </button>
        </div>
      </nav>

      {/* Thin progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]">
        <div
          className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
}
