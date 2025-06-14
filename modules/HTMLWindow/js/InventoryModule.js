import { Module } from "engine/Modules/Module.js";
import { FileType } from "engine/Interfaces/PackFileTypes.js";
export class InventoryModule extends Module {
    pageLoaded() {
        throw new Error("Method not implemented.");
    }
    name = "BaseInventory";
    async load() {
        const containerHTML = await this.engine.loader.getFile(this.info.namespace, FileType.HTML, "baseInventory");
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }
}
