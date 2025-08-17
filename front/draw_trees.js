import { get_tree } from "./get_tree.js";
import { get_cell } from "./get_cell.js";
const draw_trees = (miniciv, world, memory, view) => {
	const cells_ptr = world.cells();
	const cell_size = miniciv.Cell.size();
	const cells_view = new DataView(
		memory.buffer,
		cells_ptr,
		world.cells_count() * cell_size,
	);
	const trees_ptr = world.trees();
	const size = miniciv.Tree.size();
	const tree_view = new DataView(
		memory.buffer,
		trees_ptr,
		world.trees_count() * size,
	);
	for (let i = 0; i < world.trees_count(); i++) {
		const tree = get_tree(tree_view, size, i);
		const cell = get_cell(cells_view, cell_size, tree.cell_id);
		const colors = ["#000", "#000"];
		const colors_2 = ["#dd0", "#0d0"];
		const shapes = [
			[0.0, 0.0, 0],
			[0.0, 0.3, 0],
			[0.0, 0.6, 0],
			[0.0, 0.9, 0],
			[0.0, 1.2, 1],
			[0.2, 1.1, 1],
			[-0.2, 1.1, 1],
			[0.2, 1.3, 1],
			[-0.2, 1.3, 1],
		];
		for (const x of shapes) {
			view.draw_disk(
				cell.ap.x + x[0],
				cell.ap.y + x[1],
				cell.diameter * 0.55,
				colors[x[2]],
			);
		}
		for (const x of shapes) {
			view.draw_disk(
				cell.ap.x + x[0],
				cell.ap.y + x[1],
				cell.diameter * 0.5,
				colors_2[x[2]],
			);
		}
	}
};
export { draw_trees };
