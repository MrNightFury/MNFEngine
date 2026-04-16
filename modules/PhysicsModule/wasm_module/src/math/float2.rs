use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use std::ops::{ Add, AddAssign, Div, Mul, Sub };

use crate::utils::ToU32Buffer;


#[wasm_bindgen]
#[derive(Copy, Clone, Deserialize, Serialize, Debug, PartialEq)]
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

impl AddAssign for Float2 {
    fn add_assign(&mut self, other: Float2) {
        self.x += other.x;
        self.y += other.y;
    }
}

impl ToU32Buffer for Float2 {
    fn write_u32(&self, buf: &mut Vec<u32>) {
        self.x.write_u32(buf);
        self.y.write_u32(buf);
    }
    const STRIDE: usize = 2;
}