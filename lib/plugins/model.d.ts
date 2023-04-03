import { ModelType, ModelParams } from "../types/types";
export declare class Model implements ModelType {
    mixer: THREE.AnimationMixer;
    private gScenes;
    private gStatus;
    private gRayGroup;
    private gAmGroup;
    private baseURL;
    private bus;
    animate: boolean;
    deepFunction: Fn<{
        e: THREE.Mesh;
        item: ModelConfig;
    }>[];
    constructor(options: ModelParams);
    private getConfig;
    load(sceneidx: number, callback: Fn<any>): void;
    private loadConfigModel;
    loadModel(url: string, sceneidx: number, callback: FnTwoParams<THREE.Group, THREE.AnimationClip[], unknown>): void;
    loadFbxModel(url: string, sceneidx: number, callback: FnTwoParams<THREE.Group, THREE.AnimationClip[], unknown>): void;
    private decodeSence;
    private addclips;
    playAllClipes(sceneidx: number): void;
    playNameClipes(sceneidx: number, clipName: string): void;
}
