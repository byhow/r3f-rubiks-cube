import { Vector3 } from "three";
import { GeometryMove, Sticker } from "./types";

/**
 * convert a sticker to a face
 * @param sticker 
 * @returns 
 */
export const getFace = (sticker: Vector3) => {
  let { x, y, z } = sticker;
  return x === 3
    ? "R"
    : x === -3
      ? "L"
      : y === 3
        ? "U"
        : y === -3
          ? "D"
          : z === 3
            ? "F"
            : z === -3
              ? "B"
              : "X";
};

/**
 * generate a Geometry Cube (with Stickers) for the simulation
 * this is a solved version of the cube.
 * 
 * @returns 
 */
export const initializeGeometryCube = () => {
  let stickers = [];
  for (let face of [3, -3]) {
    for (let coord1 of [-2, 0, 2]) {
      for (let coord2 of [-2, 0, 2]) {
        stickers.push(
          ...[
            createSticker(new Vector3(face, coord1, coord2)),
            createSticker(new Vector3(coord1, face, coord2)),
            createSticker(new Vector3(coord1, coord2, face)),
          ]
        );
      }
    }
  }
  return stickers;
};

/**
 * this creates a sticker from a target and destination position
 *
 * @param pos
 * @param dst
 * @returns sticker := (target, current)
 */
export const createSticker = (pos: Vector3, dst?: Vector3): Sticker => ({
  pos,
  dst: pos || dst,
});

/**
 *
 * create_gmove("U", new Vector3(0, 1, 0), 90, (pos) => pos.y > 0);
 *
 * @param name
 * @param axis
 * @param angle
 * @param predicate
 * @returns
 */
export const createGeometryMove = (
  name: string,
  axis: Vector3,
  angle: number,
  predicate: (pos: Vector3) => boolean
): GeometryMove => ({
  name, // U, R, F, D, L, B
  axis,
  angle, // how much to rotate
  predicate,
});

/**
 * create possible geometry moves
 * 
 * @returns all geometry moves
 */
export const allGeometryMoves = () => {
  let create_move_set = (
    base_name: string,
    axis: Vector3,
    pred: (pos: Vector3) => boolean
  ) => {
    let move1 = createGeometryMove(base_name, axis, 90, pred);
    let move2 = createGeometryMove(base_name + "2", axis, 180, pred);
    let move3 = createGeometryMove(base_name + "'", axis, 270, pred);
    return [move1, move2, move3];
  };

  let U = create_move_set("U", new Vector3(0, 1, 0), (pos) => pos.y > 0);
  let u = create_move_set("u", new Vector3(0, 1, 0), (pos) => pos.y >= 0);
  let D = create_move_set("D", new Vector3(0, -1, 0), (pos) => pos.y < 0);
  let d = create_move_set("d", new Vector3(0, -1, 0), (pos) => pos.y <= 0);

  let E = create_move_set("E", new Vector3(0, 1, 0), (pos) => pos.y === 0);
  let y = create_move_set("y", new Vector3(0, 1, 0), () => true);

  let L = create_move_set("L", new Vector3(-1, 0, 0), (pos) => pos.x < 0);
  let R = create_move_set("R", new Vector3(1, 0, 0), (pos) => pos.x > 0);
  let l = create_move_set("l", new Vector3(-1, 0, 0), (pos) => pos.x <= 0);
  let r = create_move_set("r", new Vector3(1, 0, 0), (pos) => pos.x >= 0);
  let M = create_move_set("M", new Vector3(-1, 0, 0), (pos) => pos.x === 0);
  let x = create_move_set("x", new Vector3(1, 0, 0), () => true);

  let F = create_move_set("F", new Vector3(0, 0, 1), (pos) => pos.z > 0);
  let B = create_move_set("B", new Vector3(0, 0, -1), (pos) => pos.z < 0);
  let S = create_move_set("S", new Vector3(0, 0, 1), (pos) => pos.z === 0);
  let z = create_move_set("z", new Vector3(0, 0, 1), () => true);

  let gmoves: Record<string, GeometryMove> = {};
  [U, D, u, d, E, y, L, R, l, r, M, x, F, B, S, z].flat().forEach((move) => {
    gmoves[move.name] = move;
  });
  return gmoves;
};

/**
 * operate on geometry moves to the string representation
 * 
 * @param gcube 
 * @param moves 
 * @returns 
 */
export const applyGeometryMoves = (gcube: Sticker[], moves: string): Sticker[] =>
  moves
    .trim()
    .split(/ +/)
    .filter((s) => s)
    .map((m) => allGeometryMoves()[m])
    .reduce(applyGeometryMove, gcube);

/**
 * apply one geometry move to the sticker
 * 
 * @param move 
 * @param sticker 
 * @returns 
 */
const applySticker = (move: GeometryMove, sticker: Sticker) =>
  move.predicate(sticker.pos) // does the move involve this position?
    ? {
      ...sticker,
      pos: new Vector3()
        .copy(sticker.pos)
        .applyAxisAngle(move.axis, (-move.angle / 180) * Math.PI)
        .round(),
    } // if so, rotate around axis with angle
    : sticker; // else, do nothing

/**
 * apply the each geometry move to the cube
 * 
 * @param cube 
 * @param move 
 * @returns 
 */
export const applyGeometryMove = (cube: Sticker[], move: GeometryMove): Sticker[] =>
  cube.map((s) => applySticker(move, s));

/**
 * convert the facelets to a string
 * @param gcube 
 * @returns 
 */
const convertFacelets = (gcube: Sticker[]): string => {
  // URFDLB
  let scube: string[] = [];
  let fill_face = (stickers: Sticker[], idx: number) => {
    stickers
      .sort((s, t) => s.pos.z - t.pos.z || s.pos.x - t.pos.x)
      .forEach((s) => {
        scube[idx++] = getFace(s.dst);
      });
  };
  let face_rotating_moves: string[] = ["", "y x", "x", "x2", "y' x", "y2 x"];
  face_rotating_moves.forEach((moves, i) =>
    fill_face(
      applyGeometryMoves(gcube, moves).filter((s) => getFace(s.pos) === "U"),
      i * 9
    )
  );
  return scube.join("");
};

/**
 * return the facelets of the cube from the scramble
 * 
 * @param scramble 
 * @param currentBoard 
 * @returns 
 */
export const drawGeometryCube = (scramble: string, currentBoard: Sticker[]): string =>
  convertFacelets(applyGeometryMoves(currentBoard, scramble));