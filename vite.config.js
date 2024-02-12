import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { markdownToHtmlPlugin, htmlInjectPlugin } from './plugins/vite-markdown-plugin';

const pagesJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'pages.json'), 'utf-8'));

const pages = Object.fromEntries(
    Object.entries(pagesJSON).map(([key, value]) => [key, path.resolve(__dirname, value)])
);

export default defineConfig({
    test: { environment: 'happy-dom' },
    build: { rollupOptions: { input: pages } },
    plugins: [markdownToHtmlPlugin(), { ...htmlInjectPlugin, enforce: 'post' }],
    base: "/"
});


