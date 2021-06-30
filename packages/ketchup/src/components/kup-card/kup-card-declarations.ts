import { GenericObject } from '../../types/GenericTypes';
import { KupObj } from '../../utils/kup-objects/kup-objects-declarations';
/**
 * Props of the kup-card component.
 * Used to export every prop in an object.
 */
export enum KupCardProps {
    customStyle = 'Custom style of the component.',
    data = 'The actual data of the card.',
    isMenu = 'Defines whether the card is a menu or not. Works together with menuVisible.',
    layoutFamily = 'Sets the type of the card.',
    layoutNumber = 'Sets the number of the layout.',
    menuVisible = "Sets the status of the card as menu, when false it's hidden otherwise it's visible. Works together with isMenu.",
    sizeX = 'The width of the card, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).',
    sizeY = 'The height of the card, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
}
/**
 * Data prop of the kup-card component.
 */
export interface CardData {
    autocomplete?: GenericObject[];
    button?: GenericObject[];
    buttonmdcw?: GenericObject[];
    chart?: GenericObject[];
    checkbox?: GenericObject[];
    chip?: GenericObject[];
    color?: string[];
    combobox?: GenericObject[];
    datatable?: GenericObject[];
    datepicker?: GenericObject[];
    image?: GenericObject[];
    list?: GenericObject[];
    object?: KupObj[];
    progressbar?: GenericObject[];
    switch?: GenericObject[];
    tabbar?: GenericObject[];
    text?: string[];
    textfield?: GenericObject[];
    timepicker?: GenericObject[];
    tree?: GenericObject[];
}
/**
 * Layout families of the kup-card component.
 * @enum {string}
 * @property {string} COLLAPSIBLE - Cards belonging to this family will display an area usable to expand the content of the card.
 * @property {string} SCALABLE - Content will fit its container, resizing itself automatically.
 * @property {string} STANDARD - Stndard layouts.
 */
export enum CardFamily {
    COLLAPSIBLE = 'collapsible',
    DIALOG = 'dialog',
    SCALABLE = 'scalable',
    STANDARD = 'standard',
}
/**
 * Recurring IDs.
 */
export enum KupCardIds {
    COLUMNS_LIST = 'columns-list',
    DIALOG_CLOSE = 'dialog-close',
    DRAG_HANDLE = 'drag-handle',
    EXPAND_ACTION = 'expand-action',
    EXTRA_COLUMNS = 'extra-columns',
    NEXT_ROW = 'next-row',
    OBJECT_CHANGE = 'object-change',
    PREVIOUS_ROW = 'previous-row',
    VIEW_SELECTOR = 'view-selector',
}
/**
 * Recurring CSS classes.
 */
export enum KupCardCSSClasses {
    CARD_VIEW = 'card-view',
    CLICKABLE_LINK = 'clickable-link',
    COLLAPSIBLE_ACTIVE = 'collapsible-active',
    COLLAPSIBLE_CARD = 'collapsible-card',
    COLLAPSIBLE_ELEMENT = 'collapsible-element',
    COLLAPSIBLE_WRAPPER = 'collapsible-wrapper',
    DIALOG_TITLE = 'dialog-title',
    DIALOG_UNRESIZABLE = 'dialog-unresizable',
    EXPANDED = 'expanded',
    HAS_ACTIONS = 'has-actions',
    HAS_CONTENT = 'has-content',
    HEADER_BAR = 'header-bar',
    VIEW_PREFIX = 'view-',
    VISIBLE = 'visible',
}
/**
 * Internally-handled sub-component events.
 */
export enum KupCardSubEvents {
    AUTOCOMPLETE_BLUR = 'kupAutocompleteBlur',
    AUTOCOMPLETE_ITEMCLICK = 'kupAutocompleteItemClick',
    BUTTON_CLICK = 'kupButtonClick',
    CHIP_BLUR = 'kupChipBlur',
    CHIP_ICONCLICK = 'kupChipIconClick',
    TABBAR_CLICK = 'kupTabBarClick',
    TREE_NODESELECTED = 'kupTreeNodeSelected',
}
