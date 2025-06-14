// deno-lint-ignore-file require-await
import { Module } from "engine/Modules/Module.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";

export class InventoryModule extends Module {
    async pageLoaded() {
        this.logger.log("Page loaded")
    }
    name = "BaseInventory";

    async load() {
        const containerHTML = await this.engine.loader.getFile(`${this.info.namespace}:baseInventory`, FileType.HTML);
        console.log(containerHTML)
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));

        this.engine.eventEmitter.on("gameStarted", () => {
            this.engine.DOM.runScript(() => {
                $("#inventory").toggleClass("hidden");
            })
        })
    }
}