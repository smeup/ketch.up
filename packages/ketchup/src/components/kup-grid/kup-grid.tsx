import {
    Component,
    Element,
    forceUpdate,
    Host,
    h,
    Method,
    Prop,
    VNode,
} from '@stencil/core';

import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { getProps, setProps } from '../../utils/utils';
import { KupGridProps } from './kup-grid-declarations';

@Component({
    tag: 'kup-grid',
    styleUrl: 'kup-grid.scss',
    shadow: true,
})
export class KupGrid {
    /**
     * References the root HTML element of the component (<kup-grid>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * The number of columns displayed by the grid, the default behavior is 12.
     * @default 12
     */
    @Prop() columns: number = 12;
    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * When set to true, forces the content on a single line.
     * @default false
     */
    @Prop() singleLine: boolean = false;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

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
        return getProps(this, KupGridProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupGridProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
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
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        const slots: HTMLCollection = this.rootElement.children;
        if (!slots || slots.length === 0) {
            this.kupManager.debug.logMessage(
                this,
                'Missing slots, not rendering!',
                KupDebugCategory.WARNING
            );
            return;
        }

        const content: VNode[] = [];

        for (let i = 0; i < slots.length; i++) {
            let el: VNode = null;

            if (this.singleLine) {
                el = <slot name={`${i}`}></slot>;
            } else {
                let span: number = 1;
                if (slots[i]['span']) {
                    span = slots[i]['span'];
                }
                el = (
                    <div
                        class={`layout-grid__cell layout-grid__cell--span-${span}`}
                    >
                        <slot name={`${i}`}></slot>
                    </div>
                );
            }
            content.push(el);
        }

        const style: GenericObject = {
            ['--columns']: this.columns,
        };

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host style={style}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div
                        class={this.singleLine ? 'flex-layout' : 'layout-grid'}
                    >
                        <div
                            class={
                                this.singleLine
                                    ? 'flex-layout__inner'
                                    : 'layout-grid__inner'
                            }
                        >
                            {content}
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
