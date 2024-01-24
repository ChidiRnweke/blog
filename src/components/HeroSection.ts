class HeroSection extends HTMLElement {

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    :host {
        display: grid;
        align-items: end;
        min-width: 100%;
        background-image: var(--background-image);
        background-size: cover;
        background-position: bottom;
        border-top-left-radius: 2rem;
        border-top-right-radius: 2rem;
    }

    ::slotted(img) {
        justify-self: center;
        height: auto;
        margin-top: 2rem;
        max-width: 70%;
        margin-bottom: -3rem;
        border-radius: 50%;
        box-shadow: 1rem 1rem 1rem rgba(0, 0, 0, 0.8);
    }

</style>
<slot name="image"></slot>
       `;
    }

}
customElements.define('hero-section', HeroSection);
