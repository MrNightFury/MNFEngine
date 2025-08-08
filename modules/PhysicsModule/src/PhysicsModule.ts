import { Engine } from "engine/Engine.ts";
import init, { World, InitOutput, CollisionEventType } from "../wasm_module/pkg/wasm_module.js";
import { Module } from "engine/Modules/Module.ts";
import type { CoreModule } from "modules/CoreModule/src/mod.ts";
import { ColliderComponent } from "./ColliderComponent.ts";


const coreModule = Engine.instance.modulesManager.getModule<CoreModule>("CoreModule")!;
const controls = coreModule.controls;
const KeyState = coreModule.exports.KeyState;


interface CollisionEvent {
    eventType: CollisionEventType;
    colliderId: number;
    otherColliderId: number;
}


export class PhysicsModule extends Module {
    override name = "PhysicsModule";

    public world!: World;
    public wasm!: InitOutput;

    
    override async pageLoaded() {
        
    }


    constructor() {
        super();
        Engine.instance.eventEmitter.on("tick", () => {
            this.tick();
        });
    }


    tick() {
        this.world.tick();
        const ptr = this.world.get_events_buffer_ptr();
        const len = this.world.get_events_buffer_len();
        const raw = new Uint32Array(this.wasm.memory.buffer, ptr, len * 3);

        for (let i = 0; i < len; i++) {
            const event: CollisionEvent = {
                eventType: raw[i * 3] as CollisionEventType,
                colliderId: raw[i * 3 + 1],
                otherColliderId: raw[i * 3 + 2]
            };

            this.logger.log("Collision Event:", event);
        }
    }


    async load() {
        this.logger.log("WASM Module loading...");
        this.wasm = await init();
        this.world = new World();

        controls.eventEmitter.on({ key: "r", state: KeyState.PRESS}, () => {
            this.logger.debug("DEBUG: PhysicsModule tick");
            this.tick();
        });

        // this.world.add_collider(1, ColliderType.Circle, new Float2(100, 100), 50);
        // this.world.add_collision_handler(CollisionEventType.Update, 1);
        // this.world.add_collider(2, ColliderType.Circle, new Float2(110, 110), 50);
        // this.world.add_collision_handler(CollisionEventType.Update, 2);

        ColliderComponent.world = this.world;
    }
}