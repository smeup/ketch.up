import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-date-picker component.
 * Used to export every prop in an object.
 */
export enum KupDatePickerProps {
    customStyle = 'Custom style of the component.',
    data = 'Props of the sub-components.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    firstDayIndex = 'First day number (0 - sunday, 1 - monday, ...)',
    initialValue = 'Sets the initial value of the component',
}
export enum SourceEvent {
    DATE = 'date',
    MONTH = 'month',
    YEAR = 'year',
}

export interface KupDatePickerEventPayload extends KupEventPayload {
    value: any;
}