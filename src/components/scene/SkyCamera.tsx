"use client";

import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";

export default function SkyCamera() {
  const { camera, gl } = useThree();

  const state = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    azimuth: -5,
    elevation: 22,
  });

  const updateCamera = useCallback(() => {
    const az = (state.current.azimuth * Math.PI) / 180;
    const el = (state.current.elevation * Math.PI) / 180;
    camera.lookAt(
      camera.position.x + Math.cos(el) * Math.sin(az) * 100,
      camera.position.y + Math.sin(el) * 100,
      camera.position.z + -Math.cos(el) * Math.cos(az) * 100
    );
  }, [camera]);

  useEffect(() => {
    camera.position.set(0, 1.6, 0);
    updateCamera();

    const canvas = gl.domElement;

    const onDown = (e: PointerEvent) => {
      // 브라우저 기본 터치 동작(스크롤, 핀치줌) 차단 — 핵심 수정
      e.preventDefault();
      state.current.isDragging = true;
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
    };

    const onMove = (e: PointerEvent) => {
      if (!state.current.isDragging) return;
      e.preventDefault();
      const dx = e.clientX - state.current.lastX;
      const dy = e.clientY - state.current.lastY;
      // 모바일은 민감도 낮춰서 부드럽게
      const sensitivity = e.pointerType === "touch" ? 0.18 : 0.25;
      state.current.azimuth -= dx * sensitivity;
      state.current.elevation = Math.max(5, Math.min(70, state.current.elevation + dy * 0.12));
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
    };

    const onUp = () => { state.current.isDragging = false; };

    // passive: false → preventDefault() 허용
    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);

    // 캔버스 자체의 터치 액션 CSS 비활성화
    canvas.style.touchAction = "none";

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, [camera, gl, updateCamera]);

  useFrame(() => {
    if (!state.current.isDragging) {
      state.current.azimuth -= 0.025;
      updateCamera();
    }
  });

  return null;
}
