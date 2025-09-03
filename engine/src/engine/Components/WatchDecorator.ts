import { BaseObject } from 'engine/Objects/BaseObject.ts';
import { BaseComponent } from "./BaseComponent.ts";


export const notifyHandlersSymbol = Symbol('notifyHandlers');
export type NotifyHandler<T = any> = (newValue: T) => void;
export type NotifyHandlersMap = Map<(string | symbol), NotifyHandler[]>;


export function watch<C extends BaseObject, V>(target: ClassAccessorDecoratorTarget<C, V>, ctx: ClassAccessorDecoratorContext<C, V>) {
    const originalSet = target.set;
    target.set = function (value: V) {
        originalSet.call(this, value);
        const handlers = this[notifyHandlersSymbol]?.get(ctx.name);
        if (handlers) {
            for (const handler of handlers) {
                handler(value);
            }
        }
    }
}


export function notify<C extends BaseObject | BaseComponent, V> (name: string | symbol) {
    if (typeof name == "string" && name.startsWith("parent.")) {
        name = name.slice(7);
        return function (target: (this: C, newValue: V) => void, ctx: ClassMethodDecoratorContext<C, (newValue: V) => void>) {
            ctx.addInitializer(function (this: C) {
                if (!(this instanceof BaseComponent)) {
                    throw new Error("@notify with parent. can only be used in components");
                }
                if (!this.parent[notifyHandlersSymbol]) {
                    this.parent[notifyHandlersSymbol] = new Map();
                }
                if (!this.parent[notifyHandlersSymbol].has(name)) {
                    this.parent[notifyHandlersSymbol].set(name, []);
                }
                this.parent[notifyHandlersSymbol].get(name)?.push(target.bind(this));
            })
        }
    }

    return function (target: (this: C, newValue: V) => void, ctx: ClassMethodDecoratorContext<C, (newValue: V) => void>) {
        ctx.addInitializer(function (this: C) {
            if (!(this instanceof BaseObject)) {
                    throw new Error("@notify without parent. can only be used in components");
                }
            if (!this[notifyHandlersSymbol]) {
                this[notifyHandlersSymbol] = new Map();
            }
            if (!this[notifyHandlersSymbol].has(name)) {
                this[notifyHandlersSymbol].set(name, []);
            }
            this[notifyHandlersSymbol].get(name)?.push(target.bind(this));
        })
    }
}