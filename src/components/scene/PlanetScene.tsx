"use client";

import { Suspense, useMemo } from "react";
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
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 1.6, 0], fov: 75 }}
      gl={{
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
        powerPreference: "high-performance",
      }}
      dpr={isMobile ? 1 : [1, 1.5]}
      frameloop="always"
      style={{ background: "#050510" }}
    >
      <SkyCamera />

      <ambientLight intensity={0.06} color="#10103a" />
      <directionalLight position={[-80, 20, -40]} intensity={1.6} color="#ffe8c0" />

      <Suspense fallback={null}>
        <StarField />
        {PLANETS.map((planet) => (
          <Planet key={planet.id} planet={planet} />
        ))}
        {showOrbs && wishes.length > 0 && <WishOrbs wishes={wishes} />}
      </Suspense>

      {/* 모바일: Bloom만 (Vignette 제거) / 데스크탑: 둘 다 */}
      {isMobile ? (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.85}
            intensity={0.8}
            mipmapBlur={false}
          />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            intensity={1.8}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.9} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
