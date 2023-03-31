import { ParadeParams } from "./parade";
import { SpriteParams } from "./sprite";
import { WaterParams } from "./water";
export interface ViewerType {
  setScene: FnTwoParams<number, Fn<any>, unknown>;
  initSky: Fn<any>;
  initEnvironment: FnParamsReturn<EnvironmentType, unknown>;
  initEvent: FnParamsReturn<EventTypes[], unknown>;
  initModel: Fn<any>;
  flyTo: FnParamsReturn<FlyToParams, unknown>;
  initSource: Fn<any>;
  initSkyLight: FnThreeParams<string, string, number, unknown>;
  initDirectional: FnTwoParams<string, number, unknown>;
  initPointLight: (
    color: string,
    intensity: number,
    distance: number,
    decay?: number
  ) => number;
  initSpotLight: (
    color: string,
    intensity: number,
    distance: number,
    target: THREE.Vector3
  ) => void;
  loadSprite: FnParamsReturn<SpriteParams, THREE.Object3D>;
  initParade: FnParamsReturn<ParadeParams, unknown>;
  initParticleEngine: FnTwoParams<
    ParticleEngineType,
    boolean,
    ParticleEngineType
  >;
  setParticleMode: FnThreeParams<
    ParticleEngineType,
    ParticleKeys,
    ParticleExamplesParams,
    unknown
  >;
  getParticleTween: FnTwoParams<number[], number[], ParticleTween>;
  initWater: FnParamsReturn<WaterParams, unknown>;
  destroy: Fn<any>;
}

export interface ViewerParams {
  el: HTMLElement;
  tween: any;
  path: string;
}
