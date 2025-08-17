const get_link = (view, size, idx) => {
	return {
		kind: "link",
		caid: view.getUint32(idx * size + 0, true),
		cbid: view.getUint32(idx * size + 4, true),
		live: view.getUint8(idx * size + 8, true),
	};
};
export { get_link };
