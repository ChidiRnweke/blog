class EndNote extends HTMLElement {

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();

    }
    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
                <slot name="text"></slot><slot name="link"></slot>
            `
    };
}

customElements.define('end-note', EndNote);

