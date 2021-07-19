import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-radio component.
 * Used to export every prop in an object.
 */
export enum KupRadioProps {
    columns = 'Number of columns. When undefined, radio fields will be displayed inline.',
    customStyle = 'Custom style of the component.',
    data = 'List of elements.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    leadingLabel = 'Defaults at false. When set to true, the label will be on the left of the component.',
}
/**
 * The object of a single radio.
 */
export interface KupRadioData {
    value: string;
    label: string;
    checked: boolean;
}

export interface KupRadioChangeEventPayload extends KupEventPayload {
    value: string;
}

