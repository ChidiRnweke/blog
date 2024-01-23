import { getElementOrThrow } from "../utils/dom";
export class SequentialSlider extends HTMLElement {

    private slotsArray!: Element[];
    private nextButton!: HTMLButtonElement;
    private prevButton!: HTMLButtonElement;
    private currentSlotIndex: number;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSlotIndex = 0;
        this.render();
    }

    connectedCallback(): void {
        this.initializeSlider();
        this.addEventListeners();
    }

    private initializeSlider() {
        this.slotsArray = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot').assignedElements();
        this.nextButton = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot[name=next-button]').assignedElements()[0] as HTMLButtonElement;
        this.prevButton = getElementOrThrow<HTMLSlotElement>(this.shadowRoot!, 'slot[name=previous-button]').assignedElements()[0] as HTMLButtonElement;
        this.updateState();
        this.slotsArray[0].classList.add('active');
        // Without setting the button as active it has display none. Hacky solution
        this.nextButton.classList.add('active');
        this.prevButton.classList.add('active')
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
<style>
    ::slotted(:not(.active)) {
        display: none;
    }


    ::slotted(.active) {
        display: block;
    }

    .navigation-buttons {
        display: flex;
        margin-top: 1vw;
        padding: 1rem 0rem;
        align-items: center;

    }

</style>
<slot></slot>
<div class="navigation-buttons">
    <slot name="previous-button"></slot>
    <slot name="next-button"></slot>
</div>

      `;

    }

    private addEventListeners(): void {
        this.nextButton.addEventListener('click', () => this.showNext());
        this.prevButton.addEventListener('click', () => this.showPrevious());

    }

    private showNext(): void {
        this.currentSlotIndex += 1;
        this.updateState();
    }

    private showPrevious(): void {
        this.currentSlotIndex -= 1;
        this.updateState();
    }

    private updateState(): void {

        this.slotsArray.forEach(slot => slot.classList.remove('active'));
        this.slotsArray[this.currentSlotIndex].classList.add('active');

        this.nextButton.disabled = this.currentSlotIndex === this.slotsArray.length - 1;
        this.prevButton.disabled = this.currentSlotIndex === 0;
    }
}

customElements.define('sequential-slider', SequentialSlider);
