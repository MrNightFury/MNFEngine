use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};


#[wasm_bindgen]
#[derive(Clone, Copy, Deserialize, Serialize)]
pub struct Position {
    pub x: f32,
    pub y: f32,
}

#[wasm_bindgen]
impl Position {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32, y: f32) -> Self {
        Position { x, y }
    }
}


#[wasm_bindgen]
#[derive(Clone, Copy, Serialize)]
pub struct Circle {
    pub id: u32,
    pub radius: f32,
    pub position: Position,
}


#[wasm_bindgen]
#[derive(Clone, Copy, Serialize)]
pub struct Rectangle {
    pub id: u32,
    pub width: f32,
    pub height: f32,
    pub position: Position,
}




#[derive(Clone, Copy, Serialize)]
pub enum Collider {
    Circle(Circle),
    Rectangle(Rectangle),
}


#[wasm_bindgen]
pub enum ColliderType {
    Circle, Rectangle
}