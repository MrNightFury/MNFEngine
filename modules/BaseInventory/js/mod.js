import { Module } from "engine/Modules/Module.js";
export class InventoryModule extends Module {
    name = "BaseInventory";
    async load() {
        this.logger.log("Inventory module loaded");
    }
}
