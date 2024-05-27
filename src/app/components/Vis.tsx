import React, { useRef, useEffect } from "react";

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
  let devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  context.scale(devicePixelRatio, devicePixelRatio);
}

export function Vis({ cube }: { cube: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sc = 15; // scale factor = length of each sticker in pixels.
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Retina display hacks
    scaleCanvas(canvas, ctx);
    ctx.translate(sc / 2, sc / 2);

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

  return <canvas ref={canvasRef} width={100} height={100} />;
}
import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

// Define the initial state of the Rubik's Cube
type CubeletColor = "U" | "L" | "F" | "R" | "B" | "D";
type CubeletState = [
  [
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor
  ],
  [
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor
  ],
  [
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor
  ],
  [
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor
  ],
  [
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor
  ],
  [
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor,
    CubeletColor
  ]
];

const initialState: CubeletState = [
  ["U", "U", "U", "U", "U", "U", "U", "U", "U"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["F", "F", "F", "F", "F", "F", "F", "F", "F"],
  ["R", "R", "R", "R", "R", "R", "R", "R", "R"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "B"],
  ["D", "D", "D", "D", "D", "D", "D", "D", "D"],
];

// Define the colors for each face
const colors: Record<CubeletColor, string> = {
  U: "yellow",
  L: "orange",
  F: "red",
  R: "green",
  B: "blue",
  D: "white",
};

// Define the Cube component
interface CubeProps {
  position: [number, number, number];
  color: string;
}

const Cube: React.FC<CubeProps> = ({ position, color }) => {
  const mesh = useRef<Mesh>(null!);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshBasicMaterial attach="material" color={color} />
    </mesh>
  );
};

// Define the RubiksCube component
const RubiksCube: React.FC = () => {
  const [state, setState] = useState<CubeletState>(initialState);

  // Render the Rubik's Cube
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {state.map((face, faceIndex) =>
        face.map((cubelet, cubeletIndex) => (
          <Cube
            key={`${cubelet}-${faceIndex}-${cubeletIndex}`}
            position={[
              (faceIndex % 3) - 1,
              1 - Math.floor(cubeletIndex / 3),
              Math.floor(faceIndex / 3) - 1,
            ]}
            color={colors[cubelet]}
          />
        ))
      )}
    </Canvas>
  );
};

// Render the App
const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <RubiksCube />
    </div>
  );
};

export default App;
