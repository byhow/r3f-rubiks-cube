"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Sticker } from "@/lib/types";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { stickerMesh } from "@/lib/render";

type Cube3DProps = {
  stickers: Sticker[];
};

const Cube3D = ({ stickers }: Cube3DProps) => {
  const { scene, camera } = useThree();
  const meshesRef = useRef<Mesh[]>([]);

  useEffect(() => {
    meshesRef.current = stickerMesh(stickers);
  }, [stickers]);

  useFrame(() => {
    scene.children = meshesRef.current;
  });

  return (
    <>
      <OrbitControls camera={camera} />
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
    </>
  );
};

export default Cube3D;
