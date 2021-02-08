import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    h,
} from '@stencil/core';
import { logLoad, logRender } from '../../utils/debug-manager';

@Component({
    tag: 'kup-dash',
    styleUrl: 'kup-dash.scss',
    shadow: true,
})
export class KupDash {
    @Element() rootElement: HTMLElement;

    /**
     * The component can be clicked.
     */
    @Prop() active = false;
    /**
     * Sets the font size of the component.
     */
    @Prop() fontsize = '';
    /**
     * Sets the layout of the component.
     */
    @Prop() layout = '1';
    /**
     * No idea what this is about.
     */
    @Prop() index = 0;

    @Event({
        eventName: 'ketchupDashClicked',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    dashClicked: EventEmitter<{
        id: number;
    }>;

    onDshClickedHandler() {
        this.dashClicked.emit({
            id: this.index,
        });
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        logLoad(this, false);
    }

    componentDidLoad() {
        logLoad(this, true);
    }

    componentWillRender() {
        logRender(this, false);
    }

    componentDidRender() {
        logRender(this, true);
    }

    render() {
        let content = null;

        switch (this.layout) {
            case '2':
                content = (
                    <div>
                        <div class="icon">
                            <slot name="icon" />
                        </div>
                        <div class="value-int">
                            <slot name="value-int" />
                        </div>
                        <div class="value-dec">
                            <slot name="value-dec" />
                        </div>
                        <div class="unit">
                            <slot name="unit" />
                        </div>
                    </div>
                );
                break;

            case '3':
                content = (
                    <div>
                        <div class="value">
                            <slot name="value" />
                        </div>
                        <div class="descr">
                            <slot name="descr" />
                        </div>
                    </div>
                );
                break;

            case '4':
                content = (
                    <div>
                        <div class="icon">
                            <slot name="icon" />
                        </div>

                        <div class="value-and-unit">
                            <div class="value-int">
                                <slot name="value-int" />
                            </div>
                            <div class="value-dec">
                                <slot name="value-dec" />
                            </div>
                            <div class="unit">
                                <slot name="unit" />
                            </div>
                        </div>

                        <div />

                        <div class="descr">
                            <slot name="descr" />
                        </div>
                    </div>
                );
                break;

            case '5':
                content = (
                    <div>
                        <div>
                            <div class="descr">
                                <slot name="descr" />
                            </div>

                            <div class="value">
                                <slot name="value" />
                            </div>
                        </div>

                        <div class="icon">
                            <slot name="icon" />
                        </div>
                    </div>
                );
                break;

            case '6':
                content = (
                    <div>
                        <div class="icon">
                            <slot name="icon" />
                        </div>

                        <div>
                            <div class="value">
                                <slot name="value" />
                            </div>
                            <div class="descr">
                                <slot name="descr" />
                            </div>
                        </div>
                    </div>
                );
                break;

            case '7':
                content = (
                    <div>
                        <div>
                            <div class="value">
                                <slot name="value" />
                            </div>

                            <div class="descr">
                                <slot name="descr" />
                            </div>
                        </div>

                        <div class="icon">
                            <slot name="icon" />
                        </div>
                    </div>
                );
                break;

            case '8':
                content = (
                    <div>
                        <div class="icon">
                            <slot name="icon" />
                        </div>

                        <div class="value">
                            <slot name="value" />
                        </div>

                        <div class="descr">
                            <slot name="descr" />
                        </div>
                    </div>
                );
                break;

            default:
                // layout 1
                content = (
                    <div>
                        <div class="descr">
                            <slot name="descr" />
                        </div>
                        <div class="value">
                            <slot name="value" />
                        </div>
                    </div>
                );
                break;
        }
        const style = { fontSize: this.fontsize };

        return (
            <div
                id="dash"
                class={`${this.active ? 'with-dyn' : ''}`}
                style={style}
                onClick={() => this.onDshClickedHandler()}
            >
                <div id="content" class={`layout-${this.layout} `}>
                    {content}
                </div>
            </div>
        );
    }
}
