"use client";

import { useEffect, useRef, useCallback } from "react";

export function useCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });       // ring lerped position
  const target = useRef({ x: 0, y: 0 });    // exact mouse position
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  const tick = useCallback(() => {
    // Lerp ring toward cursor — creates the "lag" effect
    pos.current.x += (target.current.x - pos.current.x) * 0.12;
    pos.current.y += (target.current.y - pos.current.y) * 0.12;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (dot) {
      dot.style.transform = `translate3d(${target.current.x - 4}px, ${target.current.y - 4}px, 0)`;
    }
    if (ring) {
      const size = isClicking.current ? 20 : isHovering.current ? 50 : 32;
      const half = size / 2;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.transform = `translate3d(${pos.current.x - half}px, ${pos.current.y - half}px, 0)`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    // Only on desktop
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    // Dot — tracks mouse exactly
    const dot = document.createElement("div");
    dot.style.cssText = `
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:#00d4ff;pointer-events:none;z-index:99999;
      box-shadow:0 0 10px #00d4ff,0 0 20px #00d4ff44;
      mix-blend-mode:screen;will-change:transform;
      transition:opacity 0.2s ease;
    `;
    document.body.appendChild(dot);
    dotRef.current = dot;

    // Ring — lags behind
    const ring = document.createElement("div");
    ring.style.cssText = `
      position:fixed;width:32px;height:32px;border-radius:50%;
      border:1.5px solid #00d4ff;pointer-events:none;z-index:99998;
      opacity:0.6;will-change:transform,width,height;
      transition:width 0.25s cubic-bezier(.16,1,.3,1),height 0.25s cubic-bezier(.16,1,.3,1),opacity 0.2s ease,border-color 0.2s ease;
    `;
    document.body.appendChild(ring);
    ringRef.current = ring;

    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a,button,[role=button]")) {
        isHovering.current = true;
        if (ringRef.current) {
          ringRef.current.style.borderColor = "#7c3aed";
          ringRef.current.style.opacity = "1";
          ringRef.current.style.boxShadow = "0 0 16px #7c3aed66";
        }
      }
    };

    const onLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a,button,[role=button]")) {
        isHovering.current = false;
        if (ringRef.current) {
          ringRef.current.style.borderColor = "#00d4ff";
          ringRef.current.style.opacity = "0.6";
          ringRef.current.style.boxShadow = "none";
        }
      }
    };

    const onDown = () => { isClicking.current = true; };
    const onUp = () => { isClicking.current = false; };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      dot.remove();
      ring.remove();
      document.documentElement.style.cursor = "";
    };
  }, [tick]);
}
