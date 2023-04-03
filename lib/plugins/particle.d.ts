import { ParticleType } from "../types/types";
export declare class Particle implements ParticleType {
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
    constructor();
    update(dt: number): void;
}
