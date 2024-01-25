import { navigateTo } from "../router";
import { getAttributeOrThrow, getElementOrThrow } from "../utils/dom";

class ProjectCard extends HTMLElement {

    public constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    public connectedCallback(): void {
        this.validate()
        this.addEventListener('click', this.handleClick);
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

    private handleClick(): void {
        const pageKey = getAttributeOrThrow(this, 'page-name')
        const path = getAttributeOrThrow(this, "href");
        navigateTo(pageKey, path);

    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    div {
        position: relative;
    }

    slot[name="title"]::slotted(*){
        position: absolute;
        z-index: 1;
        max-width: 100%;
        background-color: white;
        color:;
        text-align: center;
    }

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

    ::slotted(img:hover) {
        filter: none;
    }

</style>
<figure>
<div>
    <slot name="title"></slot>
    <slot name="image"></slot>
    <slot name="caption"></slot>
</div>

</figure>
       `;
    }

}
customElements.define('project-card', ProjectCard);
