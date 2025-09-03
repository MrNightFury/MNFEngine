import { Module } from "engine/Modules/Module.ts";
import { Player } from "./Player.ts";
import { Engine } from "engine/Engine.ts";


export class InternalModule extends Module {
    name = "InternalModule";

    core = Engine.instance.modulesManager.getModule("CoreModule")!;
    
    // deno-lint-ignore require-await
    async load() {
        this.engine.registry.objectClasses.register("player", Player);
    }

    // deno-lint-ignore require-await
    async pageLoaded() {
        this.logger.log("Page loaded");
    }
}