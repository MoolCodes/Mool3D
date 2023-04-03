import { AnimateType } from "../types/types";
export declare class Animate implements AnimateType {
    frameId: any;
    animateFuntion: Array<any>;
    private clock;
    constructor(options: any);
    private init;
}
