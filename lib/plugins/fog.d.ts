import { FogType } from "../types/types";
export declare class Fog implements FogType {
    private scene;
    constructor(scene: THREE.Scene);
    initFog(color: string, near: number, far: number): void;
    initFogExp(color: string, density: number): void;
}
