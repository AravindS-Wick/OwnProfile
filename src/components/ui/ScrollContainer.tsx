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
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
      {SCENES.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to scene ${i + 1}`}
          onClick={() => {
            (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(i);
          }}
          className="group flex items-center justify-end gap-2"
        >
          <span
            className="block rounded-full transition-all duration-400"
            style={{
              width: i === currentScene ? "18px" : "6px",
              height: i === currentScene ? "6px" : "6px",
              background: i === currentScene ? "var(--cyan)" : "var(--border)",
              boxShadow: i === currentScene ? "0 0 6px var(--cyan)" : "none",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Slim top progress bar ────────────────────────────────────────────────────
function ProgressBar() {
  const { currentScene } = useScrollStore();
  const pct = (currentScene / (SCENES.length - 1)) * 100;
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-[var(--border)]">
      <div
        className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Scene label ─────────────────────────────────────────────────────────────
function SceneLabel() {
  const { currentScene } = useScrollStore();
  const labels = ["Home", "About", "Skills", "Work", "Work", "Work", "Services", "Contact"];

  return (
    <div className="fixed top-6 right-16 z-40 flex items-center gap-2">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] font-medium">
        {labels[currentScene]}
      </span>
      <span className="text-[10px] text-[var(--border)]">
        {String(currentScene + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(SCENES.length).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Next section teaser ─────────────────────────────────────────────────────
function NextTeaser() {
  const { currentScene, progress } = useScrollStore();
  const teaser = SCENE_TEASERS[SCENES[currentScene] as SceneId];
  const isLast = currentScene === SCENES.length - 1;

  if (isLast || !teaser) return null;

  const opacity = Math.max(0, Math.min(1, (progress - 0.6) * 8));

  return (
    <button
      type="button"
      aria-label={`Go to next section: ${teaser}`}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5"
      style={{ opacity, transition: "opacity 0.2s ease", pointerEvents: opacity > 0 ? "auto" : "none" }}
      onClick={() => {
        (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(currentScene + 1);
      }}
    >
      <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--cyan)]">
        {teaser}
      </span>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="animate-bounce">
        <path d="M8 0v16M1 9l7 7 7-7" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── Main Scroll Container ────────────────────────────────────────────────────
export default function ScrollContainer({ children }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scenes = SCENES.length;

  useEffect(() => {
    document.documentElement.style.setProperty("--total-scroll", `${scenes * 100}vh`);
  }, [scenes]);

  const childArray = React.Children.toArray(children);

  return (
    <>
      <ProgressBar />
      <DotNav />
      <SceneLabel />
      <NextTeaser />

      <div ref={containerRef} style={{ height: `${childArray.length * 100}vh` }}>
        {childArray.map((child, i) => (
          <div
            key={i}
            className="sticky top-0 h-screen w-full overflow-hidden"
            style={{ zIndex: i }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
