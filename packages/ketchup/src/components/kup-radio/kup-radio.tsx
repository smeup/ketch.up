import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
    State,
    VNode,
} from '@stencil/core';

import type {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    KupRadioChangeEventPayload,
    KupRadioData,
    KupRadioProps,
} from './kup-radio-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-radio',
    styleUrl: 'kup-radio.scss',
    shadow: true,
})
export class KupRadio {
    /**
     * References the root HTML element of the component (<kup-radio>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    /**
     * The value of the component.
     * @default ""
     */
    @State() value: string = '';

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Number of columns. When null, radio fields will be displayed inline.
     * @default null
     */
    @Prop() columns: number = null;
    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * List of elements.
     * @default null
     */
    @Prop() data: KupRadioData[] = null;
    /**
     * Defaults at false. When set to true, the component is disabled.
     * @default false
     */
    @Prop() disabled: boolean = false;
    /**
     * Defaults at false. When set to true, the label will be on the left of the component.
     * @default false
     */
    @Prop() leadingLabel: boolean = false;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    /**
     * Triggered when the input element loses focus.
     */
    @Event({
        eventName: 'kup-radio-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupEventPayload>;
    /**
     * Triggered when the input element's value changes.
     */
    @Event({
        eventName: 'kup-radio-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupRadioChangeEventPayload>;
    /**
     * Triggered when the input element gets focused.
     */
    @Event({
        eventName: 'kup-radio-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupEventPayload>;

    onKupBlur() {
        this.kupBlur.emit({
            comp: this,
            id: this.rootElement.id,
        });
    }

    onKupChange(i: number) {
        this.value = this.data[i].value;
        for (let index = 0; index < this.data.length; index++) {
            const radio: KupRadioData = this.data[index];
            if (index === i) {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
        }
        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupFocus() {
        this.kupFocus.emit({
            comp: this,
            id: this.rootElement.id,
        });
    }

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupRadioProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupRadioProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

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
        if (!this.data || this.data.length === 0) {
            return;
        }

        const hasColumns: boolean = !!this.columns;
        const radioList: Array<VNode> = [];

        for (let i = 0; i < this.data.length; i++) {
            const data: KupRadioData = this.data[i];
            const classObj: GenericObject = {
                radio: true,
                'radio--checked': data.checked ? true : false,
                'radio--disabled': this.disabled ? true : false,
            };
            const radioEl: VNode = (
                <div
                    class={`form-field ${
                        this.leadingLabel ? ' form-field--align-end' : ''
                    }`}
                >
                    <div class={classObj}>
                        <input
                            class="radio__native-control"
                            type="radio"
                            name="radio-element"
                            value={data.value}
                            checked={data.checked}
                            disabled={this.disabled}
                            onBlur={() => this.onKupBlur()}
                            onChange={() => this.onKupChange(i)}
                            onFocus={() => this.onKupFocus()}
                        ></input>
                        <div class="radio__background">
                            <div class="radio__outer-circle"></div>
                            <div class="radio__inner-circle"></div>
                        </div>
                    </div>
                    <label
                        htmlFor={'radio-element'}
                        onClick={() => this.onKupChange(i)}
                    >
                        {data.label ? data.label : ''}
                    </label>
                </div>
            );
            radioList.push(radioEl);
        }

        const hostStyle: GenericObject = {
            '--grid-columns': hasColumns ? `repeat(${this.columns}, 1fr)` : '',
        };
        const classObj: GenericObject = {
            'radio-wrapper': true,
            'radio-wrapper--grid': hasColumns ? true : false,
        };

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host style={hostStyle}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div class={classObj}>{radioList}</div>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
