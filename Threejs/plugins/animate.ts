import { AnimateType } from "../types/types";

export class Animate implements AnimateType {
  frameId: any;
  animateFuntion: Array<any>;
  private clock: THREE.Clock;
  constructor(options) {
    this.clock = options.clock;
    this.animateFuntion = [];
    this.init();
  }
  private init() {
    this.frameId = requestAnimationFrame(this.init.bind(this));
    const delta = this.clock.getDelta();
    this.animateFuntion.forEach((fn) => fn(delta));
  }
}
