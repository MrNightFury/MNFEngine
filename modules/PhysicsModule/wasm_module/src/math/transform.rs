use wasm_bindgen::prelude::wasm_bindgen;

use crate::math::Float2;


#[wasm_bindgen]
pub struct Transform {
    pub position: Float2,
    pub rotation: f32,
    // pub scale: Float2,
}