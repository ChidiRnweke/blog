class HeroSection extends HTMLElement {

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('src/components/css/hero-section.css');

        </style>
        <slot name="image"></slot>
        <slot name="title"></slot>
            `;
    }

}
customElements.define('hero-section', HeroSection);
