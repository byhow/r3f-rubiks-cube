"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { initialCubeState, FACES, CubeFace } from "../utils/constants";
import { rotateCube } from "../utils/game";
import CubeView from "./CubeView";

const Cube3D: React.FC = () => {
  const [cubeState, setCubeState] =
    useState<Record<CubeFace, string[]>>(initialCubeState);

  const handleRotation = (face: CubeFace, direction: "cw" | "ccw") => {
    const newCubeState = rotateCube(cubeState, face, direction);
    setCubeState(newCubeState);
  };

  return (
    <div>
      <Canvas>
        <CubeView cubeState={cubeState} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
      </Canvas>
      <div>
        {FACES.map((face) => (
          <div key={face}>
            <button onClick={() => handleRotation(face, "cw")}>
              Rotate {face} Clockwise
            </button>
            <button onClick={() => handleRotation(face, "ccw")}>
              Rotate {face} Counter-Clockwise
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cube3D;
