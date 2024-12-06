import { Loader } from "engine/Loader.ts";
import { ModulesManager } from "engine/Modules/ModulesManager.ts";
import { IPackInfo } from "./Interfaces/IPackInfo.ts";
import { DOM } from "engine/DOM.ts";
import { Logger } from "../Logger.ts";


export class Engine {
    static instance: Engine;

    packLoaded: boolean = false;
    packInfo?: IPackInfo;

    logger = new Logger(this);
    loader = new Loader();
    modulesManager = new ModulesManager(this.loader);
    DOM = new DOM();

    private lastId: number = 0;
    

    constructor() {
        this.logger.log("Engine starting...");
        Engine.instance = this;
    }

    async loadPack(packName: string) {
        this.packInfo = await this.loader.findPack(packName);
        if (!this.packInfo) {
            this.logger.error("Pack not found: " + packName);
            return;
        }

        this.packLoaded = true;
        this.loader
        this.logger.log(`Loading pack ${this.packInfo.name}...`);

        if (this.packInfo.pfv == undefined) {
            this.logger.warn("Pack version not found. Fallback to v1.");
            // deno-lint-ignore no-explicit-any
            (this.packInfo as any).pfv = 1;
        }

        if (this.packInfo.pfv == 1 || this.packInfo.pfv == undefined) {
            // TODO: compability with old packs
            // this.modulesManager.loadModule("CompModule");
        } else {
            await this.modulesManager.loadModules(this.packInfo.modules);
        }
    }

    getNextId() {
        return this.lastId++;
    }
}