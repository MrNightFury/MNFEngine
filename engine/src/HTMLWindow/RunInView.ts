// deno-lint-ignore-file no-explicit-any
import { HTMLObject } from "engine/Objects/HTMLObject.ts";
import { Engine } from "engine/Engine.ts";
import { HTMLComponent } from "./HTMLComponent.ts";



// Returns function that runs in view context
// Manipalates function text to fill arguments and call using correct context (oh god forgive me for this hacky solution)
// Automaticaly use classes own exec method if exists
export function getInviewFunction<ARGS extends any[]>(target: (this: any, ...args: ARGS) => any, ctx?: Record<string, string>) {
    return function (this: any, ...args: ARGS) {
        let scriptText = target.toString();
        const argsText = scriptText.match(/\(([^)]*)\)/)?.[0] ?? "()";
        const argsNames = argsText.split(",").map(arg => arg.trim().replaceAll("(", "").replaceAll(")", "")).filter(arg => arg !== "");
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

        if (this && (this instanceof HTMLObject || this instanceof HTMLComponent) ) {
            this.exec(script);
        } else {
            console.warn("inview used on object not having custom .exec implementation, running using default Engine DOM executor");
            Engine.instance.DOM.runScript(script);
        }
    }
}


// Decorator, returns function that runs in view context
// Automaticaly use classes own exec method if exists
export function inview<T extends HTMLObject>(target: (this: T | any, ...args: any[]) => any, _ctx: ClassMethodDecoratorContext) {
    return getInviewFunction(target);
}