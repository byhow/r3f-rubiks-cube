import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Vector3 } from "three";

// Assuming color is an array of color strings
const color = {
  U: "white",
  D: "yellow",
  L: "orange",
  R: "red",
  F: "#00aa00",
  B: "blue",
  X: "darkgray",
  // more colors for step 8
  o: "#fdfdc6",
  x: "blueviolet",
  y: "magenta",
};

function scaleCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  // Assuming this function scales the canvas for retina displays
  const [w, h] = [canvas.width, canvas.height];
  canvas.width *= 2;
  canvas.height *= 2;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  context.scale(2, 2);
}

type Sticker = {
  pos: Vector3;
  dst: Vector3;
};

interface GeometryMove {
  name: string;
  axis: Vector3;
  angle: number;
  predicate: (pos: Vector3) => boolean;
}

export function Vis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stickers, setStickers] = useState<Sticker[]>(solved_gcube());
  const cube = draw_gcube("", stickers);
  useEffect(() => {
    const sc = 15; // scale factor = length of each sticker in pixels.
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Retina display hacks
    scaleCanvas(canvas, ctx);
    ctx.translate(sc / 2, sc / 2);
  }, []); // Empty dependency array means this hook runs only once when the component mounts

  useEffect(() => {
    const sc = 15; // scale factor = length of each sticker in pixels.
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Clear the canvas
    ctx.clearRect(-sc / 2, -sc / 2, canvas.width, canvas.height);

    function draw(idx: number, r: number, c: number) {
      for (let i = r; i <= r + 2; i++)
        for (let j = c; j <= c + 2; j++) {
          ctx.fillStyle = color[cube[idx++] as keyof typeof color];
          ctx.fillRect(sc * j, sc * i, sc, sc);
          ctx.lineWidth = 2;
          ctx.strokeRect(sc * j, sc * i, sc, sc);
        }
    }

    // draw the faces
    draw(0, 0, 3); // U
    draw(9, 3, 6); // R
    draw(18, 3, 3); // F
    draw(27, 6, 3); // D
    draw(36, 3, 0); // L
    draw(45, 3, 9); // B
  }, [cube]);

  return (
    <div>
      <canvas ref={canvasRef} width={100} height={100} />
      {Object.values(gmoves())
        .filter((m) => m.name.length == 1)
        .map((move) => (
          <Button
            key={move.name}
            variant="secondary"
            onClick={() => setStickers(apply_gmoves(stickers, move.name))}
            className="ml-4 mb-4"
          >
            Apply {move.name}
          </Button>
        ))}
    </div>
  );
}

/**
 * map permutation to cycle
 * @param cycle
 * @returns
 */
const perm_from_cycle = (cycle: number[]) => {
  let perms = [];
  for (let i = 0; i < cycle.length - 1; i++) {
    perms.push([cycle[i], cycle[i + 1]]);
  }
  perms.push([cycle[cycle.length - 1], cycle[0]]);
  return perms;
};

const S = (f: string, i: number) => {
  return "URFDLB".indexOf(f) * 9 + i - 1;
};

const uMoves = [
  perm_from_cycle([S("U", 1), S("U", 3), S("U", 9), S("U", 7)]),
  perm_from_cycle([S("U", 2), S("U", 6), S("U", 8), S("U", 4)]),
  perm_from_cycle([S("F", 1), S("L", 1), S("B", 1), S("R", 1)]),
  perm_from_cycle([S("F", 2), S("L", 2), S("B", 2), S("R", 2)]),
  perm_from_cycle([S("F", 3), S("L", 3), S("B", 3), S("R", 3)]),
].flat();

/**
 * 2d moves based on facelets
 * @param cube
 * @param perm
 * @returns
 */
const applyMove = (cube: Array<string>, perm: number[][]) => {
  let new_cube = [...cube];
  for (let x of perm) {
    new_cube[x[1]] = cube[x[0]];
  }
  return new_cube;
};

/**
 * this creates a sticker from a target and destination position
 *
 * @param pos
 * @param dst
 * @returns sticker := (target, current)
 */
const createSticker = (pos: Vector3, dst?: Vector3): Sticker => ({
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
const create_gmove = (
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

const apply_sticker = (move: GeometryMove, sticker: Sticker) =>
  move.predicate(sticker.pos) // does the move involve this position?
    ? {
        ...sticker,
        pos: new Vector3()
          .copy(sticker.pos)
          .applyAxisAngle(move.axis, (-move.angle / 180) * Math.PI)
          .round(),
      } // if so, rotate around axis with angle
    : sticker; // else, do nothing

const apply_gmove = (cube: Sticker[], move: GeometryMove) =>
  cube.map((s) => apply_sticker(move, s));

const get_face = (sticker: Vector3) => {
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

const gmoves = () => {
  let create_move_set = (
    base_name: string,
    axis: Vector3,
    pred: (pos: Vector3) => boolean
  ) => {
    let move1 = create_gmove(base_name, axis, 90, pred);
    let move2 = create_gmove(base_name + "2", axis, 180, pred);
    let move3 = create_gmove(base_name + "'", axis, 270, pred);
    return [move1, move2, move3];
    // return [move1];
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

const apply_gmoves = (gcube: Sticker[], moves: string): Sticker[] =>
  moves
    .trim()
    .split(/ +/)
    .filter((s) => s)
    .map((m) => gmoves()[m])
    .reduce(apply_gmove, gcube);

const gcube_to_fcube = (gcube: Sticker[]): string => {
  // URFDLB
  let scube: string[] = [];
  let fill_face = (stickers: Sticker[], idx: number) => {
    stickers
      .sort((s, t) => s.pos.z - t.pos.z || s.pos.x - t.pos.x)
      .forEach((s) => {
        scube[idx++] = get_face(s.dst);
      });
  };
  let face_rotating_moves: string[] = ["", "y x", "x", "x2", "y' x", "y2 x"];
  face_rotating_moves.forEach((moves, i) =>
    fill_face(
      apply_gmoves(gcube, moves).filter((s) => get_face(s.pos) === "U"),
      i * 9
    )
  );
  return scube.join("");
};
const solved_gcube = () => {
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

const draw_gcube = (scramble: string, currentBoard: Sticker[]) =>
  gcube_to_fcube(apply_gmoves(currentBoard, scramble));

export default Vis;
