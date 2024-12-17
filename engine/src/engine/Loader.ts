import { isDeno } from "../Environment.ts";
import { FileType, getFileExtension } from "./Interfaces/PackFileTypes.ts";
import type { IPackInfo } from "./Interfaces/IPackInfo.ts";
import type { IModuleInfo } from "./Interfaces/IModuleInfo.ts";

if (isDeno()) {
    // @ts-ignore: 
    var path = await import("jsr:@std/path");
}

export enum SourceType {
    LOCAL = "local",
    REMOTE = "remote"
}

export interface Source {
    basePath: string;
    type: SourceType;
}

export class Loader {
    packBasePath: string = "";

    packSources: Set<Source> = new Set();
    moduleSources: Set<Source> = new Set();

    namespaces: Map<string, string> = new Map();


    constructor() {
        this.updateAvailableSources()
    }


    async findPack(packName: string): Promise<IPackInfo | undefined> {
        for (const source of this.packSources) {
            const sourceBasePath = (source.type == SourceType.LOCAL ? "file://" + path.resolve(source.basePath) : source.basePath);
            const result = await this.getFileByPath(`${sourceBasePath}/${packName}/${FileType.PACK_INFO}`,
                                                    FileType.PACK_INFO) as IPackInfo;
            if (result) {
                this.packBasePath = sourceBasePath + "/" + packName + "/";
                return result;
            }
        }
    }


    async findModule(moduleName: string) {
        for (const source of this.moduleSources) {
            const sourceBasePath = source.basePath;
            const result = await this.getFileByPath(`${sourceBasePath}/${moduleName}/${FileType.MODULE_INFO}`,
                                                    FileType.MODULE_INFO) as IModuleInfo;
            if (result) {
                return sourceBasePath + "/" + moduleName + "/";
            }
        }
    }


    updateAvailableSources() {
        this.packSources.clear();
        this.packSources.add({
            basePath: "../content/",
            type: ENV.deno ? SourceType.LOCAL : SourceType.REMOTE
        });

        // console.log(new URL("../modules/", "file://" + Deno.cwd() + "/").toString());
        
        this.moduleSources.add({
            basePath: ENV.deno ?
            // @ts-ignore:
                        new URL("../modules/", "file://" + Deno.cwd() + "/").toString()
                    :   new URL("../../../modules/", import.meta.url).toString(),
            type: ENV.deno ? SourceType.LOCAL : SourceType.REMOTE
        });
    }


    registerNamespace(name: string, path: string) {
        if (this.namespaces.has(name)) {
            console.error("Namespace already exists: " + name);
            throw new Error("Namespace already exists: " + name);
        }
        this.namespaces.set(name, path);
    }


    getFilePath(namespace: string, type: FileType, name?: string) {
        const ns = this.namespaces.get(namespace);
        if (!ns) {
            console.error("Namespace not found: " + namespace);
            return;
        }
        
        return (() => {
            switch (type) {
                case FileType.PACK_INFO:
                    return `${ns}/pack.info`;
                case FileType.MODULE_INFO:
                    return `${ns}/module.info`;
                default:
                    return `${ns}/${type}/${name}`;
            }
        })()
    }


    async getFileByPath(path: string, type: FileType) {
        const result = await fetch(path).catch(_ => {
            // console.error(err);
        }).then(res => {
            if (res?.status == 200) {
                return res;
            }
        })

        switch (type) {
            case FileType.PACK_INFO:
                return await result?.json() as IPackInfo;
            case FileType.MODULE_INFO:
                return await result?.json() as IModuleInfo;
            default: 
                return await result?.text();
        }
    }


    async getFile(namespace: string, type: FileType.PACK_INFO, name: undefined): Promise<IPackInfo>;
    async getFile(namespace: string, type: FileType.MODULE_INFO, name: undefined): Promise<IModuleInfo>;
    async getFile(namespace: string, type: FileType.HTML, name: string): Promise<string>;
    async getFile(namespace: string, type: FileType, name?: string) {
        const path = this.getFilePath(namespace, type, name + getFileExtension(type));
        if (!path) {
            return;
        }
        return await this.getFileByPath(path, type);
    }
}