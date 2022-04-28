import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			build: {
					target: [ 'es2020' ]
				},
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: '@use "src/variables.scss" as *;'
					}
				}
			}
		},
		// prerender: {
		// 	concurrency: 1,
		// 	crawl: true,
		// 	default: true,
		// 	enabled: true,
		// 	entries: ['*'],
		// 	onError: 'fail'
		// },
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
