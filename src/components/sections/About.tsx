"use client";

import { useScrollStore } from "@/lib/scrollStore";
import type { Profile } from "@/lib/types";

interface AboutProps {
  profile: Profile;
}

const TRAITS = [
  { icon: "🖥", label: "UI / Frontend", desc: "React, Next.js, Three.js, Tailwind" },
  { icon: "⚡", label: "API / Backend", desc: "Node.js, FastAPI, REST & GraphQL" },
  { icon: "☁️", label: "Cloud", desc: "GCP certified · Azure certified" },
  { icon: "📱", label: "Mobile", desc: "React Native & Expo, iOS + Android" },
  { icon: "🤖", label: "AI / Vibe Coding", desc: "Prompt engineering · LLM integration" },
  { icon: "🔧", label: "Automation", desc: "Scripts · CI/CD · Workflow pipelines" },
];

export default function About({ profile }: AboutProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 1;

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(36px)",
    transition: `all 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/50 via-transparent to-[#0a0e1a]/70 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left column — text */}
          <div>
            <p className="section-label" style={reveal(0.1)}>Who I Am</p>

            <h2
              className="font-display font-black text-white mt-3 mb-6 leading-[1.05]"
              style={{ ...reveal(0.2), fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              A Full-Stack Dev<br />
              <span className="text-gradient">Running on Ambition</span>
            </h2>

            <p className="text-[#94a3b8] text-base leading-relaxed mb-8 max-w-lg" style={reveal(0.3)}>
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-3" style={reveal(0.4)}>
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass px-5 py-2 rounded-xl text-sm text-[#94a3b8] border border-[#1e2a45] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-all"
                >
                  GitHub ↗
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass px-5 py-2 rounded-xl text-sm text-[#94a3b8] border border-[#1e2a45] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-all"
                >
                  LinkedIn ↗
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="glass px-5 py-2 rounded-xl text-sm text-[#94a3b8] border border-[#1e2a45] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-all"
              >
                Email ↗
              </a>
            </div>
          </div>

          {/* Right column — trait grid */}
          <div className="grid grid-cols-2 gap-3">
            {TRAITS.map((t, i) => (
              <div
                key={t.label}
                className="glass rounded-2xl p-4 border border-[#1e2a45] hover:border-[#00d4ff22] hover:-translate-y-0.5 transition-all duration-300"
                style={reveal(0.3 + i * 0.07)}
              >
                <span className="text-xl block mb-2">{t.icon}</span>
                <h3 className="font-display font-bold text-white text-sm mb-1">{t.label}</h3>
                <p className="text-[#64748b] text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
