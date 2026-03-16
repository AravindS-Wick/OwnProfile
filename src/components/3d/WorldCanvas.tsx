"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore, SCENES } from "@/lib/scrollStore";

// ─── Camera controller driven by scroll ─────────────────────────────────────
// Camera flies through different positions for each scene
const CAMERA_POSITIONS: [number, number, number][] = [
  [0, 0, 7],    // hero      — straight on
  [3, 1, 6],    // about     — slight right drift
  [0, 2, 8],    // skills    — elevated
  [-2, 0, 6],   // proj 1    — left drift
  [0, -1, 5],   // proj 2    — lower
  [2, 0, 6],    // proj 3    — right
  [0, 0, 9],    // services  — pull back
  [0, 0, 6],    // contact   — straight
];

function CameraController() {
  const { camera } = useThree();
  const { currentScene, progress } = useScrollStore();
  const targetPos = useRef(new THREE.Vector3(0, 0, 7));
  const currentPos = useRef(new THREE.Vector3(0, 0, 7));

  useFrame(() => {
    const nextScene = Math.min(currentScene + 1, SCENES.length - 1);
    const from = CAMERA_POSITIONS[currentScene];
    const to = CAMERA_POSITIONS[nextScene];

    targetPos.current.set(
      THREE.MathUtils.lerp(from[0], to[0], progress),
      THREE.MathUtils.lerp(from[1], to[1], progress),
      THREE.MathUtils.lerp(from[2], to[2], progress)
    );

    // Smooth damp toward target
    currentPos.current.lerp(targetPos.current, 0.06);
    camera.position.copy(currentPos.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Persistent particle field that reacts to scroll ────────────────────────
function GlobalParticles() {
  const ref = useRef<THREE.Points>(null);
  const { currentScene } = useScrollStore();

  const count = 3000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color("#00d4ff"),
    new THREE.Color("#7c3aed"),
    new THREE.Color("#ffffff"),
    new THREE.Color("#00d4ff"),
  ];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 4 + Math.random() * 10;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025 + currentScene * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.6}
        size={0.035}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene-specific 3D geometry that morphs with scroll ──────────────────────
function SceneGeometry() {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const { currentScene } = useScrollStore();
  const morphProgress = useRef(0);

  // Colors per scene
  const sceneColors = [
    "#00d4ff", // hero
    "#7c3aed", // about
    "#f59e0b", // skills
    "#00d4ff", // proj 1
    "#f43f5e", // proj 2
    "#10b981", // proj 3
    "#a78bfa", // services
    "#00d4ff", // contact
  ];

  useFrame(({ clock }) => {
    if (!ref.current || !wireRef.current) return;
    const t = clock.getElapsedTime();

    morphProgress.current += (currentScene - morphProgress.current) * 0.04;

    const color = new THREE.Color(sceneColors[currentScene] ?? "#00d4ff");
    (ref.current.material as THREE.MeshBasicMaterial).color.lerp(color, 0.05);
    (wireRef.current.material as THREE.MeshBasicMaterial).color.lerp(color, 0.05);

    ref.current.rotation.x = t * 0.15 + morphProgress.current * 0.4;
    ref.current.rotation.y = t * 0.2 + morphProgress.current * 0.3;
    wireRef.current.rotation.x = -t * 0.1;
    wireRef.current.rotation.y = t * 0.15;

    // Pulse scale
    const pulse = 1 + Math.sin(t * 0.8) * 0.04;
    ref.current.scale.setScalar(pulse);
    wireRef.current.scale.setScalar(pulse * 1.15);
  });

  return (
    <group position={[2.5, 0, -1]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Floating rings (decorative) ─────────────────────────────────────────────
function FloatingRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const { currentScene } = useScrollStore();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) {
      r1.current.rotation.x = t * 0.4 + currentScene * 0.5;
      r1.current.rotation.y = t * 0.2;
      r1.current.position.x = Math.sin(t * 0.3) * 0.3 - 2.5;
    }
    if (r2.current) {
      r2.current.rotation.x = -t * 0.3;
      r2.current.rotation.z = t * 0.25 + currentScene * 0.3;
      r2.current.position.y = Math.sin(t * 0.4) * 0.4;
    }
    if (r3.current) {
      r3.current.rotation.y = t * 0.35;
      r3.current.position.x = Math.cos(t * 0.25) * 0.2 + 1;
      r3.current.position.y = Math.sin(t * 0.2) * 0.3 - 1.5;
    }
  });

  return (
    <>
      <mesh ref={r1} position={[-2.5, 0.8, -2]}>
        <torusGeometry args={[1.1, 0.012, 16, 80]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} />
      </mesh>
      <mesh ref={r2} position={[0, 0, -3]}>
        <torusGeometry args={[1.8, 0.008, 16, 100]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.2} />
      </mesh>
      <mesh ref={r3} position={[1, -1.5, -1.5]}>
        <torusGeometry args={[0.6, 0.014, 16, 60]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

// ─── Main World Canvas ────────────────────────────────────────────────────────
export default function WorldCanvas() {
  return (
    <Canvas
      className="fixed inset-0 w-full h-full"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 70, near: 0.1, far: 200, position: [0, 0, 7] }}
    >
      <PerformanceMonitor onDecline={() => {}} />
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>
        <CameraController />
        <GlobalParticles />
        <SceneGeometry />
        <FloatingRings />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#00d4ff" />
        <pointLight position={[-5, -5, 3]} intensity={0.4} color="#7c3aed" />
      </Suspense>
    </Canvas>
  );
}
