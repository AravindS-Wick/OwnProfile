"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  tx: number; // target x
  ty: number; // target y
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export default function LoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"assemble" | "hold" | "dissolve" | "done">("assemble");
  const phaseRef = useRef<"assemble" | "hold" | "dissolve" | "done">("assemble");
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const cx = W / 2;
    const cy = H / 2;

    // ── Build letter-path targets using off-screen canvas ──────────────────
    const offscreen = document.createElement("canvas");
    offscreen.width = W;
    offscreen.height = H;
    const oc = offscreen.getContext("2d")!;

    const fontSize = Math.min(W * 0.18, 120);
    oc.font = `800 ${fontSize}px "Syne", sans-serif`;
    oc.fillStyle = "#fff";
    oc.textAlign = "center";
    oc.textBaseline = "middle";
    oc.fillText("AK", cx, cy - fontSize * 0.05);

    const imageData = oc.getImageData(0, 0, W, H);
    const data = imageData.data;

    const targets: { x: number; y: number }[] = [];
    const step = 5;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const idx = (y * W + x) * 4;
        if (data[idx + 3] > 128) targets.push({ x, y });
      }
    }

    // Shuffle for random assembly order
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targets[i], targets[j]] = [targets[j], targets[i]];
    }

    const colors = ["#00d4ff", "#7c3aed", "#ffffff", "#00d4ff", "#00d4ff"];
    const count = Math.min(targets.length, 600);

    particles.current = Array.from({ length: count }, (_, i) => {
      const t = targets[i];
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        tx: t.x,
        ty: t.y,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
      };
    });

    startTime.current = performance.now();

    const draw = (now: number) => {
      const elapsed = now - startTime.current;
      const currentPhase = phaseRef.current;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0e1a";
      ctx.fillRect(0, 0, W, H);

      const allSettled = particles.current.every((p) => {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        return Math.sqrt(dx * dx + dy * dy) < 2;
      });

      // Phase transitions
      if (currentPhase === "assemble" && allSettled && elapsed > 800) {
        phaseRef.current = "hold";
        setPhase("hold");
        setTimeout(() => {
          phaseRef.current = "dissolve";
          setPhase("dissolve");
          setTimeout(() => {
            phaseRef.current = "done";
            setPhase("done");
          }, 700);
        }, 600);
      }

      particles.current.forEach((p) => {
        if (currentPhase === "assemble") {
          // Spring toward target
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
          p.vx *= 0.72;
          p.vy *= 0.72;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.min(p.alpha + 0.04, 1);
        } else if (currentPhase === "hold") {
          // Gentle float in place
          p.x += (Math.random() - 0.5) * 0.3;
          p.y += (Math.random() - 0.5) * 0.3;
        } else if (currentPhase === "dissolve") {
          // Explode outward
          p.vx += (p.x - cx) * 0.003 + (Math.random() - 0.5) * 0.5;
          p.vy += (p.y - cy) * 0.003 + (Math.random() - 0.5) * 0.5;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(p.alpha - 0.04, 0);
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (currentPhase !== "done") {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        opacity: phase === "dissolve" ? 0 : 1,
        transition: phase === "dissolve" ? "opacity 0.7s ease-out" : "none",
        pointerEvents: phase === "dissolve" ? "none" : "all",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      {/* Tagline that fades in during "hold" */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: '"Inter", sans-serif',
          fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#00d4ff",
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.4s ease",
          whiteSpace: "nowrap",
        }}
      >
        Building the future
      </div>
    </div>
  );
}
