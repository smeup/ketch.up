import type {
    KupDom,
    KupManagerDebugSettings,
    KupManagerDialogSettings,
    KupManagerInitialization,
    KupManagerLanguageSettings,
    KupManagerObjectsSettings,
    KupManagerScrollOnHoverSettings,
    KupManagerThemeSettings,
    KupManagerUtilities,
} from './kup-manager-declarations';
import type { ResizableKupComponent } from '../../types/GenericTypes';
import type { ResizeObserverEntry } from 'resize-observer/lib/ResizeObserverEntry';
import { KupDebug } from '../kup-debug/kup-debug';
import { KupDialog } from '../kup-dialog/kup-dialog';
import { KupDynamicPosition } from '../kup-dynamic-position/kup-dynamic-position';
import { KupLanguage } from '../kup-language/kup-language';
import { KupObjects } from '../kup-objects/kup-objects';
import { KupScrollOnHover } from '../kup-scroll-on-hover/kup-scroll-on-hover';
import { KupTheme } from '../kup-theme/kup-theme';
import { KupToolbar } from '../kup-toolbar/kup-toolbar';
import { ResizeObserver } from 'resize-observer';
import { KupLanguageJSON } from '../kup-language/kup-language-declarations';
import { KupObjectsJSON } from '../kup-objects/kup-objects-declarations';
import { KupThemeJSON } from '../kup-theme/kup-theme-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * This class controls every other Ketch.UP utility suite.
 * @module KupManager
 */
export class KupManager {
    debug: KupDebug;
    dialog: KupDialog;
    dynamicPosition: KupDynamicPosition;
    language: KupLanguage;
    magicBox: HTMLKupMagicBoxElement;
    objects: KupObjects;
    overrides?: KupManagerInitialization;
    resize: ResizeObserver;
    scrollOnHover: KupScrollOnHover;
    utilities: KupManagerUtilities;
    theme: KupTheme;
    toolbar: KupToolbar;
    /**
     * Initializes KupManager.
     */
    constructor(overrides?: KupManagerInitialization) {
        let debugActive: boolean = null,
            debugAutoprint: boolean = null,
            debugLogLimit: number = null,
            dialogZIndex: number = null,
            languageList: KupLanguageJSON = null,
            languageName: string = null,
            objectsList: KupObjectsJSON = null,
            scrollOnHoverDelay: number = null,
            scrollOnHoverStep: number = null,
            themeList: KupThemeJSON = null,
            themeName: string = null;
        if (overrides) {
            const debug: KupManagerDebugSettings = overrides.debug;
            const dialog: KupManagerDialogSettings = overrides.dialog;
            const language: KupManagerLanguageSettings = overrides.language;
            const objects: KupManagerObjectsSettings = overrides.language;
            const scrollOnHover: KupManagerScrollOnHoverSettings =
                overrides.scrollOnHover;
            const theme: KupManagerThemeSettings = overrides.theme;
            if (debug) {
                debugActive = debug.active ? debug.active : null;
                debugAutoprint = debug.autoPrint ? debug.autoPrint : null;
                debugLogLimit = debug.logLimit ? debug.logLimit : null;
            }
            if (dialog) {
                dialogZIndex = dialog.zIndex ? dialog.zIndex : null;
            }
            if (language) {
                languageList = language.list ? language.list : null;
                languageName = language.name ? language.name : null;
            }
            if (objects) {
                objectsList = objects.list ? objects.list : null;
            }
            if (scrollOnHover) {
                scrollOnHoverDelay = scrollOnHover.delay
                    ? scrollOnHover.delay
                    : null;
                scrollOnHoverStep = scrollOnHover.step
                    ? scrollOnHover.step
                    : null;
            }
            if (theme) {
                themeList = theme.list ? theme.list : null;
                themeName = theme.name ? theme.name : null;
            }
        }
        this.debug = new KupDebug(debugActive, debugAutoprint, debugLogLimit);
        this.dialog = new KupDialog(dialogZIndex);
        this.dynamicPosition = new KupDynamicPosition();
        this.language = new KupLanguage(languageList, languageName);
        this.magicBox = null;
        this.overrides = overrides ? overrides : null;
        this.objects = new KupObjects(objectsList);
        this.resize = new ResizeObserver((entries: ResizeObserverEntry[]) => {
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
        });
        this.scrollOnHover = new KupScrollOnHover(
            scrollOnHoverDelay,
            scrollOnHoverStep
        );
        this.utilities = { lastMouseDownPath: null };
        this.theme = new KupTheme(themeList, themeName);
        this.toolbar = new KupToolbar();
        document.addEventListener('mousedown', (e) => {
            this.utilities.lastMouseDownPath = e.composedPath();
        });
    }
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
        const overrides: KupManagerInitialization = dom.ketchupInit
            ? dom.ketchupInit
            : null;
        dom.ketchup = new KupManager(overrides);
        dom.ketchup.theme.set();
        if (dom.ketchup.debug.active) {
            dom.ketchup.debug.toggle(dom.ketchup.debug.active);
        }
        document.dispatchEvent(new CustomEvent('kupManagerReady'));
    }
    return dom.ketchup;
}
