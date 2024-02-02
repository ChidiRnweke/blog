import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import markdownit from 'markdown-it';
import { mkdir, writeFile } from 'fs/promises';
import hljs from 'highlight.js'


const md = markdownit({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return '';
    }
});
const markdownToHtmlPlugin = () => {
    return {
        name: 'markdown-to-html',
        apply: 'serve',
        async buildStart() {
            const sourceDir = path.resolve(__dirname, 'src/articles');
            const destDir = path.resolve(__dirname, 'articles');
            const template = fs.readFileSync(path.resolve(__dirname, 'src/templates/blogTemplate.html'), 'utf-8');

            await mkdir(destDir, { recursive: true });
            const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.md'));

            for (const file of files) {
                const src = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
                const html = template.replace('<!--main-->', md.render(src));

                const htmlFileName = file.replace(/\.md$/, '.html');
                await writeFile(path.join(destDir, htmlFileName), html);
            }
        },
        async handleHotUpdate({ file, server }) {
            if (file.endsWith('.md')) {
                const sourceDir = path.resolve(__dirname, 'src/articles');
                const destDir = path.resolve(__dirname, 'articles');
                const template = fs.readFileSync(path.resolve(__dirname, 'src/templates/blogTemplate.html'), 'utf-8');

                if (file.startsWith(sourceDir)) {
                    const fileName = path.basename(file);
                    const src = fs.readFileSync(file, 'utf-8');
                    const html = template.replace('<!--main-->', md.render(src));

                    const htmlFileName = fileName.replace(/\.md$/, '.html');
                    await writeFile(path.join(destDir, htmlFileName), html);

                    server.ws.send({
                        type: 'custom',
                        event: 'file-change',
                        data: { path: `/articles/${htmlFileName}` },
                    });
                }
                return [];
            }
        }
    };

}

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
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                recentArticles: path.resolve(__dirname, 'articles.html'),
                games: path.resolve(__dirname, 'games.html'),
                scala3py4: path.resolve(__dirname, 'articles/scala3py4.html'),
                vanillaWeb: path.resolve(__dirname, 'articles/vanillaWeb.html'),
                howYouShouldLearnAI: path.resolve(__dirname, 'articles/learningAI.html'),
                jetML: path.resolve(__dirname, 'articles/jetML.html'),
                dataEngineeringTrenches: path.resolve(__dirname, 'articles/dataEngineeringTrenches.html'),
            }
        }
    },
    plugins: [markdownToHtmlPlugin(), { ...htmlInjectPlugin, enforce: 'post' }],
    base: "/blog/"
});


