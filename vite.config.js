import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const htmlInjectPlugin = {
    name: 'html-inject',
    transformIndexHtml: {
        order: 'pre',
        handler(html) {
            const head = fs.readFileSync(path.resolve(__dirname, 'src/templates/head.html'), 'utf-8');
            const header = fs.readFileSync(path.resolve(__dirname, 'src/templates/header.html'), 'utf-8');
            const footer = fs.readFileSync(path.resolve(__dirname, 'src/templates/footer.html'), 'utf-8');
            return html
                .replace('<!--head-->', head)
                .replace('<!--header-->', header)
                .replace('<!--footer-->', footer);
        }
    }
};

export default defineConfig({
    plugins: [{ ...htmlInjectPlugin, enforce: 'post' }],
    base: "/blog/"
});


