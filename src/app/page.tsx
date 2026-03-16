import dynamic from "next/dynamic";
import {
  getProfile,
  getSkills,
  getProjects,
  getServices,
} from "@/lib/data";
import LenisProvider from "@/components/ui/LenisProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import ProjectScene from "@/components/sections/ProjectScene";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

// WorldCanvas and ScrollContainer are client-only (WebGL + scroll state)
const WorldCanvas = dynamic(() => import("@/components/3d/WorldCanvas"), { ssr: false });
const ScrollContainer = dynamic(() => import("@/components/ui/ScrollContainer"), { ssr: false });

export default function Home() {
  const profile = getProfile();
  const skills = getSkills();
  const projects = getProjects();
  const services = getServices();

  // Pick the first 3 projects for the 3 project scenes
  const p1 = projects[0] ?? projects[0];
  const p2 = projects[1] ?? projects[0];
  const p3 = projects[2] ?? projects[0];

  return (
    <LenisProvider>
      {/* Persistent 3D canvas — fixed behind everything */}
      <WorldCanvas />

      {/* Fixed Navbar */}
      <Navbar profile={profile} />

      {/*
        ScrollContainer creates a tall scrollable div.
        Each child gets its own 100vh sticky slot.
        The 3D WorldCanvas reacts to scroll state via Zustand.
      */}
      <ScrollContainer>
        {/* Scene 0 — Hero */}
        <div className="scene-panel">
          <Hero profile={profile} />
        </div>

        {/* Scene 1 — About */}
        <div className="scene-panel">
          <About profile={profile} />
        </div>

        {/* Scene 2 — Skills */}
        <div className="scene-panel">
          <Skills data={skills} />
        </div>

        {/* Scene 3 — Project 1 */}
        <div className="scene-panel">
          <ProjectScene project={p1} sceneIndex={3} />
        </div>

        {/* Scene 4 — Project 2 */}
        <div className="scene-panel">
          <ProjectScene project={p2} sceneIndex={4} />
        </div>

        {/* Scene 5 — Project 3 */}
        <div className="scene-panel">
          <ProjectScene project={p3} sceneIndex={5} />
        </div>

        {/* Scene 6 — Services */}
        <div className="scene-panel">
          <Services services={services} />
        </div>

        {/* Scene 7 — Contact */}
        <div className="scene-panel">
          <Contact services={services} profile={profile} />
        </div>
      </ScrollContainer>

      {/* Footer sits after the scroll container */}
      <Footer profile={profile} />
    </LenisProvider>
  );
}
