import { BaseService, StorageService } from "engine/EngineServices.ts";

export class DesktopStorage extends BaseService implements StorageService {
    
    save<T>(key: string, value: T): void {
        
        throw new Error("Method not implemented.");
    }
    load<T>(key: string): T | undefined {
        throw new Error("Method not implemented.");
    }
    remove(key: string): void {
        throw new Error("Method not implemented.");
    }
}