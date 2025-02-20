import { ObjectParameters } from "engine/Objects/ObjectParameters.ts";

export interface IScene {
    name: string;
    background: string;
    objects: ObjectParameters[];
}