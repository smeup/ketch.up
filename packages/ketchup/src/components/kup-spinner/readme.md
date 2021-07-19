# kup-spinner

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                     | Type      | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`       | `active`        | When set to true the spinner is animating.                                                                      | `boolean` | `false`     |
| `barVariant`   | `bar-variant`   | Decides whether the component is a bar or a spinner.                                                            | `boolean` | `false`     |
| `customStyle`  | `custom-style`  | Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization | `string`  | `''`        |
| `dimensions`   | `dimensions`    | Width and height of the spinner. For the bar variant, only height.                                              | `string`  | `undefined` |
| `fader`        | `fader`         | Places a blend modal over the wrapper to darken the view (or lighten, when the theme is dark).                  | `boolean` | `false`     |
| `faderTimeout` | `fader-timeout` | The time required for the "fader" to trigger.                                                                   | `number`  | `3500`      |
| `fullScreen`   | `full-screen`   | When set to true the component will fill the whole viewport.                                                    | `boolean` | `false`     |
| `layout`       | `layout`        | Sets the layout of the spinner.                                                                                 | `number`  | `1`         |


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

 - [kup-card](../kup-card)
 - [kup-image](../kup-image)

### Graph
```mermaid
graph TD;
  kup-card --> kup-spinner
  kup-image --> kup-spinner
  style kup-spinner fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
