import type { KupDom } from '../kup-manager/kup-manager-declarations';
import * as languagesJson from './languages.json';
import { KupComponent } from '../../types/GenericTypes';
import { KupDebugCategory } from '../kup-debug/kup-debug-declarations';
import {
    KupLanguageDefaults,
    KupLanguageJSON,
    KupLanguageKey,
} from './kup-language-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * Handles the translation to different languages.
 * @module KupLanguage
 */
export class KupLanguage {
    list: KupLanguageJSON;
    managedComponents: Set<KupComponent>;
    name: string;
    /**
     * Initializes KupLanguage.
     * @param {KupLanguageJSON} list - Overrides the default languages.json.
     * @param {string} name - Starting language.
     */
    constructor(list?: KupLanguageJSON, name?: string) {
        this.list = list ? list : languagesJson['default'];
        this.managedComponents = new Set();
        this.name = name ? name : KupLanguageDefaults.EN;
    }
    /**
     * Translates the string to the given language.
     * When translation fails, the key will be displayed in place of the string - this way it will be easier to correct missing string <-> key bounds.
     * @param {KupLanguageKey} key - Key of a string to be translated.
     * @param {string} language - Language to translate the string to. When not provided, KupLanguage current language will be used.
     * @returns {string} Translated string or initial string (when translation failed).
     */
    translate(key: KupLanguageKey, language?: string): string {
        const name: string = language ? language : this.name;
        try {
            const translatedString: string = this.list[name][key];
            if (translatedString) {
                return translatedString;
            } else {
                return invalidKey(key);
            }
        } catch (error) {
            return invalidKey(key);
        }
        function invalidKey(key: KupLanguageKey) {
            dom.ketchup.debug.logMessage(
                'kup-language',
                'Invalid translation for key (' + key + ')!',
                KupDebugCategory.WARNING
            );
            return key;
        }
    }
    /**
     * Changes the current Ketch.UP language to the one provided.
     * @param {string} language - The new language. If not present in this.list, this function will keep the previous language.
     */
    set(language: string): void {
        if (language && typeof language === 'string') {
            language = language.toLowerCase();
        } else {
            dom.ketchup.debug.logMessage(
                'kup-language',
                "Couldn't set language, invalid string received (" +
                    language +
                    ')!',
                KupDebugCategory.WARNING
            );
            return;
        }
        if (this.list[language]) {
            this.name = language;
        } else {
            dom.ketchup.debug.logMessage(
                'kup-language',
                'Language not found (' + language + ')!',
                KupDebugCategory.WARNING
            );
            return;
        }
        this.managedComponents.forEach(function (comp) {
            if (comp.isConnected) {
                comp.refresh();
            }
        });
        document.dispatchEvent(new CustomEvent('kupLanguageChange'));
    }
    /**
     * Gets the name of available languages.
     * @returns {Array<string>} Array of languages' names.
     */
    getLanguages(): Array<string> {
        const languages: Array<string> = [];
        for (var key in this.list) {
            if (this.list.hasOwnProperty(key)) {
                languages.push(key);
            }
        }
        return languages;
    }
    /**
     * Registers a KupComponent in KupLanguage, in order to be properly handled whenever the language changes.
     * @param {any} component - The component calling this function.
     */
    register(component: any): void {
        this.managedComponents.add(component.rootElement);
    }
    /**
     * Unregisters a KupComponent, so it won't be handled when the theme changes.
     *
     * @param {any} component - The component calling this function.
     */
    unregister(component: any): void {
        if (this.managedComponents) {
            this.managedComponents.delete(component.rootElement);
        }
    }
}
