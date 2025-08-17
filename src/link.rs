use wasm_bindgen::prelude::wasm_bindgen;
#[wasm_bindgen]
pub struct Link {
    pub caid: u32,
    pub cbid: u32,
    pub live: u8,
}
#[wasm_bindgen]
impl Link {
    pub fn new(caid: u32, cbid: u32) -> Link {
        Link {
            caid,
            cbid,
            live: 7,
        }
    }
    pub fn size() -> u32 {
        size_of::<Link>() as u32
    }
}
