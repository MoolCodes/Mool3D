declare type Fn<T> = (params?: T) => void;
declare type FnNoParamsReturn<T> = () => T;
declare type FnTwoParams<T, P, R> = (a: T, b: P) => R;
declare type FnThreeParams<T, P, Z, R> = (a: T, b: P, c: Z) => R;
declare type FnParamsReturn<T, R> = (params: T) => R;
declare enum EnvironmentEnum {
  "hdr",
  "exr",
}
declare type environmentType = keyof typeof EnvironmentEnum;

declare interface EnvironmentType {
  path: string;
  type: environmentType;
}
interface EventObject {
  uv: THREE.Vector3;
  point: THREE.Vector3;
  object: THREE.Mesh;
  faceIndex: number;
  face: THREE.Face;
  distance: number;
}
declare interface EventCallbackParams {
  event: MouseEvent;
  list: EventObject[];
}

declare enum EventEnum {
  "click",
  "dblclick",
  "mousemove",
}
declare type EventTypes = keyof typeof EventEnum;
declare interface FlyToParams {
  position: number[];
  controls?: number[];
  duration?: number;
  easing?: number;
  start?: Fn<any>;
  done?: Fn<any>;
  stop?: Fn<any>;
  update?: Fn<any>;
}
interface Layers {
  name: string;
}
declare interface ModelConfig {
  name: string;
  target: boolean;
  layeridx: number;
  scale: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  layers: Layers[];
}

declare interface ParticleTween {
  times: number[];
  values: THREE.Vector3 | number[];
  lerp: FnParamsReturn<number, any>;
}
declare enum ParticleKey {
  "fountain",
  "fireball",
  "smoke",
  "clouds",
  "snow",
  "rain",
  "starfield",
  "haze",
  "fireflies",
  "startunnel",
  "firework",
  "candle",
}
declare type ParticleKeys = keyof typeof ParticleKey;
declare interface ParticleEngineType {
  mugen: boolean;
  scene: THREE.Scene;
  start: boolean;
  initialize: Fn<any>;
  setValues: FnTwoParams<any, any, unknown>;
  destroy: Fn<any>;
  update: FnParamsReturn<number, unknown>;
}
declare type ParticleExamplesParams = Partial<{
  positionBase: THREE.Vector3; //初始位置
  positionStyle: 1 | 2; //cube or sphere
  positionSpread: THREE.Vector3; //初始位置随机累加值（差异化）
  positionRadius: number; //sphere类型的粒子扩散范围
  velocityStyle: 1 | 2; //cube or sphere
  velocityBase: THREE.Vector3; //粒子运动方向以及速度
  velocitySpread: THREE.Vector3; //初始化粒子运动方向和速度随机累加值（差异化）
  speedBase: number; //sphere类型粒子扩散速度
  speedSpread: number; //sphere类型粒子扩散速度随机累加值（差异化）
  accelerationBase: THREE.Vector3; //运动初始加速度
  accelerationSpread: THREE.Vector3; //运动加速度随机累加值（差异化）
  angleBase: number; //角度初始值
  angleSpread: number; // 角度初始化随机累计值（差异化）
  angleVelocityBase: number; //角度随着运动增量
  angleVelocitySpread: number; //角度增量随机累加值（差异化）
  sizeBase: number; //大小初始值
  sizeSpread: number; //大小初始化随机累加值（差异化）
  sizeTween: ParticleTween; //大小随时间变化过渡函数
  colorBase: THREE.Vector3; //颜色初始值
  colorSpread: THREE.Vector3; //颜色初始化随机累加值（差异化）
  colorTween: ParticleTween; //颜色随时间变化过渡函数
  opacityBase: number; //透明度初始值
  opacitySpread: number; //透明度初始化随机累加值（差异化）
  opacityTween: ParticleTween; //透明度随时间变化过渡函数
  particlesPerSecond: number; //每秒产生粒子数量
  particleDeathAge: number; //粒子存活时间
  emitterDeathAge: number; //结束粒子运动时间
  particleTexture: THREE.Texture;
}>;
