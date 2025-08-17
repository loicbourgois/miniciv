use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub struct Person {
    pub id: u32,
}
#[wasm_bindgen]
impl Person {
    pub fn new(id: u32) -> Person {
        Person { id }
    }
}
