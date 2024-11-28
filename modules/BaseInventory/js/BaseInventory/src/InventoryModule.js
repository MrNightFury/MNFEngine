import { Module } from "engine/Modules/Module.js";
import { FileType } from "engine/interfaces/PackFileTypes.js";
export class InventoryModule extends Module {
    pageLoaded() {
        throw new Error("Method not implemented.");
    }
    name = "BaseInventory";
    async load() {
        // this.logger.log("Inventory module loaded");
        // const m = this.engine.modulesManager.getModule<CoreModule>("CoreModule");
        const containerHTML = await this.engine.loader.getFile(this.info.namespace, FileType.HTML, "baseInventory");
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }
}
