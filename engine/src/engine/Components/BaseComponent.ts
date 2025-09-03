import { BaseObject } from "engine/Objects/BaseObject.ts";
import { Engine } from "../Engine.ts";


export class BaseComponent<P extends BaseObject = BaseObject> {
    public accessor parent!: P;
    id: number;

    constructor(parent: P) {
        this.id = Engine.instance.getNextId();
        this.setParent(parent);
    }


    destroy() {

    }


    setParent(parent: P): void {
        this.parent = parent;
    }
}