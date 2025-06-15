use wasm_bindgen::prelude::*;


#[wasm_bindgen]
#[derive(PartialEq, Eq, Hash)]
#[repr(u32)]
pub enum CollisionEventType {
    Enter,
    Exit,
    Update,
}

#[wasm_bindgen]
pub struct CollisionsBuffer {
    buffer: Vec<u32>,
}

#[wasm_bindgen]
impl CollisionsBuffer {
    pub fn new() -> Self {
        CollisionsBuffer {
            buffer: Vec::new(),
        }
    }

    pub fn add(&mut self, event_type: CollisionEventType, collider_id: u32, other_collider_id: u32) {
        self.buffer.push(event_type as u32);
        self.buffer.push(collider_id);
        self.buffer.push(other_collider_id);
    }

    pub fn clear(&mut self) {
        self.buffer.clear();
    }

    pub fn ptr(&self) -> *const u32 {
        self.buffer.as_ptr()
    }

    pub fn len(&self) -> usize {
        self.buffer.len() / 3
    }
}