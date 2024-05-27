import { useMemo } from "react";
import { CubeFace } from "../utils/constants";

interface CubeVisualProps {
  cubeState: Record<CubeFace, string[]>;
}

const CubeView: React.FC<CubeVisualProps> = ({ cubeState }) => {
  return (
    <mesh>
      <meshNormalMaterial />
      <boxGeometry args={[2, 2, 2]} />
      <pre>{JSON.stringify(cubeState, null, 2)}</pre>
    </mesh>
  );
};

export default CubeView;
