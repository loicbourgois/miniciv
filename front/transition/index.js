import { View } from "../view.js";
import { draw_cell } from "../draw_cells.js";
const base_progress_speed = 0.01;
const tick = (view, world) => {
	for (const item of world.items) {
		if (item.progress > 1.0) {
			item.progress_speed = -base_progress_speed;
		} else if (item.progress < 0.0) {
			item.progress_speed = base_progress_speed;
		}
		item.progress += item.progress_speed;
		item.model_1 = {
			ap: {
				x:
					world.cells[item.cell_start].ap.x +
					(world.cells[item.cell_end].ap.x -
						world.cells[item.cell_start].ap.x) *
						item.progress *
						0.5,
				y:
					world.cells[item.cell_start].ap.y +
					(world.cells[item.cell_end].ap.y -
						world.cells[item.cell_start].ap.y) *
						item.progress *
						0.5,
			},
			diameter: Math.abs(1.0 - item.progress),
		};
		item.model_2 = {
			ap: {
				x:
					world.cells[item.cell_start].ap.x +
					(world.cells[item.cell_end].ap.x -
						world.cells[item.cell_start].ap.x) *
						(item.progress * 0.5 + 0.5),
				y:
					world.cells[item.cell_start].ap.y +
					(world.cells[item.cell_end].ap.y -
						world.cells[item.cell_start].ap.y) *
						(item.progress * 0.5 + 0.5),
			},
			diameter: Math.abs(item.progress),
		};
	}
	view.set_backgound("#333");
	for (const cell of world.cells) {
		draw_cell(view, cell, cell.color);
	}
	for (const item of world.items) {
		draw_cell(view, item.model_1, item.color);
		draw_cell(view, item.model_2, item.color);
	}
	requestAnimationFrame(() => {
		tick(view, world);
	});
};
const main = async () => {
	const world = {
		cells: [
			{
				ap: {
					x: 0.0,
					y: 0.0,
				},
				diameter: 1.0,
				color: "#cc0",
			},
			{
				ap: {
					x: 1.0,
					y: 0.0,
				},
				diameter: 1.0,
				color: "#cc0",
			},
			{
				ap: {
					x: 2.0,
					y: 0.0,
				},
				diameter: 1.0,
				color: "#cc0",
			},
			{
				ap: {
					x: 0.0,
					y: 1.0,
				},
				diameter: 1.0,
				color: "#cc0",
			},
		],
		items: [
			{
				cell_start: 0,
				cell_end: 1,
				progress: 0.0,
				progress_speed: base_progress_speed,
				color: "#ff0",
			},
			{
				cell_start: 1,
				cell_end: 2,
				progress: 0.0,
				progress_speed: base_progress_speed,
				color: "#ff0",
			},
			{
				cell_start: 3,
				cell_end: 0,
				progress: 0.0,
				progress_speed: base_progress_speed,
				color: "#ff0",
			},
		],
	};
	document.getElementById("config").value = JSON.stringify(
		{
			// gravity: 0.0001,
			// crdv: 0.0001,
			// crdp: 0.0001,
			// rdv: -0.002,
			// rdp: 0.2,
			// spring: 0.1,
		},
		null,
		2,
	);
	const view = new View("canvas");
	window.addEventListener("resize", function () {
		view.resize();
	});
	view.zoom *= 4;
	tick(view, world);
};
window.onload = () => {
	main();
};
