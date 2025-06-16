import { HTMLObject } from "engine/Objects/HTMLObject.ts";

export interface Position {
    /**
     * Coordinate from left to right.
     */
    x: number;
    /**
     * Coordinate from bottom to top.
     */
    y: number;
}



/**
 * Represents any object that can be added to scene.
 */
export class SceneObject extends HTMLObject{
    /**
     * @param tag - HTML tag for object
     * @param position - Object position
     * @param attributes - Map of HTML attributes
     */
    constructor(tag: string, position: Position, attributes: Record<string, string>) {
        super("#scene_items_container", tag, {
            ...attributes,
            style: `${attributes.style}; bottom: ${position.y}px; left: ${position.x}px;`,
            class: attributes.class ? `${attributes.class} SceneObject` : "SceneObject"
        });
    }
}