"use client";

import { useState } from "react";
import { useScrollStore } from "@/lib/scrollStore";
import type { Service, Profile, OrderData } from "@/lib/types";

interface ContactProps {
  services: Service[];
  profile: Profile;
}

type FormState = "idle" | "submitting" | "success" | "error";

const BUDGET_OPTIONS = ["< $500", "$500–$1,000", "$1,000–$2,500", "$2,500–$5,000", "$5,000+", "Let's discuss"];

const inputCls = "w-full bg-[var(--navy)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--border)] focus:outline-none focus:border-[var(--cyan)] transition-colors";
const labelCls = "block text-[10px] text-[var(--text-muted)] mb-1.5 uppercase tracking-widest font-semibold";

export default function Contact({ services, profile }: ContactProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 7;

  const [form, setForm] = useState<OrderData>({ name: "", email: "", service: "", budget: "", description: "" });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service || !form.description) return;
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }
      setState("success");
      setForm({ name: "", email: "", service: "", budget: "", description: "" });
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/95 via-[var(--navy)]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/50 via-transparent to-[var(--navy)]/80 pointer-events-none" />

      {/* Large background number */}
      <div
        className="absolute -top-8 -right-4 font-display font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(6rem, 18vw, 16rem)",
          lineHeight: 1,
          opacity: active ? 0.3 : 0,
          transition: "opacity 1s ease 0.3s",
          WebkitTextStroke: "2px var(--border)",
          WebkitTextFillColor: "transparent",
        }}
        aria-hidden
      >
        07
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: heading + contact info ── */}
          <div className="lg:col-span-4 space-y-8">
            <div style={reveal(0.05)}>
              <p className="section-label mb-4">Start a Project</p>
              <h2
                className="font-display font-black text-white leading-[1.15] mb-4 pb-1"
                style={{ fontSize: "clamp(2rem, 4vw, 3.8rem)" }}
              >
                Let&apos;s Build<br />
                <span className="text-gradient">Something</span>
              </h2>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Fill in the details — I&apos;ll respond within 24 hours.
              </p>
            </div>

            {/* Contact details — minimal list */}
            <div className="space-y-4" style={reveal(0.2)}>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-xl bg-[var(--cyan-tint)] flex items-center justify-center text-sm flex-shrink-0">📧</span>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Email</p>
                  <p className="text-sm text-white group-hover:text-[var(--cyan)] transition-colors">{profile.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[var(--cyan-tint)] flex items-center justify-center text-sm flex-shrink-0">📍</span>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Location</p>
                  <p className="text-sm text-white">{profile.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#10b98118] flex items-center justify-center text-sm flex-shrink-0">🟢</span>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Status</p>
                  <p className="text-sm text-[#10b981]">{profile.available ? "Available for work" : "Currently busy"}</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-4" style={reveal(0.3)}>
              {profile.socials.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors border-b border-transparent hover:border-[var(--cyan)] pb-0.5">
                  GitHub ↗
                </a>
              )}
              {profile.socials.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors border-b border-transparent hover:border-[var(--cyan)] pb-0.5">
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-8" style={reveal(0.15)}>
            <form onSubmit={handleSubmit} className="rounded-3xl p-6 border border-[var(--border)] bg-[var(--surface)]/40">
              {state === "success" ? (
                <div className="text-center py-14">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="font-display font-bold text-white text-2xl mb-2">Request received!</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-6">Expect a reply within 24 hours.</p>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className="px-6 py-2.5 rounded-full text-sm border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--cyan)] transition-all"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelCls} htmlFor="contact-name">Name *</label>
                      <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="contact-email">Email *</label>
                      <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelCls} htmlFor="contact-service">Service *</label>
                      <select id="contact-service" name="service" value={form.service} onChange={handleChange} required className={inputCls}>
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                        <option value="custom">Custom / Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="contact-budget">Budget</label>
                      <select id="contact-budget" name="budget" value={form.budget} onChange={handleChange} className={inputCls}>
                        <option value="">Select range</option>
                        {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className={labelCls} htmlFor="contact-description">Project Description *</label>
                    <textarea
                      id="contact-description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell me about your project, goals, timeline..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {state === "error" && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {errorMsg || "Something went wrong. Please try again."}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] text-[var(--border)]">Response within 24 hours</p>
                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="px-8 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] text-[var(--navy)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {state === "submitting" ? "Sending…" : "Send Request →"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
