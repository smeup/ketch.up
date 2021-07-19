# kup-search



<!-- Auto Generated Below -->


## Properties

| Property                          | Attribute               | Description                                                                                                                                                              | Type                                                               | Default     |
| --------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------- |
| `data`                            | --                      |                                                                                                                                                                          | `TableData`                                                        | `undefined` |
| `disabled`                        | `disabled`              |                                                                                                                                                                          | `boolean`                                                          | `false`     |
| `extra`                           | `extra`                 |                                                                                                                                                                          | `any`                                                              | `undefined` |
| `initialValue`                    | `initial-value`         |                                                                                                                                                                          | `string`                                                           | `''`        |
| `searchCallBackOnFilterSubmitted` | --                      | /** Function that can be invoked when the filter is submitted, but only if in serverHandledFilter mode. It returns the items filtered.                                   | `(detail: SearchFilterSubmittedEventDetail) => Promise<TableData>` | `undefined` |
| `serverHandledFilter`             | `server-handled-filter` | When true it emits events or makes available callbacks useful to obtain and filter data. When false the data inside data prop will be used and filtered in a static way. | `boolean`                                                          | `false`     |
| `valueField`                      | `value-field`           | The field used to obtain value                                                                                                                                           | `string`                                                           | `undefined` |


## Events

| Event                       | Description                                                                 | Type                                             |
| --------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| `kupSearchFilterSubmitted`  | Fired when the filter is submitted but only if in serverHandledFilter mode. | `CustomEvent<SearchFilterSubmittedEventDetail>`  |
| `kupSearchSelectionUpdated` |                                                                             | `CustomEvent<SearchSelectionUpdatedEventDetail>` |


## Dependencies

### Used by

 - [kup-form](../kup-form)

### Depends on

- [kup-text-field](../kup-text-field)
- [kup-button](../kup-button)
- [kup-modal](../kup-modal)
- [kup-data-table](../kup-data-table)

### Graph
```mermaid
graph TD;
  kup-search --> kup-text-field
  kup-search --> kup-button
  kup-search --> kup-modal
  kup-search --> kup-data-table
  kup-button --> kup-badge
  kup-badge --> kup-badge
  kup-data-table --> kup-card
  kup-data-table --> kup-checkbox
  kup-data-table --> kup-tooltip
  kup-data-table --> kup-list
  kup-data-table --> kup-date-picker
  kup-data-table --> kup-image
  kup-data-table --> kup-button
  kup-data-table --> kup-button-list
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
  kup-card --> kup-chip
  kup-card --> kup-badge
  kup-card --> kup-autocomplete
  kup-card --> kup-button
  kup-card --> kup-checkbox
  kup-card --> kup-combobox
  kup-card --> kup-date-picker
  kup-card --> kup-text-field
  kup-card --> kup-time-picker
  kup-card --> kup-data-table
  kup-card --> kup-list
  kup-card --> kup-progress-bar
  kup-card --> kup-chart
  kup-card --> kup-spinner
  kup-card --> kup-tab-bar
  kup-card --> kup-tree
  kup-card --> kup-switch
  kup-chip --> kup-badge
  kup-autocomplete --> kup-list
  kup-list --> kup-radio
  kup-list --> kup-checkbox
  kup-list --> kup-badge
  kup-combobox --> kup-list
  kup-date-picker --> kup-text-field
  kup-date-picker --> kup-button
  kup-time-picker --> kup-text-field
  kup-time-picker --> kup-button
  kup-time-picker --> kup-list
  kup-tab-bar --> kup-badge
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
  kup-button-list --> kup-dropdown-button
  kup-button-list --> kup-badge
  kup-dropdown-button --> kup-list
  kup-dropdown-button --> kup-badge
  kup-paginator --> kup-combobox
  kup-paginator --> kup-badge
  kup-form --> kup-search
  style kup-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
