import { Webview } from "@webview/webview";
import { MethodArgs, MethodKeys} from "misc/TypeHelpers.ts";

export type RunMethodWorkerMessage = {
    [K in MethodKeys<Webview>]: {
        event: "runMethod";
        method: K;
        args: MethodArgs<Webview, K>;
    };
}[MethodKeys<Webview>];

export type WorkerMessageBody = RunMethodWorkerMessage