export const CUBE_SIZE = 3
export const FACES = ['U', 'L', 'F', 'R', 'B', 'D'] as const;
export type CubeFace = typeof FACES[number];

// Initialize the cube with a default solved state
export const initialCubeState: Record<CubeFace, string[]> = FACES.reduce((acc, face) => {
  const faceValues = Array(CUBE_SIZE ** 2).fill(face);
  acc[face] = faceValues;
  return acc;
}, {} as Record<CubeFace, string[]>);
