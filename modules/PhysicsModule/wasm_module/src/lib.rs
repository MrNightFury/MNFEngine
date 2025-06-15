use std::collections::{ HashMap, HashSet};
use wasm_bindgen::prelude::*;

use crate::colliders::*;
use crate::math::*;

mod colliders;
mod math;


#[wasm_bindgen]
pub fn test() {
    println!("WASM module loaded successfully!");
}

#[wasm_bindgen]
#[derive(PartialEq, Eq, Hash)]
pub enum CollisionEvent {
    Enter,
    Exit,
    Update,
}

#[wasm_bindgen]
pub struct World {
    colliders: HashMap<u32, colliders::Collider>,
    current_collisions: HashSet<(u32, u32)>,

    collision_handlers: HashMap<(CollisionEvent, u32), Vec<js_sys::Function>>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new() -> World {
        World {
            colliders: HashMap::new(),
            current_collisions: HashSet::new(),
            collision_handlers: HashMap::new(),
        }
    }

    pub fn add_collision_handler(&mut self, event: CollisionEvent, collider_id: u32, handler: js_sys::Function) {
        let key = (event, collider_id);
        self.collision_handlers.entry(key).or_default().push(handler);
    }

    pub fn add_collider(&mut self, id: u32, collider_type: ColliderType, position: Float2, params: JsValue) {
        match collider_type {
            colliders::ColliderType::Circle => {
                let radius = params.as_f64().unwrap_or(0.0) as f32;
                self.add_circle(id, position, radius);
            },
            colliders::ColliderType::Rectangle => {
                let position: Float2 = serde_wasm_bindgen::from_value(params).unwrap();
                self.add_rectangle(id, position, position.x, position.y);
            }
        }
    }

    pub fn add_circle(&mut self, id: u32, position: Float2, radius: f32) {
        let circle = colliders::Circle {
            id,
            radius,
            position,
        };
        self.colliders.insert(id, Collider::Circle(circle));
    }

    pub fn add_rectangle(&mut self, id: u32, position: Float2, width: f32, height: f32) {
        let rectangle = Rectangle {
            id,
            size: Float2 {
                x: width,
                y: height
            },
            position,
        };
        self.colliders.insert(id, Collider::Rectangle(rectangle));
    }

    pub fn get_colliders(&self) -> Vec<JsValue> {
        self.colliders.iter().map(|c| serde_wasm_bindgen::to_value(&c).unwrap()).collect()
    }

    pub fn remove_collider(&mut self, id: u32) {
        self.colliders.remove(&id);
    }

    pub fn move_collider(&mut self, id: u32, new_position: Float2) {
        if let Some(collider) = self.colliders.get_mut(&id) {
            match collider {
                Collider::Circle(circle) => {
                    circle.position = new_position;
                },
                Collider::Rectangle(rectangle) => {
                    rectangle.position = new_position;
                }
            }
        }
    }

    pub fn update_collisions(&mut self, id: u32) {
        let collider = self.colliders.get(&id);
        if collider.is_none() {
            return
        }
        let collider = collider.unwrap();
        
        for (other_id, other_collider) in &self.colliders {
            if other_id == &id {
                continue;
            }

            let pair = if id < *other_id { (id, *other_id) } else { (*other_id, id) };
            let collision = check_collision(collider, other_collider);

            if collision && !self.current_collisions.contains(&pair) {
                self.current_collisions.insert(pair);
                if let Some(handlers) = self.collision_handlers.get(&(CollisionEvent::Enter, id)) {
                    for handler in handlers {
                        let _ = handler.call1(&JsValue::NULL, &serde_wasm_bindgen::to_value(&pair).unwrap());
                    }
                }
            } else if !collision && self.current_collisions.contains(&pair) {
                self.current_collisions.remove(&pair);
                if let Some(handlers) = self.collision_handlers.get(&(CollisionEvent::Exit, id)) {
                    for handler in handlers {
                        let _ = handler.call1(&JsValue::NULL, &serde_wasm_bindgen::to_value(&pair).unwrap());
                    }
                }
            }
        }
    }
}