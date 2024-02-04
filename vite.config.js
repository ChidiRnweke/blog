import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import markdownit from 'markdown-it';
import { mkdir, writeFile } from 'fs/promises';
import hljs from 'highlight.js'
import { JSDOM } from 'jsdom';
import { endNoteParser as endNoteTransformer } from './plugins/endNoteParser';


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

const injectContentIntoTemplate = (template, placeholderId, content) => {
    const placeholder = `<template id="${placeholderId}"></template>`;
    return template.replace(placeholder, content);
};

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

            await Promise.all(files.map(async (file) => {
                const markdown = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
                const refPath = path.join(sourceDir, "references", file.replace(/\.md$/, '.json'))
                const blogHTML = md.render(markdown);
                const blogDOM = new JSDOM(blogHTML);

                if (fs.existsSync(refPath)) {
                    const refJSON = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
                    const ref = refJSON.map((entry) => entry.title);
                    endNoteTransformer(blogDOM.window.document, ref);
                }

                const finalHtml = injectContentIntoTemplate(template, "main", blogDOM.serialize());
                const htmlFileName = file.replace(/\.md$/, '.html');
                await writeFile(path.join(destDir, htmlFileName), finalHtml);
            }));
        }
    };
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
                    const refPath = path.join(sourceDir, "references", fileName.replace(/\.md$/, '.json'))

                    const markdown = fs.readFileSync(file, 'utf-8');
                    const blogHTML = md.render(markdown)
                    const blogDOM = new JSDOM(blogHTML);

                    if (fs.existsSync(refPath)) {
                        const refJSON = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
                        const ref = refJSON.map((entry) => entry.title);
                        endNoteTransformer(blogDOM.window.document, ref);
                    }

                    const finalHtml = injectContentIntoTemplate(template, "main", blogHTML);

                    const htmlFileName = fileName.replace(/\.md$/, '.html');
                    await writeFile(path.join(destDir, htmlFileName), finalHtml);

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


