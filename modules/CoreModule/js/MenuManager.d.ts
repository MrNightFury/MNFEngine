import { Module } from "engine/Modules/Module.js";
export declare abstract class Menu {
    id: number;
    menuManager: MenuModule;
    constructor();
}
export interface MenuOption {
    id: string;
    text: string;
    action: () => void;
}
export declare class LinearMenu extends Menu {
    constructor(options: MenuOption[]);
}
export declare class MenuModule extends Module {
    lastId: number;
    exports: {
        Menu: typeof Menu;
        LinearMenu: typeof LinearMenu;
    };
    name: string;
    currentMenu: string;
    load(): Promise<void>;
    pageLoaded(): Promise<void>;
    getNextId(): number;
}
