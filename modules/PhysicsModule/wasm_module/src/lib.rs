use wasm_bindgen::prelude::*;

use crate::colliders::*;
mod colliders;


#[wasm_bindgen]
pub fn test() {
    println!("WASM module loaded successfully!");
}

#[wasm_bindgen]
pub struct World {
    colliders: Vec<colliders::Collider>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new() -> World {
        World {
            colliders: Vec::new(),
        }
    }

    pub fn add_collider(&mut self, id: u32, collider_type: colliders::ColliderType, position: colliders::Position, params: JsValue) {
        match collider_type {
            colliders::ColliderType::Circle => {
                let radius = params.as_f64().unwrap_or(0.0) as f32;
                self.add_circle(id, position, radius);
            },
            colliders::ColliderType::Rectangle => {
                let position: Position = serde_wasm_bindgen::from_value(params).unwrap();
                self.add_rectangle(id, position, position.x, position.y);
            }
        }
    }

    pub fn add_circle(&mut self, id: u32, position: colliders::Position, radius: f32) {
        let circle = colliders::Circle {
            id,
            radius,
            position,
        };
        self.colliders.push(colliders::Collider::Circle(circle));
    }

    pub fn add_rectangle(&mut self, id: u32, position: colliders::Position, width: f32, height: f32) {
        let rectangle = colliders::Rectangle {
            id,
            width,
            height,
            position,
        };
        self.colliders.push(colliders::Collider::Rectangle(rectangle));
    }

    pub fn get_colliders(&self) -> Vec<JsValue> {
        self.colliders.iter().map(|c| serde_wasm_bindgen::to_value(c).unwrap()).collect()
    }
}