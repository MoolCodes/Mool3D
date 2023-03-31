export interface SkyType {
  sky: THREE.Object3D;
  setSkyBox: (skydir: string) => void;
  initShaderSky: (params: ShaderSkyParams) => void;
}
export interface SkyParams {
  path: string;
  sceneidx: number;
  gScenes: THREE.Scene[];
}
export interface ShaderSkyParams {
  scale: number;
  turbidity: number;
  rayleigh: number;
  postion: number[];
}

export type ViewerSky = SkyType;
