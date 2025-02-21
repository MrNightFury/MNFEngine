// deno-lint-ignore-file no-explicit-any
import { Logger } from "misc/Logger.ts";


export class EventEmitter<T extends Record<string, any>>{
    parent: any;
    runEventsOnParent: boolean;
    logger: Logger;
    debug: boolean;

    public eventNameField = "event";

    // deno-lint-ignore ban-types
    listeners: Map<keyof T, Array<Function>> = new Map();

    constructor(parent: any, runEventsOnParent: boolean = false, debug: boolean = false) {
        this.parent = parent;
        this.runEventsOnParent = runEventsOnParent;
        this.logger = new Logger(`${parent.constructor.name} Emitter`);
        this.debug = debug;
    }

    on<K extends keyof T>(event: K, listener: (data: T[K]) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(listener);
        
        if (this.debug) {
            this.logger.log("on", event, listener.toString());
        }
    }

    emit<K extends keyof T>(event: string, data: T[K]) {
        if (this.debug) {
            this.logger.log("emit", event, data ? data.event : null);
        }
        
        if (this.runEventsOnParent) {
            const eventName = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
            if (this.parent[eventName] && this.parent[eventName] instanceof Function) {
                this.parent[eventName](data);
            }
        }

        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event)?.forEach((listener) => {
            listener(data);
        });
    }

    parseEvent<K extends keyof T>(event: {event: string} & T[K]) {
        this.emit(event[this.eventNameField], event);
    }
}