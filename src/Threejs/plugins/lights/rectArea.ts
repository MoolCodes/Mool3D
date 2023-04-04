import { Group, RectAreaLight } from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaType } from "../../types/types";
import { RectAreaLightUniformsLib } from "./rectlib";
export class RectArea implements RectAreaType {
  private scene: THREE.Scene;
  light: THREE.RectAreaLight;
  areaLight: THREE.Group;
  helper: any;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.areaLight = new Group();
    RectAreaLightUniformsLib.init();
  }
  init(color: string, width: number, height: number, intensity: number) {
    this.light = new RectAreaLight(color, intensity, width, height);
    this.scene.add(this.light);
  }

  initArea(
    color: string,
    width: number,
    intensity: number,
    position: [number, number, number]
  ) {
    const rectLight = new RectAreaLight(color, intensity, width, width);
    rectLight.position.set(position[0], width + position[1], position[2]);
    rectLight.lookAt(position[0], width / 2, position[2]);

    const rectLight1 = new RectAreaLight(color, intensity, width, width);
    rectLight1.position.set(
      width / 2 + position[0],
      width / 2 + position[1],
      position[2]
    );
    rectLight1.lookAt(position[0], width / 2 + position[1], position[2]);
    const rectLight2 = new RectAreaLight(color, intensity, width, width);
    rectLight2.position.set(
      -width / 2 + position[0],
      width / 2 + position[1],
      position[2]
    );
    rectLight2.lookAt(position[0], width / 2 + position[1], position[2]);

    const rectLight3 = new RectAreaLight(color, intensity, width, width);
    rectLight3.position.set(position[0], position[1], position[2]);
    rectLight3.lookAt(position[0], width / 2 + position[1], position[2]);
    const rectLight4 = new RectAreaLight(color, intensity, width, width);
    rectLight4.position.set(
      position[0],
      width / 2 + position[1],
      width / 2 + position[2]
    );
    rectLight4.lookAt(position[0], width / 2 + position[1], position[2]);

    const rectLight5 = new RectAreaLight(color, intensity, width, width);
    rectLight5.position.set(
      position[0],
      width / 2 + position[1],
      -width / 2 + position[2]
    );
    rectLight5.lookAt(position[0], width / 2 + position[1], position[2]);

    this.areaLight.add(
      rectLight,
      rectLight1,
      rectLight2,
      rectLight3,
      rectLight4,
      rectLight5
    );
    this.scene.add(this.areaLight);
  }

  initHelper() {
    this.helper = new RectAreaLightHelper(this.light, "#fff");
    this.scene.add(this.helper);
  }
  initBoxHelper() {
    this.areaLight.traverse((light) => {
      this.areaLight.add(
        new RectAreaLightHelper(light as THREE.RectAreaLight, "#fff")
      );
    });
  }
  destory() {
    this.scene.remove(this.helper);
    this.areaLight && this.scene.remove(this.areaLight);
    this.light && this.scene.remove(this.light);
  }
}
