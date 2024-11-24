import { Module } from "engine/Modules/Module.ts";
import { FileType } from "engine/interfaces/PackFileTypes.ts";


export class CoreModule extends Module {
    
    override name = "CoreModule";

    override async load() {
        const containerHTML = await this.engine.loader.getFile(this.info.namespace, FileType.HTML, "gameContainer");
        this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));
    }

    override async pageLoaded() {
        
    }
}