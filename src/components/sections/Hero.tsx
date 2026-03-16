"use client";

import { useEffect, useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { Profile } from "@/lib/types";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 0;

  const [displayed, setDisplayed] = useState("");
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const tagline = profile.taglines[taglineIdx];
    let t: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < tagline.length) {
        t = setTimeout(() => setDisplayed(tagline.slice(0, displayed.length + 1)), 65);
      } else {
        t = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
      } else {
        setTaglineIdx((i) => (i + 1) % profile.taglines.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, taglineIdx, profile.taglines]);

  return (
    <div
      className="absolute inset-0 flex items-center transition-all duration-1000"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(-40px)",
      }}
    >
      {/* Left gradient edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#0a0e1a]/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/40 via-transparent to-[#0a0e1a]/80 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="max-w-2xl">
          {/* Available pill */}
          {profile.available && (
            <div
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-xs text-[#00d4ff] font-semibold tracking-widest uppercase"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.7s ease 0.1s",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
              Open for projects
            </div>
          )}

          {/* Name */}
          <h1
            className="font-display font-black text-white leading-[0.95] mb-4"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.2s",
            }}
          >
            {profile.name}
            <span className="text-gradient">.</span>
          </h1>

          {/* Typewriter */}
          <div
            className="text-xl sm:text-2xl font-display font-semibold text-[#94a3b8] mb-6 h-9 flex items-center"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.35s",
            }}
          >
            <span className="text-white">{displayed}</span>
            <span className="ml-0.5 inline-block w-0.5 h-6 bg-[#00d4ff] animate-pulse" />
          </div>

          {/* Bio */}
          <p
            className="text-[#64748b] text-base leading-relaxed max-w-lg mb-10"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.45s",
            }}
          >
            {profile.bio.slice(0, 180)}...
          </p>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 mb-10"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.5s",
            }}
          >
            {profile.stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-display font-black text-gradient">{s.value}</div>
                <div className="text-[10px] text-[#64748b] tracking-wider uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.6s",
            }}
          >
            <button
              type="button"
              onClick={() => (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(2)}
              className="px-7 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-[#0a0e1a] hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-[#00d4ff22]"
            >
              See My Work
            </button>
            <button
              type="button"
              onClick={() => (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(7)}
              className="px-7 py-3 rounded-2xl font-bold text-sm glass border border-[#1e2a45] text-white hover:border-[#00d4ff] hover:scale-105 active:scale-95 transition-all"
            >
              Hire Me →
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint (only on scene 0, before user has scrolled) */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: active ? 0.5 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div className="w-5 h-8 rounded-full border border-[#2e3a55] flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#64748b] animate-bounce" />
        </div>
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#2e3a55]">scroll</span>
      </div>
    </div>
  );
}
