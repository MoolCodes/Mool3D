export interface RenderType {
  renderer: THREE.Renderer;
}

export interface ViewerRender {
  domElement: HTMLElement;
  render: (scene: THREE.Scene, camera: THREE.Scene) => void;
  [key: string]: any;
}
