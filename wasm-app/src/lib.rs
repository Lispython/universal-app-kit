use wasm_bindgen::prelude::*;

use web_sys::console;

extern crate wasm_bindgen;


#[wasm_bindgen]
pub fn log_work(){
    console::log_1(&"Hello from wasm-app log-work".into());
}

#[wasm_bindgen]
pub fn hello_world() -> String {
    String::from("Hello world from Rust!")
}

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.

    console::log_1(&"Hello from main wasm-app function".into());

    Ok(())
}
