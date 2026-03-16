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

export default function Contact({ services, profile }: ContactProps) {
  const currentScene = useScrollStore((s) => s.currentScene);
  const active = currentScene === 7;

  const [form, setForm] = useState<OrderData>({ name: "", email: "", service: "", budget: "", description: "" });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(28px)",
    transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0a0e1a]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/50 via-transparent to-[#0a0e1a]/80 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left info */}
          <div className="lg:col-span-2 space-y-4">
            <div style={reveal(0.05)}>
              <p className="section-label">Let&apos;s Work Together</p>
              <h2
                className="font-display font-black text-white mt-2"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Start a <span className="text-gradient">Project</span>
              </h2>
              <p className="text-[#64748b] text-sm mt-3 max-w-sm">
                Fill in the details — I&apos;ll respond within 24 hours. Every order is tracked.
              </p>
            </div>

            <div className="glass rounded-2xl p-5 border border-[#1e2a45] space-y-3" style={reveal(0.2)}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#00d4ff18] flex items-center justify-center text-sm">📧</div>
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-xs text-white hover:text-[#00d4ff] transition-colors">{profile.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#00d4ff18] flex items-center justify-center text-sm">📍</div>
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Location</p>
                  <p className="text-xs text-white">{profile.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#10b98118] flex items-center justify-center text-sm">🟢</div>
                <div>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wider">Status</p>
                  <p className="text-xs text-[#10b981]">{profile.available ? "Available for work" : "Currently busy"}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2" style={reveal(0.3)}>
              {profile.socials.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer"
                  className="glass px-4 py-2 rounded-xl text-xs text-[#64748b] border border-[#1e2a45] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-all">
                  GitHub ↗
                </a>
              )}
              {profile.socials.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="glass px-4 py-2 rounded-xl text-xs text-[#64748b] border border-[#1e2a45] hover:text-[#00d4ff] hover:border-[#00d4ff] transition-all">
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3" style={reveal(0.15)}>
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 border border-[#1e2a45]">
              {state === "success" ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">🚀</div>
                  <h3 className="font-display font-bold text-white text-xl mb-1">Order Received!</h3>
                  <p className="text-[#64748b] text-sm">I&apos;ve been notified. Expect a reply within 24 hours.</p>
                  <button type="button" onClick={() => setState("idle")}
                    className="mt-5 px-5 py-2 rounded-xl text-sm border border-[#1e2a45] text-[#94a3b8] hover:text-white hover:border-[#00d4ff] transition-all">
                    Submit Another
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[10px] text-[#64748b] mb-1.5 uppercase tracking-wider font-medium">Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                        className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2e3a55] focus:outline-none focus:border-[#00d4ff] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#64748b] mb-1.5 uppercase tracking-wider font-medium">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                        className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2e3a55] focus:outline-none focus:border-[#00d4ff] transition-colors" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[10px] text-[#64748b] mb-1.5 uppercase tracking-wider font-medium">Service *</label>
                      <select name="service" value={form.service} onChange={handleChange} required title="Select a service"
                        className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d4ff] transition-colors">
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                        <option value="custom">Custom / Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#64748b] mb-1.5 uppercase tracking-wider font-medium">Budget</label>
                      <select name="budget" value={form.budget} onChange={handleChange} title="Select budget range"
                        className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d4ff] transition-colors">
                        <option value="">Select range</option>
                        {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[10px] text-[#64748b] mb-1.5 uppercase tracking-wider font-medium">Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                      placeholder="Tell me about your project, goals, timeline..."
                      className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2e3a55] focus:outline-none focus:border-[#00d4ff] transition-colors resize-none" />
                  </div>

                  {state === "error" && (
                    <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {errorMsg || "Something went wrong. Please try again."}
                    </div>
                  )}

                  <button type="submit" disabled={state === "submitting"}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-[#0a0e1a] hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {state === "submitting" ? "Sending..." : "Send Project Request →"}
                  </button>

                  <p className="text-center text-[10px] text-[#2e3a55] mt-3">
                    Response within 24 hours · All orders tracked in Google Sheets
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
