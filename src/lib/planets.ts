export type Planet = {
  id: string;
  name: string;
  nameEn: string;
  size: number;
  color: string;
  emissive: string;
  position: [number, number, number];
  rings?: boolean;
  rotationSpeed: number;
};

// 구면좌표 → 직교좌표 변환 (카메라 [0, 1.6, 0] 기준 하늘에 배치)
// azimuth: 수평각(도, 0=정면 -Z, +는 오른쪽), elevation: 仰角(도)
function skyPos(az: number, el: number, r = 60): [number, number, number] {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return [
    r * Math.cos(e) * Math.sin(a),
    r * Math.sin(e) + 1.6,
    -r * Math.cos(e) * Math.cos(a),
  ];
}

// 행성 퍼레이드 — 황도면을 따라 하늘 왼쪽(서쪽)에서 오른쪽(동쪽)으로 배열
// 수성 · 금성 · 토성 · 목성 · 천왕성 · 해왕성
export const PLANETS: Planet[] = [
  {
    id: "mercury",
    name: "수성",
    nameEn: "Mercury",
    size: 1.4,
    color: "#b8b8b8",
    emissive: "#404040",
    position: skyPos(-58, 13),
    rotationSpeed: 0.004,
  },
  {
    id: "venus",
    name: "금성",
    nameEn: "Venus",
    size: 2.4,
    color: "#f0d8a0",
    emissive: "#8a5820",
    position: skyPos(-36, 22),
    rotationSpeed: 0.002,
  },
  {
    id: "saturn",
    name: "토성",
    nameEn: "Saturn",
    size: 3.2,
    color: "#e4d191",
    emissive: "#6a5410",
    position: skyPos(-12, 30),
    rings: true,
    rotationSpeed: 0.003,
  },
  {
    id: "jupiter",
    name: "목성",
    nameEn: "Jupiter",
    size: 4.8,
    color: "#d09040",
    emissive: "#6a3a10",
    position: skyPos(10, 27),
    rotationSpeed: 0.005,
  },
  {
    id: "uranus",
    name: "천왕성",
    nameEn: "Uranus",
    size: 2.6,
    color: "#7de8e8",
    emissive: "#105050",
    position: skyPos(30, 20),
    rotationSpeed: 0.002,
  },
  {
    id: "neptune",
    name: "해왕성",
    nameEn: "Neptune",
    size: 2.4,
    color: "#5080f0",
    emissive: "#102070",
    position: skyPos(50, 14),
    rotationSpeed: 0.002,
  },
];
