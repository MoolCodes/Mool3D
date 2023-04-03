import { EventType, EventParams } from "../types/types";
export declare class Event implements EventType {
    types: EventTypes[];
    typesFn: {
        [P in EventTypes]?: Fn<EventCallbackParams>[];
    };
    private el;
    private mouse;
    private camera;
    private scene;
    private raycaster;
    constructor(options: EventParams);
    init(): void;
    private getIntersectObject;
}
