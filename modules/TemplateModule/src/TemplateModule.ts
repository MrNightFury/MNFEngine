import { Module } from "engine/Modules/Module.ts";


console.log(Module)

export class TemplateModule extends Module {
    name = "TemplateModule";

    async load() {

    }

    // deno-lint-ignore require-await
    async pageLoaded() {
        this.logger.log("Page loaded");

    }
}