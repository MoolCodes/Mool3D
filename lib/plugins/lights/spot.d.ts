import { SpotType } from "../../types/types";
export declare class SpotLight implements SpotType {
    private scene;
    light: THREE.SpotLight;
    helper: THREE.SpotLightHelper;
    shadowMass: number;
    constructor(scene: THREE.Scene);
    init(color: string, intensity: number, distance: number, target?: THREE.Vector3): THREE.SpotLight;
    initHelper(size: number): void;
    destory(): void;
}
