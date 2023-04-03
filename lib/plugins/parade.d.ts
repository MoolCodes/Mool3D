import { ParadeType, ParadeParams } from "../types/types";
export declare class Parade implements ParadeType {
    private pipeTexture;
    private pipeParams;
    private scene;
    private animate;
    private callback;
    curve: THREE.CatmullRomCurve3;
    pipeLine: THREE.Mesh;
    stop: boolean;
    progress: number;
    speed: number;
    direction: string;
    loop: boolean;
    object: THREE.Object3D;
    constructor(options: ParadeParams);
    drawPipeLine(pipeLineArr: THREE.Vector3[]): void;
    private initCurve;
    private initPipe;
    clear(): void;
    autoParade(callback: (type: string, value: {
        point: THREE.Vector3;
        pointLook: THREE.Vector3;
    }) => void): void;
    private run;
}
