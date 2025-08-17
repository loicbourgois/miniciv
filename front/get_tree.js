const get_tree = (view, size, idx) => {
	return {
		kind: "tree",
		cell_id: view.getUint32(idx * size + 0, true),
	};
};
export { get_tree };
