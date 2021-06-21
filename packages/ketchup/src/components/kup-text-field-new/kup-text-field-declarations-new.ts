/**
 * Props of the kup-text-field component.
 * Used to export every prop in an object.
 */
export enum KupTextFieldProps {
    customStyle = 'Custom style of the component.',
    disabled = 'When set to true, the component is disabled.',
    emitSubmitEventOnEnter = "When the text field is part of the autocomplete component and the list is opened, enter key selects the item and doesn't submit.",
    fullWidth = 'When set to true, the component will be rendered at full width.',
    helper = 'When set, its content will be shown as a help text below the field.',
    helperWhenFocused = 'When set, the helper will be shown only when the field is focused.',
    icon = 'When set, the text-field will show this icon.',
    initialValue = 'Sets the initial value of the component',
    inputType = 'The HTML type of the input element. It has no effect on text areas.',
    isClearable = 'Enables a clear trailing icon.',
    label = 'When set, its content will be shown as a label.',
    leadingLabel = 'When set to true, the label will be on the left of the component.',
    maxLength = 'When set, the helper will display a character counter.',
    outlined = 'When set to true, the component will be rendered as an outlined field.',
    readOnly = 'Sets the component to read only state, making it not editable, but interactable. Used in combobox component when it behaves as a select.',
    step = 'The HTML step of the input element. It has effect only with number input type.',
    textArea = 'When set to true, the component will be rendered as a textarea.',
    trailingIcon = 'When set, the icon will be shown after the text.',
    trailingLabel = 'When set to true, the label will be on the right of the component.',
}
