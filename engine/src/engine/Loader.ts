import { isDeno } from "../Environment.ts";
import { FileType, getFileExtension } from "engine/Interfaces/PackFileTypes.ts";
import type { IPackInfo } from "engine/Interfaces/IPackInfo.ts";
import type { IModuleInfo } from "engine/Interfaces/IModuleInfo.ts";
import { IScene } from "engine/Interfaces/IScene.ts";

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

export type identifier = `\w+:\w+`;

export class Loader {
    packBasePath: string = "";
    packNamespace: string = "";

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
                return sourceBasePath + moduleName + "/";
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


    getPathFromIdentifier(identifier: string, type: FileType) {
        const id = identifier.split(":");
        if (id.length == 1) {
            return this.getFilePath(this.packNamespace, type, id[0]);
        }
        return this.getFilePath(id[0], type, id[1]);
    }


    getFilePath(namespace: string, type: FileType, name?: string) {
        const ns = this.namespaces.get(namespace)?.replaceAll("\\", "/");
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
                case FileType.SCENE:
                    return `${ns}/${type}/${name}.json`;
                default:
                    return `${ns}/${type}/${name}`;
            }
        })()
    }


    async getFileByPath(path: string, type: FileType) {
        const result = await fetch(path).catch(err => {
            console.error(err);
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
            case FileType.SCENE:
                return await result?.json() as IScene;
            case FileType.HTML:
            default: 
                return await result?.text();
        }
    }


    async getFileByNamespace(namespace: string, type: FileType, name?: string) {
        const path = this.getFilePath(namespace, type, name + getFileExtension(type));
        if (!path) {
            return;
        }
        return await this.getFileByPath(path, type);
    }


    /**
     * Loads a files content from a given identifier
     * @param identifier file identifier in the format of `namespace:filename` or `filename` if from current pack namespace
     * @param type 
     */
    async getFile(identifier: string, type: FileType.PACK_INFO): Promise<IPackInfo>;
    async getFile(identifier: string, type: FileType.MODULE_INFO): Promise<IModuleInfo>;
    async getFile(identifier: string, type: FileType.SCENE): Promise<IScene>;
    async getFile(identifier: string, type: FileType.HTML): Promise<string>;
    async getFile(identifier: string, type: FileType) {
        const id = identifier.split(":");
        if (id.length == 1) {
            return await this.getFileByNamespace(this.packNamespace, type, id[0]);
        }
        return await this.getFileByNamespace(id[0], type, id[1]);
    }
}