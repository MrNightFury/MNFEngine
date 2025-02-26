// deno-lint-ignore-file no-explicit-any
import { HTMLObject } from "engine/Objects/HTMLObject.ts";
import { Engine } from "engine/Engine.ts";



export function getInviewFunction<ARGS extends any[]>(target: (this: any, ...args: ARGS) => any) {
    return function (this: any, ...args: ARGS) {
        let scriptText = target.toString();
        const argsText = scriptText.match(/\(([^)]+)\)/)?.[0] ?? "()";
        const argsNames = argsText.split(",").map(arg => arg.trim().replaceAll("(", "").replaceAll(")", ""));
        let filledArguments = argsText;
        for (const arg of argsNames) {
            filledArguments = filledArguments.replaceAll(arg, JSON.stringify(args.shift()));
        }

        // Handle arrow functions
        // TODO: rewrite. Now ruins any inner arrow functions
        if (scriptText.includes("=>")) {
            scriptText = scriptText.replace("=>", "{") + "}";
        }
        
        const script = `(${scriptText.includes("function") ? "" : "function "}${scriptText})${filledArguments}`;
        // console.log(script);

        if (this && this instanceof HTMLObject) {
            this.exec(script);
        } else {
            Engine.instance.DOM.runScript(script);
        }
    }
}