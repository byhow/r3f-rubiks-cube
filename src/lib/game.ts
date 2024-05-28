// rotate-utils.ts
import { CUBE_SIZE, FACES, CubeFace } from "@/lib/constants";

/**
 * rotate the rubik cube's face clockwise
 *
 * @param {string[]} face - state of the game in representation of a string array
 * @returns {string[]} - the new state of the game
 */
const rotateClockwise = (face: string[]): string[] => {
  const newFace = Array(CUBE_SIZE * CUBE_SIZE).fill("");
  for (let i = 0; i < CUBE_SIZE; i++) {
    for (let j = 0; j < CUBE_SIZE; j++) {
      newFace[j * CUBE_SIZE + (CUBE_SIZE - i - 1)] = face[i * CUBE_SIZE + j];
    }
  }
  return newFace;
};

/**
 * Rotate the rubik cube's face counter clockwise
 * @param {string[]} face - state of the game in representation of a string array
 * @returns {string[]} - the new state of the game
 */
const rotateCounterClockwise = (face: string[]): string[] => {
  const newFace = Array(CUBE_SIZE * CUBE_SIZE).fill("");
  for (let i = 0; i < CUBE_SIZE; i++) {
    for (let j = 0; j < CUBE_SIZE; j++) {
      newFace[(CUBE_SIZE - j - 1) * CUBE_SIZE + i] = face[i * CUBE_SIZE + j];
    }
  }
  return newFace;
};

/**
 * rotate the rubik's cube
 * @param cubeState 
 * @param face 
 * @param direction 
 * @returns 
 */
const rotateCube = (
  cubeState: Record<CubeFace, string[]>,
  face: CubeFace,
  direction: "cw" | "ccw"
): Record<CubeFace, string[]> => {
  const newCubeState = { ...cubeState };
  newCubeState[face] =
    direction === "cw"
      ? rotateClockwise(cubeState[face])
      : rotateCounterClockwise(cubeState[face]);
  // Update adjacent faces based on the rotation
  const adjacentFaces = getAdjacentFaces(face);
  adjacentFaces.forEach((adjacentFace: CubeFace) => {
    const adjacentFaceIndices = getAdjacentFaceIndices(
      face,
      adjacentFace,
      direction
    );
    const adjacentFaceValues = adjacentFaceIndices.map(
      (index) => cubeState[adjacentFace][index]
    );
    newCubeState[adjacentFace] = replaceValues(
      cubeState[adjacentFace],
      adjacentFaceIndices,
      adjacentFaceValues
    );
  });

  return newCubeState;
};

const getAdjacentFaces = (face: CubeFace): CubeFace[] => {
  // Return the adjacent faces based on the given face
  switch (face) {
    case "U":
      return ["L", "F", "R", "B"];
    case "L":
      return ["U", "F", "D", "B"];
    case "F":
      return ["U", "R", "D", "L"];
    case "R":
      return ["U", "B", "D", "F"];
    case "B":
      return ["U", "L", "D", "R"];
    case "D":
      return ["L", "F", "R", "B"];
    default:
      return [];
  }
};

const getAdjacentFaceIndices = (
  face: CubeFace,
  adjacentFace: CubeFace,
  direction: "cw" | "ccw"
): number[] => {
  const faceIndex = FACES.indexOf(face);
  const adjacentFaceIndex = FACES.indexOf(adjacentFace);
  const offset = Math.abs(faceIndex - adjacentFaceIndex);

  const indices: number[] = [];

  if (direction === "cw") {
    for (let i = 0; i < CUBE_SIZE; i++) {
      const baseIndex = i * CUBE_SIZE;
      for (let j = 0; j < CUBE_SIZE; j++) {
        indices.push(baseIndex + (CUBE_SIZE - 1 - j));
      }
    }
  } else {
    for (let i = 0; i < CUBE_SIZE; i++) {
      const baseIndex = i * CUBE_SIZE;
      for (let j = 0; j < CUBE_SIZE; j++) {
        indices.push(baseIndex + j);
      }
    }
  }

  const shiftedIndices = indices.map((index) => {
    const row = Math.floor(index / CUBE_SIZE);
    const col = index % CUBE_SIZE;
    const shiftedRow = (row + offset) % CUBE_SIZE;
    const shiftedCol = (col + offset) % CUBE_SIZE;
    return shiftedRow * CUBE_SIZE + shiftedCol;
  });

  return shiftedIndices;
};

const replaceValues = (
  array: string[],
  indices: number[],
  newValues: string[]
): string[] =>
  array.map((item, index) =>
    indices.includes(index) ? newValues[indices.indexOf(index)] : item
  );

export { rotateCube };
