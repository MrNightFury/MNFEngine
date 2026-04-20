use wasm_bindgen::JsValue;


pub fn log(s: &str) {
    let global = js_sys::global();
    let console = js_sys::Reflect::get(&global, &JsValue::from_str("console")).unwrap();
    let log_fn = js_sys::Reflect::get(&console, &JsValue::from_str("log")).unwrap();

    let _ = js_sys::Function::from(log_fn)
        .call1(&JsValue::NULL, &JsValue::from_str(s));
}