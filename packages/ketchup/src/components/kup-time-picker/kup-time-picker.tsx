import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    JSX,
    Listen,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';

import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import {
    ISO_DEFAULT_TIME_FORMAT,
    ISO_DEFAULT_TIME_FORMAT_WITHOUT_SECONDS,
    isValidFormattedStringTime,
    formattedStringToCustomUnformattedStringTime,
    unformattedStringToFormattedStringTime,
    unformatDateTime,
    formatTime,
    getProps,
    setProps,
} from '../../utils/utils';
import { FButtonStyling } from '../../f-components/f-button/f-button-declarations';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionElement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import {
    KupTimePickerEventPayload,
    KupTimePickerProps,
} from './kup-time-picker-declarations';
import {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';

@Component({
    tag: 'kup-time-picker',
    styleUrl: 'kup-time-picker.scss',
    shadow: true,
})
export class KupTimePicker {
    @Element() rootElement: HTMLElement;
    @State() value: string = '';
    /**
     * When set to true, the drop down menu will display a clock.
     */
    @Prop() clockVariant: boolean = true;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the sub-components (time input text field)
     */
    @Prop() data: Object = {};
    /**
     * Defaults at false. When set to true, the component is disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * Sets the initial value of the component
     */
    @Prop() initialValue: string = '';
    /**
     * Manage seconds
     */
    @Prop() manageSeconds: boolean = false;
    /**
     * Minutes step
     */
    @Prop() timeMinutesStep: number = 10;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    private hoursEl: HTMLElement = undefined;
    private minutesEl: HTMLElement = undefined;
    private secondsEl: HTMLElement = undefined;
    private hoursCircleEl: HTMLElement = undefined;
    private minutesCircleEl: HTMLElement = undefined;
    private secondsCircleEl: HTMLElement = undefined;
    private hoursActive: boolean = true;
    private minutesActive: boolean = false;
    private secondsActive: boolean = false;
    private textfieldEl: any = undefined;
    private pickerContainerEl: HTMLElement = undefined;
    private pickerEl: HTMLElement = undefined;
    private pickerOpened: boolean = false;

    //---- Events ----

    @Event({
        eventName: 'kup-timepicker-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-input',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-iconclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIconClick: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-itemclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupItemClick: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-textfieldsubmit',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTextFieldSubmit: EventEmitter<KupTimePickerEventPayload>;

    @Event({
        eventName: 'kup-timepicker-cleariconclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClearIconClick: EventEmitter<KupEventPayload>;

    @Listen('keyup', { target: 'document' })
    listenKeyup(e: KeyboardEvent) {
        if (this.isPickerOpened()) {
            if (e.key === 'Escape') {
                this.closePicker();
            }
            if (e.key === 'Enter') {
                e.stopPropagation();
                this.onKupTimePickerItemClick(null);
            }
        }
    }

    onKupTimePickerItemClick(e: CustomEvent, value?: string) {
        if (e != null) {
            e.stopPropagation();
            if (value == null) {
                value = e.detail.selected.value;
            }
        }
        this.setPickerValueSelected(value);

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

    onKupClearIconClick(e: MouseEvent) {
        e.stopPropagation();
        this.setPickerValueSelected('');

        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });

        this.kupClearIconClick.emit({
            comp: this,
            id: this.rootElement.id,
        });
    }

    @Watch('timeMinutesStep')
    watchTimeMinutesStep() {
        if (this.clockVariant) {
            return;
        }
        if (this.timeMinutesStep <= 0) {
            this.kupManager.debug.logMessage(
                this,
                'property time-minutes-step=[' +
                    this.timeMinutesStep +
                    '] not allowed: it must be > 0 and divisor of 60',
                KupDebugCategory.WARNING
            );
            this.timeMinutesStep = 10;
            return;
        }
        let result: number = 60 % this.timeMinutesStep;

        if (result != 0) {
            this.kupManager.debug.logMessage(
                this,
                'property time-minutes-step=[' +
                    this.timeMinutesStep +
                    '] not allowed: it must be > 0 and divisor of 60',
                KupDebugCategory.WARNING
            );
            this.timeMinutesStep = 10;
            return;
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
        return getProps(this, KupTimePickerProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupTimePickerProps, props);
    }

    @Method()
    async getValue(): Promise<string> {
        return this.value;
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    @Method()
    async setFocus() {
        if (this.textfieldEl != null) {
            this.textfieldEl.setFocus();
        }
    }

    @Method()
    async setValue(value: string) {
        this.value = value;
        this.setTextFieldInitalValue(this.getTimeForOutput());
    }

    onKupBlur() {
        this.closePicker();
        this.kupBlur.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupChange(e: CustomEvent) {
        e.stopPropagation();
        this.refreshPickerValue(e.detail.value, this.kupChange);
    }

    onKupClick(e: UIEvent) {
        e.stopPropagation();
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupFocus(e: UIEvent) {
        e.stopPropagation();
        this.kupFocus.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupInput(e: CustomEvent) {
        e.stopPropagation();
        this.refreshPickerValue(e.detail.value, this.kupInput);
    }

    onKupTextFieldSubmit(e: CustomEvent) {
        e.stopPropagation();
        this.refreshPickerValue(e.detail.value, this.kupTextFieldSubmit);
    }

    onKupIconClick(e: UIEvent) {
        e.stopPropagation();
        if (this.isPickerOpened()) {
            this.closePicker();
        } else {
            this.openPicker();
        }
        this.kupIconClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    refreshPickerValue(eventDetailValue: string, eventToRaise: EventEmitter) {
        let newValue = null;
        if (isValidFormattedStringTime(eventDetailValue, this.manageSeconds)) {
            newValue = formattedStringToCustomUnformattedStringTime(
                eventDetailValue,
                this.manageSeconds
                    ? ISO_DEFAULT_TIME_FORMAT
                    : ISO_DEFAULT_TIME_FORMAT_WITHOUT_SECONDS,
                this.manageSeconds
            );
            this.value = newValue;
            this.setTextFieldInitalValue(this.getTimeForOutput());
        }

        if (newValue != null) {
            eventToRaise.emit({
                comp: this,
                id: this.rootElement.id,
                value: newValue,
            });
        }
    }

    setPickerValueSelected(newValue?: string) {
        if (!this.isPickerOpened()) {
            return;
        }
        if (this.disabled == true) {
            return;
        }
        if (newValue == null) {
            newValue = this.getPickerValueSelected();
        }
        this.closePicker();
        if (newValue == null) {
            return;
        }
        this.value = newValue;
        this.setTextFieldInitalValue(this.getTimeForOutput());
    }

    getPickerValueSelected(): string {
        return this.value;
    }

    setTextFieldInitalValue(value: string) {
        if (this.textfieldEl !== undefined) {
            this.textfieldEl.setValue(value);
        }
    }

    getValueForPickerComponent() {
        return this.value;
    }

    openPicker() {
        let textfieldEl = this.textfieldEl;
        let containerEl = this.pickerContainerEl;
        this.pickerOpened = true;
        this.setClockViewActive(true, false, false);

        let textFieldWidth = null;
        if (textfieldEl != null) {
            textFieldWidth =
                textfieldEl.shadowRoot.querySelector(
                    '.mdc-text-field'
                ).clientWidth;
            textfieldEl.classList.add('toggled');
            textfieldEl.emitSubmitEventOnEnter = false;
        }
        if (containerEl != null) {
            this.kupManager.dynamicPosition.start(
                containerEl as KupDynamicPositionElement
            );
            containerEl.classList.add('visible');
            let elStyle: any = containerEl.style;
            elStyle.height = 'auto';
            if (textFieldWidth != null) {
                elStyle.minWidth = textFieldWidth + 'px';
            }
        }
        this.refresh();
    }

    closePicker() {
        let textfieldEl = this.textfieldEl;
        let containerEl = this.pickerContainerEl;
        this.pickerOpened = false;
        if (textfieldEl != null) {
            textfieldEl.classList.remove('toggled');
            textfieldEl.emitSubmitEventOnEnter = true;
        }
        if (containerEl != null) {
            this.kupManager.dynamicPosition.stop(
                containerEl as KupDynamicPositionElement
            );
            containerEl.classList.remove('visible');
        }
    }

    isPickerOpened(): boolean {
        return this.pickerOpened;
    }

    getTextFieldId(): string {
        return this.textfieldEl.id;
    }

    getPickerElId(): string {
        return this.pickerEl.id;
    }

    prepTimeTextfield(): any {
        return this.prepTextfield(this.getTimeForOutput());
    }

    prepTextfield(initialValue: string): any {
        let textfieldData = { ...this.data['kup-text-field'] };

        if (!textfieldData['icon']) {
            textfieldData['icon'] = 'access_time';
        }

        if (textfieldData['icon']) {
            textfieldData['trailingIcon'] = true;
        }

        let comp: HTMLElement = (
            <kup-text-field
                {...textfieldData}
                disabled={this.disabled}
                id={this.rootElement.id + '_text-field'}
                initialValue={initialValue}
                onkup-textfield-change={(e: any) => this.onKupChange(e)}
                onkup-textfield-click={(e: any) => this.onKupClick(e)}
                onkup-textfield-focus={(e: any) => this.onKupFocus(e)}
                onkup-textfield-input={(e: any) => this.onKupInput(e)}
                onkup-textfield-iconclick={(e: any) => this.onKupIconClick(e)}
                onkup-textfield-submit={(e: any) =>
                    this.onKupTextFieldSubmit(e)
                }
                onkup-textfield-cleariconclick={(e: any) =>
                    this.onKupClearIconClick(e)
                }
                ref={(el) => (this.textfieldEl = el as any)}
            ></kup-text-field>
        );

        return comp;
    }

    isRelatedTargetInThisComponent(e: any): boolean {
        if (!e.relatedTarget) {
            return false;
        }
        let id = e.relatedTarget.id;
        if (id == null || id.trim() == '') {
            return false;
        }
        if (id == this.getTextFieldId()) {
            return true;
        }
        if (id == this.getPickerElId()) {
            return true;
        }

        let idConc = '#time-picker-div#confirm#';
        return idConc.indexOf('#' + id + '#') >= 0;
    }

    private setTimeFromClock(e: CustomEvent) {
        let text: string =
            this.hoursEl.innerText + ':' + this.minutesEl.innerText;
        if (this.manageSeconds) {
            text += ':' + this.secondsEl.innerText;
        }
        this.onKupTimePickerItemClick(e, text);
    }

    private createClock() {
        let selectedTime: Date;
        if (this.value) {
            selectedTime = unformatDateTime(
                this.value,
                this.manageSeconds
                    ? ISO_DEFAULT_TIME_FORMAT
                    : ISO_DEFAULT_TIME_FORMAT_WITHOUT_SECONDS
            );
        } else {
            selectedTime = new Date();
        }

        let hh: string = selectedTime.getHours().toString();
        let mm: string = selectedTime.getMinutes().toString();
        if (hh.length === 1) {
            hh = '0' + hh;
        }
        if (mm.length === 1) {
            mm = '0' + mm;
        }
        let ss: string = '';
        if (this.manageSeconds) {
            ss = selectedTime.getSeconds().toString();
            if (ss.length === 1) {
                ss = '0' + ss;
            }
        }
        let seconds: HTMLElement;
        let time: JSX.Element[] = [
            <span
                class="h"
                ref={(el) => (this.hoursEl = el as any)}
                onClick={() => {
                    this.setClockViewActive(true, false, false);
                    this.switchView(this.hoursEl, this.hoursCircleEl);
                }}
                innerHTML={hh}
            ></span>,
            ':',
            <span
                class="m"
                ref={(el) => (this.minutesEl = el as any)}
                onClick={() => {
                    this.setClockViewActive(false, true, false);
                    this.switchView(this.minutesEl, this.minutesCircleEl);
                }}
                innerHTML={mm}
            ></span>,
        ];
        if (this.manageSeconds) {
            seconds = (
                <div
                    class="circle seconds"
                    ref={(el) => (this.secondsCircleEl = el as any)}
                >
                    {this.buildClock(60, 101, 115, 115, 'sec unit', 0, 5, ss)}
                    <div class="mid"></div>
                </div>
            );
            time.push(
                ':',
                <span
                    class="s"
                    ref={(el) => (this.secondsEl = el as any)}
                    onClick={() => {
                        this.setClockViewActive(false, false, true);
                        this.switchView(this.secondsEl, this.secondsCircleEl);
                    }}
                    innerHTML={ss}
                ></span>
            );
        }

        return (
            <div
                class="clock"
                id={this.rootElement.id + '_clock'}
                ref={(el) => (this.pickerEl = el as any)}
            >
                <div class="top">{time}</div>
                <div
                    class="circle hours"
                    ref={(el) => (this.hoursCircleEl = el as any)}
                >
                    {this.buildClock(12, 101, 105, 105, 'hour', 0, 1, hh)}
                    {this.buildClock(12, 64, 110, 110, 'hour2', 12, 1, hh)}
                    <div class="mid"></div>
                </div>
                <div
                    class="circle minutes"
                    ref={(el) => (this.minutesCircleEl = el as any)}
                >
                    {this.buildClock(60, 101, 115, 115, 'min unit', 0, 5, mm)}
                    <div class="mid"></div>
                </div>
                {seconds}
                <div class="actions">
                    <kup-button
                        onkup-button-click={(e: any) => {
                            this.setTimeFromClock(e);
                        }}
                        id="confirm"
                        styling={FButtonStyling.FLAT}
                        label="Ok"
                    ></kup-button>
                </div>
            </div>
        );
    }

    private switchView(el: HTMLElement, elCircle: HTMLElement) {
        this.hoursEl.classList.remove('active');
        this.hoursCircleEl.classList.remove('active');
        this.minutesEl.classList.remove('active');
        this.minutesCircleEl.classList.remove('active');
        if (this.secondsEl) {
            this.secondsEl.classList.remove('active');
            this.secondsCircleEl.classList.remove('active');
        }
        el.classList.add('active');
        elCircle.classList.add('active');
    }

    private setClockViewActive(
        hoursActive: boolean,
        minutesActive: boolean,
        secondsActive: boolean
    ) {
        this.hoursActive = hoursActive;
        this.minutesActive = minutesActive;
        this.secondsActive = secondsActive;
    }

    private buildClock(
        num: number,
        radius: number,
        offsetX: number,
        offsetY: number,
        className: string,
        add: number,
        separator: number,
        selectedValue: string
    ) {
        let x: number, y: number;
        let divsArray: JSX.Element[] = [];

        for (var n = 0; n < num; n++) {
            x = radius * Math.cos((n / num) * 2 * Math.PI);
            y = radius * Math.sin((n / num) * 2 * Math.PI);
            let text: string;
            let dataValue: { [key: string]: string } = {};
            let style: { [key: string]: string } = {};
            if (separator == 1) {
                if (n + 3 > 12) {
                    text = n + 3 - 12 + add + '';
                } else {
                    let calc = n + 3 + add;
                    if (calc !== 24) {
                        text = n + 3 + add + '';
                    } else {
                        text = '00';
                    }
                }
                dataValue['data-value'] = text;
            } else {
                if (n % separator == 0) {
                    if (n + 15 >= 60) {
                        dataValue['data-value'] = n + 15 - 60 + '';
                        text = n + 15 - 60 + add + '';
                    } else {
                        dataValue['data-value'] = n + 15 + '';
                        text = n + 15 + add + '';
                    }
                } else {
                    if (n + 15 >= 60) {
                        dataValue['data-value'] = n + 15 - 60 + '';
                        text = '⋅';
                    } else {
                        dataValue['data-value'] = n + 15 + '';
                        text = '\u00B7';
                    }
                }
            }
            style['left'] = x + offsetX + 'px';
            style['top'] = y + offsetY + 'px';

            if (dataValue['data-value'].length === 1) {
                dataValue['data-value'] = '0' + dataValue['data-value'];
            }

            let elClass = className;
            if (dataValue['data-value'] === selectedValue) {
                elClass += ' selected';
            }

            let div: HTMLElement = (
                <div
                    class={elClass}
                    style={style}
                    {...dataValue}
                    onClick={(e) => this.setClockTime(e)}
                >
                    {text}
                </div>
            );
            divsArray.push(div);
        }

        return divsArray;
    }

    private setClockTime(e) {
        let time = e.target.getAttribute('data-value');
        if (this.hoursActive) {
            this.hoursEl.innerText = time;
            this.hoursCircleEl
                .querySelector('.selected')
                .classList.remove('selected');
            this.setClockViewActive(false, true, false);
            this.switchView(this.minutesEl, this.minutesCircleEl);
        } else if (this.minutesActive) {
            this.minutesEl.innerText = time;
            this.minutesCircleEl
                .querySelector('.selected')
                .classList.remove('selected');
            if (this.manageSeconds) {
                this.setClockViewActive(false, false, true);
                this.switchView(this.secondsEl, this.secondsCircleEl);
            } else {
                this.setTimeFromClock(e);
            }
        } else {
            this.secondsEl.innerText = time;
            this.secondsCircleEl
                .querySelector('.selected')
                .classList.remove('selected');
            this.setTimeFromClock(e);
        }
        e.target.classList.add('selected');
    }

    prepTimePicker() {
        let widget: HTMLElement = undefined;

        if (this.clockVariant) {
            widget = this.createClock();
        } else {
            widget = (
                <kup-list
                    data={this.createTimeListData(this.value)}
                    is-menu
                    menu-visible
                    onkup-list-click={(e) =>
                        this.onKupTimePickerItemClick(
                            e,
                            e.detail.selected.value
                        )
                    }
                    id={this.rootElement.id + '_list'}
                    ref={(el) => (this.pickerEl = el as any)}
                ></kup-list>
            );
        }

        return (
            <div
                tabindex="-1"
                id="time-picker-div"
                ref={(el) => (this.pickerContainerEl = el as any)}
                onBlur={(e: any) => {
                    if (!this.isRelatedTargetInThisComponent(e)) {
                        this.onKupBlur();
                    }
                }}
            >
                {widget}
            </div>
        );
    }

    private createTimeListData(value: string) {
        let listData: ComponentListElement[] = [];

        let selectedTime: Date;
        if (value == null || value.trim() == '') {
            selectedTime = new Date();
        } else {
            selectedTime = unformatDateTime(
                value,
                this.manageSeconds
                    ? ISO_DEFAULT_TIME_FORMAT
                    : ISO_DEFAULT_TIME_FORMAT_WITHOUT_SECONDS
            );
        }

        let totalDayMinutes: number = 24 * 60;
        let itemsCount = totalDayMinutes / this.timeMinutesStep;

        let date: Date = new Date();
        date.setHours(0, 0, 0);
        for (let i = 0; i < itemsCount; i++) {
            let selected: boolean = false;
            if (
                date.getHours() == selectedTime.getHours() &&
                date.getMinutes() == selectedTime.getMinutes()
            ) {
                selected = true;
            }
            let text: string = formatTime(date, this.manageSeconds);
            let value = formattedStringToCustomUnformattedStringTime(
                text,
                this.manageSeconds
                    ? ISO_DEFAULT_TIME_FORMAT
                    : ISO_DEFAULT_TIME_FORMAT_WITHOUT_SECONDS,
                this.manageSeconds
            );
            let item: ComponentListElement = {
                text: text,
                value: value,
                selected: selected,
            };
            listData[listData.length] = item;
            date.setMinutes(date.getMinutes() + this.timeMinutesStep);
        }

        return listData;
    }

    getTimeForOutput(): string {
        if (this.value == null || this.value.trim() == '') {
            return '';
        }
        let v1 = unformattedStringToFormattedStringTime(
            this.value,
            this.manageSeconds
        );
        return v1;
    }

    recalcPosition() {
        if (this.pickerContainerEl != null && this.textfieldEl != null) {
            this.kupManager.dynamicPosition.register(
                this.pickerContainerEl as KupDynamicPositionElement,
                this.textfieldEl
            );
        }
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.watchTimeMinutesStep();
        this.value = this.initialValue;
        if (!this.data) {
            this.data = {
                'kup-list': {},
                'kup-text-field': {},
            };
        }
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        if (this.clockVariant) {
            if (this.hoursActive) {
                this.switchView(this.hoursEl, this.hoursCircleEl);
            } else if (this.minutesActive) {
                this.switchView(this.minutesEl, this.minutesCircleEl);
            } else if (this.secondsActive) {
                this.switchView(this.secondsEl, this.secondsCircleEl);
            }
        }
        this.recalcPosition();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let hostClass: Record<string, boolean> = {};

        if (
            this.data &&
            this.data['kup-text-field'] &&
            this.data['kup-text-field']['className'] &&
            this.data['kup-text-field']['className'].indexOf(
                'kup-full-height'
            ) > -1
        ) {
            hostClass['kup-full-height'] = true;
        }

        if (
            this.data &&
            this.data['kup-text-field'] &&
            this.data['kup-text-field']['fullWidth']
        ) {
            hostClass['kup-full-width'] = true;
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host class={hostClass} onBlur={() => this.onKupBlur()}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    {this.prepTimeTextfield()}
                    {this.prepTimePicker()}
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
