import { ControlType } from "./control";
export interface CameraType {
  camera: THREE.Camera;
  flyTo: (tween: any, controls: ControlType, option: FlyToParams) => any;
}

export type ViewerCamera = CameraType;
