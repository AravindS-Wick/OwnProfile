"use client";

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

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(32px)",
    transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const handleHire = (serviceId: string) => {
    // navigate to contact scene (index 7)
    (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(7);
    setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>('[name="service"]');
      if (select) {
        select.value = serviceId;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 900);
  };

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 via-[#0a0e1a]/50 to-[#0a0e1a]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/80 via-transparent to-[#0a0e1a]/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="text-center mb-10" style={reveal(0.05)}>
          <p className="section-label">What I Offer</p>
          <h2
            className="font-display font-black text-white mt-2"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Services & <span className="text-gradient">Pricing</span>
          </h2>
        </div>

        {/* Services grid — horizontal scroll on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {services.map((svc, i) => (
            <div
              key={svc.id}
              className="glass rounded-2xl p-4 border border-[#1e2a45] flex flex-col group hover:border-[#00d4ff33] hover:-translate-y-1 transition-all duration-300"
              style={reveal(0.1 + i * 0.06)}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 flex-shrink-0"
                style={{ background: `${svc.color}18` }}
              >
                {ICONS[svc.icon] ?? "💡"}
              </div>
              <h3 className="font-display font-bold text-white text-sm mb-1">{svc.title}</h3>
              <p className="text-[#64748b] text-xs leading-relaxed mb-3 flex-1">{svc.description}</p>
              <div className="mt-auto">
                <p className="text-xs font-semibold mb-2" style={{ color: svc.color }}>
                  {svc.price}
                </p>
                <button
                  type="button"
                  onClick={() => handleHire(svc.id)}
                  className="w-full py-1.5 rounded-lg text-xs font-bold text-[#0a0e1a] hover:opacity-80 transition-opacity"
                  style={{ background: svc.color }}
                >
                  Hire →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom scope strip */}
        <div
          className="mt-6 glass rounded-2xl px-6 py-4 border border-[#1e2a45] flex flex-col sm:flex-row items-center justify-between gap-4"
          style={reveal(0.5)}
        >
          <div>
            <h3 className="font-display font-bold text-white text-base">Need something custom?</h3>
            <p className="text-[#64748b] text-xs mt-0.5">Unique scope? Let&apos;s discuss.</p>
          </div>
          <button
            type="button"
            onClick={() => (window as Window & { scrollToScene?: (i: number) => void }).scrollToScene?.(7)}
            className="flex-shrink-0 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-[#0a0e1a] hover:opacity-90 transition-opacity"
          >
            Let&apos;s Talk →
          </button>
        </div>
      </div>
    </div>
  );
}
