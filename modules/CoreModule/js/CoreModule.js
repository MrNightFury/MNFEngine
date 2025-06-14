import { Module } from "engine/Modules/Module.js";
import { FileType } from "engine/Interfaces/PackFileTypes.js";
console.log(Module);
export class CoreModule extends Module {
    name = "CoreModule";
    async load() {
        const containerHTML = await this.engine.loader.getFile(this.info.namespace, FileType.HTML, "gameContainer");
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }
    // deno-lint-ignore require-await
    async pageLoaded() {
        this.engine.DOM.addInviewOnClickEvent("#mm_item_game_start", () => {
            // @ts-ignore: 
            $("#main_menu").toggleClass("hidden");
        });
    }
}
