// deno-lint-ignore-file require-await
import { Module } from "engine/Modules/Module.ts";
import { OldStyleObject } from "./OldStyleObject.ts";



export class CompModule extends Module {
    name = "TemplateModule";

    async load() {
        this.engine.registry.registry("objectClass")?.register(undefined, OldStyleObject);
    }

    async pageLoaded() {
        this.logger.log("Page loaded");

    }
}