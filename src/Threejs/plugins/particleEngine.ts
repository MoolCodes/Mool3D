import { ParticleType, ParticleParams } from "../types/types";
import {
  Vector3,
  NormalBlending,
  Color,
  Float32BufferAttribute,
  Points,
  AdditiveBlending,
  BufferGeometry,
  ShaderMaterial,
} from "three";
import { Particle } from "./particle";
import {
  particleFragmentShader,
  particleVertexShader,
} from "../shader/particle";
import { Tween } from "./particleTween";
var Type = Object.freeze({ CUBE: 1, SPHERE: 2 });
export class ParticleEngine implements ParticleEngineType {
  private positions: number[];
  private customVisibles: number[];
  private customColor: number[];
  private customOpacity: number[];
  private customSize: number[];
  private customAngle: number[];
  private positionStyle: number;
  private positionBase: THREE.Vector3;
  private positionSpread: THREE.Vector3;
  private positionRadius: number;
  private velocityStyle: number;
  private velocityBase: THREE.Vector3;
  private velocitySpread: THREE.Vector3;
  private speedBase: number;
  private speedSpread: number;
  private accelerationBase: THREE.Vector3;
  private accelerationSpread: THREE.Vector3;
  private angleBase: number;
  private angleSpread: number;
  private angleVelocityBase: number;
  private angleVelocitySpread: number;
  private angleAccelerationBase: number;
  private angleAccelerationSpread: number;
  private sizeBase: number;
  private sizeSpread: number;
  private sizeTween: ParticleTween;
  private colorBase: THREE.Vector3;
  private colorSpread: THREE.Vector3;
  private colorTween: ParticleTween;
  private opacityBase: number;
  private opacitySpread: number;
  private opacityTween: ParticleTween;
  private blendStyle: any;
  private particleArray: ParticleType[];
  private particlesPerSecond: number;
  private particleDeathAge: number;
  private emitterAge: number;
  private emitterAlive: boolean;
  private emitterDeathAge: number;
  private particleCount: number;
  private particleGeometry: THREE.BufferGeometry;
  private particleTexture: THREE.TextureLoader;
  private particleMaterial: THREE.ShaderMaterial;
  private particleMesh: THREE.Points;
  mugen: boolean;
  scene: THREE.Scene;
  start: boolean;
  constructor(options: ParticleParams) {
    this.positions = [];
    this.customVisibles = [];
    this.customColor = [];
    this.customOpacity = [];
    this.customSize = [];
    this.customAngle = [];
    this.positionStyle = Type.CUBE;
    this.positionBase = new Vector3();
    this.positionSpread = new Vector3();
    this.positionRadius = 0;
    this.velocityStyle = Type.CUBE;
    this.velocityBase = new Vector3();
    this.velocitySpread = new Vector3();
    this.speedBase = 0;
    this.speedSpread = 0;
    this.accelerationBase = new Vector3();
    this.accelerationSpread = new Vector3();
    this.angleBase = 0;
    this.angleSpread = 0;
    this.angleVelocityBase = 0;
    this.angleVelocitySpread = 0;
    this.angleAccelerationBase = 0;
    this.angleAccelerationSpread = 0;
    this.sizeBase = 0.0;
    this.sizeSpread = 0.0;
    this.sizeTween = new Tween();
    this.colorBase = new Vector3(0.0, 0, 0);
    this.colorSpread = new Vector3(0.0, 0.0, 0.0);
    this.colorTween = new Tween();
    this.opacityBase = 1.0;
    this.opacitySpread = 0.0;
    this.opacityTween = new Tween();
    this.blendStyle = NormalBlending; // false;
    this.particleArray = [];
    this.particlesPerSecond = 100;
    this.particleDeathAge = 1.0;
    this.emitterAge = 0.0;
    this.emitterAlive = true;
    this.emitterDeathAge = 60;
    this.particleCount =
      this.particlesPerSecond *
      Math.min(this.particleDeathAge, this.emitterDeathAge);
    this.particleGeometry = null;
    this.particleTexture = null;
    this.particleMaterial = null;
    this.particleMesh = null;

    this.mugen = options.mugen || false;
    this.scene = options.scene;
    this.start = false;
  }
  /*
   *@description: 创建粒子
   *@author: yangj
   *@date: 2023-03-15 15:42:15
   *@return:
   */
  private createParticle() {
    var particle = new Particle();
    if (this.positionStyle == Type.CUBE) {
      particle.position = this.randomVector3(
        this.positionBase,
        this.positionSpread
      );
    }
    if (this.positionStyle == Type.SPHERE) {
      var z = 2 * Math.random() - 1;
      var t = 6.2832 * Math.random();
      var r = Math.sqrt(1 - z * z);
      var vec3 = new Vector3(r * Math.cos(t), r * Math.sin(t), z);
      particle.position = new Vector3().addVectors(
        this.positionBase,
        vec3.multiplyScalar(this.positionRadius)
      );
    }

    if (this.velocityStyle == Type.CUBE) {
      particle.velocity = this.randomVector3(
        this.velocityBase,
        this.velocitySpread
      );
    }
    if (this.velocityStyle == Type.SPHERE) {
      var direction = new Vector3().subVectors(
        particle.position,
        this.positionBase
      );
      var speed = this.randomValue(this.speedBase, this.speedSpread);
      particle.velocity = direction.normalize().multiplyScalar(speed);
    }
    particle.acceleration = this.randomVector3(
      this.accelerationBase,
      this.accelerationSpread
    );
    particle.angle = this.randomValue(this.angleBase, this.angleSpread);
    particle.angleVelocity = this.randomValue(
      this.angleVelocityBase,
      this.angleVelocitySpread
    );
    particle.angleAcceleration = this.randomValue(
      this.angleAccelerationBase,
      this.angleAccelerationSpread
    );
    particle.size = this.randomValue(this.sizeBase, this.sizeSpread);
    var color = this.randomVector3(this.colorBase, this.colorSpread);
    particle.color = new Color().setHSL(color.x, color.y, color.z);
    particle.opacity = this.randomValue(this.opacityBase, this.opacitySpread);
    particle.age = 0;
    particle.alive = 0;
    return particle;
  }

