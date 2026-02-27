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

export const PLANETS: Planet[] = [
  {
    id: "mercury",
    name: "수성",
    nameEn: "Mercury",
    size: 0.38,
    color: "#a8a8a8",
    emissive: "#3a3a3a",
    position: [-9, 1.2, -1],
    rotationSpeed: 0.004,
  },
  {
    id: "venus",
    name: "금성",
    nameEn: "Venus",
    size: 0.85,
    color: "#e8cda0",
    emissive: "#7a5a20",
    position: [-5, -0.5, 1],
    rotationSpeed: 0.002,
  },
  {
    id: "saturn",
    name: "토성",
    nameEn: "Saturn",
    size: 1.3,
    color: "#e4d191",
    emissive: "#5a4a10",
    position: [1, 1, -2],
    rings: true,
    rotationSpeed: 0.003,
  },
  {
    id: "jupiter",
    name: "목성",
    nameEn: "Jupiter",
    size: 1.9,
    color: "#c88b3a",
    emissive: "#5a3a10",
    position: [6, -0.8, 1],
    rotationSpeed: 0.005,
  },
  {
    id: "uranus",
    name: "천왕성",
    nameEn: "Uranus",
    size: 1.0,
    color: "#7de8e8",
    emissive: "#104040",
    position: [11, 0.5, -1],
    rotationSpeed: 0.002,
  },
  {
    id: "neptune",
    name: "해왕성",
    nameEn: "Neptune",
    size: 0.95,
    color: "#4b70dd",
    emissive: "#102060",
    position: [15.5, -0.5, 1],
    rotationSpeed: 0.002,
  },
];
