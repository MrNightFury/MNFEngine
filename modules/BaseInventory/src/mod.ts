import { Module } from "engine/Modules/Module.js";
import type {CoreModule} from "../../CoreModule/src/CoreModule.js";

export class InventoryModule extends Module {
    override pageLoaded(): Promise<void> {
      throw new Error("Method not implemented.");
    }
    override name = "BaseInventory";

    override async load() {
        this.logger.log("Inventory module loaded");
        const m = this.engine.modulesManager.getModule<CoreModule>("CoreModule");
    }
}