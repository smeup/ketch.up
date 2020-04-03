import {
    Component,
    Event,
    EventEmitter,
    Prop,
    Element,
    Host,
    h,
    Listen,
} from '@stencil/core';

import { errorLogging } from '../../utils/error-logging';
import { positionRecalc } from '../../utils/recalc-position';
import {
    ItemsDisplayMode,
    getValueOfItemByDisplayMode,
} from '../kup-list/kup-list-declarations';

@Component({
    tag: 'kup-autocomplete',
    styleUrl: 'kup-autocomplete.scss',
    shadow: true,
})
export class KupAutocomplete {
    @Element() rootElement: HTMLElement;

    /**
     * Custom style to be passed to the component.
     */
    @Prop({ reflect: true }) customStyle: string = undefined;

    /**
     * The minimum number of chars to trigger the autocomplete
     */
    @Prop({ reflect: true }) minimumChars: number = 3;

    /**
     * Props of the list.
     */
    @Prop() listData: Object = {};

    /**
     * Props of the text field.
     */
    @Prop() textfieldData: Object = {};

    /**
     * Sets how the return the selected item value
     */
    @Prop({ reflect: true }) selectMode: ItemsDisplayMode =
        ItemsDisplayMode.CODE;

    private textfieldEl: any = undefined;
    private listEl: any = undefined;
    private value: string = undefined;
    private elStyle: any = undefined;

    /**
     * Event example.
     */

