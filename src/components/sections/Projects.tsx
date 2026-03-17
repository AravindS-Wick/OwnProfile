"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";

interface ProjectsProps {
  projects: Project[];
}

function ProjectCard({ project, active }: { project: Project; active: boolean }) {
  return (
    <div
      className={`flex-shrink-0 w-80 sm:w-96 glass rounded-3xl overflow-hidden border transition-all duration-500 ${
        active
          ? "border-[var(--cyan-dim)] scale-105 shadow-xl shadow-[var(--cyan-tint)]"
          : "border-[var(--border)] scale-95 opacity-60"
      }`}
    >
      {/* Image placeholder */}
      <div
        className="relative h-48 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}11)` }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
              style={{ borderColor: project.color, color: project.color }}
            >
              <span className="text-2xl font-display font-bold">
                {project.title.charAt(0)}
              </span>
            </div>
          </div>
        )}
        {/* Color accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: project.color }}
        />
      </div>

      <div className="p-6">
        <h3 className="font-display font-bold text-white text-lg mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                background: `${project.color}18`,
                color: project.color,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-lg text-sm font-semibold text-[var(--navy)] transition-opacity hover:opacity-80"
              style={{ background: project.color }}
            >
              Live ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--text-muted)] transition-all"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => Math.max(0, a - 1));
  const next = () => setActive((a) => Math.min(projects.length - 1, a + 1));

  return (
    <section id="projects" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <p className="section-label">What I&apos;ve Built</p>
        <div className="flex items-end justify-between mt-3">
          <h2 className="section-heading text-white">
            Featured{" "}
            <span className="text-gradient">Projects</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={active === 0}
              className="w-10 h-10 rounded-full glass border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--cyan)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ←
            </button>
            <button
              onClick={next}
              disabled={active === projects.length - 1}
              className="w-10 h-10 rounded-full glass border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--cyan)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex gap-6 px-4 sm:px-6 overflow-x-auto scrollbar-hide pb-4 transition-all duration-500">
        <div
          className="flex gap-6 transition-transform duration-500"
          style={{ transform: `translateX(-${active * 1}px)` }}
        >
          {projects.map((project, i) => (
            <div key={project.id} onClick={() => setActive(i)}>
              <ProjectCard project={project} active={i === active} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2 bg-[var(--cyan)]"
                : "w-2 h-2 bg-[var(--border)] hover:bg-[var(--text-muted)]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
