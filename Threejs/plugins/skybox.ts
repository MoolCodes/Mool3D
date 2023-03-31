import {
  BoxGeometry,
  BackSide,
  TextureLoader,
  MeshBasicMaterial,
  Mesh,
  Vector3,
} from "three";
import { Sky as SkyShader } from "../shader/sky";
import { SkyParams, SkyType, ShaderSkyParams } from "../types/types";
export class Sky implements SkyType {
  private path: string;
  private sceneidx: number;
  private gSkyBox: THREE.Mesh[];
  private gScenes: THREE.Scene[];
  sky: THREE.Object3D;
  constructor(options: SkyParams) {
    this.path = options.path;
    this.gSkyBox = [null, null];
    this.sceneidx = options.sceneidx;
    this.gScenes = options.gScenes;
  }
  setSkyBox(skydir: string) {
    // 创建几何模型 BoxGeometry('x轴', '轴', 'z轴')
    const geometry = new BoxGeometry(20000, 20000, 20000);
    // 创建纹理贴图  前后  上下  左右
    const texture0 = new TextureLoader().load(this.path + `${skydir}/px.jpg`);
    const texture1 = new TextureLoader().load(this.path + `${skydir}/nx.jpg`);
    const texture2 = new TextureLoader().load(this.path + `${skydir}/py.jpg`);
    const texture3 = new TextureLoader().load(this.path + `${skydir}/ny.jpg`);
    const texture4 = new TextureLoader().load(this.path + `${skydir}/pz.jpg`);
    const texture5 = new TextureLoader().load(this.path + `${skydir}/nz.jpg`);
    // 添加材质
    const material = [
      new MeshBasicMaterial({
        color: 0xffffff,
        map: texture0,
        side: BackSide,
      }),
      new MeshBasicMaterial({
        color: 0xffffff,
        map: texture1,
        side: BackSide,
      }),
      new MeshBasicMaterial({
        color: 0xffffff,
        map: texture2,
        side: BackSide,
      }),
      new MeshBasicMaterial({
        color: 0xffffff,
        map: texture3,
        side: BackSide,
      }),
      new MeshBasicMaterial({
        color: 0xffffff,
        map: texture4,
        side: BackSide,
      }),
      new MeshBasicMaterial({
        color: 0xffffff,
        map: texture5,
        side: BackSide,
      }),
    ];
    // 创建网格对象
    const cube = new Mesh(geometry, material as any);
    cube.name = "skybox";
    this.sky = cube;
    if (this.gSkyBox[this.sceneidx]) {
      this.gScenes[this.sceneidx].remove(this.gSkyBox[this.sceneidx]);
      this.gSkyBox[this.sceneidx].geometry.dispose();
    }

    this.gSkyBox[this.sceneidx] = cube;
    this.gScenes[this.sceneidx].add(cube);
  }

  initShaderSky(option: ShaderSkyParams) {
    if (this.gSkyBox[this.sceneidx]) {
      this.gScenes[this.sceneidx].remove(this.gSkyBox[this.sceneidx]);
    }
    const sky = new SkyShader();
    this.sky = sky;
    (sky as any).scale.setScalar(option.scale);
    this.gScenes[this.sceneidx].add(sky);
    const skyUniforms = (sky as any).material.uniforms;
    skyUniforms["turbidity"].value = option.turbidity; //浑浊度
    skyUniforms["rayleigh"].value = option.rayleigh; //散射
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;
    skyUniforms["sunPosition"].value = new Vector3(...option.postion);
  }
}
