import { Logger } from "../Logger.ts";

export class DOM {
    logger: Logger;

    bodyBuffer: string = "";

    constructor() {
        this.logger = new Logger(this);
    }

    appendBody(html: string) {
        this.logger.log(html);

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
            ENV.webview.runScript(`document.body.innerHTML = \`${this.bodyBuffer}\``);
            this.bodyBuffer = "";
        }
    }
}