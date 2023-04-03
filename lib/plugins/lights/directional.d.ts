import { DirectionalType } from "../../types/types";
export declare class Directional implements DirectionalType {
    private scene;
    light: THREE.DirectionalLight;
    helper: THREE.DirectionalLightHelper;
    scope: number;
    shadowMass: number;
    constructor(scene: THREE.Scene);
    init(color: string, intensity: number): THREE.DirectionalLight;
    initHelper(size: number): void;
    destory(): void;
}
