import { Module } from "engine/Modules/Module.ts";
import { FileType } from "engine/interfaces/PackFileTypes.ts";


console.log(Module)

export class CoreModule extends Module {
    name = "CoreModule";

    async load() {
        const containerHTML = await this.engine.loader.getFile(this.info.namespace, FileType.HTML, "gameContainer");
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }

    // deno-lint-ignore require-await
    async pageLoaded() {
        this.engine.DOM.addOnClickEvent("#mm_item_game_start", () => {
            $("#main_menu").toggleClass("hidden");
        })
    }
}