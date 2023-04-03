import { RectAreaType } from "../../types/types";
export declare class RectArea implements RectAreaType {
    private scene;
    light: THREE.RectAreaLight;
    areaLight: THREE.Group;
    helper: any;
    constructor(scene: THREE.Scene);
    init(color: string, width: number, height: number, intensity: number): void;
    initArea(color: string, width: number, intensity: number, position: [number, number, number]): void;
    initHelper(): void;
    initBoxHelper(): void;
    destory(): void;
}
