import { Window } from "./Window.ts";

declare global {
    var ENV: ENV;
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
    webview: Window;
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
}

export function isDeno() {
    // @ts-ignore: 
    return typeof Deno != "undefined";
}
