import {
    Component,
    Element,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
    State,
    VNode,
} from '@stencil/core';

import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import { DropHandlers, setKetchupDroppable } from '../../utils/drag-and-drop';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    Column,
    KupDataTableColumnDragType,
    KupDataTableRowDragType,
    Row,
} from '../kup-data-table/kup-data-table-declarations';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import { FButtonStyling } from '../../f-components/f-button/f-button-declarations';
import { FImage } from '../../f-components/f-image/f-image';
import {
    KupMagicBoxProps,
    MagicBoxDisplay,
    MagicBoxData,
} from './kup-magic-box-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import { DialogElement } from '../../utils/kup-dialog/kup-dialog-declarations';
import { KupLanguageGeneric } from '../../utils/kup-language/kup-language-declarations';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-magic-box',
    styleUrl: 'kup-magic-box.scss',
    shadow: true,
})
export class KupMagicBox {
    /**
     * References the root HTML element of the component (<kup-magic-box>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    /**
     * Data will be displayed using this component.
     * @default MagicBoxDisplay.DATATABLE
     */
    @State() display: MagicBoxDisplay = MagicBoxDisplay.DATATABLE;

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
     * Sets the data that will be used to display different components.
     * @default null
     */
    @Prop() data: MagicBoxData = null;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    /**
     * Element which enables the drag on move feature.
     */
    private dragHandler: HTMLElement = null;

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
        return getProps(this, KupMagicBoxProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupMagicBoxProps, props);
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
     * Sets the props of the combobox used to switch view.
     * @returns {GenericObject} Combobox props.
     */
    private comboboxProps(): GenericObject {
        const listData: ComponentListElement[] = [];
        for (const key in MagicBoxDisplay) {
            if (Object.prototype.hasOwnProperty.call(MagicBoxDisplay, key)) {
                listData.push({
                    text: MagicBoxDisplay[key],
                    value: MagicBoxDisplay[key],
                    selected: false,
                    isSeparator: false,
                });
            }
        }
        return {
            data: {
                'kup-list': {
                    data: listData,
                    id: 'kup-debug-theme-changer-list',
                },
                'kup-text-field': {
                    emitSubmitEventOnEnter: false,
                    inputType: 'text',
                    label: this.kupManager.language.translate(
                        KupLanguageGeneric.VIEW_AS
                    ),
                },
            },
            id: 'comp-switcher',
            initialValue: this.display,
            isSelect: true,
            onKupComboboxItemClick: (e: CustomEvent) => {
                this.display = e.detail.value;
            },
        };
    }
    /**
     * Sets the content window.
     * @returns {VNode[]} Virtual nodes of the content window.
     */
    private setContent(): VNode[] {
        const hasColumns: boolean = !!(
            this.data &&
            this.data.columns &&
            this.data.columns.length > 0
        );
        const content: VNode[] = [];
        if (!hasColumns) {
            content.push(
                <div class="empty">
                    <FImage sizeY="100px" resource="move_to_inbox" />
                    <div class="empty-text">
                        {this.kupManager.language.translate(
                            KupLanguageGeneric.DROP_YOUR_DATA
                        )}
                    </div>
                </div>
            );
        } else {
            const props: GenericObject = {};
            switch (this.display) {
                case MagicBoxDisplay.BOX:
                    props['data'] = this.data;
                    content.push(<kup-box {...props}></kup-box>);
                    break;
                case MagicBoxDisplay.CHART:
                case MagicBoxDisplay.ECHART:
                    props['data'] = this.data;
                    props['series'] = [];
                    for (
                        let index = 0;
                        index < this.data.columns.length;
                        index++
                    ) {
                        const col: Column = this.data.columns[index];
                        if (
                            col.obj &&
                            this.kupManager.objects.isNumber(col.obj)
                        ) {
                            props['series'].push({
                                code: col.name,
                                decode: col.title,
                            });
                        } else {
                            props['axis'] = col.name;
                        }
                    }
                    if (props['series'].length === 0) {
                        this.kupManager.debug.logMessage(
                            this,
                            'Not enough numerical columns to display a chart!',
                            KupDebugCategory.WARNING
                        );
                    }
                    if (!props['axis']) {
                        this.kupManager.debug.logMessage(
                            this,
                            'No axis for the chart!',
                            KupDebugCategory.WARNING
                        );
                    }
                    if (this.display === MagicBoxDisplay.CHART) {
                        content.push(<kup-chart {...props}></kup-chart>);
                    } else {
                        //Echart series broken?
                        props['series'] = null;
                        content.push(<kup-echart {...props}></kup-echart>);
                    }
                    break;
                case MagicBoxDisplay.DATATABLE:
                    props['data'] = this.data;
                    content.push(<kup-data-table {...props}></kup-data-table>);
                    break;
                case MagicBoxDisplay.JSON:
                    props['data'] = this.data;
                    content.push(
                        <pre class="json">
                            {JSON.stringify(this.data, null, 2)}
                        </pre>
                    );
                    break;
                default:
                    this.kupManager.debug.logMessage(
                        this,
                        'Display mode not supported (' + this.display + ')!',
                        KupDebugCategory.ERROR
                    );
                    return;
            }
        }
        return content;
    }
    /**
     * When a kup-drop event is received, the data will be updated.
     * @param {CustomEvent} e - kup-drop event.
     */
    private updateData(e: CustomEvent): void {
        {
            const data: MagicBoxData = { ...this.data };
            const column: Column =
                e.detail.sourceElement && e.detail.sourceElement.column
                    ? e.detail.sourceElement.column
                    : null;
            const row: Row =
                e.detail.sourceElement && e.detail.sourceElement.row
                    ? e.detail.sourceElement.row
                    : null;
            if (column && column.name) {
                if (!data.columns) {
                    data.columns = [column];
                } else {
                    const columnExists: Column = this.data.columns.find(
                        (x) => x.name === column.name
                    );
                    if (!columnExists) {
                        data.columns.push(column);
                    }
                }
            } else {
                this.kupManager.debug.logMessage(
                    this,
                    'Invalid column received.',
                    KupDebugCategory.WARNING
                );
            }
            if (row) {
                if (!data.rows) {
                    data.rows = [row];
                } else {
                    data.rows.push(row);
                }
            }
            this.data = data;
        }
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.rootElement.addEventListener('kup-drop', (e: CustomEvent) =>
            this.updateData(e)
        );
        this.dragHandler =
            this.rootElement.shadowRoot.querySelector('#drag-handle');
        this.kupManager.dialog.register(
            this.rootElement as DialogElement,
            this.dragHandler
        );
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        const handlers: DropHandlers = {
            // Had to define leave and over, otherwise drop wasn't working.
            onDragLeave: () => {},
            onDragOver: () => {
                return true;
            },
            onDrop: () => {
                return KupDataTableRowDragType;
            },
        };

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div
                        class="magic-box-wrapper"
                        {...setKetchupDroppable(
                            handlers,
                            [
                                KupDataTableRowDragType,
                                KupDataTableColumnDragType,
                            ],
                            this.rootElement,
                            {
                                row: null,
                                cell: null,
                                column: null,
                                id: this.rootElement.id,
                            }
                        )}
                    >
                        <div class="actions" id="drag-handle">
                            <kup-combobox {...this.comboboxProps()} />
                            <kup-button
                                styling={FButtonStyling.FLAT}
                                icon="delete"
                                label="Reset"
                                onkup-button-click={() => {
                                    this.data = null;
                                }}
                            ></kup-button>
                            <kup-button
                                id="close-dialog"
                                customStyle={`:host{${KupThemeColorValues.PRIMARY}: var(${KupThemeColorValues.TITLE});}`}
                                icon="clear"
                                onkup-button-click={() => {
                                    this.kupManager.hideMagicBox();
                                }}
                            ></kup-button>
                        </div>
                        <div class="content">{this.setContent()}</div>
                    </div>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.dialog.unregister([this.rootElement as DialogElement]);
        this.kupManager.language.unregister(this);
        this.kupManager.theme.unregister(this);
    }
}
