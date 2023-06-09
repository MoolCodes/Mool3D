import { ParticleParams } from "../types/types";
export declare class ParticleEngine implements ParticleEngineType {
    private positions;
    private customVisibles;
    private customColor;
    private customOpacity;
    private customSize;
    private customAngle;
    private positionStyle;
    private positionBase;
    private positionSpread;
    private positionRadius;
    private velocityStyle;
    private velocityBase;
    private velocitySpread;
    private speedBase;
    private speedSpread;
    private accelerationBase;
    private accelerationSpread;
    private angleBase;
    private angleSpread;
    private angleVelocityBase;
    private angleVelocitySpread;
    private angleAccelerationBase;
    private angleAccelerationSpread;
    private sizeBase;
    private sizeSpread;
    private sizeTween;
    private colorBase;
    private colorSpread;
    private colorTween;
    private opacityBase;
    private opacitySpread;
    private opacityTween;
    private blendStyle;
    private particleArray;
    private particlesPerSecond;
    private particleDeathAge;
    private emitterAge;
    private emitterAlive;
    private emitterDeathAge;
    private particleCount;
    private particleGeometry;
    private particleTexture;
    private particleMaterial;
    private particleMesh;
    mugen: boolean;
    scene: THREE.Scene;
    start: boolean;
    constructor(options: ParticleParams);
    private createParticle;
    initialize(): void;
    setValues(parameters: any, params: any): void;
    private reastValues;
    private randomValue;
    private randomVector3;
    destroy(): void;
    update(dt: any): void;
}
