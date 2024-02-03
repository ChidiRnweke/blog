import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export const endNoteParser = async (text: Document): Promise<Document> => {
    const links = text.querySelectorAll('a');
    const referenceList = text.createElement('ol');
    const divider = text.createElement('hr');

    const referenceTitle = text.createElement('h2');
    referenceTitle.textContent = "References";

    for (const [index, element] of links.entries()) {
        const [endNote, title] = await createEndNote(element, index, text);
        element.outerHTML = endNote.outerHTML;
        referenceList.appendChild(title);
    }

    text.body.appendChild(divider)
    text.body.appendChild(referenceTitle);
    text.body.appendChild(referenceList);
    return text;
}

const createEndNote = async (anchor: HTMLAnchorElement, position: number, doc: Document): Promise<[HTMLElement, HTMLLIElement]> => {

    const endNote = doc.createElement("end-note");

    const text = doc.createElement('span');
    text.textContent = anchor.textContent;
    text.setAttribute('slot', 'text');


    const link = doc.createElement('a');
    link.textContent = ` [${position}.]`;
    link.href = `#end-note-${position}`;
    link.setAttribute('slot', 'link');

    endNote.appendChild(text)
    endNote.appendChild(link)


    const pageTitle = await getDocumentTitle(anchor.href);
    const title = doc.createElement('li');
    title.id = `end-note-${position}`;
    const titleLink = doc.createElement('a');
    titleLink.textContent = pageTitle;
    titleLink.href = anchor.href;
    title.appendChild(titleLink);

    return [endNote, title]
}

const getDocumentTitle = async (url: string) => {
    try {
        const response = await fetch(url);
        const body = await response.text();
        const html = new JSDOM(body);
        return html.window.document.title;
    } catch (error) {
        const errorBody = await error.response.text();

        console.error("Error fetching document title:", errorBody);
        return "Title unavailable 🥹";
    }
};