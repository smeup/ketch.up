import { KupEventPayload } from '../../types/GenericTypes';

/**
 * Props of the kup-button-list component.
 * Used to export every prop in an object.
 */
export enum KupButtonListProps {
    columns = 'Number of columns for draw sub-components.',
    customStyle = 'Custom style of the component.',
    data = 'Props of the sub-components.',
    disabled = 'Default at false. When set to true, the sub-components are disabled.',
    showSelection = 'If enabled, highlights the selected button.',
    styling = 'Defines the style of the buttons. Styles available: "flat", "outlined" and "raised" which is also the default.',
}

export interface KupButtonListClickEventPayload extends KupEventPayload {
    index: string;
    subIndex: string;
    obj: any;
}
