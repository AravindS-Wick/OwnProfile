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
  const rafId = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Sync Lenis RAF with GSAP ticker
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const totalScenes = SCENES.length;
    const vh = window.innerHeight;

    // Track which scene we're in based on scroll position
    const onScroll = ({ scroll }: { scroll: number }) => {
      const sceneIndex = Math.round(scroll / vh);
      const clampedIndex = Math.min(Math.max(sceneIndex, 0), totalScenes - 1);
      const sceneProgress = (scroll % vh) / vh;

      setScene(clampedIndex);
      setProgress(sceneProgress);
    };

    lenis.on("scroll", onScroll);

    // Snap to nearest scene when scroll settles
    let snapTimeout: ReturnType<typeof setTimeout>;
    const onScrollSnap = ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      clearTimeout(snapTimeout);
      if (Math.abs(velocity) < 0.5 && !snapLock.current) {
        snapTimeout = setTimeout(() => {
          const nearest = Math.round(scroll / vh);
          const target = Math.min(Math.max(nearest, 0), totalScenes - 1) * vh;
          if (Math.abs(scroll - target) > 5) {
            snapLock.current = true;
            lenis.scrollTo(target, {
              duration: 0.8,
              easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
              onComplete: () => {
                snapLock.current = false;
              },
            });
          }
        }, 80);
      }
    };

    lenis.on("scroll", onScrollSnap);

    // Keyboard arrow navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (snapLock.current) return;
      const scroll = lenis.scroll;
      const current = Math.round(scroll / vh);
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

    const currentRafId = rafId.current;
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(snapTimeout);
      cancelAnimationFrame(currentRafId);
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
