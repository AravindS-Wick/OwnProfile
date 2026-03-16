"use client";

import { useEffect, useRef, useState } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const sequence = useRef<string[]>([]);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      sequence.current.push(e.key);
      if (sequence.current.length > KONAMI.length) {
        sequence.current.shift();
      }
      if (sequence.current.join(",") === KONAMI.join(",")) {
        sequence.current = [];
        setActive(true);
        clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setActive(false), 4000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        animation: "egg-in 0.4s cubic-bezier(.16,1,.3,1) forwards",
      }}
    >
      <style>{`
        @keyframes egg-in {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes egg-float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Confetti particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: 0,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background: ["#00d4ff", "#7c3aed", "#f59e0b", "#f43f5e", "#10b981"][
              Math.floor(Math.random() * 5)
            ],
            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in ${
              Math.random() * 0.5
            }s forwards`,
          }}
        />
      ))}

      {/* Message card */}
      <div
        style={{
          background: "rgba(10, 14, 26, 0.95)",
          border: "1px solid #00d4ff",
          borderRadius: "16px",
          padding: "2.5rem 3rem",
          textAlign: "center",
          boxShadow: "0 0 40px #00d4ff44, 0 0 80px #7c3aed22",
          animation: "egg-float 3s ease-in-out 0.4s infinite",
          maxWidth: "420px",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎮</div>
        <div
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: "1.5rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
          }}
        >
          Cheat Code Activated
        </div>
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: "0.95rem",
            color: "#94a3b8",
            lineHeight: 1.6,
          }}
        >
          You found the secret! ↑↑↓↓←→←→BA
          <br />
          <span style={{ color: "#00d4ff" }}>+30 lives</span> and a direct line to hire me.
        </div>
        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#475569", letterSpacing: "0.1em" }}>
          NOW GO SCROLL TO CONTACT ↓
        </div>
      </div>
    </div>
  );
}
