import { HTMLObject } from "engine/Objects/HTMLObject.ts";

export interface Position {
    x: number;
    y: number;
}


/**
 * Represents any object that can be added to scene.
 */
export class SceneObject extends HTMLObject{
    constructor(tag: string, position: Position, attributes: Record<string, string>) {
        super("#scene_items_container", tag, {
            ...attributes,
            style: `${attributes.style}; top: ${position.y}; left: ${position.x};`
        });
    }
}