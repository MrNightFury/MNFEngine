import { Position } from "engine/Objects/SceneObject.ts";
import { HTMLComponent } from "./HTMLComponent.ts";
import { BaseObject } from "engine/Objects/BaseObject.ts";



export class SceneComponent<P extends BaseObject = BaseObject> extends HTMLComponent<P> {
    position: Position;

    /**
     * @param tag - HTML tag for object
     * @param position - Object position
     * @param attributes - Map of HTML attributes
     */
    constructor(parent: P, tag: string, position: Position, attributes: Record<string, string>) {
        super(parent, "#scene_items_container", tag, {
            ...attributes,
            style: `${attributes.style ?? ""}; bottom: ${position.y}px; left: ${position.x}px;`,
            class: attributes.class ? `${attributes.class} SceneObject` : "SceneObject"
        });
        
        this.position = position;
    }
}