"use client";

// Experience is embedded inside the About scene (scene index 1)
// as a secondary panel that appears when About is active but scrolled past halfway.
// For the immersive layout this is a standalone export used directly in About.
import type { Experience as ExperienceType, Certification } from "@/lib/types";

interface ExperienceProps {
  experience: ExperienceType[];
  certifications: Certification[];
  active: boolean;
}

export default function Experience({ experience, certifications, active }: ExperienceProps) {
  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(28px)",
    transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 relative">
          <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--cyan)] via-[var(--purple)] to-transparent" />
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={exp.id} className="pl-10 relative" style={reveal(0.1 + i * 0.1)}>
                <div
                  className="absolute left-[10px] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--cyan)] bg-[var(--navy)]"
                  style={{ boxShadow: "0 0 10px var(--cyan-tint)" }}
                />
                <div className="glass rounded-2xl p-5 border border-[var(--border)] hover:border-[var(--cyan-tint)] transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">{exp.role}</h3>
                      <p className="text-[var(--cyan)] text-xs font-semibold">{exp.company}</p>
                    </div>
                    <p className="text-[var(--text-muted)] text-xs">{exp.period}</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-3">{exp.description}</p>
                  <ul className="space-y-1 mb-3">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                        <span className="text-[var(--cyan)] mt-0.5 flex-shrink-0">▹</span>{h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-[var(--border)] text-[var(--text-muted)]">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={reveal(0.2)}>
          <h3 className="font-display font-bold text-white text-base mb-4">Certifications</h3>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="glass rounded-2xl p-4 border border-[var(--border)] hover:border-[var(--cyan-tint)] transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `${cert.color}22`, color: cert.color }}
                  >
                    {cert.issuer.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs leading-tight">{cert.name}</h4>
                    <p className="text-[var(--text-muted)] text-[10px] mt-0.5">{cert.issuer} · {cert.year}</p>
                  </div>
                </div>
                {cert.verifyUrl && (
                  <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-2 block text-[10px] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors">
                    Verify ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
