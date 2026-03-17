"use client";

import { useScrollStore } from "@/lib/scrollStore";
import type { Profile } from "@/lib/types";

interface AboutProps {
  profile: Profile;
}

const TRAITS = [
  { icon: "🖥", label: "UI / Frontend", desc: "React, Next.js, Three.js, Tailwind", color: "var(--cyan)" },
  { icon: "⚡", label: "API / Backend", desc: "Node.js, FastAPI, REST & GraphQL", color: "var(--purple)" },
  { icon: "☁️", label: "Cloud Infra", desc: "GCP certified · Azure certified", color: "#f59e0b" },
  { icon: "📱", label: "Mobile", desc: "React Native & Expo, iOS + Android", color: "#10b981" },
  { icon: "🤖", label: "AI / LLM", desc: "Prompt engineering · AI integration", color: "#f43f5e" },
  { icon: "🔧", label: "Automation", desc: "Scripts · CI/CD · n8n pipelines", color: "#a78bfa" },
];

const TIMELINE = [
  { year: "2021", event: "First production app shipped" },
  { year: "2022", event: "GCP + Azure certified" },
  { year: "2023", event: "10+ client projects delivered" },
  { year: "2024", event: "LLM-powered products built" },
  { year: "NOW",  event: "Open for new projects" },
];

export default function About({ profile }: AboutProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 1;

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(40px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const slideIn = (delay: number, from: "left" | "right" = "left") => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateX(0)" : `translateX(${from === "left" ? "-60px" : "60px"})`,
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div
      className="absolute inset-0 flex items-center overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Asymmetric background split */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[var(--navy)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/40 via-transparent to-[var(--navy)]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">

        {/* Large section number — editorial background element */}
        <div
          className="absolute -top-8 -left-4 font-display font-black text-[var(--border)] select-none pointer-events-none"
          style={{ fontSize: "clamp(6rem, 18vw, 16rem)", lineHeight: 1, opacity: active ? 0.35 : 0, transition: "opacity 1s ease 0.3s" }}
          aria-hidden
        >
          01
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* ── Left col: label + big statement + bio ── */}
          <div className="lg:col-span-5">
            <p className="section-label mb-4" style={reveal(0.1)}>About Me</p>

            <h2
              className="font-display font-black text-white leading-[1.0] mb-6"
              style={{ ...slideIn(0.2), fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Full-Stack Dev<br />
              <em className="text-gradient not-italic">Running on<br />Ambition</em>
            </h2>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-sm" style={reveal(0.35)}>
              {profile.bio}
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-3" style={reveal(0.45)}>
              {profile.socials.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors border-b border-transparent hover:border-[var(--cyan)] pb-0.5">
                  GitHub ↗
                </a>
              )}
              {profile.socials.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors border-b border-transparent hover:border-[var(--cyan)] pb-0.5">
                  LinkedIn ↗
                </a>
              )}
              <a href={`mailto:${profile.email}`}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors border-b border-transparent hover:border-[var(--cyan)] pb-0.5">
                Email ↗
              </a>
            </div>
          </div>

          {/* ── Right col: timeline + traits ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Horizontal timeline */}
            <div style={slideIn(0.25, "right")}>
              <div className="relative">
                {/* Track line */}
                <div className="absolute top-[7px] left-0 right-0 h-px bg-[var(--border)]" />
                <div
                  className="absolute top-[7px] left-0 h-px bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] transition-all duration-1000"
                  style={{ width: active ? "100%" : "0%" }}
                />
                <div className="flex justify-between relative">
                  {TIMELINE.map((item, i) => (
                    <div key={item.year} className="flex flex-col items-center gap-3" style={{ transitionDelay: `${0.4 + i * 0.1}s` }}>
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-500"
                        style={{
                          borderColor: i === TIMELINE.length - 1 ? "var(--cyan)" : "var(--border)",
                          background: i === TIMELINE.length - 1 ? "var(--cyan)" : "var(--navy)",
                          boxShadow: i === TIMELINE.length - 1 ? "0 0 10px var(--cyan)" : "none",
                          transitionDelay: `${0.5 + i * 0.12}s`,
                          opacity: active ? 1 : 0,
                        }}
                      />
                      <span
                        className="font-black text-[10px] tracking-widest"
                        style={{ color: i === TIMELINE.length - 1 ? "var(--cyan)" : "var(--text-muted)" }}
                      >
                        {item.year}
                      </span>
                      <span className="text-[9px] text-[var(--border)] text-center leading-tight max-w-[72px]">
                        {item.event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traits grid — staggered reveal */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRAITS.map((t, i) => (
                <div
                  key={t.label}
                  className="group rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1 cursor-default"
                  style={{
                    background: `${t.color}08`,
                    borderColor: `${t.color}22`,
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
                    transition: `all 0.6s cubic-bezier(.16,1,.3,1) ${0.3 + i * 0.06}s`,
                  }}
                >
                  <div
                    className="h-0.5 w-6 rounded-full mb-3 transition-all duration-400 group-hover:w-full"
                    style={{ background: t.color }}
                  />
                  <span className="text-lg block mb-1.5">{t.icon}</span>
                  <h3 className="font-display font-bold text-xs mb-1" style={{ color: t.color }}>{t.label}</h3>
                  <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
