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
import { FButtonProps } from '../../f-components/f-button/f-button-declarations';
import {
    KupButtonListClickEventPayload,
    KupButtonListProps,
} from './kup-button-list-declarations';
import { TreeNode } from '../kup-tree/kup-tree-declarations';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';

@Component({
    tag: 'kup-button-list',
    styleUrl: 'kup-button-list.scss',
    shadow: true,
})
export class KupButtonList {
    /**
     * References the root HTML element of the component (<kup-button-list>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    /**
     * The id of the selected button.
     * @default ""
     */
    @State() selected: string = '';

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/
    /**
     * Number of columns for draw sub-components.
     */
    @Prop() columns: number = 0;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the sub-components.
     */
    @Prop() data: TreeNode[] = [];
    /**
     * Default at false. When set to true, the sub-components are disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * If enabled, highlights the selected button
     */
    @Prop() showSelection: boolean = true;
    /**
     * Defines the style of the buttons. Available styles are "flat" and "outlined", "raised" is the default.
     * If set, will be valid for all sub-components.
     */
    @Prop({ reflect: true }) styling: string = '';

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

    @Event({
        eventName: 'kup-button-list-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupButtonListClickEventPayload>;

    onKupClick(index: string, subIndex: string) {
        this.selected = index;
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            index: index,
            subIndex: subIndex,
            obj: this.getObjForEvent(index, subIndex),
        });
    }

    onDropDownItemClick(e: CustomEvent, index: string) {
        this.selected = index;
        this.onKupClick(index, e.detail.value);
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
        let props: GenericObject = {};
        if (descriptions) {
            props = KupButtonListProps;
        } else {
            for (const key in KupButtonListProps) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        KupButtonListProps,
                        key
                    )
                ) {
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

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    /**
     * Set the events of the component and instantiates Material Design.
     */
    private setEvents(): void {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const fs: NodeListOf<HTMLElement> =
                root.querySelectorAll('.f-button--wrapper');
            if (fs != null) {
                for (let i = 0; i < fs.length; i++) {
                    let f: HTMLElement = fs[i];
                    const buttonEl: HTMLButtonElement =
                        f.querySelector('button');
                    if (buttonEl) {
                        buttonEl.onclick = () => this.onKupClick(f.id, '-1');
                    }
                }
            }
        }
    }

    private renderButton(node: TreeNode, index: number) {
        if (node == null) {
            let message = 'Empty data button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        let data: GenericObject = this.prepareDataFromTreeNode(node, index);
        if (!data.label && !data.icon) {
            let message = 'Empty button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        let props: FButtonProps = {
            checked: data.checked,
            disabled: data.disabled,
            fullHeight: data.fullHeight,
            fullWidth: data.fullWidth,
            icon: data.icon,
            iconOff: data.iconOff,
            id: data.id,
            label: data.label,
            large: data.large,
            shaped: data.shaped,
            styling: data.styling,
            toggable: data.toggable,
            trailingIcon: data.trailingIcon,
            title: data.title,
            wrapperClass: this.rootElement.className + ' ' + data.wrapperClass,
        };
        return <FButton {...props} />;
    }

    private renderDropdownButton(node: TreeNode, index: number) {
        if (node == null) {
            let message = 'Empty data dropdown button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        let data: GenericObject = this.prepareDataFromTreeNode(node, index);
        if (!data.label && !data.icon && !node?.data.dropdownOnly) {
            let message = 'Empty dropdown button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        data.data = {
            'kup-list': {
                data: this.getKupListDataForChildren(node.children),
                showIcons: true,
            },
        };
        return (
            <kup-dropdown-button
                class={this.rootElement.className + ' ' + data.wrapperClass}
                {...data}
                onkup-dropdownbutton-click={() =>
                    this.onKupClick(index.toString(), '-1')
                }
                onkup-dropdownbutton-itemclick={(e) =>
                    this.onDropDownItemClick(e, index.toString())
                }
            />
        );
    }

    private prepareDataFromTreeNode(
        node: TreeNode,
        index: number
    ): GenericObject {
        let data: GenericObject = node.data != null ? { ...node.data } : {};

        if (this.customStyle != null && this.customStyle.trim() != '') {
            data.customStyle = this.customStyle;
        }
        if (this.disabled == true || node.disabled == true) {
            data.disabled = true;
        }
        if (this.styling != null && this.styling.trim() != '') {
            data.styling = this.styling;
        }
        if (data.icon == null) {
            data.icon = node.icon;
        }
        if (data.label == null) {
            data.label = node.value;
        }
        data.fullHeight = this.rootElement.classList.contains('kup-full-height')
            ? true
            : false;
        data.fullWidth = this.rootElement.classList.contains('kup-full-width')
            ? true
            : false;
        data.id = index.toString();
        data.large = this.rootElement.classList.contains('kup-large')
            ? true
            : false;
        data.shaped = this.rootElement.classList.contains('kup-shaped')
            ? true
            : false;
        if (!data.wrapperClass) {
            data.wrapperClass = '';
        }
        if (this.selected == data.id) {
            data.wrapperClass = data.wrapperClass + ' selected';
        }

        return data;
    }

    private getKupListDataForChildren(
        children: TreeNode[]
    ): ComponentListElement[] {
        let ris: ComponentListElement[] = [];

        for (let i = 0; i < children.length; i++) {
            let tn: TreeNode = children[i];
            ris.push({ text: tn.value, icon: tn.icon, value: i.toString() });
        }
        return ris;
    }

    private getObjForEvent(index: string, subIndex: string) {
        let indexInt: number = Number(index);
        let subIndexInt: number = -1;
        if (subIndex != null && subIndex.trim() != '') {
            subIndexInt = Number(subIndex);
        }

        let tn: TreeNode = this.data[indexInt];
        if (subIndexInt != -1) {
            return tn.children[subIndexInt].obj;
        }
        return tn.obj;
    }

    private renderButtons() {
        if (this.data == null || this.data.length < 1) {
            return null;
        }
        let columns = [];
        for (let i = 0; i < this.data.length; i++) {
            let node: TreeNode = this.data[i];
            let b;
            if (node.children != null && node.children.length > 0) {
                b = this.renderDropdownButton(node, i);
            } else {
                b = this.renderButton(node, i);
            }
            if (b == null) {
                continue;
            }
            columns.push(b);
        }
        return columns;
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
        this.setEvents();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let buttons = this.renderButtons();
        let nrOfColumns = this.columns;
        if (this.data != null && this.data.length > 0 && nrOfColumns <= 0) {
            nrOfColumns = this.data.length;
        }

        let hostStyle = {
            '--grid-columns': `repeat(${nrOfColumns}, auto)`,
        };

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        const classObj: Record<string, boolean> = {
            'button-list--container': true,
            'show-selection':
                this.showSelection && this.selected ? true : false,
        };

        return (
            <Host style={hostStyle}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div class={classObj}>{buttons}</div>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
