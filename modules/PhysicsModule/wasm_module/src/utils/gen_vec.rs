use std::ops::{Index, IndexMut};


pub struct Handle {
    pub id: usize,
    pub generation: u32
}


pub struct GVec<T> {
    pub data: Vec<(T, u32)>, // (value, generation)
    pub free_ids: Vec<usize>, // list of free indices
}

impl<T> GVec<T> {
    pub fn new() -> Self {
        Self {
            data: Vec::new(),
            free_ids: Vec::new(),
        }
    }

    pub fn insert(&mut self, value: T) -> Handle {
        let idx = match self.free_ids.pop() {
            Some(idx) => {
                self.data[idx] = (value, self.data[idx].1 + 1);
                idx
            },
            None => {
                self.data.push((value, 0));
                self.data.len() - 1
            }
        };

        return Handle {
            id: idx, generation: self.data[idx].1
        }
    }

    pub fn get_mut(&mut self, handle: Handle) -> Option<&mut T> {
        let (val, g) = &mut self.data[handle.id];
        return if handle.generation == *g { Some(val) } else { None };
    }

    pub fn get(&self, handle: Handle) -> Option<&T> {
        let (val, g) = & self.data[handle.id];
        return if handle.generation == *g { Some(val) } else { None }
    }
}

impl<T> Index<Handle> for GVec<T> {
    type Output = T;

    fn index(&self, handle: Handle) -> &T {
        return self.get(handle).expect("Invalid index in handle");
    }
}

impl<T> IndexMut<Handle> for GVec<T> {
    fn index_mut(&mut self, handle: Handle) -> &mut Self::Output {
        return self.get_mut(handle).expect("Invalid index in handle");
    }
}