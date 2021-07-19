/**
 * Props of the kup-lazy component.
 * Used to export every prop in an object.
 */
export enum KupLazyProps {
    componentName = 'Sets the tag name of the component to be lazy loaded.',
    customStyle = 'Custom style of the component.',
    data = 'Sets the data of the component to be lazy loaded.',
    showPlaceholder = 'Displays an animated SVG placeholder until the component is loaded.',
}
/**
 * Decides when the sub component should be rendered.
 */
export enum KupLazyRender {
    VIEWPORT = 'viewport',
    PROPS = 'props',
    BOTH = 'both',
}
