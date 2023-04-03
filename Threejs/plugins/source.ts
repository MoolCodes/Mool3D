import { TextureLoader } from "three";
import { SourceType } from "../types/types";
export class Source implements SourceType {
  private textureLoader: THREE.TextureLoader;
  constructor() {
    this.textureLoader = new TextureLoader();
  }
  loadTexture({ path, onLoad, onProgress, onError }): any {
    return this.textureLoader.load(path, onLoad, onProgress, onError);
  }
}
