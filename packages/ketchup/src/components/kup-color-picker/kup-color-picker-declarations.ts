import { KupEventPayload } from '../../types/GenericTypes';

/**
 * Props of the kup-color-picker component.
 * Used to export every prop in an object.
 */
export enum KupColorPickerProps {
    customStyle = 'Custom style of the component.',
    data = 'Props of the text field.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    initialValue = 'Sets the initial value of the component. Can be css color name, hex code or rgb code (sample: "red" or rgb(255, 0, 0) or "#FF0000" ).',
    swatchOnly = "When true, the component's text field will be replaced by a swatch.",
}

export interface KupColorPickerEventPayload extends KupEventPayload {
    value: string;
}
