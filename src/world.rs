use crate::cell::cell_area;
use crate::cell::cell_mass;
use crate::cell::Cell;
use crate::link::Link;
use crate::person::Person;
use crate::point::Point;
use crate::tree::Tree;
use chrono::prelude::*;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
use std::collections::HashMap;
use std::collections::HashSet;
use wasm_bindgen::prelude::*;
const BASE_GROWTH: f32 = 1.0001;
const LOWER_DIAMETER: f32 = 0.97;
#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct StepDurations {
    pub update_cells_01: i64,
    pub update_cells_02: i64,
    pub update_cells_03: i64,
}
#[wasm_bindgen]
pub struct World {
    cells: Vec<Cell>,
    persons: Vec<Person>,
    rng: StdRng,
    gravity: f32,
    crdv: f32,
    crdp: f32,
    rdv: f32,
    rdp: f32,
    spring: f32,
    links: Vec<Link>,
    links_map: HashMap<(usize, usize), usize>,
    links_free: HashSet<usize>,
    links_used: HashSet<usize>,
    step_durations: Vec<StepDurations>,
    pub step_durations_avg: StepDurations,
    substep: i32,
    trees: Vec<Tree>,
}
impl Default for World {
    fn default() -> Self {
        Self::new()
    }
}
#[wasm_bindgen]
impl World {
    pub fn new() -> World {
        World {
            cells: Vec::new(),
            persons: Vec::new(),
            rng: StdRng::seed_from_u64(12),
            gravity: 0.0,
            crdv: 0.0,
            crdp: 0.0,
            rdv: 0.0,
            rdp: 0.0,
            spring: 0.0,
            links: Vec::new(),
            links_map: HashMap::new(),
            links_free: HashSet::new(),
            links_used: HashSet::new(),
            step_durations: Vec::new(),
            step_durations_avg: StepDurations {
                update_cells_01: 0,
                update_cells_02: 0,
                update_cells_03: 0,
            },
            substep: 0,
            trees: Vec::new(),
        }
    }
    pub fn add_link(&mut self, caid: usize, cbid: usize) {
        let idx: usize = if let Some(idx_) = self.links_map.get(&(caid, cbid)) {
            *idx_
        } else if self.links_free.is_empty() {
            self.links.push(Link::new(caid as u32, cbid as u32));
            self.links.len() - 1
        } else {
            *self.links_free.iter().next().unwrap()
        };
        self.links[idx].caid = caid as u32;
        self.links[idx].cbid = cbid as u32;
        self.links[idx].live = 7;
        self.links_map.insert((caid, cbid), idx);
        self.links_free.remove(&idx);
        self.links_used.insert(idx);
    }
    pub fn remove_link(&mut self, caid: usize, cbid: usize) {
        if let Some(idx) = self.links_map.remove(&(caid, cbid)) {
            self.links_free.insert(idx);
            self.links_used.remove(&idx);
            self.links[idx].live = 0;
        };
    }
    pub fn update_cells_01(&mut self) {
        assert!(self.substep == 0);
        for cell in &mut self.cells {
            cell.dp = (cell.p - cell.pp) * self.rdp;
            cell.dv = (cell.p - cell.pp) * self.rdv;
            if cell.diameter > 1.0 {
                cell.growth = 1.0 / BASE_GROWTH;
            } else if cell.diameter < LOWER_DIAMETER {
                cell.growth = BASE_GROWTH;
            }
            cell.diameter *= cell.growth;
            cell.area = cell_area(cell.diameter);
            cell.mass = cell_mass(cell.diameter);
        }
    }
    pub fn find_cell(&self, x: f32, y: f32) -> usize {
        let mut dist_quared = f32::INFINITY;
        let mut idx = 0;
        for (idx_, cell) in self.cells.iter().enumerate() {
            let dist_quared_ = cell.p.distance_squared(x, y);
            if dist_quared_ < dist_quared {
                dist_quared = dist_quared_;
                idx = idx_;
            }
        }
        idx
    }
    pub fn update_cells_02(&mut self) {
        assert!(self.substep == 1);
        let cells_ptr = self.cells.as_mut_ptr();
        unsafe {
            let cells_slice_a = std::slice::from_raw_parts_mut(cells_ptr, self.cells.len());
            let cells_slice_b = std::slice::from_raw_parts_mut(cells_ptr, self.cells.len());
            for (ia, ca) in cells_slice_a
                .iter_mut()
                .enumerate()
                .take(self.cells.len() - 1)
            {
                for cb in cells_slice_b.iter_mut().take(self.cells.len()).skip(ia + 1) {
                    let dist = ca.p.distance(cb.p);
                    let diam_a_ratio = cb.diameter / ca.diameter;
                    let diam_b_ratio = ca.diameter / cb.diameter;
                    if dist < (ca.diameter + cb.diameter) * 0.5 {
                        let n = (ca.p - cb.p).normalize();
                        ca.dv += n * self.crdv * diam_a_ratio;
                        cb.dv -= n * self.crdv * diam_b_ratio;
                        ca.dp += n * self.crdp * diam_a_ratio;
                        cb.dp -= n * self.crdp * diam_b_ratio;
                    } else {
                        // pass
                    }
                    if dist < (ca.diameter + cb.diameter) * 0.5 + 0.1 {
                        self.add_link(ca.id as usize, cb.id as usize);
                    } else {
                        self.remove_link(ca.id as usize, cb.id as usize);
                    }
                    if dist < (ca.diameter + cb.diameter) * 0.5 {
                        let dv = ca.p - cb.p;
                        let n = dv.normalized();
                        let d = dv.length();
                        let spring_force = d - (ca.diameter + cb.diameter) * 0.5;
                        ca.dv -= n * spring_force * self.spring * diam_a_ratio;
                        cb.dv += n * spring_force * self.spring * diam_b_ratio;
                    }
                }
            }
        }
    }
    pub fn update_cells_03(&mut self) {
        assert!(self.substep == 2);
        let center = Point { x: 0.0, y: 0.0 };
        for cell in &mut self.cells {
            let gravity = (cell.p - center).normalize() * -self.gravity * cell.mass;
            cell.p += cell.dp + gravity + cell.dv;
            cell.pp += cell.dp;
        }
    }
    pub fn step(&mut self) {
        let sd = StepDurations {
            update_cells_01: {
                // let start = Instant::now();
                let start = Utc::now().timestamp_nanos_opt().unwrap();
                self.update_cells_01();
                self.substep += 1;
                Utc::now().timestamp_nanos_opt().unwrap() - start
            },
            update_cells_02: {
                // let start = Instant::now();
                let start = Utc::now().timestamp_nanos_opt().unwrap();
                self.update_cells_02();
                self.substep += 1;
                Utc::now().timestamp_nanos_opt().unwrap() - start
            },
            update_cells_03: {
                // let start = Instant::now();
                let start = Utc::now().timestamp_nanos_opt().unwrap();
                self.update_cells_03();
                self.substep += 1;
                Utc::now().timestamp_nanos_opt().unwrap() - start
            },
        };
        self.substep = 0;
        self.step_durations.push(sd);
        while self.step_durations.len() > 100 {
            self.step_durations.remove(0);
        }
        self.step_durations_avg = StepDurations {
            update_cells_01: 0,
            update_cells_02: 0,
            update_cells_03: 0,
        };
        for x in &self.step_durations {
            self.step_durations_avg.update_cells_01 += x.update_cells_01;
            self.step_durations_avg.update_cells_02 += x.update_cells_02;
            self.step_durations_avg.update_cells_03 += x.update_cells_03;
        }
        if !self.step_durations.is_empty() {
            self.step_durations_avg.update_cells_01 /= self.step_durations.len() as i64;
            self.step_durations_avg.update_cells_02 /= self.step_durations.len() as i64;
            self.step_durations_avg.update_cells_03 /= self.step_durations.len() as i64;
        }
    }
    pub fn set_gravity(&mut self, gravity: f32) {
        self.gravity = gravity;
    }
    pub fn set_spring(&mut self, spring: f32) {
        self.spring = spring;
    }
    pub fn set_rdv(&mut self, rdv: f32) {
        self.rdv = rdv;
    }
    pub fn set_rdp(&mut self, rdp: f32) {
        self.rdp = rdp;
    }
    pub fn set_crdv(&mut self, crdv: f32) {
        self.crdv = crdv;
    }
    pub fn set_crdp(&mut self, crdp: f32) {
        self.crdp = crdp;
    }
    pub fn rand_f32(&mut self, min: f32, max: f32) -> f32 {
        self.rng.random_range(min..max)
    }
    pub fn add_cell(&mut self, x: f32, y: f32) -> u32 {
        let l = self.cells.len();
        let l_u32 = l as u32;
        let diam = self.rand_f32(LOWER_DIAMETER, 1.0);
        // let diam = 1.0;
        let growth = if self.rand_f32(0.0, 1.0) >= 0.5 {
            BASE_GROWTH
        } else {
            1.0 / BASE_GROWTH
        };
        self.cells.push(Cell::new(l_u32, diam, growth));
        let cell = &mut self.cells[l];
        cell.set_position(x, y);
        l_u32
    }
    pub fn set_cell_position_x(&mut self, idx: u32, x: f32) {
        self.cells[idx as usize].p.x = x;
    }
    pub fn set_cell_position_y(&mut self, idx: u32, y: f32) {
        self.cells[idx as usize].p.y = y;
    }
    pub fn set_cell_pp_x(&mut self, idx: u32, x: f32) {
        self.cells[idx as usize].pp.x = x;
    }
    pub fn set_cell_pp_y(&mut self, idx: u32, y: f32) {
        self.cells[idx as usize].pp.y = y;
    }
    pub fn set_cell_diameter(&mut self, idx: u32, diameter: f32) {
        self.cells[idx as usize].diameter = diameter;
    }
    pub fn get_cell_diameter(&mut self, idx: u32) -> f32 {
        self.cells[idx as usize].diameter
    }
    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }
    pub fn cells_count(&self) -> u32 {
        self.cells.len() as u32
    }
    pub fn links(&self) -> *const Link {
        self.links.as_ptr()
    }
    pub fn links_count(&self) -> u32 {
        self.links.len() as u32
    }
    pub fn add_person(&mut self) {
        self.persons.push(Person::new(self.persons.len() as u32));
    }
    pub fn persons(&self) -> *const Person {
        self.persons.as_ptr()
    }
    pub fn persons_count(&self) -> u32 {
        self.persons.len() as u32
    }
}
#[wasm_bindgen]
impl World {
    pub fn add_tree(&mut self, x: f32, y: f32) {
        let cell_id = self.find_cell(x, y);
        self.trees.push(Tree { cell_id });
    }
    pub fn trees(&self) -> *const Tree {
        self.trees.as_ptr()
    }
    pub fn trees_count(&self) -> u32 {
        self.trees.len() as u32
    }
}
