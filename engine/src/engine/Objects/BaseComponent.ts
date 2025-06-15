import { BaseObject } from "engine/Objects/BaseObject.ts";


export class BaseComponent {
    parent: BaseObject;

    constructor(parent: BaseObject) {
        this.parent = parent;
    }
}