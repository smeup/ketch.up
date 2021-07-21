// Box and datatables cells utils functions

import get from 'lodash/get';
import {
    Cell,
    Column,
    SortMode,
} from '../components/kup-data-table/kup-data-table-declarations';
import { BoxObject } from '../components/kup-box/kup-box-declarations';
import numeral from 'numeral';
import {
    ISO_DEFAULT_DATE_FORMAT,
    ISO_DEFAULT_DATE_TIME_FORMAT,
    ISO_DEFAULT_TIME_FORMAT,
    isValidStringDate,
    stringToNumber,
    toKebabCase,
    unformatDateTime,
    unformattedStringToFormattedStringDate,
    unformattedStringToFormattedStringNumber,
    unformattedStringToFormattedStringTime,
    unformattedStringToFormattedStringTimestamp,
} from './utils';
import { ValueDisplayedValue } from './filters/filters-declarations';
import { KupObjects } from './kup-objects/kup-objects';
import { KupDom } from './kup-manager/kup-manager-declarations';

const dom: KupDom = document.documentElement as KupDom;
const kupObjects: KupObjects = dom.ketchup
    ? dom.ketchup.objects
    : new KupObjects();

// -------------
// COMMONS
// -------------

export function getShape(cell: Cell, boxObject?: BoxObject): string {
    let prop = get(cell, 'shape', null);
    if (!prop && boxObject) {
        prop = get(boxObject, 'shape', null);
    }
    return prop ? prop.toUpperCase() : null;
}

export function getValue(cell: Cell, boxObject: BoxObject): string {
    let prop = get(cell, 'value', null);
    if (!prop) {
        prop = get(boxObject, 'value', null);
    }
    return prop;
}

export function getFromConfig(
    cell: Cell,
    boxObject: BoxObject,
    propName: string
): any {
    let prop = null;
    if (cell && cell.data) {
        prop = get(cell.data, propName, null);
    }
    if (!prop && boxObject && boxObject.config) {
        prop = get(boxObject.config, propName, null);
    }
    return prop;
}

// -------------
// PROGRESS BAR
// -------------

export function isProgressBar(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return (
        'PGB' === shape ||
        (!shape && cell && cell.obj && kupObjects.isProgressBar(cell.obj))
    );
}

// -------------
// CHIP
// -------------

export function isChip(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return (
        'CHI' === shape ||
        (!shape && cell && cell.obj && kupObjects.isKupObjList(cell.obj))
    );
}
/**
 * These are the camelCase javascript suffixes of the CSS vars of kup-progress-bar.
 * They always must be equal to those you can find inside the file kup-progress-bar.scss in the first section,
 * save for the prefix (--kup-pb_), which will be added directly inside the [buildProgressBarConfig function]{@link buildProgressBarConfig}
 */
const progressbarCssVars = [
    'backgroundColor',
    'borderRadius',
    'foregroundColor',
    'textColor',
];

/**
 * Given a Cell object (from data-talbe or box component), a value and an optional isSmall flag,
 * returns the jsx to create a progressbar.
 * @param cell - The cell to render as a progressbar.
 * @param value - The value the progressbar must set.
 * @param [isSmall] - flag to specify if the progressbar must be rendered as small one.
 */
export function buildProgressBarConfig(
    cell: Cell,
    boxObject: BoxObject,
    isSmall: boolean = false,
    value: string
) {
    const wrapperStyle = {};

    for (let i = 0; i < progressbarCssVars.length; i++) {
        let progressbarCssVar = getFromConfig(
            cell,
            boxObject,
            progressbarCssVars[i]
        );

        if (progressbarCssVar) {
            wrapperStyle['--kup-pb_' + toKebabCase(progressbarCssVars[i])] =
                progressbarCssVar;
        }
    }

    let hideLabel = getFromConfig(cell, boxObject, 'hideLabel');
    let labelText = getFromConfig(cell, boxObject, 'labelText');

    return {
        isSmall: isSmall,
        labelText: labelText,
        hideLabel: !!hideLabel,
        style: wrapperStyle,
        value: numeral(value).value(),
    };
}

// -------------
// IMAGE
// -------------

export function isImage(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return (
        'IMG' === shape ||
        (!shape && cell && cell.obj && kupObjects.isImage(cell.obj))
    );
}

// -------------
// ICON
// -------------

