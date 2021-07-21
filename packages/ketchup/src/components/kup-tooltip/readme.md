# kup-tooltip

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                      | Type                   | Default     |
| --------------- | ---------------- | -------------------------------- | ---------------------- | ----------- |
| `cellOptions`   | --               | Data for cell options            | `TooltipCellOptions`   | `undefined` |
| `data`          | --               | Data for top section             | `TooltipData`          | `undefined` |
| `detailData`    | --               | Data for the detail              | `TooltipDetailData`    | `undefined` |
| `detailTimeout` | `detail-timeout` | Timeout for loadDetail           | `number`               | `800`       |
| `layout`        | `layout`         | Layout used to display the items | `string`               | `'1'`       |
| `loadTimeout`   | `load-timeout`   | Timeout for tooltip              | `number`               | `1000`      |
| `owner`         | `owner`          | Owner of this tooltip            | `string`               | `'not-set'` |
| `relatedObject` | --               | Container element for tooltip    | `TooltipRelatedObject` | `undefined` |


## Events

| Event                                  | Description                                     | Type                                                          |
| -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| `kup-tooltip-actioncommandclick`       |                                                 | `CustomEvent<KupTooltipActionCommandClickEventPayload>`       |
| `kup-tooltip-defaultactionclick`       |                                                 | `CustomEvent<KupTooltipDefaultEventPayload>`                  |
| `kup-tooltip-defaultoptionclick`       |                                                 | `CustomEvent<KupTooltipDefaultEventPayload>`                  |
| `kup-tooltip-defaultpreviewclick`      |                                                 | `CustomEvent<KupTooltipDefaultEventPayload>`                  |
| `kup-tooltip-loadcelloptions`          |                                                 | `CustomEvent<KupTooltipLoadEventPayload>`                     |
| `kup-tooltip-loaddata`                 |                                                 | `CustomEvent<KupTooltipLoadEventPayload>`                     |
| `kup-tooltip-loaddetail`               |                                                 | `CustomEvent<KupTooltipLoadEventPayload>`                     |
| `kup-tooltip-treedynamicmassexpansion` |                                                 | `CustomEvent<KupTooltipTreeDynamicMassExpansionEventPayload>` |
| `kup-tooltip-treenodebuttonclick`      |                                                 | `CustomEvent<KupTooltipTreeNodeButtonClickEventPayload>`      |
| `kup-tooltip-treenodedblclick`         |                                                 | `CustomEvent<KupTooltipTreeNodeDblClickEventPayload>`         |
| `kup-tooltip-treenodeexpand`           |                                                 | `CustomEvent<KupTooltipTreeNodeExpandEventPayload>`           |
| `kup-tooltip-treenodeselected`         | Fired when a node of the tree has been selected | `CustomEvent<KupTooltipTreeNodeSelectedEventPayload>`         |


## Methods

### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `setProps(props: GenericObject) => Promise<void>`

Sets the props to the component.

#### Returns

Type: `Promise<void>`



### `setTooltipInfo(relatedObject: TooltipRelatedObject) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `unsetTooltipInfo() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-box](../kup-box)
 - [kup-data-table](../kup-data-table)
 - [kup-tree](../kup-tree)

### Depends on

- [kup-button](../kup-button)
- [kup-card](../kup-card)
- [kup-tree](../kup-tree)

### Graph
```mermaid
graph TD;
  kup-tooltip --> kup-button
  kup-tooltip --> kup-card
  kup-tooltip --> kup-tree
  kup-button --> kup-badge
  kup-badge --> kup-badge
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
  kup-data-table --> kup-tooltip
  kup-image --> kup-spinner
  kup-image --> kup-badge
  kup-button-list --> kup-dropdown-button
  kup-button-list --> kup-badge
  kup-dropdown-button --> kup-list
  kup-dropdown-button --> kup-badge
  kup-color-picker --> kup-text-field
  kup-paginator --> kup-combobox
  kup-paginator --> kup-badge
  kup-tab-bar --> kup-badge
  kup-tree --> kup-tooltip
  kup-box --> kup-tooltip
  style kup-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
