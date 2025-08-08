import { BaseObject } from "engine/Objects/BaseObject.ts";


export class BaseComponent<P extends BaseObject = BaseObject> {
    public accessor parent!: P;

    constructor(parent: P) {
        this.setParent(parent);
    }


    destroy() {

    }


    setParent(parent: P): void {
        this.parent = parent;
    }
}