import { PointLightType } from "../../types/types";
export declare class PointLight implements PointLightType {
    private scene;
    light: THREE.PointLight;
    helper: THREE.PointLightHelper;
    shadowMass: number;
    constructor(scene: THREE.Scene);
    init(color: string, intensity: number, distance: number, decay?: number): THREE.PointLight;
    initHelper(size: number): void;
    destory(): void;
}
