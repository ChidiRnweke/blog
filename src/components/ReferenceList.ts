import { getElementOrThrow } from "../utils/dom";

class CollapsableReferenceList extends HTMLElement {
    private button!: HTMLButtonElement;
    private referenceList!: any;
    private isOpen = false;

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    public connectedCallback(): void {
        this.button = getElementOrThrow(this.shadowRoot!, 'button');
        this.referenceList = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot[name="reference-section"]').assignedElements()[0];
        this.button.addEventListener('click', () => this.toggleList());
        this.updateButton();
    }

    private toggleList(): void {
        this.isOpen = !this.isOpen;
        this.updateButton();
        this.referenceList.classList.toggle('ref-active', this.isOpen);
        if (this.isOpen) {
            this.referenceList.style.maxHeight = `${this.referenceList.scrollHeight}px`;
        } else {
            this.referenceList.style.maxHeight = '0';
        }
    }

    private updateButton(): void {
        this.button.textContent = this.isOpen ? 'Hide references' : 'Show references';
        const afterContent = this.isOpen ? '"-"' : '"+"';
        this.shadowRoot!.querySelector('style')!.textContent += `
            button::after { content: ${afterContent}; }
        `;
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`

<style>
    button {
        background-color: var(--background-alt);
        border-radius: 5px;
        cursor: pointer;
        padding: 1rem;
        width: 100%;
        border: 1px solid var(--subtle-color, #ccc);
        text-align: left;
        outline: none;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background-color 0.3 ease;
        color: var(--text-color)
    }
    
    button:hover {
        color: var(--accent-color);
        font-size: 1.1rem;
    }

    button::after {
        font-size: 1.2rem;
        color: var(--text-color);
        transition: transform 0.3s ease;
    }
    
    ::slotted(.ref-active)::after {
        transform: rotate(180deg);
    }

    ::slotted(section) {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }
</style>
        <button type="button">Show references</button>
        <slot name="reference-section"></slot>
        `;
    }
}

customElements.define('collapsable-reference-list', CollapsableReferenceList);
