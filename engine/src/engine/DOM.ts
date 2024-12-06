import { Logger } from "../Logger.ts";


export class DOM {
    logger: Logger;

    bodyBuffer: string = "";
    gameObjectsBuffer: Record<string, string> = {};

    constructor() {
        this.logger = new Logger(this);
    }

    appendBody(html: string) {
        // this.logger.log(html);

        if (ENV.deno) {
            if (!ENV.windowStarted) {
                this.bodyBuffer += html;
            } else {
                ENV.webview.runScript(`document.body.innerHTML += \`${html}\``);
            }
        } else {
            document.body.innerHTML += html;
        }
    }

    onWindowStarted() {
        if (ENV.deno) {
            ENV.webview.runScript(`document.body.innerHTML += \`${this.bodyBuffer}\``);
            this.bodyBuffer = "";

            console.log(this.gameObjectsBuffer);
            for (const [selector, children] of Object.entries(this.gameObjectsBuffer)) {
                ENV.webview.runScript(`$("${selector}").append(\`${children}\`)`);
            }
        }
    }

    addOnClickEvent(selector: string, callback: () => void) {
    addOnClickEvent(selector: string, callback: () => void | string) {
        if (ENV.deno) {
            ENV.webview.runScript(`
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

    runScript(func: (() => void) | string) {
        if (ENV.deno) {
            ENV.webview.runScript(func);
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
                ENV.webview.runScript(`$("${selector}").append(\`${children}\`)`);
            }
        } else {
            $(selector).append(children);
        }




    }
}