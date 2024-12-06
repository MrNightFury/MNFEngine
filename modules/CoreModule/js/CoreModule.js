import { Module } from "engine/Modules/Module.js";
import { FileType } from "../../../engine/src/engine/Interfaces/PackFileTypes.ts";
export class CoreModule extends Module {
    name = "CoreModule";
    async load() {
        const containerHTML = await this.engine.loader.getFile(this.info.namespace, FileType.HTML, "gameContainer");
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }
    async pageLoaded() {
    }
}
