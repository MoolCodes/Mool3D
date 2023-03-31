export interface DirectionalType {
  light: THREE.DirectionalLight;
  helper: THREE.DirectionalLightHelper;
  init: FnTwoParams<string, number, THREE.DirectionalLight>;
  initHelper: FnParamsReturn<number, unknown>;
  destory: Fn<any>;
}

export type ViewerDirectional = DirectionalType;
