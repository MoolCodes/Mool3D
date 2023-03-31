export interface RectAreaType {
  light: THREE.RectAreaLight;
  areaLight: THREE.Group;
  init: (
    color: string,
    width: number,
    height: number,
    intensity: number
  ) => void;
  initArea: (
    color: string,
    width: number,
    intensity: number,
    position: [number, number, number]
  ) => void;
  initHelper: Fn<any>;
  initBoxHelper: Fn<any>;
  destory: Fn<any>;
}

export type ViewerRectArea = RectAreaType;
