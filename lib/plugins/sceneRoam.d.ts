import { RoamType } from "../types/types";
export declare class Roam implements RoamType {
    collider: THREE.Mesh;
    visualizer: any;
    player: THREE.Mesh;
    controls: any;
    camera: THREE.Camera;
    object: THREE.Object3D;
    environment: THREE.Group;
    scene: THREE.Scene;
    animate: Fn<any>[];
    playerIsOnGround: boolean;
    fwdPressed: boolean;
    bkdPressed: boolean;
    lftPressed: boolean;
    rgtPressed: boolean;
    playerVelocity: THREE.Vector3;
    upVector: THREE.Vector3;
    tempVector: THREE.Vector3;
    tempVector2: THREE.Vector3;
    tempBox: THREE.Box3;
    tempMat: THREE.Matrix4;
    tempSegment: THREE.Line3;
    clock: THREE.Clock;
    params: any;
    isRun: boolean;
    runCallback: Fn<any>;
    angle: number;
    constructor(options: any);
    init(): void;
    private loadColliderEnvironment;
    private loadplayer;
    /**
     * @description
     * @author: yangj (yangjia@fjxhx.cc)
     * @createDate: 2022/3/1
     */
    private windowEvent;
    /**
     * @description 重置
     * @author: yangj (yangjia@fjxhx.cc)
     * @createDate: 2022/3/1
     */
    reset(): void;
    private render;
    private updatePlayer;
}
