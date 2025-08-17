import { get_link } from "./get_link.js";
import { get_cell } from "./get_cell.js";
const draw_links = (miniciv, world, memory, view) => {
	const cells_ptr = world.cells();
	const cell_size = miniciv.Cell.size();
	const cells_view = new DataView(
		memory.buffer,
		cells_ptr,
		world.cells_count() * cell_size,
	);
	const links_ptr = world.links();
	const link_size = miniciv.Link.size();
	const links_view = new DataView(
		memory.buffer,
		links_ptr,
		world.links_count() * link_size,
	);
	for (let i = 0; i < world.links_count(); i++) {
		const link = get_link(links_view, link_size, i);
		if (link.live == 7) {
			view.draw_line(
				get_cell(cells_view, cell_size, link.caid).ap,
				get_cell(cells_view, cell_size, link.cbid).ap,
				"#ff0",
				3,
			);
		}
	}
};
export { draw_links };
