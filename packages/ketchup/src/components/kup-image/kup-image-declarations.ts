import { KupEventPayload } from "../../types/GenericTypes";

/**
 * Props of the kup-image component.
 * Used to export every prop in an object.
 */
export enum KupImageProps {
    badgeData = 'Sets the data of badges.',
    color = 'The color of the icon, defaults to the CSS variable --kup-icon-color.',
    customStyle = 'Custom style of the component.',
    data = "When present, the component will be drawn using CSS. Check the 'Drawing with CSS' section of the image showcase for more information.",
    feedback = 'When set to true, a spinner will be displayed until the image finished loading. Not compatible with SVGs.',
    isCanvas = "The image component will create a canvas element on which it's possible to draw. It's a temporary feature that will be fully replaced by CSS drawing in the future.",
    resource = 'The resource used to fetch the image.',
    sizeX = 'The width of the icon, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
    sizeY = 'The height of the icon, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
}

export interface KupImageClickEventPayload extends KupEventPayload {
    el: EventTarget;
}