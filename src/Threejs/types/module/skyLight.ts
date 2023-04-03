export interface SkyLightType {
  light: THREE.HemisphereLight;
  helper: THREE.HemisphereLightHelper;
  init: FnThreeParams<string, string, number, THREE.HemisphereLight>;
  initHelper: FnParamsReturn<number, unknown>;
  destory: Fn<any>;
}

export type ViewerSkyLight = SkyLightType;
