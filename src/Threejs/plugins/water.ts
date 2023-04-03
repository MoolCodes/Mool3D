import { WaterParams, WaterType, WaterShaderParams } from "../types/types";
import { CircleGeometry } from "three";
import { Water as WaterShader } from "../shader/water";

export class Water implements WaterType {
  private texture: THREE.TextureLoader;
  private scene: THREE.Scene | THREE.Group;
  private animate: Fn<number>[];
  water: WaterShaderParams;
  private radius: number;
  private textureWidth: number;
  private textureHeight: number;
  private sunPosition: THREE.Vector3;
  private sunColor: string;
  private waterColor: string;
  private distortionScale: number;
  private waterPosition: THREE.Vector3;
  time: number;
  constructor(options: WaterParams) {
    this.radius = options.radius;
    this.textureWidth = options.textureWidth;
    this.textureHeight = options.textureHeight;
    this.sunPosition = options.sunPosition;
    this.sunColor = options.sunColor;
    this.waterColor = options.waterColor;
    this.distortionScale = options.distortionScale;
    this.waterPosition = options.waterPosition;
    this.time = options.time;
    this.texture = options.texture;
    this.scene = options.scene;
    this.animate = options.animate;
  }
  init() {
    this.water = new WaterShader(new CircleGeometry(this.radius, 32), {
      textureWidth: this.textureWidth,
      textureHeight: this.textureHeight,
      waterNormals: this.texture,
      sunDirection: this.sunPosition,
      sunColor: this.sunColor,
      waterColor: this.waterColor,
      distortionScale: this.distortionScale,
      fog: (this.scene as THREE.Scene).fog !== undefined,
    });
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.copy(this.waterPosition);
    this.scene.add(this.water);
    this.animate.push(() => {
      (this.water as any).material.uniforms["time"].value += this.time;
    });
  }
  destroy() {
    this.scene.remove(this.water);
  }
}
