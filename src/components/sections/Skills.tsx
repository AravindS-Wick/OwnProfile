"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { SkillsData, SkillCategory } from "@/lib/types";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });
const FloatingSkills = dynamic(() => import("@/components/3d/FloatingSkills"), { ssr: false });

interface SkillsProps {
  data: SkillsData;
}

function CategoryTab({ cat, active, onClick }: { cat: SkillCategory; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
      style={{
        borderColor: active ? cat.color : "#1e2a45",
        color: active ? cat.color : "#64748b",
        background: active ? `${cat.color}18` : "transparent",
      }}
    >
      {cat.label}
    </button>
  );
}

export default function Skills({ data }: SkillsProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 2;
  const [activeId, setActiveId] = useState(data.categories[0]?.id ?? "");
  const cat = data.categories.find((c) => c.id === activeId) ?? data.categories[0];

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(30px)",
    transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 via-[#0a0e1a]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/40 via-transparent to-[#0a0e1a]/70 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — skill bars */}
          <div>
            <p className="section-label" style={reveal(0.05)}>What I Know</p>
            <h2
              className="font-display font-black text-white mt-2 mb-6"
              style={{ ...reveal(0.15), fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Skills &{" "}
              <span className="text-gradient">Stack</span>
            </h2>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6" style={reveal(0.25)}>
              {data.categories.map((c) => (
                <CategoryTab
                  key={c.id}
                  cat={c}
                  active={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                />
              ))}
            </div>

            {/* Skill bars */}
            {cat && (
              <div className="space-y-4" style={reveal(0.3)}>
                {cat.skills.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-white">{skill.name}</span>
                      <span className="text-[#64748b]">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-[#1e2a45] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: active ? `${skill.level}%` : "0%",
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}66)`,
                          transitionDelay: `${0.4 + i * 0.08}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — 3D orbs */}
          <div
            className="h-[380px] rounded-3xl overflow-hidden glass border border-[#1e2a45] relative"
            style={reveal(0.2)}
          >
            {active && (
              <Scene camera={{ fov: 70, position: [0, 0, 7] }}>
                <FloatingSkills categories={data.categories} />
                <ambientLight intensity={0.9} />
              </Scene>
            )}
            <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] tracking-widest uppercase text-[#2e3a55]">
              3D · All skills in orbit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
