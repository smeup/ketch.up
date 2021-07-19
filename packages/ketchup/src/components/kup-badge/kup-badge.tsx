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
import { FImage } from '../../f-components/f-image/f-image';
import { GenericObject, KupComponent } from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';
import { KupBadgeEventPayload, KupBadgeProps } from './kup-badge-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-badge',
    styleUrl: 'kup-badge.scss',
    shadow: true,
})
export class KupBadge {
    @Element() rootElement: HTMLElement;

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * The data of the image displayed inside the badge.
     */
    @Prop() imageData: {} = undefined;
    /**
     * The text displayed inside the badge.
     */
    @Prop() text: string = undefined;

    @Event({
        eventName: 'kup-badge-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupBadgeEventPayload>;

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
        return getProps(this, KupBadgeProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupBadgeProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    onKupClick(e: Event) {
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            el: e.target,
        });
    }

    //---- Lifecycle hooks ----

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
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        if (this.text === undefined && this.imageData === undefined) {
            let message = 'Empty badge, not rendering!';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return;
        }

        let imageEl: HTMLElement = undefined;

        if (this.text === undefined && this.imageData !== undefined) {
            if (!this.imageData['sizeX']) {
                this.imageData['sizeX'] = '1em';
            }
            if (!this.imageData['sizeY']) {
                this.imageData['sizeY'] = '1em';
            }
            if (!this.imageData['color']) {
                this.imageData[
                    'color'
                ] = `var(${KupThemeColorValues.TEXT_ON_PRIMARY})`;
            }
            imageEl = <FImage {...this.imageData}></FImage>;
        }
        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" onClick={(e) => this.onKupClick(e)}>
                    {this.text}
                    {imageEl}
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
