# kup-chart



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                           | Type                               | Default            |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------ |
| `asp`         | `asp`          | Sets the chart to a 2D or 3D aspect. 3D only works for Pie graphs.                                                                                                                    | `ChartAspect.D2 \| ChartAspect.D3` | `undefined`        |
| `axis`        | `axis`         | Sets the axis of the chart.                                                                                                                                                           | `string`                           | `undefined`        |
| `chartTitle`  | --             | Title of the graph.                                                                                                                                                                   | `ChartTitle`                       | `undefined`        |
| `colors`      | --             | Colors of the chart.                                                                                                                                                                  | `string[]`                         | `[]`               |
| `customStyle` | `custom-style` | Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization.                                                                      | `string`                           | `''`               |
| `data`        | --             | The actual data of the chart.                                                                                                                                                         | `DataTable`                        | `undefined`        |
| `hAxis`       | --             | Customize the hAxis.                                                                                                                                                                  | `ChartAxis`                        | `undefined`        |
| `legend`      | `legend`       | Sets the position of the legend. Supported values: bottom, labeled, left, none, right, top. Keep in mind that legend types are tied to chart types, some combinations might not work. | `string`                           | `'right'`          |
| `offlineMode` | --             | Renders charts without the Google API and using jQuery Sparkline.                                                                                                                     | `ChartOfflineMode`                 | `undefined`        |
| `series`      | --             | The data series to be displayed. They must be of the same type.                                                                                                                       | `ChartSerie[]`                     | `undefined`        |
| `showMarks`   | `show-marks`   | Displays the numerical values.                                                                                                                                                        | `boolean`                          | `false`            |
| `sizeX`       | `size-x`       | The width of the chart, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).                                                                                             | `string`                           | `'100%'`           |
| `sizeY`       | `size-y`       | The height of the chart, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).                                                                                            | `string`                           | `'100%'`           |
| `stacked`     | `stacked`      | Displays the data columns of an object on top of each other.                                                                                                                          | `boolean`                          | `false`            |
| `types`       | --             | The type of the chart. Supported formats: Area, Bubble, Cal, Candlestick, Combo, Geo, Hbar, Line, Ohlc, Pie, Sankey, Scatter, Unk, Vbar.                                              | `ChartType[]`                      | `[ChartType.Hbar]` |
| `vAxis`       | --             | Customize the vAxis.                                                                                                                                                                  | `ChartAxis`                        | `undefined`        |
| `version`     | `version`      | Google chart version to load                                                                                                                                                          | `string`                           | `'45.2'`           |


## Events

| Event             | Description                             | Type                              |
| ----------------- | --------------------------------------- | --------------------------------- |
| `kup-chart-click` | Triggered when a chart serie is clicked | `CustomEvent<KupChartClickEvent>` |


## Methods

### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `resizeCallback() => Promise<void>`

This method is invoked by KupManager whenever the component changes size.

#### Returns

Type: `Promise<void>`



### `setProps(props: GenericObject) => Promise<void>`

Sets the props to the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-box](../kup-box)
 - [kup-card](../kup-card)
 - [kup-data-table](../kup-data-table)
 - [kup-hypermenu](../kup-hypermenu)
 - [kup-magic-box](../kup-magic-box)
 - [kup-tree](../kup-tree)

### Graph
```mermaid
graph TD;
  kup-box --> kup-chart
  kup-card --> kup-chart
  kup-data-table --> kup-chart
  kup-hypermenu --> kup-chart
  kup-magic-box --> kup-chart
  kup-tree --> kup-chart
  style kup-chart fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
