import { Sprite as TSprite, SpriteMaterial, FrontSide } from "three";
import { SpriteType, SpriteParams } from "../types/types";
import { Object3D } from "./object";
export class Sprite extends Object3D implements SpriteType {
  sprite: THREE.Sprite;
  constructor() {
    super();
  }
  init(options: SpriteParams) {
    this.sprite = new TSprite(
      new SpriteMaterial({
        map: options.texture,
        side: FrontSide,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: false,
        toneMapped: false,
      })
    );
    this.sprite.name = options.name;
    this.sprite.renderOrder = 10000;
    this.sprite.geometry.computeBoundingBox();
    this.sprite.geometry.center();
    this.attach(this.sprite);
  }
}
