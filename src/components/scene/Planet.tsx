"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Planet as PlanetType } from "@/lib/planets";

type Props = {
  planet: PlanetType;
};

export default function Planet({ planet }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.0005;
    }
  });

  const glowIntensity = hovered ? 0.6 : 0.2;

  return (
    <group position={planet.position}>
      {/* 메인 행성 구체 */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.06 : 1}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={glowIntensity}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* 대기 글로우 */}
      <mesh scale={1.08}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={hovered ? 0.08 : 0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 토성 고리 */}
      {planet.rings && (
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 80]} />
          <meshBasicMaterial
            color="#c8b560"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover 툴팁 */}
      {hovered && (
        <Html
          center
          position={[0, planet.size + 0.6, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-center whitespace-nowrap">
            <p className="text-white text-sm font-medium">{planet.name}</p>
            <p className="text-white/50 text-xs">{planet.nameEn}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
