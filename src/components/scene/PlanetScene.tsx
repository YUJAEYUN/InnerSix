"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import StarField from "./StarField";
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
  const controlsRef = useRef(null);

  return (
    <Canvas
      camera={{ position: [3, 2, 14], fov: 60 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      dpr={[1, 1.5]}
      style={{ background: "#050510" }}
    >
      {/* 조명 */}
      <ambientLight intensity={0.08} color="#1a1a3a" />
      <directionalLight
        position={[-30, 10, 10]}
        intensity={1.8}
        color="#fff5e0"
      />
      <pointLight position={[0, 0, 0]} intensity={0.4} color="#4060ff" distance={40} />

      <Suspense fallback={null}>
        <StarField />

        {/* 6개 행성 */}
        {PLANETS.map((planet) => (
          <Planet key={planet.id} planet={planet} />
        ))}

        {/* 소원 구체 */}
        {showOrbs && wishes.length > 0 && <WishOrbs wishes={wishes} />}
      </Suspense>

      {/* 카메라 컨트롤 */}
      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom
        enablePan={false}
        minDistance={6}
        maxDistance={30}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />

      {/* 포스트 프로세싱 */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.4}
        />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
