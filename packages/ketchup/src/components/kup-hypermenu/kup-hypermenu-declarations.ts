import { Cell, RowAction } from '../kup-data-table/kup-data-table-declarations';
import { KupBadge } from '../kup-badge/kup-badge';
import {
    GenericObject,
    Identifiable,
    KupEventPayload,
} from '../../types/GenericTypes';
/**
 * Props of the kup-hypermenu component.
 * Used to export every prop in an object.
 */
export enum KupBoxProps {
    stateId = '',
    store = '',
    cardData = "Data of the card linked to the box when the latter's layout must be a premade template.",
    columns = 'Number of columns.',
    customStyle = 'Custom style of the component.',
    data = 'Data',
    dragEnabled = 'Enable dragging.',
    dropEnabled = 'Enable dropping.',
    dropOnSection = 'Drop can be done in section.',
    enableRowActions = 'If enabled, a button to load / display the row actions will be displayed on the right of every box.',
    globalFilter = 'When set to true it activates the global filter.',
    globalFilterValue = 'The value of the global filter.',
    kanban = 'Displays the boxlist as a Kanban.',
    layout = 'How the field will be displayed. If not present, a default one will be created.',
    multiSelection = 'Enable multi selection.',
    pageSelected = 'Current page number.',
    pageSize = 'Number of boxes per page.',
    pagination = 'Enables pagination.',
    rowsPerPage = 'Number of current rows per page.',
    scrollOnHover = 'Activates the scroll on hover function.',
    selectBox = 'Automatically selects the box at the specified index.',
    selectedRowsState = 'Multiple selection.',
    showSelection = 'If enabled, highlights the selected box/boxes.',
    showTooltipOnRightClick = 'If set to true, displays tooltip on right click; if set to false, displays tooltip on mouseOver.',
    sortBy = 'If sorting is enabled, specifies which column to sort.',
    sortEnabled = 'Enable sorting.',
    swipeDisabled = 'Disable swipe.',
    tooltipDetailTimeout = 'Defines the timeout for tooltip detail.',
    tooltipEnabled = 'Enable show tooltip.',
    tooltipLoadTimeout = 'Defines the timeout for tooltip load.',
}

export interface BoxRow extends Identifiable {
    cells: {
        [index: string]: Cell;
    };

    actions?: Array<RowAction>;

    layout?: Layout;

    badgeData?: KupBadge[];
}

export interface Layout {
    horizontal?: boolean;
    sections?: Section[];
}

export interface Section {
    id?: string;
    horizontal?: boolean;
    dim?: string;
    sections?: Section[];
    content?: BoxObject[];
    style?: { [index: string]: string };
    collapsible?: boolean;
    columns?: number;
    title?: string;
    cssClass?: string;
}

export interface BoxObject {
    column?: string;
    value?: string;
    shape?: string;
    config?: any;
}

export interface CollapsedSectionsState {
    [index: string]: {
        [index: string]: boolean;
    };
}
/**
 * Interface for a kanban-displayed boxlist.
 */
export interface BoxKanban {
    columns: string[];
    labels?: Array<Array<string>>;
    size?: string;
}

export interface KupBoxClickEventPayload extends KupEventPayload {
    row: BoxRow;
    column?: string;
}

export interface KupBoxSelectedEventPayload extends KupEventPayload {
    rows: BoxRow[];
}

export interface KupBoxAutoSelectEventPayload extends KupEventPayload {
    row: BoxRow;
}

export interface KupBoxRowActionClickEventPayload extends KupEventPayload {
    row: BoxRow;
    action: RowAction;
    index: number;
}
export interface KupBoxContextMenuEventPayload extends KupEventPayload {
    details: GenericObject;
}
