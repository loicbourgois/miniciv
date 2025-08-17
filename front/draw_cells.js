import { get_cell } from "./get_cell.js";
const draw_cells = (miniciv, world, memory, view) => {
	const cells_ptr = world.cells();
	const cell_size = miniciv.Cell.size();
	const cells_view = new DataView(
		memory.buffer,
		cells_ptr,
		world.cells_count() * cell_size,
	);
	let avg_diameter = 0.0;
	for (let i = 0; i < world.cells_count(); i++) {
		const cell = get_cell(cells_view, cell_size, i);
		avg_diameter += cell.diameter;
		view.draw_disk(cell.ap.x, cell.ap.y, cell.diameter, "#a80");
	}
	avg_diameter /= world.cells_count();
};
export { draw_cells };
