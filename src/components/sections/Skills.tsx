"use client";

import { useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { SkillsData } from "@/lib/types";

interface SkillsProps {
  data: SkillsData;
}

export default function Skills({ data }: SkillsProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 2;
  const [activeId, setActiveId] = useState(data.categories[0]?.id ?? "");
  const cat = data.categories.find((c) => c.id === activeId) ?? data.categories[0];

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div
      className="absolute inset-0 flex items-center overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/90 via-[var(--navy)]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/40 via-transparent to-[var(--navy)]/70 pointer-events-none" />

      {/* Large background number */}
      <div
        className="absolute -top-8 -left-4 font-display font-black text-[var(--border)] select-none pointer-events-none"
        style={{ fontSize: "clamp(6rem, 18vw, 16rem)", lineHeight: 1, opacity: active ? 0.35 : 0, transition: "opacity 1s ease 0.3s" }}
        aria-hidden
      >
        02
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: heading + category tabs ── */}
          <div className="lg:col-span-4">
            <p className="section-label mb-4" style={reveal(0.05)}>Expertise</p>
            <h2
              className="font-display font-black text-white leading-[1.0] mb-8"
              style={{ ...reveal(0.15), fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Skills &amp;<br />
              <span className="text-gradient">Stack</span>
            </h2>

            {/* Vertical category list */}
            <div className="space-y-1" style={reveal(0.25)}>
              {data.categories.map((c) => {
                const isActive = c.id === activeId;
                const avg = Math.round(c.skills.reduce((s, sk) => s + sk.level, 0) / c.skills.length);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group"
                    style={{
                      background: isActive ? `${c.color}12` : "transparent",
                      borderLeft: `3px solid ${isActive ? c.color : "transparent"}`,
                    }}
                  >
                    <span
                      className="text-sm font-semibold transition-colors duration-200"
                      style={{ color: isActive ? c.color : "var(--text-muted)" }}
                    >
                      {c.label}
                    </span>
                    <span
                      className="text-xs font-bold transition-colors duration-200"
                      style={{ color: isActive ? c.color : "var(--border)" }}
                    >
                      {avg}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: skill bars + visual ring ── */}
          <div className="lg:col-span-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">

              {/* Skill bars */}
              <div className="space-y-4" style={reveal(0.3)}>
                {cat?.skills.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-semibold text-white">{skill.name}</span>
                      <span className="font-bold tabular-nums" style={{ color: cat.color }}>{skill.level}%</span>
                    </div>
                    {/* Track */}
                    <div className="relative h-1 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                        style={{
                          width: active ? `${skill.level}%` : "0%",
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`,
                          transitionDelay: `${0.4 + i * 0.07}s`,
                          boxShadow: `0 0 6px ${cat.color}66`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Circular category overview */}
              <div style={reveal(0.2)}>
                <div className="relative flex items-center justify-center" style={{ height: 220 }}>
                  <svg width="220" height="220" viewBox="0 0 220 220" className="absolute inset-0">
                    {data.categories.map((c, i) => {
                      const total = data.categories.length;
                      const angleStep = (Math.PI * 2) / total;
                      const startAngle = angleStep * i - Math.PI / 2;
                      const endAngle = startAngle + angleStep - 0.08;
                      const r = 85;
                      const cx = 110;
                      const cy = 110;
                      const avg = c.skills.reduce((s, sk) => s + sk.level, 0) / c.skills.length / 100;
                      const x1 = cx + Math.cos(startAngle) * r;
                      const y1 = cy + Math.sin(startAngle) * r;
                      const x2 = cx + Math.cos(endAngle) * r;
                      const y2 = cy + Math.sin(endAngle) * r;
                      const ri = r * avg;
                      const xi1 = cx + Math.cos(startAngle) * ri;
                      const yi1 = cy + Math.sin(startAngle) * ri;
                      const xi2 = cx + Math.cos(endAngle) * ri;
                      const yi2 = cy + Math.sin(endAngle) * ri;
                      const isAct = c.id === activeId;

                      return (
                        <g key={c.id} style={{ cursor: "pointer" }} onClick={() => setActiveId(c.id)}>
                          {/* Track arc */}
                          <path
                            d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth={isAct ? 6 : 3}
                            strokeLinecap="round"
                            style={{ transition: "stroke-width 0.3s ease" }}
                          />
                          {/* Value arc */}
                          <path
                            d={`M ${xi1} ${yi1} A ${ri} ${ri} 0 0 1 ${xi2} ${yi2}`}
                            fill="none"
                            stroke={c.color}
                            strokeWidth={isAct ? 6 : 3}
                            strokeLinecap="round"
                            opacity={active ? (isAct ? 1 : 0.5) : 0}
                            style={{ transition: "opacity 0.8s ease 0.4s, stroke-width 0.3s ease" }}
                          />
                        </g>
                      );
                    })}
                    {/* Center label */}
                    <text x="110" y="105" textAnchor="middle" fontSize="28" fontWeight="900"
                      fontFamily="Syne, sans-serif" fill="white">
                      {cat ? Math.round(cat.skills.reduce((s, sk) => s + sk.level, 0) / cat.skills.length) : 0}%
                    </text>
                    <text x="110" y="124" textAnchor="middle" fontSize="9" fontWeight="600"
                      fontFamily="Inter, sans-serif" fill="var(--text-muted)"
                      letterSpacing="2">
                      AVG LEVEL
                    </text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                  {data.categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className="flex items-center gap-2 text-left group"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                        style={{ background: c.color }}
                      />
                      <span
                        className="text-[10px] transition-colors duration-200"
                        style={{ color: c.id === activeId ? "white" : "var(--text-muted)" }}
                      >
                        {c.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
