export interface EventType {
  init: Fn<any>;
}

export interface EventParams {
  types: EventTypes[];
  typesFn?: {
    [P in EventTypes]?: Fn<EventCallbackParams>[];
  };
  el: HTMLElement;
  scene: THREE.Group;
  camera: THREE.Camera;
}

export interface ViewerEvent {
  types: EventTypes[];
  typesFn?: {
    [P in EventTypes]?: Fn<EventCallbackParams>[];
  };
  init: Fn<any>;
}
