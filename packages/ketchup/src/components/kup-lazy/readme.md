# kup-lazy



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                                             | Type                                                                  | Default              |
| ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------- |
| `componentName`   | `component-name`   | Sets the tag name of the component to be lazy loaded.                                                                                   | `string`                                                              | `null`               |
| `customStyle`     | `custom-style`     | Custom style of the component.                                                                                                          | `string`                                                              | `''`                 |
| `data`            | --                 | Sets the data of the component to be lazy loaded.                                                                                       | `GenericObject`                                                       | `null`               |
| `renderMode`      | `render-mode`      | Decides when the sub-component should be rendered. By default when both the component props exist and the component is in the viewport. | `KupLazyRender.BOTH \| KupLazyRender.PROPS \| KupLazyRender.VIEWPORT` | `KupLazyRender.BOTH` |
| `showPlaceholder` | `show-placeholder` | Displays an animated SVG placeholder until the component is loaded.                                                                     | `boolean`                                                             | `true`               |


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




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
