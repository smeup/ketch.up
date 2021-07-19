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
} from '@stencil/core';
import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { FButton } from '../../f-components/f-button/f-button';
import {
    FButtonProps,
    FButtonStyling,
} from '../../f-components/f-button/f-button-declarations';
import {
    KupButtonClickEventPayload,
    KupButtonProps,
} from './kup-button-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-button',
    styleUrl: 'kup-button.scss',
    shadow: true,
})
export class KupButton {
    /**
     * References the root HTML element of the component (<kup-button>).
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
     * When set to true, the icon button state will be on.
     * @default false
     */
    @Prop({ mutable: true }) checked: boolean = false;
    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Defaults at false. When set to true, the component is disabled.
     * @default false
     */
    @Prop() disabled: boolean = false;
    /**
     * When set, the button will show this icon.
     * @default null
     */
    @Prop() icon: string = null;
    /**
     * When set, the icon button off state will show this icon. Otherwise, an outlined version of the icon prop will be displayed.
     * @default null
     */
    @Prop() iconOff: string = null;
    /**
     * When set, the button will show this text.
     * @default null
     */
    @Prop() label: string = null;
    /**
     * Defines the style of the button. Styles available: "flat", "outlined" and "raised" which is also the default.
     * @default FButtonStyling.RAISED
     */
    @Prop() styling: FButtonStyling = FButtonStyling.RAISED;
    /**
     * When set to true, the icon button will be toggable on/off.
     * @default false
     */
    @Prop() toggable: boolean = false;
    /**
     * When set, the icon will be shown after the text.
     * @default false
     */
    @Prop() trailingIcon: boolean = false;

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
     * Triggered when the button loses focus.
     */
    @Event({
        eventName: 'kup-button-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupButtonClickEventPayload>;
    /**
     * Triggered when the button is clicked.
     */
    @Event({
        eventName: 'kup-button-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupButtonClickEventPayload>;
    /**
     * Triggered when the button is focused.
     */
    @Event({
        eventName: 'kup-button-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupButtonClickEventPayload>;

    onKupBlur() {
        this.kupBlur.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupClick() {
        if (!this.label && this.icon) {
            if (this.checked) {
                this.checked = false;
                this.value = 'off';
            } else {
                this.checked = true;
                this.value = 'on';
            }
        } else {
            this.value = 'N/A';
        }
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupFocus() {
        this.kupFocus.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
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
        return getProps(this, KupButtonProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupButtonProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    /**
     * Set the events of the component and instantiates Material Design.
     */
    private setEvents(): void {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const f: HTMLElement = root.querySelector('.f-button--wrapper');
            if (f) {
                const buttonEl: HTMLButtonElement = f.querySelector('button');
                if (buttonEl) {
                    buttonEl.onblur = () => this.onKupBlur();
                    buttonEl.onclick = () => this.onKupClick();
                    buttonEl.onfocus = () => this.onKupFocus();
                }
            }
        }
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
        if (!this.label && this.icon) {
            if (this.checked) {
                this.value = 'on';
            } else {
                this.value = 'off';
            }
        } else {
            this.value = 'N/A';
        }
    }

    componentDidRender() {
        this.setEvents();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let props: FButtonProps = {
            checked: this.checked,
            disabled: this.disabled,
            fullHeight: this.rootElement.classList.contains('kup-full-height')
                ? true
                : false,
            fullWidth: this.rootElement.classList.contains('kup-full-width')
                ? true
                : false,
            icon: this.icon,
            iconOff: this.iconOff,
            label: this.label,
            large: this.rootElement.classList.contains('kup-large')
                ? true
                : false,
            shaped: this.rootElement.classList.contains('kup-shaped')
                ? true
                : false,
            styling: this.styling,
            toggable: this.toggable,
            trailingIcon: this.trailingIcon,
        };

        if (!this.label && !this.icon) {
            let message = 'Empty button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return;
        }
        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <FButton {...props} />
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
