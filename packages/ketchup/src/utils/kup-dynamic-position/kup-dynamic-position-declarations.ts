/**
 * HTML attribute attached to dynamically positioned elements.
 */
export const kupDynamicPositionAttribute = 'kup-dynamic-position';
/**
 * HTML attribute attached to dynamically positioned elements' anchor point.
 */
export const kupDynamicPositionAnchorAttribute = 'kup-dynamic-position-anchor';
/**
 * CSS class attached to dynamically positioned elements when the script is running.
 */
export const kupDynamicPositionActiveClass = 'kup-dynamic-position-active';
/**
 * Master type extending all subtypes of available anchor points.
 */
export type KupDynamicPositionAnchor =
    | HTMLElement
    | KupDynamicPositionCoordinates;
/**
 * Fixed position element.
 */
export interface KupDynamicPositionElement extends HTMLElement {
    kupDynamicPosition: {
        anchor: KupDynamicPositionAnchor;
        detached: boolean;
        margin: number;
        position: KupDynamicPositionPlacement;
        rAF: number;
    };
}
/**
 * Coordinates for fixed positioning.
 */
export interface KupDynamicPositionCoordinates {
    x: number;
    y: number;
}
/**
 * Available placements.
 */
export enum KupDynamicPositionPlacement {
    AUTO = '',
    BOTTOM = 'b',
    BOTTOM_LEFT = 'bl',
    BOTTOM_RIGHT = 'br',
    LEFT = 'l',
    RIGHT = 'r',
    TOP = 't',
    TOP_LEFT = 'tl',
    TOP_RIGHT = 'tr',
}
