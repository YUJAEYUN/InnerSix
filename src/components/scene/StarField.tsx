"use client";

import { Stars } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function StarField() {
  const { gl } = useThree();
  const isMobile = gl.domElement.width < 640;

  return (
    <Stars
      radius={120}
      depth={60}
      count={isMobile ? 3000 : 7000}
      factor={4}
      saturation={0.3}
      fade
      speed={0.3}
    />
  );
}
