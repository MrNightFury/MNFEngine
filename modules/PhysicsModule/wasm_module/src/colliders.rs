use serde::Serialize;
use wasm_bindgen::prelude::*;

use crate::math::Float2;

#[wasm_bindgen]
pub struct BoundingBox {
    pub a: Float2,
    pub b: Float2,
}

#[wasm_bindgen]
#[derive(Serialize)]
pub struct Circle {
    pub id: u32,
    pub radius: f32,
    pub position: Float2,
}


#[wasm_bindgen]
#[derive(Serialize)]
pub struct Rectangle {
    pub id: u32,
    pub size: Float2,
    pub position: Float2,
}

impl Rectangle {
    pub fn width(&self) -> f32 {
        self.size.x
    }
    
    pub fn height(&self) -> f32 {
        self.size.y
    }

    pub fn bounding_box(&self) -> BoundingBox {
        let half_size = self.size / 2.;
        BoundingBox {
            a: self.position - half_size,
            b: self.position + half_size,
        }
    }
}


#[derive(Serialize)]
pub enum Collider {
    Circle(Circle),
    Rectangle(Rectangle),
}

#[wasm_bindgen]
pub enum ColliderType {
    Circle, Rectangle
}


pub fn check_collision_rectangle_rectangle(rect1: &Rectangle, rect2: &Rectangle) -> bool {
    let rect1_box = rect1.bounding_box();
    let rect2_box = rect2.bounding_box();

    return rect1_box.a.x < rect2_box.b.x && rect1_box.b.x > rect2_box.a.x &&
           rect1_box.a.y < rect2_box.b.y && rect1_box.b.y > rect2_box.a.y;
}

pub fn check_collision_circle_circle(circle1: &Circle, circle2: &Circle) -> bool {
    let dx = circle1.position.x - circle2.position.x;
    let dy = circle1.position.y - circle2.position.y;
    let distance_squared = dx * dx + dy * dy;
    let radius_sum = circle1.radius + circle2.radius;
    return distance_squared < radius_sum * radius_sum
}

pub fn check_collision_circle_rectangle(circle: &Circle, rectangle: &Rectangle) -> bool {
    let rect_box = rectangle.bounding_box();

    let nearest_x = circle.position.x.clamp(rect_box.a.x, rect_box.b.x);
    let nearest_y = circle.position.y.clamp(rect_box.a.y, rect_box.b.y);

    let dx = circle.position.x - nearest_x;
    let dy = circle.position.y - nearest_y;

    let distance_squared = dx * dx + dy * dy;
    return distance_squared < circle.radius * circle.radius
}


pub fn check_collision(collider1: &Collider, collider2: &Collider) -> bool {
    match (collider1, collider2) {
        (Collider::Circle(circle1), Collider::Circle(circle2)) => {
            check_collision_circle_circle(circle1, circle2)
        },
        (Collider::Rectangle(rect1), Collider::Rectangle(rect2)) => {
            check_collision_rectangle_rectangle(rect1, rect2)
        },
        (Collider::Circle(circle), Collider::Rectangle(rectangle)) |
        (Collider::Rectangle(rectangle), Collider::Circle(circle)) => {
            check_collision_circle_rectangle(circle, rectangle)
        }
    }
}