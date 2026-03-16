"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { Project } from "@/lib/types";

interface ProjectSceneProps {
  project: Project;
  sceneIndex: number; // 3, 4, or 5
}

function VideoBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    return () => { v.pause(); };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fallback colour behind video */}
      <div className="absolute inset-0 bg-[#060911]" />

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: loaded ? 0.35 : 0, transition: "opacity 1s ease" }}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        onCanPlay={() => setLoaded(true)}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace(".mp4", ".webm")} type="video/webm" />
      </video>

      {/* Dark gradient so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/75 to-[#0a0e1a]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 via-transparent to-[#0a0e1a]/90" />
    </div>
  );
}

// Animated code-rain column (purely decorative)
function CodeRain({ color }: { color: string }) {
  const chars = "01アイウエオカキクケコ</>{}[]".split("");
  return (
    <div className="absolute right-0 top-0 bottom-0 w-64 overflow-hidden opacity-[0.06] pointer-events-none select-none">
      {Array.from({ length: 12 }).map((_, col) => (
        <div
          key={col}
          className="absolute top-0 bottom-0 text-[11px] font-mono leading-5 flex flex-col gap-0"
          style={{
            left: `${col * 22}px`,
            color,
            animation: `rain-fall ${2 + col * 0.3}s linear infinite`,
            animationDelay: `${col * 0.2}s`,
          }}
        >
          {Array.from({ length: 40 }).map((_, row) => (
            <span key={row}>{chars[Math.floor(Math.random() * chars.length)]}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ProjectScene({ project, sceneIndex }: ProjectSceneProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === sceneIndex;

  // Which project index out of 3 (for labelling)
  const projectNum = sceneIndex - 2; // 1, 2, 3

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
    transition: `all 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div
      className="absolute inset-0"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      {/* Video / colour background */}
      <VideoBackground src={`/videos/project-${projectNum}.mp4`} />

      {/* Decorative code rain */}
      <CodeRain color={project.color} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <div className="max-w-xl">

            {/* Project counter */}
            <div className="flex items-center gap-4 mb-6" style={reveal(0.05)}>
              <span
                className="text-[10px] font-black tracking-[0.35em] uppercase"
                style={{ color: project.color }}
              >
                Project {projectNum} / 3
              </span>
              <div className="flex gap-1.5">
                {[3, 4, 5].map((idx) => (
                  <span
                    key={idx}
                    className="w-6 h-0.5 rounded-full transition-all duration-400"
                    style={{
                      background: currentScene === idx ? project.color : "#1e2a45",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Title */}
            <h2
              className="font-display font-black text-white leading-[1.05] mb-4"
              style={{ ...reveal(0.15), fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
            >
              {project.title}
            </h2>

            {/* Description */}
            <p className="text-[#94a3b8] text-base leading-relaxed mb-6" style={reveal(0.25)}>
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8" style={reveal(0.3)}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: `${project.color}20`, color: project.color }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA links */}
            <div className="flex gap-3" style={reveal(0.38)}>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#0a0e1a] hover:scale-105 active:scale-95 transition-transform"
                  style={{ background: project.color }}
                >
                  Live Demo ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl text-sm font-medium border text-[#94a3b8] hover:text-white hover:border-[#2e3a55] transition-all glass"
                  style={{ borderColor: "#1e2a45" }}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: "video playing" indicator */}
      <div
        className="absolute bottom-8 right-8 flex items-center gap-2 text-[10px] tracking-widest uppercase"
        style={{ color: project.color, opacity: 0.5 }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: project.color }} />
        Video running in background
      </div>
    </div>
  );
}
