import type { KupDebug } from '../kup-debug/kup-debug';
import type { KupDialog } from '../kup-dialog/kup-dialog';
import type { KupDynamicPosition } from '../kup-dynamic-position/kup-dynamic-position';
import type { KupLanguage } from '../kup-language/kup-language';
import type { KupLanguageJSON } from '../kup-language/kup-language-declarations';
import type { KupObjects } from '../kup-objects/kup-objects';
import type { KupObjectsJSON } from '../kup-objects/kup-objects-declarations';
import type { KupScrollOnHover } from '../kup-scroll-on-hover/kup-scroll-on-hover';
import type { KupTheme } from '../kup-theme/kup-theme';
import type { KupThemeJSON } from '../kup-theme/kup-theme-declarations';
import type { KupToolbar } from '../kup-toolbar/kup-toolbar';
import type { ResizeObserver } from 'resize-observer';
/**
 * Interface used to define the HTML element with Ketch.UP specific properties.
 */
export interface KupDom extends HTMLHtmlElement {
    ketchup: KupManager;
    ketchupInit: KupManagerInitialization;
}
/**
 * Interface for the KupManager class
 */
export interface KupManager {
    debug: KupDebug;
    dialog: KupDialog;
    dynamicPosition: KupDynamicPosition;
    language: KupLanguage;
    magicBox: HTMLKupMagicBoxElement;
    objects: KupObjects;
    overrides?: KupManagerInitialization;
    resize: ResizeObserver;
    scrollOnHover: KupScrollOnHover;
    theme: KupTheme;
    toolbar: KupToolbar;
    utilities: KupManagerUtilities;
    showMagicBox: () => void;
    hideMagicBox: () => void;
    toggleMagicBox: () => void;
}
/**
 * Interface for the KupManager utilities.
 */
export interface KupManagerUtilities {
    lastMouseDownPath: EventTarget[];
}

/**
 * Interface for the KupManager override settings.
 */
export interface KupManagerInitialization {
    debug?: KupManagerDebugSettings;
    dialog?: KupManagerDialogSettings;
    language?: KupManagerLanguageSettings;
    obj?: KupManagerObjectsSettings;
    scrollOnHover?: KupManagerScrollOnHoverSettings;
    theme?: KupManagerThemeSettings;
}
/**
 * KupDebug initialization settings.
 */
export interface KupManagerDebugSettings {
    active?: boolean;
    autoPrint?: boolean;
    logLimit?: number;
}
/**
 * KupDialog initialization settings.
 */
export interface KupManagerDialogSettings {
    zIndex?: number;
}
/**
 * KupLanguage initialization settings.
 */
export interface KupManagerLanguageSettings {
    list?: KupLanguageJSON;
    name?: string;
}
/**
 * KupObjects initialization settings.
 */
export interface KupManagerObjectsSettings {
    list?: KupObjectsJSON;
}
/**
 * KupScrollOnHover initialization settings.
 */
export interface KupManagerScrollOnHoverSettings {
    delay?: number;
    step?: number;
}
/**
 * KupTheme initialization settings.
 */
export interface KupManagerThemeSettings {
    list?: KupThemeJSON;
    name?: string;
}
