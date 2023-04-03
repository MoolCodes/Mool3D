export interface EnvtType {
  environment: EnvironmentType;
  init: Fn<any>;
}
export interface EnvironmentParams {
  renderer: THREE.WebGLRenderer;
  path: string;
  scene: THREE.Scene;
  environment: EnvironmentType;
}
export type ViewerEnvironment = EnvtType;
