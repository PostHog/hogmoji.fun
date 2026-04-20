import GIF from "gif.js";
import { parseGIF, decompressFrames, ParsedFrame } from "gifuct-js";
import { LayerPosition } from "./builderTemplates";

export interface ExportLayer {
  src: string | null;
  position: LayerPosition;
  visible: boolean;
}

const TRANSPARENT_HEX = "#FF00FF";
const TRANSPARENT_INT = 0xff00ff;

export function isGifDataUrl(src: string | null | undefined): src is string {
  return !!src && src.startsWith("data:image/gif");
}

export function findGifLayerIndex(layers: ExportLayer[]): number {
  return layers.findIndex((l) => l.visible && isGifDataUrl(l.src));
}

async function fetchArrayBuffer(src: string): Promise<ArrayBuffer> {
  const res = await fetch(src);
  return await res.arrayBuffer();
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawGifFrame(
  baseCanvas: HTMLCanvasElement,
  frame: ParsedFrame,
  prevFrame: ParsedFrame | null,
  snapshotBeforePrev: ImageData | null
): ImageData | null {
  const ctx = baseCanvas.getContext("2d")!;

  if (prevFrame) {
    if (prevFrame.disposalType === 2) {
      ctx.clearRect(
        prevFrame.dims.left,
        prevFrame.dims.top,
        prevFrame.dims.width,
        prevFrame.dims.height
      );
    } else if (prevFrame.disposalType === 3 && snapshotBeforePrev) {
      ctx.putImageData(snapshotBeforePrev, 0, 0);
    }
  }

  const nextSnapshot =
    frame.disposalType === 3
      ? ctx.getImageData(0, 0, baseCanvas.width, baseCanvas.height)
      : null;

  const patchCanvas = document.createElement("canvas");
  patchCanvas.width = frame.dims.width;
  patchCanvas.height = frame.dims.height;
  const patchCtx = patchCanvas.getContext("2d")!;
  const patchImage = patchCtx.createImageData(frame.dims.width, frame.dims.height);
  patchImage.data.set(frame.patch);
  patchCtx.putImageData(patchImage, 0, 0);
  ctx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

  return nextSnapshot;
}

export async function buildAnimatedGif({
  layers,
  gifLayerIndex,
  canvasWidth,
  canvasHeight,
  workerScript,
}: {
  layers: ExportLayer[];
  gifLayerIndex: number;
  canvasWidth: number;
  canvasHeight: number;
  workerScript: string;
}): Promise<Blob> {
  const gifLayer = layers[gifLayerIndex];
  if (!gifLayer.src) throw new Error("GIF layer has no source");
  const gifBuffer = await fetchArrayBuffer(gifLayer.src);
  const parsed = parseGIF(gifBuffer);
  const frames = decompressFrames(parsed, true);
  if (frames.length === 0) throw new Error("GIF has no frames");

  const staticImages = await Promise.all(
    layers.map((layer, i) =>
      !layer.visible || i === gifLayerIndex || !layer.src
        ? Promise.resolve(null)
        : loadImage(layer.src)
    )
  );

  const gifSourceCanvas = document.createElement("canvas");
  gifSourceCanvas.width = parsed.lsd.width;
  gifSourceCanvas.height = parsed.lsd.height;

  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = canvasWidth;
  frameCanvas.height = canvasHeight;
  const frameCtx = frameCanvas.getContext("2d")!;

  const encoder = new GIF({
    workers: 2,
    quality: 10,
    width: canvasWidth,
    height: canvasHeight,
    workerScript,
    transparent: TRANSPARENT_INT as unknown as string,
  });

  let prevFrame: ParsedFrame | null = null;
  let snapshotBeforePrev: ImageData | null = null;

  for (const frame of frames) {
    snapshotBeforePrev = drawGifFrame(
      gifSourceCanvas,
      frame,
      prevFrame,
      snapshotBeforePrev
    );
    prevFrame = frame;

    frameCtx.fillStyle = TRANSPARENT_HEX;
    frameCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    layers.forEach((layer, i) => {
      if (!layer.visible) return;
      if (i === gifLayerIndex) {
        frameCtx.drawImage(
          gifSourceCanvas,
          layer.position.x,
          layer.position.y,
          layer.position.width,
          layer.position.height
        );
      } else {
        const img = staticImages[i];
        if (img) {
          frameCtx.drawImage(
            img,
            layer.position.x,
            layer.position.y,
            layer.position.width,
            layer.position.height
          );
        }
      }
    });

    encoder.addFrame(frameCtx, {
      copy: true,
      delay: frame.delay,
      dispose: 2,
    });
  }

  return new Promise<Blob>((resolve, reject) => {
    encoder.on("finished", (blob) => resolve(blob));
    encoder.on("abort", () => reject(new Error("GIF encoding aborted")));
    encoder.render();
  });
}
