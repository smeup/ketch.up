import { KupDom } from '../kup-manager/kup-manager-declarations';
import {
    ScrollableElement,
    ScrollOnHoverDirection,
} from './scroll-on-hover-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * Lets the user scroll an element's overflow by hovering with the mouse on its left/right edge.
 * @module ScrollOnHover
 */
export class ScrollOnHover {
    #arrowsContainer: HTMLElement = null;
    #leftArrows: HTMLElement[] = [];
    #rightArrows: HTMLElement[] = [];
    #initialized: boolean = false;
    #scrollEvent = (event: Event) =>
        this.updateChildren(event.target as ScrollableElement);
    #mousemoveEvent = (event: MouseEvent) => this.start(event);
    #mouseleaveEvent = (event: MouseEvent) =>
        this.stop(event.target as ScrollableElement);
    #rAF: number = null;
    #timeout: ReturnType<typeof setTimeout> = null;
    delay: number =
        dom.ketchupInit &&
        dom.ketchupInit.scrollOnHover &&
        dom.ketchupInit.scrollOnHover.delay
            ? dom.ketchupInit.scrollOnHover.delay
            : 500;
    managedElements: Set<ScrollableElement> = null;
    step: number =
        dom.ketchupInit &&
        dom.ketchupInit.scrollOnHover &&
        dom.ketchupInit.scrollOnHover.step
            ? dom.ketchupInit.scrollOnHover.step
            : 50;
    /**
     * Initializes the class' elements.
     */
    initialize(): void {
        this.#arrowsContainer = document.createElement('div');
        this.#arrowsContainer.id = 'container-scrolling-arrow';
        for (let index = 1; index < 4; index++) {
            const arrow: HTMLElement = document.createElement('div');
            arrow.setAttribute('class', 'left-scrolling-arrow arrow-' + index);
            this.#leftArrows.push(arrow);
        }
        for (let index = 1; index < 4; index++) {
            const arrow: HTMLElement = document.createElement('div');
            arrow.setAttribute('class', 'right-scrolling-arrow arrow-' + index);
            this.#rightArrows.push(arrow);
        }
        this.#arrowsContainer.append(
            this.#leftArrows[2],
            this.#leftArrows[1],
            this.#leftArrows[0],
            this.#rightArrows[0],
            this.#rightArrows[1],
            this.#rightArrows[2]
        );
        document.body.append(this.#arrowsContainer);
        this.#initialized = true;
        this.managedElements = new Set();
    }
    /**
     * Watches the given element in order to trigger the scroll on hover when conditions are met.
     * Children nodes with the "hover-scrolling-child" will be watched and scrolled when el scrolls.
     * @param {ScrollableElement} el - Element to watch.
     */
    register(el: ScrollableElement): void {
        if (!this.#initialized) {
            this.initialize();
        }
        el.style.overflowX = 'auto';
        el.scrollOnHover = {
            active: false,
            children: el.querySelectorAll('.hover-scrolling-child'),
            rect: null,
            x: 0,
            y: 0,
        };
        if (el.scrollOnHover.children) {
            el.addEventListener('scroll', this.#scrollEvent);
        }
        el.addEventListener('mousemove', this.#mousemoveEvent);
        el.addEventListener('mouseleave', this.#mouseleaveEvent);
        this.managedElements.add(el);
    }
    /**
     * Removes the given element from ScrollOnHover watchlist.
     * @param {ScrollableElement} el - Element to unregister.
     */
    unregister(el: ScrollableElement): void {
        el.removeEventListener('scroll', this.#scrollEvent);
        el.removeEventListener('mousemove', this.#mousemoveEvent);
        el.removeEventListener('mouseleave', this.#mouseleaveEvent);
        this.managedElements.delete(el);
    }
    /**
     * Returns whether an element was previously registered or not.
     * @param {ScrollableElement} el - Element to test.
     * @returns {boolean} True if the element was registered.
     */
    isRegistered(el: ScrollableElement): boolean {
        return !this.managedElements ? false : this.managedElements.has(el);
    }
    /**
     * When called, this function prepares the class for the scrolling process.
     * @param {MouseEvent} event - The starter event, which should be a MouseMove event.
     */
    async start(event: MouseEvent): Promise<void> {
        const el: ScrollableElement = event.currentTarget as ScrollableElement;
        el.scrollOnHover.rect = el.getBoundingClientRect();
        el.scrollOnHover.x = event.clientX;
        el.scrollOnHover.y = event.clientY;
        this.#arrowsContainer.style.left = event.clientX + 'px';
        this.#arrowsContainer.style.top = event.clientY + 'px';
        if (el.scrollOnHover.active || this.#timeout) {
            return;
        }
        let trueWidth: number = el.clientWidth;
        if (trueWidth === 0) {
            trueWidth = el.offsetWidth;
        }
        if (el.scrollWidth > trueWidth + 10) {
            if (trueWidth !== 0 && !el.scrollOnHover.active) {
                const percRight: number = trueWidth - trueWidth * 0.1;
                const percLeft: number = trueWidth - trueWidth * 0.9;
                const elOffset: number =
                    el.scrollOnHover.x - el.scrollOnHover.rect.left;
                const maxScrollLeft: number = el.scrollWidth - trueWidth;
                const direction: ScrollOnHoverDirection =
                    elOffset < percLeft && el.scrollLeft !== 0
                        ? ScrollOnHoverDirection.LEFT
                        : elOffset > percRight &&
                          el.scrollLeft !== maxScrollLeft
                        ? ScrollOnHoverDirection.RIGHT
                        : null;
                if (direction) {
                    for (let i = 0; i < 3; i++) {
                        if (direction === ScrollOnHoverDirection.LEFT) {
                            this.#leftArrows[i].classList.add('activated');
                        } else {
                            this.#rightArrows[i].classList.add('activated');
                        }
                    }
                    this.#timeout = setTimeout(() => {
                        el.scrollOnHover.active = true;
                        this.#rAF = requestAnimationFrame(function () {
                            dom.ketchup.scrollOnHover.run(
                                el,
                                maxScrollLeft,
                                percRight,
                                percLeft,
                                direction
                            );
                        });
                    }, this.delay);
                }
            }
        }
    }
    /**
     * When called, this function stops the scrolling process.
     * @param {ScrollableElement} el - The scrolled element.
     */
    async stop(el: ScrollableElement): Promise<void> {
        el.scrollOnHover.active = false;
        cancelAnimationFrame(this.#rAF);
        clearTimeout(this.#timeout);
        this.#timeout = null;
        for (let i = 0; i < this.#leftArrows.length; i++) {
            this.#leftArrows[i].classList.remove('activated');
            this.#leftArrows[i].classList.remove('animated');
        }
        for (let i = 0; i < this.#rightArrows.length; i++) {
            this.#rightArrows[i].classList.remove('activated');
            this.#rightArrows[i].classList.remove('animated');
        }
    }
    /**
     * The actual recursive scroll function.
     * @param {ScrollableElement} el - The scrolled element.
     * @param {number} maxScrollLeft - Left coordinates to which the recursiveness must be stopped.
     * @param {number} percRight - Range of the right scrollable area.
     * @param {number} percLeft - Range of the left scrollable area.
     * @param {ScrollOnHoverDirection} direction - Direction of the scroll.
     */
    run(
        el: ScrollableElement,
        maxScrollLeft: number,
        percRight: number,
        percLeft: number,
        direction: ScrollOnHoverDirection
    ): void {
        if (!el.scrollOnHover.active) {
            this.stop(el);
            return;
        }
        const offset: number = el.scrollOnHover.x - el.scrollOnHover.rect.left;
        if (offset > percLeft && offset < percRight) {
            this.stop(el);
            return;
        }
        if (direction === ScrollOnHoverDirection.RIGHT && percRight > offset) {
            this.stop(el);
            return;
        }
        if (direction === ScrollOnHoverDirection.LEFT && percLeft < offset) {
            this.stop(el);
            return;
        }
        if (el.scrollOnHover.children) {
            this.updateChildren(el);
        }
        let arrow: HTMLElement[];
        if (direction === ScrollOnHoverDirection.LEFT) {
            arrow = this.#leftArrows;
            if (el.scrollLeft === 0) {
                this.stop(el);
                return;
            }
            el.scrollLeft -= this.step;
        } else {
            arrow = this.#rightArrows;
            if (el.scrollLeft === maxScrollLeft) {
                this.stop(el);
                return;
            }
            el.scrollLeft += this.step;
        }
        for (let i = 0; i < arrow.length; i++) {
            arrow[i].classList.add('animated');
        }

        this.#rAF = requestAnimationFrame(function () {
            dom.ketchup.scrollOnHover.run(
                el,
                maxScrollLeft,
                percRight,
                percLeft,
                direction
            );
        });
    }
    /**
     * Scrolls children of the element having the "hover-scrolling-child" class
     * @param {ScrollableElement} el - The scrolled element.
     */
    updateChildren(el: ScrollableElement): void {
        for (let i = 0; i < el.scrollOnHover.children.length; i++) {
            el.scrollOnHover.children[i].scrollLeft = el.scrollLeft;
        }
    }
}