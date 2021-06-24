import { Identifiable } from '../../types/GenericTypes';
/**
 * Props of the kup-data-table component.
 * Used to export every prop in an object.
 */
export enum KupDataTableProps {
    customStyle = 'Custom style of the component.',
    data = 'The data of the table.',
    density = "The density of the rows, defaults at 'medium' and can be also set to 'large' or 'small'.",
    dragEnabled = 'Enable row dragging',
    dropEnabled = 'Enable record dropping',
    editableData = 'When set to true, editable cells will be rendered using input components.',
    emptyDataLabel = 'Defines the label to show when the table is empty.',
    enableSortableColumns = 'Enables the sorting of columns by dragging them into different columns.',
    enableExtraColumns = 'Enables adding extra columns.',
    expandGroups = 'Expands groups when set to true.',
    filters = 'List of filters set by the user.',
    fixedColumns = 'Fixes the given number of columns so that they stay visible when horizontally scrolling the data-table. If grouping is active or the value of the prop is <= 0, this prop will have no effect. Can be combined with fixedRows.',
    fixedRows = 'Fixes the given number of rows so that they stay visible when vertically scrolling the data-table. If grouping is active or the value of the prop is <= 0, this prop will have no effect. Can be combined with fixedColumns.',
    forceOneLine = 'Forces cells with long text and a fixed column size to have an ellipsis set on their text. The reflect attribute is mandatory to allow styling.',
    globalFilter = 'When set to true it activates the global filter.',
    globalFilterValue = 'The value of the global filter.',
    groupLabelDisplay = 'How the label of a group must be displayed. For available values',
    groups = 'The list of groups.',
    headerIsPersistent = 'When set to true the header will stick on top of the table when scrolling.',
    isFocusable = 'When set to true, clicked-on rows will have a visual feedback.',
    lazyLoadRows = 'When set to true, extra rows will be automatically loaded once the last row enters the viewport. When groups are present, the number of rows is referred to groups and not to their content. Paginator is disabled.',
    lineBreakCharacter = 'Defines the placeholder character which will be replaced by a line break inside table header cells, normal or sticky.',
    loadMoreLimit = 'Sets a maximum limit of new records which can be required by the load more functionality.',
    loadMoreMode = 'Establish the modality of how many new records will be downloaded. This property is regulated also by loadMoreStep.',
    loadMoreStep = 'The number of records which will be requested to be downloaded when clicking on the load more button. This property is regulated also by loadMoreMode.',
    multiSelection = 'When set to true enables rows multi selection.',
    pageSelected = 'Current selected page set on component load',
    paginatorPos = 'Sets the position of the paginator. Available positions: top, bottom or both.',
    removableColumns = 'Sets the possibility to remove the selected column.',
    rowActions = 'Sets the actions of the rows.',
    rowsPerPage = 'Sets the number of rows per page to display.',
    scrollOnHover = 'Activates the scroll on hover function.',
    selectRow = 'Selects the row at the specified rendered rows prosition (base 1).',
    selectRowsById = 'Semicolon separated rows id to select.',
    showCustomization = 'If set to true, displays the button to open the customization panel.',
    showFilters = 'When set to true enables the column filters.',
    showFooter = 'When set to true shows the footer.',
    showGrid = 'Can be used to customize the grid view of the table.',
    showGroups = 'When set to true enables the column grouping.',
    showHeader = 'Enables rendering of the table header.',
    showLoadMore = 'If set to true, displays the button to load more records.',
    showTooltipOnRightClick = 'If set to true, displays tooltip on right click; if set to false, displays tooltip on mouseOver.',
    sort = 'Defines the current sorting options.',
    stateId = '',
    store = '',
    sortableColumnsMutateData = 'If set to true, when a column is dragged to be sorted, the component directly mutates the data.columns property and then fires the event',
    sortEnabled = 'When set to true enables the sorting of the columns.',
    tableHeight = 'Sets the height of the table.',
    tableWidth = 'Sets the width of the table.',
    tooltipDetailTimeout = 'Defines the timeout for tooltip detail',
    tooltipEnabled = 'Enable show tooltip',
    totals = 'Defines the current totals options.',
}

export interface DataTable {
    columns?: Array<Column>;
    rows?: Array<Row>;
}

export interface CellData {
    [index: string]: any;
}

export interface Cell {
    value: string;
    cardID?: number;
    cssClass?: string;
    data?: CellData;
    displayedValue?: string;
    icon?: string;
    info?: KupCellInfo;
    isEditable?: boolean;
    obj?: {
        t: string;
        p: string;
        k: string;
    };
    shape?: string;
    style?: GenericMap;
    title?: string;
}
/**
 * Information about the cell, displayed before the content.
 *
 * @export
 * @interface KupCellInfo
 */
export interface KupCellInfo {
    color?: string;
    icon?: string;
    message: string;
}

export interface CellsHolder {
    [index: string]: Cell;
}

