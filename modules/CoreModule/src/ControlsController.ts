import { Logger } from "misc/Logger.ts";
import { EventEmitter } from "engine/EventEmitter.ts";
import { Engine } from "engine/Engine.ts";

export enum KeyState {
    HOLD, PRESS, RELEASE
}

export class ControlsController {
    logger = new Logger(this);
    eventEmitter = new EventEmitter(this, false);

    pressedKeys: Set<string> = new Set();

    constructor() {
        this.eventEmitter.eventNameField = "key";
        setInterval(this.checkInput.bind(this), 1000 / 60);

        Engine.instance.eventEmitter.on("keyboardEvent", (data: { type: string, key: string }) => {
            if (data.type == "keyDown") {
                this.keyDown(data.key);
            } else if (data.type == "keyUp") {
                this.keyUp(data.key);
            }
        })
    }

    checkInput() {
        // this.logger.log("Pressed keys: ", this.pressedKeys);
        this.pressedKeys.forEach(key => {
            this.eventEmitter.emit({ key: key, state: KeyState.HOLD });
        })
    }

    keyDown(key: string) {
        if (this.pressedKeys.has(key)) {
            return;
        }
        this.pressedKeys.add(key);
        this.eventEmitter.emit({ key: key, state: KeyState.PRESS });
    }

    keyUp(key: string) {
        this.pressedKeys.delete(key);
        this.eventEmitter.emit({ key: key, state: KeyState.RELEASE });
    }
}