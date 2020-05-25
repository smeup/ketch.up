import {
    Component,
    Prop,
    Element,
    JSX,
    Host,
    Event,
    EventEmitter,
    h,
} from '@stencil/core';
import { Badge, CssDraw } from './kup-image-declarations';
import { errorLogging } from '../../utils/error-logging';

@Component({
    tag: 'kup-image',
    styleUrl: 'kup-image.scss',
    shadow: true,
})
export class KupImage {
    @Element() rootElement: HTMLElement;

    /**
     * Sets the data of badges.
     */
    @Prop() badgeData: Badge[] = undefined;
    /**
     * The color of the icon, defaults to the main color of the app.
     */
    @Prop({ reflect: true }) color: string = 'var(--kup-icon-color)';
    /**
     * Custom style to be passed to the component.
     */
    @Prop({ reflect: true }) customStyle: string = undefined;
    /**
     * When present, the component will be drawn using CSS.
     */
    @Prop({ reflect: true }) data: CssDraw[] = undefined;
    /**
     * When set to true, a spinner will be displayed until the image finished loading. Not compatible with SVGs.
     */
    @Prop({ reflect: true }) feedback: boolean = false;
    /**
     * The resource used to fetch the image.
     */
    @Prop({ reflect: true }) resource: string = undefined;
    /**
     * The width of the icon, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
     */
    @Prop({ reflect: true }) sizeX: string = '100%';
    /**
     * The height of the icon, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
     */
    @Prop({ reflect: true }) sizeY: string = '100%';

    private isUrl: boolean = false;
    private elStyle = undefined;

    @Event({
        eventName: 'kupImageClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        el: EventTarget;
    }>;

    @Event({
        eventName: 'kupImageLoad',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupLoad: EventEmitter<{
        el: EventTarget;
    }>;

    //---- Methods ----

    onKupClick(e: Event) {
        this.kupClick.emit({
            el: e.target,
        });
    }

    onKupLoad(e: Event) {
        if (this.feedback && this.isUrl) {
            if (this.rootElement.shadowRoot !== undefined) {
                let spinner = this.rootElement.shadowRoot.querySelector(
                    '#feedback'
                );
                spinner.remove();
            }
        }
        this.kupLoad.emit({
            el: e.target,
        });
    }

    //---- Lifecycle hooks ----

    componentWillRender() {
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

    renderFromResource() {
        let svgMask: string = undefined;
        let svgStyle: any = undefined;
        let image: Element = undefined;

        if (!this.isUrl) {
            svgMask = `url('assets/svg/${this.resource}.svg') no-repeat center`;
            svgStyle = {
                mask: svgMask,
                background: this.color,
                webkitMask: svgMask,
            };
            image = (
                <div
                    id="kup-component"
                    style={svgStyle}
                    onClick={(e) => this.onKupClick(e)}
                ></div>
            );
        } else {
            image = (
                <img
                    style={this.elStyle}
                    src={this.resource}
                    onLoad={(e) => this.onKupLoad(e)}
                ></img>
            );
        }

        return (
            <div
                id="kup-component"
                style={svgStyle}
                onClick={(e) => this.onKupClick(e)}
            >
                {image}
            </div>
        );
    }

    renderFromData() {
        const cssDraw = this.data;
        let steps: JSX.Element[] = [];
        let leftProgression: number = 0;

        for (let i = 0; i < this.data.length; i++) {
            let drawStep: JSX.Element = undefined;
            let stepStyle: any = undefined;
            let stepId: string = 'step-' + i;

            if (!cssDraw[i].shape) {
                cssDraw[i].shape = 'bar';
            }
            if (!cssDraw[i].color) {
                cssDraw[i].color = 'transparent';
            }
            if (!cssDraw[i].height) {
                cssDraw[i].height = '100%';
            }
            if (!cssDraw[i].width) {
                cssDraw[i].width = '100%';
            }

            let stepClass = 'css-step bottom-aligned';
            stepStyle = {
                backgroundColor: cssDraw[i].color,
                left: leftProgression + '%',
                height: cssDraw[i].height,
                width: cssDraw[i].width,
            };

            leftProgression += parseFloat(cssDraw[i].width);
            drawStep = (
                <span id={stepId} class={stepClass} style={stepStyle}></span>
            );
            steps.push(drawStep);
        }

        return (
            <div id="kup-component" onClick={(e) => this.onKupClick(e)}>
                {steps}
            </div>
        );
    }

    render() {
        let el: Element = undefined;
        let customStyle: string = undefined;
        let feedback: HTMLElement = undefined;
        let spinnerLayout: number = undefined;
        this.elStyle = {
            height: this.sizeY,
            width: this.sizeX,
        };

        if (this.customStyle) {
            customStyle = <style>{this.customStyle}</style>;
        }

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

        let badgeCollection = [];
        if (this.badgeData) {
            badgeCollection = this.badgeData.map((badge) => {
                return (
                    <kup-badge
                        imageData={badge.imageData}
                        text={badge.text}
                        position={badge.position}
                    />
                );
            });
        }

        if (this.resource) {
            el = this.renderFromResource();
        } else if (this.data) {
            el = this.renderFromData();
        } else {
            let message = 'Resource undefined, not rendering!';
            errorLogging('kup-image', message);
            return;
        }

        return (
            <Host style={this.elStyle}>
                {customStyle}
                {feedback}
                {el}
                {...badgeCollection}
            </Host>
        );
    }
}
