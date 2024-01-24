import { navigateTo } from "../router";
import { getAttributeOrThrow } from "../utils/dom";

class NavBar extends HTMLElement {
    private navItems!: NodeListOf<HTMLAnchorElement>;

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    public connectedCallback(): void {
        this.initializeNav();
        this.addEventListeners();
    }

    private initializeNav() {
        this.navItems = this.querySelectorAll('a');

        if (this.navItems.length == 0) {
            throw Error("Each nav card must have at least one anchor element.")
        }

        this.navItems[0].classList.add('active');
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    :host {
        display: grid;
        gap: 1rem;
        max-width: 100%;
        padding: 2rem;
        place-items: center;
        grid-template-columns: repeat(auto-fill, minmax(1rem, 1fr));

    }

    ::slotted(a.active) {
        font-weight: bold;
    }

</style>
<slot></slot>
       `;
    }

    private addEventListeners(): void {
        this.addEventListener('click', this.handleNavClick);
    }

    private handleNavClick(event: MouseEvent): void {
        const target = event.target as HTMLAnchorElement;
        if (target.tagName === 'A') {
            event.preventDefault();
            const pageKey = getAttributeOrThrow(target, 'page-name')
            const path = getAttributeOrThrow(target, 'href');
            this.setActiveItem(target);
            navigateTo(pageKey, path);
        }
    }

    private setActiveItem(newActiveItem: HTMLAnchorElement): void {
        this.navItems.forEach(item => item.classList.remove('active'));
        newActiveItem.classList.add('active');
    }
}

customElements.define('nav-bar', NavBar);

