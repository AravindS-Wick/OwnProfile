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

export function getProfile(): Profile {
  return profileData as Profile;
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
