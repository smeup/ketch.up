import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-time-picker component.
 * Used to export every prop in an object.
 */
export enum KupTimePickerProps {
    clockVariant = 'When set to true, the drop down menu will display a clock.',
    customStyle = 'Custom style of the component.',
    data = 'Props of the sub-components (time input text field)',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    initialValue = 'Sets the initial value of the component',
    manageSeconds = 'Manage seconds',
    timeMinutesStep = 'Minutes step',
}

export interface KupTimePickerEventPayload extends KupEventPayload {
    value: any;
}