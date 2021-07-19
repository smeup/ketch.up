import { h, VNode } from '@stencil/core';
import type { KupCard } from '../kup-card';
import type { GenericObject } from '../../../types/GenericTypes';
import type { KupDom } from '../../../utils/kup-manager/kup-manager-declarations';
import { FImage } from '../../../f-components/f-image/f-image';
import { compList, dialogHeader } from '../kup-card-helper';
import {
    Column,
    TableData,
} from '../../kup-data-table/kup-data-table-declarations';
import { KupLanguageRow } from '../../../utils/kup-language/kup-language-declarations';
import { KupCardCSSClasses, KupCardIds } from '../kup-card-declarations';

const dom: KupDom = document.documentElement as KupDom;
/**
 * 1st dialog card layout, used to display information in string format.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st standard layout virtual node.
 */
export function create1(component: KupCard): VNode {
    //Title, subtitle and description
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    const divs: VNode[] = [];
    //Loop starts from 1: occurence [0] is the dialog's title
    for (let index = 1; index < textArray.length; index++) {
        const isEven: boolean = index % 2 == 0;
        divs.push(
            <span class={`text ${!isEven ? 'label' : ''}`}>
                {textArray[index]}
            </span>
        );
    }
    return (
        <div class={`dialog-layout-${component.layoutNumber} dialog-element`}>
            {dialogHeader(textArray[0])}
            <div class="section-1">{divs}</div>
        </div>
    );
}
/**
 * 2nd dialog card layout, used to display information in string format and features an highlighted row on top.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st standard layout virtual node.
 */
export function create2(component: KupCard): VNode {
    //Title, subtitle and description
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    const divs: VNode[] = [];
    //Loop starts from 3: occurence [0] is the dialog's title, [1] and [2] are the highlighted strings
    for (let index = 3; index < textArray.length; index++) {
        const isEven: boolean = index % 2 == 0;
        divs.push(
            <span class={`text ${!isEven ? 'label' : ''}`}>
                {textArray[index]}
            </span>
        );
    }
    return (
        <div class={`dialog-layout-${component.layoutNumber} dialog-element`}>
            {textArray[0] ? dialogHeader(textArray[0]) : dialogHeader('')}
            {textArray[1] && textArray[2] ? (
                <div class="section-1">
                    <div class="text label">{textArray[1]}</div>
                    <div class="text ">{textArray[2]}</div>
                </div>
            ) : null}
            <div class="section-2">{divs}</div>
        </div>
    );
}
/**
 * 3rd dialog card layout, buttons and text lines, used for debug window.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st standard layout virtual node.
 */
export function create3(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Combobox list
    const comboboxArray: GenericObject[] = component.data['combobox']
        ? component.data['combobox']
        : [];
    //Slot list
    const slots: Array<HTMLElement> = Array.prototype.slice.call(
        component.rootElement.children,
        0
    );
    //Textfield list
    const textfieldArray: GenericObject[] = component.data['textfield']
        ? component.data['textfield']
        : [];
    return (
        <div
            class={`dialog-layout-${component.layoutNumber} ${KupCardCSSClasses.DIALOG_UNRESIZABLE}`}
        >
            <div>
                {buttonArray.length > 0 || textfieldArray.length > 0 ? (
                    <div class="section-1">
                        <FImage
                            id={KupCardIds.DRAG_HANDLE}
                            resource="drag_handle"
                            sizeX="32px"
                            sizeY="32px"
                        />
                        {compList(buttonArray, 'button')}
                        {compList(textfieldArray, 'textfield')}
                        {compList(comboboxArray, 'combobox')}
                    </div>
                ) : null}
                {slots.length > 0 ? (
                    <div class="section-2">{compList(slots, 'slot')}</div>
                ) : null}
            </div>
        </div>
    );
}
/**
 * 4th dialog card layout, used to display information with data table.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st standard layout virtual node.
 */
export function create4(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Dialog title
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Datatable
    const datatableArray: GenericObject[] = component.data['datatable']
        ? component.data['datatable']
        : [];
    return (
        <div class={`dialog-layout-${component.layoutNumber} dialog-element`}>
            {textArray[0] ? dialogHeader(textArray[0]) : dialogHeader('')}
            {datatableArray[0] && buttonArray[0] && buttonArray[1] ? (
                <div class="section-1">
                    <kup-button
                        {...buttonArray[0]}
                        id={KupCardIds.PREVIOUS_ROW}
                        onkup-button-click={() => prevButton(component)}
                        title={dom.ketchup.language.translate(
                            KupLanguageRow.PREVIOUS
                        )}
                    />
                    <kup-button
                        {...buttonArray[1]}
                        id={KupCardIds.NEXT_ROW}
                        onkup-button-click={() => nextButton(component)}
                        title={dom.ketchup.language.translate(
                            KupLanguageRow.NEXT
                        )}
                    />
                </div>
            ) : null}
            {datatableArray[0] ? (
                <div class="section-2">
                    <kup-data-table
                        id="datatable1"
                        {...datatableArray[0]}
                    ></kup-data-table>
                </div>
            ) : null}
        </div>
    );
}
/**
 * 5th dialog card layout, buttons and text lines, used for debug window.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st standard layout virtual node.
 */
