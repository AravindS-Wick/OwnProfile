"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 4000;

export default function HeroParticles() {
  const meshRef = useRef<THREE.Points>(null);
  useThree();

  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse for parallax
  if (typeof window !== "undefined") {
    window.onmousemove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  // Generate particle positions, colors, sizes
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const colorPalette = [
      new THREE.Color("#00d4ff"), // cyan
      new THREE.Color("#7c3aed"), // purple
      new THREE.Color("#ffffff"), // white
      new THREE.Color("#00d4ff"),
      new THREE.Color("#ffffff"),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 8;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 4;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Slow rotation
    meshRef.current.rotation.y = t * 0.04;
    meshRef.current.rotation.x = Math.sin(t * 0.02) * 0.15;

    // Mouse parallax
    meshRef.current.rotation.y += mouse.current.x * 0.002;
    meshRef.current.rotation.x += mouse.current.y * 0.001;

    // Breathe effect on the whole field
    const scale = 1 + Math.sin(t * 0.3) * 0.02;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        size={0.04}
        depthWrite={false}
      />
    </points>
  );
}

// Floating geometric ring
export function HeroRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.2;
    ref.current.position.y = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <mesh ref={ref} position={[2.5, 0, -2]}>
      <torusGeometry args={[1.2, 0.015, 16, 100]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
    </mesh>
  );
}

// Abstract floating icosahedron
export function HeroIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.z = t * 0.1;
    ref.current.position.y = Math.sin(t * 0.4) * 0.3;
  });

  return (
    <mesh ref={ref} position={[-3, 0.5, -3]}>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.4} />
    </mesh>
  );
}
