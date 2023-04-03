export interface SpriteType {
  sprite: THREE.Sprite;
  init: Fn<SpriteParams>;
}

export interface SpriteParams {
  texture: THREE.Texture;
  name: string;
}
