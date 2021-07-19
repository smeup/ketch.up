import {
    Component,
    Element,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
} from '@stencil/core';

import { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { getProps, setProps } from '../../utils/utils';
import { KupSpinnerProps } from './kup-spinner-declarations';

@Component({
    tag: 'kup-spinner',
    styleUrl: 'kup-spinner.scss',
    shadow: true,
    assetsDirs: ['assets'],
})
export class KupSpinner {
    @Element() rootElement: HTMLElement;

    /**
     * When set to true the spinner is animating.
     */
    @Prop({ reflect: true }) active: boolean = false;
    /**
     * Decides whether the component is a bar or a spinner.
     */
    @Prop() barVariant: boolean = false;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Width and height of the spinner. For the bar variant, only height.
     */
    @Prop() dimensions: string = undefined;
    /**
     * Places a blend modal over the wrapper to darken the view (or lighten, when the theme is dark).
     */
    @Prop() fader: boolean = false;
    /**
     * The time required for the "fader" to trigger.
     */
    @Prop() faderTimeout: number = 3500;
    /**
     * When set to true the component will fill the whole viewport.
     */
    @Prop({ reflect: true }) fullScreen: boolean = false;
    /**
     * Sets the layout of the spinner.
     */
    @Prop() layout: number = 1;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    //---- Methods ----

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupSpinnerProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupSpinnerProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentDidUpdate() {
        const root = this.rootElement.shadowRoot;
        if (root) {
            root.querySelector('#loading-wrapper-master').classList.remove(
                'loading-wrapper-big-wait'
            );
        }
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        const root = this.rootElement.shadowRoot;

        if (root) {
            if (this.fader) {
                setTimeout(function () {
                    root.querySelector('#loading-wrapper-master').classList.add(
                        'loading-wrapper-big-wait'
                    );
                }, this.faderTimeout);
            }
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let masterClass = '';
        let wrapperClass = '';
        let spinnerClass = '';
        let spinnerEl: any = '';
        let elStyle = undefined;

        if (this.barVariant) {
            masterClass += ' bar-version';
            wrapperClass = 'loading-wrapper-master-bar';
            spinnerClass = 'spinner-bar-v' + this.layout;
        } else {
            masterClass += ' spinner-version';
            wrapperClass = 'loading-wrapper-master-spinner';
            spinnerClass = 'spinner-v' + this.layout;
            if (this.layout === 7) {
                spinnerEl = [
                    <div class="sk-spinner-v7-dot"></div>,
                    <div class="sk-spinner-v7-dot"></div>,
                    <div class="sk-spinner-v7-dot"></div>,
                    <div class="sk-spinner-v7-dot"></div>,
                    <div class="sk-spinner-v7-dot"></div>,
                    <div class="sk-spinner-v7-dot"></div>,
                ];
            }
            if (this.layout === 9) {
                spinnerEl = [
                    <div class="sk-spinner-v9-bounce1"></div>,
                    <div class="sk-spinner-v9-bounce2"></div>,
                ];
            }
            if (this.layout === 10) {
                spinnerEl = [
                    <div class="sk-spinner-v10-cube1"></div>,
                    <div class="sk-spinner-v10-cube2"></div>,
                ];
            }
            if (this.layout === 12) {
                spinnerEl = [
                    <div class="sk-spinner-v12-dot1"></div>,
                    <div class="sk-spinner-v12-dot2"></div>,
                ];
            }
            if (this.layout === 13) {
                spinnerEl = [
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube1"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube2"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube3"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube4"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube5"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube6"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube7"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube8"></div>,
                    <div class="sk-spinner-v13-cube sk-spinner-v13-cube9"></div>,
                ];
            }
            if (this.layout === 14) {
                spinnerEl = [
                    <div class="sk-spinner-v14-circle1 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle2 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle3 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle4 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle5 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle6 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle7 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle8 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle9 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle10 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle11 sk-spinner-v14-circle"></div>,
                    <div class="sk-spinner-v14-circle12 sk-spinner-v14-circle"></div>,
                ];
            }
        }

        if (!this.fullScreen) {
            elStyle = {
                height: '100%',
                width: '100%',
            };
        }

        if (this.dimensions) {
            elStyle = {
                ...elStyle,
                fontSize: this.dimensions,
            };
        } else if (!this.barVariant) {
            elStyle = {
                ...elStyle,
                fontSize: '16px',
            };
        } else {
            elStyle = {
                ...elStyle,
                fontSize: '3px',
            };
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host style={elStyle}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" style={elStyle}>
                    <div
                        id="loading-wrapper-master"
                        class={masterClass}
                        style={elStyle}
                    >
                        <div id={wrapperClass} style={elStyle}>
                            <div class={spinnerClass}>{spinnerEl}</div>
                        </div>
                    </div>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
