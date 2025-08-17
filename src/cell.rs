use crate::point::Point;
use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub struct Cell {
    pub id: u32,
    pub diameter: f32,
    // position
    pub p: Point,
    // previous position
    pub pp: Point,
    // delta position
    pub dp: Point,
    // delta velocity
    pub dv: Point,
    pub mass: f32,
    pub area: f32,
    pub growth: f32,
}
pub fn cell_area(diameter: f32) -> f32 {
    let radius = diameter * 0.5;
    std::f32::consts::PI * radius * radius
}
pub fn cell_mass(diameter: f32) -> f32 {
    let radius = diameter * 0.5;
    std::f32::consts::PI * radius * radius
}
#[wasm_bindgen]
impl Cell {
    pub fn new(id: u32, diameter: f32, growth: f32) -> Cell {
        Cell {
            id,
            diameter,
            p: Point::new(0.0, 0.0),
            pp: Point::new(0.0, 0.0),
            dp: Point::new(0.0, 0.0),
            dv: Point::new(0.0, 0.0),
            area: cell_area(diameter),
            mass: cell_mass(diameter),
            growth,
        }
    }
    pub fn size() -> u32 {
        size_of::<Cell>() as u32
    }
    pub fn set_position(&mut self, x: f32, y: f32) {
        self.p.x = x;
        self.p.y = y;
        self.pp.x = x;
        self.pp.y = y;
    }
}
