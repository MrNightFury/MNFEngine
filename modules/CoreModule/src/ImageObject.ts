import { Engine } from "engine/Engine.ts";
import { Position, SceneObject } from "engine/Objects/SceneObject.ts";
import { ObjectParameters } from "engine/Objects/ObjectParameters.ts";
import { Interaction, parseInteraction } from "engine/Objects/ObjectInteractions.ts";



export interface ImageObjectParams extends ObjectParameters {
    src: string,
    interaction?: Interaction | Interaction[],

    position: Position | [number, number],
    x: number, y: number
}


export class ImageObject extends SceneObject {
    constructor(params: ImageObjectParams) {
        const position = !params.position ? { x: params.x, y: params.y } :
            (Array.isArray(params.position) ? { x: params.position[0], y: params.position[1] } : params.position);
        super("img", position, { src: params.src });

        if (params.interaction)
            this.events.on("click", parseInteraction(params.interaction));
    }


    onClick() {
        
        // Engine.instance.audio.playRandomSequence("steps/step.wav", 8, 8, 300)
        console.log(Engine.instance.objects.size);
    }
}