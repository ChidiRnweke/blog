import fs from 'fs';
import path from 'path';
import markdownit from 'markdown-it';
import { mkdir, writeFile } from 'fs/promises';
import hljs from 'highlight.js'
import { JSDOM } from 'jsdom';
import { endNoteParser as endNoteTransformer } from './endNoteParser';
import markdownItAnchor from 'markdown-it-anchor';
import headerSections from './markdown-it-header-sections';
const __dirname = process.cwd()

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
})

md.use(markdownItAnchor, { level: [1, 2, 3] })
md.use(headerSections);


const injectContentIntoTemplate = (template, placeholderId, content) => {
    const placeholder = `<template id="${placeholderId}"></template>`;
    return template.replace(placeholder, content);
};

async function processMarkdownFiles(sourceDir, destDir, template) {
    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.md'));

    await Promise.all(files.map(async (file) => {
        const markdown = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
        const blogHTML = md.render(markdown);
        const blogDOM = new JSDOM(blogHTML);

        const refPath = path.join(sourceDir, "references", file.replace(/\.md$/, '.json'))
        if (fs.existsSync(refPath)) {
            const refJSON = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
            endNoteTransformer(blogDOM.window.document, refJSON.map(entry => entry.title));
        }
        const finalHtml = injectContentIntoTemplate(template, "main", blogDOM.window.document.body.innerHTML);
        const htmlFileName = file.replace(/\.md$/, '.html');
        await writeFile(path.join(destDir, htmlFileName), finalHtml);
    }));
}

export const markdownToHtmlPlugin = () => {
    const processMarkdown = async () => {
        const sourceDir = path.resolve(__dirname, 'src/articles');
        const destDir = path.resolve(__dirname, 'articles');
        const template = fs.readFileSync(path.resolve(__dirname, 'src/templates/blogTemplate.html'), 'utf-8');

        await mkdir(destDir, { recursive: true });
        await processMarkdownFiles(sourceDir, destDir, template);
    };

    return {
        name: 'markdown-to-html',
        apply(config, { command }) {
            if (command === 'build') {
                return 'build';
            } else if (command === 'serve') {
                return 'serve';
            }
        },
        buildStart: processMarkdown,
        async handleHotUpdate({ file, server }) {
            if (file.endsWith('.md')) {
                const sourceDir = path.resolve(__dirname, 'src/articles');

                if (file.startsWith(sourceDir)) {
                    await processMarkdown();

                    server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    });
                }
                return [];
            }
        }
    };
};

export const htmlInjectPlugin = {
    name: 'html-inject',
    transformIndexHtml: {
        order: 'pre',
        handler(html) {
            const head = fs.readFileSync(path.resolve(__dirname, 'src/templates/head.html'), 'utf-8');
            const header = fs.readFileSync(path.resolve(__dirname, 'src/templates/header.html'), 'utf-8');
            const footer = fs.readFileSync(path.resolve(__dirname, 'src/templates/footer.html'), 'utf-8');
            html = injectContentIntoTemplate(html, "head", head)
            html = injectContentIntoTemplate(html, "header", header)
            html = injectContentIntoTemplate(html, "footer", footer)
            return html
        }
    }
};