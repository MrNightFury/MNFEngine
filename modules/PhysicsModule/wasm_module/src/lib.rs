use std::collections::{ HashMap, HashSet};
use wasm_bindgen::prelude::{ wasm_bindgen, JsValue };

use crate::colliders::*;
use crate::math::*;
use crate::collisions_buffer::*;

mod colliders;
mod math;
mod collisions_buffer;


#[wasm_bindgen]
pub fn test() {
    log(&"WASM module loaded successfully!");
}

fn log(s: &str) {
    let global = js_sys::global();
    let console = js_sys::Reflect::get(&global, &JsValue::from_str("console")).unwrap();
    let log_fn = js_sys::Reflect::get(&console, &JsValue::from_str("log")).unwrap();

    let _ = js_sys::Function::from(log_fn)
        .call1(&JsValue::NULL, &JsValue::from_str(s));
}

#[wasm_bindgen]
pub struct World {
    colliders: HashMap<u32, colliders::Collider>,
    current_collisions: HashSet<(u32, u32)>,

    required_events: HashSet<(CollisionEventType, u32)>,
    events_buffer: CollisionsBuffer,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new() -> World {
        World {
            colliders: HashMap::new(),
            current_collisions: HashSet::new(),

            required_events: HashSet::new(),
            events_buffer: CollisionsBuffer::new(),
        }
    }

    pub fn get_events_buffer_ptr(&self) -> *const u32 {
        self.events_buffer.ptr()
    }
    pub fn get_events_buffer_len(&self) -> usize {
        self.events_buffer.len()
    }

    pub fn add_collision_handler(&mut self, event: CollisionEventType, collider_id: u32) {
        let key = (event, collider_id);
        if !self.required_events.contains(&key) {
            self.required_events.insert(key);
        }
    }

    pub fn add_collider(&mut self, id: u32, collider_type: ColliderType, position: Float2, params: JsValue) {
        log(&format!("Adding collider: id={}, type={:?}, position={:?}, params={:?}", id, collider_type, position, params));
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
        self.update_collisions(id);
    }

    fn add_circle(&mut self, id: u32, position: Float2, radius: f32) {
        let circle = colliders::Circle {
            id,
            radius,
            position,
        };
        self.colliders.insert(id, Collider::Circle(circle));
    }

    fn add_rectangle(&mut self, id: u32, position: Float2, width: f32, height: f32) {
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
            self.update_collisions(id);
        }
    }

    pub fn tick(&mut self) -> bool {
        self.events_buffer.clear();
        for (id1, id2) in &self.current_collisions {
            if self.required_events.contains(&(CollisionEventType::Update, *id1)) {
                self.events_buffer.add(CollisionEventType::Update, *id1, *id2);
            }
            if self.required_events.contains(&(CollisionEventType::Update, *id2)) {
                self.events_buffer.add(CollisionEventType::Update, *id2, *id1);
            }
        }
        log(&format!("[Physics WASM] Tick: colliders count: {:?}", self.colliders.len()));
        return true;
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
                if self.required_events.contains(&(CollisionEventType::Enter, id)) {
                    self.events_buffer.add(CollisionEventType::Enter, id, *other_id);
                }
            } else if !collision && self.current_collisions.contains(&pair) {
                self.current_collisions.remove(&pair);
                if self.required_events.contains(&(CollisionEventType::Exit, id)) {
                    self.events_buffer.add(CollisionEventType::Exit, id, *other_id);
                }
            }
        }
    }
}