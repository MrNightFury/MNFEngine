// @ts-ignore:
import { Webview } from "@webview/webview";
// @ts-ignore:
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { Engine } from "engine/Engine.ts";


export declare interface Window {
    navigate(url: string): void;
    run(): void;
    // deno-lint-ignore ban-types
    bind(event: string, callback: Function): void;
    eval(script: string): void;
}

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
                this.engine.DOM.onWindowStarted();
            }
        });
    }

    // deno-lint-ignore ban-types
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
}