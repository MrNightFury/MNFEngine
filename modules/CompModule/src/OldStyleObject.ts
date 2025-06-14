import { SceneObject } from "engine/Objects/SceneObject.ts";
import { Engine } from "engine/Engine.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";
import { identifier } from "engine/Loader.ts";


interface Position {
    x: number,
    y: number,
    zIndex: number
}

export enum InteractType {
    TAKE = "take",
    FUNCTION = "function",
    TEXT = "text",
    SCENE = "changeScene",
    SPAWN = "spawn",
    DELETE = "delete",
    PLAYSOUND = "playSound"
}

export interface BaseInteract<T = InteractType> {
    type: T,
}
export interface functionInteract extends BaseInteract<InteractType.FUNCTION> {
    path: string;
}
export interface takeInteract extends BaseInteract<InteractType.TAKE> {
    item: string;
}
export interface textInteract extends BaseInteract<InteractType.TEXT> {
    text: string;
}
export interface sceneInteract extends BaseInteract<InteractType.SCENE> {
    sceneId: string;
}

export interface spawnInteract extends BaseInteract<InteractType.SPAWN> {
    object: string;
}

export interface deleteInteract extends BaseInteract<InteractType.DELETE> {

}

export interface playSoundInteract extends BaseInteract<InteractType.PLAYSOUND> {
    sound: string;
}

export type IInteract = takeInteract | functionInteract | textInteract | sceneInteract | spawnInteract | deleteInteract | playSoundInteract;

interface OldStyleObjectParams {
    name: string,
    sprite: {
        path: string,
        size: number | Position
    },
    text: string,
    position: Position,
    interact: IInteract | IInteract[]
}

export class OldStyleObject extends SceneObject {
    constructor(params: OldStyleObjectParams) {
        super("img", {
            x: params.position.x, y: params.position.y
        }, {
            src: Engine.instance.loader.getPathFromIdentifier(params.sprite.path, FileType.IMAGE)!,
        });
    }

    onClick() {
        console.log(Engine.instance.objects.size);
    }

}