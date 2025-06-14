import init, { World } from "../wasm_module/pkg/wasm_module.js";

await init();

import { Module } from "engine/Modules/Module.ts";

export class PhysicsModule extends Module {
    override name = "PhysicsModule";

    public world = new World();

    override async pageLoaded() {
        
    }

    constructor() {
        super();
    }

    async load() {
        this.logger.log("Loading PhysicsModule");
        await init();
    }
}