import { KupEventPayload } from '../../types/GenericTypes';
import { KupAutocomplete } from './kup-autocomplete';

/**
 * Props of the kup-autocomplete component.
 * Used to export every prop in an object.
 */
export enum KupAutocompleteProps {
    customStyle = 'Custom style of the component.',
    data = 'Props of the sub-components.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    displayMode = 'Sets how to show the selected item value. Suported values: "code", "description", "both".',
    initialValue = 'Sets the initial value of the component.',
    minimumChars = 'The minimum number of chars to trigger the autocomplete.',
    selectMode = 'Sets how to return the selected item value. Suported values: "code", "description", "both".',
}
export enum AutocompleteDisplayMode {
    CODE = 'code',
    DESCRIPTION = 'description',
    DESCRIPTION_AND_CODE = 'both',
}

export interface KupAutocompleteEventPayload extends KupEventPayload {
    value: any;
}


export interface kupAutocompleteFilterChangedEventPayload extends KupEventPayload {
    filter: string;
    matchesMinimumCharsRequired: boolean;
}

