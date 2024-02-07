import { getElementOrThrow } from "../utils/dom";

class CollapsableReferenceList extends HTMLElement {
    private referenceList!: any;
    private isOpen = false;

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    public connectedCallback(): void {
        this.referenceList = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot[name="reference-section"]').assignedElements()[0];
        this.addEventListener('click', () => this.toggleList());
    }

    public expand() {
        if (!this.isOpen) {
            this.toggleList();
        }
    }

    private toggleList(): void {
        this.isOpen = !this.isOpen;
        this.referenceList.classList.toggle('ref-active', this.isOpen);
        if (this.isOpen) {
            this.referenceList.style.maxHeight = `${this.referenceList.scrollHeight}px`;
        } else {
            this.referenceList.style.maxHeight = '0';
        }
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`

<style>
    summary {
        background-color: var(--background-alt);
        border-radius: 5px;
        cursor: pointer;
        padding: 1rem;
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
    
    summary:hover {
        color: var(--accent-color);
        font-size: 1.1rem;
    }

    summary::after {
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
        <summary>Show references</summary>
        <slot name="reference-section"></slot>
        `;
    }
}

customElements.define('collapsable-reference-list', CollapsableReferenceList);
