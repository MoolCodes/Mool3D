import { AnimationMixer, LoadingManager, FrontSide } from "three";
import { GLTFExtensionLoader } from "../threelibex/GLTFExtensionLoader";
import { ModelType, ModelParams } from "../types/types";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import axios from "axios";

export class Model implements ModelType {
  mixer: THREE.AnimationMixer; //动画实例
  private gScenes: THREE.Scene[];
  private gStatus: boolean[];
  private gRayGroup: THREE.Group[];
  private gAmGroup: THREE.Group[];
  private baseURL: string;
  private bus: any;
  animate: boolean;
  deepFunction: Fn<{
    e: THREE.Mesh;
    item: ModelConfig;
  }>[]; //深度处理场景业务逻辑
  constructor(options: ModelParams) {
    this.mixer = null;
    this.gScenes = options.gScenes;
    this.gStatus = options.gStatus;
    this.gRayGroup = options.gRayGroup;
    this.gAmGroup = options.gAmGroup;
    this.baseURL = options.baseURL;
    this.bus = options.bus;
    this.deepFunction = [];
    this.animate = true;
    options.animateFuntion?.push((dt) => {
      if (this.animate) {
        this.mixer && this.mixer.update(dt);
      }
    });
  }
  /*
   *@description: 加载配置文件
   *@author: yangj
   *@date: 2023-03-04 16:26:55
   *@return:
   */
  private getConfig() {
    return axios.get(this.baseURL + "config.json");
  }
  /*
   *@description: 加载glb
   *@author: yangj
   *@date: 2023-03-04 16:27:04
   *@return:
   */
  load(sceneidx: number, callback: Fn<any>) {
    let icount = 0;
    let dicount = 0;
    this.getConfig()
      .then((res) => {
        res.data.forEach((configItem: ModelConfig) => {
          if (sceneidx !== configItem["layeridx"]) {
            return;
          }
          configItem["layers"].forEach((layers: Layers) => {
            icount++;
            this.loadConfigModel(
              this.baseURL + layers["name"],
              configItem,
              (scene) => {
                this.decodeSence(scene, configItem, layers, () => {
                  dicount++;
                  this.bus.emit("scene", {
                    type: "loading",
                    progressNum: (dicount / icount) * 100,
                    value: true,
                  });
                  if (dicount === icount) {
                    this.gStatus[sceneidx] = true;
                    callback ? callback() : "";
                  }
                });
              }
            );
          });
        });
      })
      .catch(() => {});
  }
  /*
   *@description: 加载配置文件glb
   *@author: yangj
   *@date: 2023-03-04 16:27:26
   *@return:
   */
  private loadConfigModel(
    url: string,
    configItem: ModelConfig,
    callback: Fn<any>
  ) {
    const that = this;
    const loader = new GLTFExtensionLoader(new LoadingManager());
    loader.load(url).then((gltf) => {
      let ascene: THREE.Scene = gltf.scene;
      ascene.scale.set(configItem.scale, configItem.scale, configItem.scale);
      ascene.animations = gltf.animations;
      if (configItem.target) {
        that.gRayGroup[configItem.layeridx].add(ascene);
      } else {
        that.gAmGroup[configItem.layeridx].add(ascene);
      }
      callback ? callback(ascene) : "";
    });
  }
  /*
   *@description: 加载glb
   *@author: yangj
   *@date: 2023-03-19 18:25:38
   *@return:
   */
  loadModel(
    url: string,
    sceneidx: number,
    callback: FnTwoParams<THREE.Group, THREE.AnimationClip[], unknown>
  ) {
    const loader = new GLTFExtensionLoader(new LoadingManager());
    loader.load(url).then((glb) => {
      this.addclips(glb.animations, sceneidx);
      callback(glb.scene, glb.animations);
    });
  }
  /*
   *@description: 加载fbx
   *@author: yangj
   *@date: 2023-03-28 14:42:51
   *@return:
   */
  loadFbxModel(
    url: string,
    sceneidx: number,
    callback: FnTwoParams<THREE.Group, THREE.AnimationClip[], unknown>
  ) {
    const loader = new FBXLoader();
    loader.load(url, (object) => {
      this.addclips(object.animations, sceneidx);
      callback(object, object.animations);
    });
  }
  /*
   *@description: 处理模型
   *@author: yangj
   *@date: 2023-03-04 16:26:35
   *@return:
   */
  private decodeSence(
    scene: any,
    configItem: ModelConfig,
    layers: Layers,
    callback: Fn<any>
  ) {
    const tage = layers["receiveShadow"];

    if (configItem["positionX"]) {
      scene.position.setX(configItem["positionX"]);
    }
    if (configItem["positionY"]) {
      scene.position.setY(configItem["positionY"]);
    }
    if (configItem["positionZ"]) {
      scene.position.setZ(configItem["positionZ"]);
    }
    scene.traverse((e) => {
      if (e.isMesh) {
        if (tage) {
          e.castShadow = false;
          e.receiveShadow = true;
        } else {
          e.castShadow = true;
          e.receiveShadow = true;
        }
        e.material.shadowSide = FrontSide;
        e.material.needsUpdate = true;
        this.deepFunction.forEach((fn) =>
          fn({
            e,
            item: configItem,
          })
        );
      }
    });

    this.addclips(scene.animations, configItem["layeridx"]);
    callback ? callback() : "";
  }
  /*
   *@description: 添加动画组
   *@author: yangj
   *@date: 2023-03-04 16:26:24
   *@return:
   */
  private addclips(clips: any, sidx: number) {
    clips.forEach((item) => {
      this.gScenes[sidx].animations.push(item);
    });
  }
  /*
   *@description: 执行动画
   *@author: yangj
   *@date: 2023-03-04 14:01:12
   *@return:
   */
  playAllClipes(sceneidx: number) {
    // 先全部停止
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = null;
      this.mixer = new AnimationMixer(this.gScenes[sceneidx]);
    } else {
      this.mixer = new AnimationMixer(this.gScenes[sceneidx]);
    }
    this.gScenes[sceneidx].animations.forEach((clip) => {
      this.mixer.clipAction(clip).reset().play();
    });
  }
  /*
   *@description: 执行名称动画
   *@author: yangj
   *@date: 2023-03-19 18:48:08
   *@return:
   */
  playNameClipes(sceneidx: number, clipName: string) {
    // 先全部停止
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = null;
      this.mixer = new AnimationMixer(this.gScenes[sceneidx]);
    } else {
      this.mixer = new AnimationMixer(this.gScenes[sceneidx]);
    }
    this.gScenes[sceneidx].animations.forEach((clip) => {
      if (clip.name === clipName) {
        this.mixer.clipAction(clip).reset().play();
      }
    });
  }
}
