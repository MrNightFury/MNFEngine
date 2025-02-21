// deno-lint-ignore-file ban-types
import { EventEmitter } from "engine/EventEmitter.ts";
import { Engine } from "engine/Engine.ts";
import { Logger } from "misc/Logger.ts";



export interface GameWindow {
    eventEmitter: EventEmitter<Record<string, any>>;

    navigate(url: string): void;
    run(): void;
    bind(event: string, callback: Function): void;
    runScript(funct: Function | string): void;
    eval(script: string): void;
}

export interface AudioService {
    playSound(identifier: string): void;
    setBackgrountMusic(identifier: string): void;
    playRandomSound(identifier: string, range: number): void;
    playRandomSequence(baseIdentifier: string, range: number, count: number, interval: number): void;
}

export class BaseService {
    logger = new Logger(this);

    constructor(public engine: Engine) {

    }
}


export class BaseAudioService implements AudioService {
    playSound(_: string) {
        throw new Error("Method not implemented.");
    }
    setBackgrountMusic(_: string) {
        throw new Error("Method not implemented.");
    }
    playRandomSound(_0: string, _1: number) {
        throw new Error("Method not implemented.");
    }
    playRandomSequence(_0: string, _1: number, _2: number, _3: number) {
        throw new Error("Method not implemented.");
    }
}


/*
export class Window extends Webview {
    // @ts-ignore:
    ffi = Deno.dlopen("C:\\Windows\\System32\\user32.dll", {
        "MoveWindow": { parameters: ["pointer", "i32", "i32", "i32", "i32", "i32"], result: "i32" },
        "GetForegroundWindow": { parameters: [], result: "pointer" },
    }).symbols;

    engine = Engine.instance;

    constructor(debug: boolean) {
        super(debug);
        this.bind("pageLoaded", () => {
            if (ENV.deno) {
                ENV.windowStarted = true;
                this.engine.DOM.onPageLoaded();
            }
        });
    }

    runScript(funct: Function | string) {
        if (typeof funct === "string") {
            this.eval(funct);
        } else {
            this.eval(`(${funct.toString()})()`);
        }
    }

    openLocal(filePath: string) {
        this.navigate("file://" + path.resolve(filePath));
    }

    moveWindow(x: number, y: number) {
        this.ffi.MoveWindow(this.ffi.GetForegroundWindow(), x, y, 800, 600, 1);
    }
}*/