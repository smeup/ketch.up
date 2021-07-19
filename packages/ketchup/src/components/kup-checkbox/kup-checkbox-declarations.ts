import { KupEventPayload } from '../../types/GenericTypes';

/**
 * Props of the kup-checkbox component.
 * Used to export every prop in an object.
 */
export enum KupCheckboxProps {
    checked = "Defaults at false. When set to true, the component will be set to 'checked'.",
    customStyle = 'Custom style of the component.',
    disabled = 'When set to true, the component is disabled.',
    indeterminate = "When set to true, the component will be set to 'indeterminate'.",
    label = 'When specified, its content will be shown as a label.',
    leadingLabel = 'When set to true, the label will be on the left of the component.',
}

export interface KupCheckboxEventPayload extends KupEventPayload {
    checked: boolean;
    value: string;
}
