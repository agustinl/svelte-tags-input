import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	build: {
		lib: {
			entry: 'src/index.js',
			name: 'Tags',
			formats: ['es'],
			fileName: () => 'index.mjs',
		},
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				assetFileNames: 'tags.[ext]',
			},
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
	},
	resolve:
		process.env.VITEST
			? {
					conditions: ['browser'],
				}
			: undefined,
});
