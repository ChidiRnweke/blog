import { navigateTo } from "../router";
import { getAttributeOrThrow } from "../utils/dom";

class PageLink extends HTMLElement {

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = '<slot></slot>'
    }

    public connectedCallback(): void {
        this.addEventListener('click', this.handleClick);
    }

    private handleClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        const pageKey = getAttributeOrThrow(target, 'page-name')
        const path = getAttributeOrThrow(target, 'href');
        navigateTo(pageKey, path);
    }
}
customElements.define('page-link', PageLink);

