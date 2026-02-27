"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Wish } from "@/lib/supabase";

type Props = {
  wishes: Wish[];
};

type OrbProps = {
  wish: Wish;
  position: [number, number, number];
};

function WishOrb({ wish, position }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.5 + offset) * 0.3;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setShowCard((v) => !v)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#a0b8ff"} />
      </mesh>

      {/* 글로우 */}
      <mesh position={position} scale={1.6}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial
          color="#6c9fff"
          transparent
          opacity={hovered ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 소원 카드 팝업 */}
      {showCard && (
        <Html center position={position} style={{ pointerEvents: "auto" }}>
          <div
            className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 w-56 cursor-pointer shadow-lg"
            onClick={() => setShowCard(false)}
          >
            <p className="text-white/50 text-xs mb-1">{wish.nickname}</p>
            <p className="text-white text-sm leading-relaxed">{wish.message}</p>
            <p className="text-white/30 text-xs mt-2">탭하여 닫기</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function WishOrbs({ wishes }: Props) {
  const positions = useMemo<[number, number, number][]>(() => {
    return wishes.map(() => [
      (Math.random() - 0.5) * 28,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 8,
    ]);
  }, [wishes]);

  return (
    <>
      {wishes.map((wish, i) => (
        <WishOrb key={wish.id} wish={wish} position={positions[i]} />
      ))}
    </>
  );
}
