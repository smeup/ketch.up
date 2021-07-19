import type { KupDom } from '../kup-manager/kup-manager-declarations';
import { KupToolbarModifierKeys } from './kup-toolbar-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * Handles component's toolbar.
 * @module KupToolbar
 */
export class KupToolbar {
    active: boolean;
    modifiers: KupToolbarModifierKeys[];
    managedElements: Set<HTMLElement>;
    #keyEvent: (this: Document, ev: KeyboardEvent) => void;
    /**
     * Initializes KupToolbar.
     */
    constructor() {
        this.active = false;
        this.managedElements = new Set();
        this.modifiers = [
            KupToolbarModifierKeys.ALT,
            KupToolbarModifierKeys.CTRL,
        ];
        this.#keyEvent = function (e: KeyboardEvent) {
            const toolbar: KupToolbar = dom.ketchup.toolbar;
            if (toolbar.managedElements) {
                for (let index = 0; index < toolbar.modifiers.length; index++) {
                    if (
                        toolbar.modifiers[index] ===
                            KupToolbarModifierKeys.CTRL &&
                        e.metaKey
                    ) {
                        continue;
                    } else {
                        if (!e[toolbar.modifiers[index]]) {
                            {
                                if (toolbar.active) {
                                    toolbar.hide();
                                }
                                return;
                            }
                        }
                    }
                }
                toolbar.show();
            }
        };
        document.addEventListener('keydown', this.#keyEvent);
        document.addEventListener('keyup', this.#keyEvent);
    }
    /**
     * Shows components' toolbar.
     */
    show(): void {
        this.managedElements.forEach(function (comp) {
            if (comp.isConnected) {
                comp.setAttribute('kup-toolbar', '');
            }
        });
        this.active = true;
    }
    /**
     * Hides components' toolbar.
     */
    hide(): void {
        this.managedElements.forEach(function (comp) {
            if (comp.isConnected) {
                comp.removeAttribute('kup-toolbar');
            }
        });
        this.active = false;
    }
    /**
     * Watches the element eligible to move when dragging.
     * @param {HTMLElement} el - Toolbar-supporting element.
     */
    register(el: HTMLElement): void {
        this.managedElements.add(el);
    }
    /**
     * Removes the elements from the KupToolbar class watchlist.
     * @param {HTMLElement[]} elements - Elements to remove.
     */
    unregister(elements: HTMLElement[]): void {
        if (this.managedElements) {
            for (let index = 0; index < elements.length; index++) {
                this.managedElements.delete(elements[index]);
            }
        }
    }
    /**
     * Returns whether an element was previously registered or not.
     * @param {HTMLElement} el - Element to test.
     * @returns {boolean} True if the element was registered.
     */
    isRegistered(el: HTMLElement): boolean {
        return !this.managedElements ? false : this.managedElements.has(el);
    }
}
