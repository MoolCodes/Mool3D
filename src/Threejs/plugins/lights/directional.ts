import { DirectionalType } from "../../types/types";
import { DirectionalLight, DirectionalLightHelper } from "three";
export class Directional implements DirectionalType {
  private scene: THREE.Scene;
  light: THREE.DirectionalLight;
  helper: THREE.DirectionalLightHelper;
  scope: number;
  shadowMass: number;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.scope = 100;
    this.shadowMass = 2048;
  }
  init(color: string, intensity: number): THREE.DirectionalLight {
    this.light = new DirectionalLight(color, intensity);
    this.light.castShadow = true; // 将此平行光源产生阴影的属性打开
    // 设置平行光的的阴影属性，即一个长方体的长宽高，在设定值的范围内的物体才会产生阴影
    const d = this.scope;
    this.light.shadow.camera.left = -d;
    this.light.shadow.camera.right = d;
    this.light.shadow.camera.top = d;
    this.light.shadow.camera.bottom = -d;
    this.light.shadow.camera.near = 10;
    this.light.shadow.camera.far = 8000;
    this.light.shadow.mapSize.x = this.shadowMass; // 定义阴影贴图的宽度和高度,必须为2的整数此幂
    this.light.shadow.mapSize.y = this.shadowMass; // 较高的值会以计算时间为代价提供更好的阴影质量
    // this.light.shadow.bias = -0.0005; //解决条纹阴影的出现
    this.scene.add(this.light);
    return this.light;
  }
  initHelper(size: number) {
    this.helper = new DirectionalLightHelper(this.light, size);
    this.scene.add(this.helper);
  }
  destory() {
    this.scene.remove(this.helper);
    this.scene.remove(this.light);
  }
}
