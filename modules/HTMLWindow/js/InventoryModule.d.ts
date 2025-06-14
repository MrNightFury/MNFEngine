import { Module } from "engine/Modules/Module.js";
export declare class InventoryModule extends Module {
    pageLoaded(): Promise<void>;
    name: string;
    load(): Promise<void>;
}
