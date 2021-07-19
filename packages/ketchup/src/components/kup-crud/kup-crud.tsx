import {
    Component,
    Prop,
    h,
    Watch,
    Method,
    Event,
    EventEmitter,
    Host,
    State,
} from '@stencil/core';

import {
    FormFields,
    FormCells,
    FormField,
    FormSection,
    FormMessage,
    FormActions,
    FormActionEventDetail,
    FormFieldEventDetail,
} from '../kup-form/kup-form-declarations';

import {
    getFields,
    getVisibleFields,
    outputValue,
} from '../../utils/widget-utils';

import {
    CrudRecord,
    CrudConfig,
    CrudRecordsChanged,
    CrudCallBackOnFormEventResult,
    CrudMessage,
    CrudMessageLevel,
} from './kup-crud-declarations';

import isEmpty from 'lodash/isEmpty';

import { SearchFilterSubmittedEventDetail } from '../kup-search/kup-search-declarations';

import { TableData } from '../kup-data-table/kup-data-table-declarations';

import cloneDeep from 'lodash/cloneDeep';

import { generateUuidv4 } from '../../utils/utils';

@Component({
    tag: 'kup-crud',
    styleUrl: 'kup-crud.scss',
    shadow: true,
})
// TODO: complete this component... actually is only a simplified version for tests inside form...
// TODO: used generated uuid to manage different records... records indexes can be used
export class KupCrud {
    //--------------------------------------------------------------------------
    // PROPS
    // -------------------------------------------------------------------------

    @Prop() refid: string;

    @Prop() extra: any;

    @Prop() config: CrudConfig;

    // START form props... TODO: they can arrive from a callback...
    @Prop() records: CrudRecord[];

    @Prop() fields: FormFields;

    @Prop() sections: FormSection;

    @Prop() extraMessages: FormMessage[] = [];

    @Prop() actions: FormActions;

    // END form props...

    @Prop() disabled: boolean = false;

    @Prop() crudCallBackOnFormActionSubmitted: (
        detail: FormActionEventDetail
    ) => Promise<CrudCallBackOnFormEventResult> | undefined = undefined;

    @Prop() crudCallBackOnFormFieldChanged: (
        detail: FormFieldEventDetail
    ) => Promise<CrudCallBackOnFormEventResult> | undefined = undefined;

    @Prop() autocompleteCallBackOnFilterUpdate: (detail: {
        filter: string;
        matchesMinimumCharsRequired: boolean;
        el: EventTarget;
    }) => Promise<any[]> | undefined = undefined;

    @Prop() searchCallBackOnFilterSubmitted: (
        detail: SearchFilterSubmittedEventDetail
    ) => Promise<TableData> | undefined = undefined;

    //--------------------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------------------