  initialize() {
    var positions = [];
    var customVisibles = [];
    var customColor = [];
    var customOpacity = [];
    var customSize = [];
    var customAngle = [];
    for (var i = 0; i < this.particleCount; i++) {
      this.particleArray[i] = this.createParticle();
      positions.push(this.particleArray[i].position.x);
      positions.push(this.particleArray[i].position.y);
      positions.push(this.particleArray[i].position.z);
      customVisibles.push(this.particleArray[i].alive);
      customColor.push(this.particleArray[i].color.r);
      customColor.push(this.particleArray[i].color.g);
      customColor.push(this.particleArray[i].color.b);
      customOpacity.push(this.particleArray[i].opacity);
      customSize.push(this.particleArray[i].size);
      customAngle.push(this.particleArray[i].angle);
    }
    this.positions = positions;
    this.customVisibles = customVisibles;
    this.customColor = customColor;
    this.customOpacity = customOpacity;
    this.customSize = customSize;
    this.customAngle = customAngle;
    this.particleGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(this.positions, 3)
    );
    this.particleGeometry.setAttribute(
      "customVisible",
      new Float32BufferAttribute(this.customVisibles, 1)
    );
    this.particleGeometry.setAttribute(
      "customColor",
      new Float32BufferAttribute(this.customColor, 3)
    );
    this.particleGeometry.setAttribute(
      "customOpacity",
      new Float32BufferAttribute(this.customOpacity, 1)
    );
    this.particleGeometry.setAttribute(
      "customSize",
      new Float32BufferAttribute(this.customSize, 1)
    );
    this.particleGeometry.setAttribute(
      "customAngle",
      new Float32BufferAttribute(this.customAngle, 1)
    );

    this.particleMaterial.blending = this.blendStyle;
    if (this.blendStyle !== NormalBlending) {
      this.particleMaterial.depthTest = false;
    }