export function buildIconConfig(cell: Cell, value: string) {
    let badgeData = undefined;
    let color = undefined;
    let customStyle = undefined;
    let data = undefined;
    let sizeX = undefined;
    let sizeY = undefined;

    if (cell && cell.data) {
        const config = cell.data;
        badgeData = config.badgeData;
        color = config.color;
        customStyle = config.customStyle;
        data = config.data;
        sizeX = config.sizeX;
        sizeY = config.sizeY;
    }

    return {
        badgeData: badgeData,
        color: color,
        customStyle: customStyle,
        data: data,
        resource: value,
        sizeX: sizeX,
        sizeY: sizeY,
    };
}

// -------------
// COMBO
// -------------

export function isCombo(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'CMB' === shape;
}

// -------------
// AUTOCOMPLETE
// -------------

export function isAutocomplete(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'ACP' === shape;
}

// -------------
// SEARCH
// -------------

export function isSearch(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'SRC' === shape;
}

// -------------
// CRUD
// -------------

export function isConfigurator(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'CFG' === shape;
}

export function isMultipleConfigurator(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'CFM' === shape;
}

// -------------
// INPUT TEXT
// -------------

export function isInputText(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'ITX' === shape || !shape;
}

// -------------
// INPUT EDITOR
// -------------

export function isEditor(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'EDT' === shape;
}

// -------------
// RATING
// -------------

export function isRating(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'RTG' === shape;
}

// -------------
// COLOR
// -------------

export function isColor(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return (
        'CLP' === shape ||
        (!shape && cell && cell.obj && kupObjects.isColor(cell.obj))
    );
}

// -------------
// CHART
// -------------

export function isChart(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return (
        'GRA' === shape ||
        (!shape && cell && cell.obj && kupObjects.isChart(cell.obj))
    );
}

// -------------
// RADIO
// -------------

export function isRadio(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return (
        'RAD' === shape ||
        (!shape && cell && cell.obj && kupObjects.isRadio(cell.obj))
    );
}

// -------------
// GAUGE
// -------------

export function isGauge(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'GAU' === shape;
}

// -------------
// KNOB
// -------------

export function isKnob(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'KNB' === shape;
}

// -------------
// TRE
// -------------

export function isTree(cell: Cell, boxObject: BoxObject) {
    let shape = getShape(cell, boxObject);
    return 'TRE' === shape;
}

export function getCellType(cell: Cell) {
    let obj = cell.obj;
    if (kupObjects.isBar(obj)) {
        return 'bar';
    } else if (kupObjects.isButton(obj)) {
        return 'button';
    } else if (kupObjects.isChart(obj)) {
        return 'chart';
    } else if (kupObjects.isCheckbox(obj)) {
        return 'checkbox';
    } else if (isColor(cell, null)) {
        return 'color-picker';
    } else if (isGauge(cell, null)) {
        return 'gauge';
    } else if (isKnob(cell, null)) {
        return 'knob';
    } else if (kupObjects.isIcon(obj)) {
        return 'icon';
    } else if (isImage(cell, null)) {
        return 'image';
    } else if (kupObjects.isLink(obj)) {
        return 'link';
    } else if (isProgressBar(cell, null)) {
        return 'progress-bar';
    } else if (isRadio(cell, null)) {
        return 'radio';
    } else if (isRating(cell, null)) {
        return 'rating';
    } else if (isChip(cell, null)) {
        return 'chips';
    } else if (kupObjects.isNumber(obj)) {
        return 'number';
    } else if (kupObjects.isDate(obj)) {
        return 'date';
    } else if (kupObjects.isTimestamp(obj)) {
        return 'datetime';
    } else if (kupObjects.isTime(obj)) {
        return 'time';
    } else if (kupObjects.isTextField(obj)) {
        return 'text-field';
    } else if (kupObjects.isVoCodver(obj)) {
        return 'btn';
    } else {
        return 'string';
    }
}

export function getCellValueForDisplay(column: Column, cell: Cell): string {
    if (cell != null) {
        if (cell.displayedValue != null) {
            return cell.displayedValue;
        }
    }
    let formattedValue = _getCellValueForDisplay(cell.value, column, cell);
    if (cell != null) {
        cell.displayedValue = formattedValue;
    }
    return formattedValue;
}

export function getValueForDisplay2(
    values: ValueDisplayedValue,
    column?: Column
): string {
    if (values == null) {
        return '';
    }
    if (values.displayedValue == null || values.displayedValue.trim() == '') {
        values.displayedValue = _getCellValueForDisplay(
            values.value,
            column,
            null
        );
    }
    return values.displayedValue;
}

function _getCellValueForDisplay(value, column: Column, cell: Cell): string {
    let obj = column != null ? column.obj : null;
    if (cell != null) {
        obj = cell.obj ? cell.obj : obj;
    }
    return getValueForDisplay(
        value,
        obj,
        column != null ? column.decimals : null
    );
}

