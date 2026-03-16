"use client";

import React, { useEffect, useRef } from "react";
import { useScrollStore, SCENES, SCENE_TEASERS, SceneId } from "@/lib/scrollStore";

interface ScrollContainerProps {
  children: React.ReactNode;
}

// ─── Dot navigation ──────────────────────────────────────────────────────────
function DotNav() {
  const { currentScene } = useScrollStore();

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {SCENES.map((_, i) => (
        <button
          key={i}
          onClick={() => {
            (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(i);
          }}
          className="group flex items-center justify-end gap-2"
          aria-label={`Go to scene ${i + 1}`}
        >
          <span
            className={`text-[10px] font-medium tracking-widest uppercase transition-all duration-300 ${
              i === currentScene
                ? "opacity-60 text-[#00d4ff]"
                : "opacity-0 group-hover:opacity-40 text-white"
            }`}
          />
          <span
            className={`block rounded-full transition-all duration-400 ${
              i === currentScene
                ? "w-2.5 h-2.5 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]"
                : "w-1.5 h-1.5 bg-[#2e3a55] group-hover:bg-[#64748b]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Scene progress bar ──────────────────────────────────────────────────────
function ProgressBar() {
  const { currentScene } = useScrollStore();
  const pct = ((currentScene) / (SCENES.length - 1)) * 100;
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-[#1e2a45]">
      <div
        className="h-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Next section teaser ─────────────────────────────────────────────────────
function NextTeaser() {
  const { currentScene, progress } = useScrollStore();
  const teaser = SCENE_TEASERS[SCENES[currentScene] as SceneId];
  const isLast = currentScene === SCENES.length - 1;

  if (isLast || !teaser) return null;

  // Fade teaser in when progress > 0.55, fade out when < 0.15
  const opacity = Math.max(0, Math.min(1, (progress - 0.55) * 6));

  return (
    <button
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 group"
      style={{ opacity, transition: "opacity 0.2s ease" }}
      onClick={() => {
        (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(currentScene + 1);
      }}
    >
      <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#00d4ff]">
        {teaser}
      </span>
      <div className="flex flex-col items-center gap-1">
        <span className="block w-px h-6 bg-gradient-to-b from-[#00d4ff] to-transparent" />
        <span className="block w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-bounce" />
      </div>
    </button>
  );
}

// ─── Scene name label ────────────────────────────────────────────────────────
function SceneLabel() {
  const { currentScene } = useScrollStore();
  const labels = ["Home", "About", "Skills", "Projects", "Projects", "Projects", "Services", "Contact"];

  return (
    <div className="fixed top-6 right-16 z-40 flex items-center gap-2">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[#64748b] font-medium">
        {labels[currentScene]}
      </span>
      <span className="text-[10px] text-[#2e3a55]">
        {String(currentScene + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Main Scroll Container ────────────────────────────────────────────────────
export default function ScrollContainer({ children }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scenes = SCENES.length;

  useEffect(() => {
    document.documentElement.style.setProperty("--total-scroll", `${scenes * 100}vh`);
  }, [scenes]);

  // Flatten children to an array
  const childArray = Array.isArray(children)
    ? children
    : React.Children.toArray(children);

  return (
    <>
      <ProgressBar />
      <DotNav />
      <SceneLabel />
      <NextTeaser />

      {/* Scrollable container — each section is 100vh tall */}
      <div
        ref={containerRef}
        style={{ height: `${childArray.length * 100}vh` }}
      >
        {childArray.map((child, i) => (
          <div
            key={i}
            className="sticky top-0 h-screen w-full overflow-hidden"
            style={{
              // Each section stacks, scroll reveals them
              zIndex: i,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
