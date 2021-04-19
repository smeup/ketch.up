import type {
    KupDom,
    KupManagerInitialization,
} from './kup-manager-declarations';
import type { ResizeObserverEntry } from 'resize-observer/lib/ResizeObserverEntry';
import type { ResizableKupComponent } from '../../types/GenericTypes';
import { KupDebug } from '../kup-debug/kup-debug';
import { KupTheme } from '../kup-theme/kup-theme';
import { ResizeObserver } from 'resize-observer';
import { DynamicPosition } from '../dynamic-position/dynamic-position';
import { ScrollOnHover } from '../scroll-on-hover/scroll-on-hover';
import { MoveOnDrag } from '../move-on-drag/move-on-drag';
import { KupToolbar } from '../kup-toolbar/kup-toolbar';
import { ResizeOnDrag } from '../resize-on-drag/resize-on-drag';

const dom: KupDom = document.documentElement as KupDom;

/**
 * This class controls every other Ketch.UP utility suite.
 * @module KupManager
 */
export class KupManager {
    debug: KupDebug = new KupDebug();
    dynamicPosition: DynamicPosition = new DynamicPosition();
    magicBox: HTMLKupMagicBoxElement = null;
    moveOnDrag: MoveOnDrag = new MoveOnDrag();
    overrides?: KupManagerInitialization = dom.ketchupInit
        ? dom.ketchupInit
        : null;
    resize: ResizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.contentRect.height && entry.contentRect.width) {
                    (entry.target as ResizableKupComponent).resizeCallback();
                    this.debug.logMessage(
                        'kup-manager (' +
                            entry.target.tagName +
                            '#' +
                            entry.target.id +
                            ')',
                        'Size changed to x: ' +
                            entry.contentRect.width +
                            ', y: ' +
                            entry.contentRect.height +
                            '.'
                    );
                }
            });
        }
    );
    resizeOnDrag: ResizeOnDrag = new ResizeOnDrag();
    scrollOnHover: ScrollOnHover = new ScrollOnHover();
    theme: KupTheme = new KupTheme();
    toolbar: KupToolbar = new KupToolbar();

    /**
     * Creates kup-magic-box component.
     */
    showMagicBox(): void {
        if (this.magicBox) {
            return;
        }
        this.magicBox = document.createElement('kup-magic-box');
        this.magicBox.id = 'kup-magic-box';
        this.magicBox.style.position = 'fixed';
        this.magicBox.style.left = 'calc(50% - 350px)';
        this.magicBox.style.top = 'calc(50% - 150px)';
        document.body.append(this.magicBox);
    }
    /**
     * Removes kup-magic-box component.
     */
    hideMagicBox(): void {
        if (!this.magicBox) {
            return;
        }
        this.magicBox.remove();
        this.magicBox = null;
    }
    /**
     * Creates or removes kup-magic-box component depending on its existence.
     */
    toggleMagicBox(): void {
        if (!this.magicBox) {
            this.showMagicBox();
        } else {
            this.hideMagicBox();
        }
    }
}
/**
 * Called by the Ketch.UP components to retrieve the instance of KupManager (or creating a new one when missing).
 * @returns {KupManager} KupManager instance.
 */
export function kupManagerInstance(): KupManager {
    if (!dom.ketchup) {
        dom.ketchup = new KupManager();
        dom.ketchup.theme.set();
        if (
            dom.ketchupInit &&
            dom.ketchupInit.debug &&
            dom.ketchupInit.debug.active
        ) {
            dom.ketchup.debug.showWidget();
        }
        document.dispatchEvent(new CustomEvent('kupManagerReady'));
    }
    return dom.ketchup;
}