    this.particleMesh = new Points(
      this.particleGeometry,
      this.particleMaterial
    );
    // this.particleMesh.dynamic = true;
    // this.particleMesh.sortParticles = true;
    this.scene.add(this.particleMesh);
    this.start = true;
  }

  setValues(parameters, params) {
    if (parameters === undefined) {
      return;
    }
    let obj = Object.assign(parameters, params);
    this.sizeTween = new Tween();
    this.colorTween = new Tween();
    this.opacityTween = new Tween();
    for (var key in obj) {
      this[key] = obj[key];
    }
    Particle.prototype.sizeTween = this.sizeTween;
    Particle.prototype.colorTween = this.colorTween;
    Particle.prototype.opacityTween = this.opacityTween;
    this.particleArray = [];
    this.emitterAge = 0.0;
    this.emitterAlive = true;
    this.particleCount =
      this.particlesPerSecond *
      Math.min(this.particleDeathAge, this.emitterDeathAge);
    this.particleGeometry = new BufferGeometry();
    this.particleMaterial = new ShaderMaterial({
      uniforms: {
        mytexture: { value: this.particleTexture },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      blending: AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });
    this.particleMesh = new Points();
  }
  private reastValues(parameters) {
    this.sizeTween = new Tween();
    this.colorTween = new Tween();
    this.opacityTween = new Tween();
    for (var key in parameters) {
      this[key] = parameters[key];
    }
  }
  private randomValue(base: number, spread: number) {
    return base + spread * (Math.random() - 0.5);
  }

  private randomVector3(base: THREE.Vector3, spread: THREE.Vector3) {
    var rand3 = new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    return new Vector3().addVectors(
      base,
      new Vector3().multiplyVectors(spread, rand3)
    );
  }
  destroy() {
    this.start = false;
    this.reastValues({
      positionBase: new Vector3(),
      positionStyle: Type.CUBE,
      positionSpread: new Vector3(),
      positionRadius: 0,
      velocityStyle: Type.CUBE,
      velocityBase: new Vector3(),
      velocitySpread: new Vector3(),
      speedBase: 0,
      speedSpread: 0,
      accelerationBase: new Vector3(),
      accelerationSpread: new Vector3(),
      particleTexture: null,
      angleBase: 0,
      angleSpread: 0,
      angleVelocityBase: 0,
      angleVelocitySpread: 0,
      angleAccelerationBase: 0,
      angleAccelerationSpread: 0,
      sizeBase: 0.0,
      sizeSpread: 0.0,
      sizeTween: null,
      colorBase: new Vector3(0.0, 0.0, 0.0),
      colorSpread: new Vector3(0, 0, 0),
      colorTween: null,
      opacityBase: 0,
      opacitySpread: 0,
      opacityTween: null,
      blendStyle: NormalBlending,
      particlesPerSecond: 0,
      particleDeathAge: 0,
      emitterDeathAge: 0,
    });
    this.scene.remove(this.particleMesh);
  }

  update(dt) {
    var recycleIndices = [];

    for (var i = 0; i < this.particleCount; i++) {
      if (this.particleArray[i].alive) {
        this.particleArray[i].update(dt);
        if (this.particleArray[i].age > this.particleDeathAge) {
          this.particleArray[i].alive = 0.0;
          recycleIndices.push(i);
        }

        this.customVisibles[i] = this.particleArray[i].alive;
        this.customColor[i * 3] = this.particleArray[i].color.r;
        this.customColor[i * 3 + 1] = this.particleArray[i].color.g;
        this.customColor[i * 3 + 2] = this.particleArray[i].color.b;
        this.customOpacity[i] = this.particleArray[i].opacity;
        this.customSize[i] = this.particleArray[i].size;
        this.customAngle[i] = this.particleArray[i].angle;
      }
    }

    this.particleGeometry.setAttribute(
      "customVisible",
      new Float32BufferAttribute(this.customVisibles, 1)
    );
    this.particleGeometry.setAttribute(
      "customColor",
      new Float32BufferAttribute(this.customColor, 3)
    );
    this.particleGeometry.setAttribute(
      "customOpacity",
      new Float32BufferAttribute(this.customOpacity, 1)
    );
    this.particleGeometry.setAttribute(
      "customSize",
      new Float32BufferAttribute(this.customSize, 1)
    );
    this.particleGeometry.setAttribute(
      "customAngle",
      new Float32BufferAttribute(this.customAngle, 1)
    );

    this.particleGeometry.attributes.customVisible.needsUpdate = true;
    this.particleGeometry.attributes.customColor.needsUpdate = true;
    this.particleGeometry.attributes.customOpacity.needsUpdate = true;
    this.particleGeometry.attributes.customSize.needsUpdate = true;
    this.particleGeometry.attributes.customAngle.needsUpdate = true;

    if (!this.emitterAlive) return;

    if (this.emitterAge < this.particleDeathAge) {
      var startIndex = Math.round(
        this.particlesPerSecond * (this.emitterAge + 0)
      );
      var endIndex = Math.round(
        this.particlesPerSecond * (this.emitterAge + dt)
      );
      if (endIndex > this.particleCount) {
        endIndex = this.particleCount;
      }

      for (var i = startIndex; i < endIndex; i++) {
        this.particleArray[i].alive = 1.0;
      }
    }

    for (
      var j = 0;
      j < recycleIndices.length;
      j++ // 无限循环
    ) {
      var i: number = recycleIndices[j];
      this.particleArray[i] = this.createParticle();
      this.particleArray[i].alive = 1.0; // activate right away
      this.positions[i * 3] =
        this.particleArray[i].position.x + 0.1 * Math.sin(0.1 * i + 0.1 * dt);
      this.positions[i * 3 + 1] =
        this.particleArray[i].position.y + 0.1 * Math.sin(0.1 * i + 0.1 * dt);
      this.positions[i * 3 + 2] =
        this.particleArray[i].position.z + 0.1 * Math.sin(0.1 * i + 0.1 * dt);
    }
    for (var j = 0; j < this.particleCount; j++) {
      this.positions[j * 3] = this.particleArray[j].position.x;
      this.positions[j * 3 + 1] = this.particleArray[j].position.y;
      this.positions[j * 3 + 2] = this.particleArray[j].position.z;
    }

    this.particleGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(this.positions, 3)
    );
    this.emitterAge += dt;
    if (!this.mugen) {
      if (this.emitterAge > this.emitterDeathAge) this.emitterAlive = false;
    }
  }
}
