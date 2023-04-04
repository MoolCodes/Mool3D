import {
  ViewerParams,
  ViewerAnimate,
  ViewerCamera,
  ViewerAmbient,
  ViewerEvent,
  ViewerModel,
  ViewerFog,
  ViewerControl,
  ViewerSky,
  ViewerEnvironment,
  ViewerSource,
  ViewerParade,
  ViewerWater,
  ViewerSkyLight,
  ViewerDirectional,
  PointLightType,
  ViewerSpot,
  ViewerRectArea,
  ViewerRoam,
} from "../types/types";
import { Clock } from "three";

/*
 *@description: 初始化参数
 *@author: yangj
 *@date: 2023-03-04 09:08:01
 *@return:
 */
export class Params {
  clock: THREE.Clock; //时钟
  animate: ViewerAnimate; //帧动画执行类
  gAmGroup: THREE.Group[]; //环境场景
  gRayGroup: THREE.Group[]; //鼠标拾取场景
  gScenes: THREE.Scene[]; //主场景
  gStatus: boolean[]; //场景是否存于内存
  scene: THREE.Scene; //场景容器
  model: ViewerModel; //模型类
  sceneidx: number; //场景id
  cameraClass: ViewerCamera; //相机类
  activeCamera: THREE.Camera; //激活相机
  renderer: THREE.WebGLRenderer; //渲染
  controls: ViewerControl; //控制器类
  ambient: ViewerAmbient; //环境光
  hemisphereLight: ViewerSkyLight; //半球光
  directional: ViewerDirectional; //平行光
  pointGroup: PointLightType[]; //点光源组合
  spotLight: ViewerSpot; //聚光灯
  rectAreaLight: ViewerRectArea; //区域光
  sky: ViewerSky; //天空
  environment: ViewerEnvironment; //环境贴图
  event: ViewerEvent; //事件
  souce: ViewerSource; //资源加载类
  parade: ViewerParade;
  spriteGroup: THREE.Object3D[];
  fog: ViewerFog; //雾
  water: ViewerWater; //水
  roam: ViewerRoam; //漫游
  options: ViewerParams; //实例参数
  constructor(options: ViewerParams) {
    this.options = options;
    this.clock = new Clock();
    this.animate = null;
    this.gAmGroup = [];
    this.gRayGroup = [];
    this.gScenes = [];
    this.gStatus = [];
    this.scene = null;
    this.model = null;
    this.sceneidx = 1;
    this.activeCamera = null;
    this.cameraClass = null;
    this.renderer = null;
    this.ambient = null;
    this.hemisphereLight = null;
    this.directional = null;
    this.pointGroup = [];
    this.spotLight = null;
    this.environment = null;
    this.event = null;
    this.souce = null;
    this.parade = null;
    this.water = null;
    this.spriteGroup = [];
  }
}
