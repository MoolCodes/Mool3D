import { SpotLight as Spot, SpotLightHelper, Object3D } from "three";
import { SpotType } from "../../types/types";
export class SpotLight implements SpotType {
  private scene: THREE.Scene;
  light: THREE.SpotLight;
  helper: THREE.SpotLightHelper;
  shadowMass: number;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.shadowMass = 2048;
  }
  init(
    color: string,
    intensity: number,
    distance: number,
    target?: THREE.Vector3
  ): THREE.SpotLight {
    this.light = new Spot(color, intensity, distance);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
    this.light.shadow.camera.near = 10;
    this.light.shadow.camera.fov = 10;
    this.light.shadow.camera.far = 8000;
    this.light.shadow.focus = 1;
    if (target) {
      const targetObject = new Object3D();
      targetObject.position.copy(target);
      this.scene.add(targetObject);
      this.light.target = targetObject;
    }
    this.scene.add(this.light);
    return this.light;
  }
  initHelper(size: number) {
    this.helper = new SpotLightHelper(this.light, size);
    this.scene.add(this.helper);
  }
  destory() {
    this.scene.remove(this.helper);
    this.scene.remove(this.light);
  }
}
