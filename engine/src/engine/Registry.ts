import { BaseObject } from "engine/Objects/BaseObject.ts";
import { Constructor } from "misc/TypeHelpers.ts";


export class Registry {
    objectClasses: Map<string, Constructor<BaseObject>> = new Map();

    registerObjectClass<T extends BaseObject>(name: string, objectClass: Constructor<T>) {
        this.objectClasses.set(name, objectClass);
    }

    getObjectClass<T extends BaseObject>(name: string): Constructor<T> | undefined {
        return this.objectClasses.get(name) as Constructor<T> | undefined;
    }
}