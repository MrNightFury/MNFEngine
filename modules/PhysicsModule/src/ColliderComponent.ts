import { BaseComponent } from "engine/Components/BaseComponent.ts";
import { ColliderType, Float2, World } from "../wasm_module/pkg/wasm_module.js";
import { SceneObject } from "engine/Objects/SceneObject.ts";


export class ColliderComponent extends BaseComponent<SceneObject> {
    static world: World;

    constructor(parent: SceneObject, type: ColliderType.Circle, params: number)
    constructor(parent: SceneObject, type: ColliderType.Rectangle, params: { width: number, height: number })
    // deno-lint-ignore no-explicit-any
    constructor(parent: SceneObject, type: ColliderType, params: any) {
        super(parent);
        ColliderComponent.world.add_collider(parent.id, type, new Float2(0, 0), 
            type === ColliderType.Circle ? params : new Float2(params.width, params.height));
    }

    override destroy() {
        ColliderComponent.world.remove_collider(this.parent.id);
        super.destroy();
    }

    override setParent(parent: SceneObject): void {
        super.setParent(parent);
        ColliderComponent.world.move_collider(parent.id, new Float2(parent.position.x, parent.position.y));
    }
}