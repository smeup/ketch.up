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

import {
    Cell,
    CellData,
    Column,
    Row,
    TotalLabel,
    TotalMode,
    TotalsMap,
} from './../kup-data-table/kup-data-table-declarations';

import {
    KupTreeProps,
    treeExpandedPropName,
    TreeNode,
    TreeNodePath,
    treeMainColumnName,
    EventHandlerDetails,
    KupTreeNodeCollapseEventPayload,
    KupTreeNodeExpandEventPayload,
    KupTreeNodeSelectedEventPayload,
    KupTreeNodeButtonClickEventPayload,
    KupTreeContextMenuEventPayload,
    KupTreeColumnMenuEventPayload,
    KupTreeDynamicMassExpansionEventPayload,
} from './kup-tree-declarations';

import { MDCRipple } from '@material/ripple';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    calcTotals,
    normalizeRows,
    styleHasBorderRadius,
    styleHasWritingMode,
} from '../kup-data-table/kup-data-table-helper';
import { KupTreeState } from './kup-tree-state';
import { KupStore } from '../kup-state/kup-store';

import { KupTooltip } from '../kup-tooltip/kup-tooltip';
import { setTooltip, unsetTooltip } from '../../utils/helpers';

import {
    getCellType,
    getCellValueForDisplay,
    getColumnByName,
} from '../../utils/cell-utils';
import {
    deepEqual,
    getProps,
    numberToFormattedStringNumber,
    setProps,
    stringToNumber,
} from '../../utils/utils';
import { KupColumnMenu } from '../../utils/kup-column-menu/kup-column-menu';
import { FiltersColumnMenu } from '../../utils/filters/filters-column-menu';
import {
    GenericFilter,
    ValueDisplayedValue,
} from '../../utils/filters/filters-declarations';
import { FiltersTreeItems } from '../../utils/filters/filters-tree-items';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionCoordinates,
    KupDynamicPositionElement,
    KupDynamicPositionPlacement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import { KupScrollOnHoverElement } from '../../utils/kup-scroll-on-hover/kup-scroll-on-hover-declarations';
import {
    KupLanguageGeneric,
    KupLanguageSearch,
    KupLanguageTotals,
} from '../../utils/kup-language/kup-language-declarations';
import { KupColumnMenuIds } from '../../utils/kup-column-menu/kup-column-menu-declarations';

@Component({
    tag: 'kup-tree',
    styleUrl: 'kup-tree.scss',
    shadow: true,
})
export class KupTree {
    //////////////////////////////
    // Begin state stuff
    //////////////////////////////

    @Prop() stateId: string = '';
    @Prop() store: KupStore;

    state: KupTreeState = new KupTreeState();

