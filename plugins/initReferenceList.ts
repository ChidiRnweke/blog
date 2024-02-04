
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const __dirname = process.cwd();

const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: ts-node referenceList.ts <filePath>');
    process.exit(1);
}

export const getDocumentTitle = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching document title: ${response.statusText}`);
            return "Title unavailable 🥹";
        }
        const body = await response.text();
        const match = body.match(/<title>(.*?)<\/title>/is);
        if (match && match[1]) {
            return match[1].trim();
        } else {
            return "Title unavailable 🥹";
        }
    } catch (error) {
        console.error("Error fetching document title:", error.message || error);
        return "Title unavailable 🥹";
    }
};


function findLinks(markdown: string) {
    const regex = /\[[^\]]*\]\(([^)]+)\)/g;
    const matches = Array.from(markdown.matchAll(regex));

    if (matches.length === 0) {
        throw new Error('Found no link. Are you sure the regex matched?');
    }
    return matches;
}

export const MakeReferenceList = async (filePath: string): Promise<void> => {
    const readPath = path.resolve(__dirname, filePath);
    const writeFileName = path.basename(readPath).replace(/\.[^/.]+$/, ".json")
    const writePath = path.join(path.dirname(readPath), "references", writeFileName)

    const markdown = fs.readFileSync(readPath, 'utf-8');
    const matches = findLinks(markdown);
    const links = matches.map(async (match, index) => {
        const url = match[1];
        const title = await getDocumentTitle(url);
        return { number: index + 1, title };
    });

    const dir = path.dirname(writePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const foo = await Promise.all(links);
    fs.writeFileSync(writePath, JSON.stringify(foo, null, 2));
}

MakeReferenceList(filePath);



