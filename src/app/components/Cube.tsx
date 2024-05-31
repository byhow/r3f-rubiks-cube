// Cube.tsx
// the view of the cube in the browser using React
"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

import {
  applyGeometryMoves,
  drawGeometryCube,
  initializeGeometryCube,
  allGeometryMoves,
} from "@/lib/moves";
import { Sticker } from "@/lib/types";

const SCALE_FACTOR = 15; // scale factor = length of each sticker in pixels.

export default function Cube() {
  const geoCube = initializeGeometryCube();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stickers, setStickers] = useState<Sticker[]>(geoCube);

  const cube = drawGeometryCube("", stickers); // draw the cube rep from the stickers
  const allGMoves = allGeometryMoves();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    scaleCanvas(canvas, ctx);
    ctx.translate(SCALE_FACTOR / 2, SCALE_FACTOR / 2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Clear the canvas
    ctx.clearRect(
      -SCALE_FACTOR / 2,
      -SCALE_FACTOR / 2,
      canvas.width,
      canvas.height
    );

    // draw the faces
    draw(ctx, cube, 0, 0, 3); // U
    draw(ctx, cube, 9, 3, 6); // R
    draw(ctx, cube, 18, 3, 3); // F
    draw(ctx, cube, 27, 6, 3); // D
    draw(ctx, cube, 36, 3, 0); // L
    draw(ctx, cube, 45, 3, 9); // B
  }, [cube]);

  return (
    <div>
      <canvas ref={canvasRef} width={100} height={100} />
      {Object.values(allGMoves)
        .filter((m) => m.name.length == 1)
        .map((move) => (
          <Button
            key={move.name}
            variant="secondary"
            onClick={() => setStickers(applyGeometryMoves(stickers, move.name))}
            className="ml-4 mb-4"
          >
            Apply {move.name}
          </Button>
        ))}
    </div>
  );
}

// Assuming color is an array of color strings
const color = {
  U: "white",
  D: "yellow",
  L: "orange",
  R: "red",
  F: "#00aa00",
  B: "blue",
  X: "darkgray",
  o: "#fdfdc6",
  x: "blueviolet",
  y: "magenta",
};

function scaleCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  // Assuming this function scales the canvas for retina displays
  const [w, h] = [canvas.width, canvas.height];
  canvas.width *= 2;
  canvas.height *= 2;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  context.scale(2, 2);
}

function draw(
  ctx: CanvasRenderingContext2D,
  cube: string,
  idx: number,
  r: number,
  c: number
) {
  for (let i = r; i <= r + 2; i++)
    for (let j = c; j <= c + 2; j++) {
      ctx.fillStyle = color[cube[idx++] as keyof typeof color];
      ctx.fillRect(
        SCALE_FACTOR * j,
        SCALE_FACTOR * i,
        SCALE_FACTOR,
        SCALE_FACTOR
      );
      ctx.lineWidth = 2;
      ctx.strokeRect(
        SCALE_FACTOR * j,
        SCALE_FACTOR * i,
        SCALE_FACTOR,
        SCALE_FACTOR
      );
    }
}
