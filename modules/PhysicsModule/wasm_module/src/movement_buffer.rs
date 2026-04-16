use wasm_bindgen::prelude::*;

use crate::math::Float2;


#[wasm_bindgen]
pub struct MovementBuffer {
    buffer: Vec<u32>,
}

#[wasm_bindgen]
impl MovementBuffer {
    pub fn new() -> Self {
        MovementBuffer {
            buffer: Vec::new(),
        }
    }

    pub fn add(&mut self, collider_id: u32, new_pos: Float2) {
        self.buffer.push(collider_id);
        self.buffer.push(new_pos.x as u32);
        self.buffer.push(new_pos.y as u32);
    }

    pub fn clear(&mut self) {
        self.buffer.clear();
    }

    pub fn ptr(&self) -> *const u32 {
        self.buffer.as_ptr()
    }

    pub fn len(&self) -> usize {
        self.buffer.len() / 4
    }
}