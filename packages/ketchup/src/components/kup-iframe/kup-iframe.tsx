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
} from '@stencil/core';

import type { GenericObject, KupEventPayload } from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { getProps, setProps } from '../../utils/utils';
import { KupIframeProps } from './kup-iframe-declarations';

@Component({
    tag: 'kup-iframe',
    styleUrl: 'kup-iframe.scss',
    shadow: true,
})
export class KupIframe {
    @Element() rootElement: HTMLElement;

    /**
     *  Props of the button (when isButton is set to true).
     */
    @Prop() buttonData: Object = {};
    /**
     * The component will be rendered as a button, which opens the link associated to the iframe in another tab when clicked.
     */
    @Prop() isButton: boolean = false;
    /**
     * The address the iframe should be referencing to.
     */
    @Prop() src: string = undefined;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    //---- Methods ----

    @Event({
        eventName: 'kup-iframe-error',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIframeError: EventEmitter<KupEventPayload>;

    onKupIframeError() {
        this.kupIframeError.emit({ comp: this, id: this.rootElement.id });
    }

    @Event({
        eventName: 'kup-iframe-load',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIframeLoad: EventEmitter<KupEventPayload>;

    onKupIframeLoad() {
        this.kupIframeLoad.emit({ comp: this, id: this.rootElement.id });
    }

    openInNew() {
        window.open(this.src, '_blank');
    }
    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupIframeProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupIframeProps, props);
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
        if (this.src === undefined || this.src === null || this.src === '') {
            let message = 'Resource undefined, not rendering!';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return;
        }

        if (!this.buttonData['icon']) {
            this.buttonData['icon'] = 'open_in_new';
        }

        if (!this.buttonData['label']) {
            this.buttonData['label'] = 'Open in new tab';
        }

        return !this.isButton ? (
            <Host is-iframe>
                <iframe
                    onError={this.onKupIframeError.bind(this)}
                    onLoad={this.onKupIframeLoad.bind(this)}
                    src={this.src}
                />
            </Host>
        ) : (
            <Host is-button>
                <kup-button
                    {...this.buttonData}
                    onkup-button-click={() => this.openInNew()}
                />
            </Host>
        );
    }
}
