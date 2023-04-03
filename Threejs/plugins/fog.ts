import { FogExp2, Fog as TFog } from "three";
import { FogType } from "../types/types";
export class Fog implements FogType {
  private scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  initFog(color: string, near: number, far: number) {
    this.scene.fog = new TFog(color, near, far);
  }
  initFogExp(color: string, density: number) {
    this.scene.fog = new FogExp2(color, density);
  }
}
