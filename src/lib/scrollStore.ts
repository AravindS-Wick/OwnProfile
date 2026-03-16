import { create } from "zustand";

export const SCENES = [
  "hero",
  "about",
  "skills",
  "projects-1",
  "projects-2",
  "projects-3",
  "services",
  "contact",
] as const;

export type SceneId = (typeof SCENES)[number];

export const SCENE_LABELS: Record<SceneId, string> = {
  hero: "Home",
  about: "About",
  skills: "Skills",
  "projects-1": "Projects",
  "projects-2": "Projects",
  "projects-3": "Projects",
  services: "Services",
  contact: "Contact",
};

export const SCENE_TEASERS: Record<SceneId, string> = {
  hero: "Who I am →",
  about: "What I know →",
  skills: "What I've built →",
  "projects-1": "Next project →",
  "projects-2": "Next project →",
  "projects-3": "How I can help →",
  services: "Let's talk →",
  contact: "",
};

interface ScrollState {
  currentScene: number; // index into SCENES
  progress: number; // 0–1 within current scene
  isTransitioning: boolean;
  setScene: (index: number) => void;
  setProgress: (p: number) => void;
  setTransitioning: (v: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  currentScene: 0,
  progress: 0,
  isTransitioning: false,
  setScene: (index) => set({ currentScene: index }),
  setProgress: (p) => set({ progress: p }),
  setTransitioning: (v) => set({ isTransitioning: v }),
}));
