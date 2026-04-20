pub trait ToU32Buffer {
    fn write_u32(&self, buf: &mut Vec<u32>);
    const STRIDE: usize; 
}

impl ToU32Buffer for u32 {
    fn write_u32(&self, buf: &mut Vec<u32>) {
        buf.push(*self);
    }
    const STRIDE: usize = 1;
}

impl ToU32Buffer for f32 {
    fn write_u32(&self, buf: &mut Vec<u32>) {
        buf.push(self.to_bits());
    }
    const STRIDE: usize = 1;
}


#[macro_export]
macro_rules! sum_stride {
    ($last:ty) => {
        <$last as crate::utils::ToU32Buffer>::STRIDE
    };
    ($head:ty, $($tail:ty),+) => { 
        <$head as crate::utils::ToU32Buffer>::STRIDE + sum_stride!($($tail),+) 
    };
}


#[macro_export]
macro_rules! impl_event_buffer {
    ($event_name:ident, $($field:ident: $ty:ty),* $(,)?) => { paste::paste!{
        #[wasm_bindgen]
        #[derive(Clone, Copy)]
        pub struct $event_name {
            $(pub $field: $ty),*
        }
        
        impl crate::utils::ToU32Buffer for $event_name {
            fn write_u32(&self, buf: &mut Vec<u32>) {
                $(self.$field.write_u32(buf);)*
            }
            const STRIDE: usize = sum_stride!($($ty),*);
        }
        
        #[wasm_bindgen]
        pub struct [<$event_name Buffer>] {
            buffer: Vec<u32>,
        }

        #[wasm_bindgen]
        impl [<$event_name Buffer>] {
            pub fn new() -> Self { Self { buffer: Vec::new() } }
            
            pub fn add(&mut self, event: $event_name) {
                <$event_name as $crate::utils::ToU32Buffer>::write_u32(&event, &mut self.buffer);
            }
            
            pub fn ptr(&self) -> *const u32 {
                self.buffer.as_ptr()
            }
            
            pub fn len(&self) -> usize { 
                self.buffer.len() / <$event_name as crate::utils::ToU32Buffer>::STRIDE 
            }
            
            pub fn clear(&mut self) { self.buffer.clear(); }
        }
    }
}}