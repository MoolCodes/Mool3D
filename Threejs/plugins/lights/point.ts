import { PointLight as Point, PointLightHelper } from "three";
import { PointLightType } from "../../types/types";
export class PointLight implements PointLightType {
  private scene: THREE.Scene;
  light: THREE.PointLight;
  helper: THREE.PointLightHelper;
  shadowMass: number;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.shadowMass = 2048;
  }
  init(
    color: string,
    intensity: number,
    distance: number,
    decay?: number
  ): THREE.PointLight {
    this.light = new Point(color, intensity, distance, decay);
    this.light.castShadow = true;
    this.light.shadow.camera.near = 10;
    this.light.shadow.camera.far = 8000;
    this.light.shadow.mapSize.x = this.shadowMass; // 定义阴影贴图的宽度和高度,必须为2的整数此幂
    this.light.shadow.mapSize.y = this.shadowMass; // 较高的值会以计算时间为代价提供更好的阴影质量
    // this.light.shadow.bias = -0.0005; //解决条纹阴影的出现
    this.scene.add(this.light);
    return this.light;
  }
  initHelper(size: number) {
    this.helper = new PointLightHelper(this.light, size);
    this.scene.add(this.helper);
  }
  destory() {
    this.scene.remove(this.helper);
    this.scene.remove(this.light);
  }
}
