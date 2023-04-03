import { AmbientParams, AmbientType } from "../../types/types";
export declare class Ambient implements AmbientType {
    private scene;
    private renderer;
    constructor(options: AmbientParams);
    setLight(exposure: number, intensity: number): void;
}
