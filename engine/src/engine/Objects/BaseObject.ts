import { Engine } from "engine/Engine.ts";

export class BaseObject {
    id: number;

    constructor() {
        this.id = Engine.instance.getNextId();
    }
}