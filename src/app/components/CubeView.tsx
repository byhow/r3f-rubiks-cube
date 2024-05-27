import { CubeFace } from "../utils/constants";

interface CubeVisualProps {
  cubeState: Record<CubeFace, string[]>;
}

const CubeView: React.FC<CubeVisualProps> = ({ cubeState }) => {
  console.table(cubeState);
  return (
    <mesh>
      <meshNormalMaterial />
      <boxGeometry args={[2, 2, 2]} />
    </mesh>
  );
};

export default CubeView;
