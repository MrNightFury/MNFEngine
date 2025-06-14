import { StorageService, BaseService } from "engine/EngineServices.ts";

export class LocalStorage extends BaseService implements StorageService {
    save<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
    load<T>(key: string): T | undefined {
        return JSON.parse(localStorage.getItem(key) ?? "") as T;
    }
    remove(key: string): void {
        localStorage.removeItem(key);
    }
}