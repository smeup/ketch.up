import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';

import {
    TooltipData,
    TooltipDetailData,
    TooltipRelatedObject,
    TooltipAction,
    TooltipObject,
    ViewMode,
    TooltipCellOptions,
    KupTooltipProps,
    KupTooltipLoadEventPayload,
    KupTooltipActionCommandClickEventPayload,
    KupTooltipDefaultEventPayload,
    KupTooltipTreeNodeExpandEventPayload,
    KupTooltipTreeNodeButtonClickEventPayload,
    KupTooltipTreeNodeSelectedEventPayload,
    KupTooltipTreeNodeDblClickEventPayload,
    KupTooltipTreeDynamicMassExpansionEventPayload,
} from './kup-tooltip-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { Row } from '../kup-data-table/kup-data-table-declarations';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionElement,
    KupDynamicPositionPlacement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import { GenericObject } from '../../types/GenericTypes';
import { KupLanguageGeneric } from '../../utils/kup-language/kup-language-declarations';
import { CardFamily } from '../kup-card/kup-card-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-tooltip',
    styleUrl: 'kup-tooltip.scss',
    shadow: true,
})
export class KupTooltip {
    @Element() rootElement: HTMLElement;
    @State() visible = false;

    /**
     * Data for cell options
     */
    @Prop({ mutable: true }) cellOptions: TooltipCellOptions;
    /**
     * Data for top section
     */
    @Prop({ mutable: true }) data: TooltipData;
    /**
     * Data for the detail
     */
    @Prop({ mutable: true }) detailData: TooltipDetailData;
    /**
     * Timeout for loadDetail
     */
    @Prop() detailTimeout: number = 800;
    /**
     * Layout used to display the items
     */
    @Prop() layout = '1';
    /**
     * Timeout for tooltip
     */
    @Prop() loadTimeout: number = 1000;
    /**
     * Owner of this tooltip
     */
    @Prop() owner: string = 'not-set';
    /**
     * Container element for tooltip
     */
    @Prop({ mutable: true }) relatedObject: TooltipRelatedObject;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    @Event({
        eventName: 'kup-tooltip-loaddata',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTooltipLoadData: EventEmitter<KupTooltipLoadEventPayload>;

    @Event({
        eventName: 'kup-tooltip-loaddetail',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTooltipLoadDetail: EventEmitter<KupTooltipLoadEventPayload>;

    @Event({
        eventName: 'kup-tooltip-loadcelloptions',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTooltipLoadCellOptions: EventEmitter<KupTooltipLoadEventPayload>;

    @Event({
        eventName: 'kup-tooltip-actioncommandclick',
        composed: true,
        cancelable: true,
        bubbles: true,
    })
    kupActionCommandClick: EventEmitter<KupTooltipActionCommandClickEventPayload>;

    @Event({
        eventName: 'kup-tooltip-defaultactionclick',
        composed: true,
        cancelable: true,
        bubbles: true,
    })
    kupDefaultActionClick: EventEmitter<KupTooltipDefaultEventPayload>;

    @Event({
        eventName: 'kup-tooltip-defaultpreviewclick',
        composed: true,
        cancelable: true,
        bubbles: true,
    })
    kupDefaultPreviewClick: EventEmitter<KupTooltipDefaultEventPayload>;

    @Event({
        eventName: 'kup-tooltip-defaultoptionclick',
        composed: true,
        cancelable: true,
        bubbles: true,
    })
    kupDefaultOptionClick: EventEmitter<KupTooltipDefaultEventPayload>;

    @Event({
        eventName: 'kup-tooltip-treenodeexpand',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeExpand: EventEmitter<KupTooltipTreeNodeExpandEventPayload>;

    @Event({
        eventName: 'kup-tooltip-treenodebuttonclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeButtonClick: EventEmitter<KupTooltipTreeNodeButtonClickEventPayload>;

    /**
     * Fired when a node of the tree has been selected
     */
    @Event({
        eventName: 'kup-tooltip-treenodeselected',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeSelected: EventEmitter<KupTooltipTreeNodeSelectedEventPayload>;

    @Event({
        eventName: 'kup-tooltip-treenodedblclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeNodeDblClick: EventEmitter<KupTooltipTreeNodeDblClickEventPayload>;

    @Event({
        eventName: 'kup-tooltip-treedynamicmassexpansion',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTreeDynamicMassExpansion: EventEmitter<KupTooltipTreeDynamicMassExpansionEventPayload>;

    @Watch('relatedObject')
    onElementChanged() {
        if (this.relatedObject != null) {
            this.loadAll();
        } else {
            this.resetAll();
        }
    }

    @Watch('data')
    onDataChanged() {
        this.waitingServerResponse = false;
        if (this.relatedObject == null) {
            this.onElementChanged();
            return;
        }
        if (this.data == null) {
            this.relatedObject = null;
            return;
        }
        this.visible = true;
        //this._mouseIsOn = true;
        this.startLoadDetail(true);
    }

    @Watch('cellOptions')
    @Watch('detailData')
    onTooltipDetailChanged() {
        if (this.relatedObject == null) {
            this.onElementChanged();
            return;
        }
        if (this.data == null) {
            this.relatedObject = null;
            return;
        }

        this.waitingServerResponse = false;
    }

    // ---- Non reactive ----

    private tooltipTimeout: NodeJS.Timeout;
    private loadDetailTimeout: NodeJS.Timeout;
    private mouseLeaveTimeout: NodeJS.Timeout;

    private viewMode: ViewMode = ViewMode.TOOLTIP;
    private firstLoad: boolean = false;

    private _mouseIsOn: boolean = false;
    private waitingServerResponse = false;

    // ---- Public methods  ----

    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    @Method()
    async setTooltipInfo(relatedObject: TooltipRelatedObject) {
        //console.log('tooltip setTooltipInfo');
        this.resetAll();
        this.relatedObject = relatedObject;
    }

    @Method()
    async unsetTooltipInfo() {
        if (!this.mouseIsOn() && !this.isCardLayout()) {
            //console.log('tooltip unsetTooltipInfo');
            this.onMouseLeave();
        } else {
            //console.log('tooltip unsetTooltipInfo mouseIsoN');
        }
    }
    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupTooltipProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupTooltipProps, props);
    }

    // ---- Private methods ----
    private mouseIsOn() {
        return this._mouseIsOn || this.waitingServerResponse;
    }

    private hasDetailData(): boolean {
        return !!this.detailData && !!this.detailData.rows;
    }

    private hasCellOptionsData(): boolean {
        return this.cellOptions != null;
    }

    private hasActionsData(): boolean {
        return (
            this.hasDetailData() &&
            !!this.detailData.actions &&
            !!this.detailData.actions.command
        );
    }

    private startLoadDetail(withTimeout: boolean) {
        if (this.isCardLayout()) {
            return;
        }
        this.waitingServerResponse = true;
        // loading detail
        var timeoutMs = withTimeout == true ? this.detailTimeout : 0;
        this.loadDetailTimeout = setTimeout(() => {
            this.loadDetail();
            this.firstLoad = true;
        }, timeoutMs);
    }

    private resetTimeouts() {
        this.resetTooltipTimeout();
        this.resetLoadDetailTimeout();
        this.resetMouseLeaveTimeout();
    }

    private resetTooltipTimeout() {
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }

    private resetLoadDetailTimeout() {
        if (this.loadDetailTimeout) {
            clearTimeout(this.loadDetailTimeout);
            this.loadDetailTimeout = null;
        }
    }

    private resetMouseLeaveTimeout() {
        if (this.mouseLeaveTimeout) {
            clearTimeout(this.mouseLeaveTimeout);
            this.mouseLeaveTimeout = null;
        }
    }

    private isViewModeTooltip(): boolean {
        return this.viewMode == ViewMode.TOOLTIP;
    }

    private isViewModeCellOptions(): boolean {
        return this.viewMode == ViewMode.CELL_OPTIONS;
    }

    private loadDetail() {
        this.resetLoadDetailTimeout();
        if (this.relatedObject == null) {
            this.resetAll();
            return;
        }
        if (this.data == null) {
            this.resetAll();
            return;
        }
        this.rootElement.focus();
        if (this.isViewModeTooltip()) {
            this.cellOptions = null;
            this.kupTooltipLoadDetail.emit({
                comp: this,
                id: this.rootElement.id,
                relatedObject: this.relatedObject,
            });
        } else if (this.isViewModeCellOptions()) {
            this.detailData = null;
            this.kupTooltipLoadCellOptions.emit({
                comp: this,
                id: this.rootElement.id,
                relatedObject: this.relatedObject,
            });
        }
    }

    private getRows(): Row[] {
        return this.hasDetailData() ? this.detailData.rows : [];
    }

    private getImage(): string {
        if (this.data) {
            return this.data.image;
        }

        return '';
    }

    private getTitle(): string {
        let datatitle: string = '';
        if (this.data) {
            datatitle = this.data.title;
        }
        const title = (
            <div>
                <div
                    class="title ellipsis"
                    onClick={(event) => this.onDefaultOptionClick(event)}
                >
                    {datatitle}
                </div>
                <kup-button
                    icon="open-in-new"
                    onkup-button-click={(event) =>
                        this.onDefaultActionClick(event)
                    }
                ></kup-button>
                <kup-button
                    icon="search"
                    onkup-button-click={(event) =>
                        this.onDefaultPreviewClick(event)
                    }
                ></kup-button>
            </div>
        );
        return title;
    }

    private getContent() {
        return this.data ? this.data.content : {};
    }

    private getObj(): TooltipObject {
        const nullObj: TooltipObject = { t: '', p: '', k: '', url: '' };
        return this.data ? this.data.obj : nullObj;
    }

    // ---- Listeners ----
    private loadAll() {
        this.resetAll();
        this.prepareLoadData();
    }

    private prepareLoadData() {
        this.waitingServerResponse = true;
        this.tooltipTimeout = setTimeout(() => {
            if (this.relatedObject == null) {
                return;
            }
            this.kupTooltipLoadData.emit({
                comp: this,
                id: this.rootElement.id,
                relatedObject: this.relatedObject,
            });
        }, this.loadTimeout);
    }

    private onActionCommandClick(event: Event, action: TooltipAction) {
        //console.log("Emit kup-tooltip-actioncommandclick: " + JSON.stringify(action));
        // Blocco la propagazione del onkup-button-click per evitare che lo stesso click
        // sia gestito da due handler differenti, creando problemi sulla navigazione
        event.stopPropagation();
        this.kupActionCommandClick.emit({
            comp: this,
            id: this.rootElement.id,
            actionCommand: action,
            relatedObject: this.relatedObject,
        });
    }

    private onDefaultActionClick(event: Event) {
        //Evento di default al click
        event.stopPropagation();
        this.kupDefaultActionClick.emit({
            comp: this,
            id: this.rootElement.id,
            obj: this.getObj(),
        });
    }

    private onDefaultPreviewClick(event: Event) {
        //Evento di default al click
        event.stopPropagation();
        this.kupDefaultPreviewClick.emit({
            comp: this,
            id: this.rootElement.id,
            obj: this.getObj(),
        });
    }

    private onDefaultOptionClick(event: Event) {
        //Evento di default al click
        event.stopPropagation();
        this.kupDefaultOptionClick.emit({
            comp: this,
            id: this.rootElement.id,
            obj: this.getObj(),
        });
    }

    private onMouseEnter() {
        // Cancello il mouseLeaveTimeout così se l'utente
        // esce e rientra rimanendo nell'intervallo di 500ms
        // il tip non si chiude
        this.resetMouseLeaveTimeout();
        this._mouseIsOn = true;
    }

    private onMouseLeave() {
        this.resetMouseLeaveTimeout();

        if (!this.waitingServerResponse) {
            let timeout = 800;
            this.mouseLeaveTimeout = setTimeout(() => {
                this.relatedObject = null;
                this.firstLoad = false;
            }, timeout);
        }
    }

    private onKupTreeNodeExpand(e: CustomEvent) {
        e.stopPropagation();
        if (e.detail.usesDynamicExpansion != true) {
            return;
        }
        if (e.detail.dynamicExpansionRequireChildren != true) {
            return;
        }
        // TreeNode is now expanded -> Fires expanded event
        this.kupTreeNodeExpand.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: e.detail.treeNodePath,
            treeNode: e.detail.treeNode,
            usesDynamicExpansion: e.detail.usesDynamicExpansion,
            dynamicExpansionRequireChildren:
                e.detail.dynamicExpansionRequireChildren,
            tree: e.detail.comp,
        });
    }

    private onKupTreeNodeSelected(e: CustomEvent) {
        e.stopPropagation();

        this.kupTreeNodeSelected.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: e.detail.treeNodePath,
            treeNode: e.detail.treeNode,
            columnName: e.detail.columnName,
            auto: e.detail.auto,
            tree: e.detail.comp,
        });
    }

    private onKupTreeNodeButtonClick(e: CustomEvent) {
        e.stopPropagation();

        this.kupTreeNodeButtonClick.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: e.detail.treeNodePath,
            treeNode: e.detail.treeNode,
            column: e.detail.column,
            columnName: e.detail.columnName,
            auto: e.detail.auto,
            tree: e.detail.comp,
        });
    }

    private onKupTreeNodeDblClick(e: CustomEvent) {
        e.stopPropagation();

        this.kupTreeNodeDblClick.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: e.detail.treeNodePath,
            treeNode: e.detail.treeNode,
        });
    }

    private onKupTreeDynamicMassExpansion(e: CustomEvent) {
        e.stopPropagation();

        this.kupTreeDynamicMassExpansion.emit({
            comp: this,
            id: this.rootElement.id,
            treeNodePath: e.detail.treeNodePath,
            treeNode: e.detail.treeNode,
            expandAll: e.detail.expandAll,
        });
    }

    private resetAll() {
        // reset timeouts
        this.resetTimeouts();
        // reset data
        this.data = null;
        this.detailData = null;
        this.cellOptions = null;

        // reset visibility
        this.visible = false;
        this._mouseIsOn = false;
        this.waitingServerResponse = false;
        this.viewMode = ViewMode.TOOLTIP;
    }

    // ---- Render methods ----
    private getDefaultLayout() {
        return [
            <div class="left">
                <img class="image-container" src={this.getImage()}></img>
            </div>,
            <div class="right">
                <h3>{this.getTitle()}</h3>
                {this.getInfos()}
            </div>,
        ];
    }

    private getLayout2() {
        return (
            <div>
                <h3>{this.getTitle()}</h3>
            </div>
        );
    }

    private getLayout3() {
        return [
            <div>
                <h4>{this.getTitle()}</h4>
            </div>,
            this.getInfos(),
        ];
    }

    private getLayout4() {
        var info = null;
        var listMenu = null;
        var content = this.getContent();
        if (content) {
            info = content[`info1`];
            listMenu = content[`listMenu`];
        }
        if (info || listMenu) {
            let htmlMarkup = <div innerHTML={info ? info.value : ''} />;

            return [
                <kup-card
                    data={{
                        list: listMenu ? [listMenu] : [],
                        text: [info ? info.label : ''],
                    }}
                    id="dialog-card-5"
                    layoutNumber={5}
                    layoutFamily={CardFamily.DIALOG}
                    onClick={(e) => e.stopPropagation()}
                    sizeX="300px"
                    sizeY="auto"
                >
                    {htmlMarkup}
                </kup-card>,
            ];
        }
    }

    private getInfos() {
        let infos = null;

        const content = this.getContent();
        if (content) {
            infos = [];

            for (let i = 1; i <= 2; i++) {
                const info = content[`info${i}`];

                if (info && info.label && info.value) {
                    if (info.label != '' && info.value != '') {
                        infos.push(
                            <div>
                                <div class="label ellipsis">{info.label}</div>
                                <div class="value ellipsis">{info.value}</div>
                            </div>
                        );
                    }
                }
            }
        }

        return infos;
    }

    private isCardLayout(): boolean {
        switch (this.layout) {
            case '4': {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    private getCardLayoutContent() {
        switch (this.layout) {
            case '4': {
                return this.getLayout4();
            }
            default: {
                return null;
            }
        }
    }

    private createTooltip() {
        if (this.data == null) {
            return null;
        }

        let mainContent = null;
        const mainContentClass = {};

        switch (this.layout) {
            case '2': {
                mainContent = this.getLayout2();
                mainContentClass['layout2'] = true;
                break;
            }
            case '3': {
                mainContent = this.getLayout3();
                mainContentClass['layout3'] = true;
                break;
            }
            case '4': {
                /** why are you here??? */
                break;
            }
            default: {
                mainContent = this.getDefaultLayout();
                break;
            }
        }

        let detailContent = null;
        let detailActions = [];
        if (this.hasDetailData()) {
            detailContent = this.getRows().map((row) =>
                row.cells['label'].value === '' ||
                row.cells['value'].value === '' ? (
                    <span></span>
                ) : (
                    <div class="detail-row">
                        <div class="detail-row__label ellipsis">
                            {row.cells['label'].value}
                        </div>
                        <div class="detail-row__value ellipsis">
                            {row.cells['value'].value}
                        </div>
                    </div>
                )
            );
            if (this.hasActionsData()) {
                detailActions = this.detailData.actions.command
                    .slice(0, 5)
                    .map((action) => (
                        <div class="detail-actions__box">
                            <kup-button
                                title={action.text}
                                icon={action.icon}
                                onkup-button-click={(event) =>
                                    this.onActionCommandClick(event, action)
                                }
                            ></kup-button>
                        </div>
                    ));
            }
        }
        if (this.hasCellOptionsData()) {
            detailContent = [
                <kup-tree
                    class="kup-full-width"
                    showFilter={true}
                    {...this.cellOptions.config}
                    {...this.cellOptions}
                    tooltipEnabled={false}
                    onkup-tree-nodecollapse={(e) => e.stopPropagation()}
                    onkup-tree-nodeexpand={(e) => this.onKupTreeNodeExpand(e)}
                    onkup-tree-nodeselected={(e) =>
                        this.onKupTreeNodeSelected(e)
                    }
                    onkup-tree-buttonclick={(e) =>
                        this.onKupTreeNodeButtonClick(e)
                    }
                    onkup-tree-didload={(e) => e.stopPropagation()}
                    onkup-tree-didunload={(e) => e.stopPropagation()}
                    onkup-tree-nodedblclick={(e) =>
                        this.onKupTreeNodeDblClick(e)
                    }
                    onkup-tree-dynamicmassexpansion={(e) =>
                        this.onKupTreeDynamicMassExpansion(e)
                    }
                ></kup-tree>,
            ];
        }
        if (
            this.hasDetailData() ||
            this.hasCellOptionsData() ||
            this.firstLoad
        ) {
            detailActions = [
                ...detailActions,
                <div class="detail-actions__box">
                    <kup-button
                        title={this.getTooltipForShowOptionsButton()}
                        icon={this.getIconForShowOptionsButton()}
                        onkup-button-click={() =>
                            this.onShowRightClickOptions()
                        }
                        onClick={(e) => e.stopPropagation()}
                    ></kup-button>
                </div>,
            ];
        }

        const detailClass = {
            visible: this.hasDetailData() || this.hasCellOptionsData(),
            [this.viewMode]: true,
            'detail-loaded': this.firstLoad,
        };

        return (
            <div
                id="tooltip"
                hidden={!this.visible}
                onClick={(e: MouseEvent) => e.stopPropagation()}
            >
                <div id="main-content" class={mainContentClass}>
                    {mainContent}
                </div>
                <div id="detail" class={detailClass}>
                    {detailContent}
                </div>
                <div
                    id="detail-actions"
                    hidden={detailActions == null || detailActions.length == 0}
                >
                    {detailActions}
                </div>
            </div>
        );
    }

    getTooltipForShowOptionsButton(): string {
        if (this.isViewModeTooltip()) {
            return this.kupManager.language.translate(
                KupLanguageGeneric.SHOW_ROW_OPTIONS
            );
        } else if (this.isViewModeCellOptions()) {
            return this.kupManager.language.translate(
                KupLanguageGeneric.SHOW_TOOLTIP_INFO
            );
        } else {
            return '???';
        }
    }

    getIconForShowOptionsButton(): string {
        if (this.isViewModeTooltip()) {
            return 'menu';
        } else if (this.isViewModeCellOptions()) {
            return 'menu';
        } else {
            return '???';
        }
    }

    onShowRightClickOptions() {
        this.viewMode =
            this.viewMode == ViewMode.TOOLTIP
                ? ViewMode.CELL_OPTIONS
                : ViewMode.TOOLTIP;
        this.startLoadDetail(false);
    }
    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        if (this.visible) {
            this.kupManager.dynamicPosition.register(
                this.rootElement as KupDynamicPositionElement,
                this.relatedObject.element,
                0,
                KupDynamicPositionPlacement.AUTO,
                true
            );
            this.kupManager.dynamicPosition.start(
                this.rootElement as KupDynamicPositionElement
            );
            this.rootElement.focus();
        } else {
            this.kupManager.dynamicPosition.stop(
                this.rootElement as KupDynamicPositionElement
            );
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        if (this.isCardLayout()) {
            return this.getCardLayoutContent();
        }
        return (
            <div
                id="wrapper"
                onMouseEnter={(ev) => {
                    this.onMouseEnter();
                    ev.stopPropagation();
                }}
                onMouseLeave={(ev) => {
                    this.onMouseLeave();
                    ev.stopPropagation();
                }}
            >
                {this.createTooltip()}
            </div>
        );
    }

    disconnectedCallback() {
        this.kupManager.language.unregister(this);
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
