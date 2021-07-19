import type { FComponent } from '../../types/GenericTypes';
/**
 * Props of the f-button component.
 */
export interface FButtonProps extends FComponent {
    checked?: boolean;
    disabled?: boolean;
    fullHeight?: boolean;
    fullWidth?: boolean;
    icon?: string;
    iconOff?: string;
    label?: string;
    large?: boolean;
    shaped?: boolean;
    styling?: FButtonStyling;
    toggable?: boolean;
    trailingIcon?: boolean;
}
/**
 * Styling options for the f-button component.
 * @enum {string}
 * @property {string} FLAT - Flat style: no background nor borders.
 * @property {string} FLOATING - Floating action button (FAB) style: round and large.
 * @property {string} ICON - Icon button style: single icon with backdrop and no background.
 * @property {string} OUTLINED - Outlined style: no background with border.
 * @property {string} RAISED - Raised style: no border with solid background.
 */
export enum FButtonStyling {
    FLAT = 'flat',
    FLOATING = 'floating',
    ICON = 'icon',
    OUTLINED = 'outlined',
    RAISED = 'raised',
}
