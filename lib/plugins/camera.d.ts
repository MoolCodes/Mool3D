import { CameraType } from "../types/types";
export declare class Camera implements CameraType {
    camera: THREE.Camera;
    private el;
    constructor(el: HTMLElement);
    private init;
    flyTo(TWEEN: any, controls: any, option: FlyToParams): any;
}
