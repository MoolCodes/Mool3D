import { WaterParams, WaterType, WaterShaderParams } from "../types/types";
export declare class Water implements WaterType {
    private texture;
    private scene;
    private animate;
    water: WaterShaderParams;
    private radius;
    private textureWidth;
    private textureHeight;
    private sunPosition;
    private sunColor;
    private waterColor;
    private distortionScale;
    private waterPosition;
    time: number;
    constructor(options: WaterParams);
    init(): void;
    destroy(): void;
}
