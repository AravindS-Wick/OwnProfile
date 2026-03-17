"use client";

import { useScrollStore } from "@/lib/scrollStore";
import type { Project } from "@/lib/types";

interface ProjectSceneProps {
  project: Project;
  sceneIndex: number;
}

// Diagonal stripe texture as SVG data URI
function DiagonalStripes({ color }: { color: string }) {
  const encoded = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><path d='M0 20L20 0M-5 5L5-5M15 25L25 15' stroke='${color}' stroke-width='1' opacity='0.08'/></svg>`
  );
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: `url("data:image/svg+xml,${encoded}")` }}
    />
  );
}

// Big bold index number — editorial background element
function SceneIndex({ num, color, active }: { num: number; color: string; active: boolean }) {
  return (
    <div
      className="absolute right-6 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none pointer-events-none"
      style={{
        fontSize: "clamp(12rem, 28vw, 22rem)",
        color,
        opacity: active ? 0.07 : 0,
        transition: "opacity 1s ease 0.2s",
        WebkitTextStroke: `2px ${color}`,
        WebkitTextFillColor: "transparent",
      }}
      aria-hidden
    >
      {String(num).padStart(2, "0")}
    </div>
  );
}

export default function ProjectScene({ project, sceneIndex }: ProjectSceneProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === sceneIndex;
  const projectNum = sceneIndex - 2; // 1, 2, 3

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const slideLeft = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateX(0)" : "translateX(-48px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      {/* Color accent side-bar — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-700"
        style={{
          background: `linear-gradient(180deg, transparent, ${project.color}, transparent)`,
          opacity: active ? 1 : 0,
        }}
      />

      {/* Diagonal texture */}
      <DiagonalStripes color={project.color} />

      {/* Main gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/95 via-[var(--navy)]/75 to-[var(--navy)]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/50 via-transparent to-[var(--navy)]/85 pointer-events-none" />

      {/* Giant project number — right ghost */}
      <SceneIndex num={projectNum} color={project.color} active={active} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <div className="max-w-2xl">

            {/* Project counter row */}
            <div className="flex items-center gap-4 mb-8" style={reveal(0.05)}>
              <div className="flex items-center gap-2">
                {[3, 4, 5].map((idx) => (
                  <span
                    key={idx}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: currentScene === idx ? "28px" : "8px",
                      height: "3px",
                      background: currentScene === idx ? project.color : "var(--border)",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-[10px] font-black tracking-[0.3em] uppercase"
                style={{ color: project.color }}
              >
                Project {projectNum} / 3
              </span>
            </div>

            {/* Title — clip-path slide up */}
            <div className="overflow-hidden mb-2">
              <h2
                className="font-display font-black text-white leading-[1.0]"
                style={{
                  fontSize: "clamp(2.4rem, 6vw, 5rem)",
                  clipPath: active ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  transition: "clip-path 0.9s cubic-bezier(.16,1,.3,1) 0.15s",
                }}
              >
                {project.title}
              </h2>
            </div>

            {/* Colored underline */}
            <div
              className="mb-6 h-0.5 rounded-full transition-all duration-700"
              style={{
                background: project.color,
                width: active ? "80px" : "0px",
                transitionDelay: "0.5s",
              }}
            />

            {/* Description */}
            <p
              className="text-[var(--text-muted)] text-base leading-relaxed mb-8 max-w-lg"
              style={reveal(0.3)}
            >
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8" style={reveal(0.4)}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    borderColor: `${project.color}40`,
                    color: project.color,
                    background: `${project.color}0d`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-4" style={slideLeft(0.5)}>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: project.color,
                    color: "var(--navy)",
                    boxShadow: `0 0 0 0 ${project.color}`,
                  }}
                >
                  Live Demo ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full text-sm font-medium border text-[var(--text-muted)] hover:text-white transition-all hover:border-white"
                  style={{ borderColor: "var(--border)" }}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-right: project status pill */}
      <div
        className="absolute bottom-8 right-8 flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase"
        style={{
          color: project.color,
          opacity: active ? 0.6 : 0,
          transition: "opacity 0.5s ease 0.8s",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: project.color }}
        />
        {project.live ? "Live" : "In development"}
      </div>
    </div>
  );
}
