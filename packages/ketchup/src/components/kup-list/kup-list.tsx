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
    Watch,
} from '@stencil/core';

import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import {
    ComponentListElement,
    KupListEventPayload,
    KupListProps,
} from './kup-list-declarations';
import { KupRadio } from '../kup-radio/kup-radio';
import { KupCheckbox } from '../kup-checkbox/kup-checkbox';
import { ItemsDisplayMode } from './kup-list-declarations';
import { getValueOfItemByDisplayMode } from './kup-list-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { GenericObject, KupComponent } from '../../types/GenericTypes';
import { FImage } from '../../f-components/f-image/f-image';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-list',
    styleUrl: 'kup-list.scss',
    shadow: true,
})
export class KupList {
    @Element() rootElement: HTMLElement;

    /**
     * Used to navigate the list when it's bound to a text field, i.e.: autocomplete.
     */
    @Prop({ mutable: true }) arrowDown: boolean = false;
    @Prop({ mutable: true }) arrowUp: boolean = false;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * The data of the list.
     */
    @Prop({ mutable: true }) data: ComponentListElement[] = [];
    /**
     * Selects how the items must display their label and how they can be filtered for.
     */
    @Prop() displayMode: ItemsDisplayMode = ItemsDisplayMode.DESCRIPTION;
    /**
     * Keeps string for filtering elements when filter mode is active
     */
    @Prop({ mutable: true }) filter: string = '';
    /**
     * Hides rows' text, ideally to display a list of icons only.
     */
    @Prop() hideText: boolean = false;
    /**
     * Defines whether the list is a menu or not.
     */
    @Prop() isMenu: boolean = false;
    /**
     * Sets the status of the menu, when false it's hidden otherwise it's visible.
     */
    @Prop() menuVisible: boolean = false;
    /**
     * Defines the type of selection. Values accepted: listbox, radiogroup or group.
     */
    @Prop({ mutable: true }) roleType?: string = KupList.ROLE_LISTBOX;
    /**
     * Defines whether items are selectable or not.
     */
    @Prop() selectable: boolean = true;
    /**
     * Displays the icons associated to each row when set to true.
     */
    @Prop() showIcons: boolean = false;
    /**
     * The list elements descriptions will be arranged in two lines.
     */
    @Prop() twoLine: boolean = false;

    //---- Internal state ----

    static ROLE_LISTBOX: string = 'listbox';
    static ROLE_RADIOGROUP: string = 'radiogroup';
    static ROLE_CHECKBOX: string = 'group';

    private filteredItems: ComponentListElement[] = [];
    private listComponent: MDCList = null;
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    private radios: KupRadio[] = [];
    private checkboxes: KupCheckbox[] = [];

    private focIndex: number = -1;

    /**
     * Events.
     */

