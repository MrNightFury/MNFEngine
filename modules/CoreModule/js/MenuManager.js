import { Engine } from "engine/Engine.js";
import { Module } from "engine/Modules/Module.js";
export class Menu {
    id;
    menuManager;
    constructor() {
        this.menuManager = Engine.instance.modulesManager.getModule("MenuModule");
        this.id = this.menuManager.getNextId();
    }
}
export class LinearMenu extends Menu {
    constructor(options) {
        super();
        let html = `<div id="menu_${this.id}" class="mm_container">`;
        options.forEach(option => {
            html += `<h1 id="menu_${this.id}_${option.id}" class="mm_item" onclick=${option.action.toString()}>${option.text}</h1>`;
        });
        html += `</div>`;
    }
}
export class MenuModule extends Module {
    lastId = 0;
    exports = {
        Menu,
        LinearMenu
    };
    name = "MenuModule";
    currentMenu = "";
    async load() { }
    async pageLoaded() { }
    getNextId() {
        return this.lastId++;
    }
}
