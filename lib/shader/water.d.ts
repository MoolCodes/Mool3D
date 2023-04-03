import { Mesh, Vector3 } from "three";
/**
 * Work based on :
 * https://github.com/Slayvin: Flat mirror for three.js
 * https://home.adelphi.edu/~stemkoski/ : An implementation of water shader based on the flat mirror
 * http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */
declare class Water extends Mesh {
    isWater: boolean;
    material: THREE.ShaderMaterial;
    constructor(geometry: any, options?: any);
}
declare const City: {
    uniforms: {
        iTime: {
            value: number;
        };
        iResolution: {
            value: Vector3;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { Water, City };
