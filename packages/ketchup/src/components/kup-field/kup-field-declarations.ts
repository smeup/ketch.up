/**
 * Props of the kup-field component.
 * Used to export every prop in an object.
 */
export enum KupFieldProps {
    customStyle = 'Custom style of the component.',
    data = 'Effective data to pass to the component.',
    label = 'The text of the label. If set to empty or has only white space chars, the label will be removed.',
    labelPos = "Sets the label's position, left right or top.",
    showSubmit = 'Sets whether the submit button must be displayed or not.',
    submitLabel = "Sets the submit button's label.",
    submitPos = "Sets the submit button's position, top right bottom or left.",
    type = 'The type of the FLD',
}
export interface KupPayloadEvent<KupPayloadEventData, KupPayloadEventInfo> {
    value: KupPayloadEventData;
    oldValue: KupPayloadEventData;
    info: KupPayloadEventInfo;
}
export interface KupFieldSubmitEvent extends KupPayloadEvent<any, object> {
    originalEvent: CustomEvent;
}

export interface KupFieldChangeEvent extends KupPayloadEvent<any, object> {
    originalEvent: CustomEvent<any>;
}
