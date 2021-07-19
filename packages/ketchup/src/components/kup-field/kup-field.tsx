import {
    Component,
    Element,
    h,
    Host,
    Event,
    EventEmitter,
    forceUpdate,
    Method,
    Prop,
} from '@stencil/core';

import {
    KupFieldProps,
    KupFieldChangeEvent,
    KupFieldSubmitEvent,
} from './kup-field-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { GenericObject, KupComponent } from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';

@Component({
    tag: 'kup-field',
    styleUrl: 'kup-field.scss',
    shadow: true,
})
export class KupField {
    @Element() rootElement: HTMLElement;

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Effective data to pass to the component.
     */
    @Prop() data: Object = {};
    /**
     * The text of the label. If set to empty or has only white space chars, the label will be removed.
     */
    @Prop() label: string = '';
    /**
     * Sets the label's position, left right or top.
     */
    @Prop() labelPos: string = 'left';
    /**
     * Sets whether the submit button must be displayed or not.
     */
    @Prop() showSubmit: boolean = false;
    /**
     * Sets the submit button's label.
     */
    @Prop() submitLabel: string = '';
    /**
     * Sets the submit button's position, top right bottom or left.
     */
    @Prop() submitPos: string = 'right';
    /**
     * The type of the FLD
     */
    @Prop() type: string = undefined;

    //-- Not reactive --
    currentValue: object | string = null;
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    previousValue: object | string = null;

    // Generates an instance of the event handler while binding the current component as its this value
    // This is done once per component to improve performance speed
    onChangeInstance = this.onChange.bind(this);
    onSubmitInstance = this.onSubmit.bind(this);

    //---- Events ----
    /**
     * Launched when the value of the current FLD changes.
     */
    @Event({
        eventName: 'kup-field-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupFieldChangeEvent>;

    /**
     * Launched when the FLD values are confirmed and a submit event is triggered.
     */
    @Event({
        eventName: 'kup-field-submit',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupSubmit: EventEmitter<KupFieldSubmitEvent>;

    //---- Methods ----

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        let props: GenericObject = {};
        if (descriptions) {
            props = KupFieldProps;
        } else {
            for (const key in KupFieldProps) {
                if (Object.prototype.hasOwnProperty.call(KupFieldProps, key)) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    // When a change or update event must be launched as if it's coming from the FLD itself
    onChange(event: CustomEvent) {
        const { value, info } = event.detail;
        this.kupChange.emit({
            originalEvent: event,
            oldValue: this.currentValue,
            value,
            info,
        });
        this.previousValue = this.currentValue;
        this.currentValue = value;
    }

    // When a submit event must be launched as if it's coming from the FLD itself
    onSubmit(event: CustomEvent) {
        this.kupSubmit.emit({
            originalEvent: event,
            oldValue: this.previousValue,
            value: this.currentValue,
            info: {
                obj:
                    event.detail.info && event.detail.info.obj
                        ? event.detail.info.obj
                        : undefined,
            },
        });
    }

    //-- Public --

    /**
     * Provides an interface to get the current value programmatically
     * @method getCurrentValue
     * @returns {any}
     */
    @Method()
    async getCurrentValue() {
        return this.currentValue;
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let toRender = [];
        const baseClass = 'kup-field';
        let label = null;
        let submit = null;
        let wrapperClass = '';

        let propList: any = { ...this.data };

        if (this.label.trim().length) {
            wrapperClass += ' label-' + this.labelPos;
            label = (
                <label
                    class={
                        baseClass +
                        '__label' +
                        ' ' +
                        baseClass +
                        '--' +
                        this.labelPos
                    }
                >
                    {this.label}
                </label>
            );
        }

        if (this.showSubmit) {
            wrapperClass += ' submit-' + this.submitPos;
            submit = (
                <kup-button
                    class={baseClass + '__submit'}
                    label={this.submitLabel}
                    onkup-button-click={this.onSubmitInstance}
                />
            );
        }

        //-- If a component must be positioned on top of the dynamic one --
        const labelIsTop = this.labelPos === 'top';
        const labelIsLeft = this.labelPos === 'left';
        const labelIsRight = this.labelPos === 'right';
        const submitIsTop = this.submitPos === 'top';
        const submitIsLeft = this.submitPos === 'left';
        const submitIsRight = this.submitPos === 'right';
        const submitIsBottom = this.submitPos === 'bottom';

        if (labelIsTop || submitIsTop) {
            toRender.push(
                <div class={baseClass + '__top-container'}>
                    {labelIsTop && label ? label : null}
                    {submitIsTop && submit ? submit : null}
                </div>
            );
        }

        if (labelIsLeft && label) {
            toRender.push(label);
        }

        if (submitIsLeft && submit) {
            toRender.push(submit);
        }

        let comp: string = undefined;

        if (this.type === undefined) {
            this.kupManager.debug.logMessage(
                this,
                'Type (state) is undefined!',
                KupDebugCategory.WARNING
            );
        } else {
            switch (this.type.toLowerCase()) {
                case 'cmb':
                    comp = 'kup-combobox';
                    propList.onKupComboboxChange = this.onChangeInstance;
                    break;
                case 'fup':
                    comp = 'kup-upload';
                    propList.items = this.data;
                    break;
                case 'itx':
                    comp = 'kup-text-field';
                    propList.onkupTextFieldChange = this.onChangeInstance;
                    break;
                case 'rad':
                    comp = 'kup-radio';
                    propList.onkupRadioChange = this.onChangeInstance;
                    break;
            }
        }

        const $DynamicComponent = comp as any; // TODO check if there is a better typing

        toRender.push(
            <$DynamicComponent
                class={baseClass + '__component'}
                {...propList}
            />
        );

        if (labelIsRight && label) {
            toRender.push(label);
        }

        if ((submitIsRight || submitIsBottom) && submit) {
            toRender.push(submit);
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" class={wrapperClass}>
                    {toRender}
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
