import { RenderType } from "../types/types";
export declare class Renderer implements RenderType {
    renderer: THREE.WebGLRenderer;
    private el;
    constructor(el: HTMLElement);
    private init;
}
