"use client";
import { useState } from "react";
import { initialCubeState, FACES, CubeFace } from "../utils/constants";
import { rotateCube } from "../utils/game";
import { Button } from "@/components/ui/button";

const Cube3D: React.FC = () => {
  const [cubeState, setCubeState] =
    useState<Record<CubeFace, string[]>>(initialCubeState);

  const handleRotation = (face: CubeFace, direction: "cw" | "ccw") => {
    console.info(`Rotating ${face} ${direction}`);
    const newCubeState = rotateCube(cubeState, face, direction);
    setCubeState(newCubeState);
  };

  return (
    <div>
      {/* <Canvas>
        <CubeView cubeState={cubeState} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
      </Canvas> */}
      <h1 className="text-2xl font-bold">Rubik&apos;s Cube</h1>

      <div>
        {FACES.map((face) => (
          <div key={face} className="ml-4 space-x-4">
            <Button
              variant="outline"
              onClick={() => handleRotation(face, "cw")}
              className="mb-4"
            >
              Rotate {face} Clockwise
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRotation(face, "ccw")}
              className="mb-4"
            >
              Rotate {face} Counter-Clockwise
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cube3D;
