// this is the base file for the cube simulation with facelets representation
/**
 * map permutation to cycle
 * 
 * example moves:
 * const uMoves = [
 *   permFromCycle([S("U", 1), S("U", 3), S("U", 9), S("U", 7)]),
 *   permFromCycle([S("U", 2), S("U", 6), S("U", 8), S("U", 4)]),
 *   permFromCycle([S("F", 1), S("L", 1), S("B", 1), S("R", 1)]),
 *   permFromCycle([S("F", 2), S("L", 2), S("B", 2), S("R", 2)]),
 *   permFromCycle([S("F", 3), S("L", 3), S("B", 3), S("R", 3)]),
 * ].flat();
 * 
 * @param cycle
 * @returns
 */
const permFromCycle = (cycle: number[]) => {
  let perms = [];
  for (let i = 0; i < cycle.length - 1; i++) {
    perms.push([cycle[i], cycle[i + 1]]);
  }
  perms.push([cycle[cycle.length - 1], cycle[0]]);
  return perms;
};

/**
 * facelet to index
 * @param f 
 * @param i 
 * @returns 
 */
const S = (f: string, i: number) => {
  return "URFDLB".indexOf(f) * 9 + i - 1;
};

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