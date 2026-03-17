"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SCENES, useScrollStore } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const { setScene, setProgress } = useScrollStore();
  const snapLock = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.5,
      touchMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    // Sync Lenis RAF with GSAP ticker
    lenis.on("scroll", ScrollTrigger.update);
    const gsapTicker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    const totalScenes = SCENES.length;
    // Use a ref so resize updates it without recreating handlers
    let vh = window.innerHeight;
    const onResize = () => { vh = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // Track which scene we're in based on scroll position
    // Use Math.floor so scene flips at the start of each section, not halfway through
    const onScroll = ({ scroll }: { scroll: number }) => {
      const sceneIndex = Math.floor(scroll / vh);
      const clampedIndex = Math.min(Math.max(sceneIndex, 0), totalScenes - 1);
      const sceneProgress = (scroll % vh) / vh;
      setScene(clampedIndex);
      setProgress(sceneProgress);
    };

    lenis.on("scroll", onScroll);

    // Snap to nearest scene when scroll settles.
    // Only snaps if the scroll position is genuinely between sections (progress
    // between 5%–95%). This prevents phantom snaps when the user arrives at a
    // section boundary and the position is already at or near a clean vh multiple.
    let snapTimeout: ReturnType<typeof setTimeout>;
    const onScrollSnap = ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      clearTimeout(snapTimeout);
      if (Math.abs(velocity) < 0.3 && !snapLock.current) {
        snapTimeout = setTimeout(() => {
          const currentIndex = Math.floor(scroll / vh);
          const progress = (scroll % vh) / vh;
          // Don't snap if already very close to a section boundary
          if (progress < 0.05 || progress > 0.95) return;
          // Snap forward if >25% into next section, else snap back to current
          const targetIndex = progress > 0.25 ? currentIndex + 1 : currentIndex;
          const target = Math.min(Math.max(targetIndex, 0), totalScenes - 1) * vh;
          snapLock.current = true;
          lenis.scrollTo(target, {
            duration: 1.0,
            easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            onComplete: () => { snapLock.current = false; },
          });
        }, 80);
      }
    };

    lenis.on("scroll", onScrollSnap);

    // Keyboard arrow navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (snapLock.current) return;
      const scroll = lenis.scroll;
      const current = Math.floor(scroll / vh);
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(current + 1, totalScenes - 1);
        snapLock.current = true;
        lenis.scrollTo(next * vh, {
          duration: 1.0,
          onComplete: () => { snapLock.current = false; },
        });
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(current - 1, 0);
        snapLock.current = true;
        lenis.scrollTo(prev * vh, {
          duration: 1.0,
          onComplete: () => { snapLock.current = false; },
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsapTicker);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      clearTimeout(snapTimeout);
    };
  }, [setScene, setProgress]);

  // Expose scrollTo globally so teaser buttons / nav can use it
  useEffect(() => {
    (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene = (index: number) => {
      const vh = window.innerHeight;
      lenisRef.current?.scrollTo(index * vh, { duration: 1.2 });
    };
  }, []);

  return <>{children}</>;
}
