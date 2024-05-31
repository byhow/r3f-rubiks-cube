"use client";
import { initializeGeometryCube } from "@/lib/moves";
import { Canvas } from "@react-three/fiber";

import { camera, scene, stickerMesh } from "@/lib/render";
import { useState } from "react";
import { Sticker } from "@/lib/types";

export default function Cube3D() {
  const geoCube = initializeGeometryCube();
  const [stickers, setStickers] = useState<Sticker[]>(geoCube);

  return (
    <Canvas scene={scene(stickerMesh(geoCube))} camera={camera()}>
      <mesh>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
}
