import { setupEnv } from "./Environment.ts";
import { Engine } from "engine/Engine.ts";
import { Logger } from "misc/Logger.ts";


const logger = new Logger(new (class Main {})());

logger.log("Setting up environment...");
setupEnv();

setInterval(() => {
    console.log("tick");
}, 1000);

const engine = new Engine();

logger.log("Loading pack...");

if (ENV.deno) {
    logger.log("Running in Deno...");
    // const Window = (await import("./engine/Window.ts")).Window;

    const WebviewWindow = new (await import("./HTMLWindow/WebviewWindowAdapter.ts")).WebviewWindowAdapter;

    ENV.window = WebviewWindow;

    // ENV.webview = new Window(ENV.debug);
    // ENV.window = new Worker();
    // ENV.webview.openLocal("index.html");
    // ENV.webview.navigate("http://google.com");

    // webview.run();
} else {
    logger.log("Running in browser...");
}

await engine.loadPack("DenoTestPack");

// const testObj = new SceneObject("img", {
//     x: 100,
//     y: 100
// }, {
//     src: "https://via.placeholder.com/100",
// });

// testObj.events.on("click", (_: any) => {
//     console.log("click");
//     try {
//         Engine.instance.loadScene("testScene");
//     } catch (e) {
//         logger.error(e);
//     }
// });

if (ENV.deno) {
    logger.log("Running webview...");
    // new Promise(() => (ENV as any).webview.run())
};