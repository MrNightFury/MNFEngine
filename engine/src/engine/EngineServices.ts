// deno-lint-ignore-file ban-types no-explicit-any
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


export interface StorageService {
    save<T>(key: string, value: T): void;
    load<T>(key: string): T | undefined;
    remove(key: string): void;
}


export class BaseService {
    protected logger = new Logger(this);

    constructor(protected engine: Engine) {}
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