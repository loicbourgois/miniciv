const get_cell = (cells_view, cell_size, idx) => {
	const cell = {
		kind: "cell",
		idx: cells_view.getUint32(idx * cell_size + 8, true),
		p: {
			x: cells_view.getFloat32(idx * cell_size + 0, true),
			y: cells_view.getFloat32(idx * cell_size + 4, true),
		},
		pp: {
			x: cells_view.getFloat32(idx * cell_size + 8, true),
			y: cells_view.getFloat32(idx * cell_size + 12, true),
		},
		diameter: cells_view.getFloat32(idx * cell_size + 36, true),
	};
	cell.ap = {
		x: (cell.p.x + cell.pp.x) * 0.5,
		y: (cell.p.y + cell.pp.y) * 0.5,
	};
	return cell;
};
export { get_cell };
