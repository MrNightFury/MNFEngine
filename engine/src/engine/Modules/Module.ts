import { Logger } from "../../Logger.ts";
import { Engine } from "engine/Engine.ts";
import { IModuleInfo } from "engine/Interfaces/IModuleInfo.ts";

export abstract class Module {
    abstract name: string;

    engine: Engine;
    info!: IModuleInfo;
    basePath!: string;
    logger = new Logger(this);

    constructor() {
        this.engine = Engine.instance;
    }

    abstract load(): Promise<void>;

    abstract pageLoaded(): Promise<void>;
}