import { Engine } from "engine/Engine.ts";
import { NotifyHandlersMap, notifyHandlersSymbol } from "engine/Components/WatchDecorator.ts";
import { BaseComponent } from "engine/Components/BaseComponent.ts";


/**
 * Base class for all objects in the engine.
 */
export class BaseObject {
    id: number;
    [notifyHandlersSymbol]?: NotifyHandlersMap;
    components: BaseComponent[] = [];

    constructor() {
        this.id = Engine.instance.getNextId();
        Engine.instance.objects.add(this);
    }

    addComponent<T extends BaseComponent>(component: T) {
        this.components.push(component);
        return this;
    }

    destroy() {
        Engine.instance.objects.delete(this);
        for (const component of this.components) {
            component.destroy();
        }
    }
}