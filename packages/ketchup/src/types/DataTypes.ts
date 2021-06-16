import type { GenericMap } from '../components/kup-data-table/kup-data-table-declarations';
import type { KupObj } from '../utils/kup-objects/kup-objects-declarations';

/**
 * This interface reflects the "atomic" Ketch.UP data entity, which composes the more complex ones.
 */
export interface KupEntity {
    obj: KupObj;
    icon?: string;
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
 * TODO: suitable description.
 */
export interface KupColumn extends KupEntity {
    id: KupId;
    isKey?: boolean;
    shape?: string;
    visible?: boolean;
}
/**
 * TODO: suitable description.
 */
export interface KupRow extends KupEntity {
    cells: KupCell[];
    id: KupId;
}
/**
 * TODO: suitable description.
 */
export interface KupCell extends KupEntity {
    cells: KupCell;
    value: string;
    displayedValue?: string;
    style?: GenericMap;
    shape?: string;
    cardID?: number;
    cssClass?: string;
    icon?: string;
    title?: string;
    isEditable?: boolean;
}
