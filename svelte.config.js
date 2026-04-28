import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/fc-d3-practice' : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: BASE_PATH
    },
    prerender: {
      handleHttpError: 'warn'
    }
  }
};

export default config;
