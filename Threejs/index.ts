import { Scene, Group, Cache } from "three";
import {
  ViewerType,
  ViewerParams,
  SpriteParams,
  ParadeParams,
  InitWaterParams,
} from "./types/types";
import { Params } from "./plugins/params";
import { Camera } from "./plugins/camera";
import { Renderer } from "./plugins/render";
import { Control } from "./plugins/control";
import { Animate } from "./plugins/animate";
import { Model } from "./plugins/model";
import { Sky } from "./plugins/skybox";
import { Ambient } from "./plugins/lights/ambient";
import { SkyLight } from "./plugins/lights/skyLight";
import { Directional } from "./plugins/lights/directional";
import { PointLight } from "./plugins/lights/point";
import { SpotLight } from "./plugins/lights/spot";
import { RectArea } from "./plugins/lights/rectArea";
import { Environment } from "./plugins/environment";
import { Event } from "./plugins/event";
import { Source } from "./plugins/source";
import { Sprite } from "./plugins/sprite";
import { Parade } from "./plugins/parade";
import { ParticleEngine } from "./plugins/particleEngine";
import ParticleEngineExamples from "./plugins/particleExamples";
import { Tween } from "./plugins/particleTween";
import { Fog } from "./plugins/fog";
import { Water } from "./plugins/water";

import bus from "../public/eventBus";

const MAP_NAMES = [
  "map",
  "aoMap",
  "emissiveMap",
  "glossinessMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap",
  "specularMap",
];
function traverseMaterials(object, callback) {
  object.traverse((node) => {
    if (!node.isMesh) return;
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    materials.forEach(callback);
  });
}

