// deno-lint-ignore-file no-explicit-any
import { Logger } from "../Logger.ts";
import { EventEmitter } from "engine/EventEmitter.ts";
import { Engine } from "engine/Engine.ts";


export class DOM {
    logger: Logger;
    // Buffers for appending HTML before the window is started
    bodyBuffer: string = "";
    gameObjectsBuffer: Record<string, string> = {};

    emitter = new EventEmitter(this);

    constructor() {
        this.logger = new Logger(this);
        this.emitter.eventNameField = "object"
    }

    /**
     * Append HTML to the body of the window.
     * It is safe to use this method before the window is started, it will buffer the HTML and append it when the window is started
     * @param html 
     */
    appendBody(html: string) {
        if (ENV.deno) {
            if (!ENV.windowStarted) {
                this.bodyBuffer += html;
            } else {
                ENV.window.runScript(`document.body.innerHTML += \`${html}\``);
            }
        } else {
            document.body.innerHTML += html;
        }
    }

    onPageLoaded() {
        this.logger.log("Page loaded!");
        if (ENV.deno) {
            ENV.window.runScript(`document.body.innerHTML += \`${this.bodyBuffer}\``);
            this.bodyBuffer = "";

            for (const [selector, children] of Object.entries(this.gameObjectsBuffer)) {
                ENV.window.runScript(`$("${selector}").append(\`${children}\`)`);
            }
        }
        

        if (ENV.deno) {
            ENV.window.bind("runEvent", (event: string, data: any) => {
                this.logger.log("Event", event, data.event);
                this.emitter.emit(event, data);
            })
        } else {
            runEvent = (event: string, data: any) => {
                this.logger.log("Event", event, data);
                this.emitter.emit(event, data)
            };
        }
        
        Engine.instance.modulesManager.notifyPageLoaded();
        this.emitter.emit("pageLoaded", null);
    }

    addInviewOnClickEvent(selector: string, callback: () => void) {
        if (ENV.deno) {
            ENV.window.runScript(`
                $("${selector}").click(() => {
                    (${callback.toString()})();
                });
            `);
        } else {
            $(selector).click(() => {
                callback();
            });
        }
    }

    // addOnClickCallback(selector: string, callback: () => void) {
    //     this.runScript(`$(${selector}).click(() =>)`);
    // }
    

    runScript(func: (() => void) | string) {
        if (ENV.deno) {
            ENV.window.runScript(func);
        } else {
            if (typeof func === "string") {
                eval(func);
            } else {
                func();
            }
        }
    }

    createTagText(tag: string, attributes: Record<string, string>) {
        let text = Object.entries(attributes).map(item => `${item[0]}="${item[1]}"`).join(" ");
        text = `<${tag} ${text}>`;
        if (!["img", "br"].includes(tag)) {
            text += `</${tag}>`;
        }
        return text;
    }

    addChildren(selector: string, children: string) {
        if (ENV.deno) {
            if (!ENV.windowStarted) {
                if (!this.gameObjectsBuffer[selector]) {
                    this.gameObjectsBuffer[selector] = children
                } else {
                    this.gameObjectsBuffer[selector] += children;
                }
            } else {
                ENV.window.runScript(`$("${selector}").append(\`${children}\`)`);
            }
        } else {
            $(selector).append(children);
        }
    }
}