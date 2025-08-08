// deno-lint-ignore-file no-explicit-any
export class Logger {
    label: string;

    constructor(cls: string | object) {
        if (typeof cls == "string") {
            this.label = cls;
        } else {
            this.label = cls.constructor.name;

            if ("id" in cls) {
                this.label += " " + cls.id;
            }
        }
        
    }
    
    log(...args: any[]) {
        console.log(`[${this.label}]`, ...args);
    }

    warn(...args: any[]) {
        console.warn(`[${this.label}]`, ...args);
    }

    error(...args: any[]) {
        console.error(`[${this.label}]`, ...args);
    }

    debug(...args: any[]) {
        console.debug(`[${this.label}]`, ...args);
    }
}