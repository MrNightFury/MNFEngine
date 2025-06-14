import { Engine } from "engine/Engine.ts";
import { Module } from "engine/Modules/Module.ts";

export abstract class Menu {
    id: number;
    menuManager: MenuModule;

    constructor() {
        this.menuManager = Engine.instance.modulesManager.getModule<MenuModule>("MenuModule")!;
        this.id = this.menuManager.getNextId()
    }
}

export interface MenuOption {
    id: string;
    text: string;
    action: () => void;
}

export class LinearMenu extends Menu {
    constructor(options: MenuOption[]) {
        super();
        let html = `<div id="menu_${this.id}" class="mm_container">`
        options.forEach(option => {
            html += `<h1 id="menu_${this.id}_${option.id}" class="mm_item" onclick=${option.action.toString()}>${option.text}</h1>`
        })
        html += `</div>`
    }
}

export class MenuModule extends Module {
    lastId: number = 0;

    exports = {
        Menu,
        LinearMenu
    }

    name = "MenuModule";

    currentMenu: string = "";
    
    async load() {}
    async pageLoaded() {}

    getNextId() {
        return this.lastId++;
    }
}