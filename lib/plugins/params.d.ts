import { ViewerParams, ViewerAnimate, ViewerCamera, ViewerAmbient, ViewerEvent, ViewerModel, ViewerFog, ViewerControl, ViewerSky, ViewerEnvironment, ViewerSource, ViewerParade, ViewerWater, ViewerSkyLight, ViewerDirectional, PointLightType, ViewerSpot, ViewerRectArea } from "../types/types";
export declare class Params {
    clock: THREE.Clock;
    animate: ViewerAnimate | null;
    gAmGroup: THREE.Group[];
    gRayGroup: THREE.Group[];
    gScenes: THREE.Scene[];
    gStatus: boolean[];
    scene: THREE.Scene | null;
    model: ViewerModel | null;
    sceneidx: number;
    cameraClass: ViewerCamera | null;
    activeCamera: THREE.Camera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: ViewerControl | null;
    ambient: ViewerAmbient | null;
    hemisphereLight: ViewerSkyLight | null;
    directional: ViewerDirectional | null;
    pointGroup: PointLightType[];
    spotLight: ViewerSpot | null;
    rectAreaLight: ViewerRectArea | null;
    sky: ViewerSky | null;
    environment: ViewerEnvironment | null;
    event: ViewerEvent | null;
    souce: ViewerSource | null;
    parade: ViewerParade | null;
    spriteGroup: THREE.Object3D[];
    fog: ViewerFog | null;
    water: ViewerWater | null;
    options: ViewerParams;
    constructor(options: ViewerParams);
}