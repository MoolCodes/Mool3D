export interface ParadeType {
  curve: THREE.CatmullRomCurve3; //曲线
  pipeLine: THREE.Mesh; //管道实例
  stop: boolean; //暂停
  progress: number; //进度
  speed: number; //速度
  direction: string; //方向
  loop: boolean; //是否循环
  object: THREE.Object3D; //物体
  drawPipeLine: Fn<THREE.Vector3[]>;
  clear: Fn<any>;
  autoParade: Fn<
    (
      type: string,
      value: { point: THREE.Vector3; pointLook: THREE.Vector3 }
    ) => void
  >;
}

export interface ParadeParams {
  pipeParams: PipeParams;
  loop?: boolean;
  pipeTexture: THREE.Texture;
  scene: THREE.Scene;
  animate: Fn<number>[];
  speed: number;
  object: THREE.Object3D;
}
export interface PipeParams {
  tubularSegments: number;
  radius: number;
  radialSegments: number;
  closed: boolean;
}

export type ViewerParade = ParadeType;
