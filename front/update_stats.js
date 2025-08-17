const update_stats = (world, avg_diameter) => {
	document.getElementById("stats_inner").value = JSON.stringify(
		{
			update_cells_01: (
				Number(world.step_durations_avg.update_cells_01) * 0.000001
			).toFixed(2),
			update_cells_02: (
				Number(world.step_durations_avg.update_cells_02) * 0.000001
			).toFixed(2),
			update_cells_03: (
				Number(world.step_durations_avg.update_cells_03) * 0.000001
			).toFixed(2),
			links_count: world.links_count(),
			cells_count: world.cells_count(),
			avg_diameter: avg_diameter.toFixed(4),
		},
		null,
		2,
	);
};
export { update_stats };
