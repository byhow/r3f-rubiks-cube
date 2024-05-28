import { Vector3 } from "three";

export type Sticker = {
  pos: Vector3;
  dst: Vector3;
};

export interface GeometryMove {
  name: string;
  axis: Vector3;
  angle: number;
  predicate: (pos: Vector3) => boolean;
}
