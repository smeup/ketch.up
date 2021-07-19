import { GenericObject, KupEventPayload } from '../../types/GenericTypes';
import {
    Cell,
    CellsHolder,
    Column,
    Row,
    RowAction,
} from './../kup-data-table/kup-data-table-declarations';
/**
 * Props of the kup-tree component.
 * Used to export every prop in an object.
 */
export enum KupTreeProps {
    autoSelectionNodeMode = 'Auto select programmatic selectic node',
    columns = 'The columns of the tree when tree visualization is active.',
    customStyle = 'Custom style of the component.',
    data = 'The json data used to populate the tree view: the basic, always visible tree nodes.',
    density = "The density of the rows, defaults at 'medium' and can also be set to 'dense' or 'wide'.",
    dynamicExpansionCallback = 'Function that gets invoked when a new set of nodes must be loaded as children of a node. When useDynamicExpansion is set, the tree component will have two different behaviors depending on the value of this prop. If this prop is set to null, no callback to download data is available: the component will emit an event requiring the parent to load the children of the given node. If this prop is set to have a callback, then the component will automatically make requests to load children of a given node. After the load has been completed, a different event will be fired to alert the parent of the change.',
    enableExtraColumns = 'Enables adding extra columns.',
    expanded = 'Flag: the nodes of the whole tree must be already expanded upon loading. Disabled nodes do NOT get expanded.',
    filters = 'List of filters set by the user.',
    globalFilter = 'When set to true it activates the global filter.',
    globalFilterValue = 'The value of the global filter.',
    removableColumns = 'Sets the possibility to remove the selected column.',
    scrollOnHover = 'Activates the scroll on hover function.',
    selectedNode = 'An array of integers containing the path to a selected child. Groups up the properties SelFirst, SelItem, SelName.',
    showColumns = 'Shows the tree data as a table.',
    showFilters = 'When set to true enables the column filters.',
    showFooter = 'When set to true shows the footer.',
    showHeader = 'Flag: shows the header of the tree when the tree is displayed as a table.',
    showIcons = 'Shows the icons of the nodes.',
    stateId = '',
    store = '',
    showTooltipOnRightClick = 'If set to true, displays tooltip on right click; if set to false, displays tooltip on mouseOver.',
    tooltipDetailTimeout = 'Defines the timeout for tooltip detail',
    tooltipEnabled = 'Enable show tooltip',
    tooltipLoadTimeout = 'Defines the timeout for tooltip load',
    totals = 'Defines the current totals options.',
    useDynamicExpansion = 'When the component must use the dynamic expansion feature to open its nodes, it means that not all the nodes of the tree have been passed inside the data property. Therefore, when expanding a node, the tree must emit an event (or run a given callback) and wait for the child nodes to be downloaded from the server.',
}

/**
 * The name of the property used by the tree component to store whether a TreeNode is open or closed
 * @constant
 */
export const treeExpandedPropName = 'isExpanded';

export interface TreeNode {
    data?: GenericObject;

    actions?: Array<RowAction>;

    cells: CellsHolder;

    children: Array<TreeNode>;

    disabled: boolean; // Will be replaced by KupRow.unselectable

    expandable: boolean;

    icon?: string;

    iconColor?: string;

    id?: string;

    obj: {
        t: string;
        p: string;
        k: string;
    };

    options?: boolean;

    // TODO what is this?
    readOnly?: boolean;

    style?: { [index: string]: string };

    value: string;

    /** used for render or not render node (and children) while filtering */
    visible?: boolean;

    [treeExpandedPropName]?: boolean;
}

export type TreeNodePath = number[];

/**
 * The name of the constant used by the tree component to identify the main tree in column menu
 * @constant
 */
export const treeMainColumnName = 'TREE_COLUMN';

/**
 * Contains all the data of an event.
 */
export interface EventHandlerDetails {
    area: string;
    cell: Cell;
    column: Column;
    filterRemove: HTMLSpanElement;
    row: Row;
    td: HTMLTableDataCellElement;
    th: HTMLTableHeaderCellElement;
    tr: HTMLTableRowElement;
}

export interface KupTreeNodeCollapseEventPayload extends KupEventPayload {
    treeNodePath: TreeNodePath;
    treeNode: TreeNode;
}

export interface KupTreeNodeExpandEventPayload
    extends KupTreeNodeCollapseEventPayload {
    usesDynamicExpansion?: boolean;
    dynamicExpansionRequireChildren?: boolean;
}

export interface KupTreeNodeSelectedEventPayload
    extends KupTreeNodeCollapseEventPayload {
    columnName: string;
    auto: boolean;
}

export interface KupTreeNodeButtonClickEventPayload
    extends KupTreeNodeCollapseEventPayload {
    column: Column;
    columnName: string;
    auto: boolean;
}

export interface KupTreeContextMenuEventPayload extends KupEventPayload {
    details: EventHandlerDetails;
}

export interface KupTreeColumnMenuEventPayload extends KupEventPayload {
    card: HTMLKupCardElement;
    open: boolean;
}

export interface KupTreeDynamicMassExpansionEventPayload
    extends KupEventPayload {
    treeNodePath?: TreeNodePath;
    treeNode?: TreeNode;
    expandAll?: boolean;
}
