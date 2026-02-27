"use client";

import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";

// 지구에서 밤하늘을 올려다보는 1인칭 카메라
export default function SkyCamera() {
  const { camera, gl } = useThree();

  const state = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    azimuth: -5,    // 수평 회전 (도) — 행성 무리 중심 방향
    elevation: 22,  // 수직 각도 (도) — 하늘 올려다보기
  });

  const updateCamera = useCallback(() => {
    const az = (state.current.azimuth * Math.PI) / 180;
    const el = (state.current.elevation * Math.PI) / 180;
    const lx = Math.cos(el) * Math.sin(az);
    const ly = Math.sin(el);
    const lz = -Math.cos(el) * Math.cos(az);
    camera.lookAt(
      camera.position.x + lx * 100,
      camera.position.y + ly * 100,
      camera.position.z + lz * 100
    );
  }, [camera]);

  useEffect(() => {
    camera.position.set(0, 1.6, 0); // 사람 눈높이
    updateCamera();

    const el = gl.domElement;

    // 마우스
    const onDown = (e: PointerEvent) => {
      state.current.isDragging = true;
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!state.current.isDragging) return;
      const dx = e.clientX - state.current.lastX;
      const dy = e.clientY - state.current.lastY;
      state.current.azimuth  -= dx * 0.25;
      state.current.elevation = Math.max(5, Math.min(70, state.current.elevation + dy * 0.15));
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
      updateCamera();
    };
    const onUp = () => { state.current.isDragging = false; };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, [camera, gl, updateCamera]);

  // 자동으로 천천히 하늘을 가로질러 스캔
  useFrame(() => {
    if (!state.current.isDragging) {
      state.current.azimuth -= 0.025;
      updateCamera();
    }
  });

  return null;
}
