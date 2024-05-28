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

export default function Vis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stickers, setStickers] = useState<Sticker[]>(initializeGeometryCube());
  const cube = drawGeometryCube("", stickers);

  useEffect(() => {
    const sc = 15; // scale factor = length of each sticker in pixels.
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Retina display hacks
    scaleCanvas(canvas, ctx);
    ctx.translate(sc / 2, sc / 2);
  }, []);

  useEffect(() => {
    const sc = 15; // scale factor = length of each sticker in pixels.
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Clear the canvas
    ctx.clearRect(-sc / 2, -sc / 2, canvas.width, canvas.height);

    function draw(idx: number, r: number, c: number) {
      for (let i = r; i <= r + 2; i++)
        for (let j = c; j <= c + 2; j++) {
          ctx.fillStyle = color[cube[idx++] as keyof typeof color];
          ctx.fillRect(sc * j, sc * i, sc, sc);
          ctx.lineWidth = 2;
          ctx.strokeRect(sc * j, sc * i, sc, sc);
        }
    }

    // draw the faces
    draw(0, 0, 3); // U
    draw(9, 3, 6); // R
    draw(18, 3, 3); // F
    draw(27, 6, 3); // D
    draw(36, 3, 0); // L
    draw(45, 3, 9); // B
  }, [cube]);

  return (
    <div>
      <canvas ref={canvasRef} width={100} height={100} />
      {Object.values(allGeometryMoves())
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
  // more colors for step 8
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
