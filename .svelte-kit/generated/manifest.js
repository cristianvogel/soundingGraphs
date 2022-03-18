const c = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/more.sonificationTutorial.svelte"),
	() => import("../../src/routes/recentProjects.svelte"),
	() => import("../../src/routes/documentation.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/more.sonificationTutorial.svelte
	[/^\/more\.sonificationTutorial\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/recentProjects.svelte
	[/^\/recentProjects\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/documentation.svelte
	[/^\/documentation\/?$/, [c[0], c[5]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];