export interface Column {
    name: string;
    title: string;
    size?: string;
    visible?: boolean;
    clickable?: boolean;
    hideValuesRepetitions?: boolean;
    obj?: {
        t: string;
        p: string;
        k: string;
    };
    shape?: string;
    decimals?: number;
    icon?: string;
    formula?: string;
    valuesForFilter?: string[];
    isKey?: boolean;
    children?: ColumnChild[];
}
export interface ColumnChild {
    name: string;
    obj: {
        t: string;
        p: string;
        k: string;
    };
    icon?: string;
}

export interface Row extends Identifiable {
    cells: CellsHolder;

    actions?: Array<RowAction>;

    group?: RowGroup;

    readOnly?: boolean;

    cssClass?: string;
    name?: string;
    unselectable?: boolean;
}

export interface RowGroup {
    id: string;
    parent: Row;
    column: string;
    columnLabel: string; // Saves the column label in case either LABEL or BOTH modes for the groupLabelDisplay are activated
    expanded: boolean; // not sure if this is needed
    label: string;
    children: Array<Row>;
    obj: {
        t: string;
        p: string;
        k: string;
    };
    totals: { [index: string]: any }; // TODO manage this any
}

export interface TableData {
    columns?: Array<Column>;
    rows?: Array<Row>;
}

export interface GenericMap {
    [index: string]: string;
}

export interface SortObject {
    column: string;
    sortMode: SortMode;
}

export enum SortMode {
    A = 'A',
    D = 'D',
}

export interface TotalsMap {
    [index: string]: TotalMode;
}

export enum TotalMode {
    COUNT = 'Count',
    SUM = 'Sum',
    MIN = 'Min',
    MAX = 'Max',
    DISTINCT = 'Distinct',
    AVERAGE = 'Average',
    MATH = 'MATH',
}

export enum TotalLabel {
    COUNT = 'Count',
    SUM = 'Sum',
    MIN = 'Min',
    MAX = 'Max',
    DISTINCT = 'Distinct',
    AVERAGE = 'Average',
    MATH = 'Formula',
    CANC = 'Cancel',
    CALC = 'Calculate',
}

export enum PaginatorPos {
    TOP = 'Top',
    BOTTOM = 'Bottom',
    BOTH = 'Both',
}

export interface GroupObject {
    column: string;
    visible: boolean;
}

export interface RowAction {
    text: string;
    icon: string;
}

export enum ShowGrid {
    NONE = 'None',
    ROW = 'Row',
    COL = 'Col',
    COMPLETE = 'Complete',
}

// export enum RowActionType {
//     DEFAULT = 'Default',
//     VARIABLE = 'Variable',
// }

export interface KupDataTableCellButtonClick {
    comp: any;
    cell: Cell;
    column: Column;
    row: Row;
}

export interface KupDataTableCellTextFieldInput {
    comp: any;
    cell: Cell;
    column: Column;
    row: Row;
}

//---- *NEXT functionality AKA load more ----
export enum LoadMoreMode {
    CONSTANT = 'constant',
    CONSTANT_INCREMENT = 'constant_increment',
    PROGRESSIVE_THRESHOLD = 'progressive_threshold',
}

//---- Sortable Columns Functionality ----
export const KupDataTableColumnDragType = 'text/kup-data-table-column-drag';
export const KupDataTableColumnDragRemoveType =
    'text/kup-data-table-column-drag-remove';
export const KupDataTableColumnDragGroupType =
    'text/kup-data-table-column-drag-group';
export const KupDataTableRowDragType = 'text/kup-data-table-row-drag';

export interface KupDataTableSortedColumnIndexes {
    receivingColumnIndex: number;
    sortedColumnIndex: number;
}

//---- Group label display functionality ----
/**
 * The possible values the display property can have.
 * @enum
 * @property {string} BOTH - Shows both the column label and the value. This is the default.
 * @property {string} LABEL - Shows only the columns label.
 * @property {string} VALUE - Shows only the value.
 * @readonly
 */
export enum GroupLabelDisplayMode {
    BOTH = 'Both',
    LABEL = 'Label',
    VALUE = 'Value',
}

//---- Fixed rows and cells classes ----
export const FixedCellsClasses = {
    columns: 'fixed-column',
    rows: 'fixed-row',
};

export const FixedCellsCSSVarsBase = {
    columns: '--ddt_column-left-',
    rows: '--ddt_row-top-',
};

export const totalMenuOpenID = 'TOMEOPID';

/**
 * Contains all the data of an event.
 */
export interface EventHandlerDetails {
    area: string;
    cell: Cell;
    column: Column;
    filterRemove: HTMLSpanElement;
    isGroupRow: boolean;
    row: Row;
    td: HTMLTableDataCellElement;
    textfield: HTMLElement;
    th: HTMLTableHeaderCellElement;
    tr: HTMLTableRowElement;
}
/**
 * Constants for mocked/premade columns created by data mutations.
 */
export const fieldColumn: string = 'Field';
export const iconColumn: string = 'Icon';
export const keyColumn: string = 'Key';

export enum SelectionMode {
    SINGLE = 'single',
    MULTIPLE_CHECKBOX = 'multiple-checkbox',
    MULTIPLE = 'multiple',
    NONE = 'none',
}
