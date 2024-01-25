import { getAttributeOrThrow } from "../utils/dom";

class ExternalClickableImage extends HTMLElement {
    public link!: string;
    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = '<slot name="image"></slot>';
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

