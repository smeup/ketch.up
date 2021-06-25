import type {
    GenericMap,
    RowAction,
    RowGroup,
} from '../components/kup-data-table/kup-data-table-declarations';
import type { KupObj } from '../utils/kup-objects/kup-objects-declarations';
import { GenericObject } from './GenericTypes';

/**
 * This interface reflects the "atomic" Ketch.UP data entity, which composes the more complex ones.
 */
export interface KupEntity {
    obj: KupObj;
    cssClass?: string;
    icon?: string;
    isKey?: boolean;
    pointer?: string; // Indicates the mouse pointer relative to this entity on mouse over
    readOnly?: boolean;
    shape?: KupShape;
    title?: string;
}
/**
 * Identifies a unique Ketch.UP data entity.
 */
export interface KupId {
    index: number;
    name: string;
}
/**
 * Identifies a unique Ketch.UP data entity.
 */
export enum KupShape {
    BUTTON = 'BTN',
    CHECKBOX = 'CHK',
}
/**
 * TODO: suitable description.
 */
export interface KupColumn extends KupEntity {
    id: KupId;
    decimals?: number;
    formula?: string;
    visible?: boolean;
}
/**
 * TODO: suitable description.
 */
export interface KupDataTableColumn extends KupColumn {
    hideValuesRepetitions?: boolean;
    valuesForFilter?: string[]; // What is it??
}
/**
 * TODO: suitable description.
 */
export interface KupTreeColumn extends KupColumn {
    hideValuesRepetitions?: boolean;
    valuesForFilter?: string[]; // What is it??
}
/**
 * TODO: suitable description.
 */
export interface KupRow extends KupEntity {
    cells: KupCell[];
    id: KupId;
    actions?: Array<RowAction>;
    unselectable?: boolean;
}
/**
 * TODO: suitable description.
 */
export interface KupDataTableRow extends KupRow {
    group?: RowGroup;
}
/**
 * TODO: suitable description.
 */
export interface KupTreeRow extends KupRow {
    expandable: boolean;
    children?: Array<KupTreeRow>;
    data?: GenericObject;
}
/**
 * TODO: suitable description.
 */
export interface KupCell extends KupEntity {
    cells: KupCell;
    decimals?: number;
    value: string;
    displayedValue?: string;
    style?: GenericMap;
    cardID?: number;
    cssClass?: string;
    icon?: string;
    title?: string;
    isEditable?: boolean;
}
