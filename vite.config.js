import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import markdownit from 'markdown-it';
import { mkdir, writeFile } from 'fs/promises';
import hljs from 'highlight.js'
import { JSDOM } from 'jsdom';


const md = markdownit({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return '';
    }
});

const injectNode = (dom, selector, content) => {
    const target = dom.window.document.querySelector(selector);
    target.outerHTML = content;
}

const markdownToHtmlPlugin = () => {
    return {
        name: 'markdown-to-html',
        apply: 'build',
        async buildStart() {
            const sourceDir = path.resolve(__dirname, 'src/articles');
            const destDir = path.resolve(__dirname, 'articles');
            const template = fs.readFileSync(path.resolve(__dirname, 'src/templates/blogTemplate.html'), 'utf-8');

            await mkdir(destDir, { recursive: true });
            const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.md'));

            for (const file of files) {
                const src = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
                const html = new JSDOM(template)
                injectNode(html, "#main", md.render(src))
                const htmlFileName = file.replace(/\.md$/, '.html');
                await writeFile(path.join(destDir, htmlFileName), html.serialize());
            }
        }
    }
}

const markdownToHtmlPluginHMR = () => {
    return {
        name: 'markdown-to-html',
        apply: 'serve',
        async handleHotUpdate({ file, server }) {
            if (file.endsWith('.md')) {
                const sourceDir = path.resolve(__dirname, 'src/articles');
                const destDir = path.resolve(__dirname, 'articles');
                const template = fs.readFileSync(path.resolve(__dirname, 'src/templates/blogTemplate.html'), 'utf-8');

                if (file.startsWith(sourceDir)) {
                    const fileName = path.basename(file);
                    const src = fs.readFileSync(file, 'utf-8');
                    const html = new JSDOM(template)
                    injectNode(html, "#main", md.render(src))

                    const htmlFileName = fileName.replace(/\.md$/, '.html');
                    await writeFile(path.join(destDir, htmlFileName), html.serialize());

                    server.ws.send({
                        type: 'custom',
                        event: 'file-change',
                        data: { path: `/articles/${htmlFileName}` },
                    });
                }
                return [];
            }
        }
    }
}
const htmlInjectPlugin = {
    name: 'html-inject',
    transformIndexHtml: {
        order: 'pre',
        handler(html) {
            const dom = new JSDOM(html);
            const head = fs.readFileSync(path.resolve(__dirname, 'src/templates/head.html'), 'utf-8');
            const header = fs.readFileSync(path.resolve(__dirname, 'src/templates/header.html'), 'utf-8');
            const footer = fs.readFileSync(path.resolve(__dirname, 'src/templates/footer.html'), 'utf-8');
            injectNode(dom, "#head", head)
            injectNode(dom, "#header", header)
            injectNode(dom, "#footer", footer)
            return dom.serialize()
        }
    }
};

export default defineConfig({
    test: {
        environment: 'happy-dom',
    },
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
    plugins: [markdownToHtmlPlugin(), markdownToHtmlPluginHMR(), { ...htmlInjectPlugin, enforce: 'post' }],
    base: "/blog/"
});