export function create5(component: KupCard): VNode {
    //Slot list
    const slots: Array<HTMLElement> = Array.prototype.slice.call(
        component.rootElement.children,
        0
    );
    //List
    const listArray: GenericObject[] = component.data['list']
        ? component.data['list']
        : [];
    //Dialog title
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    return (
        <div
            class={`dialog-layout-${component.layoutNumber} ${KupCardCSSClasses.DIALOG_UNRESIZABLE}`}
        >
            {textArray[0] ? dialogHeader(textArray[0]) : dialogHeader('')}
            <div>
                {slots.length > 0 ? (
                    <div class="section-1">{compList(slots, 'slot')}</div>
                ) : null}
                {listArray[0] ? (
                    <div class="section-2">
                        <kup-list id="list1" {...listArray[0]} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
/**
 * Invoked by 4th layout to switch to the previous record of the original data table.
 * Reminder: data table inside 4th layout should be transposed and valid columns should be named with numbers (strings, but numerical).
 * @param {KupCard} component - Card component.
 */
function prevButton(component: KupCard): void {
    const root: ShadowRoot = component.rootElement.shadowRoot;
    let nextButton: HTMLKupButtonElement = null;
    let prevButton: HTMLKupButtonElement = null;
    let table: HTMLKupDataTableElement = null;
    let data: TableData = null;
    if (root) {
        table = root.querySelector('kup-data-table');
        nextButton = root.querySelector('#' + KupCardIds.NEXT_ROW);
        prevButton = root.querySelector('#' + KupCardIds.PREVIOUS_ROW);
        if (table) {
            data = table.data;
        }
    }
    if (data) {
        let visibleColumnIndex: number = getVisibleColumn(data);
        if (visibleColumnIndex) {
            const currColumn: Column = data.columns[visibleColumnIndex];
            const prevColumn: Column = data.columns[visibleColumnIndex - 1];
            const prevPrevColumn: Column = data.columns[visibleColumnIndex - 2];
            if (!isNaN(parseInt(prevColumn.name))) {
                currColumn.visible = false;
                prevColumn.visible = true;
                if (isNaN(parseInt(prevPrevColumn.name))) {
                    prevButton.disabled = true;
                }
            }
            nextButton.disabled = false;
        }
        table.refresh();
    }
}
/**
 * Invoked by 4th layout to switch to the next record of the original data table.
 * Reminder: data table inside 4th layout should be transposed and valid columns should be named with numbers (strings, but numerical).
 * @param {KupCard} component - Card component.
 */
function nextButton(component: KupCard): void {
    const root: ShadowRoot = component.rootElement.shadowRoot;
    let nextButton: HTMLKupButtonElement = null;
    let prevButton: HTMLKupButtonElement = null;
    let table: HTMLKupDataTableElement = null;
    let data: TableData = null;
    if (root) {
        table = root.querySelector('kup-data-table');
        nextButton = root.querySelector('#' + KupCardIds.NEXT_ROW);
        prevButton = root.querySelector('#' + KupCardIds.PREVIOUS_ROW);
        if (table) {
            data = table.data;
        }
    }
    if (data) {
        let visibleColumnIndex: number = getVisibleColumn(data);
        if (visibleColumnIndex) {
            const currColumn: Column = data.columns[visibleColumnIndex];
            const nextColumn: Column = data.columns[visibleColumnIndex + 1];
            const nextNextColumn: Column = data.columns[visibleColumnIndex + 2];
            if (nextColumn) {
                currColumn.visible = false;
                nextColumn.visible = true;
                if (!nextNextColumn) {
                    nextButton.disabled = true;
                }
            }
            prevButton.disabled = false;
        }
        table.refresh();
    }
}
/**
 * Returns the index of the first visible numerical column.
 * @param {TableData}  data - Table data.
 */
function getVisibleColumn(data: TableData): number {
    for (let index = 0; index < data.columns.length; index++) {
        const column: Column = data.columns[index];
        if (!isNaN(parseInt(column.name)) && column.visible) {
            return index;
        }
    }
    return null;
}
