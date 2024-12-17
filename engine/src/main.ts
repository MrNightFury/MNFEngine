import { setupEnv } from "./Environment.ts";
import { Engine } from "engine/Engine.ts";
import { Logger } from "./Logger.ts";
import { SceneObject } from "engine/Objects/SceneObject.ts";

const logger = new Logger(new (class Main {})());

logger.log("Setting up environment...");
setupEnv();

const engine = new Engine();

logger.log("Loading pack...");

if (ENV.deno) {
    logger.log("Running in Deno...");

    const Window = (await import("./Window.ts")).Window;

    ENV.webview = new Window(ENV.debug);
    ENV.webview.openLocal("index.html");
    // ENV.webview.navigate("http://google.com");

    // webview.run();
} else {
    logger.log("Running in browser...");
}

await engine.loadPack("DenoTestPack");
const testObj = new SceneObject("img", {
    x: 100,
    y: 100
}, {
    src: "https://via.placeholder.com/150",
    // style: "top: 100px; left: 100px;"
});
// deno-lint-ignore no-explicit-any
testObj.events.on("click", (_: any) => {
    testObj.destroy();
});

if (ENV.deno) {
    logger.log("Running webview...");
    ENV.webview.run();
};