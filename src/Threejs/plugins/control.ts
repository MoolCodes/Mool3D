import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { ControlParams, ControlType } from "../types/types";
import { DragControls } from "three/examples/jsm/controls/DragControls";
export class Control implements ControlType {
  orbitControls: any;
  transformControls: any;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene[];
  constructor(options: ControlParams) {
    this.orbitControls = null;
    this.transformControls = null;
    this.camera = options.camera;
    this.renderer = options.renderer;
    this.scene = options.scene;
    this.init();
  }
  private init() {
    this.initOrbit();
  }
  private initOrbit() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    this.orbitControls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    this.orbitControls.dampingFactor = 0.25;
    // 控制半球翻转
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.autoRotate = false;
    this.orbitControls.autoRotateSpeed = -10;
    this.orbitControls.screenSpacePanning = false;
  }

  initTransform(index: number) {
    //变换控制器
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.transformControls.setSize(1);
    this.scene[index].attach(this.transformControls);
    this.transformControls.addEventListener("dragging-changed", (e) => {
      this.orbitControls.enabled = !e.value;
    });
  }
  initDrag(objects) {
    const controls = new DragControls(
      objects,
      this.camera,
      this.renderer.domElement
    );
    controls.addEventListener("dragstart", function (event) {
      console.log("event", event);
    });

    controls.addEventListener("dragend", function (event) {
      console.log("event", event);
    });
  }
}
