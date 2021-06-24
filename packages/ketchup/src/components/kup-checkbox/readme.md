# kup-checkbox

### Features to add:

-   Main label support: by using a label tag and a generated id.
-   Support aria-labelledby attribute.

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description                                                                  | Type      | Default |
| --------------- | --------------- | ---------------------------------------------------------------------------- | --------- | ------- |
| `checked`       | `checked`       | Defaults at false. When set to true, the component will be set to 'checked'. | `boolean` | `false` |
| `customStyle`   | `custom-style`  | Custom style of the component.                                               | `string`  | `''`    |
| `disabled`      | `disabled`      | When set to true, the component is disabled.                                 | `boolean` | `false` |
| `indeterminate` | `indeterminate` | When set to true, the component will be set to 'indeterminate'.              | `boolean` | `false` |
| `label`         | `label`         | When specified, its content will be shown as a label.                        | `string`  | `null`  |
| `leadingLabel`  | `leading-label` | When set to true, the label will be on the left of the component.            | `boolean` | `false` |


## Events

| Event               | Description                                       | Type                                                            |
| ------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `kupCheckboxBlur`   | Triggered when the input element loses focus.     | `CustomEvent<{ id: string; checked: boolean; value: string; }>` |
| `kupCheckboxChange` | Triggered when the input element's value changes. | `CustomEvent<{ id: string; checked: boolean; value: string; }>` |
| `kupCheckboxFocus`  | Triggered when the input element gets focused.    | `CustomEvent<{ id: string; checked: boolean; value: string; }>` |


## Methods

### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-box](../kup-box)
 - [kup-card](../kup-card)
 - [kup-data-table](../kup-data-table)
 - [kup-list](../kup-list)
 - [kup-list-new](../kup-list-new)
 - [kup-tree](../kup-tree)

### Graph
```mermaid
graph TD;
  kup-box --> kup-checkbox
  kup-card --> kup-checkbox
  kup-data-table --> kup-checkbox
  kup-list --> kup-checkbox
  kup-list-new --> kup-checkbox
  kup-tree --> kup-checkbox
  style kup-checkbox fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
