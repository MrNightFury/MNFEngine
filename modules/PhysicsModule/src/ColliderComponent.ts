import { BaseComponent } from "engine/Objects/BaseComponent.ts";
import { BaseObject } from "engine/Objects/BaseObject.ts";
import { Engine } from "engine/Engine.ts";
import { PhysicsModule } from "./PhysicsModule.ts";
import { ColliderType, Float2 } from "../wasm_module/pkg/wasm_module.d.ts";


export class ColliderComponent extends BaseComponent {
    constructor(parent: BaseObject, type: ColliderType.Circle, params: number)
    constructor(parent: BaseObject, type: ColliderType.Rectangle, params: { width: number, height: number })
    // deno-lint-ignore no-explicit-any
    constructor(parent: BaseObject, type: ColliderType, params: any) {
        super(parent);
        Engine.instance.modulesManager.getModule(PhysicsModule)?.world.add_collider(parent.id, type, new Float2(0, 0), 
            type === ColliderType.Circle ? params : new Float2(params.width, params.height));
    }
}