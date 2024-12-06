import { BaseObject } from "engine/Objects/BaseObject.ts";
import { DOM } from "engine/DOM.ts";
import { Engine } from "engine/Engine.ts";

// @ts-ignore: 
import type $ from "npm:@types/jquery";

/**
 * Represents any object that can be added to the scene.
 */
export class SceneObject extends BaseObject {
    DOM: DOM;
    html!: JQuery<HTMLElement>;

    constructor(tag: string, attributes: Record<string, string>) {
        super();
        this.DOM = Engine.instance.DOM;
        const text = this.DOM.createTagText(tag, {
            ...attributes,
            id: `${this.constructor.name}_${this.id}`,
            class: attributes.class ? `${attributes.class} ${this.constructor.name}` : this.constructor.name
        });
        this.DOM.addChildren("#scene_items_container", text);
    }

    get selector() {
        return `#${this.id}`;
    }

    exec(func: () => void | string) {
        let functionText = typeof func == "string" ? func : func.toString();
        functionText = functionText.replaceAll(/this.html/g, `$(${this.selector})`);
        this.DOM.runScript(functionText);
    }
}