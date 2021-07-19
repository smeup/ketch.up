# kup-field

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                     | Type      | Default     |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `customStyle` | `custom-style` | Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization | `string`  | `''`        |
| `data`        | --             | Effective data to pass to the component.                                                                        | `Object`  | `{}`        |
| `label`       | `label`        | The text of the label. If set to empty or has only white space chars, the label will be removed.                | `string`  | `''`        |
| `labelPos`    | `label-pos`    | Sets the label's position, left right or top.                                                                   | `string`  | `'left'`    |
| `showSubmit`  | `show-submit`  | Sets whether the submit button must be displayed or not.                                                        | `boolean` | `false`     |
| `submitLabel` | `submit-label` | Sets the submit button's label.                                                                                 | `string`  | `''`        |
| `submitPos`   | `submit-pos`   | Sets the submit button's position, top right bottom or left.                                                    | `string`  | `'right'`   |
| `type`        | `type`         | The type of the FLD                                                                                             | `string`  | `undefined` |


## Events

| Event              | Description                                                                 | Type                               |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------- |
| `kup-field-change` | Launched when the value of the current FLD changes.                         | `CustomEvent<KupFieldChangeEvent>` |
| `kup-field-submit` | Launched when the FLD values are confirmed and a submit event is triggered. | `CustomEvent<KupFieldSubmitEvent>` |


## Methods

### `getCurrentValue() => Promise<string | object>`

Provides an interface to get the current value programmatically

#### Returns

Type: `Promise<string | object>`



### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [kup-button](../kup-button)

### Graph
```mermaid
graph TD;
  kup-field --> kup-button
  kup-button --> kup-badge
  kup-badge --> kup-badge
  style kup-field fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
