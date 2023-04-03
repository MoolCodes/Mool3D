import { SourceType, loadTextureParams } from "../types/types";
export declare class Source implements SourceType {
    private textureLoader;
    constructor();
    loadTexture({ path, onLoad, onProgress, onError }: loadTextureParams): import("three").Texture;
}
