"use client";

import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";

// 행성이 분포한 방위각 범위 (약간 여유 추가)
const AZ_MIN = -72;   // 수성 왼쪽 여백
const AZ_MAX = 65;    // 해왕성 오른쪽 여백
const AUTO_SPEED = 0.018; // 자동 이동 속도 (도/프레임)

export default function SkyCamera() {
  const { camera, gl } = useThree();

  const state = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    azimuth: -5,    // 시작: 행성들 중앙 부근
    elevation: 22,
    autoDir: -1 as 1 | -1,  // -1: 왼쪽(수성 방향), 1: 오른쪽(해왕성 방향)
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
      const sensitivity = e.pointerType === "touch" ? 0.18 : 0.25;
      state.current.azimuth -= dx * sensitivity;
      state.current.elevation = Math.max(5, Math.min(70, state.current.elevation + dy * 0.12));
      state.current.lastX = e.clientX;
      state.current.lastY = e.clientY;
      updateCamera();
    };

    const onUp = () => {
      state.current.isDragging = false;
      // 드래그 후 범위 밖이면 클램프 + 방향 전환
      if (state.current.azimuth < AZ_MIN) {
        state.current.azimuth = AZ_MIN;
        state.current.autoDir = 1;
      } else if (state.current.azimuth > AZ_MAX) {
        state.current.azimuth = AZ_MAX;
        state.current.autoDir = -1;
      }
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);
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
    if (state.current.isDragging) return;

    state.current.azimuth += AUTO_SPEED * state.current.autoDir;

    // 경계에서 방향 반전
    if (state.current.azimuth <= AZ_MIN) {
      state.current.azimuth = AZ_MIN;
      state.current.autoDir = 1;
    } else if (state.current.azimuth >= AZ_MAX) {
      state.current.azimuth = AZ_MAX;
      state.current.autoDir = -1;
    }

    updateCamera();
  });

  return null;
}
