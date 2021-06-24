import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    getAssetPath,
    h,
    Host,
    JSX,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';

import moment from 'moment';
import {
    Cell,
    Column,
    FixedCellsClasses,
    FixedCellsCSSVarsBase,
    GroupLabelDisplayMode,
    GroupObject,
    KupDataTableCellButtonClick,
    KupDataTableColumnDragType,
    KupDataTableRowDragType,
    KupDataTableColumnDragRemoveType,
    LoadMoreMode,
    PaginatorPos,
    Row,
    RowAction,
    ShowGrid,
    SortMode,
    SortObject,
    TableData,
    TotalsMap,
    TotalMode,
    KupDataTableCellTextFieldInput,
    totalMenuOpenID,
    TotalLabel,
    EventHandlerDetails,
    KupDataTableProps,
    CellsHolder,
    fieldColumn,
    iconColumn,
    keyColumn,
    SelectionMode,
    KupCellInfo,
    KupDataTableColumnDragGroupType,
} from './kup-data-table-declarations';

import {
    isRating,
    isGauge,
    isKnob,
    getCellType,
    getColumnByName,
    getCellValueForDisplay,
} from '../../utils/cell-utils';

import {
    calcTotals,
    normalizeRows,
    filterRows,
    groupRows,
    paginateRows,
    sortRows,
    styleHasBorderRadius,
    styleHasWritingMode,
    dropHandlersCell,
} from './kup-data-table-helper';

import { GenericObject, KupComponent } from '../../types/GenericTypes';

import {
    stringToNumber,
    numberToFormattedStringNumber,
    identify,
    deepEqual,
    unformattedStringToFormattedStringDate,
    isValidStringDate,
    ISO_DEFAULT_DATE_FORMAT,
} from '../../utils/utils';

import {
    ComponentListElement,
    ItemsDisplayMode,
} from '../kup-list/kup-list-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';

import { KupDataTableState } from './kup-data-table-state';
import { KupStore } from '../kup-state/kup-store';
import { KupTooltip } from '../kup-tooltip/kup-tooltip';
import { setTooltip, unsetTooltip } from '../../utils/helpers';

import {
    setDragEffectAllowed,
    setKetchupDraggable,
    setKetchupDroppable,
    DragHandlers,
    DropHandlers,
    setDragDropPayload,
    getDragDropPayload,
} from '../../utils/drag-and-drop';
import { dragMultipleImg } from '../../assets/images/drag-multiple';
import { FChip } from '../../f-components/f-chip/f-chip';
import { FImage } from '../../f-components/f-image/f-image';
import { FTextField } from '../../f-components/f-text-field/f-text-field';
import { FChipMDC } from '../../f-components/f-chip/f-chip-mdc';
import { FTextFieldMDC } from '../../f-components/f-text-field/f-text-field-mdc';
import {
    FChipData,
    FChipType,
} from '../../f-components/f-chip/f-chip-declarations';
import { FButtonStyling } from '../../f-components/f-button/f-button-declarations';
import { FCheckbox } from '../../f-components/f-checkbox/f-checkbox';
import { FCheckboxMDC } from '../../f-components/f-checkbox/f-checkbox-mdc';
import { FCheckboxProps } from '../../f-components/f-checkbox/f-checkbox-declarations';
import {
    GenericFilter,
    ValueDisplayedValue,
} from '../../utils/filters/filters-declarations';
import { KupColumnMenu } from '../../utils/kup-column-menu/kup-column-menu';
import { FiltersColumnMenu } from '../../utils/filters/filters-column-menu';
import { FiltersRows } from '../../utils/filters/filters-rows';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionElement,
    KupDynamicPositionPlacement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import { KupScrollOnHoverElement } from '../../utils/kup-scroll-on-hover/kup-scroll-on-hover-declarations';
import { CardData, CardFamily } from '../kup-card/kup-card-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import {
    KupLanguageDensity,
    KupLanguageFontsize,
    KupLanguageGeneric,
    KupLanguageGrid,
    KupLanguageKey,
    KupLanguageRow,
    KupLanguageSearch,
    KupLanguageTotals,
} from '../../utils/kup-language/kup-language-declarations';
import { FImageProps } from '../../f-components/f-image/f-image-declarations';
import { KupColumnMenuIds } from '../../utils/kup-column-menu/kup-column-menu-declarations';
import { KupDynamicPositionCoordinates } from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';

@Component({
    tag: 'kup-data-table',
    styleUrl: 'kup-data-table.scss',
    shadow: true,
})
export class KupDataTable {
    //////////////////////////////
    // Begin state stuff
    //////////////////////////////

    @Prop() stateId: string = '';
    @Prop() store: KupStore;

    state: KupDataTableState = new KupDataTableState();

    initWithPersistedState(): void {
        if (this.store && this.stateId) {
            const state = this.store.getState(this.stateId);
            if (state != null) {
                this.kupManager.debug.logMessage(
                    this,
                    'Initializing stateId ' + this.stateId
                );
                // *** PROPS ***
                this.filters = { ...state.filters };
                this.groups = [...state.groups];
                this.expandGroups = state.expandGroups;
                this.groupLabelDisplay = state.groupLabelDisplay;
                this.density = state.density;
                this.enableExtraColumns = state.enableExtraColumns;
                this.enableSortableColumns = state.enableSortableColumns;
                this.forceOneLine = state.forceOneLine;
                this.globalFilter = state.globalFilter;
                this.globalFilterValue = state.globalFilterValue;
                this.headerIsPersistent = state.headerIsPersistent;
                this.lazyLoadRows = state.lazyLoadRows;
                this.loadMoreLimit = state.loadMoreLimit;
                this.selection = state.selection;
                this.rowsPerPage = state.rowsPerPage;
                this.showFilters = state.showFilters;
                this.showGroups = state.showGroups;
                this.showHeader = state.showHeader;
                this.showLoadMore = state.showLoadMore;
                this.sortEnabled = state.sortEnabled;
                this.sort = [...state.sort];
                this.pageSelected = state.pageSelected;
                this.sortableColumnsMutateData =
                    state.sortableColumnsMutateData;
                this.selectRow = state.selectRow;
                this.selectRowsById = state.selectRowsById;
                this.dragEnabled = state.dragEnabled;
                this.dropEnabled = state.dropEnabled;
                this.showFooter = state.showFooter;
                this.totals = { ...state.totals };
            }
        }
    }

