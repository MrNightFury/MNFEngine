import { Loader, SourceType } from "engine/Loader.ts";
import { ModulesManager } from "engine/Modules/ModulesManager.ts";
import { IPackInfo } from "engine/Interfaces/IPackInfo.ts";
import { Logger } from "misc/Logger.ts";
import { BaseObject } from "engine/Objects/BaseObject.ts";
import { Registry } from "engine/Registry.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";
import { IScene } from "engine/Interfaces/IScene.ts";
import { EventEmitter } from "engine/EventEmitter.ts";
import { AudioService, BaseAudioService } from "engine/EngineServices.ts";
import { DOM } from "engine/PlatformSpecific/DOM.ts";



export class Engine {
    static instance: Engine;
    audio: AudioService = new BaseAudioService();

    packLoaded: boolean = false;
    packInfo?: IPackInfo;

    logger = new Logger(this);
    loader = new Loader();
    modulesManager = new ModulesManager(this.loader);
    DOM: DOM;
    eventEmitter = new EventEmitter(this, false, false);

    private lastId: number = 0;

    registry= new Registry();
    objects: Set<BaseObject> = new Set();
    currentScene?: IScene;
    

    constructor() {
        this.logger.log("Engine starting...");
        Engine.instance = this;
        this.DOM = new DOM();

        // this.registry.createRegistry("objectClass");
    }

    
    exit() {
        Deno.exit(0);
    }


    async loadPack(packName: string) {
        this.packInfo = await this.loader.findPack(packName);
        if (!this.packInfo) {
            this.logger.error("Pack not found: " + packName);
            return;
        }

        this.loader.packNamespace = this.packInfo.name;
        this.loader.registerNamespace(this.packInfo.name, this.loader.packBasePath);
        
        this.packLoaded = true;
        this.logger.log(`Loading pack ${this.packInfo.name}...`);

        if (this.packInfo.pfv == undefined) {
            this.logger.warn("Pack version not found. Fallback to v1.");
            // deno-lint-ignore no-explicit-any
            (this.packInfo as any).pfv = 1;
        }

        this.loader.moduleSources.add({
            basePath: new URL(this.loader.packBasePath + "modules/").toString(),
            type: ENV.deno ? SourceType.LOCAL : SourceType.REMOTE
        });

        if (this.packInfo.pfv == 1 || this.packInfo.pfv == undefined) {
            // TODO: compability with old packs
            await this.modulesManager.loadModule("CompModule");
            // throw new Error("Old pack version not supported");
        } else {
            await this.modulesManager.loadModules(this.packInfo.modules);
        }

        this.loadScene(this.packInfo.defaultScene);
    }


    getNextId() {
        return this.lastId++;
    }


    async loadScene(identifier: string) {
        this.logger.log(`Loading scene: ${identifier}`);

        this.logger.log("Unloading old scene...");
        // Horrible code. Deleteng object in foreach loop. TO BE FIXED
        this.objects.entries().forEach(obj => obj[0].destroy());

        this.logger.log("Checking scene...");
        const scene = await this.loader.getFile(identifier, FileType.SCENE);
        if (!scene) {
            this.logger.error(`Scene not found: ${identifier}`);
            return;
        }

        this.logger.log("Creating objects...");
        for (const object of scene.objects) {
            const objectClass = this.registry.objectClasses.get(object.class);
            if (objectClass) {
                new objectClass(object);
            } else {
                this.logger.error(`Object class not found: ${object.class}`);
            }
        }
    }
}