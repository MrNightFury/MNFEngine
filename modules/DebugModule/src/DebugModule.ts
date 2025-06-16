// deno-lint-ignore-file no-window no-window-prefix
import { Module } from "engine/Modules/Module.ts";
// @ts-ignore: 
import type _ from "npm:@types/jquery";




export class DebugModule extends Module {
    name = "DebugModule";

    async load() {
        this.engine.eventEmitter.on("windowResize", data => {
            // console.log("Window resized", data);
        })
    }

    // deno-lint-ignore require-await
    async pageLoaded() {
        this.engine.DOM.runScript(() => {
            $("<canvas>", {
                id: "debug_canvas",
                style: "position: absolute; top: 0; left: 0; z-index: 1000; pointer-events: none; width: 100%; height: 100%;",
            }).appendTo("#game").attr({
                width: window.innerWidth,
                height: window.innerHeight,
            });


            window.addEventListener("resize", () => {
                const size = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
                $("#debug_canvas").attr(size);
                
                const canvas = $("#debug_canvas").get(0) as HTMLCanvasElement;
                const ctx = canvas.getContext("2d")!;
                ctx.fillStyle = 'blue';
                ctx.fillRect(200, 200, 100, 100);
                
            });
        })
    }
}