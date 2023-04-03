import { HemisphereLight, HemisphereLightHelper } from "three";
import { SkyLightType } from "../../types/types";
export class SkyLight implements SkyLightType {
  private scene: THREE.Scene;
  light: THREE.HemisphereLight;
  helper: THREE.HemisphereLightHelper;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  init(
    skyColor: string,
    earthColor: string,
    intensity: number
  ): THREE.HemisphereLight {
    this.light = new HemisphereLight(skyColor, earthColor, intensity);
    this.scene.add(this.light);
    return this.light;
  }
  initHelper(size: number) {
    this.helper = new HemisphereLightHelper(this.light, size);
    this.scene.add(this.helper);
  }
  destory() {
    this.scene.remove(this.helper);
    this.scene.remove(this.light);
  }
}
