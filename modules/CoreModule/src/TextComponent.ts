import { SceneComponent } from "window/SceneComponent.ts";
import { Position, SceneObject } from "engine/Objects/SceneObject.ts";
import { ImageObjectParams } from "./ImageComponent.ts";
import { parseInteraction } from "engine/Objects/ObjectInteractions.ts";
import { inview } from "window/RunInView.ts";
import { notify } from "engine/Components/WatchDecorator.ts";
import { Engine } from "engine/Engine.ts";



export class TextComponent extends SceneComponent {
    constructor(parent: SceneObject, params: Record<any, any>) {
        super(parent, "p", parent.position, {});

        if (params.interaction)
            this.events.on("click", parseInteraction(params.interaction));

        Engine.instance.DOM.emitter.on("pageLoaded", () => {
            this.exec(() => {
                this.$.text("TEST");
            })
        })
    }
    
    
    @notify("parent.position")
    @inview
    move(newValue: Position) {
        this.$.css({ bottom: `${newValue.y}px`, left: `${newValue.x}px` });
    }
}