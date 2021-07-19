import { KupEventPayload } from '../../types/GenericTypes';

/**
 * Props of the kup-rating component.
 * Used to export every prop in an object.
 */
export enum KupRatingProps {
    customStyle = 'Custom style of the component.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    maxValue = 'Max number of stars (default 5)',
    value = 'Rated stars',
}

export interface KupRatingClickEventPayload extends KupEventPayload {
    value: number;
}
