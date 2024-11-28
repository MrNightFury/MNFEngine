import { Module } from "engine/Modules/Module.js";
export declare class CoreModule extends Module {
    name: string;
    load(): Promise<void>;
    pageLoaded(): Promise<void>;
}
