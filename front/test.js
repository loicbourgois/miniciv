import { get_cell } from "./get_cell.js";
import { get_link } from "./get_link.js";
const test = (miniciv, memory) => {
	console.log("test - start");
	const world = miniciv.World.new();
	const input = [
		{
			kind: "cell",
			p: {
				x: 2.4,
				y: -3.6,
			},
			pp: {
				x: 154,
				y: 3.6,
			},
			diameter: 1.2,
		},
		{
			kind: "cell",
			p: {
				x: 12.4,
				y: -3.6,
			},
			pp: {
				x: 154,
				y: 3.6,
			},
			diameter: 1.2,
		},
		{
			kind: "cell",
			p: {
				x: 5.4,
				y: 2.6,
			},
			pp: {
				x: 15.4,
				y: 23.6,
			},
			diameter: 1.3,
		},
		{
			kind: "cell",
			p: {
				x: 5.4,
				y: 2.4,
			},
			pp: {
				x: 15.4,
				y: 23.6,
			},
			diameter: 1.3,
		},
		{
			idx: 0,
			kind: "link",
			caid: 2,
			cbid: 3,
			live: 7,
		},
	];
	for (const e of input) {
		if (e.kind == "cell") {
			const idx = world.add_cell();
			world.set_cell_position_x(idx, e.p.x);
			world.set_cell_position_y(idx, e.p.y);
			world.set_cell_pp_x(idx, e.pp.x);
			world.set_cell_pp_y(idx, e.pp.y);
			world.set_cell_diameter(idx, e.diameter);
			e.idx = idx;
		} else if (e.kind == "link") {
			// pass
		} else {
			throw new Error(`invalid kind: ${e.kind}`);
		}
	}
	const cellsPtr = world.cells();
	const cells_view = new DataView(
		memory.buffer,
		cellsPtr,
		world.cells_count() * miniciv.Cell.size(),
	);
	const cell_size = miniciv.Cell.size();
	const errors = [];
	for (const ei of input) {
		if (ei.kind == "cell") {
			const eo = get_cell(cells_view, cell_size, ei.idx);
			for (const field of ["kind", "p.x", "p.y", "diameter", "pp.x", "pp.y"]) {
				let fi = ei;
				let fo = eo;
				for (const part of field.split(".")) {
					fi = fi[part];
					fo = fo[part];
				}
				if (fi == fo || Math.abs(fi - fo) < 0.000001) {
					// pass
				} else {
					console.error(field, fi, fo);
					errors.push(field, fi, fo);
				}
			}
		} else if (ei.kind == "link") {
			// pass
		} else {
			throw new Error(`invalid kind: ${ei.kind}`);
		}
	}
	if (errors.length) {
		for (let i = 0; i < world.cells_count() * miniciv.Cell.size(); i++) {
			try {
				console.log(
					i,
					cells_view.getUint32(i, true),
					cells_view.getFloat32(i, true),
				);
			} catch (error) {}
		}
	}
	console.log("world.links_count()", world.links_count());
	world.step();
	console.log("world.links_count()", world.links_count());
	const links_ptr = world.links();
	const link_size = miniciv.Link.size();
	const links_view = new DataView(
		memory.buffer,
		links_ptr,
		world.links_count() * link_size,
	);
	const errors_2 = [];
	for (const ei of input) {
		if (ei.kind == "link") {
			const eo = get_link(links_view, link_size, ei.idx);
			for (const field of ["kind", "caid", "cbid", "live"]) {
				let fi = ei;
				let fo = eo;
				for (const part of field.split(".")) {
					fi = fi[part];
					fo = fo[part];
				}
				if (fi == fo || Math.abs(fi - fo) < 0.000001) {
					// pass
				} else {
					console.error(field, fi, fo);
					errors_2.push(field, fi, fo);
				}
			}
		} else if (ei.kind == "cell") {
			// pass
		} else {
			throw new Error(`invalid kind: ${ei.kind}`);
		}
	}
	if (errors_2.length) {
		for (let i = 0; i < world.links_count() * miniciv.Link.size(); i++) {
			try {
				console.log(
					i,
					links_view.getUint32(i, true),
					links_view.getFloat32(i, true),
				);
			} catch (error) {}
		}
	}
	console.log("test - ok");
};
export { test };
