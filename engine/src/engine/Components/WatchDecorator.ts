import { BaseObject } from 'engine/Objects/BaseObject.ts';


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


export function notify<C extends BaseObject, V> (name: string | symbol) {
    return function (target: (newValue: V) => void, _: ClassMethodDecoratorContext<C, (newValue: V) => void>) {
        target = function (this: C, newValue: V) {
            if (!this[notifyHandlersSymbol]) {
                this[notifyHandlersSymbol] = new Map();
            }
            if (!this[notifyHandlersSymbol].has(name)) {
                this[notifyHandlersSymbol].set(name, []);
            }
            this[notifyHandlersSymbol].get(name)?.push(target.bind(this));
            target.call(this, newValue);
        }
    }
}