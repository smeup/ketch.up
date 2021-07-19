import {
    Component,
    Event,
    Element,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';

import { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { getProps, setProps } from '../../utils/utils';
import {
    KupRatingClickEventPayload,
    KupRatingProps,
} from './kup-rating-declarations';

@Component({
    tag: 'kup-rating',
    styleUrl: 'kup-rating.scss',
    shadow: true,
})
export class KupRating {
    @Element() rootElement: HTMLElement;
    @State() stars: Array<object> = [];

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Defaults at false. When set to true, the component is disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * Max number of stars (default 5)
     */
    @Prop() maxValue: number = 5;
    /**
     * Rated stars
     */
    @Prop() value: number = 0;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    @Event() kupRatingClick: EventEmitter<KupRatingClickEventPayload>;

    @Watch('value')
    @Watch('maxValue')
    private onValueChanged() {
        this.buildStars(this.value);
    }

    //---- Methods ----

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupRatingProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupRatingProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    onStarClick(newValue: number) {
        if (!this.disabled) {
            this.value = newValue;
            this.buildStars(this.value);
            this.kupRatingClick.emit({
                comp: this,
                id: this.rootElement.id,
                value: this.value,
            });
        }
    }

    onMouseOver(newValue: number) {
        if (!this.disabled) {
            this.buildStars(newValue);
        }
    }

    onMouseOut() {
        if (!this.disabled) {
            this.buildStars(this.value);
        }
    }

    buildStars(numberOfStars: number) {
        let stars = [];

        for (let i = 1; i <= this.maxValue; i++) {
            if (i <= numberOfStars) {
                stars.push(
                    <span
                        class="rating"
                        onMouseOver={() => this.onMouseOver(i)}
                        onMouseOut={() => this.onMouseOut()}
                        onClick={() => this.onStarClick(i)}
                    >
                        &#x2605;
                    </span>
                );
            } else {
                stars.push(
                    <span
                        class="rating"
                        onMouseOver={() => this.onMouseOver(i)}
                        onMouseOut={() => this.onMouseOut()}
                        onClick={() => this.onStarClick(i)}
                    >
                        &#x2606;
                    </span>
                );
            }
        }

        this.stars = stars;
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.onValueChanged();
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
        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div>{this.stars}</div>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
