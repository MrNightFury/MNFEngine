// deno-lint-ignore-file no-explicit-any
export class EventEmitter<T extends Record<string, any>>{
    parent: any;

    // deno-lint-ignore ban-types
    listeners: Map<keyof T, Array<Function>> = new Map();

    constructor(parent: any) {
        this.parent = parent;
    }

    on<K extends keyof T>(event: K, listener: (data: T[K]) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(listener);
    }

    emit<K extends keyof T>(event: string, data: T[K]) {
        const eventName = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
        if (this.parent[eventName] && this.parent[eventName] instanceof Function) {
            this.parent[eventName](data);
        }

        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event)?.forEach((listener) => {
            listener(data);
        });
    }

    parseEvent<K extends keyof T>(event: {event: string} & T[K]) {
        this.emit(event.event, event);
    }
}