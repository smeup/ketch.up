import { h, VNode } from '@stencil/core';
import type { GenericObject } from '../../types/GenericTypes';
import { FChipData } from '../../f-components/f-chip/f-chip-declarations';
import { FImage } from '../../f-components/f-image/f-image';
import { KupCard } from './kup-card';
import { KupObj } from '../../utils/kup-objects/kup-objects-declarations';
import { TreeNode } from '../kup-tree/kup-tree-declarations';
import {
    KupCardCSSClasses,
    KupCardIds,
    KupCardSubEvents,
} from './kup-card-declarations';
import { KupColumnMenuIds } from '../../utils/kup-column-menu/kup-column-menu-declarations';
/**
 * This function returns a list of components.
 * @param {GenericObject[]} compArray - Components' props.
 * @param {string} compType - Components' type.
 * @returns {JSX.Element[]} List of components.
 */
export function compList(
    compArray: GenericObject[] | string[] | HTMLElement[],
    compType: string
): VNode[] {
    let list: VNode[] = [];
    for (let index = 0; index < compArray.length; index++) {
        if (
            typeof compArray[0] !== 'string' &&
            !(compArray as GenericObject[])[index].id
        ) {
            (compArray as GenericObject[])[index]['id'] = compType + index;
        }
        switch (compType) {
            case 'autocomplete':
                list.push(
                    <kup-autocomplete
                        {...(compArray as GenericObject[])[index]}
                    />
                );
                break;
            case 'button':
                list.push(
                    <kup-button {...(compArray as GenericObject[])[index]} />
                );
                break;
            case 'buttonmdcw':
                list.push(
                    <kup-button-mdcw
                        {...(compArray as GenericObject[])[index]}
                    />
                );
                break;
            case 'checkbox':
                list.push(
                    <kup-checkbox {...(compArray as GenericObject[])[index]} />
                );
                break;
            case 'combobox':
                list.push(
                    <kup-combobox {...(compArray as GenericObject[])[index]} />
                );
                break;
            case 'datepicker':
                list.push(
                    <kup-date-picker
                        {...(compArray as GenericObject[])[index]}
                    />
                );
                break;
            case 'slot':
                list.push(<slot></slot>);
                break;
            case 'text':
                list.push(
                    <div class="text"> {(compArray as string[])[index]}</div>
                );
                break;
            case 'textfield':
                list.push(
                    <kup-text-field
                        {...(compArray as GenericObject[])[index]}
                    />
                );
                break;
            case 'timepicker':
                list.push(
                    <kup-time-picker
                        {...(compArray as GenericObject[])[index]}
                    />
                );
                break;
        }
    }
    return list;
}
/**
 * Called by the layouts method to return the header bar of the dialog.
 * @param {string} title - Title of the dialog.
 * @returns {VNode} Virtual node of the dialog's header bar.
 */
export function dialogHeader(title: string): VNode {
    return (
        <div id={KupCardIds.DRAG_HANDLE} class={KupCardCSSClasses.HEADER_BAR}>
            {title ? (
                <div class={KupCardCSSClasses.DIALOG_TITLE}>{title}</div>
            ) : null}
            <FImage
                sizeX="1.25em"
                sizeY="2em"
                resource="clear"
                id={KupCardIds.DIALOG_CLOSE}
            />
        </div>
    );
}
/**
 * Creates the bar used to expand/collapse the card.
 * @returns {VNode} Expansion bar virtual node.
 */
export function collapsibleBar(): VNode {
    return (
        <div class="collapsible-trigger">
            <kup-button
                id={KupCardIds.EXPAND_ACTION}
                toggable
                iconOff="keyboard_arrow_down"
                icon="keyboard_arrow_up"
            ></kup-button>
        </div>
    );
}
/**
 * Handles layout-specific actions when an event occurs.
 * @param {KupCard} component - Card component.
 * @param {CustomEvent} e - Event triggered by a sub-component.
 */
