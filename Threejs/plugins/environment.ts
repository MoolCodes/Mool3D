import { PMREMGenerator } from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EnvironmentParams, EnvtType } from "../types/types";
export class Environment implements EnvtType {
  private pmremGenerator: THREE.PMREMGenerator;
  private path: string;
  private scene: THREE.Scene;
  environment: EnvironmentType;
  constructor(options: EnvironmentParams) {
    this.pmremGenerator = new PMREMGenerator(options.renderer);
    this.pmremGenerator.compileEquirectangularShader();
    this.path = options.path;
    this.scene = options.scene;
    this.environment = options.environment ?? {
      path: "",
      type: "exr",
    };
  }
  init() {
    this.getCubeMapTexture(this.environment).then((envMap) => {
      this.scene.environment = envMap;
    });
  }
  private loadHdr(path: string) {
    return new Promise((resolve, reject) => {
      new RGBELoader().load(
        this.path + path,
        (texture) => {
          const envMap =
            this.pmremGenerator.fromEquirectangular(texture).texture;
          this.pmremGenerator.dispose();
          resolve(envMap);
        },
        undefined,
        reject
      );
    });
  }
  private loadExr(path: string) {
    return new Promise((resolve, reject) => {
      new EXRLoader().load(
        this.path + path,
        (texture) => {
          const envMap =
            this.pmremGenerator.fromEquirectangular(texture).texture;
          this.pmremGenerator.dispose();

          resolve(envMap);
        },
        undefined,
        reject
      );
    });
  }
  //下载环境贴图
  private getCubeMapTexture(environment = { path: "", type: "hdr" }) {
    const { path, type } = environment;
    // no envmap
    if (!path) return Promise.resolve(null);

    switch (type) {
      case "hdr":
        return this.loadHdr(path);
      case "exr":
        return this.loadExr(path);
      default:
        return Promise.resolve(null);
    }
  }
}
