"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import StarField from "./StarField";
import SkyCamera from "./SkyCamera";
import Planet from "./Planet";
import WishOrbs from "./WishOrbs";
import { PLANETS } from "@/lib/planets";
import type { Wish } from "@/lib/supabase";
import * as THREE from "three";

type Props = {
  wishes: Wish[];
  showOrbs: boolean;
};

export default function PlanetScene({ wishes, showOrbs }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 0], fov: 75 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      dpr={[1, 1.5]}
      style={{ background: "#050510" }}
    >
      {/* 지구에서 올려다보는 1인칭 카메라 */}
      <SkyCamera />

      {/* 조명 — 낮은 고도에서 비추는 달빛/새벽 느낌 */}
      <ambientLight intensity={0.06} color="#10103a" />
      <directionalLight
        position={[-80, 20, -40]}
        intensity={1.6}
        color="#ffe8c0"
      />

      <Suspense fallback={null}>
        <StarField />

        {/* 6개 행성 — 하늘에 배치 */}
        {PLANETS.map((planet) => (
          <Planet key={planet.id} planet={planet} />
        ))}

        {/* 소원 구체 */}
        {showOrbs && wishes.length > 0 && <WishOrbs wishes={wishes} />}
      </Suspense>

      {/* 포스트 프로세싱 */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          intensity={1.8}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
