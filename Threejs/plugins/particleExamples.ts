/**
 * @file: zhdParticleExamples.
 * @authors: yangj (yangjia@fjxhx.cc).
 * @createDate: 2022/3/4.
 * @version: 1.0.
 * @copyright © 2021 新和兴 All rights reserved.
 */
import * as THREE from "three";
import { Tween } from "./particleTween";

let gAppPath = "../public/lizi/";
var Type = Object.freeze({ CUBE: 1, SPHERE: 2 });
const textureLoader = new THREE.TextureLoader();
let Examples = {
  fountain: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 105, 0),
    positionSpread: new THREE.Vector3(10, 0, 10),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 60, 0),
    velocitySpread: new THREE.Vector3(100, 20, 100),

    accelerationBase: new THREE.Vector3(0, -100, 0),

    particleTexture: textureLoader.load(gAppPath + "star.png"),

    angleBase: 0,
    angleSpread: 180,
    angleVelocityBase: 0,
    angleVelocitySpread: 360 * 4,

    sizeTween: new Tween([0, 1], [1, 10]),
    opacityTween: new Tween([2, 3], [1, 0]),
    colorTween: new Tween(
      [0.5, 2],
      [new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(0.8, 1, 0.5)]
    ),

    particlesPerSecond: 200,
    particleDeathAge: 3.0,
    emitterDeathAge: 60,
  },

  fireball: {
    positionStyle: Type.SPHERE,
    positionBase: new THREE.Vector3(0, 50, 0),
    positionRadius: 2,

    velocityStyle: Type.SPHERE,
    speedBase: 2,
    speedSpread: 10,

    particleTexture: textureLoader.load(gAppPath + "smokeparticle.png"),

    sizeTween: new Tween([0, 0.1], [1, 50]),
    opacityTween: new Tween([0.7, 1], [1, 0]),
    colorBase: new THREE.Vector3(0.02, 1, 0.4),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 600,
    particleDeathAge: 0.5,
    emitterDeathAge: 60,
  },

  smoke: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 0, 0),
    positionSpread: new THREE.Vector3(2, 0, 2),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 30, 0),
    velocitySpread: new THREE.Vector3(20, 30, 20),
    accelerationBase: new THREE.Vector3(0, -10, 0),

    particleTexture: textureLoader.load(gAppPath + "smokeparticle.png"),
    speedBase: 10,
    speedSpread: 10,
    angleBase: 0,
    angleSpread: 120,
    angleVelocityBase: 0,
    angleVelocitySpread: 720,

    sizeTween: new Tween([0, 1], [32, 128]),
    opacityTween: new Tween([0.8, 2], [0.5, 0]),
    colorTween: new Tween(
      [0.4, 1],
      [new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, 0, 0.5)]
    ),

    particlesPerSecond: 100,
    particleDeathAge: 1.0,
    emitterDeathAge: 5,
  },

  clouds: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(-100, 100, 0),
    positionSpread: new THREE.Vector3(300, 20, 300),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(100, 0, 0),
    velocitySpread: new THREE.Vector3(100, 0, 0),

    particleTexture: textureLoader.load(gAppPath + "cloud_baseColor.png"),

    sizeBase: 200.0,
    sizeSpread: 100.0,
    colorBase: new THREE.Vector3(0.0, 0.0, 1), // H,S,L
    opacityTween: new Tween([0, 1, 4, 5], [0, 1, 1, 0]),

    particlesPerSecond: 200,
    particleDeathAge: 10.0,
    emitterDeathAge: 60,
  },

  snow: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 200, 0),
    positionSpread: new THREE.Vector3(200, 0, 200),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(40, -100, 0),
    velocitySpread: new THREE.Vector3(-30, 200, 10),
    accelerationBase: new THREE.Vector3(0, -10, 0),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 0,
    angleVelocitySpread: 60,

    particleTexture: textureLoader.load(gAppPath + "snowflake.png"),

    sizeTween: new Tween([0, 0.25], [4, 5]),
    colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
    opacityTween: new Tween([2, 3], [0.8, 0]),

    particlesPerSecond: 500,
    particleDeathAge: 1.0,
    emitterDeathAge: 60,
  },

  rain: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 200, 0),
    positionSpread: new THREE.Vector3(200, 0, 200),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, -200, 0),
    velocitySpread: new THREE.Vector3(50, 70, 50),
    accelerationBase: new THREE.Vector3(0, -10, 0),

    particleTexture: textureLoader.load(gAppPath + "rain.png"),
    sizeBase: 30,
    sizeSpread: 40.0,
    colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
    colorSpread: new THREE.Vector3(0.0, 0, 0.1),
    opacityBase: 0.4,

    particlesPerSecond: 500,
    particleDeathAge: 1.0,
    emitterDeathAge: 60,
  },

  starfield: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 200, 0),
    positionSpread: new THREE.Vector3(400, 50, 400),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 0, 0),
    velocitySpread: new THREE.Vector3(0.5, 0.5, 0.5),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 0,
    angleVelocitySpread: 4,

    particleTexture: textureLoader.load(gAppPath + "spikey.png"),

    sizeBase: 10.0,
    sizeSpread: 2.0,
    colorBase: new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
    colorSpread: new THREE.Vector3(0.0, 0.0, 0.2),
    opacityBase: 1,

    particlesPerSecond: 1000,
    particleDeathAge: 60.0,
    emitterDeathAge: 0.1,
  },
  //雾霾
  haze: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 50, 0),
    positionSpread: new THREE.Vector3(400, 100, 400),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 0, 0),
    velocitySpread: new THREE.Vector3(100.5, 0.5, 100.5),

    angleBase: 0,
    angleSpread: 0,
    angleVelocityBase: 0,
    angleVelocitySpread: 4,

    particleTexture: textureLoader.load(gAppPath + "smoke512.png"),

    sizeBase: 1000.0,
    sizeSpread: 2.0,
    colorBase: new THREE.Vector3(0.15, 1.0, 0), // H,S,L
    colorSpread: new THREE.Vector3(0.0, 0.0, 0.2),
    opacityBase: 0.15,

    particlesPerSecond: 1000,
    particleDeathAge: 60.0,
    emitterDeathAge: 0.1,
  },
  fireflies: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 100, 0),
    positionSpread: new THREE.Vector3(400, 200, 400),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 0, 0),
    velocitySpread: new THREE.Vector3(60, 20, 60),

    particleTexture: textureLoader.load(gAppPath + "spark.png"),

    sizeBase: 30.0,
    sizeSpread: 10.0,
    opacityTween: new Tween(
      [0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
      [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2]
    ),
    colorBase: new THREE.Vector3(0.3, 1.0, 0.6), // H,S,L
    colorSpread: new THREE.Vector3(0.3, 0.0, 0.0),

    particlesPerSecond: 20,
    particleDeathAge: 6.1,
    emitterDeathAge: 600,
  },

  startunnel: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 0, 0),
    positionSpread: new THREE.Vector3(10, 10, 10),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 100, 200),
    velocitySpread: new THREE.Vector3(40, 40, 80),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 10,
    angleVelocitySpread: 0,

    particleTexture: textureLoader.load(gAppPath + "spikey.png"),

    sizeBase: 4.0,
    sizeSpread: 2.0,
    colorBase: new THREE.Vector3(0.15, 1.0, 0.8), // H,S,L
    opacityBase: 1,
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 500,
    particleDeathAge: 4.0,
    emitterDeathAge: 60,
  },

  firework: {
    positionStyle: Type.SPHERE,
    positionBase: new THREE.Vector3(0, 100, 0),
    positionRadius: 10,

    velocityStyle: Type.SPHERE,
    speedBase: 90,
    speedSpread: 10,

    accelerationBase: new THREE.Vector3(0, -80, 0),

    particleTexture: textureLoader.load(gAppPath + "spark.png"),

    sizeTween: new Tween([0.5, 0.7, 1.3], [5, 40, 1]),
    opacityTween: new Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
    colorTween: new Tween(
      [0.4, 0.8, 1.0],
      [
        new THREE.Vector3(0, 1, 1),
        new THREE.Vector3(0, 1, 0.6),
        new THREE.Vector3(0.8, 1, 0.6),
      ]
    ),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 3000,
    particleDeathAge: 2.5,
    emitterDeathAge: 0.2,
  },

  candle: {
    positionStyle: Type.SPHERE,
    positionBase: new THREE.Vector3(0, 50, 0),
    positionRadius: 2,

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 30, 0),
    velocitySpread: new THREE.Vector3(15, 30, 15),
    speedBase: 10,
    speedSpread: 10,

    particleTexture: textureLoader.load(gAppPath + "smokeparticle.png"),

    sizeTween: new Tween([10, 10.3, 10.2], [30, 15, 10]),
    opacityTween: new Tween([0.9, 1.5], [1, 0]),
    colorTween: new Tween(
      [0.5, 1.0],
      [new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0)]
    ),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 150,
    particleDeathAge: 1,
    emitterDeathAge: 10,
  },
};
export default Examples;