export class Viewer extends Params implements ViewerType {
  constructor(options: ViewerParams) {
    super(options);
    this.createScene();
    this.initAnimate();
    this.initRender();
    this.initControls();
    this.initAmbient();
  }
  /*
   *@description: 创建场景
   *@author: yangj
   *@date: 2023-03-04 09:34:41
   *@return:
   */
  private createScene() {
    for (let i = 0; i < 15; i++) {
      this.gStatus[i] = false;
      const scene = new Scene();
      const mainGroup = new Group();
      //环境对象群
      const AMGroup = new Group();
      //Ray拾取对象群
      const RayGrop = new Group();
      mainGroup.add(AMGroup, RayGrop);
      scene.add(mainGroup);
      this.gScenes.push(scene);
      this.gAmGroup.push(AMGroup);
      this.gRayGroup.push(RayGrop);
    }
    this.scene = this.gScenes[this.sceneidx]; //当前场景
    this.cameraClass = new Camera(this.options.el);
    this.activeCamera = this.cameraClass.camera; //激活相机
    this.scene.add(this.activeCamera);
  }
  /*
   *@description: 初始化帧动画
   *@author: yangj
   *@date: 2023-03-04 12:56:30
   *@return:
   */
  private initAnimate() {
    this.animate = new Animate({
      clock: this.clock,
    });
  }
  /*
   *@description: 天空盒子
   *@author: yangj
   *@date: 2023-03-04 17:23:13
   *@return:
   */
  initSky() {
    this.sky = new Sky({
      gScenes: this.gScenes,
      path: this.options.path,
      sceneidx: this.sceneidx,
    });
  }
  /*
   *@description: 环境贴图
   *@author: yangj
   *@date: 2023-03-04 20:43:33
   *@return:
   */
  initEnvironment(environment: EnvironmentType) {
    this.environment = new Environment({
      renderer: this.renderer,
      path: this.options.path,
      scene: this.gScenes[this.sceneidx],
      environment: environment,
    });
    this.environment.init();
  }
  /*
   *@description: 事件
   *@author: yangj
   *@date: 2023-03-04 21:03:26
   *@return:
   */
  initEvent(types: EventTypes[]) {
    this.event = new Event({
      types: types,
      el: this.options.el,
      camera: this.activeCamera,
      scene: this.gRayGroup[this.sceneidx],
    });
    this.event.init();
  }
  /*
   *@description:渲染
   *@author: yangj
   *@date: 2023-03-04 10:53:31
   *@return:
   */
  private initRender() {
    this.renderer = new Renderer(this.options.el).renderer;
    this.options.el.appendChild(this.renderer.domElement);
    this.animate?.animateFuntion.push(() => {
      this.options.tween.update();
      this.renderer.render(this.scene, this.activeCamera);
    });
  }
  /*
   *@description: 控制器
   *@author: yangj
   *@date: 2023-03-04 12:36:24
   *@return:
   */
  private initControls() {
    this.controls = new Control({
      camera: this.activeCamera,
      renderer: this.renderer,
      scene: this.gScenes,
    });
    this.animate?.animateFuntion.push((delta) => {
      !this.controls.orbitControls.enabled &&
        this.controls.orbitControls.update(delta);
    });
  }
  /*
   *@description: 初始化场景
   *@author: yangj
   *@date: 2023-03-04 13:52:01
   *@return:
   */
  initModel() {
    this.model = new Model({
      gScenes: this.gScenes,
      gStatus: this.gStatus,
      gAmGroup: this.gAmGroup,
      gRayGroup: this.gRayGroup,
      baseURL: this.options.path,
      bus: bus,
      animateFuntion: this.animate.animateFuntion,
    });
  }
  /*
   *@description: 环境光
   *@author: yangj
   *@date: 2023-03-04 16:53:53
   *@return:
   */
  private initAmbient() {
    this.ambient = new Ambient({
      scene: this.gScenes[this.sceneidx],
      renderer: this.renderer,
    });
    this.ambient.setLight(1.5, 1);
  }
  /*
   *@description: 半球光
   *@author: yangj
   *@date: 2023-03-18 13:40:17
   *@return:
   */
  initSkyLight(skyColor: string, earthColor: string, intensity: number) {
    this.hemisphereLight = new SkyLight(this.scene);
    this.hemisphereLight.init(skyColor, earthColor, intensity);
  }
  /*
   *@description: 平行光
   *@author: yangj
   *@date: 2023-03-18 16:07:02
   *@return:
   */
  initDirectional(color: string, intensity: number) {
    this.directional = new Directional(this.scene);
    this.directional.init(color, intensity);
  }
  /*
   *@description: 点光源
   *@author: yangj
   *@date: 2023-03-18 16:39:38
   *@return:
   */
  initPointLight(
    color: string,
    intensity: number,
    distance: number,
    decay?: number
  ): number {
    const pointLight = new PointLight(this.scene);
    pointLight.init(color, intensity, distance, decay);
    this.pointGroup.push(pointLight);
    return this.pointGroup.length - 1;
  }
  /*
   *@description: 聚光
   *@author: yangj
   *@date: 2023-03-18 17:13:57
   *@return:
   */
  initSpotLight(
    color: string,
    intensity: number,
    distance: number,
    target?: THREE.Vector3
  ) {
    this.spotLight = new SpotLight(this.scene);
    this.spotLight.init(color, intensity, distance, target);
  }
  /*
   *@description: 单个区域光
   *@author: yangj
   *@date: 2023-03-18 18:50:36
   *@return:
   */
  initRectArea(
    color: string,
    width: number,
    height: number,
    intensity: number
  ) {
    this.rectAreaLight = new RectArea(this.scene);
    this.rectAreaLight.init(color, width, height, intensity);
  }
  /*
   *@description: 矩形区域光
   *@author: yangj
   *@date: 2023-03-18 18:54:21
   *@return:
   */
  initRectAreaBox(
    color: string,
    width: number,
    intensity: number,
    position: [number, number, number]
  ) {
    this.rectAreaLight = new RectArea(this.scene);
    this.rectAreaLight.initArea(color, width, intensity, position);
  }
  /*
   *@description: 雾
   *@author: yangj
   *@date: 2023-03-16 20:48:43
   *@return:
   */
  initFog() {
    this.fog = new Fog(this.scene);
  }
  /*
   *@description: water
   *@author: yangj
   *@date: 2023-03-17 15:37:39
   *@return:
   */
  initWater(options: InitWaterParams) {
    this.water = new Water({
      ...options,
      animate: this.animate.animateFuntion,
    });
    this.water.init();
  }
  /*
   *@description: 资源加载类
   *@author: yangj
   *@date: 2023-03-09 17:14:40
   *@return:
   */
  initSource() {
    this.souce = new Source();
  }
  /*
   *@description: 粒子
   *@author: yangj
   *@date: 2023-03-09 20:34:11
   *@return:
   */
  loadSprite({ texture, name }: SpriteParams): THREE.Object3D {
    let sprite = new Sprite();
    sprite.init({
      texture,
      name,
    });
    this.spriteGroup.push(sprite);
    return sprite;
  }
  /*
   *@description: 巡检
   *@author: yangj
   *@date: 2023-03-10 15:42:52
   *@return:
   */
  initParade(params: ParadeParams) {
    this.parade = new Parade(params);
  }
  /*
   *@description: 粒子系统
   *@author: yangj
   *@date: 2023-03-15 15:58:00
   *@return:
   */
  initParticleEngine(
    particle: ParticleEngineType,
    mugen: boolean
  ): ParticleEngineType {
    particle = new ParticleEngine({
      scene: this.gScenes[this.sceneidx],
      mugen,
    });
    this.animate.animateFuntion.push((dt) => {
      if (particle.start) particle.update(dt);
    });
    return particle;
  }
  /*
   *@description: 粒子过渡函数
   *@author: yangj
   *@date: 2023-03-15 22:11:54
   *@return:
   */
  getParticleTween(times: number[], values: number[]): ParticleTween {
    return new Tween(times, values);
  }
  /*
   *@description: 设置粒子模式
   *@author: yangj
   *@date: 2023-03-15 16:07:32
   *@return:
   */
  setParticleMode(
    particle: ParticleEngineType,
    key: ParticleKeys,
    ParticleExamplesParams: ParticleExamplesParams
  ) {
    particle.setValues(ParticleEngineExamples[key], ParticleExamplesParams);
    particle.initialize(this.scene);
  }
  /*
   *@description: 加载场景
   *@author: yangj
   *@date: 2023-03-04 13:37:42
   *@return:
   */
  setScene(index: number, callback: Fn<any>) {
    this.sceneidx = index;
    this.scene = this.gScenes[index];
    this.controls.transformControls && this.controls.transformControls.detach(); // 先释放持有物
    this.scene.updateMatrix();
    if (!this.gStatus[index]) {
      this.model &&
        this.model.load(index, () => {
          callback instanceof Function && callback();
        });
      this.controls.transformControls &&
        this.scene.add(this.controls.transformControls);
      this.initAmbient();
    } else {
      bus.emit("scene", {
        type: "transition",
        value: true,
      });
      setTimeout(() => {
        bus.emit("scene", {
          type: "transition",
          value: false,
        });
        callback instanceof Function && callback();
      }, 1500);
    }
  }

  /*
   *@description: 相机飞行
   *@author: yangj
   *@date: 2023-03-04 13:44:00
   *@return:
   */
  flyTo(option: FlyToParams) {
    this.cameraClass?.flyTo(this.options.tween, this.controls, option);
  }
  /*
   *@description: 销毁场景
   *@author: yangj
   *@date: 2023-03-05 14:08:07
   *@return:
   */
  destroy() {
    if (this.animate?.frameId) cancelAnimationFrame(this.animate?.frameId); //销毁requestAnimationFrame
    this.scene.traverse((child) => {
      child.userData = {};
      if (
        (child as any).material?.dispose &&
        typeof (child as any).material.dispose === "function"
      ) {
        (child as any).material.dispose();
      }
      if ((child as any).geometry) {
        (child as any).geometry.dispose();
      }
      child = null;
    });
    this.options.tween.removeAll();
    this.renderer.forceContextLoss(); //销毁context
    traverseMaterials(this.scene, (material) => {
      MAP_NAMES.forEach((map) => {
        if (material[map]) material[map].dispose();
      });
    });
    console.log("gapp.scene:", this.renderer.info);

    this.renderer = null;
    this.scene = null;
    this.activeCamera = null;

    Cache.clear();
  }
}
