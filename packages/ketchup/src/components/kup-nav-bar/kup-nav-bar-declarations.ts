import { KupEventPayload } from '../../types/GenericTypes';

/**
 * Props of the kup-nav-bar component.
 * Used to export every prop in an object.
 */
export enum KupNavBarProps {
    customStyle = 'Custom style of the component.',
    data = 'The actual data of the nav bar.',
    mode = 'Defines how the bar will be displayed.',
}
/**
 * Data of the nav bar.
 */
export interface KupNavBarData {
    title: string;
    menuAction?: KupNavBarElement;
    menuActions?: KupNavBarElement[];
    optionActions?: KupNavBarElement[];
}
/**
 * Identifies a single nav bar element.
 */
export interface KupNavBarElement {
    icon: string;
    tooltip?: string;
    text?: string;
    value: string;
    visible?: boolean;
}
/**
 * Styling modes of the nav bar.
 */
export enum KupNavBarMode {
    DEFAULT = '',
    SHORT = 'short',
    SHORT_COLLAPSED = 'short-collapsed',
    FIXED = 'fixed',
    PROMINENT = 'prominent',
    DENSE = 'dense',
}
export interface KupNavbarEventPayload extends KupEventPayload {
    value: string;
}
