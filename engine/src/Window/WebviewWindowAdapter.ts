import { GameWindow } from "engine/Window.ts";
import { Logger } from "misc/Logger.ts";
import { EventEmitter } from "engine/EventEmitter.ts";
import { Engine } from "engine/Engine.ts";

export class WebviewWindowAdapter implements GameWindow {
    private logger: Logger = new Logger(this);
    private worker: Worker;
    private socket!: WebSocket;
    public eventEmitter = new EventEmitter(this);

    constructor() {
        Deno.serve({ port: 8080 }, req => {
            if (req.headers.get("upgrade") != "websocket") {
                return new Response(null, { status: 501 });
            }
            const { socket , response } = Deno.upgradeWebSocket(req);
        
            socket.onopen = () => {
                this.logger.log("Webview window connected");
            };
        
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.logger.log("WS message: ", data);

                if (data.event == "pageLoaded" && ENV.deno) {
                    ENV.windowStarted = true;
                    Engine.instance.DOM.onPageLoaded();
                } else {
                    this.eventEmitter.parseEvent(data.data);
                    Engine.instance.DOM.emitter.parseEvent(data.data);
                }
            };
        
            socket.onerror = (err) => {
                this.logger.error("Websocket error: ", err);
            };
        
            socket.onclose = () => {
                this.logger.log("Webview window disconnected");
            };
            this.socket = socket;

            return response;
        })

        this.worker = new Worker(new URL("./WebviewWindowWorker.ts", import.meta.url), {
            type: "module",
            deno: { permissions: { ffi: true, read: true, write: true,
                env: true, sys: true, run: true, net: true
            }}
        } as WorkerOptions);

        this.worker.onmessage = event => {
            this.logger.log("Worker message: ", event.data);
            this.eventEmitter.parseEvent(event.data);
        }

        this.eventEmitter.on("closed", () => {
            Engine.instance.exit();
        })
    }

    // deno-lint-ignore ban-types
    runScript(funct: Function | string) {
        if (typeof funct === "string") {
            this.eval(funct);
        } else {
            this.eval(`(${funct.toString()})()`);
        }
    }

    runWebviewMethod(method: string, ...args: unknown[]): void {
        this.worker.postMessage({
            event: "runMethod",
            method: method,
            args: args
        });
    }

    navigate(url: string): void {
        this.runWebviewMethod("navigate", url);
    }

    run(): void {
        this.runWebviewMethod("run");
    }

    // deno-lint-ignore no-explicit-any
    bind(event: string, callback: (data: any) => void): void {
        this.eventEmitter.on(event, callback);
    }

    eval(script: string): void {
        this.socket.send(JSON.stringify({
            event: "eval",
            script: script
        }))
        // this.runWebviewMethod("eval", script);
    }
}