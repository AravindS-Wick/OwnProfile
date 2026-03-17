"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore, SCENES } from "@/lib/scrollStore";
import { useThemeStore, getTheme } from "@/lib/themeStore";

// ─── Camera: smooth cinematic drift per scene ────────────────────────────────
// Each position is tuned to complement the section layout
const CAMERA_POSITIONS: [number, number, number][] = [
  [0, 0, 8],     // hero      — centered, generous depth
  [-1.5, 0.5, 7], // about    — slight left, geometry on right
  [0, 1.5, 9],   // skills    — elevated pullback
  [-2.5, 0, 6],  // proj 1   — hard left drift
  [0, -1.5, 6],  // proj 2   — pull down
  [2.5, 0.5, 6], // proj 3   — hard right
  [0, 0, 11],    // services  — wide pullback
  [0, -0.5, 7],  // contact   — slight down
];

function CameraController() {
  const { camera } = useThree();
  const { currentScene, progress } = useScrollStore();
  const target = useRef(new THREE.Vector3(0, 0, 8));
  const current = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(() => {
    const next = Math.min(currentScene + 1, SCENES.length - 1);
    const from = CAMERA_POSITIONS[currentScene];
    const to = CAMERA_POSITIONS[next];
    target.current.set(
      THREE.MathUtils.lerp(from[0], to[0], progress),
      THREE.MathUtils.lerp(from[1], to[1], progress),
      THREE.MathUtils.lerp(from[2], to[2], progress)
    );
    current.current.lerp(target.current, 0.018);
    camera.position.copy(current.current);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Deep-space star field (static, very subtle) ─────────────────────────────
function StarField() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 12 + Math.random() * 18;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Mostly white, occasional accent tint
      const bright = 0.4 + Math.random() * 0.6;
      col[i * 3]     = bright;
      col[i * 3 + 1] = bright;
      col[i * 3 + 2] = bright + Math.random() * 0.3; // slight blue bias
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.004;
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
        opacity={0.55}
        size={0.022}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Accent particle stream — scene-reactive foreground particles ─────────────
function AccentParticles() {
  const ref = useRef<THREE.Points>(null);
  const { currentScene } = useScrollStore();
  const themeId = useThemeStore((s) => s.themeId);

  const { positions, colors } = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Clustered near center-left, spreading outward
      pos[i * 3]     = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      col[i * 3]     = 0;
      col[i * 3 + 1] = 0.83;
      col[i * 3 + 2] = 1;
    }
    return { positions: pos, colors: col };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.018 + currentScene * 0.18;
    ref.current.rotation.z = Math.sin(t * 0.006) * 0.04;
    // Update color from theme
    const theme = getTheme(themeId);
    const c = new THREE.Color(theme.accent);
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.color.lerp(c, 0.05);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors={false}
        color="#00d4ff"
        transparent
        opacity={0.45}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Primary sculpture — icosahedron that morphs color per scene ──────────────
function Primarysculpture() {
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const { currentScene } = useScrollStore();
  const themeId = useThemeStore((s) => s.themeId);

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
    if (!solidRef.current || !wireRef.current) return;
    const t = clock.getElapsedTime();
    const theme = getTheme(themeId);
    const baseColor = sceneColors[currentScene] ?? theme.accent;
    const c = new THREE.Color(baseColor);
    (solidRef.current.material as THREE.MeshBasicMaterial).color.lerp(c, 0.025);
    (wireRef.current.material as THREE.MeshBasicMaterial).color.lerp(c, 0.025);

    solidRef.current.rotation.x = t * 0.05;
    solidRef.current.rotation.y = t * 0.08 + currentScene * 0.25;
    wireRef.current.rotation.x = -t * 0.04;
    wireRef.current.rotation.y = t * 0.065 + currentScene * 0.2;

    const pulse = 1 + Math.sin(t * 0.6) * 0.03;
    solidRef.current.scale.setScalar(pulse);
    wireRef.current.scale.setScalar(pulse * 1.12);
  });

  return (
    <group position={[2.2, 0.3, -0.5]}>
      <mesh ref={solidRef}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

// ─── Secondary sculpture — torus knot, offset left ───────────────────────────
function SecondaryKnot() {
  const ref = useRef<THREE.Mesh>(null);
  const { currentScene } = useScrollStore();

  const knotColors = [
    "#7c3aed", // hero
    "#00d4ff", // about
    "#10b981", // skills
    "#f43f5e", // proj 1
    "#00d4ff", // proj 2
    "#a78bfa", // proj 3
    "#f59e0b", // services
    "#7c3aed", // contact
  ];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const c = new THREE.Color(knotColors[currentScene] ?? "#7c3aed");
    (ref.current.material as THREE.MeshBasicMaterial).color.lerp(c, 0.02);
    ref.current.rotation.x = t * 0.04;
    ref.current.rotation.z = t * 0.055;
    // Y offset floats slowly
    ref.current.position.y = -1.8 + Math.sin(t * 0.2) * 0.15;
  });

  return (
    <mesh ref={ref} position={[-2.8, -1.8, -2]}>
      <torusKnotGeometry args={[0.5, 0.12, 80, 12, 2, 3]} />
      <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.22} />
    </mesh>
  );
}

// ─── Floating plane grid — subtle, far back ───────────────────────────────────
function GridPlane() {
  const ref = useRef<THREE.Mesh>(null);
  const { currentScene, progress } = useScrollStore();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = -0.35 + Math.sin(t * 0.05) * 0.02;
    // Drift position with scene
    ref.current.position.y = -3.5 - currentScene * 0.08 + progress * 0.08;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + Math.sin(t * 0.3) * 0.01;
  });

  return (
    <mesh ref={ref} position={[0, -3.5, -4]} rotation={[-0.35, 0, 0]}>
      <planeGeometry args={[30, 30, 28, 28]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.045} />
    </mesh>
  );
}

// ─── Ambient glow sphere — very dim, behind everything ───────────────────────
function GlowCore() {
  const ref = useRef<THREE.Mesh>(null);
  const themeId = useThemeStore((s) => s.themeId);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const theme = getTheme(themeId);
    const c = new THREE.Color(theme.accent);
    (ref.current.material as THREE.MeshBasicMaterial).color.lerp(c, 0.02);
    const s = 1 + Math.sin(t * 0.25) * 0.08;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <sphereGeometry args={[2.5, 16, 16]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.018} />
    </mesh>
  );
}

// ─── Main canvas ──────────────────────────────────────────────────────────────
export default function WorldCanvas() {
  return (
    <Canvas
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 65, near: 0.1, far: 200, position: [0, 0, 8] }}
    >
      <PerformanceMonitor onDecline={() => {}} />
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>
        <CameraController />
        <StarField />
        <AccentParticles />
        <GridPlane />
        <GlowCore />
        <Primarysculpture />
        <SecondaryKnot />
      </Suspense>
    </Canvas>
  );
}
