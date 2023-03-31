export interface ControlType {
  orbitControls: any;
  transformControls: any;
  initTransform: FnParamsReturn<number, unknown>;
  initDrag: Fn<any>;
}
export interface ControlParams {
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene[];
}

export type ViewerControl = ControlType;
