export interface ParadeType {
    curve: THREE.CatmullRomCurve3;
    pipeLine: THREE.Mesh;
    stop: boolean;
    progress: number;
    speed: number;
    direction: string;
    loop: boolean;
    object: THREE.Object3D;
    drawPipeLine: Fn<THREE.Vector3[]>;
    clear: Fn<any>;
    autoParade: Fn<(type: string, value: {
        point: THREE.Vector3;
        pointLook: THREE.Vector3;
    }) => void>;
}
export interface ParadeParams {
    pipeParams: PipeParams;
    loop?: boolean;
    pipeTexture: THREE.Texture;
    scene: THREE.Scene;
    animate: Fn<number>[];
    speed: number;
    object: THREE.Object3D;
}
export interface PipeParams {
    tubularSegments: number;
    radius: number;
    radialSegments: number;
    closed: boolean;
}
export type ViewerParade = ParadeType;
