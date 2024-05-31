"use client";
import { initializeGeometryCube } from "@/lib/moves";
import { Canvas } from "@react-three/fiber";

import { camera, scene, stickerMesh } from "@/lib/render";
import { Sticker } from "@/lib/types";

type Cube3DProps = {
  stickers: Sticker[];
};

const Cube3D = ({ stickers }: Cube3DProps) => (
  <Canvas
    scene={scene(stickerMesh(stickers ?? initializeGeometryCube()))}
    camera={camera()}
  >
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

export default Cube3D;
