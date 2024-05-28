import { WebGLRenderer, Scene, Color, Vector3, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import { applyGeometryMove, getFace, initializeGeometryCube } from './moves';
import { Sticker } from './types';

export const renderer = () => {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(300, 300)
  renderer.setPixelRatio(devicePixelRatio);
  return renderer
}


export const scene = (meshes) => {
  const scene = new Scene();
  scene.background = new Color(0x444444);
  for (let mesh of meshes) scene.add(mesh);
  return scene;
};

export const camera = () => {
  const camera_position = new Vector3(5, 6, 6)
  let camera = new PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.copy(camera_position)
  camera.lookAt(new Vector3(0, 0, 0))
  return camera
}


const simColors = {
  U: 16777215,
  D: 16776960,
  F: 43520,
  B: 255,
  L: 16753920,
  R: 16711680
}

export const create_mesh = (sticker: Sticker) => {
  const geometry = new BoxGeometry(1.6, 0.1, 1.6)
  const color = simColors[getFace(sticker.dst) as keyof typeof simColors]
  const material = new MeshBasicMaterial({ color })
  const mesh = new Mesh(geometry, material)
  mesh.position.copy(sticker.pos) // IMPORTANT: we assign the position directly from the geometric cube

  // rotate the sticker plate 
  const current_face = getFace(sticker.pos)
  if (current_face === "F" || current_face === "B")
    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2)
  else if (current_face === "L" || current_face === "R")
    mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)
  return mesh
}

export const sticker_mesh = (cube) => cube.map(create_mesh)

export function key_monitor(simCube): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key === "ENTER") {
      simCube = initializeGeometryCube();
    } else if (key in key_mapping) {
      simCube = applyGeometryMove(simCube, key_mapping[key]);
    }
  });
}

const key_mapping = {
  5: "M",
  6: "M",
  I: "R",
  K: "R'",
  W: "B",
  O: "B'",
  S: "D",
  L: "D'",
  D: "L",
  E: "L'",
  J: "U",
  F: "U'",
  H: "F",
  G: "F'",
  ";": "y",
  A: "y'",
  U: "r",
  R: "l'",
  M: "r'",
  V: "l",
  T: "x",
  Y: "x",
  N: "x'",
  B: "x'",
  ".": "M'",
  X: "M'",
  P: "z",
  Q: "z'",
  Z: "d",
  C: "u'",
  ",": "u",
  "/": "d'",
}