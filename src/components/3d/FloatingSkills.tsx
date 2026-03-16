"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import type { SkillCategory } from "@/lib/types";

interface SkillOrbProps {
  name: string;
  color: string;
  position: [number, number, number];
  index: number;
}

function SkillOrb({ name, color, position, index }: SkillOrbProps) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = 0.3 + index * 0.05;

  return (
    <Float
      speed={speed}
      rotationIntensity={0.4}
      floatIntensity={0.6}
      position={position}
    >
      <group>
        <mesh ref={ref}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        {/* Outer glow ring */}
        <mesh>
          <torusGeometry args={[0.24, 0.01, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
        <Text
          position={[0, -0.35, 0]}
          fontSize={0.1}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Medium.ttf"
        >
          {name}
        </Text>
      </group>
    </Float>
  );
}

interface FloatingSkillsProps {
  categories: SkillCategory[];
}

export default function FloatingSkills({ categories }: FloatingSkillsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Flatten skills and position them in a spiral
  const skillOrbs = useMemo(() => {
    const orbs: { name: string; color: string; position: [number, number, number]; index: number }[] = [];
    let idx = 0;
    categories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        const angle = (idx / 30) * Math.PI * 2 * 3; // spiral
        const radius = 1.5 + (idx % 5) * 0.5;
        const height = (idx / 30) * 4 - 2;
        orbs.push({
          name: skill.name,
          color: cat.color,
          position: [
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius,
          ],
          index: idx,
        });
        idx++;
      });
    });
    return orbs;
  }, [categories]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <group ref={groupRef}>
      {skillOrbs.map((orb) => (
        <SkillOrb key={orb.name} {...orb} />
      ))}
    </group>
  );
}