    @Event({
        eventName: 'kup-list-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupListEventPayload>;

    @Event({
        eventName: 'kup-list-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupListEventPayload>;

    @Event({
        eventName: 'kup-list-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupListEventPayload>;

    @Event({
        eventName: 'kup-list-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupListEventPayload>;

    @Event({
        eventName: 'kup-list-input',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<KupListEventPayload>;

    @Watch('filter')
    watchFilter() {
        this.focIndex = -1;

        this.filteredItems = [];
        let index = 0;
        this.data.map((item) => {
            this.setUnselected(item, index++);
        });
        this.data = [...this.data];
    }

    @Watch('arrowDown')
    watchArrowDown() {
        if (this.arrowDown == true) {
            if (this.focIndex < this.listComponent.listElements.length - 1) {
                if (this.focIndex == -1) {
                    let idx = this.listComponent
                        .getDefaultFoundation()
                        .focusFirstElement();
                    this.focIndex = idx;
                } else {
                    let idx = this.listComponent
                        .getDefaultFoundation()
                        .focusNextElement(this.focIndex);
                    this.focIndex = idx;
                }
                //this.focIndex++;
            }
            this.arrowDown = false;
        }
    }

    @Watch('arrowUp')
    watchArrowUp() {
        if (this.arrowUp == true) {
            if (this.focIndex > 0) {
                this.listComponent
                    .getDefaultFoundation()
                    .focusPrevElement(this.focIndex--);
            }
            this.arrowUp = false;
        }
    }

    //---- Methods ----

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupListProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupListProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    onKupBlur(e: CustomEvent, item: ComponentListElement) {
        this.kupBlur.emit({
            comp: this,
            id: this.rootElement.id,
            selected: item,
            el: e.target,
        });
    }

    onKupChange(e: CustomEvent, item: ComponentListElement) {
        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            selected: item,
            el: e.target,
        });
    }

    onKupClick(e: MouseEvent, item: ComponentListElement, index: number) {
        let el: HTMLLIElement = null;
        if ((e.target as HTMLElement).tagName === 'LI') {
            el = e.target as HTMLLIElement;
        } else {
            el = (e.target as HTMLElement).closest('li');
        }
        el.blur();
        this.onKupClickInternalUse(e.target, item, index);
    }

    onKupClickInternalUse(
        target: EventTarget,
        item: ComponentListElement,
        index: number
    ) {
        if (this.isMultiSelection()) {
            if (item.selected == true) {
                this.setUnselected(item, index);
            } else {
                this.setSelected(item, index);
            }
        }
        if (this.isSingleSelection()) {
            if (item.selected != true) {
                let index1 = 0;
                this.filteredItems.map((item1) => {
                    this.setUnselected(item1, index1++);
                });
                this.setSelected(item, index);
            }
        }

        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            selected: item,
            el: target,
        });
    }

    onKupFocus(e: CustomEvent, item: ComponentListElement) {
        this.kupFocus.emit({
            comp: this,
            id: this.rootElement.id,
            selected: item,
            el: e.target,
        });
    }

    onKupInput(e: KeyboardEvent, item: ComponentListElement, index: number) {
        if (e.key == 'Enter') {
            this.onKupClickInternalUse(e.target, item, index);
        } else {
            this.kupInput.emit({
                comp: this,
                id: this.rootElement.id,
                selected: item,
                el: e.target,
            });
        }
    }

    @Method()
    async resetFilter(newFilter: string) {
        this.filter = newFilter;
    }

    renderSeparator() {
        return <li role="separator" class="mdc-list-divider"></li>;
    }

    renderListItem(item: ComponentListElement, index: number) {
        let rippleEl: HTMLElement = undefined;
        this.filteredItems[index] = item;

        if (this.selectable) {
            rippleEl = <span class="mdc-list-item__ripple"></span>;
        }

        if (item.selected != true) {
            item.selected = false;
        }

        let imageTag: HTMLElement = undefined;
        if (
            this.showIcons == true &&
            item.icon != null &&
            item.icon.trim() != ''
        ) {
            imageTag = this.getIconTag(item.icon);
        }
        let primaryTextTag = [
            getValueOfItemByDisplayMode(item, this.displayMode, ' - '),
        ];

        let secTextTag = [];
        if (item.secondaryText && item.secondaryText != '') {
            primaryTextTag = [
                <span class="mdc-list-item__primary-text">{item.text}</span>,
            ];
            secTextTag = [
                <span class="mdc-list-item__secondary-text">
                    {item.secondaryText}
                </span>,
            ];
        }
        let classAttr = 'mdc-list-item';
        let tabIndexAttr = item.selected == true ? '0' : '-1';
        if (item.selected == true && this.isListBoxRule()) {
            classAttr += ' mdc-list-item--selected';
        }
        let roleAttr = 'option';

        let ariaCheckedAttr: string = null;
        let ariaSelectedAttr: string = item.selected == true ? 'true' : 'false';
        if (this.selectable != true) {
            ariaSelectedAttr = null;
        }
        let innerSpanTag = [
            imageTag,
            <span class="mdc-list-item__text">
                {primaryTextTag}
                {secTextTag}
            </span>,
        ];
        if (this.isRadioButtonRule()) {
            roleAttr = 'radio';
            ariaCheckedAttr = item.selected == true ? 'true' : 'false';
            let dataTmp = [
                {
                    value: item.value,
                    label: '',
                    checked: item.selected == true ? true : false,
                },
            ];
            let trickForMDC = {
                display: 'none',
            };
            innerSpanTag = [
                <span class="mdc-list-item__graphic">
                    <input type="radio" style={trickForMDC} />
                    <kup-radio
                        data={dataTmp}
                        id={this.rootElement.id + '_' + index}
                        ref={(el) => (this.radios[index] = el as any)}
                    ></kup-radio>
                </span>,
                imageTag,
                <label
                    class="mdc-list-item__text"
                    htmlFor={this.rootElement.id + '_' + index}
                >
                    {primaryTextTag}
                    {secTextTag}
                </label>,
            ];
        } else if (this.isCheckBoxRule()) {
            roleAttr = 'checkbox';
            ariaCheckedAttr = item.selected == true ? 'true' : 'false';
            let checkedAttr: boolean = item.selected == true ? true : false;

            let trickForMDC = {
                display: 'none',
            };

            innerSpanTag = [
                <span class="mdc-list-item__graphic">
                    <input type="checkbox" style={trickForMDC} />
                    <kup-checkbox
                        class="mdc-checkbox"
                        id={this.rootElement.id + '_' + index}
                        checked={checkedAttr}
                        ref={(el) => (this.checkboxes[index] = el as any)}
                    ></kup-checkbox>
                </span>,
                imageTag,
                <label
                    class="mdc-list-item__text"
                    htmlFor={this.rootElement.id + '_' + index}
                >
                    {primaryTextTag}
                    {secTextTag}
                </label>,
            ];
        }
        return (
            <li
                class={classAttr}
                role={roleAttr}
                tabindex={tabIndexAttr}
                data-value={item.value}
                aria-selected={ariaSelectedAttr}
                aria-checked={ariaCheckedAttr}
                onFocus={
                    !this.selectable
                        ? (e: any) => e.stopPropagation()
                        : (e: any) => this.onKupFocus(e, item)
                }
                onClick={
                    !this.selectable
                        ? (e: MouseEvent) => e.stopPropagation()
                        : (e: MouseEvent) => this.onKupClick(e, item, index)
                }
                onKeyUp={
                    !this.selectable
                        ? (e: any) => e.stopPropagation()
                        : (e: any) => this.onKupInput(e, item, index)
                }
            >
                {rippleEl}
                {innerSpanTag}
            </li>
        );
    }

    getIconTag(icon: string) {
        const large: boolean = this.rootElement.classList.contains('kup-large');
        const propsFImage = {
            color: `var(${KupThemeColorValues.PRIMARY})`,
            sizeX: large ? '32px' : '24px',
            sizeY: large ? '32px' : '24px',
        };

        return (
            <FImage
                {...propsFImage}
                resource={icon}
                wrapperClass={`mdc-icon-button__icon icon-container material-icons`}
            />
        );
    }

    setUnselected(item: ComponentListElement, index: number) {
        item.selected = false;
        this.sendInfoToSubComponent(index, item);
    }

    setSelected(item: ComponentListElement, index: number) {
        item.selected = true;
        this.sendInfoToSubComponent(index, item);
    }

    sendInfoToSubComponent(index: number, item: ComponentListElement) {
        if (this.isRadioButtonRule()) {
            if (this.radios[index]) {
                let dataTmp = [
                    {
                        value: item.value,
                        label: '',
                        checked: item.selected == true ? true : false,
                    },
                ];
                this.radios[index].data = dataTmp;
            }
        }
        if (this.isCheckBoxRule()) {
            if (this.checkboxes[index]) {
                this.checkboxes[index].checked = item.selected;
            }
        }
    }

    getLiIndexElementForValue(key: string): number {
        let index = -1;
        let i = 0;
        this.filteredItems.forEach((item) => {
            if (item.isSeparator != true) {
                if (item.value == key) {
                    index = i;
                }
            }
            i++;
        });

        return index;
    }

    isSingleSelection(): boolean {
        return this.isRadioButtonRule() || this.isListBoxRule();
    }

    isMultiSelection(): boolean {
        return this.isCheckBoxRule();
    }

    isCheckBoxRule(): boolean {
        return this.roleType == KupList.ROLE_CHECKBOX;
    }

    isRadioButtonRule(): boolean {
        return this.roleType == KupList.ROLE_RADIOGROUP;
    }

    isListBoxRule(): boolean {
        return this.roleType == KupList.ROLE_LISTBOX;
    }

    checkRoleType() {
        if (!this.isCheckBoxRule() && !this.isRadioButtonRule()) {
            this.roleType = KupList.ROLE_LISTBOX;
        }
    }

    itemCompliant(item: ComponentListElement): boolean {
        if (item.isSeparator) {
            return true;
        }
        if (!this.filter) {
            return true;
        }

        if (this.displayMode == ItemsDisplayMode.CODE) {
            return (
                item.value.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
            );
        }
        if (this.displayMode == ItemsDisplayMode.DESCRIPTION) {
            return (
                item.text.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
            );
        }

        return (
            item.value.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ||
            item.text.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
        );
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.listComponent = null;
        // Called once just after the component fully loaded and the first render() occurs.
        const root = this.rootElement.shadowRoot;
        if (root) {
            this.listComponent = MDCList.attachTo(
                root.querySelector('.mdc-list')
            );

            this.listComponent.singleSelection = this.isSingleSelection();

            this.listComponent.listElements.map(
                (listItemEl: any) => new MDCRipple(listItemEl)
            );
        }
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let componentClass: string = 'mdc-list';
        let wrapperClass = undefined;

        if (this.isMenu) {
            wrapperClass = 'kup-menu';

            if (this.menuVisible) {
                wrapperClass += ' visible';
            }
        }

        this.checkRoleType();

        if (this.selectable != true) {
            componentClass += ' mdc-list--non-interactive';
        }

        if (this.twoLine) {
            componentClass += ' mdc-list--two-line';
        }

        if (this.hideText) {
            componentClass += ' text-hidden';
        }

        let roleAttr = this.roleType;

        let ariaMultiSelectable: string = 'false';
        if (this.isMultiSelection()) {
            ariaMultiSelectable = 'true';
        }

        this.filteredItems = [];
        this.radios = [];
        this.checkboxes = [];
        let index = 0;

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" class={wrapperClass}>
                    <ul
                        class={componentClass}
                        role={roleAttr}
                        id={'kup-list_' + this.rootElement.id}
                        aria-multiselectable={ariaMultiSelectable}
                    >
                        {this.data
                            .filter((item) => this.itemCompliant(item))
                            .map((item) =>
                                item.isSeparator
                                    ? this.renderSeparator()
                                    : this.renderListItem(item, index++)
                            )}
                    </ul>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
