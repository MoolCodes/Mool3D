import { SkyParams, SkyType, ShaderSkyParams } from "../types/types";
export declare class Sky implements SkyType {
    private path;
    private sceneidx;
    private gSkyBox;
    private gScenes;
    sky: THREE.Object3D;
    constructor(options: SkyParams);
    setSkyBox(skydir: string): void;
    initShaderSky(option: ShaderSkyParams): void;
}
