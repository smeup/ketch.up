import type { KupDom } from '../kup-manager/kup-manager-declarations';
import type { KupObj, KupObjectsJSON } from './kup-objects-declarations';
import * as objJson from './obj.json';

const dom: KupDom = document.documentElement as KupDom;

/**
 * Handles objects definition and validation.
 * @module KupObjects
 */
export class KupObjects {
    list: KupObjectsJSON;
    /**
     * Initializes KupObjects.
     * @param {KupObjectsJSON} list - Overrides the default obj.json.
     */
    constructor(list?: KupObjectsJSON) {
        this.list = list ? list : objJson['default'];
    }
    /**
     * Checks whether the object can automatically derive columns.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when columns can be automatically derived from the object.
     */
    canHaveAutomaticDerivedColumn(obj: KupObj): boolean {
        if (!this.canHaveExtraColumns(obj)) {
            return false;
        }
        return (
            !this.isNumber(obj) &&
            !this.isTime(obj) &&
            !this.isTimestamp(obj) &&
            !this.isPercentage(obj)
        );
    }
    /**
     * Checks whether the object can have extra columns or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object has extra columns.
     */
    canHaveExtraColumns(obj: KupObj): boolean {
        if (!obj) return false;
        if (
            !obj.t ||
            (obj.t as string).trim() == '' ||
            (obj.t as string).trim() == '**'
        ) {
            return false;
        }
        return (
            !this.isBar(obj) &&
            !this.isButton(obj) &&
            !this.isCheckbox(obj) &&
            !this.isIcon(obj) &&
            !this.isImage(obj) &&
            !this.isLink(obj) &&
            !this.isProgressBar(obj) &&
            !this.isRadio(obj) &&
            !this.isVoCodver(obj) &&
            !this.isChart(obj)
        );
    }
    /**
     * Checks whether the object can have a related tooltip or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object can have a related tooltip.
     */
    hasTooltip(obj: KupObj): boolean {
        if (!obj) return false;
        if (obj.t == null || (obj.t as string).trim() == '') return false;
        return (
            !this.isBar(obj) &&
            !this.isButton(obj) &&
            !this.isCheckbox(obj) &&
            !this.isIcon(obj) &&
            !this.isImage(obj) &&
            !this.isLink(obj) &&
            !this.isNumber(obj) &&
            !this.isPercentage(obj) &&
            !this.isProgressBar(obj) &&
            !this.isRadio(obj) &&
            !this.isVoCodver(obj) &&
            !this.isChart(obj)
        );
    }
    /**
     * Checks whether the object represents a bar or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a bar.
     */
    isBar(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && 'BAR' === obj.p;
    }
    /**
     * Checks whether the object represents a button or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a button.
     */
    isButton(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && 'BTN' === obj.p;
    }
    /**
     * Checks whether the object represents a chart or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a chart.
     */
    isChart(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && obj.p.toLocaleUpperCase().startsWith('GRA_');
    }
    /**
     * Checks whether the object represents a checkbox or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a checkbox.
     */
    isCheckbox(obj: KupObj): boolean {
        if (!obj) return false;
        return 'V2' === obj.t && 'SI/NO' === obj.p.toUpperCase();
    }
    /**
     * Checks whether the object represents a color or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a color.
     */
    isColor(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J1' === obj.t && 'COL' === obj.p;
    }
    /**
     * Checks whether the object represents a date or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a date.
     */
    isDate(obj: KupObj): boolean {
        if (!obj) return false;
        return 'D8' === obj.t;
    }
    /**
     * Checks whether the object represents an icon or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is an icon.
     */
    isIcon(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && 'ICO' === obj.p;
    }
    /**
     * Checks whether the object represents an image or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is an image.
     */
    isImage(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && 'IMG' === obj.p;
    }
    /**
     * Checks whether the object represents an object list or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is an object list.
     */
    isKupObjList(obj: KupObj): boolean {
        if (!obj) return false;
        return 'JL' === obj.t;
    }
    /**
     * Checks whether the object represents a link or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a link.
     */
    isLink(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J1' === obj.t && 'URL' === obj.p;
    }
    /**
     * Checks whether the object represents a number or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a number.
     */
    isNumber(obj: KupObj): boolean {
        if (!obj) return false;
        return 'NR' === obj.t;
    }
    /**
     * Checks whether the object represents a password or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a password.
     */
    isPassword(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J1' === obj.t && 'PWD' === obj.p;
    }
    /**
     * Checks whether the object represents a percentage or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a percentage.
     */
    isPercentage(obj: KupObj): boolean {
        if (!obj) return false;
        return 'NRP' === obj.t + obj.p;
    }
    /**
     * Checks whether the object represents a progress bar or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a progress bar.
     */
    isProgressBar(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && 'PGB' === obj.p;
    }
    /**
     * Checks whether the object represents a radio button or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a radio button.
     */
    isRadio(obj: KupObj): boolean {
        if (!obj) return false;
        return 'V2' === obj.t && 'RADIO' === obj.p;
    }
    /**
     * Checks whether the object can be identifiable as a string.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object can be considered as a string.
     */
    isStringObject(obj: any): boolean {
        if (!obj) return true;

        return (
            !this.isVoCodver(obj) &&
            !this.isIcon(obj) &&
            !this.isImage(obj) &&
            !this.isCheckbox(obj) &&
            !this.isRadio(obj) &&
            !this.isChart(obj)
        );
    }
    /**
     * Checks whether the object represents a text field or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a text field.
     */
    isTextField(obj: KupObj): boolean {
        if (!obj) return false;
        return 'J4' === obj.t && 'TEXTFIELD' === obj.p;
    }
    /**
     * Checks whether the object represents a time or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a time.
     */
    isTime(obj: KupObj): boolean {
        if (!obj) return false;
        return 'I1' === obj.t || 'I2' === obj.t;
    }
    /**
     * Checks whether the object represents a timestamp or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a timestamp.
     */
    isTimestamp(obj: KupObj): boolean {
        if (!obj) return false;
        return 'I3' === obj.t && '2' === obj.p;
    }
    /**
     * Checks whether the object represents a time and handles seconds or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a time and handles seconds.
     */
    isTimeWithSeconds(obj: KupObj): boolean {
        if (!this.isTime(obj)) {
            return false;
        }
        return '2' === obj.p;
    }
    /**
     * Checks whether the object represents a verb or not.
     * @param {KupObj} obj - Object to check.
     * @returns {boolean} True when the object is a verb.
     */
    isVoCodver(obj: KupObj): boolean {
        if (!obj) return false;
        return 'VO' === obj.t && 'COD_VER' === obj.p;
    }

    /**
     * Checks whether the object is null or empty
     * @param obj - Object to check.
     * @returns {boolean} True when the object is null or empty.
     */
    isEmptySmeupObject(obj: KupObj): boolean {
        if (!obj) return true;
        return obj.t.trim() == '' && obj.p.trim() == '' && obj.k.trim() == '';
    }
}