    initWithPersistedState(): void {
        if (this.store && this.stateId) {
            const state = this.store.getState(this.stateId);
            if (state != null) {
                console.log(
                    'Initialize with state for stateId ' + this.stateId,
                    state
                );
                this.density = state.density;
                this.showFilters = state.showFilters;
                this.showFooter = state.showFooter;
                this.globalFilter = state.globalFilter;
                this.globalFilterValue = state.globalFilterValue;
                this.filters = { ...state.filters };
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
            if (!deepEqual(this.state.density, this.density)) {
                this.state.density = this.density;
                somethingChanged = true;
            }
            if (!deepEqual(this.state.showFilters, this.showFilters)) {
                this.state.showFilters = this.showFilters;
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
            if (!this.state.load) {
                this.state.load = true;
                return;
            }
            if (somethingChanged) {
                console.log(
                    'Persisting state for stateId ' + this.stateId + ': ',
                    this.state
                );
                this.store.persistState(this.stateId, this.state);
            }
        }
    }

    //////////////////////////////
    // End state stuff
    //////////////////////////////

    @Element() rootElement: HTMLElement;
    @State() private treeColumnVisible = true;
    /**
     * name of the column with the opened total menu
     */
    @State()
    private openedTotalMenu: string = null;
    @State()
    private columnMenuAnchor: string = null;

    /**
     * Auto select programmatic selectic node
     */
    @Prop() autoSelectionNodeMode: boolean = true;
    /**
     * The columns of the tree when tree visualization is active.
     */
    @Prop() columns?: Column[];
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * The json data used to populate the tree view: the basic, always visible tree nodes.
     */
    @Prop() data: TreeNode[] = [];
    /**
     * The density of the rows, defaults at 'medium' and can also be set to 'dense' or 'wide'.
     */
    @Prop() density: string = 'medium';
    /**
     * Function that gets invoked when a new set of nodes must be loaded as children of a node.
     *
     * When useDynamicExpansion is set, the tree component will have two different behaviors depending on the value of this prop.
     * 1 - If this prop is set to null, no callback to download data is available:
     *    the component will emit an event requiring the parent to load the children of the given node.
     * 2 - If this prop is set to have a callback, then the component will automatically make requests to load children of
     *    a given node. After the load has been completed, a different event will be fired to alert the parent of the change.
     *
     * @see useDynamicExpansion
     */
    @Prop() dynamicExpansionCallback: (
        treeNodeToExpand: TreeNode,
        treeNodePath: TreeNodePath
    ) => Promise<TreeNode[]> | undefined = undefined;
    /**
     * Enables the extracolumns add buttons.
     */
    @Prop() enableExtraColumns: boolean = true;
    /**
     * Flag: the nodes of the whole tree must be already expanded upon loading. Disabled nodes do NOT get expanded.
     */
    @Prop() expanded: boolean = false;
    /**
     * List of filters set by the user.
     */
    @Prop({ mutable: true }) filters: GenericFilter = {};
    /**
     * When set to true it activates the global filter.
     */
    @Prop() globalFilter: boolean = false;
    /**
     * The value of the global filter.
     */
    @Prop({ reflect: true, mutable: true }) globalFilterValue = '';
    /**
     * Sets the possibility to remove the selected column.
     */
    @Prop() removableColumns: boolean = true;
    /**
     * Activates the scroll on hover function.
     */
    @Prop() scrollOnHover: boolean = false;
    /**
     * An array of integers containing the path to a selected child.\
     * Groups up the properties SelFirst, SelItem, SelName.
     */
    @Prop({ mutable: true }) selectedNode: TreeNodePath = [];
    /**
     * Shows the tree data as a table.
     */
    @Prop() showColumns: boolean = false;
    /**
     * When set to true enables the column filters.
     */
    @Prop() showFilters: boolean = true;
    /**
     * When set to true shows the footer.
     */
    @Prop() showFooter: boolean = false;
    /**
     * Flag: shows the header of the tree when the tree is displayed as a table.
     * @see showColumns
     */
    @Prop() showHeader: boolean = false;
    /**
     * Shows the icons of the nodes.
     */
    @Prop() showIcons: boolean = true;
    /**
     * When the component must use the dynamic expansion feature to open its nodes, it means that not all the nodes of the
     * tree have been passed inside the data property.
     *
     * Therefore, when expanding a node, the tree must emit an event (or run a given callback)
     * and wait for the child nodes to be downloaded from the server.
     *
     * For more information:
     * @see dynamicExpansionCallback
     */
    @Prop() useDynamicExpansion: boolean = false;

    /**
     * If set to true, displays tooltip on right click; if set to false, displays tooltip on mouseOver.
     */
    @Prop() showTooltipOnRightClick: boolean = true;
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
     * Defines the current totals options.
     */
    @Prop({ mutable: true }) totals: TotalsMap;

    //-------- State --------
    @State() selectedNodeString: string = '';

    @State() stateSwitcher: boolean = false;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    private treeWrapperRef: KupScrollOnHoverElement;
    private selectedColumn: string = '';
    private clickTimeout: any[] = [];
    private iconPaths: [{ icon: string; path: string }] = undefined;
    private globalFilterTimeout: number;

    private footer: { [index: string]: number };

    private sizedColumns: Column[] = undefined;

    private tooltip: KupTooltip;
    columnFilterTimeout: number;
    private columnMenuInstance: KupColumnMenu;
    private filtersColumnMenuInstance: FiltersColumnMenu =
        new FiltersColumnMenu();
    private filtersTreeItemsInstance: FiltersTreeItems = new FiltersTreeItems();
    private totalMenuCoords: KupDynamicPositionCoordinates = null;
    /**
     * Reference to the column menu card.
     */
    private columnMenuCard: HTMLKupCardElement = null;

    //-------- Events --------
    /**
     * Fired when a TreeNode gets collapsed (closed).
     */
    @Event({
        eventName: 'kup-tree-nodecollapse',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeCollapse: EventEmitter<KupTreeNodeCollapseEventPayload>;

    /**
     * Fired when a node expansion ion has been triggered.
     * Contains additional data when the tree is using the dynamicExpansion feature.
     * @event kup-tree-nodeexpand
     * @type {object}
     * @property {TreeNodePath} treeNodePath - The array of indexes to retrieve the current treeNode inside the data prop.
     * @property {TreeNode} treeNode - Reference to the TreeNode data object which is being expanded (passed through the data prop).
     * @property {boolean} usesDynamicExpansion - Flag to notify that the component is running in dynamicExpansion mode.
     * @property {boolean} dynamicExpansionRequireChildren - Flag to notify that the current dynamicExpansion event
     *  requires the parent component to add TreeNode children to the given TreeNode.
     * @see useDynamicExpansion
     * @see dynamicExpansionCallback
     * @since 1.0.0
     */
    @Event({
        eventName: 'kup-tree-nodeexpand',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeExpand: EventEmitter<KupTreeNodeExpandEventPayload>;

    /**
     * Fired when a node of the tree has been selected
     */
    @Event({
        eventName: 'kup-tree-nodeselected',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeSelected: EventEmitter<KupTreeNodeSelectedEventPayload>;

    @Event({
        eventName: 'kup-tree-buttonclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeButtonClick: EventEmitter<KupTreeNodeButtonClickEventPayload>;

    /**
     * Generic right click event on tree.
     */
    @Event({
        eventName: 'kup-tree-contextmenu',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeContextMenu: EventEmitter<KupTreeContextMenuEventPayload>;
    /**
     * When the column menu is being opened/closed.
     */
    @Event({
        eventName: 'kup-tree-columnmenu',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeColumnMenu: EventEmitter<KupTreeColumnMenuEventPayload>;

    @Event({
        eventName: 'kup-tree-didload',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDidLoad: EventEmitter<KupEventPayload>;

    /**
     * Triggered when stop propagation event
     */

    @Event({
        eventName: 'kup-tree-didunload',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDidUnload: EventEmitter<KupEventPayload>;

    @Event({
        eventName: 'kup-tree-nodedblclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeDblClick: EventEmitter<KupTreeNodeCollapseEventPayload>;

    @Event({
        eventName: 'kup-tree-dynamicmassexpansion',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeDynamicMassExpansion: EventEmitter<KupTreeDynamicMassExpansionEventPayload>;

    //---- Methods ----

    @Method()
    async collapseAll() {
        if (!this.useDynamicExpansion) {
            for (let index = 0; index < this.data.length; index++) {
                this.data[index][treeExpandedPropName] = false;
                this.handleChildren(this.data[index], false);
            }
        } else {
            this.kupTreeDynamicMassExpansion.emit({
                comp: this,
                id: this.rootElement.id,
                expandAll: false,
            });
        }
        this.refresh();
    }
    @Method()
    async expandAll() {
        if (!this.useDynamicExpansion) {
            for (let index = 0; index < this.data.length; index++) {
                this.data[index][treeExpandedPropName] = true;
                this.handleChildren(this.data[index], true);
            }
        } else {
            this.kupTreeDynamicMassExpansion.emit({
                comp: this,
                id: this.rootElement.id,
                expandAll: true,
            });
        }
        this.refresh();
    }
    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupTreeProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupTreeProps, props);
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
        this.kupTreeColumnMenu.emit({
            comp: this,
            id: this.rootElement.id,
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
        this.kupTreeColumnMenu.emit({
            comp: this,
            id: this.rootElement.id,
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

    setTreeColumnVisibility(value: boolean) {
        this.treeColumnVisible = value;
    }

    isTreeColumnVisible(): boolean {
        return this.treeColumnVisible;
    }

    private checkScrollOnHover() {
        if (!this.kupManager.scrollOnHover.isRegistered(this.treeWrapperRef)) {
            if (this.scrollOnHover) {
                this.kupManager.scrollOnHover.register(this.treeWrapperRef);
            }
        } else {
            if (!this.scrollOnHover) {
                this.kupManager.scrollOnHover.unregister(this.treeWrapperRef);
            }
        }
    }

    onKupTreeNodeDblClick(treeNodeData: TreeNode, treeNodePath: string) {
        for (let index = 0; index < this.clickTimeout.length; index++) {
            clearTimeout(this.clickTimeout[index]);
            this.kupManager.debug.logMessage(
                this,
                'Cleared hdlTreeNodeClick timeout(' +
                    this.clickTimeout[index] +
                    ').'
            );
        }
        this.clickTimeout = [];
        this.kupTreeNodeDblClick.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: treeNodePath
                .split(',')
                .map((treeNodeIndex) => parseInt(treeNodeIndex)),
            treeNode: treeNodeData,
        });
    }

    nodesToRows(): Row[] {
        function children(TreeNode: TreeNode) {
            for (let index = 0; index < TreeNode.children.length; index++) {
                const node: TreeNode = TreeNode.children[index];
                rows.push({
                    cells: TreeNode.children[index].cells,
                });
                if (node.children) {
                    children(node);
                }
            }
        }
        let rows: Row[] = [];
        for (let index = 0; index < this.data.length; index++) {
            const node: TreeNode = this.data[index];
            rows.push({
                cells: this.data[index].cells,
            });
            if (node.children) {
                children(this.data[index]);
            }
        }
        return rows;
    }

    //-------- Lifecycle hooks --------

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
        this.kupManager.theme.register(this);

        this.columnMenuInstance = new KupColumnMenu();

        this.refreshStructureState();

        // Initializes the selectedNodeString
        if (Array.isArray(this.selectedNode)) {
            this.selectedNodeString = this.selectedNode.toString();
        }
    }

    componentDidLoad() {
        if (
            this.selectedNode &&
            this.selectedNode.length > 0 &&
            this.selectedNode[0] >= 0
        ) {
            let path = this.selectedNode;
            let tn = this.data[path[0]];
            if (path.length > 1) {
                path = path.slice(1);
                this.launchNodeEvent(path, tn);
            } else {
                this.hdlTreeNodeClick(tn, this.selectedNodeString, true);
            }
        }
        this.kupDidLoad.emit({ comp: this, id: this.rootElement.id });
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
        if (this.showFooter && this.columns) {
            this.footer = calcTotals(
                normalizeRows(this.getColumns(), this.nodesToRows()),
                this.totals
            );
        }
        this.filterNodes();
    }

    componentDidRender() {
        const root = this.rootElement.shadowRoot;
        this.totalMenuPosition();
        this.checkScrollOnHover();

        if (root) {
            let rippleCells: any = root.querySelectorAll('.mdc-ripple-surface');
            if (rippleCells) {
                for (let i = 0; i < rippleCells.length; i++) {
                    MDCRipple.attachTo(rippleCells[i]);
                }
            }
        }

        // *** Store
        this.persistState();
        // ***
        this.kupManager.debug.logRender(this, true);
    }

    //-------- Watchers --------
    @Watch('data')
    enrichDataWhenChanged(newData, oldData) {
        if (newData !== oldData) {
            this.refreshStructureState();
        }
    }

    @Watch('expanded')
    enrichStructureStateWhenChanged(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.refreshStructureState();
        }
    }

    @Watch('selectedNode')
    selectedNodeToStr(newData) {
        if (Array.isArray(newData)) {
            this.selectedNodeString = newData.toString();
        }
    }

    //-------- Methods --------
    expandCollapseNode(treeNode: TreeNode, expandNode: boolean = false) {
        this.filtersTreeItemsInstance.expandCollapseNode(
            treeNode,
            expandNode,
            treeExpandedPropName
        );
    }

    expandCollapseAllNodes(treeNode: TreeNode, expandNode: boolean = false) {
        this.filtersTreeItemsInstance.expandCollapseAllNodes(
            treeNode,
            expandNode,
            treeExpandedPropName
        );
    }

    getColumns(): Array<Column> {
        return this.columns ? this.columns : [{ title: '', name: '' }];
    }

    private getSizedColumns() {
        let columns = this.getColumns();
        let sizedColumns = [];
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

    getVisibleColumns(): Array<Column> {
        return this.getColumns().filter((column) =>
            column.hasOwnProperty('visible') ? column.visible : true
        );
    }

    getHeadingColumns(): Array<Column> {
        const firstColum: Column = {
            name: treeMainColumnName,
            title: '',
        };
        const visibleColumns = this.getVisibleColumns();
        return [firstColum, ...visibleColumns];
    }

    /*
     *For launch the event when selected node
     */
    launchNodeEvent(treeNodePath: TreeNodePath, treeNode: TreeNode) {
        if (treeNodePath && treeNodePath.length > 0) {
            if (treeNodePath[0] != -1) {
                var tn = treeNode.children[treeNodePath[0]];
                if (!tn) {
                    tn = treeNode;
                }
                if (treeNodePath.length > 1) {
                    treeNodePath = treeNodePath.slice(1);
                    this.launchNodeEvent(treeNodePath, tn);
                } else {
                    this.hdlTreeNodeClick(tn, this.selectedNodeString, true);
                }
            }
        }
    }

    private openTotalMenu(column: Column) {
        this.openedTotalMenu = column.name;
    }

    private closeMenuAndTooltip() {
        unsetTooltip(this.tooltip);
    }

    private onTotalMenuOpen(column: Column) {
        this.closeMenuAndTooltip();
        this.closeTotalMenu();
        this.openTotalMenu(column);
    }

    private getEventDetails(el: HTMLElement): EventHandlerDetails {
        const isHeader: boolean = !!el.closest('thead'),
            isBody: boolean = !!el.closest('tbody'),
            isFooter: boolean = !!el.closest('tfoot'),
            td: HTMLTableDataCellElement = el.closest('td'),
            th: HTMLTableHeaderCellElement = el.closest('th'),
            tr: HTMLTableRowElement = el.closest('tr'),
            filterRemove: HTMLSpanElement = el.closest('th .filter-remove');
        let cell: Cell = null,
            column: Column = null,
            row: Row = null;
        if (isBody) {
            if (td) {
                cell = td['data-cell'];
            }
            if (tr) {
                row = tr['data-row'];
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
            row: row ? row : null,
            td: td ? td : null,
            th: th ? th : null,
            tr: tr ? tr : null,
        };
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
        } else if (details.area === 'footer') {
            if (details.td && details.column) {
                this.totalMenuCoords = { x: e.clientX, y: e.clientY };
                this.onTotalMenuOpen(details.column);
                return details;
            }
        }
        return details;
    }

    private onJ4btnClicked(
        treeNodeData: TreeNode,
        treeNodePath: string,
        column: Column,
        auto: boolean
    ) {
        this.kupTreeNodeButtonClick.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: treeNodePath
                .split(',')
                .map((treeNodeIndex) => parseInt(treeNodeIndex)),
            treeNode: treeNodeData,
            column: column,
            columnName: column.name,
            auto: auto,
        });
    }

    // When a TreeNode can be selected
    hdlTreeNodeClick(
        treeNodeData: TreeNode,
        treeNodePath: string,
        auto: boolean
    ) {
        unsetTooltip(this.tooltip);
        // If this TreeNode is not disabled, then it can be selected and an event is emitted
        if (treeNodeData && !treeNodeData.disabled) {
            if (this.autoSelectionNodeMode)
                this.selectedNode = treeNodePath
                    .split(',')
                    .map((treeNodeIndex) => parseInt(treeNodeIndex));

            this.kupTreeNodeSelected.emit({
                comp: this,
                id: this.rootElement.id,
                treeNodePath: treeNodePath
                    .split(',')
                    .map((treeNodeIndex) => parseInt(treeNodeIndex)),
                treeNode: treeNodeData,
                columnName: this.selectedColumn,
                auto: auto,
            });
        }
        this.selectedColumn = '';
    }

    // When a TreeNode must be expanded or closed.
    hdlTreeNodeExpanderClick(
        treeNodeData: TreeNode,
        treeNodePath: string,
        ctrlKey: boolean
    ) {
        unsetTooltip(this.tooltip);
        // If the node is expandable
        if (treeNodeData.expandable) {
            // Always composes the tree node path as an array
            const arrayTreeNodePath: TreeNodePath = treeNodePath
                .split(',')
                .map((index) => parseInt(index));

            // There are already children set in this TreeNode -> expand or collapse node and emit appropriate event
            if (treeNodeData.children && treeNodeData.children.length) {
                // Updates expanded state and force rerender
                treeNodeData[treeExpandedPropName] =
                    !treeNodeData[treeExpandedPropName];
                if (ctrlKey) {
                    this.handleChildren(
                        treeNodeData,
                        treeNodeData[treeExpandedPropName]
                    );
                }
                this.refresh();
                if (treeNodeData[treeExpandedPropName]) {
                    // TreeNode is now expanded -> Fires expanded event
                    this.kupTreeNodeExpand.emit({
                        comp: this,
                        id: this.rootElement.id,
                        treeNodePath: arrayTreeNodePath,
                        treeNode: treeNodeData,
                        usesDynamicExpansion: this.useDynamicExpansion,
                    });
                } else {
                    // TreeNode is now collapsed -> Fires collapsed event
                    this.kupTreeNodeCollapse.emit({
                        comp: this,
                        id: this.rootElement.id,
                        treeNodePath: arrayTreeNodePath,
                        treeNode: treeNodeData,
                    });
                }
            } else if (this.useDynamicExpansion) {
                if (ctrlKey) {
                    this.kupTreeDynamicMassExpansion.emit({
                        comp: this,
                        id: this.rootElement.id,
                        treeNodePath: arrayTreeNodePath,
                        treeNode: treeNodeData,
                    });
                }
                // When the component must use the dynamic expansion feature
                // Currently it does not support the expanded prop

                // Checks if we have a dynamicExpansionCallback or not
                if (this.dynamicExpansionCallback) {
                    // We have a callback: invokes it and after the result is returned updates the tree
                    this.dynamicExpansionCallback(
                        treeNodeData,
                        arrayTreeNodePath
                    )
                        .then((childrenTreeNodes) => {
                            // Children returned successfully
                            treeNodeData.children = childrenTreeNodes;
                            treeNodeData[treeExpandedPropName] =
                                !treeNodeData[treeExpandedPropName];
                            this.refresh();

                            // TreeNode is now expanded -> Fires expanded event
                            this.kupTreeNodeExpand.emit({
                                comp: this,
                                id: this.rootElement.id,
                                treeNodePath: arrayTreeNodePath,
                                treeNode: treeNodeData,
                                usesDynamicExpansion: true,
                            });
                        })
                        .catch((err) => {
                            console.error(
                                'KupTree: An error occurred when trying to fetch dynamicExpansion nodes data',
                                err,
                                treeNodeData
                            );
                        });
                } else {
                    // we do NOT have a callback set.
                    // Fires the expand request for the given TreeNode and set the appropriate flag
                    this.kupTreeNodeExpand.emit({
                        comp: this,
                        id: this.rootElement.id,
                        treeNode: treeNodeData,
                        treeNodePath: arrayTreeNodePath,
                        usesDynamicExpansion: true,
                        dynamicExpansionRequireChildren: true,
                    });

                    treeNodeData[treeExpandedPropName] =
                        !treeNodeData[treeExpandedPropName];
                }
            }
        }
    }

    private hasTotals() {
        return this.totals && Object.keys(this.totals).length > 0;
    }

    private handleChildren(TreeNode: TreeNode, expand: boolean) {
        for (let index = 0; index < TreeNode.children.length; index++) {
            let node = TreeNode.children[index];
            if (!node.disabled) {
                node[treeExpandedPropName] = expand;
                if (node.children) {
                    this.handleChildren(node, expand);
                }
            }
        }
    }

    /**
     * Given a nodePath, transform that array into
     * @param nodePath
     */
    selectedNodeToString(nodePath: TreeNodePath) {
        let strToRet = '';
        if (nodePath && nodePath.length) {
            strToRet = nodePath[0].toString();
            for (let i = 1; i < nodePath.length; i++) {
                strToRet += `,${nodePath[0]}`;
            }
        }
        return strToRet;
    }

    private getFilterValueForTooltip(column: Column): string {
        return this.filtersColumnMenuInstance.getFilterValueForTooltip(
            this.filters,
            column
        );
    }

    private onRemoveFilter(column: Column) {
        const newFilters: GenericFilter = { ...this.filters };
        this.filtersColumnMenuInstance.removeFilter(newFilters, column.name);
        this.filters = newFilters;
    }

    onGlobalFilterChange({ detail }) {
        let value = '';
        if (detail && detail.value) {
            value = detail.value;
        }
        this.globalFilterValue = value;
    }

    getColumnValues(column: Column): ValueDisplayedValue[] {
        return this.filtersTreeItemsInstance.getColumnValues(
            this,
            column,
            this.globalFilterValue,
            this.filtersColumnMenuInstance
        );
    }

    getRows(): Array<TreeNode> {
        return this.data ? this.data : [];
    }

    private filterNodes() {
        this.filtersTreeItemsInstance.filterRows(
            this.getRows(),
            this.filters,
            this.globalFilterValue,
            this.getColumns(),
            treeExpandedPropName,
            this.filtersColumnMenuInstance
        );
    }

    private refreshStructureState() {
        if (this.data) {
            // When the nodes must be expanded upon loading and the tree is not using a dynamicExpansion (and the current TreeNode is not disabled)
            // the default value of the treeExpandedPropName is set to true
            this.data.forEach((rootNode) => {
                this.expandCollapseAllNodes(
                    rootNode,
                    this.expanded && !this.useDynamicExpansion
                );
            });
        }
    }

    private createIconElement(
        CSSClass: string,
        icon: string,
        iconColor: string
    ) {
        if (
            icon.indexOf('.') > -1 ||
            icon.indexOf('/') > -1 ||
            icon.indexOf('\\') > -1
        ) {
            CSSClass += ' is-image';
            return (
                <span class={CSSClass}>
                    <img src={icon}></img>
                </span>
            );
        } else {
            let svg: string = `url('${getAssetPath(
                `./assets/svg/${icon}.svg`
            )}') no-repeat center`;
            CSSClass += ' icon-container material-icons';
            let iconStyle = {
                ...(iconColor ? { background: iconColor } : {}),
                mask: svg,
                webkitMask: svg,
            };
            return <span style={iconStyle} class={CSSClass}></span>;
        }
    }

    /**
     * Factory function for cells.
     * @param cell - cell object
     * @param previousRowCellValue - An optional value of the previous cell on the same column. If set and equal to the value of the current cell, makes the value of the current cell go blank.
     * @param cellData - Additional data for the current cell.
     * @param cellData.column - The column object to which the cell belongs.
     * @param cellData.treeNode - The treeNode object to which the cell belongs.
     * @param cellData.treeNodePath - The treeNodePath to which the cell belongs.
     */
    renderCell(
        cell: Cell,
        cellData: {
            column: Column;
            treeNode: TreeNode;
            treeNodePath: string;
        },
        previousRowCellValue?: string
    ) {
        const classObj: Record<string, boolean> = {
            'cell-content': true,
            clickable: !!cellData.column.clickable,
        };

        // When the previous row value is different from the current value, we can show the current value.
        const valueToDisplay =
            previousRowCellValue !== cell.value ? cell.value : '';

        // Sets the default value
        let content: any = valueToDisplay;
        let cellType: string = this.getCellType(cell);
        let props: any = { ...cell.data };
        classObj[cellType + '-cell'] = true;

        if (cell.data) {
            this.setCellSize(cellType, props, cell);
            content = this.setKupCell(
                cellType,
                classObj,
                props,
                cell,
                cellData
            );
        } else {
            content = this.setCell(
                cellType,
                content,
                classObj,
                cell,
                cellData.column
            );
        }

        // Elements of the cell
        let cellElements = [];
        let tdStyle = undefined;
        let style = undefined;
        if (styleHasBorderRadius(cell) || styleHasWritingMode(cell)) {
            style = cell.style;
            if (styleHasBorderRadius(cell) && !style['padding']) {
                style['padding'] = '5px';
            }
            if (style['text-align']) {
                style['float'] = style['text-align'];
            }
        } else {
            tdStyle = cell.style;
        }

        tdStyle = this.getCellStyle(cellData.column.name, tdStyle);

        let icon = undefined;

        if ((cellData.column.icon || cell.icon) && content) {
            let svg: string = '';
            if (cell.icon) {
                svg = cell.icon;
            } else {
                svg = cellData.column.icon;
            }
            svg = this.getIconPath(svg);
            let iconStyle = {
                mask: svg,
                webkitMask: svg,
            };
            icon = (
                <span style={iconStyle} class="icon-container obj-icon"></span>
            );
        }

        const _hasTooltip: boolean = this.kupManager.objects.hasTooltip(
            cell.obj
        );
        let title: string = undefined;
        if (_hasTooltip) {
            classObj['is-obj'] = true;
            if (this.kupManager.debug.isDebug()) {
                title =
                    cell.obj.t + '; ' + cell.obj.p + '; ' + cell.obj.k + ';';
            }
        }

        let cellClass = undefined;
        if (cell.cssClass) {
            cellClass = cell.cssClass;
        }

        cellElements.push(
            <span title={title} style={style} class={classObj}>
                {icon}
                {content}
            </span>
        );

        return (
            <td
                class={cellClass}
                onClick={() => (this.selectedColumn = cellData.column.name)}
                style={tdStyle}
                {...this.getToolTipEventHandlers(
                    cellData.treeNode,
                    cell,
                    _hasTooltip
                )}
            >
                {cellElements}
            </td>
        );
    }

    /**
     * Controls if current cell needs a tooltip and eventually adds it.
     * @todo When the option forceOneLine is active, there is a problem with the current implementation of the tooltip. See documentation in the mauer wiki for better understanding.
     */
    private getToolTipEventHandlers(
        treeNodeData: TreeNode,
        cell: Cell,
        hasTooltip: boolean
    ) {
        let eventHandlers = undefined;
        if (hasTooltip) {
            if (this.showTooltipOnRightClick) {
                eventHandlers = {
                    onContextMenu: (ev) => {
                        ev.preventDefault();
                        setTooltip(
                            ev,
                            treeNodeData.id,
                            null,
                            cell,
                            this.tooltip
                        );
                    },
                };
            } else {
                eventHandlers = {
                    onMouseEnter: (ev) => {
                        setTooltip(
                            ev,
                            treeNodeData.id,
                            null,
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
        return eventHandlers;
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

    private setCellSize(cellType: string, props: any, cell: Cell) {
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
            case 'checkbox':
                if (cell.style) {
                    if (!cell.style.height) {
                        cell.style['minHeight'] = '40px';
                    }
                } else {
                    cell.style = { minHeight: '40px' };
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

    private setCell(
        cellType: string,
        content: string,
        classObj: Record<string, boolean>,
        cell: Cell,
        column: Column
    ) {
        switch (cellType) {
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
                    return <span class="text">{cellValue}</span>;
                }
                return content;
            case 'date':
                if (content && content != '') {
                    const cellValue = getCellValueForDisplay(column, cell);
                    return <span class="text">{cellValue}</span>;
                }
                return content;
            case 'datetime':
                if (content && content != '') {
                    const cellValue = getCellValueForDisplay(column, cell);
                    return <span class="text">{cellValue}</span>;
                }
                return content;
            case 'time':
                if (content && content != '') {
                    const cellValue = getCellValueForDisplay(column, cell);
                    return <span class="text">{cellValue}</span>;
                }
                return content;
            case 'string':
            default:
                return <span class="text">{content}</span>;
        }
    }

    private setKupCell(
        cellType: string,
        classObj: Record<string, boolean>,
        props: any,
        cell: Cell,
        cellData: CellData
    ) {
        switch (cellType) {
            case 'bar':
                return <kup-image {...props} />;
            case 'button':
                classObj['is-centered'] = true;
                props['disabled'] = cellData.treeNode.readOnly;
                props['onkup-button-click'] = this.onJ4btnClicked.bind(
                    cellData.treeNode,
                    cellData.treeNodePath,
                    cellData.column,
                    false
                );
                return <kup-button {...props}></kup-button>;
            case 'chart':
                classObj['is-centered'] = true;
                return <kup-chart {...props} />;
            case 'checkbox':
                classObj['is-centered'] = true;
                if (props) {
                    props['disabled'] = cellData.treeNode.readOnly;
                } else {
                    props = { disabled: cellData.treeNode.readOnly };
                }
                return <kup-checkbox {...props}></kup-checkbox>;
            case 'chips':
                return <kup-chip {...props}></kup-chip>;
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
                return (
                    <kup-progress-bar
                        class="cell-progress-bar"
                        value={stringToNumber(cell.value)}
                        {...props}
                    ></kup-progress-bar>
                );
            case 'icon':
            case 'image':
                classObj['is-centered'] = true;
                if (props.badgeData) {
                    classObj['has-padding'] = true;
                }
                return <kup-image {...props} />;
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
                props['disabled'] = cellData.treeNode.readOnly;
                return <kup-radio {...props}></kup-radio>;
        }
    }

    private getCellStyle(colName: string, cellStyle: any): any {
        // Controls if there are columns with a specified width
        if (this.sizedColumns) {
            let colWidth: string = '';

            // Search if this column has a specified width
            for (let j = 0; j < this.sizedColumns.length; j++) {
                if (colName === this.sizedColumns[j].name) {
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
                cellStyle['max-width'] = colWidth;
                cellStyle['min-width'] = colWidth;
                cellStyle['width'] = colWidth;
                cellStyle['overflow'] = 'hidden';
            }
        }
        return cellStyle;
    }

    renderTooltip() {
        if (this.tooltipEnabled == false) {
            return null;
        }
        return (
            <kup-tooltip
                class="tree-tooltip"
                owner={this.rootElement.tagName}
                loadTimeout={
                    this.showTooltipOnRightClick == true
                        ? 0
                        : this.tooltipLoadTimeout
                }
                detailTimeout={this.tooltipDetailTimeout}
                ref={(el: any) => (this.tooltip = el as KupTooltip)}
            ></kup-tooltip>
        );
    }

    /**
     * Renders the header of the tree when it must be displayed as a table.
     * @returns An array of table header cells.
     */
    renderHeader(): JSX.Element[] {
        return this.getHeadingColumns().map((column) => {
            if (
                !this.isTreeColumnVisible() &&
                column.name === treeMainColumnName
            )
                return;

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
                 */
                filter = (
                    <span
                        title={svgLabel}
                        class="icon-container filter-remove"
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            this.onRemoveFilter(column);
                        }}
                    ></span>
                );
            }

            return (
                <th
                    data-column={column.name}
                    style={this.getCellStyle(column.name, null)}
                >
                    <span class="column-title">{column.title}</span>
                    {filter}
                </th>
            );
        });
    }

    /**
     * Given a TreeNode, reads through its data then composes and returns its JSX object.
     * @param treeNodeData - The TreeNode object to parse.
     * @param treeNodePath - A string containing the comma(,) separated indexes of the TreeNodes to use,
     *    sorted from left to right, to access the current TreeNode starting from the data prop children object.
     * @param treeNodeDepth - An integer to keep track of the depth level of the current TreeNode. Used for indentation.
     * @returns The the JSX created from the current tree node.
     */
    renderTreeNode(
        treeNodeData: TreeNode,
        treeNodePath: string,
        treeNodeDepth: number = 0
    ): JSX.Element {
        // Creates the indentation of the current element. Use a css variable to specify padding.
        let indent = treeNodeDepth ? (
            <span
                class="kup-tree__indent"
                style={{ ['--tree-node_depth']: treeNodeDepth.toString() }}
            />
        ) : null;

        // If the tree node is expandable, adds the icon to show the expansion.
        // If expandable, also add the callback on the click action.
        // If it is not expandable, we simply add a placeholder with no icons.
        const hasExpandIcon: boolean = !!(
            treeNodeData.expandable &&
            ((treeNodeData.children && treeNodeData.children.length) ||
                this.useDynamicExpansion)
        );
        let expandClass = 'expand-icon kup-tree__icon kup-tree__node__expander';
        if (hasExpandIcon) {
            expandClass += ' icon-container';
            if (treeNodeData[treeExpandedPropName]) {
                expandClass += ' expanded';
            } else {
                expandClass += ' collapsed';
            }
        }
        let treeExpandIcon = (
            <span
                title={
                    this.kupManager.language.translate(
                        KupLanguageGeneric.EXPAND
                    ) +
                    '/' +
                    this.kupManager.language.translate(
                        KupLanguageGeneric.COLLAPSE
                    ) +
                    ' (CTRL + Click)'
                }
                class={expandClass}
                onClick={
                    !treeNodeData.disabled
                        ? (event: MouseEvent) => {
                              event.stopPropagation();
                              this.hdlTreeNodeExpanderClick(
                                  treeNodeData,
                                  treeNodePath,
                                  event.ctrlKey
                              );
                          }
                        : null
                }
            ></span>
        );

        // When TreeNode icons are visible, creates the icon if one is specified
        let treeNodeIcon: any = null;
        if (this.showIcons) {
            if (treeNodeData.icon) {
                if (treeNodeData.icon === '') {
                    treeNodeIcon = <span class="kup-tree__icon" />;
                } else {
                    treeNodeIcon = this.createIconElement(
                        'kup-tree__icon icon-container',
                        treeNodeData.icon,
                        treeNodeData.iconColor
                    );
                }
            } else {
                treeNodeIcon = null;
            }
        }

        // Composes additional options for the tree node element
        let treeNodeOptions = {};
        if (
            treeNodeData.hasOwnProperty(treeExpandedPropName) &&
            treeNodeData[treeExpandedPropName] &&
            hasExpandIcon
        ) {
            // If the node is expanded it has this attribute set to if this node is expanded or not.
            treeNodeOptions['data-is-expanded'] =
                treeNodeData[treeExpandedPropName];
        }

        // When can be expanded OR selected
        if (!treeNodeData.disabled) {
            treeNodeOptions['onClick'] = () => {
                this.clickTimeout.push(
                    setTimeout(
                        () =>
                            this.hdlTreeNodeClick(
                                treeNodeData,
                                treeNodePath,
                                false
                            ),
                        300
                    )
                );
            };
        }

        // When a tree node is displayed as a table
        let treeNodeCells: JSX.Element[] | null = null;
        let visibleCols = this.getVisibleColumns();
        if (this.showColumns && visibleCols && visibleCols.length) {
            treeNodeCells = [];
            // Renders all the cells
            for (let j = 0; j < visibleCols.length; j++) {
                const column = visibleCols[j];
                treeNodeCells.push(
                    this.renderCell(treeNodeData.cells[column.name], {
                        column,
                        treeNode: treeNodeData,
                        treeNodePath: treeNodePath,
                    })
                );
            }
        }

        const _hasTooltip: boolean = this.kupManager.objects.hasTooltip(
            treeNodeData.obj
        );
        let title: string = undefined;
        if (_hasTooltip && this.kupManager.debug.isDebug()) {
            title =
                treeNodeData.obj.t +
                '; ' +
                treeNodeData.obj.p +
                '; ' +
                treeNodeData.obj.k +
                ';';
        }
        const cell: Cell = {
            obj: treeNodeData.obj,
            value: treeNodeData.value,
        };

        let treeNodeCell = null;
        if (this.isTreeColumnVisible()) {
            treeNodeCell = (
                <td
                    class={{
                        'first-node': treeNodeDepth === 0 ? true : false,
                        'mdc-ripple-surface':
                            !this.showColumns && !treeNodeData.disabled,
                        'is-obj': this.kupManager.objects.hasTooltip(
                            treeNodeData.obj
                        ),
                    }}
                    style={treeNodeData.style || null}
                    title={title}
                    onDblClick={() => {
                        this.onKupTreeNodeDblClick(treeNodeData, treeNodePath);
                    }}
                    {...this.getToolTipEventHandlers(
                        treeNodeData,
                        cell,
                        _hasTooltip
                    )}
                >
                    {indent}
                    {treeExpandIcon}
                    {treeNodeIcon}
                    <span class="cell-content">{treeNodeData.value}</span>
                </td>
            );
        }

        return (
            <tr
                class={{
                    'kup-tree__node': true,
                    'with-dyn': !treeNodeData.disabled,
                    'kup-tree__node--disabled': treeNodeData.disabled,
                    'kup-tree__node--selected':
                        !treeNodeData.disabled &&
                        treeNodePath === this.selectedNodeString,
                }}
                data-tree-path={treeNodePath}
                {...treeNodeOptions}
            >
                {treeNodeCell}
                {treeNodeCells}
            </tr>
        );
    }

    private closeTotalMenu() {
        this.openedTotalMenu = null;
    }

    private isOpenedTotalMenuForColumn(column: string): boolean {
        return this.openedTotalMenu === column;
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

    renderFooter() {
        const nodesCell: HTMLTableDataCellElement = <td></td>;
        const footerCells = this.getVisibleColumns().map((column: Column) => {
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
                let listData: ComponentListElement[] = [
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
                }
                // TODO replace this with find which is a better approach
                // Note that this is not supported in older IE
                let selectedItem = listData.find(
                    (item) => item.text === menuLabel
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

                totalMenu = (
                    <kup-list
                        class={`kup-menu total-menu`}
                        data={...listData}
                        id="totals-menu"
                        is-menu
                        menu-visible
                        onBlur={() => this.closeTotalMenu()}
                        onkup-list-click={(event) =>
                            this.onTotalsChange(event, column)
                        }
                        tabindex={0}
                    ></kup-list>
                );
            }

            let value;
            if (
                menuLabel === TotalLabel.COUNT ||
                menuLabel === TotalLabel.DISTINCT
            ) {
                value = this.footer[column.name];
            } else {
                value = numberToFormattedStringNumber(
                    this.footer[column.name],
                    column.decimals,
                    column.obj ? column.obj.p : ''
                );
            }

            return (
                <td data-column={column.name}>
                    {totalMenu}
                    <span class="totals-value" title={translation[menuLabel]}>
                        {value}
                    </span>
                </td>
            );
        });

        return (
            <tfoot>
                <tr>
                    {nodesCell}
                    {footerCells}
                </tr>
            </tfoot>
        );
    }

    private totalMenuPosition() {
        if (this.rootElement.shadowRoot) {
            let menu: HTMLElement =
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

    /**
     * Given a TreeNode, reads through its data to compose and return the TreeNodes of the root of this TreeNode
     * and its children nodes, composing an array of JSX TreeNodes.
     * @param treeNodeData - The TreeNode object to parse.
     * @param treeNodePath - A string containing the comma(,) separated indexes of the TreeNodes to use,
     *    sorted from left to right, to access the current TreeNode starting from the data prop children object.
     * @param treeNodeDepth - An integer to keep track of the depth level of the current TreeNode. Used for indentation.
     * @returns An array of JSX TreeNodes created from the given treeNodeData.
     */
    renderTree(
        treeNodeData: TreeNode,
        treeNodePath: string,
        treeNodeDepth: number = 0
    ): JSX.Element[] {
        let treeNodes = [];

        if (treeNodeData && treeNodeData.visible == true) {
            // Creates and adds the root of the current tree
            treeNodes.push(
                this.renderTreeNode(treeNodeData, treeNodePath, treeNodeDepth)
            );

            // Checks if the current node can be expanded, has children object, has children and is expanded
            if (
                treeNodeData.expandable &&
                treeNodeData.children &&
                treeNodeData.children.length &&
                treeNodeData[treeExpandedPropName]
            ) {
                for (let i = 0; i < treeNodeData.children.length; i++) {
                    treeNodes = treeNodes.concat(
                        this.renderTree(
                            treeNodeData.children[i],
                            treeNodePath + ',' + i,
                            treeNodeDepth + 1
                        )
                    );
                }
            }
        }

        return treeNodes;
    }

    render() {
        const tooltip = this.renderTooltip();

        this.sizedColumns = this.getSizedColumns();
        let wrapperClass: string = 'density-medium';
        switch (this.density) {
            case 'dense':
                wrapperClass = 'density-dense';
                break;
            case 'wide':
                wrapperClass = 'density-wide';
                break;
        }

        // Composes TreeNodes
        let treeNodes: JSX.Element[] = [];
        if (this.data && this.data.length) {
            this.data.forEach((zeroDepthNode, index) => {
                treeNodes = treeNodes.concat(
                    this.renderTree(zeroDepthNode, index.toString())
                );
            });
        } else {
            // There are no TreeNodes, so we print a single cell with a caption
            treeNodes.push(
                <tr>
                    <td>
                        {this.kupManager.language.translate(
                            KupLanguageGeneric.EMPTY_DATA
                        )}
                    </td>
                </tr>
            );
        }

        // Calculates if header must be shown or not
        const visibleHeader = this.showHeader && this.showColumns;

        let filterField = null;
        if (
            this.globalFilter &&
            this.data &&
            this.data.length &&
            this.data.length > 0
        ) {
            filterField = (
                <div id="global-filter">
                    <kup-text-field
                        fullWidth={true}
                        isClearable={true}
                        label={this.kupManager.language.translate(
                            KupLanguageSearch.SEARCH
                        )}
                        icon="magnify"
                        initialValue={this.globalFilterValue}
                        onkup-textfield-input={(event) => {
                            window.clearTimeout(this.globalFilterTimeout);
                            this.globalFilterTimeout = window.setTimeout(
                                () => this.onGlobalFilterChange(event),
                                600
                            );
                        }}
                        onkup-textfield-cleariconclick={(event) =>
                            this.onGlobalFilterChange(event)
                        }
                    ></kup-text-field>
                </div>
            );
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" class={wrapperClass}>
                    <div
                        class="wrapper"
                        ref={(el: HTMLElement) =>
                            (this.treeWrapperRef =
                                el as KupScrollOnHoverElement)
                        }
                    >
                        {filterField}
                        <table
                            class="kup-tree"
                            data-show-columns={this.showColumns}
                            onContextMenu={(e: MouseEvent) =>
                                this.kupTreeContextMenu.emit({
                                    comp: this,
                                    id: this.rootElement.id,
                                    details: this.contextMenuHandler(e),
                                })
                            }
                        >
                            <thead
                                class={{
                                    'header--is-visible': visibleHeader,
                                }}
                            >
                                <tr>
                                    {visibleHeader ? this.renderHeader() : null}
                                </tr>
                            </thead>
                            <tbody>{treeNodes}</tbody>
                            {(this.showFooter || this.hasTotals()) &&
                            this.columns
                                ? this.renderFooter()
                                : null}
                        </table>
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
                        layoutNumber={12}
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
                        onkup-card-event={(e) => {
                            this.columnMenuInstance.eventHandlers(e, this);
                        }}
                        ref={(el: HTMLKupCardElement) =>
                            (this.columnMenuCard = el)
                        }
                        sizeX="auto"
                        sizeY="auto"
                        tabIndex={-1}
                    ></kup-card>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.language.register(this);
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
            this.kupManager.scrollOnHover.unregister(this.treeWrapperRef);
        }
        this.kupDidUnload.emit({ comp: this, id: this.rootElement.id });
    }
}
