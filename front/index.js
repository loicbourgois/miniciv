import init, * as miniciv from "./miniciv.js";
import { test } from "./test.js";
import { View } from "./view.js";
import { draw_links } from "./draw_links.js";
import { draw_cells } from "./draw_cells.js";
import { draw_trees } from "./draw_trees.js";
import { update_stats } from "./update_stats.js";
const draw = (view, world, memory) => {
	view.set_backgound("#333");
	draw_cells(miniciv, world, memory, view);
	draw_trees(miniciv, world, memory, view);
	let avg_diameter = 0;
	// draw_links(miniciv, world, memory, view);
	update_stats(world, avg_diameter);
	// if (world.get_cell_diameter(353) < 10) {
	// 	console.log(world.get_cell_diameter(353));
	// 	world.set_cell_diameter(353, world.get_cell_diameter(353) * 1.005);
	// }
	requestAnimationFrame(() => {
		world.step();
		world.step();
		world.step();
		draw(view, world, memory);
	});
};

const update_config = (world) => {
	const config = JSON.parse(document.getElementById("config").value);
	world.set_gravity(config.gravity);
	world.set_crdv(config.crdv);
	world.set_crdp(config.crdp);
	world.set_rdv(config.rdv);
	world.set_rdp(config.rdp);
	world.set_spring(config.spring);
};

const main = async () => {
	document.getElementById("config").value = JSON.stringify(
		{
			gravity: 0.0001,
			crdv: 0.0001,
			crdp: 0.0001,
			rdv: -0.002,
			rdp: 0.2,
			spring: 0.1,
		},
		null,
		2,
	);
	await init();
	miniciv.setup();
	const memory = miniciv.initSync().memory;
	test(miniciv, memory);
	const world = miniciv.World.new();
	const height = 25;
	const ratio = 0.86;
	const width = parseInt(height / ratio);
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let y_;
			if (x % 2) {
				y_ = y - 0.25;
			} else {
				y_ = y + 0.25;
			}
			if (y == height - 1 && (x + 1) % 2) {
			} else {
				world.add_cell(
					x * ratio - (width - 1) * 0.5 * ratio,
					y_ - (height - 1.5) * 0.5,
				);
			}
		}
	}
	world.add_tree(2, 2);
	world.add_tree(3, 2);
	world.add_tree(4, 2);
	world.add_tree(4, 4);
	// const x = parseInt(width * 0.5);
	// const y = parseInt(height * 0.15);
	// const idx = x * height + y;
	// world.set_cell_diameter(idx, 1.5);
	// console.log(idx);
	const view = new View("canvas");
	view.set_backgound("#333");
	window.addEventListener("resize", function () {
		view.resize();
	});
	document.addEventListener("click", (event) => {
		const x = event.clientX;
		const y = event.clientY;
		view.set_mouse(x, y);
	});
	document.addEventListener("mousemove", (e) => {
		const x = e.offsetX;
		const y = e.offsetY;
		view.set_mouse(x, y);
	});
	document
		.getElementById("update_config")
		.addEventListener("click", () => update_config(world));
	update_config(world);
	draw(view, world, memory);
};
window.onload = () => {
	main();
};
