# kup-data-table

## About persistent header

A persistent header is when the header of the table remains positioned fixedly and is visible when a user scrolls the window until the whole table has disappeared from view.

The current implementation, based on the features of the currently used SmeUP data table component, make use of the CSS property `position: sticky;`. [Here](https://caniuse.com/#feat=css-sticky) you can see the support fot this feature.

The implementation of this feature makes use of pure CSS because its current behavior is quite simple.

More details about the component's modification to allow sticky positioning can be found inside the comments left in the component itself.

To see how to configure this behavior, check out the `header-is-persistent` property.

#### Known limitations

##### Table headers borders

Browsers tables has always been problematic. Due to how browsers implements the `sticky` feature, when applied to a `<th>` element inside a `<thead>`, the borders do not get scrolled down: they stay in their original position.

In other words, if you need to set border between header cells, your best call would be to either use the `:before` or `after` pseudo elements positioned absolutely inside each cell. Or set the border to a wrapper which is also the first children of the cell itself.

This helps you solve also other problems with `<th>` elements having a transparent border set when scrolling. A border you cannot get rid of.

##### The `sticky` behavior is relative to an element first scrollable ancestor

The `sticky` behavior gets triggered when the first ancestor element with a scrollable content gets scrolled.

If the `sticky` element would be hidden by the scroll, after having specified a threshold (top, bottom, left, right), the element gets positioned fixedly until its ancestor is fully scrolled: in that moment it stops from being fixed and disappears.

<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                      | Description                                                                                                                                                                                                                    | Type                                                                                                      | Default                              |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `customStyle`               | `custom-style`                 | Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization                                                                                                                | `string`                                                                                                  | `''`                                 |
| `data`                      | --                             | The data of the table.                                                                                                                                                                                                         | `TableData`                                                                                               | `undefined`                          |
| `density`                   | `density`                      | The density of the rows, defaults at 'medium' and can be also set to 'large' or 'small'.                                                                                                                                       | `string`                                                                                                  | `'dense'`                            |
| `dragEnabled`               | `drag-enabled`                 | Enable row dragging                                                                                                                                                                                                            | `boolean`                                                                                                 | `false`                              |
| `dropEnabled`               | `drop-enabled`                 | Enable record dropping                                                                                                                                                                                                         | `boolean`                                                                                                 | `false`                              |
| `editableData`              | `editable-data`                | When set to true, editable cells will be rendered using input components.                                                                                                                                                      | `boolean`                                                                                                 | `false`                              |
| `emptyDataLabel`            | `empty-data-label`             | Defines the label to show when the table is empty.                                                                                                                                                                             | `string`                                                                                                  | `null`                               |
| `enableExtraColumns`        | `enable-extra-columns`         | Enables the extracolumns add buttons.                                                                                                                                                                                          | `boolean`                                                                                                 | `true`                               |
| `enableSortableColumns`     | `enable-sortable-columns`      | Enables the sorting of columns by dragging them into different columns.                                                                                                                                                        | `boolean`                                                                                                 | `true`                               |
| `expandGroups`              | `expand-groups`                | Expands groups when set to true.                                                                                                                                                                                               | `boolean`                                                                                                 | `false`                              |
| `filters`                   | --                             | List of filters set by the user.                                                                                                                                                                                               | `GenericFilter`                                                                                           | `{}`                                 |
| `fixedColumns`              | `fixed-columns`                | Fixes the given number of columns so that they stay visible when horizontally scrolling the data-table. If grouping is active or the value of the prop is <= 0, this prop will have no effect. Can be combined with fixedRows. | `number`                                                                                                  | `0`                                  |
| `fixedRows`                 | `fixed-rows`                   | Fixes the given number of rows so that they stay visible when vertically scrolling the data-table. If grouping is active or the value of the prop is <= 0, this prop will have no effect. Can be combined with fixedColumns.   | `number`                                                                                                  | `0`                                  |
| `forceOneLine`              | `force-one-line`               | Forces cells with long text and a fixed column size to have an ellipsis set on their text. The reflect attribute is mandatory to allow styling.                                                                                | `boolean`                                                                                                 | `false`                              |
| `globalFilter`              | `global-filter`                | When set to true it activates the global filter.                                                                                                                                                                               | `boolean`                                                                                                 | `false`                              |
| `globalFilterValue`         | `global-filter-value`          | The value of the global filter.                                                                                                                                                                                                | `string`                                                                                                  | `''`                                 |
| `groupLabelDisplay`         | `group-label-display`          | How the label of a group must be displayed. For available values [see here]{@link GroupLabelDisplayMode}                                                                                                                       | `GroupLabelDisplayMode.BOTH \| GroupLabelDisplayMode.LABEL \| GroupLabelDisplayMode.VALUE`                | `GroupLabelDisplayMode.BOTH`         |
| `groups`                    | --                             | The list of groups.                                                                                                                                                                                                            | `GroupObject[]`                                                                                           | `[]`                                 |
| `headerIsPersistent`        | `header-is-persistent`         | When set to true the header will stick on top of the table when scrolling.                                                                                                                                                     | `boolean`                                                                                                 | `true`                               |
| `isFocusable`               | `is-focusable`                 | When set to true, clicked-on rows will have a visual feedback.                                                                                                                                                                 | `boolean`                                                                                                 | `false`                              |
| `lazyLoadRows`              | `lazy-load-rows`               | When set to true, extra rows will be automatically loaded once the last row enters the viewport. When groups are present, the number of rows is referred to groups and not to their content. Paginator is disabled.            | `boolean`                                                                                                 | `false`                              |
| `lineBreakCharacter`        | `line-break-character`         | Defines the placeholder character which will be replaced by a line break inside table header cells, normal or sticky.                                                                                                          | `string`                                                                                                  | `'\n'`                               |
| `loadMoreLimit`             | `load-more-limit`              | Sets a maximum limit of new records which can be required by the load more functionality.                                                                                                                                      | `number`                                                                                                  | `1000`                               |
| `loadMoreMode`              | `load-more-mode`               | Establish the modality of how many new records will be downloaded.  This property is regulated also by loadMoreStep.                                                                                                           | `LoadMoreMode.CONSTANT \| LoadMoreMode.CONSTANT_INCREMENT \| LoadMoreMode.PROGRESSIVE_THRESHOLD`          | `LoadMoreMode.PROGRESSIVE_THRESHOLD` |
| `loadMoreStep`              | `load-more-step`               | The number of records which will be requested to be downloaded when clicking on the load more button.  This property is regulated also by loadMoreMode.                                                                        | `number`                                                                                                  | `60`                                 |
| `pageSelected`              | `page-selected`                | Current selected page set on component load                                                                                                                                                                                    | `number`                                                                                                  | `-1`                                 |
| `paginatorPos`              | `paginator-pos`                | Sets the position of the paginator. Available positions: top, bottom or both.                                                                                                                                                  | `PaginatorPos.BOTH \| PaginatorPos.BOTTOM \| PaginatorPos.TOP`                                            | `PaginatorPos.TOP`                   |
| `removableColumns`          | `removable-columns`            | Sets the possibility to remove the selected column.                                                                                                                                                                            | `boolean`                                                                                                 | `false`                              |
| `rowActions`                | --                             | Sets the actions of the rows.                                                                                                                                                                                                  | `RowAction[]`                                                                                             | `undefined`                          |
| `rowsPerPage`               | `rows-per-page`                | Sets the number of rows per page to display.                                                                                                                                                                                   | `number`                                                                                                  | `10`                                 |
| `scrollOnHover`             | `scroll-on-hover`              | Activates the scroll on hover function.                                                                                                                                                                                        | `boolean`                                                                                                 | `false`                              |
| `selectRow`                 | `select-row`                   | Selects the row at the specified rendered rows prosition (base 1).                                                                                                                                                             | `number`                                                                                                  | `undefined`                          |
| `selectRowsById`            | `select-rows-by-id`            | Semicolon separated rows id to select.                                                                                                                                                                                         | `string`                                                                                                  | `undefined`                          |
| `selection`                 | `selection`                    | Set the type of the rows selection.                                                                                                                                                                                            | `SelectionMode.MULTIPLE \| SelectionMode.MULTIPLE_CHECKBOX \| SelectionMode.NONE \| SelectionMode.SINGLE` | `SelectionMode.SINGLE`               |
| `showCustomization`         | `show-customization`           | If set to true, displays the button to open the customization panel.                                                                                                                                                           | `boolean`                                                                                                 | `true`                               |
| `showFilters`               | `show-filters`                 | When set to true enables the column filters.                                                                                                                                                                                   | `boolean`                                                                                                 | `false`                              |
| `showFooter`                | `show-footer`                  | When set to true shows the footer.                                                                                                                                                                                             | `boolean`                                                                                                 | `false`                              |
| `showGrid`                  | `show-grid`                    | Can be used to customize the grid view of the table.                                                                                                                                                                           | `ShowGrid.COL \| ShowGrid.COMPLETE \| ShowGrid.NONE \| ShowGrid.ROW`                                      | `ShowGrid.ROW`                       |
| `showGroups`                | `show-groups`                  | When set to true enables the column grouping.                                                                                                                                                                                  | `boolean`                                                                                                 | `false`                              |
| `showHeader`                | `show-header`                  | Enables rendering of the table header.                                                                                                                                                                                         | `boolean`                                                                                                 | `true`                               |
| `showLoadMore`              | `show-load-more`               | If set to true, displays the button to load more records.                                                                                                                                                                      | `boolean`                                                                                                 | `false`                              |
| `showTooltipOnRightClick`   | `show-tooltip-on-right-click`  | If set to true, displays tooltip on right click; if set to false, displays tooltip on mouseOver.                                                                                                                               | `boolean`                                                                                                 | `true`                               |
| `sort`                      | --                             | Defines the current sorting options.                                                                                                                                                                                           | `SortObject[]`                                                                                            | `[]`                                 |
| `sortEnabled`               | `sort-enabled`                 | When set to true enables the sorting of the columns.                                                                                                                                                                           | `boolean`                                                                                                 | `true`                               |
| `sortableColumnsMutateData` | `sortable-columns-mutate-data` | If set to true, when a column is dragged to be sorted, the component directly mutates the data.columns property and then fires the event                                                                                       | `boolean`                                                                                                 | `true`                               |
| `stateId`                   | `state-id`                     |                                                                                                                                                                                                                                | `string`                                                                                                  | `''`                                 |
| `store`                     | --                             |                                                                                                                                                                                                                                | `KupStore`                                                                                                | `undefined`                          |
| `tableHeight`               | `table-height`                 | Sets the height of the table.                                                                                                                                                                                                  | `string`                                                                                                  | `undefined`                          |
| `tableWidth`                | `table-width`                  | Sets the width of the table.                                                                                                                                                                                                   | `string`                                                                                                  | `undefined`                          |
| `tooltipDetailTimeout`      | `tooltip-detail-timeout`       | Defines the timeout for tooltip detail                                                                                                                                                                                         | `number`                                                                                                  | `undefined`                          |
| `tooltipEnabled`            | `tooltip-enabled`              | Enable show tooltip                                                                                                                                                                                                            | `boolean`                                                                                                 | `true`                               |
| `tooltipLoadTimeout`        | `tooltip-load-timeout`         | Defines the timeout for tooltip load                                                                                                                                                                                           | `number`                                                                                                  | `undefined`                          |
| `totals`                    | --                             | Defines the current totals options                                                                                                                                                                                             | `TotalsMap`                                                                                               | `undefined`                          |
| `transpose`                 | `transpose`                    | Transposes the data of the data table                                                                                                                                                                                          | `boolean`                                                                                                 | `false`                              |


## Events

| Event                     | Description                                    | Type                                                                                                                              |
| ------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `kupAddCodeDecodeColumn`  |                                                | `CustomEvent<{ column: string; }>`                                                                                                |
| `kupAddColumn`            | When 'add column' menu item is clicked         | `CustomEvent<{ column: string; comp: KupDataTable; }>`                                                                            |
| `kupAutoRowSelect`        | When a row is auto selected via selectRow prop | `CustomEvent<{ comp: KupDataTable; selectedRow: Row; }>`                                                                          |
| `kupCellButtonClicked`    |                                                | `CustomEvent<KupDataTableCellButtonClick>`                                                                                        |
| `kupCellTextFieldInput`   |                                                | `CustomEvent<KupDataTableCellTextFieldInput>`                                                                                     |
| `kupDataTableCellUpdate`  | Emitted when a cell's data has been updated.   | `CustomEvent<{ comp: KupDataTable; cell: Cell; column: Column; id: string; row: Row; event: any; }>`                              |
| `kupDataTableClick`       | Generic click event on data table.             | `CustomEvent<{ comp: KupDataTable; details: EventHandlerDetails; }>`                                                              |
| `kupDataTableColumnMenu`  | When the column menu is being opened/closed.   | `CustomEvent<{ comp: KupDataTable; card: HTMLKupCardElement; open: boolean; }>`                                                   |
| `kupDataTableContextMenu` | Generic right click event on data table.       | `CustomEvent<{ comp: KupDataTable; details: EventHandlerDetails; }>`                                                              |
| `kupDataTableDblClick`    | Generic double click event on data table.      | `CustomEvent<{ comp: KupDataTable; details: EventHandlerDetails; }>`                                                              |
| `kupDidLoad`              | When component load is complete                | `CustomEvent<{ comp: KupDataTable; }>`                                                                                            |
| `kupDidUnload`            | When component unload is complete              | `CustomEvent<{ comp: KupDataTable; }>`                                                                                            |
| `kupLoadMoreClicked`      |                                                | `CustomEvent<{ comp: KupDataTable; loadItems: number; }>`                                                                         |
| `kupOptionClicked`        | When cell option is clicked                    | `CustomEvent<{ comp: KupDataTable; column: string; row: Row; }>`                                                                  |
| `kupResetSelectedRows`    | When rows selections reset                     | `CustomEvent<{ comp: KupDataTable; }>`                                                                                            |
| `kupRowActionClicked`     | When a row action is clicked                   | `CustomEvent<{ comp: KupDataTable; type: "default" \| "variable" \| "expander"; row: Row; action?: RowAction; index?: number; }>` |
| `kupRowSelected`          | When a row is selected                         | `CustomEvent<{ comp: KupDataTable; selectedRows: Row[]; clickedRow: Row; clickedColumn: string; }>`                               |


## Methods

### `closeColumnMenu() => Promise<void>`

Closes any opened column menu.

#### Returns

Type: `Promise<void>`



### `collapseAll() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `defaultSortingFunction(columns: Column[], receivingColumnIndex: number, sortedColumnIndex: number, useNewObject?: boolean) => Promise<Column[]>`



#### Returns

Type: `Promise<Column[]>`



### `expandAll() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getInternalState() => Promise<{ groups: GroupObject[]; filters: GenericFilter; data: TableData; }>`



#### Returns

Type: `Promise<{ groups: GroupObject[]; filters: GenericFilter; data: TableData; }>`



### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `openColumnMenu(column: string) => Promise<void>`

Opens the column menu of the given column.

#### Returns

Type: `Promise<void>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `resizeCallback() => Promise<void>`

This method is invoked by KupManager whenever the component changes size.

#### Returns

Type: `Promise<void>`



### `setSelectedRows(rowsById: string, emitEvent?: boolean) => Promise<void>`

This method will set the selected rows of the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-card](../kup-card)
 - [kup-magic-box](../kup-magic-box)
 - [kup-search](../kup-search)

### Depends on

- [kup-card](../kup-card)
- [kup-checkbox](../kup-checkbox)
- [kup-tooltip](../kup-tooltip)
- [kup-list](../kup-list)
- [kup-date-picker](../kup-date-picker)
- [kup-image](../kup-image)
- [kup-button](../kup-button)
- [kup-chart](../kup-chart)
- [kup-color-picker](../kup-color-picker)
- [kup-gauge](../kup-gauge)
- [kup-progress-bar](../kup-progress-bar)
- [kup-rating](../kup-rating)
- [kup-radio](../kup-radio)
- [kup-paginator](../kup-paginator)
- [kup-switch](../kup-switch)
- [kup-combobox](../kup-combobox)
- [kup-badge](../kup-badge)

### Graph
```mermaid
graph TD;
  kup-data-table --> kup-card
  kup-data-table --> kup-checkbox
  kup-data-table --> kup-tooltip
  kup-data-table --> kup-list
  kup-data-table --> kup-date-picker
  kup-data-table --> kup-image
  kup-data-table --> kup-button
  kup-data-table --> kup-chart
  kup-data-table --> kup-color-picker
  kup-data-table --> kup-gauge
  kup-data-table --> kup-progress-bar
  kup-data-table --> kup-rating
  kup-data-table --> kup-radio
  kup-data-table --> kup-paginator
  kup-data-table --> kup-switch
  kup-data-table --> kup-combobox
  kup-data-table --> kup-badge
  kup-card --> kup-data-table
  kup-chip --> kup-badge
  kup-badge --> kup-badge
  kup-autocomplete --> kup-list
  kup-list --> kup-radio
  kup-list --> kup-checkbox
  kup-list --> kup-badge
  kup-button --> kup-badge
  kup-combobox --> kup-list
  kup-date-picker --> kup-text-field
  kup-date-picker --> kup-button
  kup-time-picker --> kup-text-field
  kup-time-picker --> kup-button
  kup-time-picker --> kup-list
  kup-tree --> kup-image
  kup-tree --> kup-button
  kup-tree --> kup-chart
  kup-tree --> kup-checkbox
  kup-tree --> kup-chip
  kup-tree --> kup-color-picker
  kup-tree --> kup-gauge
  kup-tree --> kup-progress-bar
  kup-tree --> kup-rating
  kup-tree --> kup-radio
  kup-tree --> kup-tooltip
  kup-tree --> kup-list
  kup-tree --> kup-text-field
  kup-tree --> kup-card
  kup-image --> kup-spinner
  kup-image --> kup-badge
  kup-color-picker --> kup-text-field
  kup-tooltip --> kup-button
  kup-tooltip --> kup-card
  kup-tooltip --> kup-tree
  kup-paginator --> kup-combobox
  kup-paginator --> kup-badge
  kup-magic-box --> kup-data-table
  kup-search --> kup-data-table
  style kup-data-table fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
