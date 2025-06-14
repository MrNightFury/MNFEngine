import { Module } from "engine/Modules/Module.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";
import { ImageObject } from "./ImageObject.ts";
import { ControlsController, KeyState } from "./ControlsController.ts";


console.log(Module)

export class CoreModule extends Module {
    name = "CoreModule";

    controls = new ControlsController();

    exports = {
        ImageObject, KeyState, ControlsController
    }

    async load() {
        const _containerHTML = await this.engine.loader.getFile(`${this.info.namespace}:gameContainer`, FileType.HTML);
        // this.engine.DOM.appendBody(containerHTML.replaceAll("$module", this.basePath));

        this.engine.registry.objectClasses.register("image", ImageObject);
    }

    // deno-lint-ignore require-await
    async pageLoaded() {
        this.logger.log("Page loaded");
    }
}