// deno-lint-ignore-file no-explicit-any
import { HTMLObject } from "engine/Objects/HTMLObject.ts";
import { Engine } from "engine/Engine.ts";


export function inview<T extends HTMLObject>(target: (this: T | any, ...args: any[]) => any, _ctx: ClassMethodDecoratorContext) {
    return function (this: T | any, ...args: any[]) {
        const scriptText = target.toString();
        const argsText = scriptText.match(/\(([^)]+)\)/)?.[0] ?? "()";
        const argsNames = argsText.split(",").map(arg => arg.trim().replaceAll("(", "").replaceAll(")", ""));
        let filledArguments = argsText;
        for (const arg of argsNames) {
            filledArguments = filledArguments.replaceAll(arg, JSON.stringify(args.shift()));
        }
        const script = `(function ${scriptText})${filledArguments}`;

        if (this instanceof HTMLObject) {
            this.exec(script);
        } else {
            Engine.instance.DOM.runScript(script);
        }
    }
}