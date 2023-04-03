export interface WaterType {
  time: number;
  water: WaterShaderParams;
  init: Fn<any>;
  destroy: Fn<any>;
}
export type WaterShaderParams = {
  material: THREE.ShaderMaterial;
} & THREE.Mesh;

export type ViewerWater = WaterType;
export interface WaterParams {
  radius: number;
  textureWidth: number;
  textureHeight: number;
  sunPosition?: THREE.Vector3;
  sunColor?: string;
  waterColor?: string;
  distortionScale?: number;
  waterPosition?: THREE.Vector3;
  time: number;
  texture: THREE.TextureLoader;
  scene: THREE.Scene | THREE.Group;
  animate: Fn<number>[];
}

export interface InitWaterParams {
  radius: number;
  textureWidth: number;
  textureHeight: number;
  sunPosition?: THREE.Vector3;
  sunColor?: string;
  scene: THREE.Scene | THREE.Group;
  waterColor?: string;
  distortionScale?: number;
  waterPosition?: THREE.Vector3;
  time: number;
  texture: THREE.TextureLoader;
}
