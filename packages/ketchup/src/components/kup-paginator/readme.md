# kup-paginator



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description | Type                                         | Default              |
| ----------------- | ------------------- | ----------- | -------------------------------------------- | -------------------- |
| `currentPage`     | `current-page`      |             | `number`                                     | `1`                  |
| `max`             | `max`               |             | `number`                                     | `0`                  |
| `mode`            | `mode`              |             | `PaginatorMode.FULL \| PaginatorMode.SIMPLE` | `PaginatorMode.FULL` |
| `perPage`         | `per-page`          |             | `number`                                     | `10`                 |
| `selectedPerPage` | `selected-per-page` |             | `number`                                     | `10`                 |


## Events

| Event                              | Description                   | Type                                                      |
| ---------------------------------- | ----------------------------- | --------------------------------------------------------- |
| `kup-paginator-pagechanged`        | When the current page change  | `CustomEvent<KupPaginatorPageChangedEventPayload>`        |
| `kup-paginator-rowsperpagechanged` | When the rows per page change | `CustomEvent<KupPaginatorRowsPerPageChangedEventPayload>` |


## Methods

### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-box](../kup-box)
 - [kup-data-table](../kup-data-table)

### Depends on

- [kup-combobox](../kup-combobox)
- [kup-badge](../kup-badge)

### Graph
```mermaid
graph TD;
  kup-paginator --> kup-combobox
  kup-paginator --> kup-badge
  kup-combobox --> kup-list
  kup-list --> kup-radio
  kup-list --> kup-checkbox
  kup-list --> kup-badge
  kup-badge --> kup-badge
  kup-box --> kup-paginator
  kup-data-table --> kup-paginator
  style kup-paginator fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