export function getValueForDisplay(value, obj, decimals: number): string {
    if (value == null || value.trim() == '') {
        return value;
    }
    if (kupObjects.isNumber(obj)) {
        return unformattedStringToFormattedStringNumber(
            value,
            decimals ? decimals : -1,
            obj ? obj.p : ''
        );
    }
    if (
        kupObjects.isDate(obj) &&
        isValidStringDate(value, ISO_DEFAULT_DATE_FORMAT)
    ) {
        return unformattedStringToFormattedStringDate(
            value,
            null,
            obj.t + obj.p
        );
    }
    if (kupObjects.isTime(obj)) {
        return unformattedStringToFormattedStringTime(
            value,
            kupObjects.isTimeWithSeconds(obj),
            null,
            obj.t + obj.p
        );
    }
    if (kupObjects.isTimestamp(obj)) {
        return unformattedStringToFormattedStringTimestamp(value);
    }
    return value;
}

export function getColumnByName(columns: Column[], name: string): Column {
    if (columns == null) {
        return null;
    }
    for (let column of columns) {
        if (column.name === name) {
            return column;
        }
    }

    return null;
}

export function compareCell(
    cell1: Cell,
    cell2: Cell,
    sortMode: SortMode
): number {
    return compareValues(
        cell1.obj,
        cell1.value,
        cell2.obj,
        cell2.value,
        sortMode
    );
}

export function compareValues(
    obj1: any,
    value1: any,
    obj2: any,
    value2: any,
    sortMode: SortMode
): number {
    const sm = sortMode === 'A' ? 1 : -1;

    if (obj1 == null || obj2 == null) {
        return sm * localCompareAsInJava(value1, value2);
    }

    // If either the type or the parameter of the current object are not equal.
    if (!(obj1.t === obj2.t && obj1.p === obj2.p)) {
        let compare = localCompareAsInJava(obj1.t, obj2.t);
        if (compare === 0) {
            compare = localCompareAsInJava(obj1.p, obj2.p);
        }
        return compare * sm;
    }

    let s1: string = value1;
    let s2: string = value2;

    if (s1 == s2) {
        return 0;
    }

    if (s1 == '') {
        return sm * -1;
    }

    if (s2 == '') {
        return sm * 1;
    }

    let v1: any = s1;
    let v2: any = s2;
    if (kupObjects.isNumber(obj1)) {
        v1 = stringToNumber(s1);
        v2 = stringToNumber(s2);
    } else if (kupObjects.isDate(obj1)) {
        v1 = unformatDateTime(s1, ISO_DEFAULT_DATE_FORMAT);
        v2 = unformatDateTime(s2, ISO_DEFAULT_DATE_FORMAT);
    } else if (kupObjects.isTime(obj1)) {
        v1 = unformatDateTime(s1, ISO_DEFAULT_TIME_FORMAT);
        v2 = unformatDateTime(s2, ISO_DEFAULT_TIME_FORMAT);
    } else if (kupObjects.isTimestamp(obj1)) {
        v1 = unformatDateTime(s1, ISO_DEFAULT_DATE_TIME_FORMAT);
        v2 = unformatDateTime(s2, ISO_DEFAULT_DATE_TIME_FORMAT);
    }
    if (v1 > v2) {
        return sm * 1;
    }
    if (v1 < v2) {
        return sm * -1;
    }
    return 0;
}

/**
 * Given two strings to compare, the functions decides which string comes before the other or if they are equal.
 * This is meant as a replacement for the JavaScript function localCompare() which produces a slightly different result from
 * the Java version of compareTo().
 *
 * Re-implemented from java source method compareTo() of java.lang.String
 * @param t1 firstString the first string to be compared
 * @param t2 anotherString the another string to be compared to the first one
 * @returns the value 0 if the anotherString is equal to
 *          firstString; a value less than 0 if firstString
 *          is lexicographically less than the anotherString; and a
 *          value greater than 0 if firstString is
 *          lexicographically greater than the anotherString.
 */
function localCompareAsInJava(t1: string, t2: string): number {
    let t1Length = t1 == null ? 0 : t1.length;
    let t2Length = t2 == null ? 0 : t2.length;
    const lim = Math.min(t1Length, t2Length);

    let k = 0;
    while (k < lim) {
        const c1 = t1[k];
        const c2 = t2[k];
        if (c1 !== c2) {
            return c1.charCodeAt(0) - c2.charCodeAt(0);
        }
        k++;
    }
    return t1Length - t2Length;
}
