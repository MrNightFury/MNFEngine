use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use std::ops::{ Add, Mul, Sub, Div };


#[wasm_bindgen]
#[derive(Copy, Clone, Deserialize, Serialize)]
pub struct Float2 {
    pub x: f32,
    pub y: f32,
}


#[wasm_bindgen]
impl Float2 {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32, y: f32) -> Self {
        Float2 { x, y }
    }
}


impl Add for Float2 {
    type Output = Float2;

    fn add(self, other: Float2) -> Float2 {
        Float2 {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl Sub for Float2 {
    type Output = Float2;

    fn sub(self, other: Float2) -> Float2 {
        Float2 {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

impl Mul<f32> for Float2 {
    type Output = Float2;

    fn mul(self, scalar: f32) -> Float2 {
        Float2 {
            x: self.x * scalar,
            y: self.y * scalar,
        }
    }
}

impl Div<f32> for Float2 {
    type Output = Float2;

    fn div(self, scalar: f32) -> Float2 {
        if scalar == 0.0 {
            panic!("Division by zero in Float2 division");
        }
        Float2 {
            x: self.x / scalar,
            y: self.y / scalar,
        }
    }
}