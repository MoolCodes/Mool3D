export interface PointLightType {
  light: THREE.PointLight;
  helper: THREE.PointLightHelper;
  init: (
    color: string,
    intensity: number,
    distance: number,
    decay?: number
  ) => THREE.PointLight;
  initHelper: FnParamsReturn<number, unknown>;
  destory: Fn<any>;
}
