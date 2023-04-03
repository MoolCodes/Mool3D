import { EnvironmentParams, EnvtType } from "../types/types";
export declare class Environment implements EnvtType {
    private pmremGenerator;
    private path;
    private scene;
    environment: EnvironmentType;
    constructor(options: EnvironmentParams);
    init(): void;
    private loadHdr;
    private loadExr;
    private getCubeMapTexture;
}
