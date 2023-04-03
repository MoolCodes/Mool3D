import { SpriteType, SpriteParams } from "../types/types";
import { Object3D } from "./object";
export declare class Sprite extends Object3D implements SpriteType {
    sprite: THREE.Sprite;
    constructor();
    init(options: SpriteParams): void;
}
