"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { AdaptiveDpr, Preload, PerformanceMonitor } from "@react-three/drei";

interface SceneProps {
  children: React.ReactNode;
  className?: string;
  camera?: {
    fov?: number;
    position?: [number, number, number];
  };
}

export default function Scene({
  children,
  className = "",
  camera = { fov: 75, position: [0, 0, 5] },
}: SceneProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: camera.fov ?? 75,
        near: 0.1,
        far: 1000,
        position: camera.position ?? [0, 0, 5],
      }}
    >
      <PerformanceMonitor
        onDecline={() => console.log("[R3F] Reducing quality for performance")}
      />
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>{children}</Suspense>
      <Preload all />
    </Canvas>
  );
}
