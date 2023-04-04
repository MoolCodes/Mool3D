export interface RoamType {
  collider: THREE.Mesh;
  visualizer: any;
  player: THREE.Mesh;
  controls: any;
  camera: THREE.Camera;
  object: THREE.Object3D;
  environment: THREE.Group;
  scene: THREE.Scene;
  animate: Fn<any>[];
  playerIsOnGround: boolean;
  fwdPressed: boolean;
  bkdPressed: boolean;
  lftPressed: boolean;
  rgtPressed: boolean;
  playerVelocity: THREE.Vector3;
  upVector: THREE.Vector3;
  tempVector: THREE.Vector3;
  tempVector2: THREE.Vector3;
  tempBox: THREE.Box3;
  tempMat: THREE.Matrix4;
  tempSegment: THREE.Line3;
  clock: THREE.Clock;
  params: any;
  isRun: boolean;
  runCallback: Fn<any>;
  angle: number;
  init: Fn<any>;
  reset: Fn<any>;
}

export type ViewerRoam = RoamType;
