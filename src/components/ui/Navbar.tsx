"use client";

import { useScrollStore, SCENES } from "@/lib/scrollStore";
import type { Profile } from "@/lib/types";

const NAV_LINKS = [
  { label: "About", scene: 1 },
  { label: "Skills", scene: 2 },
  { label: "Projects", scene: 3 },
  { label: "Services", scene: 6 },
  { label: "Contact", scene: 7 },
];

interface NavbarProps {
  profile: Profile;
}

export default function Navbar({ profile }: NavbarProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const scrolled = currentScene > 0;

  const goTo = (scene: number) => {
    (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(scene);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,14,26,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #1e2a45" : "1px solid transparent",
        paddingTop: scrolled ? "12px" : "20px",
        paddingBottom: scrolled ? "12px" : "20px",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => goTo(0)}
          className="font-display font-black text-xl tracking-tight"
        >
          <span className="text-gradient">{profile.name}</span>
          <span className="text-[#2e3a55]">.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            // A link is "active" if current scene matches or is in range
            const isActive =
              link.scene === currentScene ||
              (link.label === "Projects" && currentScene >= 3 && currentScene <= 5);
            return (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => goTo(link.scene)}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    color: isActive ? "#00d4ff" : "#64748b",
                    background: isActive ? "#00d4ff11" : "transparent",
                  }}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {profile.available && (
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#00d4ff] font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
              Available
            </span>
          )}
          <button
            type="button"
            onClick={() => goTo(7)}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-[#0a0e1a] hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
          >
            Hire Me
          </button>
        </div>
      </nav>

      {/* Scene progress indicator under navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1e2a45]">
        <div
          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] transition-all duration-700 ease-out"
          style={{ width: `${(currentScene / (SCENES.length - 1)) * 100}%` }}
        />
      </div>
    </header>
  );
}
