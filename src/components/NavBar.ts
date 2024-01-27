class NavBar extends HTMLElement {
    private navItems!: NodeListOf<HTMLElement>;

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
        this.navItems = this.querySelectorAll('page-link');
        if (this.navItems.length == 0) {
            throw new Error("A nav card must have at least one link.")
        }

        this.navItems[0].classList.add('active');
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    :host {
        display: flex;
        flex-wrap:wrap;
        gap: 1rem;
        max-width: 100%;
        place-items: center;

    }

    ::slotted(page-link.active) {
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
        const target = event.target as HTMLElement;
        this.setActiveItem(target);
    }


    private setActiveItem(newActiveItem: HTMLElement): void {
        this.navItems.forEach(item => item.classList.remove('active'));
        newActiveItem.classList.add('active');
    }

}
customElements.define('nav-bar', NavBar);

