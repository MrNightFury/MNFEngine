import { Position, SceneObject } from "engine/Objects/SceneObject.ts";
import { ObjectParameters } from "engine/Objects/ObjectParameters.ts";
import { Interaction, parseInteraction } from "engine/Objects/ObjectInteractions.ts";
import { SceneComponent } from "window/SceneComponent.ts";
import { inview } from "window/RunInView.ts";
import { notify } from "engine/Components/WatchDecorator.ts";



export interface ImageObjectParams extends ObjectParameters {
    src: string,
    interaction?: Interaction | Interaction[],

    // position: Position | [number, number],
    // x: number, y: number
}


export class ImageComponent extends SceneComponent<SceneObject> {
    constructor(parent: SceneObject, params: ImageObjectParams) {
        super(parent, "img", parent.position, { src: params.src });

        if (params.interaction)
            this.events.on("click", parseInteraction(params.interaction));
    }


    @notify("parent.position")
    @inview
    move(newValue: Position) {
        this.$.css({ bottom: `${newValue.y}px`, left: `${newValue.x}px` });
    }
}