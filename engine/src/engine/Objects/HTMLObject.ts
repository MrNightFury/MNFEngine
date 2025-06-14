// deno-lint-ignore-file no-explicit-any
import { BaseObject } from "engine/Objects/BaseObject.ts";
import { Engine } from "engine/Engine.ts";

// @ts-ignore: 
import type _ from "npm:@types/jquery";
import { EventEmitter } from "engine/EventEmitter.ts";


export interface SceneObjectEvents {
    pageLoaded: void;
    click: MouseEvent;
}


/**
 * Represents any object that has HTML representation. Automatically adds object to DOM.
 */
export class HTMLObject extends BaseObject {
    DOM = Engine.instance.DOM;

    // @ts-ignore:
    protected $!: JQuery<HTMLElement>;
    events = new EventEmitter<SceneObjectEvents>(this, true);

    constructor(parentSelector: string, tag: string, attributes: Record<string, string>) {
        super();

        const text = this.DOM.createTagText(tag, {
            ...attributes,
            id: `${this.constructor.name}_${this.id}`,
            style: `${attributes.style} ${this.constructor.name}`,
            class: attributes.class ? `${attributes.class} ${this.constructor.name}` : this.constructor.name
        });
        this.DOM.addChildren(parentSelector, text);

        this.DOM.emitter.on(this.selector, event => {
            this.events.parseEvent(event);
        });

        if (ENV.deno && !ENV.windowStarted) {
            this.DOM.emitter.on("pageLoaded", this.setupEventListeners.bind(this));
        } else if (ENV.deno) {
            this.setupEventListeners();
        } else {
            this.$ = $(this.selector);
            this.$.click((event: any) => {
                this.events.emit("click", event as any);
            });
        }
    }

    // TODO rewrite this to catch multiple events and "in code" instead of `string`
    setupEventListeners() {
        this.exec(`
            this.$.click(event => {
                runEvent("objectEvent", { event: "click", object: "${this.selector}"
                // , ...event
                });
            })
        `)
    }

    get selector() {
        return `#${this.constructor.name}_${this.id}`;
    }


    exec(func: (() => void) | string) {
        let functionText = typeof func == "string" ? func : `(${func.toString()})()` ;
        functionText = functionText.replaceAll(/this.\$/g, `$("${this.selector}")`);
        this.DOM.runScript(functionText);
    }


    override destroy() {
        this.exec(() => {this.$.remove()})
        super.destroy();
    }
}