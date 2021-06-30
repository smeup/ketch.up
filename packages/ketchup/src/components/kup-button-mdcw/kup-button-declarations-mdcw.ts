/**
 * Props of the kup-button component.
 * Used to export every prop in an object.
 */
export enum KupButtonProps {
    checked = 'When set to true, the icon button state will be on.',
    customStyle = 'Custom style of the component.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    icon = 'When set, the button will show this icon.',
    iconOff = 'When set, the icon button off state will show this icon. Otherwise, an outlined version of the icon prop will be displayed.',
    label = 'When set, the button will show this text.',
    styling = 'Defines the style of the button. Styles available: "flat", "outlined" and "raised" which is also the default.',
    toggable = 'When set to true, the icon button will be toggable on/off.',
    trailingIcon = 'When set, the icon will be shown after the text.',
}
