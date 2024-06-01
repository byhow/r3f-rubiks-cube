import { WebGLRenderer, Scene, Color, Vector3, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, EdgesGeometry, LineBasicMaterial, LineSegments } from 'three'
import { getFace } from './moves';
import { Sticker } from './types';
import { simColors } from './constants';

export const renderer = () => {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(300, 300)
  renderer.setPixelRatio(devicePixelRatio);
  return renderer
}

export const scene = (meshes: any) => {
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

export const createMesh = (sticker: Sticker) => {
  const geometry = new BoxGeometry(1.99, 0.1, 1.99)
  const color = simColors[getFace(sticker.dst) as keyof typeof simColors]
  const material = new MeshBasicMaterial({ color })
  const mesh = new Mesh(geometry, material)
  mesh.position.copy(sticker.pos) // we will assign the position directly from the geometric cube

  // Create edges geometry
  const edges = new EdgesGeometry(geometry);
  const lineMaterial = new LineBasicMaterial({ color: 0x000000 }); // black lines
  const lines = new LineSegments(edges, lineMaterial);
  // Add the lines to the mesh
  mesh.add(lines);

  // rotate the sticker plate 
  const current_face = getFace(sticker.pos)
  if (current_face === "F" || current_face === "B")
    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2)
  else if (current_face === "L" || current_face === "R")
    mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)
  return mesh
}

export const stickerMesh = (cube: Sticker[]) => cube.map(createMesh)
