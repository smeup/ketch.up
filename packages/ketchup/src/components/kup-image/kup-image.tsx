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

import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { imageCanvas } from './canvas/kup-image-canvas';
import { KupBadge } from '../kup-badge/kup-badge';
import { FImage } from '../../f-components/f-image/f-image';
import {
    FImageProps,
    FImageData,
} from '../../f-components/f-image/f-image-declarations';
import {
    KupImageClickEventPayload,
    KupImageProps,
} from './kup-image-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-image',
    assetsDirs: ['assets/svg'],
    styleUrl: 'kup-image.scss',
    shadow: true,
})
export class KupImage {
    /**
     * References the root HTML element of the component (<kup-image>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Sets the data of badges.
     * @default null
     */
    @Prop() badgeData: KupBadge[] = null;
    /**
     * The color of the icon, defaults to the CSS variable KupThemeColorValues.ICON.
     * @default KupThemeColorValues.ICON
     */
    @Prop() color: string = `var(${KupThemeColorValues.ICON})`;
    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * When present, the component will be drawn using CSS. Check the 'Drawing with CSS' section of the image showcase for more information.
     * @default null
     */
    @Prop() data: FImageData[] = null;
    /**
     * When set to true, a spinner will be displayed until the image finished loading. Not compatible with SVGs.
     * @default false
     */
    @Prop() feedback: boolean = false;
    /**
     * The image component will create a canvas element on which it's possible to draw. It's a temporary feature that will be fully replaced by CSS drawing in the future.
     * @default false
     */
    @Prop() isCanvas: boolean = false;
    /**
     * The resource used to fetch the image.
     * @default null
     */
    @Prop() resource: string = null;
    /**
     * The width of the icon, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
     * @default '100%'
     */
    @Prop() sizeX: string = '100%';
    /**
     * The height of the icon, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
     * @default '100%'
     */
    @Prop() sizeY: string = '100%';

    /*-------------------------------------------------*/
    /*        I n t e r n a l   V a r i a b l e s      */
    /*-------------------------------------------------*/

    /**
     * Reference to the canvas element.
     */
    private canvas: HTMLCanvasElement;
    /**
     * Instance of the imageCanvas class.
     */
    private imageCanvas: imageCanvas;
    /**
     * True when the resource is an URL.
     */
    private isUrl: boolean = false;
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    @Event({
        eventName: 'kup-image-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupImageClickEventPayload>;

    onKupClick(e: Event) {
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            el: e.target,
        });
    }

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
        return getProps(this, KupImageProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupImageProps, props);
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

    /**
     * Render the canvas variant of kup-image.
     * @todo should be handled inside f-image.
     */
    private renderCanvas(): HTMLDivElement {
        return (
            <div
                id="kup-component"
                onClick={(e) => this.onKupClick(e)}
                class="is-canvas"
            >
                <canvas ref={(el) => (this.canvas = el)}>
                    {this.resource}
                </canvas>
            </div>
        );
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
        this.isUrl = false;
        if (this.resource) {
            if (
                this.resource.indexOf('.') > -1 ||
                this.resource.indexOf('/') > -1 ||
                this.resource.indexOf('\\') > -1
            ) {
                this.isUrl = true;
            }
        }
    }

    componentDidRender() {
        if (this.isCanvas && !this.imageCanvas) {
            this.imageCanvas = new imageCanvas();
        }
        if (this.isCanvas && this.resource) {
            this.canvas.height = this.canvas.clientHeight;
            this.canvas.width = this.canvas.clientWidth;
            this.imageCanvas.drawCanvas(this.resource, this.canvas);
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let el: Element;
        let feedback: HTMLElement;
        let spinnerLayout: number;

        let props: FImageProps = {
            badgeData: this.badgeData,
            color: this.color,
            data: this.data,
            fit: this.rootElement.classList.contains('kup-fit') ? true : false,
            resource: this.resource,
            sizeX: this.sizeX,
            sizeY: this.sizeY,
        };

        let elStyle: {
            height: string;
            minHeight: string;
            width: string;
            minWidth: string;
        } = {
            height: props.sizeY,
            minHeight: props.sizeY,
            width: props.sizeX,
            minWidth: props.sizeX,
        };

        if (this.feedback && this.isUrl) {
            spinnerLayout = 14;
            feedback = (
                <div id="feedback" title="Image not loaded yet...">
                    <kup-spinner
                        dimensions="3px"
                        active
                        layout={spinnerLayout}
                    ></kup-spinner>
                </div>
            );
        }

        if (this.isCanvas) {
            el = this.renderCanvas();
        } else if (props.resource || props.data) {
            el = <FImage {...props}></FImage>;
        } else {
            let message = 'Resource undefined, not rendering!';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return;
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host style={elStyle}>
                {customStyle ? <style>{customStyle}</style> : null}
                {feedback}
                <div id="kup-component" onClick={(e) => this.onKupClick(e)}>
                    {el}
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
