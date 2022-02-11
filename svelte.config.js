import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter: adapter({
		// 	// if true, will split your app into multiple functions
		// 	// instead of creating a single one for the entire app
		// 	split: false
		// }),

		adapter: adapter(),

		// deprecated?
		// hydrate the <div id="svelte"> element in src/app.html
		// target: '#svelte',
		vite: {
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: '@use "src/variables.scss" as *;'
					}
				}
			}
		}
	},

	preprocess: [
		preprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;'
			}
		})
	]
};

export default config;
