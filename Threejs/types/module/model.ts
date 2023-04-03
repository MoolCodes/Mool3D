export interface ModelType {
  mixer: THREE.AnimationMixer;
  animate: boolean;
  deepFunction: Fn<{
    e: THREE.Mesh;
    item: ModelConfig;
  }>[];
  load: (idx: number, callback?: Fn<any>) => void;
  loadModel: (
    url: string,
    sceneidx: number,
    callback: FnTwoParams<THREE.Group, THREE.AnimationClip[], unknown>
  ) => void;
  loadFbxModel: (
    url: string,
    sceneidx: number,
    callback: FnTwoParams<THREE.Group, THREE.AnimationClip[], unknown>
  ) => void;
  playAllClipes: (idx: number) => void;
  playNameClipes: (idx: number, clipName: string) => void;
}

export interface ModelParams {
  gScenes: THREE.Scene[];
  gStatus: boolean[];
  gAmGroup: THREE.Group[];
  gRayGroup: THREE.Group[];
  baseURL: string;
  bus: any;
  animateFuntion: Fn<number>[];
}

export type ViewerModel = ModelType;
