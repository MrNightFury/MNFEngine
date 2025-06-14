import { Module } from "engine/Modules/Module.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";

export class HTMLModule extends Module {
    async pageLoaded() {
        this.logger.log("Page loaded")
    }
    
    name = "HTML";

    async load() {
        const containerHTML = await this.engine.loader.getFile(`${this.info.namespace}:baseInventory`, FileType.HTML);
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }
}