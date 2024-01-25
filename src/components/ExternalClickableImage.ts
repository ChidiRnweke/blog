import { getAttributeOrThrow } from "../utils/dom";

class ExternalClickableImage extends HTMLElement {
    public link!: string;
    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    :host {
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    :host:hover {
        transform: scale(1.05);

    }

</style>
<slot name="image"></slot>
       `;
    }
    public connectedCallback(): void {
        this.addEventListeners();
        this.link = getAttributeOrThrow(this, "href")

    }

    private addEventListeners(): void {
        this.addEventListener('click', (e: MouseEvent) => this.handleLinkClick(e));
    }

    private handleLinkClick(_event: MouseEvent): void {
        window.location.href = this.link;
    }

}
customElements.define('external-clickable-image', ExternalClickableImage);

