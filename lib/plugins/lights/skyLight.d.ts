import { SkyLightType } from "../../types/types";
export declare class SkyLight implements SkyLightType {
    private scene;
    light: THREE.HemisphereLight;
    helper: THREE.HemisphereLightHelper;
    constructor(scene: THREE.Scene);
    init(skyColor: string, earthColor: string, intensity: number): THREE.HemisphereLight;
    initHelper(size: number): void;
    destory(): void;
}
