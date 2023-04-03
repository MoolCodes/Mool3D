export declare class Tween implements ParticleTween {
    times: number[];
    values: THREE.Vector3 | number[];
    constructor(timeArray?: any[], valueArray?: any[]);
    lerp(t: number): any;
}
