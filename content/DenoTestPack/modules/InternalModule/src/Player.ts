import { Position, SceneObject } from "engine/Objects/SceneObject.ts";
import { Engine } from "engine/Engine.ts";
import { InternalModule } from "./mod.ts";
import type { CoreModule } from "modules/CoreModule/src/mod.ts";
import { inview } from "window/RunInView.ts";
import { notify } from "engine/Components/WatchDecorator.ts";


const coreModule = Engine.instance.modulesManager.getModule<CoreModule>("CoreModule")!;
const controls = coreModule.controls;
const KeyState = coreModule.exports.KeyState;


export class Player extends SceneObject {
    module = Engine.instance.modulesManager.getModule<InternalModule>("InternalModule")!;
    

    @inview
    moveInview(x: number, y: number) {
        x *= 2; y *= 2;
        this.$.css({ bottom: `+=${y}px`, left: `+=${x}px` });
    }

    move(x: number, y: number) {
        this.moveInview(x, y);
        this.position = { x: this.position.x + x, y: this.position.y + y };
    }

    constructor() {
        console.log("Player constructor");
        super("p", { x: 100, y: 100 }, { style: "color: red" });
        this.addComponent(new coreModule.exports.ImageComponent(this, {
            src: "https://placehold.net/400x400.png"
        }))

        Engine.instance.DOM.emitter.on("pageLoaded", () => {
            this.exec(() => {
                this.$.text("Player");
            })
        })

        controls.eventEmitter.on({key: "w", state: KeyState.HOLD }, () => {
            this.move(0, 1);
        })
        controls.eventEmitter.on({key: "a", state: KeyState.HOLD }, () => {
            this.move(-1, 0);
        })
        controls.eventEmitter.on({key: "s", state: KeyState.HOLD }, () => {
            this.move(0, -1);
        })
        controls.eventEmitter.on({key: "d", state: KeyState.HOLD }, () => {
            this.move(1, 0);
        })
    }
}