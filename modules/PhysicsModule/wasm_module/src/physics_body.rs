use wasm_bindgen::prelude::wasm_bindgen;

use crate::math::Float2;


#[wasm_bindgen]
pub struct PhysicsBody {
    pub id: u32,
    pub position: Float2,
    pub velocity: Float2,
    pub mass: f32,
    pub is_gravity_affected: bool,
}

#[wasm_bindgen]
impl PhysicsBody {
    #[wasm_bindgen(constructor)]
    pub fn new(id: u32, position: Float2, velocity: Float2, mass: f32, is_gravity_affected: bool) -> Self {
        PhysicsBody {
            id,
            position,
            velocity,
            mass,
            is_gravity_affected,
        }
    }

    pub fn apply_impulse(&mut self, impulse: Float2) {
        let acceleration = impulse / self.mass;
        self.velocity = self.velocity + acceleration;
    }
}