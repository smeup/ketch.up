import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-badge component.
 * Used to export every prop in an object.
 */
export enum KupBadgeProps {
    customStyle = 'Custom style of the component.',
    imageData = 'The data of the image displayed inside the badge.Props of the sub-components.',
    text = 'The text displayed inside the badge.Defaults at false. When set to true, the component is disabled.',
}

export interface KupBadgeEventPayload extends KupEventPayload {
    el: EventTarget;
}