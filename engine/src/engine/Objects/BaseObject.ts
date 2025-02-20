import { Engine } from "engine/Engine.ts";


/**
 * Base class for all objects in the engine.
 */
export class BaseObject {
    id: number;

    constructor() {
        this.id = Engine.instance.getNextId();
        Engine.instance.objects.add(this);
    }

    destroy() {
        Engine.instance.objects.delete(this);
    }
}