import { ControlParams, ControlType } from "../types/types";
export declare class Control implements ControlType {
    orbitControls: any;
    transformControls: any;
    private camera;
    private renderer;
    private scene;
    constructor(options: ControlParams);
    private init;
    private initOrbit;
    initTransform(index: number): void;
    initDrag(objects: any): void;
}
