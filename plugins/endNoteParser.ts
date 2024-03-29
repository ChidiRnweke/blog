export const endNoteParser = (text: Document, titles: string[]): Document => {
    const links = Array.from(text.querySelectorAll('a'));
    const referenceList = text.createElement('ol');
    const divider = text.createElement('hr');

    const referenceTitle = text.createElement('h2');
    referenceTitle.textContent = "References";

    const endNotes = links.map((element, i) => createEndNote(element, i + 1, titles[i], text));

    endNotes.forEach(([endNote, title], index) => {
        links[index].replaceWith(endNote);
        referenceList.appendChild(title);
    });
    const references = createReferenceSection(text, divider, referenceTitle, referenceList);
    text.body.appendChild(references);
    return text;
}

const createEndNote = (anchor: HTMLAnchorElement, position: number, pageTitle: string, doc: Document): [HTMLElement, HTMLLIElement] => {

    const endNote = doc.createElement("end-note");

    const text = doc.createElement('span');
    text.textContent = anchor.textContent;
    text.setAttribute('slot', 'text');


    const link = doc.createElement('a');
    link.textContent = ` [${position}]`;
    link.href = `#end-note-${position}`;
    link.setAttribute('slot', 'link');
    link.className = "superscript"

    endNote.appendChild(text)
    endNote.appendChild(link)

    const title = doc.createElement('li');
    title.id = `end-note-${position}`;
    const titleLink = doc.createElement('a');
    titleLink.textContent = pageTitle;
    titleLink.href = anchor.href;
    title.appendChild(titleLink);

    return [endNote, title]
}
function createReferenceSection(text: Document, divider: HTMLHRElement, referenceTitle: HTMLHeadingElement, referenceList: HTMLOListElement) {
    const refListComponent = text.createElement('collapsable-reference-list');
    const references = text.createElement('section');
    references.id = 'references';
    references.slot = "reference-section"
    references.appendChild(divider);
    references.appendChild(referenceTitle);
    references.appendChild(referenceList);
    refListComponent.appendChild(references)
    return refListComponent;
}

