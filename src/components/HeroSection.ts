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
        min-height: 23rem;
        background-image: var(--background-image);
        background-size: cover;
        background-position: bottom;
        border-top-left-radius: 2rem;
        border-top-right-radius: 2rem;
        max-width: 100%;


    }

    ::slotted(img) {
        justify-self: center;
        min-height: 23rem;
        max-width: 100%;
        margin-bottom: -5rem;
        border-radius: 50%;
        box-shadow: 1rem 1rem 1rem rgba(0, 0, 0, 0.8);
    }

</style>
<slot name="image"></slot>
<slot name="title"></slot>
       `;
    }

}
customElements.define('hero-section', HeroSection);
