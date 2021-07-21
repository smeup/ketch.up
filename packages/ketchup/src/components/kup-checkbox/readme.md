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

| Event                 | Description                                       | Type                                   |
| --------------------- | ------------------------------------------------- | -------------------------------------- |
| `kup-checkbox-blur`   | Triggered when the input element loses focus.     | `CustomEvent<KupCheckboxEventPayload>` |
| `kup-checkbox-change` | Triggered when the input element's value changes. | `CustomEvent<KupCheckboxEventPayload>` |
| `kup-checkbox-focus`  | Triggered when the input element gets focused.    | `CustomEvent<KupCheckboxEventPayload>` |


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




## Dependencies

### Used by

 - [kup-box](../kup-box)
 - [kup-card](../kup-card)
 - [kup-data-table](../kup-data-table)
 - [kup-hypermenu](../kup-hypermenu)
 - [kup-list](../kup-list)
 - [kup-tree](../kup-tree)

### Graph
```mermaid
graph TD;
  kup-box --> kup-checkbox
  kup-card --> kup-checkbox
  kup-data-table --> kup-checkbox
  kup-hypermenu --> kup-checkbox
  kup-list --> kup-checkbox
  kup-tree --> kup-checkbox
  style kup-checkbox fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
