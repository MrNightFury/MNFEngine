import { BaseObject } from "engine/Objects/BaseObject.ts";
import { Constructor } from "misc/TypeHelpers.ts";


export class AbstractRegistry<T> {
    private objectClasses: Map<string, Constructor<T>> = new Map();

    register<C extends T>(name: string | undefined, objectClass: Constructor<C>) {
        this.objectClasses.set(name ?? "default", objectClass);
    }

    get<C extends T>(name: string | undefined): Constructor<C> | undefined {
        return this.objectClasses.get(name ?? "default") as Constructor<C> | undefined;
    }
}


export class Registry {
    private registries: Map<string, AbstractRegistry<any>> = new Map();
    
    objectClasses = new AbstractRegistry<BaseObject>();
    
    createRegistry<T>(name: string): AbstractRegistry<T> {
        const registry = new AbstractRegistry<T>();
        this.registries.set(name, registry);
        return registry;
    }

    registry<T>(name: string): AbstractRegistry<T> | undefined {
        return this.registries.get(name) as AbstractRegistry<T> | undefined;
    }
}