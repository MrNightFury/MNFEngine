import type { Loader } from "engine/Loader.ts";
import { Module } from "engine/Modules/Module.ts";
import { Logger } from "misc/Logger.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";
import { IModuleInfo } from "engine/Interfaces/IModuleInfo.ts";


// deno-lint-ignore no-explicit-any
function isSubclass(subclass: any, superclass: any): boolean {
    let proto = subclass;
    while (proto) {
        proto = Object.getPrototypeOf(proto);
        if (proto === superclass) {
            return true;
        }
    }
    return false;
}

export class ModulesManager {
    loadedModules: Map<string, Module> = new Map();
    loader: Loader;

    logger = new Logger(this);

    constructor(loader: Loader) {
        this.loader = loader;
    }

    async loadModule(name: string) {
        if (this.loadedModules.has(name)) {
            this.logger.warn("Module already loaded: " + name);
            return;
        }


        const modulePath = await this.loader.findModule(name);
        if (!modulePath) {
            this.logger.error("Module not found: " + name);
            throw new Error("Module not found: " + name);
        }

        this.logger.log("Loading module: " + name);

        // Depency handle
        const moduleInfo = await this.loader.getFileByPath(`${modulePath}/module.info`, FileType.MODULE_INFO) as IModuleInfo;
        for (const dependency of moduleInfo.dependencies || []) {
            if (!this.loadedModules.has(dependency)) {
                await this.loadModule(dependency);
            }
        }

        // Module import
        const module = await import(modulePath + `${ENV.deno ? "src" : "js"}/mod.ts`);
        for (const key in module) {
            if (isSubclass(module[key], Module)) {
                const moduleInstance = new module[key]() as Module;
                moduleInstance.info = moduleInfo;
                moduleInstance.basePath = modulePath;

                if (moduleInfo.namespace) {
                    this.loader.registerNamespace(moduleInfo.namespace, modulePath);
                }
                
                await moduleInstance.load();
                this.loadedModules.set(name, moduleInstance);
            }
        }
    }

    async loadModules(names: string[]) {
        for (const name of names) {
            try {
                await this.loadModule(name);
            } catch (e) {
                this.logger.error("Error loading module: " + name);
                throw e;
            }
        }
        this.logger.log("Modules loaded.");
        this.logger.log("Registered namespaces: ", this.loader.namespaces);
    }

    // deno-lint-ignore no-explicit-any
    getModule<T extends Module>(ClassType: (new (...args: any[]) => T) | string): T | undefined {
        if (typeof ClassType === "string") {
            return this.loadedModules.get(ClassType) as T;
        } else {
            return this.loadedModules.get(ClassType.name) as T;
        }
    }

    notifyPageLoaded() {
        for (const module of this.loadedModules.values()) {
            module.pageLoaded();
        }
    }
}