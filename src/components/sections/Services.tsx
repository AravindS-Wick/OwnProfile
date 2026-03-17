"use client";

import { useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { Service } from "@/lib/types";

interface ServicesProps {
  services: Service[];
}

const ICONS: Record<string, string> = {
  monitor: "🖥",
  server: "⚡",
  zap: "🔧",
  smartphone: "📱",
  layers: "🚀",
  brain: "🤖",
};

export default function Services({ services }: ServicesProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 6;
  const [focused, setFocused] = useState(0);
  const current = services[focused];

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const handleHire = () => {
    (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(7);
    setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>('[name="service"]');
      if (select && current) {
        select.value = current.id;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 900);
  };

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/70 via-[var(--navy)]/50 to-[var(--navy)]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/80 via-transparent to-[var(--navy)]/40 pointer-events-none" />

      {/* Large background number */}
      <div
        className="absolute -top-8 -left-4 font-display font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(6rem, 18vw, 16rem)",
          lineHeight: 1,
          opacity: active ? 0.35 : 0,
          transition: "opacity 1s ease 0.3s",
          WebkitTextStroke: "2px var(--border)",
          WebkitTextFillColor: "transparent",
        }}
        aria-hidden
      >
        06
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* ── Left: heading + service list ── */}
          <div className="lg:col-span-4">
            <p className="section-label mb-4" style={reveal(0.05)}>What I Offer</p>
            <h2
              className="font-display font-black text-white leading-[1.15] mb-8 pb-1"
              style={{ ...reveal(0.15), fontSize: "clamp(2rem, 4vw, 3.8rem)" }}
            >
              Services &amp;<br />
              <span className="text-gradient">Pricing</span>
            </h2>

            <div className="space-y-1" style={reveal(0.25)}>
              {services.map((svc, i) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setFocused(i)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 group"
                  style={{
                    background: focused === i ? `${svc.color}10` : "transparent",
                    borderLeft: `3px solid ${focused === i ? svc.color : "transparent"}`,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-all duration-300"
                    style={{ background: `${svc.color}18` }}
                  >
                    {ICONS[svc.icon] ?? "💡"}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold transition-colors duration-200"
                      style={{ color: focused === i ? "white" : "var(--text-muted)" }}
                    >
                      {svc.title}
                    </p>
                    <p
                      className="text-xs transition-colors duration-200"
                      style={{ color: focused === i ? svc.color : "var(--border)" }}
                    >
                      {svc.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: focused service detail ── */}
          {current && (
            <div className="lg:col-span-8" style={reveal(0.2)}>
              <div
                className="rounded-3xl p-8 border transition-all duration-500"
                style={{
                  background: `${current.color}06`,
                  borderColor: `${current.color}25`,
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${current.color}18` }}
                    >
                      {ICONS[current.icon] ?? "💡"}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-white text-xl">{current.title}</h3>
                      <p className="text-sm font-bold mt-0.5" style={{ color: current.color }}>
                        {current.price}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleHire}
                    className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
                    style={{ background: current.color, color: "var(--navy)" }}
                  >
                    Hire →
                  </button>
                </div>

                {/* Description */}
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                  {current.description}
                </p>

                {/* Divider */}
                <div className="h-px mb-6" style={{ background: `${current.color}20` }} />

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {current.features?.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 text-xs flex-shrink-0 font-bold"
                        style={{ color: current.color }}
                      >
                        ▹
                      </span>
                      <span className="text-sm text-white">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA strip */}
                <div
                  className="mt-8 pt-6 flex items-center justify-between border-t"
                  style={{ borderColor: `${current.color}20` }}
                >
                  <p className="text-xs text-[var(--text-muted)]">
                    Need something custom?{" "}
                    <button
                      type="button"
                      onClick={() => (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(7)}
                      className="underline hover:text-white transition-colors"
                    >
                      Let&apos;s discuss →
                    </button>
                  </p>
                  <div className="flex gap-1">
                    {services.map((svc, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`View ${svc.title}`}
                        onClick={() => setFocused(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: focused === i ? "20px" : "6px",
                          height: "6px",
                          background: focused === i ? current.color : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
