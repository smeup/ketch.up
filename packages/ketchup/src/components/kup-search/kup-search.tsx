import {
    Component,
    Prop,
    Element,
    Event,
    EventEmitter,
    State,
    Watch,
    h,
} from '@stencil/core';

import { TableData, Row } from '../kup-data-table/kup-data-table-declarations';

import {
    SearchSelectionUpdatedEventDetail,
    SearchFilterSubmittedEventDetail,
} from './kup-search-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';

@Component({
    tag: 'kup-search',
    styleUrl: 'kup-search.scss',
    shadow: true,
})
// TODO: complete this component... actually is only a simplified version for tests inside form...
export class KupSearch {
    @Element() rootElement: HTMLElement;
    //--------------------------------------------------------------------------
    // PROPS
    // -------------------------------------------------------------------------

    @Prop() extra: any;

    @Prop() initialValue: string = '';

    /**
     * The field used to obtain value
     */
    @Prop() valueField: string;

    @Prop() data: TableData;

    @Prop() disabled: boolean = false;

    /**
     * When true it emits events or makes available callbacks useful to obtain and filter data.
     * When false the data inside data prop will be used and filtered in a static way.
     */
    @Prop() serverHandledFilter: boolean = false;

    /**    
    /** Function that can be invoked when the filter is submitted, but only if in serverHandledFilter mode. It returns the items filtered. 
     */
    @Prop() searchCallBackOnFilterSubmitted: (
        detail: SearchFilterSubmittedEventDetail
    ) => Promise<TableData> | undefined = undefined;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    //--------------------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------------------

    @Event({
        eventName: 'kupSearchSelectionUpdated',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupSearchSelectionUpdated: EventEmitter<SearchSelectionUpdatedEventDetail>;

    /**
     * Fired when the filter is submitted but only if in serverHandledFilter mode.
     */
    @Event({
        eventName: 'kupSearchFilterSubmitted',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupSearchFilterSubmitted: EventEmitter<SearchFilterSubmittedEventDetail>;

    //--------------------------------------------------------------------------
    // INTERNAL
    // -------------------------------------------------------------------------

    @State() value: string = '';

    private modal: HTMLKupModalElement;

    //--------------------------------------------------------------------------
    // ON SOMETHING
    // -------------------------------------------------------------------------

    @Watch('initialValue')
    onInitialValueChanged() {
        this.value = this.initialValue;
    }

    private onSearchClicked(event) {
        event.stopPropagation();
        this.onSearchFilterSubmitted();
        this.modal.visible = true;
    }

    private onSearchDialogClicked(event) {
        event.stopPropagation();
        this.onSearchFilterSubmitted();
    }

    private onSearchFilterSubmitted() {
        if (this.serverHandledFilter) {
            let detail = {
                ...(this.extra ? { extra: this.extra } : {}),
                filter: this.value,
            };

            if (this.searchCallBackOnFilterSubmitted) {
                console.log('Executing callback on filter submitted');
                this.searchCallBackOnFilterSubmitted(detail)
                    .then((data) => {
                        this.data = data;
                        this.kupSearchFilterSubmitted.emit(detail);
                    })
                    .catch((err) => {
                        console.error('Executing callback error:', err);
                    });
            } else {
                this.kupSearchFilterSubmitted.emit(detail);
            }
        }
    }

    //TODO: manage all datatable events, like kup-datatable-loadmoreclicked, KupDatatableAddColumn...

    private onSearchCancelled(event) {
        event.stopPropagation();
        this.modal.visible = false;
    }

    private onSearchInputChanged(event) {
        event.stopPropagation();
        this.value = event.detail.value;
    }

    private onRowSelected(event) {
        event.stopPropagation();
        let rowsSelected = event.detail.selectedRows as Row[];
        let rowSelected = rowsSelected[0];
        if (rowSelected.cells.hasOwnProperty(this.valueField)) {
            this.value = rowSelected.cells[this.valueField].value;
            this.kupSearchSelectionUpdated.emit({
                value: this.value,
            });
            this.modal.visible = false;
        }
    }

    //--------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.onInitialValueChanged();
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
        return (
            <div class="search-component">
                <kup-text-field
                    initialValue={this.value}
                    disabled={this.disabled}
                    onkup-textfield-change={(e) => this.onSearchInputChanged(e)}
                ></kup-text-field>
                <kup-button
                    icon="magnify"
                    onkup-button-click={(e) => this.onSearchClicked(e)}
                ></kup-button>
                <kup-modal
                    ref={(el) => (this.modal = el)}
                    onKupModalCancel={(e) => this.onSearchCancelled(e)}
                >
                    {this.serverHandledFilter ? (
                        <div>
                            <kup-text-field
                                initialValue={this.value}
                                onkup-textfield-change={(e) =>
                                    this.onSearchInputChanged(e)
                                }
                            ></kup-text-field>
                            <kup-button
                                icon="magnify"
                                onkup-button-click={(e) =>
                                    this.onSearchDialogClicked(e)
                                }
                            ></kup-button>
                        </div>
                    ) : null}

                    <kup-data-table
                        globalFilter={!this.serverHandledFilter}
                        globalFilterValue={
                            !this.serverHandledFilter ? this.value : ''
                        }
                        data={this.data}
                        showFilters={true}
                        onkup-datatable-rowselected={(e) =>
                            this.onRowSelected(e)
                        }
                    ></kup-data-table>
                </kup-modal>
            </div>
        );
    }
}
