import { getElementOrThrow } from "../utils/dom";

interface Expander extends HTMLElement {
    expand: () => void;
}
class EndNote extends HTMLElement {
    referenceList!: Expander;

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        const referenceList = getElementOrThrow<Expander>(document, 'collapsable-reference-list');
        this.addEventListener('click', () => referenceList.expand())
    }


    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<slot name="text"></slot>
<slot name="link"></slot>
       `
    };
}

customElements.define('end-note', EndNote);

