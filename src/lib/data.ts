import type {
  Profile,
  SkillsData,
  Project,
  Experience,
  Certification,
  Service,
} from "./types";

// Import JSON files — Next.js resolves these at build time
import profileData from "../../data/profile.json";
import skillsData from "../../data/skills.json";
import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import certificationsData from "../../data/certifications.json";
import servicesData from "../../data/services.json";

// ── Env helpers ───────────────────────────────────────────────────────────────
// These only run server-side (or at build time). NEXT_PUBLIC_ vars are also
// available client-side after hydration.
function envStr(key: string, fallback: string): string {
  return process.env[key] || fallback;
}
function envBool(key: string, fallback: boolean): boolean {
  const v = process.env[key];
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

export function getProfile(): Profile {
  const base = profileData as Profile;

  // Env overrides — any NEXT_PUBLIC_PROFILE_* var wins over the JSON value
  return {
    ...base,
    name: envStr("NEXT_PUBLIC_PROFILE_NAME", base.name),
    title: envStr("NEXT_PUBLIC_PROFILE_TITLE", base.title),
    bio: envStr("NEXT_PUBLIC_PROFILE_BIO", base.bio),
    location: envStr("NEXT_PUBLIC_PROFILE_LOCATION", base.location),
    available: envBool("NEXT_PUBLIC_PROFILE_AVAILABLE", base.available),
    email: envStr("NEXT_PUBLIC_PROFILE_EMAIL", base.email),
    resumeUrl: envStr("NEXT_PUBLIC_PROFILE_RESUME_URL", base.resumeUrl ?? "/resume.pdf"),
    socials: {
      github: envStr("NEXT_PUBLIC_SOCIAL_GITHUB", base.socials.github ?? ""),
      linkedin: envStr("NEXT_PUBLIC_SOCIAL_LINKEDIN", base.socials.linkedin ?? ""),
      twitter: envStr("NEXT_PUBLIC_SOCIAL_TWITTER", base.socials.twitter ?? ""),
      instagram: envStr("NEXT_PUBLIC_SOCIAL_INSTAGRAM", base.socials.instagram ?? ""),
    },
    stats: [
      {
        label: "Projects Completed",
        value: envStr("NEXT_PUBLIC_STAT_PROJECTS", base.stats[0]?.value ?? "20+"),
      },
      {
        label: "Technologies",
        value: envStr("NEXT_PUBLIC_STAT_TECHNOLOGIES", base.stats[1]?.value ?? "15+"),
      },
      {
        label: "Certifications",
        value: envStr("NEXT_PUBLIC_STAT_CERTIFICATIONS", base.stats[2]?.value ?? "2"),
      },
      {
        label: "Years Experience",
        value: envStr("NEXT_PUBLIC_STAT_EXPERIENCE", base.stats[3]?.value ?? "3+"),
      },
    ],
  };
}

export function getDefaultTheme(): string {
  return envStr("NEXT_PUBLIC_DEFAULT_THEME", "cyberpunk");
}

export function getSkills(): SkillsData {
  return skillsData as SkillsData;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getFeaturedProjects(): Project[] {
  return (projectsData as Project[]).filter((p) => p.featured);
}

export function getExperience(): Experience[] {
  return experienceData as Experience[];
}

export function getCertifications(): Certification[] {
  return certificationsData as Certification[];
}

export function getServices(): Service[] {
  return servicesData as Service[];
}
