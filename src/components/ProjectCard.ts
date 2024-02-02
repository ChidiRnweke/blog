import { getElementOrThrow } from "../utils/dom";

class ProjectCard extends HTMLElement {

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    public connectedCallback(): void {
        this.validate()
    }

    private validate(): void {
        const imageSlot = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot[name=image]');
        const captionSlot = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot[name=caption]');

        const hasImage = imageSlot.assignedNodes({ flatten: true }).length > 0;
        const hasCaption = captionSlot.assignedNodes({ flatten: true }).length > 0;

        if (!hasImage) {
            throw new Error('ProjectCard requires an "image" slot to be filled.');
        }

        if (!hasCaption) {
            throw new Error('ProjectCard requires a "caption" slot to be filled.');
        }
    }


    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    slot[name="caption"]::slotted(*) {
        margin-top: 0;
    }

    ::slotted(img) {
        max-width: 100%;
        height: auto;
        display: block;
        filter: grayscale(100%);
        transition: filter 0.3s ease;
        margin-bottom: 0;
    }

    :hover ::slotted(img) {
        filter: none;
    }

</style>
<figure>
    <slot name="image"></slot>
    <slot name="caption"></slot>

</figure>
       `;
    }

}
customElements.define('project-card', ProjectCard);
