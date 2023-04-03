import { SourceType } from "../types/types";
export declare class Source implements SourceType {
    private textureLoader;
    constructor();
    loadTexture({ path, onLoad, onProgress, onError }: {
        path: any;
        onLoad: any;
        onProgress: any;
        onError: any;
    }): any;
}
