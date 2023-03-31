import { ParadeType, PipeParams, ParadeParams } from "../types/types";
import {
  CatmullRomCurve3,
  TubeGeometry,
  MeshBasicMaterial,
  RepeatWrapping,
  DoubleSide,
  Mesh,
} from "three";
export class Parade implements ParadeType {
  private pipeTexture: THREE.Texture; //管道贴图
  private pipeParams: PipeParams; //管道参数
  private scene: THREE.Scene; //场景
  private animate: Fn<number>[];
  private callback: (
    type: string,
    value: { point: THREE.Vector3; pointLook: THREE.Vector3 }
  ) => void;
  curve: THREE.CatmullRomCurve3; //曲线
  pipeLine: THREE.Mesh; //管道实例
  stop: boolean; //暂停
  progress: number; //进度
  speed: number; //速度
  direction: string; //方向
  loop: boolean; //是否循环
  object: THREE.Object3D; //物体
  constructor(options: ParadeParams) {
    this.pipeParams = options.pipeParams;
    this.pipeTexture = options.pipeTexture;
    this.scene = options.scene;
    this.animate = options.animate;
    this.speed = options.speed / 1000 ?? 1 / 1000;
    this.loop = options.loop ?? false;
    this.stop = true;
    this.object = options.object;
    this.run();
  }
  /*
   *@description: 绘制管道
   *@author: yangj
   *@date: 2023-03-10 14:36:45
   *@return:
   */
  drawPipeLine(pipeLineArr: THREE.Vector3[]) {
    if (pipeLineArr.length < 2) {
      return;
    }
    this.initCurve(pipeLineArr);
    this.initPipe(this.pipeParams);
  }
  /*
   *@description: 三维平滑曲线
   *@author: yangj
   *@date: 2023-03-10 14:56:01
   *@return:
   */
  private initCurve(pipeLineArr: THREE.Vector3[]) {
    this.curve = new CatmullRomCurve3(pipeLineArr);
    this.curve.arcLengthDivisions = 1000;
  }
  /*
   *@description: 管道
   *@author: yangj
   *@date: 2023-03-10 14:57:06
   *@return:
   */
  private initPipe({
    tubularSegments,
    radius,
    radialSegments,
    closed,
  }: PipeParams) {
    let tubeGeometry = new TubeGeometry(
      this.curve,
      tubularSegments,
      radius,
      radialSegments,
      closed
    );
    this.pipeTexture.wrapS = RepeatWrapping; //每个都重复
    this.pipeTexture.wrapT = RepeatWrapping;
    this.pipeTexture.repeat.set(1, 1);
    this.pipeTexture.needsUpdate = true;
    let material = new MeshBasicMaterial({
      map: this.pipeTexture,
      side: DoubleSide,
      transparent: true,
    });
    this.pipeLine = new Mesh(tubeGeometry, material);
    this.scene.add(this.pipeLine);
  }
  /*
   *@description: 清除
   *@author: yangj
   *@date: 2023-03-10 15:21:01
   *@return:
   */
  clear() {
    this.scene.remove(this.pipeLine);
    this.pipeLine = null;
  }
  /*
   *@description: 巡检
   *@author: yangj
   *@date: 2023-03-10 15:23:56
   *@return:
   */
  autoParade(
    callback: (
      type: string,
      value: { point: THREE.Vector3; pointLook: THREE.Vector3 }
    ) => void
  ) {
    this.progress = 0;
    this.stop = false;
    this.callback = callback;
  }
  private run() {
    this.animate.push(() => {
      if (!this.stop) {
        if (this.direction === "GO") {
          if (this.progress > 1.0) {
            if (this.loop) {
              this.direction = "BACK";
            } else {
              this.callback instanceof Function &&
                this.callback("end", {
                  point: this.object.position,
                  pointLook: this.object.position,
                });
            }
          } else {
            this.progress += this.speed;
          }
        } else {
          if (this.progress <= 0) {
            this.direction = "GO";
          } else {
            this.progress -= this.speed;
          }
        }
        if (this.curve && this.object) {
          let point, pointLook;
          if (this.direction === "GO") {
            point = this.curve.getPoint(this.progress);
            pointLook = this.curve.getPoint(this.progress + this.speed * 20);
          } else {
            point = this.curve.getPoint(this.progress);
            pointLook = this.curve.getPoint(this.progress - this.speed * 20);
          }

          this.object.position.set(point.x, point.y, point.z);
          this.object.lookAt(pointLook);
          this.callback instanceof Function &&
            this.callback("start", {
              point,
              pointLook,
            });
        }
      }
    });
  }
}
