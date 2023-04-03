/**
 * @file: zhdParticleExamples.
 * @authors: yangj (yangjia@fjxhx.cc).
 * @createDate: 2022/3/4.
 * @version: 1.0.
 * @copyright © 2021 新和兴 All rights reserved.
 */
import * as THREE from "three";
import { Tween } from "./particleTween";
declare let Examples: {
    fountain: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        accelerationBase: THREE.Vector3;
        particleTexture: THREE.Texture;
        angleBase: number;
        angleSpread: number;
        angleVelocityBase: number;
        angleVelocitySpread: number;
        sizeTween: Tween;
        opacityTween: Tween;
        colorTween: Tween;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    fireball: {
        positionStyle: 2;
        positionBase: THREE.Vector3;
        positionRadius: number;
        velocityStyle: 2;
        speedBase: number;
        speedSpread: number;
        particleTexture: THREE.Texture;
        sizeTween: Tween;
        opacityTween: Tween;
        colorBase: THREE.Vector3;
        blendStyle: THREE.Blending;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    smoke: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        accelerationBase: THREE.Vector3;
        particleTexture: THREE.Texture;
        speedBase: number;
        speedSpread: number;
        angleBase: number;
        angleSpread: number;
        angleVelocityBase: number;
        angleVelocitySpread: number;
        sizeTween: Tween;
        opacityTween: Tween;
        colorTween: Tween;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    clouds: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        particleTexture: THREE.Texture;
        sizeBase: number;
        sizeSpread: number;
        colorBase: THREE.Vector3;
        opacityTween: Tween;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    snow: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        accelerationBase: THREE.Vector3;
        angleBase: number;
        angleSpread: number;
        angleVelocityBase: number;
        angleVelocitySpread: number;
        particleTexture: THREE.Texture;
        sizeTween: Tween;
        colorBase: THREE.Vector3;
        opacityTween: Tween;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    rain: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        accelerationBase: THREE.Vector3;
        particleTexture: THREE.Texture;
        sizeBase: number;
        sizeSpread: number;
        colorBase: THREE.Vector3;
        colorSpread: THREE.Vector3;
        opacityBase: number;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    starfield: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        angleBase: number;
        angleSpread: number;
        angleVelocityBase: number;
        angleVelocitySpread: number;
        particleTexture: THREE.Texture;
        sizeBase: number;
        sizeSpread: number;
        colorBase: THREE.Vector3;
        colorSpread: THREE.Vector3;
        opacityBase: number;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    haze: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        angleBase: number;
        angleSpread: number;
        angleVelocityBase: number;
        angleVelocitySpread: number;
        particleTexture: THREE.Texture;
        sizeBase: number;
        sizeSpread: number;
        colorBase: THREE.Vector3;
        colorSpread: THREE.Vector3;
        opacityBase: number;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    fireflies: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        particleTexture: THREE.Texture;
        sizeBase: number;
        sizeSpread: number;
        opacityTween: Tween;
        colorBase: THREE.Vector3;
        colorSpread: THREE.Vector3;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    startunnel: {
        positionStyle: 1;
        positionBase: THREE.Vector3;
        positionSpread: THREE.Vector3;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        angleBase: number;
        angleSpread: number;
        angleVelocityBase: number;
        angleVelocitySpread: number;
        particleTexture: THREE.Texture;
        sizeBase: number;
        sizeSpread: number;
        colorBase: THREE.Vector3;
        opacityBase: number;
        blendStyle: THREE.Blending;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    firework: {
        positionStyle: 2;
        positionBase: THREE.Vector3;
        positionRadius: number;
        velocityStyle: 2;
        speedBase: number;
        speedSpread: number;
        accelerationBase: THREE.Vector3;
        particleTexture: THREE.Texture;
        sizeTween: Tween;
        opacityTween: Tween;
        colorTween: Tween;
        blendStyle: THREE.Blending;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
    candle: {
        positionStyle: 2;
        positionBase: THREE.Vector3;
        positionRadius: number;
        velocityStyle: 1;
        velocityBase: THREE.Vector3;
        velocitySpread: THREE.Vector3;
        speedBase: number;
        speedSpread: number;
        particleTexture: THREE.Texture;
        sizeTween: Tween;
        opacityTween: Tween;
        colorTween: Tween;
        blendStyle: THREE.Blending;
        particlesPerSecond: number;
        particleDeathAge: number;
        emitterDeathAge: number;
    };
};
export default Examples;