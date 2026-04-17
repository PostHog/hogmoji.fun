export interface LayerPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TemplateLayer {
  id: string;
  name: string;
  file: string;
  position: LayerPosition;
  visible: boolean;
}

export interface BuilderTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  canvasWidth: number;
  canvasHeight: number;
  layers: TemplateLayer[];
  activeLayerIndex: number;
}

export const builderTemplates: BuilderTemplate[] = [
  {
    id: "hog-offers",
    name: "Hog offers",
    description: "Create a hedgehog offering something special",
    thumbnail: "/hogs/posthog-hedgehog.png",
    canvasWidth: 128,
    canvasHeight: 128,
    layers: [
      {
        id: "base",
        name: "Base hog",
        file: "/hogs/posthog-hedgehog.png",
        position: { x: 0, y: 0, width: 128, height: 128 },
        visible: true,
      },
      {
        id: "offering",
        name: "Your image",
        file: "",
        position: { x: 63, y: 83, width: 36, height: 36 },
        visible: true,
      },
      {
        id: "arm",
        name: "Hog arm",
        file: "/hogs/posthog-hedgehog-offers-arm.png",
        position: { x: 0, y: 0, width: 128, height: 128 },
        visible: true,
      },
    ],
    activeLayerIndex: 1,
  },
  {
    id: "hog-takes",
    name: "Hog takes",
    description: "Create a hedgehog taking something",
    thumbnail: "/hogs/posthog-hedgehog-takes.png",
    canvasWidth: 128,
    canvasHeight: 128,
    layers: [
      {
        id: "base",
        name: "Base hog",
        file: "/hogs/posthog-hedgehog-takes.png",
        position: { x: 0, y: 0, width: 128, height: 128 },
        visible: true,
      },
      {
        id: "item",
        name: "Your image",
        file: "",
        position: { x: 32, y: 66, width: 48, height: 48 },
        visible: true,
      },
      {
        id: "arm",
        name: "Hog arm",
        file: "/hogs/posthog-hedgehog-takes-arm.png",
        position: { x: 0, y: 0, width: 128, height: 128 },
        visible: true,
      },
    ],
    activeLayerIndex: 1,
  },
];

export function getTemplateById(id: string): BuilderTemplate | undefined {
  return builderTemplates.find((t) => t.id === id);
}
