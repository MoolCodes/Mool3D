import {
  WebGLRenderer,
  sRGBEncoding,
  ReinhardToneMapping,
  PCFSoftShadowMap,
} from "three";
import { RenderType } from "../types/types";
export class Renderer implements RenderType {
  renderer: THREE.WebGLRenderer;
  private el: HTMLElement;
  constructor(el: HTMLElement) {
    this.renderer = null;
    this.el = el;
    this.init();
  }
  private init() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.physicallyCorrectLights = false;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setClearColor(0x000000);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.renderer.toneMapping = ReinhardToneMapping;
    //按序渲染
    this.renderer.sortObjects = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap; //提高阴影的柔和度
    (this.renderer as any).gammaInput = true;
    (this.renderer as any).gammaOutput = true; //inear转gamma
    (this.renderer as any).gammaFactor = 2.2;
  }
}
