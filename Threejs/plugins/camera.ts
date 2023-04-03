import { PerspectiveCamera } from "three";
import { CameraType } from "../types/types";
export class Camera implements CameraType {
  camera: THREE.Camera;
  private el: HTMLElement;
  constructor(el: HTMLElement) {
    this.camera = null;
    this.el = el;
    this.init();
  }
  private init() {
    this.camera = new PerspectiveCamera(
      60,
      this.el.clientWidth / this.el.clientHeight,
      1,
      2000000
    );
  }

  flyTo(TWEEN: any, controls: any, option: FlyToParams) {
    option.position = option.position || []; // 相机新的位置
    option.controls = option.controls || []; // 控制器新的中心点位置(围绕此点旋转等)
    option.duration = option.duration || 1000; // 飞行时间
    option.easing = option.easing || TWEEN.Easing.Linear.None;
    TWEEN.removeAll();
    const curPosition = this.camera?.position;
    const controlsTar = controls.orbitControls.target;
    const tween = new TWEEN.Tween({
      x1: curPosition.x, // 相机当前位置x
      y1: curPosition.y, // 相机当前位置y
      z1: curPosition.z, // 相机当前位置z
      x2: controlsTar.x, // 控制当前的中心点x
      y2: controlsTar.y, // 控制当前的中心点y
      z2: controlsTar.z, // 控制当前的中心点z
    })
      .to(
        {
          x1: option.position[0], // 新的相机位置x
          y1: option.position[1], // 新的相机位置y
          z1: option.position[2], // 新的相机位置z
          x2: option.controls[0], // 新的控制中心点位置x
          y2: option.controls[1], // 新的控制中心点位置x
          z2: option.controls[2], // 新的控制中心点位置x
        },
        option.duration
      )
      .easing(TWEEN.Easing.Linear.None); // TWEEN.Easing.Cubic.InOut //匀速

    tween.onUpdate(() => {
      controls.orbitControls.enabled = false;
      this.camera?.position.set(
        tween._object.x1,
        tween._object.y1,
        tween._object.z1
      );
      controls.orbitControls.target.set(
        tween._object.x2,
        tween._object.y2,
        tween._object.z2
      );
      controls.orbitControls.update();
      if (option.update instanceof Function) {
        option.update(tween);
      }
    });
    tween.onStart(() => {
      controls.orbitControls.enabled = false;
      if (option.start instanceof Function) {
        option.start();
      }
    });
    tween.onComplete(() => {
      controls.orbitControls.enabled = true;
      if (option.done instanceof Function) {
        option.done();
      }
    });
    tween.onStop(() => (option.stop instanceof Function ? option.stop() : ""));
    tween.start();
    TWEEN.add(tween);
    return tween;
  }
}
