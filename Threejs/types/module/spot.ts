export interface SpotType {
  light: THREE.SpotLight;
  helper: THREE.SpotLightHelper;
  init: (
    color: string,
    intensity: number,
    distance: number,
    target?: THREE.Vector3
  ) => THREE.SpotLight;
  initHelper: FnParamsReturn<number, unknown>;
  destory: Fn<any>;
}

export type ViewerSpot = SpotType;
