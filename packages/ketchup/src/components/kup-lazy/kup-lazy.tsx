import {
    Component,
    Element,
    forceUpdate,
    h,
    Host,
    Prop,
    State,
} from '@stencil/core';

import { Method } from '@stencil/core/internal';
import { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { getProps, setProps } from '../../utils/utils';
import { KupLazyProps, KupLazyRender } from './kup-lazy-declarations';

@Component({
    tag: 'kup-lazy',
    styleUrl: 'kup-lazy.scss',
    shadow: true,
})
export class KupLazy {
    /**
     * References the root HTML element of the component (<kup-button>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    @State() isInViewport: boolean = false;

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Sets the tag name of the component to be lazy loaded.
     * @default null
     */
    @Prop() componentName: string = null;
    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Sets the data of the component to be lazy loaded.
     * @default null
     */
    @Prop() data: GenericObject = null;
    /**
     * Decides when the sub-component should be rendered.
     * By default when both the component props exist and the component is in the viewport.
     * @default KupLazyRender.BOTH
     */
    @Prop() renderMode: KupLazyRender = KupLazyRender.BOTH;
    /**
     * Displays an animated SVG placeholder until the component is loaded.
     * @default true
     */
    @Prop() showPlaceholder: boolean = true;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the intersection observer.
     */
    private intObserver: IntersectionObserver = null;
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

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
        return getProps(this, KupLazyProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupLazyProps, props);
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

    setObserver(): void {
        let callback: IntersectionObserverCallback = (
            entries: IntersectionObserverEntry[]
        ) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.kupManager.debug.logMessage(
                        this,
                        'kup-lazy entering the viewport, rendering ' +
                            this.componentName +
                            '.'
                    );
                    this.isInViewport = true;
                    this.intObserver.unobserve(this.rootElement);
                }
            });
        };
        let options: IntersectionObserverInit = {
            threshold: 0.25,
        };
        this.intObserver = new IntersectionObserver(callback, options);
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.setObserver();
    }

    componentDidLoad() {
        this.intObserver.observe(this.rootElement);
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let content: HTMLElement;
        let resource: HTMLElement;
        let className: string = this.componentName;
        switch (this.componentName) {
            case 'kup-button':
                //call_to_action.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M42 6H6c-2.2 0-4 1.8-4 4v28c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4V10c0-2.2-1.8-4-4-4zm0 32H6v-6h36v6z" />
                    </svg>
                );
                break;
            case 'kup-card':
                //art_track.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M44 26H28v-4h16v4zm0-12H28v4h16v-4zM28 34h16v-4H28v4zm-4-16v12c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V18c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4zm-3 12l-4.5-6-3.5 4.51-2.5-3.01L7 30h14z" />
                    </svg>
                );
                break;
            case 'kup-checkbox':
                //check_box_outline_blank.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M38 10v28H10V10h28m0-4H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4z" />
                    </svg>
                );
                break;
            case 'kup-chart':
                //chart-bar.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                    >
                        <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
                    </svg>
                );
                break;
            case 'kup-data-table':
                //table-large.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                    >
                        <path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z" />
                    </svg>
                );
                break;
            case 'kup-image':
                //photo.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M42 38V10c0-2.21-1.79-4-4-4H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4zM17 27l5 6.01L29 24l9 12H10l7-9z" />
                    </svg>
                );
                break;
            case 'kup-progress-bar':
                //linear_scale.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M39 19c-2.05 0-3.81 1.23-4.58 3h-5.84c-.77-1.77-2.53-3-4.58-3s-3.81 1.23-4.58 3h-5.84c-.77-1.77-2.53-3-4.58-3-2.77 0-5 2.23-5 5s2.23 5 5 5c2.05 0 3.81-1.23 4.58-3h5.84c.77 1.77 2.53 3 4.58 3s3.81-1.23 4.58-3h5.84c.77 1.77 2.53 3 4.58 3 2.77 0 5-2.23 5-5s-2.23-5-5-5z" />
                    </svg>
                );
                break;
            case 'kup-radio':
                //radio_button_unchecked.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
                    </svg>
                );
                break;
            default:
                //art_track.svg
                resource = (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                    >
                        <path d="M44 26H28v-4h16v4zm0-12H28v4h16v-4zM28 34h16v-4H28v4zm-4-16v12c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V18c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4zm-3 12l-4.5-6-3.5 4.51-2.5-3.01L7 30h14z" />
                    </svg>
                );
                break;
        }
        if (
            (this.renderMode === KupLazyRender.VIEWPORT && this.isInViewport) ||
            (this.renderMode === KupLazyRender.PROPS && this.data) ||
            (this.renderMode === KupLazyRender.BOTH &&
                this.data &&
                this.isInViewport)
        ) {
            let Tag = this.componentName;
            content = <Tag {...this.data}></Tag>;
            className += ' kup-loaded';
        } else if (this.showPlaceholder) {
            content = resource;
            className += ' kup-to-be-loaded';
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host class={className}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">{content}</div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
        this.intObserver.unobserve(this.rootElement);
    }
}
