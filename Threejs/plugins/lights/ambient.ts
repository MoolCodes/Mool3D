import { AmbientLight } from "three";
import { AmbientParams, AmbientType } from "../../types/types";
export class Ambient implements AmbientType {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  constructor(options: AmbientParams) {
    this.scene = options.scene;
    this.renderer = options.renderer;
  }
  setLight(exposure: number, intensity: number) {
    this.renderer.toneMappingExposure = exposure;
    const obj3d = this.scene.getObjectByName("ambient_light");

    if (obj3d === undefined) {
      console.log(obj3d);
      const light = new AmbientLight(0xffffff, exposure);
      light.name = "ambient_light";
      this.scene.add(light);
    } else {
      if (obj3d instanceof AmbientLight) {
        obj3d.intensity = intensity;
      }
    }
  }
}
