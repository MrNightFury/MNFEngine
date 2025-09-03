import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { Webview } from "@webview/webview";

import { WorkerMessageBody } from "./WorkerMessage.ts";
import { Logger } from "misc/Logger.ts";



const logger = new Logger("WebviewWindowWorker");

const webview = new Webview(true);
webview.navigate("file://" + path.resolve("index.html"));

self.onmessage = (event: MessageEvent<WorkerMessageBody>) => {
    logger.log("Worker message: ", event.data);
    
    switch (event.data.event) {
        case "runMethod": {
            // deno-lint-ignore no-explicit-any
            (webview[event.data.method] as any)(...event.data.args);
        }
    }
}

webview.run();

self.postMessage({
    event: "closed"
});