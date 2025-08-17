use wasm_bindgen::prelude::wasm_bindgen;
pub struct Tree {
    pub cell_id: usize,
}
#[wasm_bindgen]
impl Tree {
    pub fn size() -> u32 {
        size_of::<Tree>() as u32
    }
}
