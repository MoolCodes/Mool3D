export interface AmbientType {
  setLight: (exposure: number, intensity: number) => void;
}
export interface AmbientParams {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
}

export type ViewerAmbient = AmbientType;