    persistState(): void {
        if (this.store && this.stateId) {
            let somethingChanged = false;
            if (!deepEqual(this.state.filters, this.filters)) {
                this.state.filters = { ...this.filters };
                somethingChanged = true;
            }
            if (!deepEqual(this.state.groups, this.groups)) {
                this.state.groups = [...this.groups];
                somethingChanged = true;
            }
            if (!deepEqual(this.state.sort, this.sort)) {
                this.state.sort = [...this.sort];
                somethingChanged = true;
            }
            if (!deepEqual(this.state.expandGroups, this.expandGroups)) {
                this.state.expandGroups = this.expandGroups;
                somethingChanged = true;
            }
            if (
                !deepEqual(this.state.groupLabelDisplay, this.groupLabelDisplay)
            ) {
                this.state.groupLabelDisplay = this.groupLabelDisplay;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.density, this.density)) {
                this.state.density = this.density;
                somethingChanged = true;
            }
            if (
                !deepEqual(
                    this.state.enableExtraColumns,
                    this.enableExtraColumns
                )
            ) {
                this.state.enableExtraColumns = this.enableExtraColumns;
                somethingChanged = true;
            }
            if (
                !deepEqual(
                    this.state.enableSortableColumns,
                    this.enableSortableColumns
                )
            ) {
                this.state.enableSortableColumns = this.enableSortableColumns;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.forceOneLine, this.forceOneLine)) {
                this.state.forceOneLine = this.forceOneLine;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.globalFilter, this.globalFilter)) {
                this.state.globalFilter = this.globalFilter;
                somethingChanged = true;
            }
            if (
                !deepEqual(this.state.globalFilterValue, this.globalFilterValue)
            ) {
                this.state.globalFilterValue = this.globalFilterValue;
                somethingChanged = true;
            }
            if (
                !deepEqual(
                    this.state.headerIsPersistent,
                    this.headerIsPersistent
                )
            ) {
                this.state.headerIsPersistent = this.headerIsPersistent;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.lazyLoadRows, this.lazyLoadRows)) {
                this.state.lazyLoadRows = this.lazyLoadRows;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.loadMoreLimit, this.loadMoreLimit)) {
                this.state.loadMoreLimit = this.loadMoreLimit;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.selection, this.selection)) {
                this.state.selection = this.selection;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.rowsPerPage, this.currentRowsPerPage)) {
                this.state.rowsPerPage = this.currentRowsPerPage;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.showFilters, this.showFilters)) {
                this.state.showFilters = this.showFilters;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.showGroups, this.showGroups)) {
                this.state.showGroups = this.showGroups;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.showHeader, this.showHeader)) {
                this.state.showHeader = this.showHeader;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.showLoadMore, this.showLoadMore)) {
                this.state.showLoadMore = this.showLoadMore;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.sortEnabled, this.sortEnabled)) {
                this.state.sortEnabled = this.sortEnabled;
                somethingChanged = true;
            }
            if (
                !deepEqual(
                    this.state.sortableColumnsMutateData,
                    this.sortableColumnsMutateData
                )
            ) {
                this.state.sortableColumnsMutateData =
                    this.sortableColumnsMutateData;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.pageSelected, this.currentPage)) {
                this.state.pageSelected = this.currentPage;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.dragEnabled, this.dragEnabled)) {
                this.state.dragEnabled = this.dragEnabled;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.dropEnabled, this.dropEnabled)) {
                this.state.dropEnabled = this.dropEnabled;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.showFooter, this.showFooter)) {
                this.state.showFooter = this.showFooter;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.totals, this.totals)) {
                this.state.totals = { ...this.totals };
                somethingChanged = true;
            }
            if (
                !deepEqual(
                    this.state.selectRowsById,
                    this.selectedRows.reduce(
                        (accumulator, row, currentIndex) => {
                            const prefix = currentIndex > 0 ? ';' : '';
                            return accumulator + prefix + row.id;
                        },
                        ''
                    )
                )
            ) {
                this.state.selectRowsById = this.selectedRows.reduce(
                    (accumulator, row, currentIndex) => {
                        const prefix = currentIndex > 0 ? ';' : '';
                        return accumulator + prefix + row.id;
                    },
                    ''
                );
                somethingChanged = true;
            }

            if (!this.state.load) {
                this.state.load = true;
                return;
            }

            if (somethingChanged) {
                this.kupManager.debug.logMessage(
                    this,
                    'Persisting stateId ' + this.stateId
                );
                this.store.persistState(this.stateId, this.state);
            }
        }
    }

    //////////////////////////////
    // End state stuff
    //////////////////////////////

    @Element() rootElement: HTMLElement;

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * The data of the table.
     */
    @Prop() data: TableData;
    /**
     * The density of the rows, defaults at 'medium' and can be also set to 'large' or 'small'.
     */
    @Prop() density: string = 'dense';
    /**
     * Enable row dragging
     */
    @Prop() dragEnabled: boolean = false;
    /**
     * Enable record dropping
     */
    @Prop() dropEnabled: boolean = false;
    /**
     * When set to true, editable cells will be rendered using input components.
     * @default false
     */
    @Prop() editableData: boolean = false;
    /**
     * Defines the label to show when the table is empty.
     */
    @Prop({ mutable: true }) emptyDataLabel: string = null;
    /**
     * Enables the extracolumns add buttons.
     */
    @Prop() enableExtraColumns: boolean = true;
    /**
     * Enables the sorting of columns by dragging them into different columns.
     */
    @Prop() enableSortableColumns: boolean = true;
    /**
     * Expands groups when set to true.
     */
    @Prop() expandGroups: boolean = false;
    /**
     * List of filters set by the user.
     */
    @Prop({ mutable: true }) filters: GenericFilter = {};
    /**
     * Fixes the given number of columns so that they stay visible when horizontally scrolling the data-table.
     * If grouping is active or the value of the prop is <= 0, this prop will have no effect.
     * Can be combined with fixedRows.
     * @see fixedRows
     */
    @Prop() fixedColumns: number = 0;
    /**
     * Fixes the given number of rows so that they stay visible when vertically scrolling the data-table.
     * If grouping is active or the value of the prop is <= 0, this prop will have no effect.
     * Can be combined with fixedColumns.
     * @see fixedColumns
     */
    @Prop() fixedRows: number = 0;
    /**
     * Forces cells with long text and a fixed column size to have an ellipsis set on their text.
     * The reflect attribute is mandatory to allow styling.
     */
    @Prop({ reflect: true }) forceOneLine: boolean = false;
    /**
     * When set to true it activates the global filter.
     */
    @Prop() globalFilter: boolean = false;
    /**
     * The value of the global filter.
     */
    @Prop({ reflect: true, mutable: true }) globalFilterValue = '';
    /**
     * How the label of a group must be displayed.
     * For available values [see here]{@link GroupLabelDisplayMode}
     */
    @Prop() groupLabelDisplay: GroupLabelDisplayMode =
        GroupLabelDisplayMode.BOTH;
    /**
     * The list of groups.
     */
    @Prop({ mutable: true }) groups: Array<GroupObject> = [];
    /**
     * When set to true the header will stick on top of the table when scrolling.
     */
    @Prop() headerIsPersistent = true;
    /**
     * When set to true, clicked-on rows will have a visual feedback.
     * @default false
     */
    @Prop() isFocusable: boolean = false;
    /**
     * When set to true, extra rows will be automatically loaded once the last row enters the viewport. When groups are present, the number of rows is referred to groups and not to their content. Paginator is disabled.
     */
    @Prop() lazyLoadRows: boolean = false;
    /**
     * Defines the placeholder character which will be replaced by a line break inside table header cells, normal or sticky.
     */
    @Prop() lineBreakCharacter: string = '\n';
    /**
     * Sets a maximum limit of new records which can be required by the load more functionality.
     */
    @Prop() loadMoreLimit: number = 1000;
    /**
     * Establish the modality of how many new records will be downloaded.
     *
     * This property is regulated also by loadMoreStep.
     * @see loadMoreStep
     * @see loadMoreLimit
     */
    @Prop() loadMoreMode: LoadMoreMode = LoadMoreMode.PROGRESSIVE_THRESHOLD;
    /**
     * The number of records which will be requested to be downloaded when clicking on the load more button.
     *
     * This property is regulated also by loadMoreMode.
     * @see loadMoreMode
     * @see loadMoreLimit
     */
    @Prop() loadMoreStep: number = 60;
    /**
     * Current selected page set on component load
     */
    @Prop() pageSelected: number = -1;
    /**
     * Sets the position of the paginator. Available positions: top, bottom or both.
     */
    @Prop() paginatorPos: PaginatorPos = PaginatorPos.TOP;
    /**
     * Sets the possibility to remove the selected column.
     */
    @Prop() removableColumns: boolean = false;
    /**
     * Sets the actions of the rows.
     */
    @Prop() rowActions: Array<RowAction>;
    /**
     * Sets the number of rows per page to display.
     */
    @Prop() rowsPerPage = 10;
    /**
     * Activates the scroll on hover function.
     */
    @Prop() scrollOnHover: boolean = false;
    /**
     * Set the type of the rows selection.
     */
    @Prop() selection: SelectionMode = SelectionMode.SINGLE;
    /**
     * Selects the row at the specified rendered rows prosition (base 1).
     */
    @Prop() selectRow: number;
    /**
     * Semicolon separated rows id to select.
     */
    @Prop() selectRowsById: string;
    /**
     * If set to true, displays the button to open the customization panel.
     */
    @Prop() showCustomization: boolean = true;
    /**
     * When set to true enables the column filters.
     */
    @Prop() showFilters: boolean = false;
    /**
     * When set to true enables the column grouping.
     */
    @Prop() showGroups: boolean = false;
    /**
     * When set to true shows the footer.
     */
    @Prop() showFooter: boolean = false;
    /**
     * Can be used to customize the grid view of the table.
     */
    @Prop() showGrid: ShowGrid = ShowGrid.ROW;
    /**
     * Enables rendering of the table header.
     * @namespace KupDataTable.showHeader
     */
    @Prop() showHeader: boolean = true;
    /**
     * If set to true, displays the button to load more records.
     */
    @Prop() showLoadMore: boolean = false;
    /**
     * If set to true, displays tooltip on right click; if set to false, displays tooltip on mouseOver.
     */
    @Prop() showTooltipOnRightClick: boolean = true;
    /**
     * Defines the current sorting options.
     */
    @Prop({ mutable: true }) sort: Array<SortObject> = [];
    /**
     * If set to true, when a column is dragged to be sorted, the component directly mutates the data.columns property
     * and then fires the event
     */
    @Prop() sortableColumnsMutateData: boolean = true;
    /**
     * When set to true enables the sorting of the columns.
     */
    @Prop() sortEnabled = true;
    /**
     * Sets the height of the table.
     */
    @Prop() tableHeight: string = undefined;
    /**
     * Sets the width of the table.
     */
    @Prop() tableWidth: string = undefined;
    /**
     * Defines the timeout for tooltip detail
     */
    @Prop() tooltipDetailTimeout: number;
    /**
     * Enable show tooltip
     */
    @Prop() tooltipEnabled: boolean = true;
    /**
     * Defines the timeout for tooltip load
     */
    @Prop() tooltipLoadTimeout: number;
    /**
     * Defines the current totals options
     */
    @Prop() totals: TotalsMap;
    /**
     * Transposes the data of the data table
     */
    @Prop() transpose: boolean = false;

    //-------- State --------

    @State()
    private lazyLoadCells = false;

    @State()
    private currentPage = 1;

    @State()
    private currentRowsPerPage = 10;

    @State()
    private selectedRows: Array<Row> = [];

    @State()
    private selectedColumn: string;

    @State()
    private columnMenuAnchor: string = null;

    @State()
    private groupState: {
        [index: string]: {
            expanded: boolean;
        };
    } = {};

    /**
     * name of the column with the opened total menu
     */
    @State()
    private openedTotalMenu: string = null;

    /**
     * name of the column with the opened group menu
     */
    @State()
    private openedGroupMenu: string = null;

    @State()
    private openedCustomSettings: boolean = false;

    @State()
    private fontsize: string = 'medium';

    /**
     * This is a flag to be used for the draggable columns to force rerender
     * by changing the internal state.
     */
    @State()
    private triggerColumnSortRerender = false;

    @Watch('rowsPerPage')
    rowsPerPageHandler(newValue: number) {
        this.currentRowsPerPage = newValue;
    }

    @Watch('expandGroups')
    expandGroupsHandler() {
        if (!this.isRestoringState) {
            this.recalculateRows();
            // reset group state
            this.groupState = {};
            this.forceGroupExpansion();
        }
    }

    @Watch('filters')
    @Watch('globalFilterValue')
    filtersChanged() {
        this.expandGroupsHandler();
    }

    @Watch('sort')
    @Watch('rowsPerPage')
    @Watch('totals')
    @Watch('currentPage')
    @Watch('currentRowsPerPage')
    recalculateRows() {
        if (!this.isRestoringState) {
            this.initRows();
        }
    }

    @Watch('data')
    identifyAndInitRows() {
        identify(this.getRows());
        this.expandGroupsHandler();
        this.resetSelectedRows();
    }

    @Watch('groups')
    recalculateRowsAndUndoSelections() {
        if (!this.isRestoringState) {
            this.recalculateRows();
            // reset group state
            this.groupState = {};
            this.forceGroupExpansion();
            this.resetSelectedRows();
        }
    }

    @Watch('fixedColumns')
    @Watch('fixedRows')
    controlFixedRowsColumns() {
        let warnMessage = '';

        if (isNaN(this.fixedColumns) || this.fixedColumns < 0) {
            warnMessage += `The value ${this.fixedColumns} set on fixedColumns property is not valid.`;
        }

        if (isNaN(this.fixedRows) || this.fixedRows < 0) {
            warnMessage += `The value ${this.fixedRows} set on fixedRows property is not valid.`;
        }

        if (warnMessage && console) {
            console.warn(warnMessage + 'Any fixed rule will be ignored.');
        }
    }

    @Watch('transpose')
    recalculateData() {
        this.calculateData();
    }

    private rows: Array<Row>;
    private rowsLength: number = 0;

    private paginatedRows: Array<Row>;
    private paginatedRowsLength: number = 0;

    private footer: { [index: string]: any }; // TODO change any
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    private renderedRows: Array<Row> = [];

    private loadMoreEventCounter: number = 0;

    private loadMoreEventPreviousQuantity: number = 0;

    /**
     * Internal not reactive state used to keep track if a column is being dragged.
     * @private
     */
    private columnsAreBeingDragged: boolean = false;

    /**
     * Attribute to set when a column is being dragged on the whole thead element
     * @const
     * @default 'columns-dragging'
     * @private
     */
    private dragFlagAttribute: string = 'columns-dragging';

    /**
     * The string representing the drag over attribute
     * @const
     * @default 'drag-over'
     * @private
     */
    private dragOverAttribute: string = 'drag-over';

    /**
     * The string representing the drag starter attribute to set onto the element
     * @const
     * @default 'drag-starter'
     * @private
     */
    private dragStarterAttribute: string = 'drag-starter';

    /**
     * Reference for the thead element
     * @private
     */
    private theadRef: any;
    private tableRef: HTMLTableElement;

    private tooltip: KupTooltip;

    /**
     * contains the original data, used in transposed function
     * @private
     */
    private originalData: TableData = undefined;

    /**
     * Reference to the working area of the table. This is the below-wrapper reference.
     */
    private tableAreaRef: KupScrollOnHoverElement;
    private stickyTheadRef: any;
    private customizeTopButtonRef: any;
    private customizeBottomButtonRef: any;
    private customizeTopPanelRef: any;
    private customizeBottomPanelRef: any;
    private sizedColumns: Column[] = undefined;
    private intObserver: IntersectionObserver = undefined;
    private navBarHeight: number = 0;
    private theadIntersecting: boolean = false;
    private tableIntersecting: boolean = false;
    private iconPaths: [{ icon: string; path: string }] = undefined;
    private isSafariBrowser: boolean = false;
    private isRestoringState: boolean = false;
    private globalFilterTimeout: number;
    private totalMenuCoords: KupDynamicPositionCoordinates = null;
    columnFilterTimeout: number;
    private clickTimeout: ReturnType<typeof setTimeout>[] = [];
    /**
     * Used to prevent too many resizes callbacks at once.
     */
    private resizeTimeout: number;
    private columnMenuInstance: KupColumnMenu;
    private filtersColumnMenuInstance: FiltersColumnMenu;
    private filtersRowsInstance: FiltersRows;
    /**
     * Reference to the row detail card.
     */
    private detailCard: HTMLKupCardElement = null;
    /**
     * Reference to the column menu card.
     */
    private columnMenuCard: HTMLKupCardElement = null;

    /**
     * When component unload is complete
     */
    @Event({
        eventName: 'kupDidUnload',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDidUnload: EventEmitter<{ comp: KupDataTable }>;

    /**
     * When component load is complete
     */
    @Event({
        eventName: 'kupDidLoad',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDidLoad: EventEmitter<{ comp: KupDataTable }>;

    /**
     * When rows selections reset
     */
    @Event({
        eventName: 'kupResetSelectedRows',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupResetSelectedRows: EventEmitter<{ comp: KupDataTable }>;

    /**
     * When a row is auto selected via selectRow prop
     */
    @Event({
        eventName: 'kupAutoRowSelect',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupAutoRowSelect: EventEmitter<{
        comp: KupDataTable;
        selectedRow: Row;
    }>;

    /**
     * When a row is selected
     */
    @Event({
        eventName: 'kupRowSelected',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupRowSelected: EventEmitter<{
        comp: KupDataTable;
        selectedRows: Array<Row>;
        clickedRow: Row;
        clickedColumn: string;
    }>;
    /**
     * Emitted when a cell's data has been updated.
     */
    @Event({
        eventName: 'kupDataTableCellUpdate',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDataTableCellUpdate: EventEmitter<{
        comp: KupDataTable;
        cell: Cell;
        column: Column;
        id: string;
        row: Row;
        event: any;
    }>;
    /**
     * Generic click event on data table.
     */
    @Event({
        eventName: 'kupDataTableClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDataTableClick: EventEmitter<{
        comp: KupDataTable;
        details: EventHandlerDetails;
    }>;
    /**
     * Generic right click event on data table.
     */
    @Event({
        eventName: 'kupDataTableContextMenu',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDataTableContextMenu: EventEmitter<{
        comp: KupDataTable;
        details: EventHandlerDetails;
    }>;
    /**
     * Generic double click event on data table.
     */
    @Event({
        eventName: 'kupDataTableDblClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDataTableDblClick: EventEmitter<{
        comp: KupDataTable;
        details: EventHandlerDetails;
    }>;
    /**
     * When the column menu is being opened/closed.
     */
    @Event({
        eventName: 'kupDataTableColumnMenu',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDataTableColumnMenu: EventEmitter<{
        comp: KupDataTable;
        card: HTMLKupCardElement;
        open: boolean;
    }>;
    /**
     * When cell option is clicked
     */
    @Event({
        eventName: 'kupOptionClicked',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupOptionClicked: EventEmitter<{
        comp: KupDataTable;
        column: string;
        row: Row;
    }>;

    /**
     * When 'add column' menu item is clicked
     */
    @Event({
        eventName: 'kupAddColumn',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupAddColumn: EventEmitter<{ column: string; comp: KupDataTable }>;

    @Event({
        eventName: 'kupAddCodeDecodeColumn',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupAddCodeDecodeColumn: EventEmitter<{
        column: string;
    }>;

    /**
     * When a row action is clicked
     */
    @Event({
        eventName: 'kupRowActionClicked',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupRowActionClicked: EventEmitter<{
        comp: KupDataTable;
        type: 'default' | 'variable' | 'expander';
        row: Row;
        action?: RowAction;
        index?: number;
    }>;

    @Event({
        eventName: 'kupLoadMoreClicked',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupLoadMoreClicked: EventEmitter<{
        comp: KupDataTable;
        loadItems: number;
    }>;

    @Event({
        eventName: 'kupCellButtonClicked',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCellButtonClicked: EventEmitter<KupDataTableCellButtonClick>;

    @Event({
        eventName: 'kupCellTextFieldInput',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCellTextFieldInput: EventEmitter<KupDataTableCellTextFieldInput>;
    /**
     * This method is invoked by KupManager whenever the component changes size.
     */
    @Method()
    async resizeCallback(): Promise<void> {
        if (this.lazyLoadCells) {
            window.clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(() => this.refresh(), 300);
        }
    }
    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        let props: GenericObject = {};
        if (descriptions) {
            props = KupDataTableProps;
        } else {
            for (const key in KupDataTableProps) {
                if (
                    Object.prototype.hasOwnProperty.call(KupDataTableProps, key)
                ) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }
    /**
     * Opens the column menu of the given column.
     * @param {string} column - Name of the column.
     */
    @Method()
    async openColumnMenu(column: string): Promise<void> {
        this.columnMenuAnchor = column;
        this.columnMenuCard.setAttribute('data-column', column);
        this.columnMenuCard.data = this.columnMenuInstance.prepData(
            this,
            getColumnByName(this.getVisibleColumns(), column)
        );
        this.columnMenuInstance.open(this, column, this.tooltip);
        this.columnMenuInstance.reposition(this);
        this.kupDataTableColumnMenu.emit({
            comp: this,
            card: this.columnMenuCard,
            open: true,
        });
    }
    /**
     * Closes any opened column menu.
     */
    @Method()
    async closeColumnMenu(): Promise<void> {
        this.columnMenuAnchor = null;
        this.columnMenuInstance.close(this.columnMenuCard);
        this.kupDataTableColumnMenu.emit({
            comp: this,
            card: this.columnMenuCard,
            open: false,
        });
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }
    /**
     * This method will set the selected rows of the component.
     * @param {string} rowsById - String containing the ids separated by ";".
     * @param {boolean} emitEvent - The event will always be emitted unless emitEvent is set to false.
     */
    @Method()
    async setSelectedRows(
        rowsById: string,
        emitEvent?: boolean
    ): Promise<void> {
        this.selectedRows = [];
        if (rowsById) {
            this.selectedRows = this.renderedRows.filter((r) => {
                return rowsById.split(';').indexOf(r.id) >= 0;
            });
        }

        if (emitEvent !== false) {
            this.kupRowSelected.emit({
                comp: this,
                selectedRows: this.selectedRows,
                clickedColumn: null,
                clickedRow: null,
            });
        }
    }

    @Method()
    async expandAll() {
        this.expandGroups = true;
    }

    @Method()
    async collapseAll() {
        this.expandGroups = false;
    }

    private calculateData() {
        if (!this.transpose) {
            // restore
            if (this.originalData) {
                this.data = { ...this.originalData };
            }
        } else {
            // transpose
            this.setTransposedData();
        }
    }

    private setTransposedData(): void {
        // transpose
        this.originalData = { ...this.data };
        if (this.data.columns.length > 0) {
            this.data = this.getTransposedData(this.data.columns[0]);
        }
    }

    private switchToTotalsMatrix(): void {
        if (this.rows.length === 0 || !this.rows[0].group) return;
        // calc totals matrix data
        const totalsMatrixData: TableData = {};
        // calc columns id
        // note that the sorting of the columns depends on the totals selection
        // the first column is the one that is selected first in the totals, and so on...
        const ids: Array<string> = [];
        ids.push(this.rows[0].group.column);
        Object.keys(this.rows[0].group.totals).forEach((columnKey) => {
            if (this.rows[0].group.column !== columnKey) ids.push(columnKey);
        });
        // calc columns
        const totalsMatrixColumns: Array<Column> = [];
        ids.forEach((id) => {
            this.data.columns.forEach((column) => {
                if (column.name === id) {
                    const currentColumn = { ...column };
                    const totalMode = this.totals[currentColumn.name];
                    if (totalMode) {
                        if (totalMode.startsWith(TotalMode.MATH)) {
                            currentColumn.title =
                                TotalLabel[TotalMode.MATH] +
                                ' ' +
                                currentColumn.title;
                        } else {
                            const totalModeKey = Object.keys(TotalMode).find(
                                (key) => TotalMode[key] === totalMode
                            );
                            if (totalModeKey) {
                                currentColumn.title =
                                    TotalLabel[totalModeKey] +
                                    ' ' +
                                    currentColumn.title;
                            } else {
                                currentColumn.title =
                                    totalMode + ' ' + currentColumn.title;
                            }
                        }
                        this.setObjForTotalsMatrix(currentColumn, this.totals);
                    }
                    totalsMatrixColumns.push(currentColumn);
                }
            });
        });
        // set columns
        totalsMatrixData.columns = totalsMatrixColumns;
        // calc rows
        const totalsMatrixRows: Array<Row> = [];
        let index = 0;
        this.rows.forEach((row) => {
            const cells: CellsHolder = {};
            ids.forEach((id) => {
                let totalValue = row.group.totals[id];
                if (!totalValue) {
                    totalValue = row.group.id;
                }
                if (isValidStringDate(totalValue, ISO_DEFAULT_DATE_FORMAT)) {
                    totalValue = moment(totalValue).format(
                        ISO_DEFAULT_DATE_FORMAT
                    );
                }
                cells[id] = {
                    value: String(totalValue),
                };
            });
            totalsMatrixRows.push({
                id: String(index),
                cells,
            });
            index++;
        });
        // set rows
        totalsMatrixData.rows = totalsMatrixRows;
        // reset groups
        this.groups = [];
        // update data
        this.data = { ...totalsMatrixData };
        // console.log(this.data);
        // calc totals
        // distinct becomes count
        // count becomes sum
        const updatedTotals: TotalsMap = {};
        Object.keys(this.totals).forEach((key) => {
            switch (this.totals[key]) {
                case TotalMode.DISTINCT:
                    updatedTotals[key] = TotalMode.COUNT;
                    break;
                case TotalMode.COUNT:
                    updatedTotals[key] = TotalMode.SUM;
                    break;
                default:
                    updatedTotals[key] = this.totals[key];
                    break;
            }
        });
        // update totals
        this.totals = { ...updatedTotals };
    }

    // TODO
    // this is momentary
    private setObjForTotalsMatrix(column: Column, totals: TotalsMap): void {
        const obj = column.obj;
        const totalMode = totals[column.name];
        if (this.kupManager.objects.isDate(obj)) {
            // check if min or max totals mode
            if (totalMode === TotalMode.MAX || totalMode === TotalMode.MIN) {
                return;
            }
        } else if (this.kupManager.objects.isNumber(obj)) {
            // check if percentage
            if (obj.p && obj.p.toUpperCase() === 'P') {
                if (
                    totalMode !== TotalMode.COUNT &&
                    totalMode !== TotalMode.DISTINCT
                ) {
                    return;
                }
            }
        }
        // force obj number
        column.obj = {
            t: 'NR',
            p: '',
            k: '',
        };
        if (column.icon) {
            delete column.icon;
        }
    }

    private getTransposedData(column?: Column): TableData {
        const transposedData: TableData = {};
        // TODO manage better the filters, this is just a fix in order to release the function
        if (column) {
            this.filters = {};
        }
        // calc columns
        const columns: Array<Column> = [];
        // first item
        let firstHead: Column = null;
        if (column) {
            firstHead = column;
            columns.push(firstHead);
            this.data.rows.forEach((row) => {
                columns.push(
                    this.getColumnFromCell(row.cells[firstHead.name], row.id)
                );
            });
        } else {
            firstHead = { name: fieldColumn.toUpperCase(), title: fieldColumn };
            columns.push(firstHead);
            for (let index = 0; index < this.data.rows.length; index++) {
                columns.push({
                    name: this.data.rows[index].id,
                    title: '#' + index,
                });
            }
        }
        // fill columns with the cells in the first original column
        // set columns
        transposedData.columns = columns;
        // calc rows
        const rows: Array<Row> = [];
        for (
            let index = column ? 1 : 0;
            index < this.data.columns.length;
            index++
        ) {
            const oldColumn = this.data.columns[index];
            const cells: CellsHolder = {};
            // set first cell from previous columns
            // TODO set obj? like this --> obj: oldColumn.obj
            cells[firstHead.name] = {
                value: oldColumn.title,
            };

            for (
                let index = 1;
                index < transposedData.columns.length;
                index++
            ) {
                const newColumn = transposedData.columns[index];
                const oldRow = this.data.rows[index - 1];
                const cellName: string = column ? newColumn.name : oldRow.id;
                cells[cellName] = oldRow.cells[oldColumn.name];
                if (oldColumn.icon && !cells[cellName].icon) {
                    cells[cellName].icon = oldColumn.icon;
                }
                if (oldColumn.shape && !cells[cellName].shape) {
                    cells[cellName].shape = oldColumn.icon;
                }
            }
            // If a record is key and no column argument is provided, it will be placed on top
            if (!column && oldColumn.isKey) {
                rows.unshift({
                    id: String(index),
                    cells,
                    name: oldColumn.name,
                });
            } else {
                rows.push({
                    id: String(index),
                    cells,
                    name: oldColumn.name,
                });
            }
        }
        // set rows
        transposedData.rows = rows;
        // return
        return transposedData;
    }

    private getColumnFromCell(cell: Cell, id: string): Column {
        const title = cell.displayedValue ? cell.displayedValue : cell.value;
        // TODO set obj? like this --> obj: cell.obj
        return {
            name: cell.value + '_' + id,
            title,
        };
    }

    private stickyHeaderPosition = () => {
        if (this.tableRef) {
            if (this.tableIntersecting) {
                if (!this.theadIntersecting) {
                    this.updateStickyHeaderSize();
                    this.stickyTheadRef.classList.add('activated');
                } else {
                    this.stickyTheadRef.classList.remove('activated');
                }
            } else {
                this.stickyTheadRef.classList.remove('activated');
            }
        }
    };

    private updateStickyHeaderSize() {
        const navBar: Element = document.querySelectorAll('.header')[0];
        if (navBar) {
            this.navBarHeight = navBar.clientHeight;
        } else {
            this.navBarHeight = 0;
        }
        this.stickyTheadRef.style.top = this.navBarHeight + 'px';
        const widthTable: number = this.tableAreaRef.offsetWidth;
        this.stickyTheadRef.style.maxWidth = widthTable + 'px';
        const thCollection: any = this.theadRef.querySelectorAll('th');
        const thStickyCollection: any =
            this.stickyTheadRef.querySelectorAll('th-sticky');
        for (let i = 0; i < thCollection.length; i++) {
            const widthTH = thCollection[i].offsetWidth;
            thStickyCollection[i].style.width = widthTH + 'px';
        }
    }

    private setObserver() {
        const callback: IntersectionObserverCallback = (
            entries: IntersectionObserverEntry[]
        ) => {
            entries.forEach((entry) => {
                if (entry.target.tagName === 'TR') {
                    if (entry.isIntersecting) {
                        this.kupManager.debug.logMessage(
                            this,
                            'Last row entering the viewport, loading more elements.'
                        );
                        const delta =
                            this.rows.length - this.currentRowsPerPage;
                        if (delta < this.loadMoreStep) {
                            this.currentRowsPerPage += delta;
                        } else {
                            this.currentRowsPerPage += this.loadMoreStep;
                        }
                        entry.target.classList.remove('last-row');
                    }
                }
                if (entry.target.tagName === 'THEAD') {
                    if (entry.isIntersecting) {
                        this.theadIntersecting = true;
                    } else if (
                        entry.boundingClientRect.bottom > this.navBarHeight
                    ) {
                        //If the thead is not intersecting but it still is inside the viewport, is to be considered intersected
                        this.theadIntersecting = true;
                    } else {
                        this.theadIntersecting = false;
                    }
                }
                if (entry.target.tagName === 'TABLE') {
                    if (entry.isIntersecting) {
                        this.tableIntersecting = true;
                    } else {
                        this.tableIntersecting = false;
                    }
                }
                if (
                    this.tableHeight === undefined &&
                    this.tableWidth === undefined &&
                    this.headerIsPersistent
                ) {
                    this.stickyHeaderPosition();
                }
            });
        };
        const options: IntersectionObserverInit = {
            threshold: 0,
            rootMargin: '-' + this.navBarHeight + 'px 0px 0px 0px',
        };
        this.intObserver = new IntersectionObserver(callback, options);
    }

    private didRenderObservers() {
        const rows = this.rootElement.shadowRoot.querySelectorAll('tbody > tr');
        if (this.paginatedRowsLength < this.rowsLength && this.lazyLoadRows) {
            this.intObserver.observe(rows[this.paginatedRowsLength - 1]);
        }
    }

    private didLoadObservers() {
        if (
            this.headerIsPersistent &&
            this.tableHeight === undefined &&
            this.tableWidth === undefined
        ) {
            this.intObserver.observe(this.tableRef);
            this.intObserver.observe(this.theadRef);
        }
    }

    private didLoadEventHandling() {
        this.tableAreaRef.addEventListener('scroll', () =>
            this.scrollStickyHeader()
        );
    }

    private scrollStickyHeader() {
        if (!this.stickyTheadRef) {
            return;
        }
        this.stickyTheadRef.scrollLeft = this.tableAreaRef.scrollLeft;
    }

    private checkScrollOnHover() {
        if (!this.kupManager.scrollOnHover.isRegistered(this.tableAreaRef)) {
            if (
                this.scrollOnHover &&
                this.tableHeight === undefined &&
                this.tableWidth === undefined
            ) {
                this.kupManager.scrollOnHover.register(this.tableAreaRef);
            }
        } else {
            if (
                !this.scrollOnHover &&
                (this.tableHeight !== undefined ||
                    this.tableWidth !== undefined)
            ) {
                this.kupManager.scrollOnHover.unregister(this.tableAreaRef);
            }
        }
    }

    private customizePanelPosition() {
        if (this.customizeTopButtonRef) {
            this.kupManager.dynamicPosition.register(
                this.customizeTopPanelRef,
                this.customizeTopButtonRef
            );
        }
        if (this.customizeBottomButtonRef) {
            this.kupManager.dynamicPosition.register(
                this.customizeBottomPanelRef,
                this.customizeBottomButtonRef
            );
        }
    }

    private rowsPointLength(): number {
        return this._rowsLength(this.rows);
    }

    private paginatedRowsPointLength(): number {
        return this._rowsLength(this.paginatedRows);
    }

    private _rowsLength(r: Array<Row>): number {
        if (r == null) {
            return 0;
        }
        let count = 0;
        for (let i: number = 0; i < r.length; i++) {
            const row = r[i];
            if (row == null) {
                continue;
            }
            count += 1;
            if (row.group != null) {
                count += this._rowsLength(row.group.children);
            }
        }
        return count;
    }

    private setEvents() {
        const root: ShadowRoot = this.rootElement.shadowRoot;

        if (root) {
            //Row checkboxes
            const checkboxes: NodeListOf<HTMLElement> = root.querySelectorAll(
                'td .f-checkbox--wrapper'
            );
            for (let index = 0; index < checkboxes.length; index++) {
                const inputEl: HTMLInputElement =
                    checkboxes[index].querySelector('input');
                if (inputEl) {
                    inputEl.onchange = (e: Event) =>
                        this.cellUpdate(
                            e,
                            (e.target as HTMLInputElement).value,
                            checkboxes[index]['data-cell'],
                            checkboxes[index]['data-column'],
                            checkboxes[index]['data-row']
                        );
                }
                FCheckboxMDC(checkboxes[index]);
            }
            //Row textfields
            const textfields: NodeListOf<HTMLElement> = root.querySelectorAll(
                'td .f-text-field--wrapper'
            );
            for (let index = 0; index < textfields.length; index++) {
                const inputEl: HTMLInputElement =
                    textfields[index].querySelector('input');
                if (inputEl) {
                    inputEl.onblur = (e: FocusEvent) =>
                        this.cellUpdate(
                            e,
                            (e.target as HTMLInputElement).value,
                            textfields[index]['data-cell'],
                            textfields[index]['data-column'],
                            textfields[index]['data-row']
                        );
                    inputEl.onchange = (e: Event) =>
                        this.cellUpdate(
                            e,
                            (e.target as HTMLInputElement).value,
                            textfields[index]['data-cell'],
                            textfields[index]['data-column'],
                            textfields[index]['data-row']
                        );
                }
                FTextFieldMDC(textfields[index]);
            }
            //Row multiselection checkboxes
            const multiselectionCheckboxes: NodeListOf<HTMLElement> =
                root.querySelectorAll(
                    'td[row-select-cell] .f-checkbox--wrapper'
                );
            for (
                let index = 0;
                index < multiselectionCheckboxes.length;
                index++
            ) {
                const checkboxEl: HTMLInputElement =
                    multiselectionCheckboxes[index].querySelector('input');
                if (checkboxEl) {
                    checkboxEl.onchange = () =>
                        this.handleRowSelect(
                            multiselectionCheckboxes[index]['data-row']
                        );
                }
                FCheckboxMDC(multiselectionCheckboxes[index] as HTMLElement);
            }
            //Row actions: expander
            const expanderRowActions: NodeListOf<HTMLElement> =
                root.querySelectorAll(
                    '[row-action-cell] .f-image--wrapper.expander'
                );
            for (let index = 0; index < expanderRowActions.length; index++) {
                (expanderRowActions[index] as HTMLElement).onclick = (
                    e: MouseEvent
                ) =>
                    this.onRowActionExpanderClick(
                        e,
                        expanderRowActions[index]['data-row']
                    );
            }
            //Row actions: actions
            const rowActions: NodeListOf<HTMLElement> = root.querySelectorAll(
                '[row-action-cell] .f-image--wrapper.action'
            );
            for (let index = 0; index < rowActions.length; index++) {
                rowActions[index].onclick = () =>
                    this.onDefaultRowActionClick(
                        rowActions[index]['data-action']
                    );
            }
            //Groups chip set
            const groupChip: HTMLElement = root.querySelector(
                '#group-chips.f-chip--wrapper'
            );
            if (groupChip) {
                const chips: NodeListOf<HTMLElement> =
                    groupChip.querySelectorAll('.mdc-chip');
                for (let index = 0; index < chips.length; index++) {
                    const cancelIcon: HTMLElement = chips[index].querySelector(
                        '.mdc-chip__icon.clear'
                    );
                    if (cancelIcon) {
                        cancelIcon.onclick = () => this.removeGroup(index);
                    }
                }
                FChipMDC(groupChip);
            }
            //Global filter text field
            const globalFilter: HTMLElement = root.querySelector(
                '#global-filter .f-text-field--wrapper'
            );
            if (globalFilter) {
                const globalFilterInput: HTMLInputElement =
                    globalFilter.querySelector('input');
                const globalFilterClear: HTMLElement =
                    globalFilter.querySelector('.clear');
                globalFilterInput.oninput = (event) => {
                    const t: EventTarget = event.target;
                    window.clearTimeout(this.globalFilterTimeout);
                    this.globalFilterTimeout = window.setTimeout(
                        () => this.onGlobalFilterChange(t),
                        600,
                        t
                    );
                };
                if (globalFilterClear) {
                    globalFilterClear.onclick = () =>
                        this.onGlobalFilterChange(null);
                }
                FTextFieldMDC(globalFilter);
            }
        }
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
        this.kupManager.theme.register(this);
        this.kupManager.toolbar.register(this.rootElement);
        if (!this.emptyDataLabel) {
            this.emptyDataLabel = this.kupManager.language.translate(
                KupLanguageGeneric.EMPTY_DATA
            );
        }
        this.columnMenuInstance = new KupColumnMenu();
        this.filtersColumnMenuInstance = new FiltersColumnMenu();
        this.filtersRowsInstance = new FiltersRows();

        this.isRestoringState = true;
        // *** Store
        this.initWithPersistedState();
        // ***
        if (this.pageSelected > 0) {
            this.currentPage = this.pageSelected;
        }
        this.currentRowsPerPage = this.rowsPerPage;
        this.isRestoringState = false;

        //this.identifyAndInitRows();
        identify(this.getRows());
        this.expandGroupsHandler();

        if (document.querySelectorAll('.header')[0]) {
            this.navBarHeight =
                document.querySelectorAll('.header')[0].clientHeight;
        } else {
            this.navBarHeight = 0;
        }
        this.setObserver();

        //this.recalculateRows();

        // Detects is the browser is Safari. If needed, this function can be moved into an external file and then imported into components
        this.isSafariBrowser =
            CSS.supports('position', '-webkit-sticky') ||
            !!(window && (window as Window & { safari?: object }).safari);

        this.calculateData();
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        if (this.showCustomization) {
            this.customizePanelPosition();
        }
        this.totalMenuPosition();
        // TODO
        // this.groupMenuPosition();
        this.checkScrollOnHover();
        this.didRenderObservers();
        this.hideShowColumnDropArea(false);
        this.setEvents();

        if (
            this.headerIsPersistent &&
            this.tableHeight === undefined &&
            this.tableWidth === undefined
        ) {
            this.updateStickyHeaderSize();
        }

        setTimeout(() => this.updateFixedRowsAndColumnsCssVariables(), 50);
        // *** Store
        if (this.lazyLoadCells) {
            this.persistState();
        }
        // ***
        this.kupManager.debug.logRender(this, true);
    }

    componentDidLoad() {
        this.didLoadObservers();
        this.didLoadEventHandling();

        // automatic row selection
        if (this.selectRowsById) {
            this.setSelectedRows(this.selectRowsById);
        } else if (this.selectRow && this.selectRow > 0) {
            if (this.selectRow <= this.renderedRows.length) {
                this.selectedRows = [];
                this.selectedRows.push(this.renderedRows[this.selectRow - 1]);
                this.kupAutoRowSelect.emit({
                    comp: this,
                    selectedRow: this.selectedRows[0],
                });
            }
        }

        this.lazyLoadCells = true;
        this.kupDidLoad.emit();
        this.kupManager.resize.observe(this.rootElement);
        this.kupManager.debug.logLoad(this, true);
    }

    //======== Utility methods ========
    private resetSelectedRows() {
        if (!this.data || !this.data.rows || this.data.rows.length === 0)
            return;
        this.selectedRows = [];
        this.kupResetSelectedRows.emit();
    }

    resetCurrentPage() {
        this.currentPage = 1;
        this.resetSelectedRows();
    }

    getColumns(): Array<Column> {
        return this.data && this.data.columns
            ? this.data.columns
            : [{ title: '', name: '' }];
    }

    private getSizedColumns() {
        const columns = this.getColumns();
        const sizedColumns = [];
        for (let j = 0; j < columns.length; j++) {
            if (
                columns[j].size !== null &&
                columns[j].size !== undefined &&
                columns[j].size !== ''
            ) {
                sizedColumns.push(columns[j]);
            }
        }
        if (sizedColumns.length > 0) {
            return sizedColumns;
        } else {
            return undefined;
        }
    }
    /**
     * Opens a card containing the detail of the given row.
     * @param {Row} row - Row for which the detail was requested.
     * @param {number} x - Initial x coordinates of the card.
     * @param {number} y - Initial y coordinates of the card.
     * @private
     * @memberof KupDataTable
     */
    private rowDetail(row: Row, x: number, y: number): void {
        const transposedData: TableData = this.getTransposedData();
        const cardData: CardData = {
            button: [
                {
                    disabled: parseInt(row.id) === 0 ? true : false,
                    icon: 'chevron_left',
                },
                {
                    disabled:
                        parseInt(row.id) === this.data.rows.length - 1
                            ? true
                            : false,
                    icon: 'chevron_right',
                },
            ],
            datatable: [
                {
                    customStyle:
                        '#kup-component .below-wrapper{overflow: visible} #kup-component td[data-column="' +
                        iconColumn.toUpperCase() +
                        '"]{background-color: rgba(var(--kup-text-color-rgb), 0.15); width: 10px;}',
                    data: transposedData,
                    density: 'medium',
                    editableData: true,
                    headerIsPersistent: false,
                    id: this.rootElement.id ? this.rootElement.id : '',
                    rowsPerPage: 1000,
                    showGrid: ShowGrid.NONE,
                    showHeader: false,
                },
            ],
            text: [this.kupManager.language.translate(KupLanguageRow.DETAIL)],
        };
        const columns: Column[] = cardData.datatable[0].data.columns;
        const rows: Row[] = cardData.datatable[0].data.rows;
        // Placing the key and icon columns before any other column
        columns.unshift(
            {
                name: iconColumn.toUpperCase(),
                title: iconColumn,
            },
            {
                name: keyColumn.toUpperCase(),
                title: keyColumn,
            }
        );
        // Setting all columns to not visible
        for (let index = 0; index < columns.length; index++) {
            columns[index].visible = false;
        }
        // Setting Field column and current record column to visible
        columns.find((x) => x.name === fieldColumn.toUpperCase()).visible =
            true;
        const currentColumn = columns.find((x) => x.name === row.id);
        if (currentColumn) {
            currentColumn.visible = true;
        } else {
            this.kupManager.debug.logMessage(
                this,
                'Invalid column name on row ID (' +
                    row.id +
                    "), couldn't set current record!",
                KupDebugCategory.WARNING
            );
        }
        // Setting up icons
        let keyCell: Cell = null;
        for (let index = 0; index < rows.length; index++) {
            const column: Column = this.data.columns.find(
                (x) => x.name === rows[index].name
            );
            if (!column) {
                this.kupManager.debug.logMessage(
                    this,
                    'Column not found on row name (' + column + ')!',
                    KupDebugCategory.WARNING
                );
                return;
            }
            const editable: boolean = rows[index].cells[row.id].isEditable
                ? true
                : false;
            let iconCell: Cell = null;
            if (column.isKey || editable) {
                columns.find(
                    (x) => x.name === iconColumn.toUpperCase()
                ).visible = true;
            }
            if (column.isKey) {
                // Key should always be the first row
                keyCell = row.cells[column.name];
                iconCell = {
                    obj: {
                        t: 'J4',
                        p: 'ICO',
                        k: 'OG_OG_KF',
                    },
                    data: {
                        color: 'rgba(var(--kup-text-color-rgb), 1)',
                        resource: editable ? 'edit-key' : 'key-variant',
                    },
                    title: editable
                        ? this.kupManager.language.translate(
                              KupLanguageRow.EDITABLE_KEY
                          )
                        : this.kupManager.language.translate(
                              KupLanguageRow.KEY
                          ),
                    value: editable ? 'edit-key' : 'key-variant',
                };
            } else if (editable) {
                iconCell = {
                    obj: {
                        t: 'VO',
                        p: 'COD_VER',
                        k: '000051',
                    },
                    data: {
                        color: 'rgba(var(--kup-text-color-rgb), 1)',
                        resource: 'pencil',
                    },
                    title: this.kupManager.language.translate(
                        KupLanguageGeneric.EDITABLE_FIELD
                    ),
                    value: 'pencil',
                };
            } else {
                iconCell = {
                    obj: {
                        t: '',
                        p: '',
                        k: '',
                    },
                    value: '',
                };
            }
            if (keyCell) {
                rows[index].cells[keyColumn.toUpperCase()] = keyCell;
            } else {
                rows[index].cells[keyColumn.toUpperCase()] = { value: null };
            }
            rows[index].cells[iconColumn.toUpperCase()] = iconCell;
        }
        if (!this.detailCard) {
            this.detailCard = document.createElement('kup-card');
            this.detailCard.layoutFamily = CardFamily.DIALOG;
            this.detailCard.layoutNumber = 4;
            this.detailCard.sizeX = 'auto';
            this.detailCard.sizeY = 'auto';
            this.detailCard.style.maxHeight = '100vh';
            this.detailCard.style.maxWidth = '100vw';
        } else {
            const children: HTMLCollection = Array.prototype.slice.call(
                this.detailCard.children,
                0
            );
            for (let index = 0; index < children.length; index++) {
                children[index].remove();
            }
        }
        this.detailCard.data = cardData;
        this.detailCard.style.position = 'fixed';
        this.detailCard.style.left = x + 'px';
        this.detailCard.style.top = y + 'px';
        this.rootElement.shadowRoot.append(this.detailCard);
    }

    private getEventDetails(el: HTMLElement): EventHandlerDetails {
        const isHeader: boolean = !!el.closest('thead'),
            isBody: boolean = !!el.closest('tbody'),
            isFooter: boolean = !!el.closest('tfoot'),
            td: HTMLTableDataCellElement = el.closest('td'),
            textfield: HTMLTableDataCellElement = el.closest(
                '.f-text-field--wrapper'
            ),
            th: HTMLTableHeaderCellElement = el.closest('th'),
            tr: HTMLTableRowElement = el.closest('tr'),
            filterRemove: HTMLSpanElement = el.closest('th .filter-remove');
        let cell: Cell = null,
            column: Column = null,
            isGroupRow: boolean = false,
            row: Row = null;
        if (isBody) {
            if (tr) {
                if (tr.classList.contains('group')) {
                    isGroupRow = true;
                }
                row = tr['data-row'];
            }
        }
        if (isHeader || isBody) {
            if (td) {
                cell = td['data-cell'];
            }
            if (th) {
                cell = th['data-cell'];
            }
        }
        if (isHeader || isBody || isFooter) {
            const columnName = td
                ? td.dataset.column
                : th
                ? th.dataset.column
                : null;
            if (columnName) {
                column = getColumnByName(this.getColumns(), columnName);
            }
        }

        return {
            area: isHeader
                ? 'header'
                : isBody
                ? 'body'
                : isFooter
                ? 'footer'
                : null,
            cell: cell ? cell : null,
            column: column ? column : null,
            filterRemove: filterRemove ? filterRemove : null,
            isGroupRow: isGroupRow,
            row: row ? row : null,
            td: td ? td : null,
            textfield: textfield ? textfield : null,
            th: th ? th : null,
            tr: tr ? tr : null,
        };
    }

    private clickHandler(e: MouseEvent): EventHandlerDetails {
        const details: EventHandlerDetails = this.getEventDetails(
            e.target as HTMLElement
        );
        if (details.area === 'header') {
            if (details.th && details.column) {
                if (details.filterRemove) {
                    this.onRemoveFilter(details.column);
                    return details;
                } else {
                    this.onColumnSort(e, details.column.name);
                    return details;
                }
            }
        } else if (details.area === 'body') {
            if (
                (this.isFocusable || e.ctrlKey || e.metaKey) &&
                details.tr &&
                !details.isGroupRow
            ) {
                const focusEl: HTMLElement =
                    this.rootElement.shadowRoot.querySelector('tr.focus');
                if (focusEl) {
                    focusEl.classList.remove('focus');
                }
                details.tr.classList.add('focus');
                if (e.ctrlKey || e.metaKey) {
                    this.rowDetail({ ...details.row }, e.clientX, e.clientY);
                    return details;
                }
            }
            if (details.tr && details.row && details.isGroupRow) {
                this.onRowExpand(details.row);
                return details;
            }
            if (details.td && details.row && !details.textfield) {
                this.onRowClick(e, details.row, true);
                return details;
            }
        }
    }

    private contextMenuHandler(e: MouseEvent): EventHandlerDetails {
        e.preventDefault();
        const details: EventHandlerDetails = this.getEventDetails(
            e.target as HTMLElement
        );
        if (details.area === 'header') {
            if (details.th && details.column) {
                this.openColumnMenu(details.column.name);
                return details;
            }
        } else if (details.area === 'body') {
            const _hasTooltip: boolean = details.cell.obj
                ? this.kupManager.objects.hasTooltip(details.cell.obj)
                : false;
            if (
                _hasTooltip &&
                this.showTooltipOnRightClick &&
                details.td &&
                details.cell
            ) {
                const columnName = details.column ? details.column.name : null;
                setTooltip(
                    e,
                    details.row.id,
                    columnName,
                    details.cell,
                    this.tooltip
                );
                return details;
            }
        } else if (details.area === 'footer') {
            if (details.td && details.column) {
                this.totalMenuCoords = { x: e.clientX, y: e.clientY };
                this.onTotalMenuOpen(details.column);
                return details;
            }
        }
    }

    private dblClickHandler(e: MouseEvent): EventHandlerDetails {
        const details: EventHandlerDetails = this.getEventDetails(
            e.target as HTMLElement
        );
        if (this.selection == SelectionMode.MULTIPLE) {
            this.resetSelectedRows();
        }
        if (
            this.selection == SelectionMode.SINGLE ||
            this.selection == SelectionMode.MULTIPLE
        ) {
            this.onRowClick(e, details.row, false);
        }
        return details;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        const details: EventHandlerDetails = this.getEventDetails(
            e.target as HTMLElement
        );

        const hoverEl: HTMLElement =
            this.rootElement.shadowRoot.querySelector('.hover');
        if (hoverEl) {
            hoverEl.classList.remove('hover');
        }

        if (details.area === 'body') {
            if (details.tr) {
                details.tr.classList.add('hover');
                return;
            }
        }
    }

    private mouseOutHandler(): void {
        const hoverEl: HTMLElement =
            this.rootElement.shadowRoot.querySelector('.hover');
        if (hoverEl) {
            hoverEl.classList.remove('hover');
        }
    }

    getVisibleColumns(): Array<Column> {
        // TODO: change into `visible ?? true` when TS dependency has been updated
        const visibleColumns = this.getColumns().filter(({ visible }) =>
            visible !== undefined ? visible : true
        );

        // check grouping
        if (this.isGrouping()) {
            // filtering column based on group visibility
            return visibleColumns.filter((column) => {
                // check if in group
                let group = null;
                for (let currentGroup of this.groups) {
                    if (currentGroup.column === column.name) {
                        group = currentGroup;
                        break;
                    }
                }

                if (group) {
                    // return true if
                    // 1) group obj has not the 'visible' property or
                    // 2) group has 'visible' property and it is true
                    return !group.hasOwnProperty('visible') || group.visible;
                }

                // not in group -> visible
                return true;
            });
        }

        return visibleColumns;
    }

    getGroupByName(column: string): GroupObject {
        if (!this.isGrouping()) {
            return null;
        }

        for (let group of this.groups) {
            if (group.column === column) {
                return group;
            }
        }

        return null;
    }

    getColumnValues(column: Column): ValueDisplayedValue[] {
        return this.filtersRowsInstance.getColumnValues(
            this,
            column,
            this.globalFilterValue,
            this.filtersColumnMenuInstance
        );
    }

    getRows(): Array<Row> {
        return this.data && this.data.rows ? this.data.rows : [];
    }

    // TODO if is not shared, move this in the third parameter of setKetchupDraggable method
    private addMultiSelectDragImageToEvent(event: DragEvent) {
        const dragImage = document.createElement('img');
        dragImage.src = dragMultipleImg;
        event.dataTransfer.setDragImage(dragImage, 0, 0);
    }

    private initRows(): void {
        this.filterRows();

        this.footer = calcTotals(
            normalizeRows(this.getColumns(), this.rows),
            this.totals
        );

        this.groupRows();

        this.sortRows();
        this.adjustPaginator();

        this.paginatedRows = paginateRows(
            this.rows,
            this.currentPage,
            this.currentRowsPerPage,
            this.isGrouping()
        );
        this.paginatedRowsLength = this.paginatedRowsPointLength();
    }

    private filterRows(): void {
        this.rows = filterRows(
            this.getRows(),
            this.filters,
            this.globalFilterValue,
            this.getVisibleColumns()
        );
        this.rowsLength = this.rowsPointLength();
    }

    private isGrouping() {
        return this.groups && this.groups.length > 0;
    }

    private hasRowActions() {
        return this.rowActions !== undefined;
    }

    private removeGroup(index: number) {
        if (index >= 0) {
            // removing group from prop
            this.groups.splice(index, 1);
            this.groups = [...this.groups];
        }
    }

    private hasTotals() {
        return this.totals && Object.keys(this.totals).length > 0;
    }

    /**
     * Returns if the current data table must have the with set to auto to make table as large as the sum
     * of the table columns fixed width.
     * Table margin gets set to auto to center it.
     */
    private tableHasAutoWidth(): boolean {
        if (!this.sizedColumns) {
            return;
        }
        const visibleCols = this.getVisibleColumns();
        // Before checking each column, controls that visible columns are as many as items with custom sizes.
        // If there are more visible columns, it means that the width of the table will be set to auto.
        if (visibleCols.length <= this.sizedColumns.length) {
            let found = false;

            // Each visible column must have its own width for the table to have a auto width
            for (let i = 0; i < visibleCols.length; i++) {
                found = false;
                for (let j = 0; j < this.sizedColumns.length; j++) {
                    if (visibleCols[i].name === this.sizedColumns[j].name) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private forceGroupExpansion() {
        this.rows.forEach((row) => this.forceRowGroupExpansion(row));
        this.paginatedRows.forEach((row) => this.forceRowGroupExpansion(row));
    }

    private forceRowGroupExpansion(row: Row) {
        // check if row is group
        if (!row.group) {
            return;
        }

        // forcing row expanded
        row.group.expanded = this.expandGroups;

        // updating group state
        // check if already present
        let groupState = this.groupState[row.group.id];
        if (!groupState) {
            groupState = {
                expanded: this.expandGroups,
            };
        } else {
            groupState.expanded = this.expandGroups;
        }

        this.groupState[row.group.id] = groupState;

        if (row.group.children) {
            row.group.children.forEach((childRow) =>
                this.forceRowGroupExpansion(childRow)
            );
        }
    }

    private adjustPaginator() {
        const numberOfRows = this.rowsLength;

        // check if current page is valid
        const numberOfPages = Math.ceil(numberOfRows / this.currentRowsPerPage);
        if (this.currentPage > numberOfPages) {
            // reset page
            this.resetCurrentPage();
        }
    }

    //==== Fixed columns and rows methods ====
    private composeFixedCellStyleAndClass(
        columnCssIndex: number,
        rowCssIndex: number,
        extraCellsCount: number = 0
    ):
        | undefined
        | {
              fixedCellClasses: GenericObject;
              fixedCellStyle: GenericObject;
          } {
        if (this.isGrouping()) {
            return undefined;
        }

        //-- Controls if there are fixed rows or columns --
        const validFixedColumn: boolean =
            Number.isInteger(this.fixedColumns) &&
            columnCssIndex <= this.fixedColumns + extraCellsCount;
        const validFixedRowIndex =
            Number.isInteger(this.fixedRows) &&
            rowCssIndex > 0 &&
            rowCssIndex <= this.fixedRows;

        // When the cell is not valid to be either into a fixed column or into a fixed row, returns null.
        if (!validFixedRowIndex && !validFixedColumn) {
            return undefined;
        }

        const fixedCellClasses: GenericObject = {},
            fixedCellStyle: GenericObject = {};

        if (validFixedColumn) {
            fixedCellClasses[FixedCellsClasses.columns] = validFixedColumn;
            fixedCellClasses['show-column-separator'] =
                ShowGrid.COMPLETE === this.showGrid ||
                ShowGrid.COL === this.showGrid;
            fixedCellStyle['left'] =
                'var(' + FixedCellsCSSVarsBase.columns + columnCssIndex + ')';
        }

        if (validFixedRowIndex) {
            fixedCellClasses[FixedCellsClasses.rows] = !!validFixedRowIndex;
            fixedCellClasses['show-row-separator'] =
                ShowGrid.COMPLETE === this.showGrid ||
                ShowGrid.ROW === this.showGrid;
            fixedCellStyle['top'] =
                'var(' + FixedCellsCSSVarsBase.rows + rowCssIndex + ')';
        }

        return {
            fixedCellClasses,
            fixedCellStyle,
        };
    }

    private updateFixedRowsAndColumnsCssVariables(): boolean {
        // [ffbf] - Using getBoundingClientRect is mandatory since Firefox return a wrong value for ele.offsetHeight and witdh values

        // When grouping, the fixed rows and columns are not sticky
        if (this.isGrouping() || !this.tableRef) return false;
        let toRet: boolean = false;

        if (this.fixedRows >= 1) {
            let currentRow: HTMLTableRowElement = this.tableRef.querySelector(
                'tbody > tr:first-of-type'
            );
            // The height must start from the height of the header. BUT not on Safari.
            // Safari handles the sticky position on the tables in a different way, making it start from the tbody element
            // and not on the table with a specified position of sticky. There fore in that case we must set initial height to 0.
            let previousHeight: number = !this.isSafariBrowser
                ? (
                      this.tableRef.querySelector(
                          'thead > tr:first-of-type > th:first-of-type'
                      ) as HTMLTableCellElement
                  ).getBoundingClientRect().height // [ffbf]
                : 0;

            // [CSSCount] - I must start from 1 since we are referencing html elements e not array (with CSS selectors starting from 1)
            for (let i = 1; i <= this.fixedRows && currentRow; i++) {
                this.tableAreaRef.style.setProperty(
                    FixedCellsCSSVarsBase.rows + i,
                    previousHeight + 'px'
                );
                previousHeight += (
                    currentRow.children[0] as HTMLTableCellElement
                ).getBoundingClientRect().height; // [ffbf]
                currentRow =
                    currentRow.nextElementSibling as HTMLTableRowElement;
            }
            toRet = true;
        }

        if (this.fixedColumns >= 1) {
            let currentCell: HTMLTableCellElement = this.tableRef.querySelector(
                'tbody > tr:first-of-type > td:first-of-type'
            );
            let previousWidth: number = 0;
            const totalFixedColumns =
                this.fixedColumns +
                (this.hasRowActions() ? 1 : 0) +
                (this.selection === SelectionMode.MULTIPLE_CHECKBOX ? 1 : 0);

            // @See [CSSCount]
            for (let i = 1; i <= totalFixedColumns && currentCell; i++) {
                this.tableAreaRef.style.setProperty(
                    FixedCellsCSSVarsBase.columns + i,
                    previousWidth + 'px'
                );
                previousWidth += currentCell.getBoundingClientRect().width; // [ffbf]
                currentCell =
                    currentCell.nextElementSibling as HTMLTableCellElement;
            }
            toRet = true;
        }

        return toRet;
    }

    //======== Event Listeners ========
    private onColumnSort({ ctrlKey }: MouseEvent, columnName: string) {
        // check if columnName is already in sort array
        let i = 0;
        for (; i < this.sort.length; i++) {
            const sortObj = this.sort[i];
            if (sortObj.column === columnName) {
                break;
            }
        }

        if (i < this.sort.length) {
            // already in array... switching sort
            const sortObj = this.sort[i];

            const newSortObj: SortObject = {
                ...sortObj,
                sortMode:
                    sortObj.sortMode === SortMode.A ? SortMode.D : SortMode.A,
            };

            if (ctrlKey) {
                const newSort = [...this.sort];
                newSort[i] = newSortObj;
                this.sort = newSort;
            } else {
                this.sort = [newSortObj];
            }
        } else {
            const sortObj: SortObject = {
                column: columnName,
                sortMode: SortMode.A,
            };

            // if CTRL is pressed, push to array
            // else, replace current array
            if (ctrlKey) {
                this.sort = [...this.sort, sortObj];
            } else {
                this.sort = [sortObj];
            }
        }
    }

    private onRemoveFilter(column: Column) {
        // resetting current page
        this.resetCurrentPage();
        const newFilters: GenericFilter = { ...this.filters };
        this.filtersColumnMenuInstance.removeFilter(newFilters, column.name);
        this.filters = newFilters;
    }

    private getFilterValueForTooltip(column: Column): string {
        return this.filtersColumnMenuInstance.getFilterValueForTooltip(
            this.filters,
            column
        );
    }

    private onGlobalFilterChange(inputEl: EventTarget) {
        this.resetCurrentPage();
        if (inputEl) {
            const el = inputEl as HTMLInputElement;
            this.globalFilterValue = el.value;
        } else {
            this.globalFilterValue = '';
        }
    }

    private handlePageChanged({ detail }) {
        this.currentPage = detail.newPage;
    }

    private handleRowsPerPageChanged({ detail }) {
        this.currentRowsPerPage = detail.newRowsPerPage;
        this.adjustPaginator();
    }

    private onRowClick(event: MouseEvent, row: Row, emitEvent?: boolean) {
        // checking target
        const target = event.target;

        // selecting row
        if (!row.unselectable) {
            switch (this.selection) {
                case SelectionMode.MULTIPLE:
                    if (this.selectedRows.includes(row)) {
                        const selectedRowsCopy = [...this.selectedRows];
                        var index = selectedRowsCopy.indexOf(row);
                        if (index !== -1) {
                            selectedRowsCopy.splice(index, 1);
                        }
                        this.selectedRows = [...selectedRowsCopy];
                    } else {
                        this.selectedRows = [...this.selectedRows, row];
                    }
                    break;
                case SelectionMode.SINGLE:
                    this.selectedRows = [row];
                    break;
                default:
                    break;
            }
        }

        // find clicked column
        let clickedColumn: string = null;
        if (target instanceof HTMLElement) {
            if (target.tagName !== 'TR') {
                let currentElement = target;
                while (currentElement.tagName !== 'TD') {
                    currentElement = currentElement.parentElement;
                }
                clickedColumn = currentElement.dataset.column;
            }
        }

        // selecting clicked column
        if (clickedColumn) {
            this.deselectColumn(this.selectedColumn);
            this.selectedColumn = clickedColumn;
            this.selectColumn(this.selectedColumn);

            if (emitEvent !== false) {
                // emit event
                this.kupRowSelected.emit({
                    comp: this,
                    selectedRows: this.selectedRows,
                    clickedRow: row,
                    clickedColumn,
                });
            }
        }
    }

    private selectColumn(selectedColumn: string) {
        const columnCells = this.rootElement.shadowRoot.querySelectorAll(
            'td[data-column="' + selectedColumn + '"]'
        );
        for (let i = 0; i < columnCells.length; i++) {
            columnCells[i].classList.add('selected');
        }
        const column = this.rootElement.shadowRoot.querySelector(
            'th[data-column="' + selectedColumn + '"]'
        );
        if (column) {
            column.classList.add('selected');
        }
    }

    private deselectColumn(selectedColumn: string) {
        const columnCells = this.rootElement.shadowRoot.querySelectorAll(
            'td[data-column="' + selectedColumn + '"]'
        );
        for (let i = 0; i < columnCells.length; i++) {
            columnCells[i].classList.remove('selected');
        }
        const column = this.rootElement.shadowRoot.querySelector(
            'th[data-column="' + selectedColumn + '"]'
        );
        if (column) {
            column.classList.remove('selected');
        }
    }

    private onDefaultRowActionClick({ action, row, type, index }) {
        this.kupRowActionClicked.emit({
            comp: this,
            action,
            index,
            row,
            type,
        });
    }

    private onRowActionExpanderClick(e: MouseEvent, row: Row) {
        e.stopPropagation();

        this.kupRowActionClicked.emit({
            comp: this,
            row,
            type: 'expander',
        });
    }

    private cellUpdate(
        e: CustomEvent | Event | FocusEvent,
        value: string,
        cell: Cell,
        column: Column,
        row: Row
    ) {
        if (this.kupManager.objects.isCheckbox(cell.obj)) {
            if (cell.data && cell.data['checked'] !== undefined) {
                cell.data['checked'] = value === 'on' ? false : true;
            }
        } else {
            cell.obj.k = value;
            cell.value = value;
            cell.displayedValue = null;
            cell.displayedValue = getCellValueForDisplay(column, cell);
            if (cell.data && cell.data['initialValue'] !== undefined) {
                cell.data['initialValue'] = value;
            }
        }
        this.refresh();
        this.kupDataTableCellUpdate.emit({
            comp: this,
            cell: cell,
            column: column,
            id: this.rootElement.id,
            row: row,
            event: e,
        });
    }

    private handleRowSelect(row: Row) {
        const index = this.selectedRows.indexOf(row);

        if (index < 0) {
            // adding
            this.selectedRows = [...this.selectedRows, row];
        } else {
            // removing
            this.selectedRows.splice(index, 1);
            this.selectedRows = [...this.selectedRows];
        }

        this.kupRowSelected.emit({
            comp: this,
            selectedRows: this.selectedRows,
            clickedRow: null,
            clickedColumn: null,
        });
    }

    private onRowExpand(row: Row) {
        // row should be a 'group' row
        row.group.expanded = !row.group.expanded;

        // updating group map
        this.groupState[row.group.id].expanded = row.group.expanded;

        // changing group state to trigger rendering
        this.groupState = { ...this.groupState };
    }

    private onSelectAll({ target }) {
        if (target.checked) {
            // select all rows
            this.selectedRows = this.renderedRows;
            // triggering event
            this.kupRowSelected.emit({
                comp: this,
                selectedRows: this.selectedRows,
                clickedColumn: null,
                clickedRow: null,
            });
        } else {
            // deselect all rows
            this.resetSelectedRows();
        }
    }

    private openTotalMenu(column: Column) {
        this.openedTotalMenu = column.name;
    }

    private closeTotalMenu() {
        this.openedTotalMenu = null;
    }

    /* TODO 
    private openGroupMenu(column: Column) {
        this.openedGroupMenu = column.name;
    }

    private closeGroupMenu() {
        this.openedGroupMenu = null;
    }
    */

    private closeMenuAndTooltip() {
        unsetTooltip(this.tooltip);
    }

    private isOpenedTotalMenu(): boolean {
        return this.openedTotalMenu != null;
    }

    private isOpenedTotalMenuForColumn(column: string): boolean {
        return this.openedTotalMenu === column;
    }

    private isOpenedGroupMenu(): boolean {
        return this.openedGroupMenu != null;
    }

    private isOpenedGroupMenuForColumn(column: string): boolean {
        return this.openedGroupMenu === column;
    }

    /**
     * Type guard needed to be sure that an object returned from composePath() is an HTMLElement with classes
     * @param node
     */
    private isHTMLElementFromEventTarget(
        node: EventTarget
    ): node is HTMLElement {
        return (node as HTMLElement).classList !== undefined;
    }

    private hasOverlayActions(column: Column): boolean {
        if (column == null || column.obj == null) {
            return false;
        }
        return this.kupManager.objects.canHaveAutomaticDerivedColumn(
            column.obj
        );
    }

    private onHeaderCellContextMenuClose(event: MouseEvent) {
        // Gets the path of the event (does not work in IE11 or previous)
        const eventPath = event.composedPath();
        let fromTotalMenu = false;
        let fromSameTable = false;

        // Examine the path
        for (let elem of eventPath) {
            // TODO When the footer is considered stable please do this in another dedicated method
            // check if is the open menu button the element which fired the event
            // TODO Maybe a better approach would be to use the blur event in order to hide the menu
            if ((elem as HTMLElement).id === totalMenuOpenID) {
                return;
            }

            // If we encounter our table we can stop looping the elements
            if (elem === this.tableAreaRef) {
                fromSameTable = true;
                break;
            }

            // TODO When the footer is considered stable please do this in another dedicated method
            // If the event comes from a menu of the table footer
            if (
                this.isHTMLElementFromEventTarget(elem) &&
                elem.classList &&
                elem.classList.contains('total-menu')
            ) {
                fromTotalMenu = true;
            }
        }

        // TODO When the footer is considered stable please do this in another dedicated method
        if (this.isOpenedTotalMenu() && !(fromTotalMenu && fromSameTable)) {
            this.closeTotalMenu();
        }
    }

    private onJ4btnClicked(row, column, cell) {
        // Since this function is called with bind, the event from the kup-button gets passed into the arguments array
        const buttonEvent = arguments[3] as UIEvent;
        if (buttonEvent) {
            // Prevents double events to be fired.
            buttonEvent.stopPropagation();
        } else {
            throw 'kup-data-table error: missing event';
        }
        this.kupCellButtonClicked.emit({
            comp: this,
            cell: cell,
            column: column,
            row: row,
        });
    }

    // utility methods
    private groupRows(): void {
        if (!this.isGrouping()) {
            return;
        }

        this.rows = groupRows(
            this.getColumns(),
            this.rows,
            this.groups,
            this.totals
        );

        this.adjustGroupState();
    }

    @Method()
    async getInternalState() {
        // TODO - Just for test
        return {
            groups: this.groups,
            filters: this.filters,
            data: this.data,
        };
    }

    // Handler for loadMore button is clicked.
    private onLoadMoreClick() {
        let loadItems: number = 0;

        switch (this.loadMoreMode) {
            case LoadMoreMode.CONSTANT:
                loadItems = this.loadMoreStep;
                break;
            case LoadMoreMode.CONSTANT_INCREMENT:
                loadItems = this.loadMoreStep * (this.loadMoreEventCounter + 1);
                break;
            case LoadMoreMode.PROGRESSIVE_THRESHOLD:
                loadItems =
                    Math.max(
                        this.loadMoreEventPreviousQuantity,
                        this.loadMoreStep
                    ) * Math.min(this.loadMoreEventCounter + 1, 2);
                break;
        }

        if (loadItems > this.loadMoreLimit) {
            loadItems = this.loadMoreLimit;
        }

        this.kupLoadMoreClicked.emit({
            comp: this,
            loadItems: loadItems,
        });

        this.loadMoreEventPreviousQuantity = loadItems;
        this.loadMoreEventCounter++;
    }

    private adjustGroupState(): void {
        if (
            !this.rows ||
            this.rowsLength === 0 ||
            !this.rows[0].hasOwnProperty('group')
        ) {
            // no grouping
            return;
        }

        this.rows.forEach((r) => this.adjustGroupStateFromRow(r));
    }

    private adjustGroupStateFromRow(row: Row): void {
        if (!row || !row.hasOwnProperty('group')) {
            // not a groping row, nothing to do
            return;
        }

        const group = row.group;

        // check if already in group state
        const groupFromState = this.groupState[group.id];

        if (!groupFromState) {
            // add to state
            this.groupState[group.id] = group;
        } else {
            // update expanded
            group.expanded = groupFromState.expanded;
        }

        group.children.forEach((child) => this.adjustGroupStateFromRow(child));
    }

    private sortRows(): void {
        this.rows = sortRows(this.rows, this.sort);
    }

    private getSortIcon(columnName: string): string {
        // check if column in sort array
        for (let sortObj of this.sort) {
            if (sortObj.column === columnName) {
                return 'A' === sortObj.sortMode ? 'descending' : 'ascending';
            }
        }

        // default
        return '';
    }

    private getSortDecode(columnName: string): string {
        // check if column in sort array
        for (let sortObj of this.sort) {
            if (sortObj.column === columnName) {
                return 'A' === sortObj.sortMode ? 'Ascending' : 'Descending';
            }
        }

        // default
        return 'Sort column';
    }

    private calculateColspan() {
        let colSpan = this.getVisibleColumns().length;

        if (this.selection === SelectionMode.MULTIPLE_CHECKBOX) {
            colSpan += 1;
        }

        if (this.hasRowActions()) {
            colSpan += 1;
        }

        return colSpan;
    }

    private isGroupExpanded({ group }: Row): boolean {
        if (!group) {
            return false;
        }

        // check if in group state
        if (this.groupState[group.id]) {
            return this.groupState[group.id].expanded;
        } else {
            return false;
        }
    }

    //==== Column sort order methods ====
    private handleColumnSort(receivingColumn: Column, sortedColumn: Column) {
        // Get receiving column position
        const receivingColIndex = this.data.columns.findIndex(
            (col) =>
                col.name === receivingColumn.name &&
                col.title === receivingColumn.title
        );
        // Get sorted column current position
        const sortedColIndex = this.data.columns.findIndex(
            (col) =>
                col.name === sortedColumn.name &&
                col.title === sortedColumn.title
        );

        // Moves the sortedColumn into the correct position
        if (this.sortableColumnsMutateData) {
            this.moveSortedColumns(
                this.data.columns,
                receivingColIndex,
                sortedColIndex
            );
        }
    }

    /**
     * After a drop of a column header, if the table can update its own data, does so and triggers rerender.
     * @param columns - The columns to sort
     * @param receivingColumnIndex - The index where the column will be inserted
     * @param sortedColumnIndex - The index where the column will be removed
     */
    private moveSortedColumns(
        columns: Column[],
        receivingColumnIndex: number,
        sortedColumnIndex: number
    ) {
        const remove = columns.splice(sortedColumnIndex, 1);
        columns.splice(receivingColumnIndex, 0, remove[0]);
        this.triggerColumnSortRerender = !this.triggerColumnSortRerender;
    }

    @Method() async defaultSortingFunction(
        columns: Column[],
        receivingColumnIndex: number,
        sortedColumnIndex: number,
        useNewObject: boolean = false
    ) {
        const toSort = !useNewObject ? columns : [...columns];

        this.moveSortedColumns(toSort, receivingColumnIndex, sortedColumnIndex);

        return toSort;
    }

    private applyLineBreaks(content: string) {
        // We add a break line before every chunk
        return content
            .split(this.lineBreakCharacter)
            .map((chunk, index) => (index !== 0 ? [<br />, chunk] : chunk));
    }

    //======== render methods ========
    /**
     * Given the parameters return the classes and style for each table header cell
     * @param columnName - The name of the columns currently being examinated
     * @param columnIndex - The index of the current column
     * @param extraCells - the extra cells rendered into the table
     */
    private composeHeaderCellClassAndStyle(
        columnIndex: number,
        extraCells: number = 0,
        column: Column
    ): {
        columnClass: GenericObject;
        thStyle: GenericObject;
    } {
        let columnClass: GenericObject = {},
            thStyle: GenericObject = {};

        if (
            this.kupManager.objects.isBar(column.obj) ||
            this.kupManager.objects.isButton(column.obj) ||
            this.kupManager.objects.isChart(column.obj) ||
            this.kupManager.objects.isCheckbox(column.obj) ||
            this.kupManager.objects.isImage(column.obj) ||
            this.kupManager.objects.isIcon(column.obj) ||
            this.kupManager.objects.isProgressBar(column.obj) ||
            this.kupManager.objects.isRadio(column.obj) ||
            this.kupManager.objects.isVoCodver(column.obj)
        ) {
            columnClass.centered = true;
        }

        if (this.kupManager.objects.isNumber(column.obj)) {
            columnClass.number = true;
        }

        if (this.kupManager.objects.isIcon(column.obj)) {
            columnClass.icon = true;
        }
        // For fixed cells styles and classes
        const fixedCellStyle = this.composeFixedCellStyleAndClass(
            columnIndex + 1 + extraCells,
            0,
            extraCells
        );
        if (fixedCellStyle) {
            columnClass = {
                ...columnClass,
                ...fixedCellStyle.fixedCellClasses,
            };
            thStyle = {
                ...thStyle,
                ...fixedCellStyle.fixedCellStyle,
            };
        }

        return {
            columnClass,
            thStyle,
        };
    }

    private renderHeader() {
        let specialExtraCellsCount: number = 0;

        // Renders multiple selection column
        let multiSelectColumn = null;
        if (this.selection === SelectionMode.MULTIPLE_CHECKBOX) {
            specialExtraCellsCount++;
            const selectionStyleAndClass = this.composeFixedCellStyleAndClass(
                specialExtraCellsCount,
                0,
                specialExtraCellsCount - 1
            );

            const style = {
                width: '30px',
                margin: '0 auto',
                ...(selectionStyleAndClass
                    ? selectionStyleAndClass.fixedCellStyle
                    : {}),
            };

            multiSelectColumn = (
                <th
                    class={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellClasses
                            : {}
                    }
                    style={style}
                >
                    <kup-checkbox
                        onKupCheckboxChange={(e) => this.onSelectAll(e)}
                        title={
                            this.kupManager.language.translate(
                                KupLanguageRow.SELECTED
                            ) +
                            `: ${this.selectedRows.length},` +
                            this.kupManager.language.translate(
                                KupLanguageRow.RENDERED
                            ) +
                            `: ${this.renderedRows.length}`
                        }
                        checked={
                            this.selectedRows.length > 0 &&
                            this.selectedRows.length ===
                                this.renderedRows.length
                        }
                    />
                </th>
            );
        }

        // Renders action column
        let actionsColumn = null;
        if (this.hasRowActions()) {
            specialExtraCellsCount++;
            const selectionStyleAndClass = this.composeFixedCellStyleAndClass(
                specialExtraCellsCount,
                0,
                specialExtraCellsCount - 1
            );

            actionsColumn = (
                <th
                    class={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellClasses
                            : {}
                    }
                    style={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellStyle
                            : {}
                    }
                />
            );
        }

        // Renders normal cells
        const dataColumns = this.getVisibleColumns().map(
            (column, columnIndex) => {
                // Composes column cell style and classes
                const { columnClass, thStyle } =
                    this.composeHeaderCellClassAndStyle(
                        columnIndex,
                        specialExtraCellsCount,
                        column
                    );

                //---- AddCodeDecodeColumn ----
                const overlay = null;
                /** disabled on release, for now... */
                /*
                if (this.hasOverlayActions(column)) {
                    columnClass['obj'] = true;
                    const svgLabel = 'Add code/decode column';
                    const svg = this.getIconPath('table-column-plus-after');
                    const iconStyle = {
                        mask: svg,
                        webkitMask: svg,
                    };
                    overlay = (
                        <span
                            title={svgLabel}
                            style={iconStyle}
                            class="icon-container overlay-action"
                            onClick={(e) => {
                                this.onAddCodeDecodeColumnClick(e, column);
                            }}
                            onMouseUp={(e) => e.stopPropagation()}
                        ></span>
                    );
                }
                */
                //---- Filter ----
                let filter = null;

                if (
                    this.filtersColumnMenuInstance.hasFiltersForColumn(
                        this.filters,
                        column
                    )
                ) {
                    const svgLabel =
                        this.kupManager.language.translate(
                            KupLanguageGeneric.REMOVE_FILTERS
                        ) + `: '${this.getFilterValueForTooltip(column)}'`;
                    /**
                     * When column has a filter but filters must not be displayed, shows an icon to remove the filter.
                     * Upon click, the filter gets removed.
                     * The payload event is simulated here.
                     */
                    filter = (
                        <span
                            title={svgLabel}
                            class="icon-container filter-remove"
                        ></span>
                    );
                }

                //---- Sort ----
                let sortIcon = null;

                // When sorting is enabled, there are two things to do:
                // 1 - Add correct icon to the table
                // 2 - stores the handler to be later set onto the whole cell
                if (this.sortEnabled) {
                    let iconClass = this.getSortIcon(column.name);
                    if (iconClass !== '') {
                        iconClass += ' icon-container';
                        sortIcon = (
                            <span
                                class={iconClass}
                                title={this.getSortDecode(column.name)}
                            ></span>
                        );
                    }

                    // Adds the sortable class to the header cell
                    columnClass['header-cell--sortable'] = true;
                }

                let keyIcon: HTMLSpanElement = null;
                if (column.isKey) {
                    keyIcon = (
                        <span
                            class="key icon-container"
                            title={this.kupManager.language.translate(
                                KupLanguageRow.KEY
                            )}
                        ></span>
                    );
                }

                // Sets custom columns width
                if (this.sizedColumns) {
                    for (let i = 0; i < this.sizedColumns.length; i++) {
                        const currentCol = this.sizedColumns[i];

                        if (currentCol.name === column.name) {
                            const width = currentCol.size + '';
                            if (width.indexOf('ch') < 1) {
                                thStyle.width = width;
                                thStyle.minWidth = width;
                                thStyle.maxWidth = width;
                            }
                            thStyle.overflow = 'hidden';
                            break;
                        }
                    }
                }

                // Reference for drag events and what they permit or not
                // https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p
                const dragHandlers: DragHandlers = {
                    onDragStart: (e: DragEvent) => {
                        // Sets the type of drag
                        setDragEffectAllowed(e, 'move');
                        const overElement = this.getThElement(
                            e.target as HTMLElement
                        );
                        // Remember that the current target is different from the one print out in the console
                        // Sets which element has started the drag
                        overElement.setAttribute(this.dragStarterAttribute, '');
                        this.theadRef.setAttribute(this.dragFlagAttribute, '');
                        this.columnsAreBeingDragged = true;
                        this.hideShowColumnDropArea(true, overElement);
                        // TODO set drag payload and get it in the other methods when need it
                        // setDragDropPayload
                        // getDragDropPayload
                        // replace the used flags set with attribute
                    },
                    onDragEnd: (e: DragEvent) => {
                        // When the drag has ended, checks if the element still exists or it was destroyed by JSX
                        const overElement = this.getThElement(
                            e.target as HTMLElement
                        );
                        if (overElement) {
                            // If it still exists, removes the attribute so that it can perform a new drag again
                            overElement.removeAttribute(
                                this.dragStarterAttribute
                            );
                        }
                        // Remove the over attribute
                        const dragDropPayload = getDragDropPayload();
                        if (dragDropPayload && dragDropPayload.overElement) {
                            dragDropPayload.overElement.removeAttribute(
                                this.dragOverAttribute
                            );
                        }
                        this.theadRef.removeAttribute(this.dragFlagAttribute);
                        this.columnsAreBeingDragged = false;
                        this.hideShowColumnDropArea(false);
                    },
                };
                const dropHandlers: DropHandlers = {
                    onDrop: (e: DragEvent) => {
                        const transferredData = JSON.parse(
                            e.dataTransfer.getData(KupDataTableColumnDragType)
                        ) as Column;
                        // We are sure the tables have been dropped in a valid location -> starts sorting the columns
                        this.handleColumnSort(column, transferredData);

                        return KupDataTableColumnDragType;
                    },
                    onDragLeave: (e: DragEvent) => {
                        if (
                            e.dataTransfer.types.indexOf(
                                KupDataTableColumnDragType
                            ) >= 0
                        ) {
                            const overElement = this.getThElement(
                                e.target as HTMLElement
                            );
                            if (overElement) {
                                overElement.removeAttribute(
                                    this.dragOverAttribute
                                );
                            }
                        }
                    },
                    onDragOver: (e: DragEvent) => {
                        if (
                            e.dataTransfer.types.indexOf(
                                KupDataTableColumnDragType
                            ) >= 0
                        ) {
                            const overElement = this.getThElement(
                                e.target as HTMLElement
                            );
                            overElement.setAttribute(
                                this.dragOverAttribute,
                                ''
                            );
                            // TODO do it without using the element but with data like id, etc.
                            setDragDropPayload({
                                overElement,
                            });
                            // If element can have a drop effect
                            if (
                                !overElement.hasAttribute(
                                    this.dragStarterAttribute
                                ) &&
                                this.columnsAreBeingDragged
                            ) {
                                setDragEffectAllowed(e, 'move');
                                return true;
                            } else {
                                setDragEffectAllowed(e, 'none');
                                return false;
                            }
                        }
                    },
                };

                columnClass.number = this.kupManager.objects.isNumber(
                    column.obj
                );

                return (
                    <th
                        data-cell={column}
                        data-column={column.name}
                        class={columnClass}
                        style={thStyle}
                        {...(this.enableSortableColumns
                            ? setKetchupDraggable(dragHandlers, {
                                  [KupDataTableColumnDragType]: column,
                                  'kup-drag-source-element': {
                                      column: column,
                                      id: this.rootElement.id,
                                  },
                              })
                            : {})}
                        {...(this.enableSortableColumns
                            ? setKetchupDroppable(
                                  dropHandlers,
                                  [KupDataTableColumnDragType],
                                  this.rootElement,
                                  {
                                      column: column,
                                      id: this.rootElement.id,
                                  }
                              )
                            : {})}
                    >
                        <span class="column-title">
                            {this.applyLineBreaks(column.title)}
                        </span>
                        {overlay}
                        {keyIcon}
                        {sortIcon}
                        {filter}
                    </th>
                );
            }
        );

        return [multiSelectColumn, actionsColumn, ...dataColumns];
        //  return [multiSelectColumn, groupColumn, actionsColumn, ...dataColumns];
    }

    private renderStickyHeader() {
        let specialExtraCellsCount: number = 0;

        let multiSelectColumn = null;
        if (this.selection === SelectionMode.MULTIPLE_CHECKBOX) {
            specialExtraCellsCount++;
            const selectionStyleAndClass = this.composeFixedCellStyleAndClass(
                specialExtraCellsCount,
                0,
                specialExtraCellsCount - 1
            );

            const style = {
                width: '30px',
                margin: '0 auto',
                ...(selectionStyleAndClass
                    ? selectionStyleAndClass.fixedCellStyle
                    : {}),
            };
            multiSelectColumn = (
                <th-sticky
                    class={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellClasses
                            : null
                    }
                    style={style}
                >
                    <kup-checkbox
                        onKupCheckboxChange={(e) => this.onSelectAll(e)}
                        title={
                            this.kupManager.language.translate(
                                KupLanguageRow.SELECTED
                            ) +
                            `: ${this.selectedRows.length},` +
                            this.kupManager.language.translate(
                                KupLanguageRow.RENDERED
                            ) +
                            `: ${this.renderedRows.length}`
                        }
                        checked={
                            this.selectedRows.length > 0 &&
                            this.selectedRows.length ===
                                this.renderedRows.length
                        }
                    />
                </th-sticky>
            );
        }

        // Empty cell for the actions
        let actionsColumn = null;
        if (this.hasRowActions()) {
            specialExtraCellsCount++;
            const selectionStyleAndClass = this.composeFixedCellStyleAndClass(
                specialExtraCellsCount,
                0,
                specialExtraCellsCount - 1
            );

            actionsColumn = (
                <th-sticky
                    class={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellClasses
                            : null
                    }
                    style={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellStyle
                            : null
                    }
                />
            );
        }

        // Composes normal header cells
        const dataColumns = this.getVisibleColumns().map(
            (column, columnIndex) => {
                const { columnClass, thStyle } =
                    this.composeHeaderCellClassAndStyle(
                        columnIndex,
                        specialExtraCellsCount,
                        column
                    );

                return (
                    <th-sticky class={columnClass} style={thStyle}>
                        <span class="column-title">
                            {this.applyLineBreaks(column.title)}
                        </span>
                    </th-sticky>
                );
            }
        );

        return [multiSelectColumn, actionsColumn, ...dataColumns];
        //return [multiSelectColumn, groupColumn, actionsColumn, ...dataColumns];
    }

    renderTooltip() {
        if (this.tooltipEnabled == false) {
            return null;
        }
        return (
            <kup-tooltip
                class="datatable-tooltip"
                owner={this.rootElement.tagName}
                loadTimeout={
                    this.showTooltipOnRightClick == true
                        ? 0
                        : this.tooltipLoadTimeout
                }
                onBlur={() => {
                    this.tooltip.data = null;
                }}
                detailTimeout={this.tooltipDetailTimeout}
                ref={(el: any) => (this.tooltip = el as KupTooltip)}
                tabindex={0}
            ></kup-tooltip>
        );
    }

    areTotalsSelected(column: Column): boolean {
        return this.totals && this.totals[column.name] ? true : false;
    }

    onTotalsChange(event, column) {
        // close menu
        this.closeTotalMenu();
        if (column) {
            // must do this
            // otherwise does not fire the watcher
            const totalsCopy = { ...this.totals };
            const value = event.detail.selected.value;
            if (value === TotalLabel.CANC) {
                if (this.totals && this.totals[column.name]) {
                    delete totalsCopy[column.name];
                }
            } else {
                totalsCopy[column.name] = value;
            }
            this.totals = totalsCopy;
        }
    }

    private totalMenuPosition() {
        if (this.rootElement.shadowRoot) {
            const menu: HTMLElement =
                this.rootElement.shadowRoot.querySelector('#totals-menu');
            if (menu) {
                this.kupManager.dynamicPosition.register(
                    menu as KupDynamicPositionElement,
                    this.totalMenuCoords,
                    0,
                    KupDynamicPositionPlacement.TOP_RIGHT
                );
                this.kupManager.dynamicPosition.start(
                    menu as KupDynamicPositionElement
                );
                menu.classList.add('visible');
                menu.focus();
            }
        }
    }

    private onTotalMenuOpen(column: Column) {
        this.closeMenuAndTooltip();
        this.closeTotalMenu();
        this.openTotalMenu(column);
    }

    renderFooter() {
        let extraCells = 0;

        // Composes initial cells if necessary
        let selectRowCell = null;
        if (this.selection === SelectionMode.MULTIPLE_CHECKBOX) {
            extraCells++;
            const fixedCellStyle = this.composeFixedCellStyleAndClass(
                extraCells,
                0,
                extraCells
            );

            selectRowCell = (
                <td
                    class={
                        fixedCellStyle ? fixedCellStyle.fixedCellClasses : null
                    }
                    style={
                        fixedCellStyle ? fixedCellStyle.fixedCellStyle : null
                    }
                />
            );
        }

        // Action cell
        let actionsCell = null;
        if (this.hasRowActions()) {
            extraCells++;
            const selectionStyleAndClass = this.composeFixedCellStyleAndClass(
                extraCells,
                0,
                extraCells
            );
            actionsCell = (
                <td
                    class={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellClasses
                            : {}
                    }
                    style={
                        selectionStyleAndClass
                            ? selectionStyleAndClass.fixedCellStyle
                            : {}
                    }
                />
            );
        }

        const footerCells = this.getVisibleColumns().map(
            (column: Column, columnIndex) => {
                const fixedCellStyle = this.composeFixedCellStyleAndClass(
                    columnIndex + 1 + extraCells,
                    0,
                    extraCells
                );

                let totalMenu = undefined;
                let menuLabel = TotalLabel.CALC;
                const translation = {
                    [TotalLabel.AVERAGE]: this.kupManager.language.translate(
                        KupLanguageTotals.AVERAGE
                    ),
                    [TotalLabel.CALC]: this.kupManager.language.translate(
                        KupLanguageTotals.CALCULATE
                    ),
                    [TotalLabel.CANC]: this.kupManager.language.translate(
                        KupLanguageTotals.CANCEL
                    ),
                    [TotalLabel.COUNT]: this.kupManager.language.translate(
                        KupLanguageTotals.COUNT
                    ),
                    [TotalLabel.DISTINCT]: this.kupManager.language.translate(
                        KupLanguageTotals.DISTINCT
                    ),
                    [TotalLabel.MATH]: this.kupManager.language.translate(
                        KupLanguageTotals.FORMULA
                    ),
                    [TotalLabel.MAX]: this.kupManager.language.translate(
                        KupLanguageTotals.MAXIMUM
                    ),
                    [TotalLabel.MIN]: this.kupManager.language.translate(
                        KupLanguageTotals.MINIMUM
                    ),
                    [TotalLabel.SUM]: this.kupManager.language.translate(
                        KupLanguageTotals.SUM
                    ),
                };
                if (this.totals) {
                    const totalValue = this.totals[column.name];
                    if (totalValue) {
                        if (totalValue.startsWith(TotalMode.MATH)) {
                            menuLabel = TotalLabel.MATH;
                        } else {
                            switch (totalValue) {
                                case TotalMode.COUNT:
                                    menuLabel = TotalLabel.COUNT;
                                    break;
                                case TotalMode.DISTINCT:
                                    menuLabel = TotalLabel.DISTINCT;
                                    break;
                                case TotalMode.SUM:
                                    menuLabel = TotalLabel.SUM;
                                    break;
                                case TotalMode.AVERAGE:
                                    menuLabel = TotalLabel.AVERAGE;
                                    break;
                                case TotalMode.MIN:
                                    menuLabel = TotalLabel.MIN;
                                    break;
                                case TotalMode.MAX:
                                    menuLabel = TotalLabel.MAX;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }

                if (this.isOpenedTotalMenuForColumn(column.name)) {
                    const listData: ComponentListElement[] = [
                        {
                            text: translation[TotalLabel.COUNT],
                            value: TotalMode.COUNT,
                            selected: false,
                        },
                        {
                            text: translation[TotalLabel.DISTINCT],
                            value: TotalMode.DISTINCT,
                            selected: false,
                        },
                    ];
                    if (this.kupManager.objects.isNumber(column.obj)) {
                        // TODO Move these objects in declarations
                        listData.push(
                            {
                                text: null,
                                value: null,
                                isSeparator: true,
                            },
                            {
                                text: translation[TotalLabel.SUM],
                                value: TotalMode.SUM,
                                selected: false,
                            },
                            {
                                text: translation[TotalLabel.AVERAGE],
                                value: TotalMode.AVERAGE,
                                selected: false,
                            },
                            {
                                text: translation[TotalLabel.MIN],
                                value: TotalMode.MIN,
                                selected: false,
                            },
                            {
                                text: translation[TotalLabel.MAX],
                                value: TotalMode.MAX,
                                selected: false,
                            }
                        );
                    } else if (this.kupManager.objects.isDate(column.obj)) {
                        listData.push(
                            {
                                text: null,
                                value: null,
                                isSeparator: true,
                            },
                            {
                                text: translation[TotalLabel.MIN],
                                value: TotalMode.MIN,
                                selected: false,
                            },
                            {
                                text: translation[TotalLabel.MAX],
                                value: TotalMode.MAX,
                                selected: false,
                            }
                        );
                    }
                    if (this.totals) {
                        const selectedItem: ComponentListElement =
                            listData.find(
                                (item) =>
                                    item.value === this.totals[column.name]
                            );
                        if (selectedItem) {
                            selectedItem.selected = true;
                            listData.push(
                                {
                                    text: null,
                                    value: null,
                                    isSeparator: true,
                                },
                                {
                                    text: translation[TotalLabel.CANC],
                                    value: TotalLabel.CANC,
                                    selected: false,
                                }
                            );
                        }
                    }

                    totalMenu = (
                        <kup-list
                            class={`kup-menu total-menu`}
                            data={...listData}
                            id="totals-menu"
                            is-menu
                            menu-visible
                            onBlur={() => this.closeTotalMenu()}
                            onKupListClick={(event) =>
                                this.onTotalsChange(event, column)
                            }
                            tabindex={0}
                        ></kup-list>
                    );
                }

                // TODO please use getValueForDisplay
                let value;
                const footerValue = this.footer[column.name];
                if (
                    menuLabel === TotalLabel.COUNT ||
                    menuLabel === TotalLabel.DISTINCT
                ) {
                    value = footerValue;
                } else if (
                    (menuLabel === TotalLabel.MAX ||
                        menuLabel === TotalLabel.MIN) &&
                    this.kupManager.objects.isDate(column.obj)
                ) {
                    if (footerValue) {
                        if (
                            isValidStringDate(
                                footerValue,
                                ISO_DEFAULT_DATE_FORMAT
                            )
                        ) {
                            value = unformattedStringToFormattedStringDate(
                                footerValue,
                                null,
                                column.obj.t + column.obj.p
                            );
                        } else {
                            console.warn(`invalid date: ${footerValue}`);
                        }
                    }
                } else {
                    value = numberToFormattedStringNumber(
                        footerValue,
                        column.decimals,
                        column.obj ? column.obj.p : ''
                    );
                }

                return (
                    <td
                        data-column={column.name}
                        class={
                            fixedCellStyle && fixedCellStyle.fixedCellClasses
                                ? fixedCellStyle.fixedCellClasses
                                : ''
                        }
                        style={
                            fixedCellStyle
                                ? fixedCellStyle.fixedCellStyle
                                : null
                        }
                    >
                        {totalMenu}
                        <span
                            class="totals-value"
                            title={translation[menuLabel]}
                        >
                            {value}
                        </span>
                    </td>
                );
            }
        );

        const footer = (
            <tfoot>
                <tr>
                    {selectRowCell}
                    {actionsCell}
                    {footerCells}
                </tr>
            </tfoot>
        );

        return footer;
    }

    private renderRow(
        row: Row,
        level = 0,
        rowCssIndex: number = 0,
        previousRow?: Row
    ) {
        const visibleColumns = this.getVisibleColumns();
        let rowActionsCount: number = 0;

        if (row.group) {
            // Composes the label the group must display
            let composedGroupLabel: string;
            switch (this.groupLabelDisplay) {
                case GroupLabelDisplayMode.LABEL:
                    composedGroupLabel = row.group.columnLabel;
                    break;
                case GroupLabelDisplayMode.VALUE:
                    composedGroupLabel = row.group.label;
                    break;
                case GroupLabelDisplayMode.BOTH:
                default:
                    composedGroupLabel =
                        row.group.columnLabel + ' = ' + row.group.label;
                    break;
            }

            if (row.group.children.length === 0) {
                // empty group
                return null;
            }

            const iconClass = row.group.expanded
                ? 'icon-container expanded'
                : 'icon-container collapsed';

            const jsxRows = [];

            const indent = [];
            for (let i = 0; i < level; i++) {
                indent.push(<span class="indent" />);
            }

            if (this.hasTotals()) {
                //const colSpan = this.multiSelection ? 2 : 1;
                const cells = [];
                if (this.hasRowActions()) {
                    cells.push(<td></td>);
                }
                if (this.selection === SelectionMode.MULTIPLE_CHECKBOX) {
                    cells.push(<td></td>);
                }
                // adding 'grouping' cell
                const grouplabelcell = (
                    <td colSpan={this.calculateColspan()}>
                        <span class="group-cell-content">
                            {indent}
                            <span class={iconClass}></span>
                            <span class="text">{composedGroupLabel}</span>
                        </span>
                    </td>
                );

                // adding 'totals grouping' cells
                for (let column of visibleColumns) {
                    let totalClass = 'total';
                    if (row.group.totals[column.name] < 0) {
                        totalClass += ' negative-number';
                    }
                    // TODO please use getValueForDisplay
                    let value;
                    const totalValue = row.group.totals[column.name];
                    if (
                        this.totals[column.name] === TotalMode.COUNT ||
                        this.totals[column.name] === TotalMode.DISTINCT
                    ) {
                        value = totalValue;
                    } else {
                        if (this.kupManager.objects.isDate(column.obj)) {
                            if (totalValue) {
                                if (
                                    isValidStringDate(
                                        totalValue,
                                        ISO_DEFAULT_DATE_FORMAT
                                    )
                                ) {
                                    value =
                                        unformattedStringToFormattedStringDate(
                                            totalValue,
                                            null,
                                            column.obj.t + column.obj.p
                                        );
                                } else {
                                    console.warn(`invalid date: ${totalValue}`);
                                }
                            }
                        } else {
                            value = numberToFormattedStringNumber(
                                totalValue,
                                column.decimals,
                                column.obj ? column.obj.p : ''
                            );
                        }
                    }
                    /*
                    TODO Group Menu
                    const groupMenu = undefined;
                    if (this.isOpenedGroupMenuForColumn(column.name)) {
                        const listData: ComponentListElement[] = [
                            {
                                text: 'Matrice dei totali',
                                value: 'MATTOT',
                                selected: false,
                            },
                        ];

                        groupMenu = (
                            <kup-list
                                class={`kup-menu group-menu`}
                                data={...listData}
                                id="group-menu"
                                is-menu
                                menu-visible
                                onBlur={() => this.closeGroupMenu()}
                                onKupListClick={(event) => console.log(event)}
                                tabindex={0}
                            ></kup-list>
                        );
                    }
                    {groupMenu}
                    */
                    cells.push(<td class={totalClass}>{value}</td>);
                }

                jsxRows.push(
                    <tr data-row={row} class="group group-label">
                        {grouplabelcell}
                    </tr>
                );

                jsxRows.push(
                    <tr data-row={row} class="group group-total">
                        {cells}
                    </tr>
                );
            } else {
                jsxRows.push(
                    <tr data-row={row} class="group">
                        <td colSpan={this.calculateColspan()}>
                            <span class="group-cell-content">
                                {indent}
                                <span class={iconClass}></span>
                                <span class="text">{composedGroupLabel}</span>
                            </span>
                        </td>
                    </tr>
                );
            }

            // if group is expanded, add children
            if (this.isGroupExpanded(row)) {
                row.group.children
                    // We must pass the previous element of the array to check if we must hide or display the value of the cell
                    // When the column has specified the parameter hideValuesRepetitions
                    .map((row, groupRowIndex, currentArray) =>
                        this.renderRow(
                            row,
                            level + 1,
                            groupRowIndex,
                            groupRowIndex > 0
                                ? currentArray[groupRowIndex - 1]
                                : undefined
                        )
                    )
                    .forEach((jsxRow) => {
                        if (Array.isArray(jsxRow)) {
                            jsxRow.forEach((jr) => jsxRows.push(jr));
                        } else {
                            jsxRows.push(jsxRow);
                        }
                    });
            }

            // grouping row
            return jsxRows;
        } else {
            //-- The row is normal --
            /**
             * How many control cells there are before the effective cells
             */
            let specialExtraCellsCount: number = 0;

            // Renders selection cell
            // IF active, this must be the first cell
            // This is a special cell
            let selectRowCell = null;
            if (this.selection === SelectionMode.MULTIPLE_CHECKBOX) {
                specialExtraCellsCount++;
                const selectionStyleAndClass =
                    this.composeFixedCellStyleAndClass(
                        specialExtraCellsCount,
                        rowCssIndex,
                        specialExtraCellsCount - 1
                    );

                const props: FCheckboxProps = {
                    checked: this.selectedRows.includes(row),
                    dataSet: {
                        'data-row': row,
                    },
                };

                selectRowCell = (
                    <td
                        row-select-cell
                        class={
                            selectionStyleAndClass
                                ? selectionStyleAndClass.fixedCellClasses
                                : null
                        }
                        style={
                            selectionStyleAndClass
                                ? selectionStyleAndClass.fixedCellStyle
                                : null
                        }
                    >
                        <FCheckbox {...props} />
                    </td>
                );
            }

            // Renders action cell
            // If active, this can be either the first or second cell
            let rowActionsCell = null;
            if (this.hasRowActions()) {
                // Increments
                specialExtraCellsCount++;
                const actionsStyleAndClass = this.composeFixedCellStyleAndClass(
                    specialExtraCellsCount,
                    rowCssIndex,
                    specialExtraCellsCount - 1
                );

                rowActionsCount += this.rowActions.length;
                const defaultRowActions = this.renderActions(
                    this.rowActions,
                    row,
                    'default'
                );

                let rowActionExpander = null;
                let variableActions = null;
                if (row.actions) {
                    rowActionsCount += row.actions.length;
                    // adding variable actions
                    variableActions = this.renderActions(
                        row.actions,
                        row,
                        'variable'
                    );
                } else {
                    // adding expander
                    const props: FImageProps = {
                        color: 'var(--kup-primary-color)',
                        dataSet: {
                            'data-row': row,
                        },
                        resource: 'chevron-right',
                        sizeX: '1.5em',
                        sizeY: '1.5em',
                        title: this.kupManager.language.translate(
                            KupLanguageGeneric.EXPAND
                        ),
                        wrapperClass: 'expander',
                    };
                    rowActionsCount++;
                    rowActionExpander = <FImage {...props} />;
                }

                rowActionsCell = (
                    <td
                        row-action-cell
                        class={
                            actionsStyleAndClass
                                ? actionsStyleAndClass.fixedCellClasses
                                : null
                        }
                        style={
                            actionsStyleAndClass
                                ? actionsStyleAndClass.fixedCellStyle
                                : null
                        }
                    >
                        {defaultRowActions}
                        {rowActionExpander}
                        {variableActions}
                    </td>
                );
            }

            // Renders plain rows cells
            const cells = visibleColumns.map((currentColumn, cellIndex) => {
                const { name, hideValuesRepetitions } = currentColumn;
                const indend = [];
                if (cellIndex === 0) {
                    for (let i = 0; i < level; i++) {
                        indend.push(<span class="indent" />);
                    }
                }

                const cell = row.cells[name];

                const jsxCell = this.renderCell(
                    indend,
                    cell,
                    row,
                    currentColumn,
                    hideValuesRepetitions && previousRow
                        ? previousRow.cells[name].value
                        : undefined
                );

                // Classes which will be set onto the single data-table cell
                let cellClass = {
                    //    'has-options': !!options,
                    'is-graphic': this.kupManager.objects.isBar(cell.obj),
                    number:
                        this.kupManager.objects.isNumber(cell.obj) &&
                        !isRating(cell, null) &&
                        !isGauge(cell, null) &&
                        !isKnob(cell, null),
                };
                if (cell.cssClass) {
                    cellClass[cell.cssClass] = true;
                }

                let cellStyle: GenericObject = null;
                if (!styleHasBorderRadius(cell)) {
                    cellStyle = cell.style;
                }

                //-- For fixed cells --
                const fixedStyles = this.composeFixedCellStyleAndClass(
                    cellIndex + 1 + specialExtraCellsCount,
                    rowCssIndex,
                    specialExtraCellsCount
                );
                if (fixedStyles) {
                    cellStyle = Object.assign(
                        cellStyle ? cellStyle : {},
                        fixedStyles.fixedCellStyle
                    );
                    cellClass = {
                        ...cellClass,
                        ...fixedStyles.fixedCellClasses,
                    };
                }

                // Controls if there are columns with a specified width
                if (this.sizedColumns) {
                    let colWidth: string = '';

                    // Search if this column has a specified width
                    for (let j = 0; j < this.sizedColumns.length; j++) {
                        if (name === this.sizedColumns[j].name) {
                            colWidth = this.sizedColumns[j].size;
                            break;
                        }
                    }

                    // Specific width has been found
                    if (colWidth) {
                        if (!cellStyle) {
                            cellStyle = {};
                        }

                        // Sets the width.
                        // Search for "auto-width" class inside the scss file of this component for more details about this
                        cellStyle['max-width'] = colWidth;
                        cellStyle['min-width'] = colWidth;
                        cellStyle['width'] = colWidth;
                    }
                }

                /**
                 * Controls if current cell needs a tooltip and eventually adds it.
                 * @todo When the option forceOneLine is active, there is a problem with the current implementation of the tooltip. See documentation in the mauer wiki for better understanding.
                 */
                const _hasTooltip: boolean = this.kupManager.objects.hasTooltip(
                    cell.obj
                );
                let eventHandlers = undefined;
                let title: string = undefined;
                if (_hasTooltip) {
                    cellClass['is-obj'] = true;
                    if (this.kupManager.debug.isDebug()) {
                        title =
                            cell.obj.t +
                            '; ' +
                            cell.obj.p +
                            '; ' +
                            cell.obj.k +
                            ';';
                    }
                    if (!this.showTooltipOnRightClick) {
                        eventHandlers = {
                            onMouseEnter: (ev) => {
                                setTooltip(
                                    ev,
                                    row.id,
                                    currentColumn.name,
                                    cell,
                                    this.tooltip
                                );
                            },
                            onMouseLeave: () => {
                                unsetTooltip(this.tooltip);
                            },
                        };
                    }
                }

                return (
                    <td
                        {...(this.dropEnabled
                            ? setKetchupDroppable(
                                  dropHandlersCell,
                                  [KupDataTableRowDragType],
                                  this.rootElement,
                                  {
                                      row: row,
                                      cell: cell,
                                      column: currentColumn,
                                      id: this.rootElement.id,
                                  }
                              )
                            : {})}
                        title={title}
                        data-cell={cell}
                        data-column={name}
                        data-row={row}
                        style={cellStyle}
                        class={cellClass}
                        {...eventHandlers}
                    >
                        {jsxCell}
                    </td>
                );
            });

            // adding row to rendered rows
            this.renderedRows.push(row);

            const rowClass = {
                selected: this.selectedRows.includes(row),
            };
            if (row.cssClass) {
                rowClass[row.cssClass] = true;
            }

            const dragHandlersRow: DragHandlers = {
                onDragStart: (e: DragEvent) => {
                    // get the tr tag
                    const trElement = e.target as HTMLTableRowElement;
                    let cell = {};
                    let column = {};
                    if (trElement) {
                        // get the elements inside the row that were touched
                        const hoverElements =
                            trElement.querySelectorAll(':hover');
                        if (hoverElements) {
                            // the td in position 0 is ALWAYS the last td touched
                            const tdElement =
                                hoverElements[0] as HTMLTableCellElement;
                            if (tdElement) {
                                // get the column name in td element
                                const columnName =
                                    tdElement.getAttribute('data-column');
                                if (columnName) {
                                    // finally get the cell
                                    cell = row.cells[columnName];
                                    // and the column
                                    column = getColumnByName(
                                        this.getColumns(),
                                        columnName
                                    );
                                }
                            }
                        }
                    }

                    // because I found the cell and the column inside this method I have to set here the event data
                    // in this scenario it is not necessary pass the data parameter in setKetchupDraggable method
                    const sourceElementData = {
                        id: this.rootElement.id,
                        row,
                        selectedRows: this.selectedRows,
                        cell,
                        column,
                    };
                    // set event data
                    // this is mandatory in order to add the source element data in the kup drop event
                    e.dataTransfer.setData(
                        'kup-drag-source-element',
                        JSON.stringify(sourceElementData)
                    );

                    // Sets the type of drag
                    setDragEffectAllowed(e, 'move');

                    if (
                        this.selectedRows.length > 1 ||
                        (this.selectedRows.length == 1 &&
                            !this.selectedRows.includes(row))
                    ) {
                        this.addMultiSelectDragImageToEvent(e);
                    }
                },
                onDragEnd: (_e: DragEvent) => {
                    // Remove the over class
                    const dragDropPayload = getDragDropPayload();
                    if (dragDropPayload && dragDropPayload.overElement) {
                        dragDropPayload.overElement.classList.remove(
                            'selected'
                        );
                    }
                },
            };

            const style: GenericObject = {
                '--row-actions': rowActionsCount,
            };

            return (
                <tr
                    data-row={row}
                    class={rowClass}
                    style={style}
                    {...(this.dragEnabled
                        ? setKetchupDraggable(dragHandlersRow, {
                              [KupDataTableRowDragType]: row,
                              'kup-drag-source-element': {}, // I put nothing in there because I overwrite the content inside the onDragStart method
                          })
                        : {})}
                >
                    {selectRowCell}
                    {rowActionsCell}
                    {cells}
                </tr>
            );
        }
    }

    private renderActions(
        actions: Array<RowAction>,
        row: Row,
        type: string
    ): JSX.Element[] {
        return actions.map((action, index) => {
            const props: FImageProps = {
                color: 'var(--kup-primary-color)',
                dataSet: {
                    'data-action': {
                        action,
                        index,
                        row,
                        type,
                    },
                },
                resource: action.icon,
                sizeX: '1.5em',
                sizeY: '1.5em',
                title: action.text,
                wrapperClass: 'action',
            };
            return <FImage {...props} />;
        });
    }

    /**
     * FActory function for cells.
     * @param cell - cell object
     * @param column - the cell's column name
     * @param previousRowCellValue - An optional value of the previous cell on the same column. If set and equal to the value of the current cell, makes the value of the current cell go blank.
     * @param cellData - Additional data for the current cell.
     * @param cellData.column - The column object to which the cell belongs.
     * @param cellData.row - The row object to which the cell belongs.
     */
    private renderCell(
        indend: any,
        cell: Cell,
        row: Row,
        column: Column,
        previousRowCellValue?: string
    ) {
        const isEditable: boolean =
            cell.isEditable && this.editableData ? true : false;
        const classObj: Record<string, boolean> = {
            'cell-content': true,
            clickable: !!column.clickable,
            'force-one-line': this.forceOneLine == true ? true : null,
        };

        // When the previous row value is different from the current value, we can show the current value.
        const valueToDisplay =
            previousRowCellValue !== cell.value ? cell.value : '';

        // Sets the default value
        let content: any = valueToDisplay;
        const cellType: string = this.getCellType(cell);
        const props: any = { ...cell.data };
        classObj[cellType + '-cell'] = true;
        if (
            isEditable &&
            (cellType === 'checkbox' ||
                cellType === 'date' ||
                cellType === 'number' ||
                cellType === 'string')
        ) {
            content = this.setEditableCell(cellType, cell, column, row);
        } else if (
            cellType === 'checkbox' ||
            cellType === 'date' ||
            cellType === 'time' ||
            cellType === 'datetime' ||
            cellType === 'icon' ||
            cellType === 'image' ||
            cellType === 'link' ||
            cellType === 'number' ||
            cellType === 'string'
        ) {
            this.setCellSize(cellType, props, cell);
            content = this.setCell(
                cellType,
                props,
                content,
                classObj,
                cell,
                column
            );
        } else if (cell.data) {
            this.setCellSizeKup(cellType, props, cell);
            if (!this.lazyLoadCells) {
                content = this.setLazyKupCell(cellType, props);
            } else {
                content = this.setKupCell(
                    cellType,
                    classObj,
                    props,
                    cell,
                    row,
                    column
                );
            }
        }

        const style = cell.style;

        if (styleHasWritingMode(cell)) {
            classObj['is-vertical'] = true;
        }

        let icon = undefined;

        if (!isEditable && (column.icon || cell.icon) && content) {
            let svg: string = '';
            if (cell.icon) {
                svg = cell.icon;
            } else {
                svg = column.icon;
            }
            svg = this.getIconPath(svg);
            const iconStyle = {
                mask: svg,
                webkitMask: svg,
            };
            icon = (
                <span style={iconStyle} class="icon-container obj-icon"></span>
            );
        }

        let cellTitle = null;
        if (cell.title != null && cell.title.trim() != '') {
            cellTitle = cell.title;
        }

        // Informational icon
        let infoEl: HTMLElement = null;
        if (cell.info && cell.info.message) {
            const info: KupCellInfo = { ...cell.info };
            if (!info.color) {
                info.color = 'var(--kup-info-color)';
            }
            if (!info.icon) {
                info.icon = 'info';
            }
            let fProps: FImageProps = {
                color: info.color,
                resource: info.icon,
                sizeX: '1.25em',
                sizeY: '1.25em',
                title: info.message,
                wrapperClass: 'cell-info',
            };
            infoEl = <FImage {...fProps} />;
        }

        return (
            <span class={classObj} style={style} title={cellTitle}>
                {indend}
                {infoEl}
                {icon}
                {content}
            </span>
        );
    }

    private getIconPath(icon: string) {
        let svg: string = '';
        if (this.iconPaths) {
            for (
                let index = 0;
                index < this.iconPaths.length || svg !== '';
                index++
            ) {
                if (this.iconPaths[index].icon === icon) {
                    return this.iconPaths[index].path;
                }
            }
        }

        svg = `url('${getAssetPath(
            `./assets/svg/${icon}.svg`
        )}') no-repeat center`;

        if (!this.iconPaths) {
            this.iconPaths = [
                {
                    icon: icon,
                    path: svg,
                },
            ];
        } else {
            this.iconPaths.push({ icon: icon, path: svg });
        }

        return svg;
    }

    // TODO: cell type can depend also from shape (see isRating)
    // NOTE: keep care to change conditions order... shape wins on object .. -> so if isNumber after shape checks.. ->
    // TODO: more clear conditions when refactoring...
    private getCellType(cell: Cell) {
        return getCellType(cell);
    }

    private setLazyKupCell(cellType: string, props: any) {
        const lazyClass = 'cell-' + cellType + ' placeholder';
        const style = { minHeight: props.sizeY };
        return <span style={style} class={lazyClass}></span>;
    }

    private setCellSize(cellType: string, props: any, cell: Cell) {
        switch (cellType) {
            case 'checkbox':
            case 'icon':
                if (!props.sizeX) {
                    props['sizeX'] = '18px';
                }
                if (!props.sizeY) {
                    props['sizeY'] = '18px';
                }
                if (cell.style) {
                    if (!cell.style.height) {
                        cell.style['minHeight'] = props['sizeY'];
                    }
                } else {
                    cell.style = {
                        minHeight: props['sizeY'],
                    };
                }
                break;
            case 'image':
                if (!props.sizeX) {
                    props['sizeX'] = 'auto';
                }
                if (!props.sizeY) {
                    props['sizeY'] = '64px';
                }
                break;
        }
    }

    private setCellSizeKup(cellType: string, props: any, cell: Cell) {
        switch (cellType) {
            case 'bar':
                if (!props.sizeY) {
                    props['sizeY'] = '26px';
                    if (this.density === 'medium') {
                        props['sizeY'] = '36px';
                    }
                    if (this.density === 'wide') {
                        props['sizeY'] = '50px';
                    }
                }
                break;
            case 'button':
                let height: string = '';
                if (props.label) {
                    height = '36px';
                } else {
                    height = '48px';
                }
                if (cell.style) {
                    if (!cell.style.height) {
                        cell.style['minHeight'] = height;
                    }
                } else {
                    cell.style = { minHeight: height };
                }
                break;
            case 'chart':
                if (!props.sizeX) {
                    props['sizeX'] = '100%';
                }
                if (!props.sizeY) {
                    props['sizeY'] = '100%';
                }
                break;
            case 'chips':
                if (cell.style) {
                    if (!cell.style.height) {
                        cell.style['minHeight'] = '53px';
                    }
                } else {
                    cell.style = { minHeight: '53px' };
                }
                break;
            case 'radio':
                if (cell.style) {
                    if (!cell.style.height) {
                        cell.style['minHeight'] = '40px';
                    }
                } else {
                    cell.style = { minHeight: '40px' };
                }
                break;
        }
    }

    private setEditableCell(
        cellType: string,
        cell: Cell,
        column: Column,
        row: Row
    ) {
        switch (cellType) {
            case 'checkbox':
                return (
                    <FCheckbox
                        checked={cell.data['checked']}
                        dataSet={{
                            'data-cell': cell,
                            'data-column': column,
                            'data-row': row,
                        }}
                    />
                );
            case 'date':
                return (
                    <kup-date-picker
                        onKupDatePickerChange={(e) =>
                            this.cellUpdate(
                                e,
                                e.detail.value,
                                cell,
                                column,
                                row
                            )
                        }
                        data={{
                            'kup-text-field': {
                                fullWidth: true,
                            },
                        }}
                        initialValue={cell.value}
                    />
                );
            case 'number':
                return (
                    <FTextField
                        dataSet={{
                            'data-cell': cell,
                            'data-column': column,
                            'data-row': row,
                        }}
                        icon={
                            cell.icon
                                ? cell.icon
                                : column.icon
                                ? column.icon
                                : null
                        }
                        fullWidth={true}
                        inputType="number"
                        value={stringToNumber(cell.value).toString()}
                    />
                );
            case 'string':
                return (
                    <FTextField
                        dataSet={{
                            'data-cell': cell,
                            'data-column': column,
                            'data-row': row,
                        }}
                        icon={
                            cell.icon
                                ? cell.icon
                                : column.icon
                                ? column.icon
                                : null
                        }
                        fullWidth={true}
                        value={cell.value}
                    />
                );
        }
    }

    private setKupCell(
        cellType: string,
        classObj: Record<string, boolean>,
        props: any,
        cell: Cell,
        row: Row,
        column: Column
    ) {
        switch (cellType) {
            case 'bar':
                if (!props.data) {
                    return <kup-image {...props} />;
                } else {
                    const barStyle = {
                        height: props.sizeY,
                    };
                    return (
                        <div class="bar-cell-content" style={barStyle}>
                            <FImage {...props} />
                        </div>
                    );
                }
            case 'button':
                classObj['is-centered'] = true;
                props['disabled'] = row.readOnly;
                props['onKupButtonClick'] = this.onJ4btnClicked.bind(
                    this,
                    row,
                    column,
                    cell
                );
                return <kup-button {...props}></kup-button>;
            case 'btn':
                classObj['is-centered'] = true;
                props['data-storage'] = {
                    cell: cell,
                    row: row,
                    column: column,
                };
                return <kup-btn {...props}></kup-btn>;
            case 'chart':
                classObj['is-centered'] = true;
                return <kup-chart {...props} />;
            case 'chips':
                return <FChip {...props} />;
            case 'color-picker':
                return (
                    <kup-color-picker
                        value={cell.value}
                        {...props}
                        disabled
                    ></kup-color-picker>
                );
            case 'gauge':
                return (
                    <kup-gauge
                        value={stringToNumber(cell.value)}
                        width-component="100%"
                        {...props}
                    ></kup-gauge>
                );
            case 'knob':
            case 'progress-bar':
                return <kup-progress-bar {...props}></kup-progress-bar>;
            case 'rating':
                return (
                    <kup-rating
                        value={stringToNumber(cell.value)}
                        {...props}
                        disabled
                    ></kup-rating>
                );
            case 'radio':
                classObj['is-centered'] = true;
                props['disabled'] = row.readOnly;
                return <kup-radio {...props}></kup-radio>;
            case 'text-field':
                props['disabled'] = row.readOnly;
                props['dataSet'] = {
                    'data-cell': cell,
                    'data-column': column,
                    'data-row': row,
                };
                return <FTextField {...props}></FTextField>;
        }
    }

    private setCell(
        cellType: string,
        props: any,
        content: string,
        classObj: Record<string, boolean>,
        cell: Cell,
        column: Column
    ) {
        switch (cellType) {
            case 'checkbox':
                classObj['is-centered'] = true;
                props['resource'] = props.checked
                    ? 'check_box'
                    : 'check_box_outline_blank';
                return <FImage {...props} />;
            case 'date':
                if (content && content != '') {
                    const cellValue = getCellValueForDisplay(column, cell);
                    return cellValue;
                }
                return content;
            case 'datetime':
                if (content && content != '') {
                    const cellValue = getCellValueForDisplay(column, cell);
                    return cellValue;
                }
                return content;
            case 'icon':
            case 'image':
                classObj['is-centered'] = true;
                if (props.badgeData) {
                    classObj['has-padding'] = true;
                }
                return <FImage {...props} />;
            case 'link':
                return (
                    <a class="cell-link" href={content} target="_blank">
                        {content}
                    </a>
                );
            case 'number':
                if (content && content != '') {
                    const cellValueNumber: number = stringToNumber(cell.value);
                    const cellValue = getCellValueForDisplay(column, cell);
                    if (cellValueNumber < 0) {
                        classObj['negative-number'] = true;
                    }
                    return cellValue;
                }
                return content;
            case 'time':
                if (content && content != '') {
                    const cellValue = getCellValueForDisplay(column, cell);
                    return cellValue;
                }
                return content;
            case 'string':
            default:
                return content;
        }
    }

    private renderLoadMoreButton(isSlotted: boolean = true) {
        return (
            <kup-button
                styling={FButtonStyling.FLAT}
                class="load-more-button"
                label={this.kupManager.language.translate(
                    KupLanguageGeneric.LOAD_MORE
                )}
                icon="plus"
                slot={isSlotted ? 'more-results' : null}
                onKupButtonClick={() => {
                    this.onLoadMoreClick();
                }}
            />
        );
    }

    private onCustomSettingsClick() {
        if (!this.openedCustomSettings) {
            this.openCustomSettings();
        } else {
            this.closeCustomSettings();
        }
    }

    private openCustomSettings() {
        this.customizeTopPanelRef.classList.add('visible');
        this.customizeTopButtonRef.classList.add('toggled');
        this.kupManager.dynamicPosition.start(
            this.customizeTopPanelRef as KupDynamicPositionElement
        );
        this.openedCustomSettings = true;
    }

    private closeCustomSettings() {
        this.customizeTopButtonRef.classList.remove('toggled');
        if (this.customizeTopPanelRef == null) {
            return;
        }
        this.customizeTopPanelRef.classList.remove('visible');
        this.kupManager.dynamicPosition.stop(
            this.customizeTopPanelRef as KupDynamicPositionElement
        );
        this.openedCustomSettings = false;
    }

    private renderPaginator(top: boolean) {
        return (
            <div class="paginator-wrapper">
                <div class="paginator-tabs">
                    {!this.lazyLoadRows &&
                    this.rowsLength > this.rowsPerPage ? (
                        <kup-paginator
                            id={top ? 'top-paginator' : 'bottom-paginator'}
                            max={this.rowsLength}
                            perPage={this.rowsPerPage}
                            selectedPerPage={this.currentRowsPerPage}
                            currentPage={this.currentPage}
                            onKupPageChanged={(e) => this.handlePageChanged(e)}
                            onKupRowsPerPageChanged={(e) =>
                                this.handleRowsPerPageChanged(e)
                            }
                        />
                    ) : null}
                    {this.showLoadMore ? this.renderLoadMoreButton() : null}
                </div>
            </div>
        );
    }

    renderCustomizePanel() {
        let density: HTMLElement = undefined;
        let fontsize: HTMLElement = undefined;
        let grid: HTMLElement = undefined;
        let transpose: HTMLElement = undefined;
        let totalsMatrix: HTMLElement = undefined;
        if (this.openedCustomSettings) {
            density = this.renderDensityPanel();
            fontsize = this.renderFontSizePanel();
            grid = this.renderGridPanel();
            transpose = this.renderTransposeSwitch();
            if (this.totals && this.groups.length > 0) {
                totalsMatrix = this.renderTotalsMatrix();
            }
        }

        return (
            <div
                class="kup-menu customize-panel"
                ref={(el) => {
                    this.customizeTopPanelRef = el as any;
                }}
            >
                {density}
                {grid}
                {fontsize}
                {transpose}
                <kup-switch
                    class="customize-element"
                    checked={this.dragEnabled}
                    label={this.kupManager.language.translate(
                        KupLanguageGeneric.DRAG_AND_DROP
                    )}
                    leadingLabel={true}
                    onKupSwitchChange={() =>
                        (this.dragEnabled = !this.dragEnabled)
                    }
                ></kup-switch>
                <kup-switch
                    class="customize-element"
                    checked={this.editableData}
                    label={this.kupManager.language.translate(
                        KupLanguageGeneric.EDITABLE
                    )}
                    leadingLabel={true}
                    onKupSwitchChange={() =>
                        (this.editableData = !this.editableData)
                    }
                ></kup-switch>
                <kup-button
                    title={
                        this.kupManager.language.translate(
                            KupLanguageGeneric.TOGGLE
                        ) +
                        ' Magic Box ' +
                        '(' +
                        this.kupManager.language.translate(
                            KupLanguageGeneric.EXPERIMENTAL_FEAT
                        ) +
                        ')'
                    }
                    icon="auto-fix"
                    onKupButtonClick={() => this.kupManager.toggleMagicBox()}
                />
                {totalsMatrix}
            </div>
        );
    }

    private columnRemoveArea(): HTMLDivElement {
        const dropHandlersRemoveCols: DropHandlers = {
            onDrop: (e: DragEvent) => {
                const transferredData = JSON.parse(
                    e.dataTransfer.getData(KupDataTableColumnDragType)
                ) as Column;
                const overElement = this.getElementById(
                    e.target as HTMLElement,
                    'remove-column-area'
                );
                overElement.removeAttribute(this.dragOverAttribute);
                // We are sure the tables have been dropped in a valid location -> starts ...
                this.handleColumnRemove(transferredData);
                return KupDataTableColumnDragRemoveType;
            },
            onDragOver: (e: DragEvent) => {
                const overElement = this.getElementById(
                    e.target as HTMLElement,
                    'remove-column-area'
                );
                overElement.setAttribute(this.dragOverAttribute, '');
                return true;
            },
            onDragLeave: (e: DragEvent) => {
                const overElement = this.getElementById(
                    e.target as HTMLElement,
                    'remove-column-area'
                );
                overElement.removeAttribute(this.dragOverAttribute);
                return true;
            },
        };
        return (
            <div
                id="remove-column-area"
                {...setKetchupDroppable(
                    dropHandlersRemoveCols,
                    [
                        KupDataTableColumnDragType,
                        KupDataTableColumnDragRemoveType,
                    ],
                    this.rootElement,
                    {}
                )}
            >
                <FImage
                    resource="delete"
                    color="var(--kup-danger-color)"
                    sizeX="30px"
                    sizeY="50px"
                />
                <FImage
                    resource="delete-empty"
                    color="var(--kup-danger-color)"
                    sizeX="30px"
                    sizeY="50px"
                />
            </div>
        );
    }

    private columnGroupArea(): HTMLDivElement {
        const dropHandlersGroupCols: DropHandlers = {
            onDrop: (e: DragEvent) => {
                const transferredData = JSON.parse(
                    e.dataTransfer.getData(KupDataTableColumnDragType)
                ) as Column;
                const overElement = this.getElementById(
                    e.target as HTMLElement,
                    'group-column-area'
                );
                overElement.removeAttribute(this.dragOverAttribute);
                // We are sure the tables have been dropped in a valid location -> starts ...
                this.handleColumnGroup(transferredData);
                return KupDataTableColumnDragGroupType;
            },
            onDragOver: (e: DragEvent) => {
                const overElement = this.getElementById(
                    e.target as HTMLElement,
                    'group-column-area'
                );
                overElement.setAttribute(this.dragOverAttribute, '');
                return true;
            },
            onDragLeave: (e: DragEvent) => {
                const overElement = this.getElementById(
                    e.target as HTMLElement,
                    'group-column-area'
                );
                overElement.removeAttribute(this.dragOverAttribute);
                return true;
            },
        };
        return (
            <div
                id="group-column-area"
                {...setKetchupDroppable(
                    dropHandlersGroupCols,
                    [
                        KupDataTableColumnDragType,
                        KupDataTableColumnDragGroupType,
                    ],
                    this.rootElement,
                    {}
                )}
            >
                <FImage
                    resource="bookmark"
                    color="var(--kup-danger-color)"
                    sizeX="30px"
                    sizeY="50px"
                />
                <FImage
                    resource="book"
                    color="var(--kup-danger-color)"
                    sizeX="30px"
                    sizeY="50px"
                />
            </div>
        );
    }

    private startDynamicPositioning(
        dropArea: KupDynamicPositionElement,
        th: HTMLElement
    ) {
        if (this.kupManager.dynamicPosition.isRegistered(dropArea)) {
            this.kupManager.dynamicPosition.changeAnchor(
                dropArea as KupDynamicPositionElement,
                th
            );
        } else {
            this.kupManager.dynamicPosition.register(
                dropArea as KupDynamicPositionElement,
                th,
                10,
                KupDynamicPositionPlacement.TOP
            );
        }

        this.kupManager.dynamicPosition.start(
            dropArea as KupDynamicPositionElement
        );
        dropArea.classList.add('visible');
    }

    private stopDynamicPositioning(dropArea: KupDynamicPositionElement) {
        dropArea.classList.remove('visible');
        this.kupManager.dynamicPosition.stop(
            dropArea as KupDynamicPositionElement
        );
        // Chrome workaround: dropArea is draggable even with the display:none rule
        dropArea.style.top = '-50px';
        dropArea.style.left = '-50px';
    }

    private getElementById(target: HTMLElement, id: string): HTMLElement {
        let element: HTMLElement = target as HTMLElement;
        if (element) {
            if (element.nodeType == Node.TEXT_NODE) {
                element = element.parentNode as HTMLElement;
            }
            if (element.id !== id) {
                element = element.closest('#' + id);
            }
        }
        return element;
    }

    private getThElement(target: HTMLElement): HTMLElement {
        let element: HTMLElement = target as HTMLElement;
        if (element) {
            if (element.nodeType == Node.TEXT_NODE) {
                element = element.parentNode as HTMLElement;
            }
            if (element.tagName !== 'TH') {
                element = element.closest('th');
            }
        }
        return element;
    }

    private hideShowColumnDropArea(show: boolean, th?: HTMLElement) {
        this.hideShowColumnRemoveDropArea(show, th);
        this.hideShowColumnGroupDropArea(show, th);
    }

    private hideShowColumnRemoveDropArea(show: boolean, th?: HTMLElement) {
        if (!this.removableColumns) {
            return;
        }
        const dropArea: HTMLElement = this.rootElement.shadowRoot.querySelector(
            '#remove-column-area'
        );
        if (show) {
            const offset: string = this.showGroups ? '0px' : '25px';
            dropArea.style.marginLeft =
                'calc(' + th.clientWidth / 2 + 'px - ' + offset + ')';
            this.startDynamicPositioning(
                dropArea as KupDynamicPositionElement,
                th
            );
        } else {
            this.stopDynamicPositioning(dropArea as KupDynamicPositionElement);
        }
    }

    private hideShowColumnGroupDropArea(show: boolean, th?: HTMLElement) {
        if (!this.showGroups) {
            return;
        }
        const dropArea: HTMLElement =
            this.rootElement.shadowRoot.querySelector('#group-column-area');
        if (show) {
            const offset: string = this.removableColumns ? '51px' : '25px';
            dropArea.style.marginLeft =
                'calc(' + th.clientWidth / 2 + 'px - ' + offset + ')';
            this.startDynamicPositioning(
                dropArea as KupDynamicPositionElement,
                th
            );
        } else {
            this.stopDynamicPositioning(dropArea as KupDynamicPositionElement);
        }
    }

    private handleColumnRemove(column2remove: Column) {
        // Get sorted column current position
        this.getVisibleColumns();
        const columnX = this.getVisibleColumns().find(
            (col) =>
                col.name === column2remove.name &&
                col.title === column2remove.title
        );
        if (columnX) {
            columnX.visible = false;
            this.triggerColumnSortRerender = !this.triggerColumnSortRerender;
        }
    }

    private handleColumnGroup(column2group: Column) {
        // Get sorted column current position
        this.getVisibleColumns();
        const columnX = this.getVisibleColumns().find(
            (col) =>
                col.name === column2group.name &&
                col.title === column2group.title
        );
        if (columnX) {
            let found: boolean = false;
            for (let i = 0; i < this.groups.length; i++) {
                if (this.groups[i].column == columnX.name) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.groups.push({ column: columnX.name, visible: true });
                this.groups = [...this.groups];
                this.triggerColumnSortRerender =
                    !this.triggerColumnSortRerender;
            }
        }
    }

    private transcodeItem(
        item: string | ShowGrid,
        searchIn: Array<string>,
        returnFrom: Array<string>
    ): string {
        for (let i = 0; i < searchIn.length; i++) {
            const tmpCode = searchIn[i];
            if (tmpCode == item && i < returnFrom.length) {
                return returnFrom[i];
            }
        }
        return item;
    }

    private createListData(
        codes: Array<string>,
        icons: Array<string>,
        selectedCode: string
    ): ComponentListElement[] {
        const listItems: ComponentListElement[] = [];
        for (let i = 0; i < codes.length; i++) {
            let text: KupLanguageKey = null;
            switch (codes[i]) {
                //This whole customization panel thingy must be purged, for now -- it's ugly
                case 'big':
                    text = KupLanguageFontsize.BIG;
                    break;
                case 'Col':
                    text = KupLanguageGrid.COLUMN;
                    break;
                case 'Complete':
                    text = KupLanguageGrid.COMPLETE;
                    break;
                case 'dense':
                    text = KupLanguageDensity.DENSE;
                    break;
                case 'medium':
                    text = KupLanguageDensity.MEDIUM;
                    break;
                case 'None':
                    text = KupLanguageGrid.NONE;
                    break;
                case 'small':
                    text = KupLanguageFontsize.SMALL;
                    break;
                case 'Row':
                    text = KupLanguageGrid.ROW;
                    break;
                case 'wide':
                    text = KupLanguageDensity.WIDE;
                    break;
            }
            listItems[i] = {
                text: this.kupManager.language.translate(text),
                value: codes[i],
                selected: selectedCode == codes[i],
                icon: icons[i],
            };
        }
        return listItems;
    }

    private FONTSIZE_CODES: Array<string> = ['small', 'medium', 'big'];
    private FONTSIZE_DECODES: Array<string> = ['Small', 'Medium', 'Big'];
    private FONTSIZE_ICONS: Array<string> = [
        'format-font-size-decrease',
        'format-color-text',
        'format-font-size-increase',
    ];

    private getFontSizeCodeFromDecode(decode: string): string {
        return this.transcodeItem(
            decode,
            this.FONTSIZE_DECODES,
            this.FONTSIZE_CODES
        );
    }

    private renderFontSizePanel() {
        const listItems: ComponentListElement[] = this.createListData(
            this.FONTSIZE_CODES,
            this.FONTSIZE_ICONS,
            this.fontsize
        );

        const listData = { data: listItems, showIcons: true };

        const textfieldData = {
            customStyle: ':host{--kup-field-background-color:transparent}',
            trailingIcon: true,
            label: this.kupManager.language.translate(
                KupLanguageFontsize.LABEL
            ),
            icon: 'arrow_drop_down',
        };
        const data = { 'kup-text-field': textfieldData, 'kup-list': listData };
        let text: KupLanguageFontsize = null;
        switch (this.fontsize) {
            //This whole customization panel thingy must be purged, for now -- it's ugly
            case 'big':
                text = KupLanguageFontsize.BIG;
                break;
            case 'medium':
                text = KupLanguageFontsize.MEDIUM;
                break;
            case 'small':
                text = KupLanguageFontsize.SMALL;
                break;
        }
        return (
            <div class="customize-element fontsize-panel">
                <kup-combobox
                    isSelect={true}
                    data={data}
                    initialValue={this.kupManager.language.translate(text)}
                    onKupComboboxItemClick={(e: CustomEvent) => {
                        e.stopPropagation();
                        this.fontsize = this.getFontSizeCodeFromDecode(
                            e.detail.value
                        );
                    }}
                />
            </div>
        );
    }

    private DENSITY_CODES: Array<string> = ['dense', 'medium', 'wide'];
    private DENSITY_DECODES: Array<string> = ['Dense', 'Normal', 'Wide'];
    private DENSITY_ICONS: Array<string> = [
        'format-align-justify',
        'reorder-horizontal',
        'view-sequential',
    ];
    private getDensityDecodeFromCode(code: string): string {
        return this.transcodeItem(
            code,
            this.DENSITY_CODES,
            this.DENSITY_DECODES
        );
    }

    private getDensityCodeFromDecode(decode: string): string {
        return this.transcodeItem(
            decode,
            this.DENSITY_DECODES,
            this.DENSITY_CODES
        );
    }

    private renderDensityPanel() {
        const listItems: ComponentListElement[] = this.createListData(
            this.DENSITY_CODES,
            this.DENSITY_ICONS,
            this.density
        );

        const listData = { data: listItems, showIcons: true };

        const textfieldData = {
            customStyle: ':host{--kup-field-background-color:transparent}',
            trailingIcon: true,
            label: this.kupManager.language.translate(KupLanguageDensity.LABEL),
            icon: 'arrow_drop_down',
        };

        const data = { 'kup-text-field': textfieldData, 'kup-list': listData };
        let text: KupLanguageDensity = null;
        switch (this.density) {
            //This whole customization panel thingy must be purged, for now -- it's ugly
            case 'dense':
                text = KupLanguageDensity.DENSE;
                break;
            case 'medium':
                text = KupLanguageDensity.MEDIUM;
                break;
            case 'wide':
                text = KupLanguageDensity.WIDE;
                break;
        }
        return (
            <div class="customize-element density-panel">
                <kup-combobox
                    isSelect={true}
                    initialValue={this.kupManager.language.translate(text)}
                    selectMode={ItemsDisplayMode.DESCRIPTION}
                    data={data}
                    onKupComboboxItemClick={(e: CustomEvent) => {
                        e.stopPropagation();
                        this.density = this.getDensityCodeFromDecode(
                            e.detail.value
                        );
                    }}
                />
            </div>
        );
    }

    private GRID_CODES: Array<string> = ['Complete', 'Col', 'Row', 'None'];
    private GRID_DECODES: Array<string> = [
        'Complete',
        'Columns',
        'Rows',
        'None',
    ];
    private GRID_ICONS: Array<string> = [
        'grid_on',
        'view_column',
        'view_headline',
        'grid_off',
    ];

    private getGridCodeFromDecode(decode: string): string {
        return this.transcodeItem(decode, this.GRID_DECODES, this.GRID_CODES);
    }

    private renderTransposeSwitch() {
        return (
            <div class="customize-element grid-panel">
                <kup-switch
                    checked={this.transpose}
                    label={this.kupManager.language.translate(
                        KupLanguageGeneric.TRANSPOSE_DATA
                    )}
                    leadingLabel={true}
                    onKupSwitchChange={(e: CustomEvent) => {
                        e.stopPropagation();
                        if (e.detail.value === 'on') {
                            this.transpose = true;
                        } else {
                            this.transpose = false;
                        }
                    }}
                />
            </div>
        );
    }

    private renderTotalsMatrix() {
        return (
            <div class="customize-element grid-panel">
                <kup-button
                    title={
                        this.kupManager.language.translate(
                            KupLanguageGeneric.TOTALS_TABLE
                        ) +
                        ' (' +
                        this.kupManager.language.translate(
                            KupLanguageGeneric.EXPERIMENTAL_FEAT
                        ) +
                        ')'
                    }
                    label={this.kupManager.language.translate(
                        KupLanguageGeneric.TOTALS_TABLE
                    )}
                    icon="exposure"
                    onKupButtonClick={() => this.switchToTotalsMatrix()}
                />
            </div>
        );
    }

    private renderGridPanel() {
        const listItems: ComponentListElement[] = this.createListData(
            this.GRID_CODES,
            this.GRID_ICONS,
            this.showGrid
        );

        const listData = { data: listItems, showIcons: true };

        const textfieldData = {
            customStyle: ':host{--kup-field-background-color:transparent}',
            trailingIcon: true,
            label: this.kupManager.language.translate(KupLanguageGrid.LABEL),
            icon: 'arrow_drop_down',
        };
        const data = { 'kup-text-field': textfieldData, 'kup-list': listData };
        let text: KupLanguageGrid = null;
        switch (this.showGrid) {
            //This whole customization panel thingy must be purged, for now -- it's ugly
            case ShowGrid.COL:
                text = KupLanguageGrid.COLUMN;
                break;
            case ShowGrid.COMPLETE:
                text = KupLanguageGrid.COMPLETE;
                break;
            case ShowGrid.NONE:
                text = KupLanguageGrid.NONE;
                break;
            case ShowGrid.ROW:
                text = KupLanguageGrid.ROW;
                break;
        }
        return (
            <div class="customize-element grid-panel">
                <kup-combobox
                    isSelect={true}
                    initialValue={this.kupManager.language.translate(text)}
                    data={data}
                    onKupComboboxItemClick={(e: CustomEvent) => {
                        e.stopPropagation();
                        const grid: any = this.getGridCodeFromDecode(
                            e.detail.value
                        );
                        this.showGrid = grid;
                    }}
                />
            </div>
        );
    }

    render() {
        this.renderedRows = [];
        let elStyle = undefined;
        this.sizedColumns = this.getSizedColumns();

        let rows = null;
        if (this.paginatedRowsLength === 0) {
            rows = (
                <tr>
                    <td
                        {...(this.dropEnabled
                            ? setKetchupDroppable(
                                  dropHandlersCell,
                                  [KupDataTableRowDragType],
                                  this.rootElement,
                                  {
                                      row: null,
                                      cell: null,
                                      column: null,
                                      id: this.rootElement.id,
                                  }
                              )
                            : {})}
                        colSpan={this.calculateColspan()}
                    >
                        {this.emptyDataLabel}
                    </td>
                </tr>
            );
        } else {
            rows = [];
            this.paginatedRows
                // We must pass the previous element of the array to check if we must hide or display the value of the cell
                // When the column has specified the parameter hideValuesRepetitions
                .map((row, rowIndex, currentArray) =>
                    this.renderRow(
                        row,
                        0,
                        rowIndex + 1,
                        rowIndex > 0 ? currentArray[rowIndex - 1] : null
                    )
                )
                .forEach((jsxRow) => {
                    if (Array.isArray(jsxRow)) {
                        jsxRow.forEach((jr) => rows.push(jr));
                    } else {
                        rows.push(jsxRow);
                    }
                });
        }

        // header
        // for multi selection purposes, this should be called before this.renderedRows has been evaluated
        const header = this.renderHeader();
        const stickyHeader = this.renderStickyHeader();

        const tooltip = this.renderTooltip();

        let paginatorTop = undefined;
        let paginatorBottom = undefined;
        if (
            (!this.lazyLoadRows && this.rowsLength > this.rowsPerPage) ||
            this.showCustomization ||
            this.showLoadMore
        ) {
            if (
                PaginatorPos.TOP === this.paginatorPos ||
                PaginatorPos.BOTH === this.paginatorPos
            ) {
                paginatorTop = this.renderPaginator(true);
            }

            if (
                PaginatorPos.BOTTOM === this.paginatorPos ||
                PaginatorPos.BOTH === this.paginatorPos
            ) {
                paginatorBottom = this.renderPaginator(false);
            }
        }

        let groupChips = null;
        if (this.isGrouping()) {
            const chipsData = this.groups.map((group) => {
                const column = getColumnByName(this.getColumns(), group.column);

                if (column) {
                    const a: FChipData = {
                        label: column.title,
                        value: column.name,
                        checked: true,
                    };
                    return a;
                } else {
                    return null;
                }
            });
            if (chipsData.length > 0) {
                const props = {
                    data: chipsData,
                    id: 'group-chips',
                    type: FChipType.INPUT,
                };
                groupChips = <FChip {...props}></FChip>;
            }
        }
        const tableClass = {
            // Class to specify whether the table should have width: auto or not.
            // Mandatory to check with custom column size.
            'auto-width': this.tableHasAutoWidth(),
            'column-separation':
                ShowGrid.COMPLETE === this.showGrid ||
                ShowGrid.COL === this.showGrid,
            // When there are columns with a specified width, we must add table-layout: fixed to force the table to respect them
            'row-separation':
                ShowGrid.COMPLETE === this.showGrid ||
                ShowGrid.ROW === this.showGrid,

            'persistent-header':
                this.headerIsPersistent &&
                this.tableHeight === undefined &&
                this.tableWidth === undefined,

            'custom-size':
                this.tableHeight !== undefined || this.tableWidth !== undefined,

            'border-top': !this.showHeader,
        };

        tableClass[`density-${this.density}`] = true;
        tableClass[`fontsize-${this.fontsize}`] = true;

        if (this.tableHeight) {
            elStyle = {
                height: this.tableHeight,
                overflow: 'auto',
            };
        }

        if (this.tableWidth) {
            elStyle = {
                ...elStyle,
                width: this.tableWidth,
                overflow: 'auto',
            };
        }

        let stickyEl = undefined;
        if (
            this.headerIsPersistent &&
            this.tableHeight === undefined &&
            this.tableWidth === undefined
        ) {
            stickyEl = (
                <sticky-header
                    class="hover-scrolling-child"
                    hidden={!this.showHeader}
                    ref={(el: HTMLTableSectionElement) =>
                        (this.stickyTheadRef = el as any)
                    }
                >
                    <thead-sticky>
                        <tr-sticky>{stickyHeader}</tr-sticky>
                    </thead-sticky>
                </sticky-header>
            );
        }

        let belowClass = 'below-wrapper';
        if (this.tableHeight !== undefined || this.tableWidth !== undefined) {
            belowClass += ' custom-size';
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        const compCreated = (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div class="above-wrapper">
                        {this.globalFilter ? (
                            <div id="global-filter">
                                <FTextField
                                    fullWidth={true}
                                    icon="magnify"
                                    isClearable={true}
                                    label={this.kupManager.language.translate(
                                        KupLanguageSearch.SEARCH
                                    )}
                                    value={this.globalFilterValue}
                                />
                            </div>
                        ) : null}
                        {paginatorTop}
                    </div>
                    {groupChips}
                    <div
                        style={elStyle}
                        class={belowClass}
                        ref={(el: HTMLElement) =>
                            (this.tableAreaRef = el as KupScrollOnHoverElement)
                        }
                    >
                        {this.showCustomization
                            ? [
                                  <div
                                      class="settings-trigger"
                                      onClick={() => {
                                          this.onCustomSettingsClick();
                                      }}
                                      ref={(el) => {
                                          this.customizeTopButtonRef =
                                              el as any;
                                      }}
                                  >
                                      <FImage
                                          color="var(--kup-title-color)"
                                          resource="settings"
                                          sizeX="10px"
                                      />
                                  </div>,
                                  this.renderCustomizePanel(),
                              ]
                            : null}
                        <table
                            class={tableClass}
                            ref={(el: HTMLTableElement) => (this.tableRef = el)}
                            onMouseLeave={(ev) => {
                                ev.stopPropagation();
                                unsetTooltip(this.tooltip);
                            }}
                            onClick={(e: MouseEvent) => {
                                // Note: event must be cloned
                                // otherwise inside setTimeout will be exiting the Shadow DOM scope(causing loss of information, including target).
                                const clone: GenericObject = {};
                                for (const key in e) {
                                    clone[key] = e[key];
                                }
                                this.clickTimeout.push(
                                    setTimeout(() => {
                                        this.kupDataTableClick.emit({
                                            comp: this,
                                            details: this.clickHandler(
                                                clone as MouseEvent
                                            ),
                                        });
                                    }, 300)
                                );
                            }}
                            onContextMenu={(e: MouseEvent) => {
                                this.kupDataTableContextMenu.emit({
                                    comp: this,
                                    details: this.contextMenuHandler(e),
                                });
                            }}
                            onDblClick={(e: MouseEvent) => {
                                for (
                                    let index = 0;
                                    index < this.clickTimeout.length;
                                    index++
                                ) {
                                    clearTimeout(this.clickTimeout[index]);
                                    this.kupManager.debug.logMessage(
                                        this,
                                        'Cleared clickHandler timeout(' +
                                            this.clickTimeout[index] +
                                            ').'
                                    );
                                }
                                this.clickTimeout = [];
                                this.kupDataTableDblClick.emit({
                                    comp: this,
                                    details: this.dblClickHandler(e),
                                });
                            }}
                            onMouseMove={(e: MouseEvent) =>
                                this.mouseMoveHandler(e)
                            }
                            onMouseOut={() => this.mouseOutHandler()}
                        >
                            <thead
                                hidden={!this.showHeader}
                                ref={(el) => (this.theadRef = el as any)}
                            >
                                <tr>{header}</tr>
                            </thead>
                            <tbody>{rows}</tbody>
                            {this.showFooter || this.hasTotals()
                                ? this.renderFooter()
                                : null}
                        </table>
                        {stickyEl}
                    </div>
                    {tooltip}
                    <kup-card
                        data={
                            this.columnMenuAnchor
                                ? this.columnMenuInstance.prepData(
                                      this,
                                      getColumnByName(
                                          this.getVisibleColumns(),
                                          this.columnMenuAnchor
                                      ),
                                      this.columnMenuCard.data
                                  )
                                : null
                        }
                        id={KupColumnMenuIds.CARD_COLUMN_MENU}
                        isMenu={true}
                        layoutNumber={14}
                        onBlur={() => {
                            if (
                                this.kupManager.utilities.lastMouseDownPath.includes(
                                    this.columnMenuCard
                                )
                            ) {
                                this.columnMenuCard.focus();
                            } else {
                                this.closeColumnMenu();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKupCardEvent={(e) => {
                            this.columnMenuInstance.eventHandlers(e, this);
                        }}
                        ref={(el: HTMLKupCardElement) =>
                            (this.columnMenuCard = el)
                        }
                        sizeX="auto"
                        sizeY="auto"
                        tabIndex={-1}
                    ></kup-card>
                    {paginatorBottom}
                </div>
                {this.showGroups ? this.columnGroupArea() : null}
                {this.removableColumns ? this.columnRemoveArea() : null}
            </Host>
        );
        return compCreated;
    }

    disconnectedCallback() {
        this.kupManager.language.unregister(this);
        this.kupManager.theme.unregister(this);
        const dynamicPositionElements: NodeListOf<KupDynamicPositionElement> =
            this.rootElement.shadowRoot.querySelectorAll(
                '[' + kupDynamicPositionAttribute + ']'
            );
        if (dynamicPositionElements.length > 0) {
            this.kupManager.dynamicPosition.unregister(
                Array.prototype.slice.call(dynamicPositionElements)
            );
        }
        if (this.scrollOnHover) {
            this.kupManager.scrollOnHover.unregister(this.tableAreaRef);
        }
        this.kupManager.resize.unobserve(this.rootElement);
        this.kupDidUnload.emit();
    }
}
