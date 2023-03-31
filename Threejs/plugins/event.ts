import { EventType, EventParams } from "../types/types";
import { Vector2, Raycaster } from "three";

export class Event implements EventType {
  types: EventTypes[]; //事件类型
  typesFn: {
    //各类事件函数解藕
    [P in EventTypes]?: Fn<EventCallbackParams>[];
  };
  private el: HTMLElement;
  private mouse: THREE.Vector2; // 用于射线
  private camera: THREE.Camera;
  private scene: THREE.Group;
  private raycaster: THREE.Raycaster;
  constructor(options: EventParams) {
    this.types = options.types ?? [];
    this.el = options.el;
    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
    this.camera = options.camera;
    this.scene = options.scene;
    this.typesFn = options.typesFn ?? {
      click: [],
      dblclick: [],
      mousemove: [],
    };
  }
  init() {
    this.types.forEach((type) => {
      this.el.addEventListener(type, (e) => {
        const list = this.getIntersectObject(e, true).objectList;
        if (list.length > 0) {
          (this.typesFn[type] ?? []).forEach((fn) =>
            fn({
              event: e,
              list,
            })
          );
        }
      });
    });
  }

  private getIntersectObject(event: MouseEvent, recursive: boolean) {
    let objectList = [];
    try {
      this.mouse.x = (event.offsetX / this.el.clientWidth) * 2 - 1;
      this.mouse.y = -(event.offsetY / this.el.clientHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      objectList = this.raycaster.intersectObjects(
        this.scene.children,
        recursive
      );
    } catch (e) {
      // 鼠标越界
    }
    return {
      raycaster: this.raycaster,
      objectList: objectList,
    };
  }
}
