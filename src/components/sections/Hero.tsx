"use client";

import { useEffect, useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { Profile } from "@/lib/types";

interface HeroProps {
  profile: Profile;
}

// Scrolling marquee band
function MarqueeBand({ active }: { active: boolean }) {
  const items = [
    "Full Stack Developer",
    "React · Next.js",
    "GCP Certified",
    "Azure Certified",
    "AI Integration",
    "Three.js · GSAP",
    "React Native",
    "FastAPI · Node.js",
  ];
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-[var(--border)] py-3"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s ease 1.2s",
      }}
    >
      <div className="marquee-track flex gap-10 w-max">
        {doubled.map((item, i) => (
          <span key={i} className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--text-muted)] whitespace-nowrap flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-[var(--cyan)] inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ profile }: HeroProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 0;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  const firstName = profile.name.split(" ")[0] ?? profile.name;
  const lastName = profile.name.split(" ").slice(1).join(" ");

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Dark gradient on left */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/90 via-[var(--navy)]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/60 via-transparent to-[var(--navy)]/70 pointer-events-none" />

      {/* Main content — vertically centered */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 w-full">

        {/* Top label */}
        <div
          className="flex items-center gap-3 mb-6"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s ease 0.1s",
          }}
        >
          {profile.available && (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#10b981]">Available for work</span>
              <span className="text-[var(--border)]">·</span>
            </>
          )}
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)]">{profile.location}</span>
        </div>

        {/* Name — large editorial display */}
        <div className="mb-4 overflow-hidden">
          <h1
            className="font-display font-black leading-none text-white hero-title"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
          >
            <span
              className="block overflow-hidden"
              style={{
                clipPath: mounted ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                transition: "clip-path 0.9s cubic-bezier(.16,1,.3,1) 0.2s",
              }}
            >
              {firstName}
            </span>
            {lastName && (
              <span
                className="block overflow-hidden text-gradient"
                style={{
                  clipPath: mounted ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  transition: "clip-path 0.9s cubic-bezier(.16,1,.3,1) 0.4s",
                }}
              >
                {lastName}
              </span>
            )}
            {!lastName && (
              <span
                className="text-gradient"
                style={{
                  clipPath: mounted ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  transition: "clip-path 0.9s cubic-bezier(.16,1,.3,1) 0.4s",
                }}
              >
                .
              </span>
            )}
          </h1>
        </div>

        {/* Role + bio row */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-10">
          <div>
            <p
              className="text-[var(--text-muted)] text-base leading-relaxed max-w-lg"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.7s ease 0.7s",
              }}
            >
              {profile.bio}
            </p>
          </div>

          {/* Stats — right side, editorial numbers */}
          <div
            className="grid grid-cols-4 gap-4 lg:justify-items-end"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease 0.85s",
            }}
          >
            {profile.stats.map((s) => (
              <div key={s.label} className="text-right">
                <div
                  className="font-display font-black text-white leading-none"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-[9px] text-[var(--text-muted)] tracking-wider uppercase mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 1s",
          }}
        >
          <button
            type="button"
            onClick={() => (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(3)}
            className="group relative px-8 py-3.5 rounded-full font-bold text-sm overflow-hidden"
            style={{ background: "var(--cyan)", color: "var(--navy)" }}
          >
            <span className="relative z-10">View Work</span>
            <span
              className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{ background: "var(--purple)" }}
            />
          </button>
          <button
            type="button"
            onClick={() => (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(7)}
            className="px-8 py-3.5 rounded-full font-bold text-sm border border-[var(--border)] text-white hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-all duration-300"
          >
            Hire Me
          </button>
          {profile.socials.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full text-sm text-[var(--text-muted)] hover:text-white transition-colors duration-300"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* Marquee band — bottom of section */}
      <div className="relative z-10 mb-16">
        <MarqueeBand active={active} />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 right-8 z-10 flex items-center gap-3"
        style={{
          opacity: mounted ? 0.5 : 0,
          transition: "opacity 0.5s ease 1.4s",
        }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)]">scroll</span>
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--cyan)]" />
      </div>
    </div>
  );
}
