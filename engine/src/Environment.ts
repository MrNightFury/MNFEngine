import { GameWindow } from "engine/Window.ts";

declare global {
    var ENV: ENV;
    // @ts-ignore:
    // deno-lint-ignore no-explicit-any
    var $: any;

    var runEvent: (event: string, data: any) => void;
}

export enum Runtime {
    DENO = "Deno",
    BROWSER = "Browser"
}

export interface BaseENV {
    debug: boolean;

    deno: boolean;
    browser: boolean;
    runtime: Runtime;
    baseImportPath: string;
}

export interface DenoENV extends BaseENV {
    deno: true;

    windowStarted: boolean;
    // webview: Window;
    window: GameWindow;
    // window: WindowWorkerInterface;
}

export interface BrowserENV extends BaseENV {
    deno: false;
}

export type ENV = BrowserENV | DenoENV;

export function setupEnv() {
    // @ts-ignore: 
    const isDeno = typeof Deno != "undefined";
    // @ts-ignore:
    globalThis.ENV = {
        debug: true,

        deno: isDeno,
        browser: !isDeno,
        runtime: isDeno ? Runtime.DENO : Runtime.BROWSER,
        windowStarted: false,
        baseImportPath: import.meta.url.replace(/main.[tj]s/g, "")
    }

    console.log("ENV", ENV);
}

export function isDeno() {
    // @ts-ignore: 
    return typeof Deno != "undefined";
}
