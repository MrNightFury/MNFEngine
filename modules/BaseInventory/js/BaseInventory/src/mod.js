import { Module } from "engine/Modules/Module.js";
export class InventoryModule extends Module {
    pageLoaded() {
        throw new Error("Method not implemented.");
    }
    name = "BaseInventory";
    async load() {
        this.logger.log("Inventory module loaded");
        const m = this.engine.modulesManager.getModule("CoreModule");
    }
}