export function layoutSpecificEvents(component: KupCard, e: CustomEvent): void {
    const root: ShadowRoot = component.rootElement.shadowRoot;
    /*-------------------------------------------------*/
    /*      C o l l a p s i b l e   L a y o u t s      */
    /*-------------------------------------------------*/
    if (
        e.type === KupCardSubEvents.BUTTON_CLICK &&
        e.detail.id === KupCardIds.EXPAND_ACTION
    ) {
        const collapsibleCard = root.querySelector(
            '.' + KupCardCSSClasses.COLLAPSIBLE_CARD
        );
        if (
            !collapsibleCard.classList.contains(
                '.' + KupCardCSSClasses.EXPANDED
            )
        ) {
            collapsibleCard.classList.add('.' + KupCardCSSClasses.EXPANDED);
            component.oldSizeY = component.sizeY;
            component.sizeY = 'auto';
        } else if (component.oldSizeY) {
            collapsibleCard.classList.remove('.' + KupCardCSSClasses.EXPANDED);
            component.sizeY = component.oldSizeY;
        }
        return;
    }
    /*-------------------------------------------------*/
    /*      1 4 t h   S t a n d a r d  L a y o u t     */
    /*-------------------------------------------------*/
    // Tab change: when a tab is clicked, the corresponding view will be activated while the others will become hidden.
    if (
        root &&
        e.type === KupCardSubEvents.TABBAR_CLICK &&
        e.detail.id === KupCardIds.VIEW_SELECTOR
    ) {
        const views: NodeListOf<HTMLElement> = root.querySelectorAll(
            '.' + KupCardCSSClasses.CARD_VIEW
        );
        for (let index = 0; index < views.length; index++) {
            const view: HTMLElement = views[index];
            if (
                view.classList.contains(
                    KupCardCSSClasses.VIEW_PREFIX + (e.detail.index + 1)
                )
            ) {
                view.classList.add(KupCardCSSClasses.VISIBLE);
            } else {
                view.classList.remove(KupCardCSSClasses.VISIBLE);
            }
        }
    }
    // Chip deleted: when a chip is deleted, the apply button must appear.
    if (
        root &&
        e.type === KupCardSubEvents.CHIP_ICONCLICK &&
        e.detail.id === KupCardIds.COLUMNS_LIST
    ) {
        const apply: HTMLKupButtonElement = root.querySelector(
            '#' + KupColumnMenuIds.BUTTON_APPLY
        );
        apply.classList.add('visible');
    }
    // Chip creation: upon clicking on the tree, the chip list will updated by adding or removing an entry.
    if (
        root &&
        e.type === KupCardSubEvents.TREE_NODESELECTED &&
        e.detail.id === KupCardIds.EXTRA_COLUMNS
    ) {
        if (e.detail.treeNode) {
            const apply: HTMLKupButtonElement = root.querySelector(
                '#' + KupColumnMenuIds.BUTTON_APPLY
            );
            const chip: HTMLKupChipElement = root.querySelector(
                '#' + KupCardIds.COLUMNS_LIST
            );
            const node: TreeNode = e.detail.treeNode;
            const obj: KupObj = e.detail.treeNode.obj;
            if (
                obj &&
                obj.t !== '' &&
                (obj.t !== '**' || (obj.t === '**' && !obj.k))
            ) {
                const chipData: FChipData[] =
                    chip && chip.data ? chip.data : null;
                // This should be handled server-side, data should arrive correctly.
                // Right now the only way to bind chips with tree nodes is a consistent value - which is the child column's name.
                // Hence, the algorithm below.
                const key: string =
                    component.rootElement.dataset.column +
                    '_' +
                    (node.id ? node.id.replace(/\//g, '_') : '');
                if (chipData) {
                    const existingChip: FChipData = chipData.find(
                        (x: FChipData) => x.value === key
                    );
                    if (existingChip) {
                        chipData.splice(chipData.indexOf(existingChip), 1);
                    } else {
                        chipData.push({
                            icon: node.icon,
                            label: node.value,
                            obj: node.obj,
                            value: key,
                        });
                    }
                    apply.classList.add('visible');
                } else {
                    chip.data['chip'] = [
                        {
                            icon: node.icon,
                            label: node.value,
                            obj: node.obj,
                            value: key,
                        },
                    ];
                }
                chip.refresh();
            }
        }
    }
    // Apply button: a new chip will be created with updated data.
    if (
        root &&
        e.type === KupCardSubEvents.BUTTON_CLICK &&
        e.detail.id === KupColumnMenuIds.BUTTON_APPLY
    ) {
        const chip: HTMLKupChipElement = root.querySelector(
            '#' + KupCardIds.COLUMNS_LIST
        );
        component.data.chip[0]['data'] = chip.data;
    }
    /*-------------------------------------------------*/
    /*        4 t h   D i a l o g   L a y o u t        */
    /*-------------------------------------------------*/
    // Refresh when switching row
    if (
        e.type === KupCardSubEvents.BUTTON_CLICK &&
        (e.detail.id === KupCardIds.NEXT_ROW ||
            e.detail.id === KupCardIds.PREVIOUS_ROW)
    ) {
        component.refresh();
    }
}