    @Event({
        eventName: 'kupAutocompleteBlur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteChange',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteFocus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteInput',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteIconClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIconClick: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteItemClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupItemClick: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupAutocompleteFilterChanged',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFilterChanged: EventEmitter<{
        filter: string;
        matchesMinimumCharsRequired: boolean;
    }>;

    /**
     * Function that can be invoked when the filter is updated, but only if in serverHandledFilter mode. It returns the items filtered.
     */
    @Prop() callBackOnFilterUpdate: (detail: {
        filter: string;
        matchesMinimumCharsRequired: boolean;
        el: EventTarget;
    }) => Promise<any[]> | undefined = undefined;

    /**
     * When true, it will emit events to inform the listener of the change of the current filter value.
     * Also the component builtin filter will be disabled.
     */
    @Prop({ reflect: true }) serverHandledFilter: boolean = false;

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
    /**
     * --- Methods ----
     */

    onKupBlur(e: UIEvent & { target: HTMLInputElement }) {
        this.closeList();
        const { target } = e;
        this.kupBlur.emit({
            value: target.value,
        });
    }

    onKupChange(e: CustomEvent) {
        this.value = e.detail.value;
        this.kupChange.emit({
            value: this.value,
        });
    }

    onKupClick(e: UIEvent & { target: HTMLInputElement }) {
        const { target } = e;
        this.kupClick.emit({
            value: target.value,
        });
    }

    onKupFocus(e: UIEvent & { target: HTMLInputElement }) {
        const { target } = e;
        this.kupFocus.emit({
            value: target.value,
        });
    }

    onKupInput(e: CustomEvent) {
        this.value = e.detail.value;

        if (this.openList(false)) {
            this.handleFilterChange(this.value, e.target);
        }

        this.kupInput.emit({
            value: this.value,
        });
    }

    onKupIconClick(event: UIEvent & { target: HTMLInputElement }) {
        const { target } = event;

        if (this.textfieldEl.classList.contains('toggled')) {
            this.closeList();
        } else {
            this.openList(true);
        }
        this.kupIconClick.emit({
            value: target.value,
        });
    }

    onKupItemClick() {
        this.log('onKupItemClick', '');
        this.consistencyCheck();
        this.closeList();

        this.kupChange.emit({
            value: this.value,
        });

        this.kupItemClick.emit({
            value: this.value,
        });
    }

    onKupFilterChanged(e: CustomEvent) {
        this.log('onKupFilterChanged', 'detail.value: ' + e.detail.value);
        this.handleFilterChange(e.detail.value, e.target);
    }

    handleFilterChange(newFilter: string, eventTarget: EventTarget) {
        this.log('handleFilterChange', 'newFilter: ' + newFilter);
        let detail = {
            filter: newFilter,
            matchesMinimumCharsRequired:
                newFilter && newFilter.length >= this.minimumChars,
            el: eventTarget,
        };
        if (this.serverHandledFilter && this.callBackOnFilterUpdate) {
            this.log(
                'handleFilterChange',
                'Executing callback on filter update'
            );
            this.callBackOnFilterUpdate(detail)
                .then((items) => {
                    this.listData['data'] = [...items];
                    this.kupFilterChanged.emit(detail);
                })
                .catch((err) => {
                    errorLogging('kup-list', 'Executing callback error');
                    errorLogging('kup-list', err);
                });
        } else {
            this.listEl.filter = newFilter;
            this.kupFilterChanged.emit(detail);
        }
    }

    openList(forceOpen: boolean): boolean {
        if (forceOpen != true && this.value.length < this.minimumChars) {
            return false;
        }
        let textFieldWidth = this.textfieldEl.shadowRoot.querySelector(
            '.mdc-text-field'
        ).clientWidth;
        this.textfieldEl.classList.add('toggled');
        if (this.textfieldEl['icon']) {
            this.textfieldEl['icon'] = 'arrow_drop_up';
        }
        this.textfieldEl.emitSubmitEventOnEnter = false;
        this.listEl.menuVisible = true;
        this.listEl.classList.add('dynamic-position-active');
        let elStyle: any = this.listEl.style;
        elStyle.height = 'auto';
        elStyle.minWidth = textFieldWidth + 'px';
        return true;
    }

    closeList() {
        this.textfieldEl.classList.remove('toggled');
        if (this.textfieldEl['icon']) {
            this.textfieldEl['icon'] = 'arrow_drop_down';
        }
        this.textfieldEl.emitSubmitEventOnEnter = true;
        this.listEl.menuVisible = false;
        this.listEl.classList.remove('dynamic-position-active');
        this.listEl.resetFilter();
    }

    isListOpened(): boolean {
        return this.listEl.menuVisible == true;
    }

    consistencyCheck() {
        /*this.log(
            'consistencyCheck',
            'data: ' + JSON.stringify(this.listData['data'])
        );*/
        var firstSelectedFound = false;

        if (this.listData['data']) {
            for (let i = 0; i < this.listData['data'].length; i++) {
                if (this.listData['data'][i].selected && firstSelectedFound) {
                    this.listData['data'][i].selected = false;
                    let message =
                        'Found occurence of data(' +
                        i +
                        ") to be set on 'selected' when another one was found before! Overriding to false because only 1 'selected' is allowed in this menu.";

                    errorLogging('kup-autocomplete', message);
                }
                if (this.listData['data'][i].selected && !firstSelectedFound) {
                    firstSelectedFound = true;
                    this.value = getValueOfItemByDisplayMode(
                        this.listData['data'][i],
                        this.selectMode,
                        ' - '
                    );
                    /*
                    this.log(
                        'consistencyCheck',
                        'selectedValue: ' +
                            this.value +
                            ' this.textfieldEl: ' +
                            JSON.stringify(this.textfieldEl)
                    );*/
                    if (this.textfieldEl) {
                        if (this.textfieldEl.initialValue === this.value) {
                            this.textfieldEl.initialValue = '';
                            this.textfieldEl.initialValue = this.value;
                        } else {
                            this.textfieldEl.initialValue = this.value;
                        }
                    }
                }
            }
        }
    }

    log(methodName: string, msg: string) {
        errorLogging(
            'kup-autocomplete',
            methodName + '() ' + this.rootElement.id + ' - ' + msg,
            'log'
        );
    }
    //---- Lifecycle hooks ----

    componentDidRender() {
        positionRecalc(this.listEl, this.textfieldEl);
    }

    prepTextfield() {
        if (this.textfieldData['fullWidth']) {
            this.elStyle = {
                ...this.elStyle,
                width: '100%',
            };
        }

        if (this.textfieldData['fullHeight']) {
            this.elStyle = {
                ...this.elStyle,
                height: '100%',
            };
        }

        let comp: HTMLElement = (
            <kup-text-field
                {...this.textfieldData}
                style={this.elStyle}
                initial-value={this.value}
                id={this.rootElement.id + '_text-field'}
                /* onKupTextFieldBlur={(e: any) => this.onKupBlur(e)} */
                onKupTextFieldChange={(e: any) => this.onKupChange(e)}
                onKupTextFieldClick={(e: any) => this.onKupClick(e)}
                onKupTextFieldFocus={(e: any) => this.onKupFocus(e)}
                onKupTextFieldInput={(e: any) => this.onKupInput(e)}
                onKupTextFieldIconClick={(e: any) => this.onKupIconClick(e)}
                ref={(el) => (this.textfieldEl = el as any)}
            ></kup-text-field>
        );

        return comp;
    }

    prepList() {
        let comp: HTMLElement = (
            <kup-list
                {...this.listData}
                is-menu
                onKupListClick={() => this.onKupItemClick()}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.listEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    render() {
        let customStyle = undefined;
        if (this.customStyle) {
            customStyle = <style>{this.customStyle}</style>;
        }

        this.consistencyCheck();
        let textfieldEl = this.prepTextfield();
        let listEl = this.prepList();

        return (
            <Host onBlur={(e: any) => this.onKupBlur(e)} style={this.elStyle}>
                {customStyle}
                <div id="kup-component" style={this.elStyle}>
                    {textfieldEl}
                    {listEl}
                </div>
            </Host>
        );
    }
}
