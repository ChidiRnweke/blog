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
        console.log(imageSlot.assignedNodes());

        if (!hasImage) {
            throw Error('ProjectCard requires an "image" slot to be filled.');
        }

        if (!hasCaption) {
            throw Error('ProjectCard requires a "caption" slot to be filled.');
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
            @import url('src/components/css/project-card.css');

        </style>
        <figure>
            <slot name="image"></slot>
            <slot name="caption"></slot>
        </figure>
            `;
    }

}
customElements.define('project-card', ProjectCard);
