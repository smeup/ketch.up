import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-tab-bar component.
 * Used to export every prop in an object.
 */
export enum KupTabBarProps {
    customStyle = 'Custom style of the component.',
    data = 'List of elements.',
}
/**
 * The object of a single radio.
 */
export interface KupTabBarData {
    value: string;
    active?: boolean;
    icon?: string;
    text?: string;
    title?: string;
}

export interface KupTabBarEventPayload extends KupEventPayload {
    index: number;
    el: EventTarget;
}

export interface KupTabBarClickEventPayload extends KupTabBarEventPayload {
    value: string,
}
