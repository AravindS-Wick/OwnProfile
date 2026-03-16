// ─── Profile ────────────────────────────────────────────────────────────────

export interface Social {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  taglines: string[];
  bio: string;
  location: string;
  available: boolean;
  openToWork: boolean;
  email: string;
  resumeUrl: string;
  socials: Social;
  stats: ProfileStat[];
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export interface Skill {
  name: string;
  level: number; // 0–100
}

export interface SkillCategory {
  id: string;
  label: string;
  color: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

// ─── Projects ───────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  live: string;
  github: string;
  featured: boolean;
  color: string;
}

// ─── Experience ─────────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
}

// ─── Certifications ─────────────────────────────────────────────────────────

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  badge: string;
  color: string;
  verifyUrl: string;
}

// ─── Services ───────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  features: string[];
}

// ─── Order Form ─────────────────────────────────────────────────────────────

export interface OrderData {
  name: string;
  email: string;
  service: string;
  budget: string;
  description: string;
  timestamp?: string;
}
