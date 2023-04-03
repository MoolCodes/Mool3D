export interface ParticleType {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  angle: number;
  angleVelocity: number;
  angleAcceleration: number;
  size: number;
  color: THREE.Color;
  opacity: number;
  age: number;
  alive: number;
  update: FnParamsReturn<number, unknown>;
}
export interface ParticleParams {
  mugen: boolean;
  scene: THREE.Scene;
}
