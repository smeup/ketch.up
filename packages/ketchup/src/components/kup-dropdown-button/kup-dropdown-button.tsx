import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Listen,
    Method,
    Prop,
    State,
    VNode,
} from '@stencil/core';

import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    consistencyCheck,
    ItemsDisplayMode,
} from '../kup-list/kup-list-declarations';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionElement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupDropdownButtonEventPayload,
    KupDropdownButtonProps,
} from './kup-dropdown-button-declarations';
import { FButtonStyling } from '../../f-components/f-button/f-button-declarations';
import { FButton } from '../../f-components/f-button/f-button';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-dropdown-button',
    styleUrl: 'kup-dropdown-button.scss',
    shadow: true,
})
export class KupDropdownButton {
    /**
     * References the root HTML element of the component (<kup-button>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    @State() value: string = '';

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the sub-components.
     * @default null
     */
    @Prop() data: Object = null;
    /**
     * Defaults at false. When set to true, the component is disabled.
     * @default false
     */
    @Prop() disabled: boolean = false;
    /**
     * Sets how to show the selected item value. Suported values: "code", "description", "both".
     * @default ItemsDisplayMode.DESCRIPTION
     */
    @Prop() displayMode: ItemsDisplayMode = ItemsDisplayMode.DESCRIPTION;
    /**
     * Default value is false. When set to true, the arrow dropdown button is the only button displayed.
     * @default false
     */
    @Prop() dropdownOnly: boolean = false;
    /**
     * Defaults at null. When set, the button will show this icon.
     * @default icon
     */
    @Prop() icon: string = null;
    /**
     * Sets the initial value of the component.
     * @default ""
     */
    @Prop() initialValue: string = '';
    /**
     * Defaults at null. When set, the button will show this text.
     * @default ""
     */
    @Prop() label: string = null;
    /**
     * Sets how to return the selected item value. Suported values: "code", "description", "both".
     * @default ItemsDisplayMode.CODE
     */
    @Prop() selectMode: ItemsDisplayMode = ItemsDisplayMode.CODE;
    /**
     * Defines the style of the button. Styles available: "flat", "outlined" and "raised" which is also the default.
     * @default FButtonStyling.RAISED
     */
    @Prop() styling: FButtonStyling = FButtonStyling.RAISED;
    /**
     * Defaults at null. When set, the icon will be shown after the text.
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
    /**
     * Primary button element.
     */
    private buttonEl: HTMLButtonElement = null;
    /**
     * Dropdown button element.
     */
    private dropdownEl: HTMLButtonElement = null;
    /**
     * List element (dropdown menu).
     */
    private listEl: Partial<HTMLKupListElement> = null;
    /**
     * List anchor point.
     */
    private wrapperEl: HTMLElement = null;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    /**
     * Triggered when the primary button loses focus.
     */
    @Event({
        eventName: 'kup-dropdownbutton-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupDropdownButtonEventPayload>;
    /**
     * Triggered when the primary button is clicked.
     */
    @Event({
        eventName: 'kup-dropdownbutton-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupDropdownButtonEventPayload>;
    /**
     * Triggered when the primary button is focused.
     */
    @Event({
        eventName: 'kup-dropdownbutton-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupDropdownButtonEventPayload>;
    /**
     * Triggered when a list item changes.
     */
    @Event({
        eventName: 'kup-dropdownbutton-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupDropdownButtonEventPayload>;
    /**
     * Triggered when a list item is clicked.
     */
    @Event({
        eventName: 'kup-dropdownbutton-itemclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupItemClick: EventEmitter<KupDropdownButtonEventPayload>;
    /**
     * Handles the navigation of the dropdown menu with the keyboard.
     */
    @Listen('keyup', { target: 'document' })
    listenKeyup(e: KeyboardEvent) {
        if (this.isListOpened()) {
            if (e.key === 'Escape') {
                this.closeList();
            }
            if (e.key === 'Enter') {
                this.closeList();
            }
            if (e.key === 'ArrowDown') {
                this.listEl.arrowDown = true;
            }
            if (e.key === 'ArrowUp') {
                this.listEl.arrowUp = true;
            }
        }
    }

    onKupBlur() {
        this.closeList();
        this.kupBlur.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupClick() {
        this.closeList();
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

    onDropDownClick() {
        if (this.isListOpened()) {
            this.closeList();
        } else {
            this.openList();
        }
    }

    onKupItemClick(e: CustomEvent) {
        this.consistencyCheck(e);
        this.closeList();

        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });

        this.kupItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * Returns the component's internal value.
     */
    @Method()
    async getValue(): Promise<string> {
        return this.value;
    }
    /**
     * Sets the internal value of the component.
     */
    @Method()
    async setValue(value: string): Promise<void> {
        this.value = value;
    }
    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupDropdownButtonProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupDropdownButtonProps, props);
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
     * Checks whether the dropdown menu is opened or not.
     * @returns {boolean} True when the list is opened.
     */
    private isListOpened(): boolean {
        if (this.listEl == null) {
            return false;
        }
        return this.listEl.menuVisible == true;
    }
    /**
     * Opens the dropdown menu.
     */
    private openList(): void {
        const buttonWidth: number =
            (this.buttonEl ? this.buttonEl.clientWidth : 0) +
            this.dropdownEl.clientWidth;
        this.buttonEl?.classList.add('toggled');
        this.dropdownEl.classList.add('toggled');
        this.listEl.menuVisible = true;
        this.kupManager.dynamicPosition.start(
            this.listEl as KupDynamicPositionElement
        );
        let elStyle: any = this.listEl.style;
        elStyle.height = 'auto';
        elStyle.minWidth = buttonWidth + 'px';
    }
    /**
     * Closes the dropdown menu.
     */
    private closeList(): void {
        this.buttonEl?.classList.remove('toggled');
        this.dropdownEl.classList.remove('toggled');
        this.listEl.menuVisible = false;
        this.kupManager.dynamicPosition.stop(
            this.listEl as KupDynamicPositionElement
        );
    }
    /**
     * Checks the consistency of the list.
     */
    private consistencyCheck(e?: CustomEvent, valueIn?: string): void {
        const ret = consistencyCheck(
            valueIn,
            this.data['kup-list'],
            this.listEl,
            this.selectMode,
            this.displayMode,
            e
        );
        this.value = ret.value;
    }
    /**
     * Set the events of the component and instantiates Material Design.
     */
    private setEvents(): void {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const fPrimary: HTMLElement = root.querySelector(
                '.dropdown-button__primary-action'
            );
            if (fPrimary) {
                const buttonEl: HTMLButtonElement =
                    fPrimary.querySelector('button');
                if (buttonEl) {
                    buttonEl.onblur = () => this.onKupBlur();
                    buttonEl.onclick = () => this.onKupClick();
                    buttonEl.onfocus = () => this.onKupFocus();
                }
            }
            const fDropdown: HTMLElement = root.querySelector(
                '.dropdown-button__dropdown-action'
            );
            if (fDropdown) {
                const buttonEl: HTMLButtonElement =
                    fDropdown.querySelector('button');
                if (buttonEl) {
                    buttonEl.onclick = () => this.onDropDownClick();
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
        this.value = this.initialValue;
        if (!this.data) {
            this.data = {
                'kup-list': {},
            };
        }
    }

    componentDidLoad() {
        this.consistencyCheck(undefined, this.value);
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root && (!this.buttonEl || !this.dropdownEl)) {
            this.buttonEl = root.querySelector(
                '.dropdown-button__primary-action'
            );
            this.dropdownEl = root.querySelector(
                '.dropdown-button__dropdown-action'
            );
        }
        this.setEvents();
        this.kupManager.dynamicPosition.register(
            this.listEl as KupDynamicPositionElement,
            this.wrapperEl
        );
        this.kupManager.debug.logRender(this, true);
    }

    private renderButtons() {
        const buttons: VNode[] = [];
        if (!this.dropdownOnly) {
            buttons.push(
                <FButton
                    disabled={this.disabled ? true : false}
                    icon={this.icon ? this.icon : null}
                    label={this.label ? this.label : ' '}
                    styling={
                        this.styling ? this.styling : FButtonStyling.RAISED
                    }
                    trailingIcon={this.trailingIcon ? true : false}
                    wrapperClass="dropdown-button__primary-action"
                />
            );
        }
        buttons.push(
            <FButton
                disabled={this.disabled ? true : false}
                icon={
                    this.dropdownOnly && this.icon && this.icon !== ''
                        ? this.icon
                        : 'arrow_drop_down'
                }
                label=" "
                styling={this.styling ? this.styling : FButtonStyling.RAISED}
                wrapperClass={
                    'dropdown-button__dropdown-action' +
                    (this.dropdownOnly ? ' dropdown-only' : '')
                }
            />
        );
        return buttons;
    }

    render() {
        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host onBlur={() => this.onKupBlur()}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div
                    id="kup-component"
                    ref={(el) => (this.wrapperEl = el as any)}
                >
                    <div class="dropdown-button--wrapper">
                        {this.renderButtons()}
                    </div>
                    <kup-list
                        {...this.data['kup-list']}
                        displayMode={this.displayMode}
                        isMenu={true}
                        onkup-list-click={(e) => this.onKupItemClick(e)}
                        id={this.rootElement.id + '_list'}
                        ref={(el) => (this.listEl = el as any)}
                    ></kup-list>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
        const dynamicPositionElements: NodeListOf<KupDynamicPositionElement> =
            this.rootElement.shadowRoot.querySelectorAll(
                '[' + kupDynamicPositionAttribute + ']'
            );
        if (dynamicPositionElements.length > 0) {
            this.kupManager.dynamicPosition.unregister(
                Array.prototype.slice.call(dynamicPositionElements)
            );
        }
    }
}