    @Event({
        eventName: 'kupCrudFocused',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCrudFocused: EventEmitter;

    @Event({
        eventName: 'kupCrudBlurred',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCrudBlurred: EventEmitter;

    @Event({
        eventName: 'kupCrudFormActionSubmitted',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCrudFormActionSubmitted: EventEmitter<FormActionEventDetail>;

    @Event({
        eventName: 'kupCrudFormFieldChanged',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCrudFormFieldChanged: EventEmitter<FormFieldEventDetail>;

    @Event({
        eventName: 'kupCrudRecordsChanged',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupCrudRecordsChanged: EventEmitter<CrudRecordsChanged>;

    //--------------------------------------------------------------------------
    // INTERNAL
    // -------------------------------------------------------------------------

    @State() actualCells: FormCells;

    @State() messages: CrudMessage[] = [];

    private visibleFields: FormField[] = [];

    private modal: HTMLKupModalElement;

    //--------------------------------------------------------------------------
    // PUBLI METHODS
    // -------------------------------------------------------------------------

    @Method()
    async closeForm() {
        this.modal.visible = false;
    }

    @Method()
    async openForm() {
        this.modal.visible = true;
    }

    //--------------------------------------------------------------------------
    // ON SOMETHING
    // -------------------------------------------------------------------------

    componentWillLoad() {
        this.onFieldsChanged();
    }

    @Watch('fields')
    private onFieldsChanged() {
        this.initVisibleFields();
    }

    private onCrudFocused(event) {
        event.stopPropagation();
        this.kupCrudFocused.emit({});
    }

    private onCrudBlurred(event) {
        event.stopPropagation();
        this.kupCrudBlurred.emit({});
    }

    private onCancelForm(event: CustomEvent) {
        console.log('Cancel crud form clicked');
        event.stopPropagation();
        // close modal
        this.modal.visible = false;
    }

    private onInsertRecordClicked(event: CustomEvent) {
        console.log('Insert record');
        event.stopPropagation();
        if (!this.extra) {
            this.extra = {};
        }
        this.extra.operation = 'insert';

        this.actualCells = {};
        this.extraMessages = [];
        // open modal
        this.modal.visible = true;
    }

    private onUpdateRecordClicked(event: CustomEvent, recordId: string) {
        console.log('Update record with id ' + recordId);
        event.stopPropagation();
        let record = this.getRecordById(this.records, recordId);
        if (record) {
            if (!this.extra) {
                this.extra = {};
            }
            this.extra.operation = 'update';
            this.extra.recordId = recordId;
            // put a deep clone of the record in the form
            this.actualCells = cloneDeep(record.cells);
            this.extraMessages = [];
            // open modal
            this.modal.visible = true;
        }
    }

    private onDeleteRecordClicked(event: CustomEvent, recordId: string) {
        console.log('Delete record with id ' + recordId);
        event.stopPropagation();
        let index = this.getRecordIndexByRecordId(this.records, recordId);
        if (index >= 0) {
            this.records.splice(index, 1);
            this.records = [...this.records];
            this.kupCrudRecordsChanged.emit({
                actual: { records: this.records },
            });
        }
    }

    private onFormFieldChanged(event: CustomEvent<FormFieldEventDetail>) {
        event.stopPropagation();
        let detail = event.detail;

        if (this.crudCallBackOnFormFieldChanged) {
            console.log(
                'Executing callback on form field event for refid ' +
                    detail.refid
            );
            this.crudCallBackOnFormFieldChanged(detail)
                .then((result) => {
                    this.update(detail.extra, result);
                    this.kupCrudFormFieldChanged.emit(detail);
                })
                .catch((err) => {
                    console.error('Executing callback error:', err);
                });
        } else {
            this.kupCrudFormFieldChanged.emit(detail);
        }
    }

    private onFormActionSubmitted(event: CustomEvent<FormActionEventDetail>) {
        event.stopPropagation();
        let detail = event.detail;

        if (this.crudCallBackOnFormActionSubmitted) {
            console.log(
                'Executing callback on form action submitted for refid ' +
                    detail.refid +
                    ' and action ' +
                    detail.action.key
            );
            this.crudCallBackOnFormActionSubmitted(detail)
                .then((result) => {
                    this.update(detail.extra, result);
                    this.kupCrudFormActionSubmitted.emit(detail);
                })
                .catch((err) => {
                    console.error('Executing callback error:', err);
                });
        } else {
            this.kupCrudFormActionSubmitted.emit(detail);
        }
    }

    //--------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    private renderRow(record: CrudRecord) {
        let rowContent = [];

        let updateButtonContent = this.hasRowUpdateAction() ? (
            <kup-button
                icon="pencil"
                onkup-button-click={(e) =>
                    this.onUpdateRecordClicked(e, record.id)
                }
            ></kup-button>
        ) : (
            ''
        );

        let deleteButtonContent = this.hasRowDeleteAction() ? (
            <kup-button
                icon="delete"
                onkup-button-click={(e) =>
                    this.onDeleteRecordClicked(e, record.id)
                }
            ></kup-button>
        ) : (
            ''
        );

        if (this.hasRowActions()) {
            rowContent.push(
                <td>
                    {updateButtonContent}
                    {deleteButtonContent}
                </td>
            );
        }

        this.visibleFields &&
            this.visibleFields.forEach((field) => {
                rowContent.push(
                    <td>
                        {outputValue(
                            record.cells &&
                                record.cells[field.key] &&
                                record.cells[field.key].value,
                            field.outputValueFunction
                        )}
                    </td>
                );
            });

        return <tr>{rowContent}</tr>;
    }

    renderMessages() {
        let messagesContent = '';
        if (this.messages) {
            messagesContent = (
                <div class="global-messages">
                    {this.messages
                        .filter((elem) => !!elem)
                        .map((message, index) => {
                            return (
                                <div
                                    class={
                                        'global-message ' +
                                        message.level.toLowerCase()
                                    }
                                    key={index}
                                >
                                    {message.text}
                                </div>
                            );
                        })}
                </div>
            );
        }
        return messagesContent;
    }

    render() {
        let insertButtonContent = this.hasInsertAction() ? (
            <kup-button
                label="Add"
                icon="plus"
                onkup-button-click={(e) => this.onInsertRecordClicked(e)}
            ></kup-button>
        ) : (
            ''
        );

        let tableHeader = [];

        if (this.hasRowActions()) {
            tableHeader.push(<th>Actions</th>);
        }

        this.visibleFields &&
            this.visibleFields.forEach((field) => {
                tableHeader.push(<th>{field.key}</th>);
            });

        let tableRows = [];

        this.records.forEach((record, i) => {
            if (i === 0 && this.hasConfigureAction()) {
                tableRows.push(this.renderRow(record));
            } else if (!this.hasConfigureAction()) {
                tableRows.push(this.renderRow(record));
            }
        });

        let configureButtonContent = this.hasConfigureAction() ? (
            <kup-button
                id="open-modal"
                label="Configure"
                onkup-button-click={(e) =>
                    this.onUpdateRecordClicked(
                        e,
                        this.records && this.records[0].id
                    )
                }
                onkup-button-blur={(e) => this.onCrudBlurred(e)}
                onkup-button-focus={(e) => this.onCrudFocused(e)}
            >
                Configure
            </kup-button>
        ) : (
            ''
        );

        return (
            <Host refid={this.refid}>
                <div class="crud-component ">
                    {this.renderMessages()}
                    {insertButtonContent}
                    <table class="crud-table">
                        <thead>
                            <tr>{tableHeader}</tr>
                        </thead>
                        <tbody>{tableRows}</tbody>
                    </table>
                    {configureButtonContent}

                    <kup-modal
                        id="modal"
                        ref={(el) => (this.modal = el)}
                        onKupModalCancel={(e) => this.onCancelForm(e)}
                    >
                        <kup-form
                            refid={this.refid}
                            extra={this.extra}
                            config={this.config}
                            fields={this.fields}
                            cells={this.actualCells}
                            sections={this.sections}
                            extraMessages={this.extraMessages}
                            actions={this.actions}
                            onkup-form-actionsubmitted={(e) =>
                                this.onFormActionSubmitted(e)
                            }
                            onkup-form-fieldchanged={(e) =>
                                this.onFormFieldChanged(e)
                            }
                            autocompleteCallBackOnFilterUpdate={
                                this.autocompleteCallBackOnFilterUpdate
                            }
                            searchCallBackOnFilterSubmitted={
                                this.searchCallBackOnFilterSubmitted
                            }
                            crudCallBackOnFormActionSubmitted={
                                this.crudCallBackOnFormActionSubmitted
                            }
                            crudCallBackOnFormFieldChanged={
                                this.crudCallBackOnFormFieldChanged
                            }
                        />
                    </kup-modal>
                </div>
            </Host>
        );
    }

    //--------------------------------------------------------------------------
    // UTIL METHODS
    // -------------------------------------------------------------------------

    private initVisibleFields(): void {
        this.visibleFields = getVisibleFields(getFields(this.fields));
    }

    private hasConfigureAction(): boolean {
        return !this.disabled && this.config && !this.config.multiple;
    }

    private hasInsertAction(): boolean {
        return (
            !this.disabled &&
            this.config &&
            this.config.multiple &&
            this.config.insert
        );
    }

    private hasRowUpdateAction(): boolean {
        return (
            !this.disabled &&
            this.config &&
            this.config.multiple &&
            this.config.update
        );
    }

    private hasRowDeleteAction(): boolean {
        return (
            !this.disabled &&
            this.config &&
            this.config.multiple &&
            this.config.delete
        );
    }

    private hasRowActions(): boolean {
        return (
            !this.disabled &&
            this.config &&
            this.config.multiple &&
            (this.config.update || this.config.delete)
        );
    }

    private getRecordIndexByRecordId(
        records: CrudRecord[],
        id: string
    ): number {
        let indexes = records.reduce(
            (c, record, i) => (record.id == id ? c.concat(i) : c),
            []
        );

        if (!indexes || indexes.length == 0) {
            this.messages = [
                {
                    text: 'Did not find record with id ' + id,
                    level: CrudMessageLevel.ERROR,
                },
            ];
            return -1;
        }
        if (indexes.length > 1) {
            this.messages = [
                {
                    text: 'More than one record with the same id (' + id + ')',
                    level: CrudMessageLevel.ERROR,
                },
            ];
            return -1;
        }

        return indexes[0];
    }

    private getRecordById(records: CrudRecord[], id: string): CrudRecord {
        let index = this.getRecordIndexByRecordId(records, id);
        if (index >= 0) {
            return records[index];
        } else {
            return null;
        }
    }

    private update(extra: any, result: CrudCallBackOnFormEventResult) {
        console.log('CRUD component update...');

        if (isEmpty(result)) {
            console.log('Nothing to update...');
        }

        if (result.isUpdate == true) {
            this.modal.visible = false;
        }

        if (result.extraMessages) {
            this.extraMessages = result.extraMessages;
        }

        // TODO: as default if you modify fields you have to return all fields
        // I added a fields.diff.override mode but is an INCOMPLETE sample
        // the impl is only for readonly and data props -> if can be useful extends it
        if (result.fields) {
            console.log('Updating fields...');
            if (result.diffTypes.includes('fields.diff.override')) {
                const keys = Object.keys(result.fields);
                keys.forEach((key) => {
                    if (result.fields[key].hasOwnProperty('config')) {
                        if (result.fields[key].config.hasOwnProperty('data')) {
                            this.fields[key].config.data =
                                result.fields[key].config.data;
                        }
                    }
                    if (result.fields[key].hasOwnProperty('readonly')) {
                        this.fields[key].readonly = result.fields[key].readonly;
                    }
                });
            } else {
                this.fields = result.fields;
            }
        }

        if (result.cells) {
            this.actualCells = result.cells;

            if (result.isUpdate) {
                if (extra && extra.operation == 'update') {
                    let index = this.getRecordIndexByRecordId(
                        this.records,
                        extra.recordId
                    );
                    this.records[index].cells = result.cells;
                }
                if (extra && extra.operation == 'insert') {
                    let record = { id: generateUuidv4(), cells: result.cells };
                    this.records = [...this.records, record];
                }

                this.kupCrudRecordsChanged.emit({
                    actual: { records: this.records },
                });
            }
        }

        // todo: config, sections, actions
    }
}
