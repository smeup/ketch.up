# kup-dropdown-button



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                   | Type                                                                                                                        | Default                        |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `customStyle`  | `custom-style`  | Custom style of the component.                                                                                | `string`                                                                                                                    | `''`                           |
| `data`         | --              | Props of the sub-components.                                                                                  | `Object`                                                                                                                    | `null`                         |
| `disabled`     | `disabled`      | Defaults at false. When set to true, the component is disabled.                                               | `boolean`                                                                                                                   | `false`                        |
| `displayMode`  | `display-mode`  | Sets how to show the selected item value. Suported values: "code", "description", "both".                     | `ItemsDisplayMode.CODE \| ItemsDisplayMode.DESCRIPTION \| ItemsDisplayMode.DESCRIPTION_AND_CODE`                            | `ItemsDisplayMode.DESCRIPTION` |
| `dropdownOnly` | `dropdown-only` | Default value is false. When set to true, the arrow dropdown button is the only button displayed.             | `boolean`                                                                                                                   | `false`                        |
| `icon`         | `icon`          | Defaults at null. When set, the button will show this icon.                                                   | `string`                                                                                                                    | `null`                         |
| `initialValue` | `initial-value` | Sets the initial value of the component.                                                                      | `string`                                                                                                                    | `''`                           |
| `label`        | `label`         | Defaults at null. When set, the button will show this text.                                                   | `string`                                                                                                                    | `null`                         |
| `selectMode`   | `select-mode`   | Sets how to return the selected item value. Suported values: "code", "description", "both".                   | `ItemsDisplayMode.CODE \| ItemsDisplayMode.DESCRIPTION \| ItemsDisplayMode.DESCRIPTION_AND_CODE`                            | `ItemsDisplayMode.CODE`        |
| `styling`      | `styling`       | Defines the style of the button. Styles available: "flat", "outlined" and "raised" which is also the default. | `FButtonStyling.FLAT \| FButtonStyling.FLOATING \| FButtonStyling.ICON \| FButtonStyling.OUTLINED \| FButtonStyling.RAISED` | `FButtonStyling.RAISED`        |
| `trailingIcon` | `trailing-icon` | Defaults at null. When set, the icon will be shown after the text.                                            | `boolean`                                                                                                                   | `false`                        |


## Events

| Event                          | Description                                    | Type                                         |
| ------------------------------ | ---------------------------------------------- | -------------------------------------------- |
| `kup-dropdownbutton-blur`      | Triggered when the primary button loses focus. | `CustomEvent<KupDropdownButtonEventPayload>` |
| `kup-dropdownbutton-change`    | Triggered when a list item changes.            | `CustomEvent<KupDropdownButtonEventPayload>` |
| `kup-dropdownbutton-click`     | Triggered when the primary button is clicked.  | `CustomEvent<KupDropdownButtonEventPayload>` |
| `kup-dropdownbutton-focus`     | Triggered when the primary button is focused.  | `CustomEvent<KupDropdownButtonEventPayload>` |
| `kup-dropdownbutton-itemclick` | Triggered when a list item is clicked.         | `CustomEvent<KupDropdownButtonEventPayload>` |


## Methods

### `getProps(descriptions?: boolean) => Promise<GenericObject>`

Used to retrieve component's props values.

#### Returns

Type: `Promise<GenericObject>`



### `getValue() => Promise<string>`

Returns the component's internal value.

#### Returns

Type: `Promise<string>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `setProps(props: GenericObject) => Promise<void>`

Sets the props to the component.

#### Returns

Type: `Promise<void>`



### `setValue(value: string) => Promise<void>`

Sets the internal value of the component.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [kup-button-list](../kup-button-list)

### Depends on

- [kup-list](../kup-list)
- [kup-badge](../kup-badge)

### Graph
```mermaid
graph TD;
  kup-dropdown-button --> kup-list
  kup-dropdown-button --> kup-badge
  kup-list --> kup-radio
  kup-list --> kup-checkbox
  kup-list --> kup-badge
  kup-badge --> kup-badge
  kup-button-list --> kup-dropdown-button
  style kup-dropdown-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
