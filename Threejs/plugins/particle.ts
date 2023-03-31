import { Vector3, Color } from "three";
import { ParticleType } from "../types/types";
export class Particle implements ParticleType {
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
  sizeTween: ParticleTween;
  colorTween: ParticleTween;
  opacityTween: ParticleTween;
  constructor() {
    this.position = new Vector3(); //位置
    this.velocity = new Vector3(); //位移向量（移动方向和距离）
    this.acceleration = new Vector3(); //位移向量的增量（每次产生位移后改变位移向量）
    this.angle = 0; //角度
    this.angleVelocity = 0; //角度增量
    this.angleAcceleration = 0; //改变角度增量的增量
    this.size = 16.0; //大小
    this.color = new Color(); //颜色
    this.opacity = 1.0; //透明度
    this.age = 0; //时间
    this.alive = 0; //存活
  }
  update(dt: number) {
    this.position.add(this.velocity.clone().multiplyScalar(dt)); //位置在位移方向上的运动
    this.velocity.add(this.acceleration.clone().multiplyScalar(dt)); //位移向量的改变
    this.angle += this.angleVelocity * 0.01745329251 * dt; // 角度在角度偏移量上的改变
    this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt; // 角度偏移量自身的改变
    this.age += dt;

    if (this.sizeTween.times.length > 0) {
      this.size = this.sizeTween.lerp(this.age);
    }

    if (this.colorTween.times.length > 0) {
      var colorHSL = this.colorTween.lerp(this.age);
      this.color = new Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z);
    }

    if (this.opacityTween.times.length > 0) {
      this.opacity = this.opacityTween.lerp(this.age);
    }
  }
}
