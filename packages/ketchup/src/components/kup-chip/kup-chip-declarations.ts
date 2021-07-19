import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-chip component.
 * Used to export every prop in an object.
 */
export enum KupChipProps {
    customStyle = 'Custom style of the component.',
    data = 'List of elements.',
    type = 'The type of chip. Available types: input, filter, choice or empty for default.',
}

export interface KupChipEventPayload extends KupEventPayload {
    index: number;
    value: string;
}