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
} from '@stencil/core';

import {
    KupNavBarData,
    KupNavBarElement,
    KupNavBarMode,
    KupNavBarProps,
    KupNavbarEventPayload,
} from './kup-nav-bar-declarations';

import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionElement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import { KupLanguageGeneric } from '../../utils/kup-language/kup-language-declarations';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-nav-bar',
    styleUrl: 'kup-nav-bar.scss',
    shadow: true,
})
export class KupNavBar {
    /**
     * References the root HTML element of the component (<kup-button>).
     */
    @Element() rootElement: HTMLElement;

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
     * The actual data of the nav bar.
     * @default null
     */
    @Prop() data: KupNavBarData = null;
    /**
     * Defines how the bar will be displayed.
     * @default KupNavBarMode.DEFAULT
     */
    @Prop({ reflect: true }) mode: KupNavBarMode = KupNavBarMode.DEFAULT;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    private optionsButtonEl: any = undefined;
    private optionsListEl: any = undefined;
    private menuButtonEl: any = undefined;
    private menuListEl: any = undefined;
    private textColor: string = 'white';

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    @Listen('click', { target: 'document' })
    listenClick() {
        this.closeList();
    }

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
                this.arrowDownList();
            }
            if (e.key === 'ArrowUp') {
                this.arrowUpList();
            }
        }
    }

    /**
     * Triggered when a button's list item is clicked.
     */
    @Event({
        eventName: 'kup-navbar-menuitemclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarMenuItemClick: EventEmitter<KupNavbarEventPayload>;
    /**
     * Triggered when a button is clicked.
     */
    @Event({
        eventName: 'kup-navbar-optionitemclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarOptionItemClick: EventEmitter<KupNavbarEventPayload>;

    onKupNavbarMenuItemClick(e: CustomEvent) {
        let selectedValue: string = e.detail.selected.value;
        this.closeList();
        this.kupNavbarMenuItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: selectedValue,
        });
    }

    onKupNavbarMenuButtonClick(value: string) {
        let selectedValue: string = value;
        this.kupNavbarMenuItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: selectedValue,
        });
    }

    onKupNavbarOptionItemClick(e: CustomEvent) {
        let selectedValue: string = e.detail.selected.value;
        this.closeList();
        this.kupNavbarOptionItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: selectedValue,
        });
    }

    onKupOptionButtonClick(value: string) {
        let selectedValue: string = value;
        this.kupNavbarOptionItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: selectedValue,
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
        return getProps(this, KupNavBarProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupNavBarProps, props);
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

    arrowDownList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.optionsListEl.arrowDown = true;
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.menuListEl.arrowDown = true;
        }
    }

    arrowUpList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.optionsListEl.arrowUp = true;
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.menuListEl.arrowUp = true;
        }
    }

    openList(listEl): boolean {
        this.closeList();
        if (listEl == null) {
            return false;
        }
        listEl.menuVisible = true;
        this.kupManager.dynamicPosition.start(
            listEl as KupDynamicPositionElement
        );
        let elStyle: any = listEl.style;
        elStyle.height = 'auto';
        return true;
    }

    closeList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.closeThisList(this.optionsListEl);
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.closeThisList(this.menuListEl);
        }
    }

    closeThisList(listEl) {
        if (listEl == null) {
            return;
        }
        listEl.menuVisible = false;
        this.kupManager.dynamicPosition.stop(
            listEl as KupDynamicPositionElement
        );
    }

    isListOpened(): boolean {
        return (
            this.isThisListOpened(this.optionsListEl) ||
            this.isThisListOpened(this.menuListEl)
        );
    }

    isThisListOpened(listEl): boolean {
        if (listEl == null) {
            return false;
        }
        return listEl.menuVisible == true;
    }

    prepMenuList(listData: ComponentListElement[]): HTMLElement {
        this.menuListEl = null;
        if (listData.length == 0) {
            return null;
        }
        let comp: HTMLElement = (
            <kup-list
                data={...listData}
                is-menu
                show-icons
                onkup-list-click={(e) => this.onKupNavbarMenuItemClick(e)}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.menuListEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    getClassNameByComponentMode(mode: string) {
        let value: string = '';

        switch (mode) {
            case KupNavBarMode.DEFAULT: {
                break;
            }
            case KupNavBarMode.SHORT_COLLAPSED: {
                value = 'top-app-bar--short top-app-bar--short-collapsed';
                break;
            }
            default: {
                value = 'top-app-bar--' + mode;
                break;
            }
        }
        return value;
    }

    prepOptionsList(listData: ComponentListElement[]): HTMLElement {
        this.optionsListEl = null;
        if (listData.length == 0) {
            return null;
        }
        let comp: HTMLElement = (
            <kup-list
                data={...listData}
                is-menu
                show-icons
                onkup-list-click={(e) => this.onKupNavbarOptionItemClick(e)}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.optionsListEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    private fetchThemeColors() {
        let color =
            this.kupManager.theme.cssVars[
                KupThemeColorValues.NAV_BAR_BACKGROUND
            ];
        this.textColor = this.kupManager.theme.colorContrast(color);
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
        this.kupManager.theme.register(this);
        if (!this.data) {
            this.data = {
                title: 'Default title',
            };
        }
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
        this.fetchThemeColors();
    }

    componentDidRender() {
        if (this.menuListEl != null) {
            this.kupManager.dynamicPosition.register(
                this.menuListEl,
                this.menuButtonEl
            );
        }
        if (this.optionsListEl != null) {
            this.kupManager.dynamicPosition.register(
                this.optionsListEl,
                this.optionsButtonEl
            );
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let wrapperClass = undefined;

        let visibleButtons: Array<HTMLElement> = [];
        let optionsButtons: ComponentListElement[] = [];
        let menuButtons: ComponentListElement[] = [];

        if (this.data.optionActions != null) {
            for (let i = 0; i < this.data.optionActions.length; i++) {
                let action: KupNavBarElement = this.data.optionActions[i];
                if (action.visible == true) {
                    let button = (
                        <kup-button
                            customStyle={`:host{ ${KupThemeColorValues.PRIMARY}: ${this.textColor}; }`}
                            icon={action.icon}
                            title={action.tooltip}
                            onkup-button-click={() =>
                                this.onKupOptionButtonClick(action.value)
                            }
                        ></kup-button>
                    );
                    visibleButtons.push(button);
                } else {
                    let listItem: ComponentListElement = {
                        text: action.text,
                        value: action.value,
                        icon: action.icon,
                    };
                    optionsButtons.push(listItem);
                }
            }
        }

        if (optionsButtons.length > 0) {
            let button = (
                <kup-button
                    customStyle={`:host{ ${KupThemeColorValues.PRIMARY}: ${this.textColor}; }`}
                    icon="more_vert"
                    title={this.kupManager.language.translate(
                        KupLanguageGeneric.OPTIONS
                    )}
                    onkup-button-click={() => this.openList(this.optionsListEl)}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => (this.optionsButtonEl = el as any)}
                ></kup-button>
            );
            visibleButtons.push(button);
        }

        let menuButton = null;
        if (this.data.menuAction != null) {
            let action = this.data.menuAction;
            menuButton = (
                <kup-button
                    customStyle={`:host{ ${KupThemeColorValues.PRIMARY}: ${this.textColor}; }`}
                    icon={action.icon}
                    title={action.tooltip}
                    onkup-button-click={() =>
                        this.onKupNavbarMenuButtonClick(action.value)
                    }
                ></kup-button>
            );
        } else if (this.data.menuActions != null) {
            for (let i = 0; i < this.data.menuActions.length; i++) {
                let action: KupNavBarElement = this.data.menuActions[i];
                let listItem: ComponentListElement = {
                    text: action.text,
                    value: action.value,
                    icon: action.icon,
                };
                menuButtons.push(listItem);
            }
            menuButton = (
                <kup-button
                    customStyle={`:host{ ${KupThemeColorValues.PRIMARY}: ${this.textColor}; }`}
                    icon="menu"
                    title={this.kupManager.language.translate(
                        KupLanguageGeneric.OPEN_NAVIGATION_MENU
                    )}
                    disabled={menuButtons.length == 0}
                    onkup-button-click={() => this.openList(this.menuListEl)}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => (this.menuButtonEl = el as any)}
                ></kup-button>
            );
        }

        let headerClassName =
            'top-app-bar ' + this.getClassNameByComponentMode(this.mode);
        let titleStyle = { color: this.textColor };

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" class={wrapperClass}>
                    <header class={headerClassName}>
                        <div class="top-app-bar__row">
                            <section class="top-app-bar__section top-app-bar__section--align-start">
                                {menuButton}
                                {this.prepMenuList(menuButtons)}
                                <span
                                    class="top-app-bar__title"
                                    style={titleStyle}
                                >
                                    {this.data.title}
                                </span>
                            </section>
                            <section
                                class="top-app-bar__section top-app-bar__section--align-end"
                                role="toolbar"
                            >
                                {visibleButtons}
                                {this.prepOptionsList(optionsButtons)}
                            </section>
                        </div>
                    </header>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.language.unregister(this);
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
