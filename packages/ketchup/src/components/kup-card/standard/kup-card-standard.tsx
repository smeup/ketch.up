import { h, VNode } from '@stencil/core';
import type { KupCard } from '../kup-card';
import type { GenericObject } from '../../../types/GenericTypes';
import type { KupDom } from '../../../utils/kup-manager/kup-manager-declarations';
import { FImage } from '../../../f-components/f-image/f-image';
import { compList } from '../kup-card-helper';
import { KupTabBarData } from '../../kup-tab-bar/kup-tab-bar-declarations';
import {
    KupLanguageColumn,
    KupLanguageGeneric,
} from '../../../utils/kup-language/kup-language-declarations';
import { FChipType } from '../../../f-components/f-chip/f-chip-declarations';
import { KupCardCSSClasses, KupCardIds } from '../kup-card-declarations';
import { KupColumnMenuIds } from '../../../utils/kup-column-menu/kup-column-menu-declarations';
import { KupThemeColorValues } from '../../../utils/kup-theme/kup-theme-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * 1st standard card layout, inspired by Material Design.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st standard layout virtual node.
 */
export function create1(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Cover image
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle and description
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    return (
        <div
            class={`standard-layout-${component.layoutNumber} ${
                buttonArray.length > 0 ? KupCardCSSClasses.HAS_ACTIONS : ''
            }`}
        >
            <div class="mdc-ripple-surface">
                {imageArray[0] ? (
                    <div class="section-1">
                        <FImage
                            id="image1"
                            {...imageArray[0]}
                            sizeX="100%"
                            sizeY="100%"
                        ></FImage>
                    </div>
                ) : null}
                <div class="section-2">
                    {textArray[textIndex] ? (
                        <div class="sub-2 title">
                            <div>{textArray[textIndex]}</div>
                        </div>
                    ) : null}
                    {textArray[++textIndex] ? (
                        <div class="sub-2 subtitle">
                            <div>{textArray[textIndex]}</div>
                        </div>
                    ) : null}
                    {textArray[++textIndex] ? (
                        <div class="sub-2 description">
                            <div>{textArray[textIndex]}</div>
                        </div>
                    ) : null}
                </div>
            </div>
            {buttonArray.length > 0 ? (
                <div class="section-3">{compList(buttonArray, 'button')}</div>
            ) : null}
        </div>
    );
}
/**
 * 2nd standard card layout, inspired by Material Design.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 2nd standard layout virtual node.
 */
export function create2(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Cover image
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle and description
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    return (
        <div
            class={`standard-layout-${component.layoutNumber} ${
                buttonArray.length > 0 ? KupCardCSSClasses.HAS_ACTIONS : ''
            }`}
        >
            <div class="section-1">
                {textArray[textIndex] ? (
                    <div class="sub-1 title">
                        <div>{textArray[textIndex]}</div>
                    </div>
                ) : null}
                {textArray[++textIndex] ? (
                    <div class="sub-1 subtitle">
                        <div>{textArray[textIndex]}</div>
                    </div>
                ) : null}
            </div>
            <div class="mdc-ripple-surface">
                {imageArray[0] ? (
                    <div class="section-2">
                        <FImage
                            id="image1"
                            {...imageArray[0]}
                            sizeX="100%"
                            sizeY="100%"
                        ></FImage>
                    </div>
                ) : null}
                <div class="section-3">
                    {textArray[++textIndex] ? (
                        <div class="sub-3 description">
                            <div>{textArray[textIndex]}</div>
                        </div>
                    ) : null}
                </div>
            </div>
            {buttonArray.length > 0 ? (
                <div class="section-4">{compList(buttonArray, 'button')}</div>
            ) : null}
        </div>
    );
}
/**
 * 3rd standard card layout, inspired by Material Design.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 3rd standard layout virtual node.
 */
export function create3(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Cover image
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle and description
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    return (
        <div
            class={`standard-layout-${component.layoutNumber} ${
                buttonArray ? KupCardCSSClasses.HAS_ACTIONS : ''
            }`}
        >
            <div class="mdc-ripple-surface">
                <div class="section-1">
                    <div class="media">
                        {imageArray[0] ? (
                            <FImage
                                id="image1"
                                {...imageArray[0]}
                                sizeX="100%"
                                sizeY="100%"
                            ></FImage>
                        ) : null}
                        <div class="text-on-media">
                            {textArray[textIndex] ? (
                                <div class="sub-1 title">
                                    <div>{textArray[textIndex]}</div>
                                </div>
                            ) : null}
                            {textArray[++textIndex] ? (
                                <div class="sub-1 subtitle">
                                    <div>{textArray[textIndex]}</div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div class="section-2">
                    {textArray[++textIndex] ? (
                        <div class="sub-2 description">
                            <div>{textArray[textIndex]}</div>
                        </div>
                    ) : null}
                </div>
            </div>
            {buttonArray.length > 0 ? (
                <div class="section-3">{compList(buttonArray, 'button')}</div>
            ) : null}
        </div>
    );
}
/**
 * 4th standard card layout, inspired by Material Design.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 4th standard layout virtual node.
 */
export function create4(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Left image
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    return (
        <div
            class={`standard-layout-${component.layoutNumber} ${
                buttonArray ? KupCardCSSClasses.HAS_ACTIONS : ''
            }`}
        >
            <div class="mdc-ripple-surface">
                <div class="section-1">
                    {imageArray[0] ? (
                        <div class="sub-1 image">
                            <FImage
                                id="image1"
                                {...imageArray[0]}
                                sizeX="100%"
                                sizeY="100%"
                            ></FImage>
                        </div>
                    ) : null}
                    <div class="text">
                        {textArray[textIndex] ? (
                            <div class="sub-1 title">
                                <div>{textArray[textIndex]}</div>
                            </div>
                        ) : null}
                        {textArray[++textIndex] ? (
                            <div class="sub-1 subtitle">
                                <div>{textArray[textIndex]}</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div class="section-2">
                {buttonArray ? compList(buttonArray, 'button') : ''}
            </div>
        </div>
    );
}
/**
 * 5th standard card layout, useful to display TODOs with extensive information.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 5th standard layout virtual node.
 */
export function create5(component: KupCard): VNode {
    //Action button
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Top and bottom bars colors
    let colorIndex: number = 0;
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Left icon and right image
    let imageIndex: number = 0;
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Progress bar
    const progressbarArray: GenericObject[] = component.data['progressbar']
        ? component.data['progressbar']
        : [];
    //6 text slots
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        [`--color-0`]: colorArray[colorIndex]
            ? colorArray[colorIndex]
            : `var(${KupThemeColorValues.PRIMARY})`,
        [`--color-1`]: colorArray[++colorIndex]
            ? colorArray[colorIndex]
            : `rgba(var(${KupThemeColorValues.PRIMARY}-rgb),0.1)`,
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div class="section-1"></div>
            <div class="section-2">
                <div class="sub-2 icon">
                    {imageArray[imageIndex] ? (
                        <FImage
                            id="image1"
                            {...imageArray[imageIndex]}
                            sizeX="100%"
                            sizeY="100%"
                        ></FImage>
                    ) : null}
                </div>
                <div class="sub-2 text">
                    <div class="desc-text">
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                    <div class="alt-text">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-2 image">
                    {imageArray[++imageIndex] ? (
                        <FImage
                            id="image1"
                            {...imageArray[imageIndex]}
                            sizeX="100%"
                            sizeY="100%"
                        ></FImage>
                    ) : null}
                </div>
            </div>
            <div class="section-3">
                <div class="sub-3 progress-bar">
                    {progressbarArray[0] ? (
                        <kup-progress-bar
                            id="progressBar1"
                            is-slim
                            {...progressbarArray[0]}
                        ></kup-progress-bar>
                    ) : null}
                </div>
                <div class="sub-3 button">
                    {buttonArray[0] ? (
                        <kup-button
                            id="button1"
                            {...buttonArray[0]}
                        ></kup-button>
                    ) : null}
                </div>
            </div>
            <div class="section-4">
                <div class="sub-4 text">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                    <div class="alt-text">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-4 text">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                    <div class="alt-text">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 6th standard card layout, useful to display TODOs in a compact view.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 6th standard layout virtual node.
 */
export function create6(component: KupCard): VNode {
    //Action button
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    //Left bar color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Radial progress bar
    const progressbarArray: GenericObject[] = component.data['progressbar']
        ? component.data['progressbar']
        : [];
    //Left and center text
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        ['--color-0']: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
        ['--dyn-color-0']: 'white',
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div class="section-1">
                <div class="alt-text">
                    {textArray[textIndex] ? textArray[textIndex] : ''}
                </div>
            </div>
            <div class="section-2">
                <div class="sub-2">
                    {progressbarArray[0] ? (
                        <kup-progress-bar
                            id="progressBar1"
                            is-radial
                            {...progressbarArray[0]}
                        ></kup-progress-bar>
                    ) : null}
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                {buttonArray[0] ? (
                    <kup-button id="button1" {...buttonArray[0]}></kup-button>
                ) : null}
            </div>
        </div>
    );
}
/**
 * 7th standard card layout, centered image and text.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 7th standard layout virtual node.
 */
export function create7(component: KupCard): VNode {
    //Top bar color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Center image
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //3 text slots
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        [`--color-0`]: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div class="section-1"></div>
            <div class="section-2">
                <div class="sub-2 image">
                    {imageArray[0] ? (
                        <FImage
                            id="image1"
                            {...imageArray[0]}
                            sizeX="100%"
                            sizeY="100%"
                        ></FImage>
                    ) : null}
                </div>
                <div class="sub-2 text">
                    <div>
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
            <div class="section-3">
                <div class="sub-3 alt-text">
                    {textArray[++textIndex] ? textArray[textIndex] : ''}
                </div>
                <div class="sub-3 alt-text">
                    {textArray[++textIndex] ? textArray[textIndex] : ''}
                </div>
            </div>
        </div>
    );
}
/**
 * 8th standard card layout, useful to display a list of chips.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 8th standard layout virtual node.
 */
export function create8(component: KupCard): VNode {
    //Chips
    const chipArray: GenericObject[] = component.data['chip']
        ? component.data['chip']
        : [];
    //Background and corner text colors
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Right corner icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //3 text slots
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        [`--color-0`]: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div class="background"></div>
            <div class="section-1">
                <div class="sub-1">
                    <div class="text">
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-2">
                    <div class="text">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-3">
                    <div class="image">
                        {imageArray[0] ? (
                            <FImage
                                id="image1"
                                {...imageArray[0]}
                                sizeX="24px"
                                sizeY="24px"
                            ></FImage>
                        ) : null}
                    </div>
                    <div class="text">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
            <div class="section-2">
                {chipArray[0] ? (
                    <kup-chip id="chip1" {...chipArray[0]}></kup-chip>
                ) : null}
            </div>
        </div>
    );
}
/**
 * 9th standard card layout, chart displayed on the right with some info on the left.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 9th standard layout virtual node.
 */
export function create9(component: KupCard): VNode {
    //Chart
    const chartArray: GenericObject[] = component.data['chart']
        ? component.data['chart']
        : [];
    //Icon color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Left icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //3 text slots
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        [`--color-0`]: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div class="section-1">
                <div class="sub-1">
                    <div class="text description">
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-2">
                    <div class="icon">
                        {imageArray[0] ? (
                            <FImage
                                color={
                                    colorArray[0]
                                        ? colorArray[0]
                                        : `var(${KupThemeColorValues.PRIMARY})`
                                }
                                id="image1"
                                {...imageArray[0]}
                                sizeX="3em"
                                sizeY="3em"
                            ></FImage>
                        ) : null}
                    </div>
                    <div class="text-wrapper">
                        <div class="text title">
                            <div>
                                {textArray[++textIndex]
                                    ? textArray[textIndex]
                                    : ''}
                            </div>
                        </div>
                        <div class="text subtitle">
                            <div>
                                {textArray[++textIndex]
                                    ? textArray[textIndex]
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-2">
                {chartArray[0] ? (
                    <kup-chart id="chart1" {...chartArray[0]}></kup-chart>
                ) : null}
            </div>
        </div>
    );
}
/**
 * 10th standard card layout, chart displayed on the left with some info on the right.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 10th standard layout virtual node.
 */
export function create10(component: KupCard): VNode {
    //Chart
    const chartArray: GenericObject[] = component.data['chart']
        ? component.data['chart']
        : [];
    //Icon color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Left icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //3 text slots
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        [`--color-0`]: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div class="section-1">
                {chartArray[0] ? (
                    <kup-chart id="chart1" {...chartArray[0]}></kup-chart>
                ) : null}
            </div>
            <div class="section-2">
                <div class="sub-1">
                    <div class="text description">
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-2">
                    <div class="icon">
                        {imageArray[0] ? (
                            <FImage
                                color={
                                    colorArray[0]
                                        ? colorArray[0]
                                        : `var(${KupThemeColorValues.PRIMARY})`
                                }
                                id="image1"
                                {...imageArray[0]}
                                sizeX="3em"
                                sizeY="3em"
                            ></FImage>
                        ) : null}
                    </div>
                    <div class="text-wrapper">
                        <div class="text title">
                            <div>
                                {textArray[++textIndex]
                                    ? textArray[textIndex]
                                    : ''}
                            </div>
                        </div>
                        <div class="text subtitle">
                            <div>
                                {textArray[++textIndex]
                                    ? textArray[textIndex]
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 11th standard card layout, chart displayed on the right with some info on the left, visible when hovering on the colored bar.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 11th standard layout virtual node.
 */
export function create11(component: KupCard): VNode {
    //Chart
    const chartArray: GenericObject[] = component.data['chart']
        ? component.data['chart']
        : [];
    //Icon and bar color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Left icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //3 text slots
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables: GenericObject = {
        [`--color-0`]: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
    };
    return (
        <div
            class={`standard-layout-${component.layoutNumber}`}
            style={CSSVariables}
        >
            <div
                class="section-1"
                onMouseEnter={(e: MouseEvent) => {
                    let el: any = e.currentTarget;
                    el.style.minWidth = el.scrollWidth + 10 + 'px';
                    el.style.maxWidth = el.scrollWidth + 10 + 'px';
                }}
                onMouseLeave={(e: MouseEvent) => {
                    let el: any = e.currentTarget;
                    el.style.minWidth = '';
                    el.style.maxWidth = '';
                }}
            >
                <div class="sub-1 dyn-color">
                    <div class="text description">
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-2">
                    <div class="icon">
                        {imageArray[0] ? (
                            <FImage
                                color={
                                    colorArray[0]
                                        ? colorArray[0]
                                        : `var(${KupThemeColorValues.PRIMARY})`
                                }
                                id="image1"
                                {...imageArray[0]}
                                sizeX="3em"
                                sizeY="3em"
                            ></FImage>
                        ) : null}
                    </div>
                    <div class="text-wrapper">
                        <div class="text title">
                            <div>
                                {textArray[++textIndex]
                                    ? textArray[textIndex]
                                    : ''}
                            </div>
                        </div>
                        <div class="text subtitle">
                            <div>
                                {textArray[++textIndex]
                                    ? textArray[textIndex]
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-2">
                {chartArray[0] ? (
                    <kup-chart id="chart1" {...chartArray[0]}></kup-chart>
                ) : null}
            </div>
        </div>
    );
}
/**
 * 12th standard card layout, used for column menus in tree and data table.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 12th standard layout virtual node.
 */
export function create12(component: KupCard): VNode {
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    const checkboxArray: GenericObject[] = component.data['checkbox']
        ? component.data['checkbox']
        : [];
    const datepickerArray: GenericObject[] = component.data['datepicker']
        ? component.data['datepicker']
        : [];
    const textfieldArray: GenericObject[] = component.data['textfield']
        ? component.data['textfield']
        : [];
    const timepickerArray: GenericObject[] = component.data['timepicker']
        ? component.data['timepicker']
        : [];
    return (
        <div class={`standard-layout-${component.layoutNumber} `}>
            {buttonArray.length > 0 ? (
                <div class="section-1">
                    {buttonArray.length > 0
                        ? compList(buttonArray, 'button')
                        : null}
                </div>
            ) : null}
            <div
                class={`section-2 ${
                    textfieldArray.length > 0 ||
                    datepickerArray.length > 0 ||
                    timepickerArray.length > 0
                        ? KupCardCSSClasses.HAS_CONTENT
                        : ''
                }`}
            >
                {datepickerArray.length > 0
                    ? compList(datepickerArray, 'datepicker')
                    : null}
                {textfieldArray.length > 0
                    ? compList(textfieldArray, 'textfield')
                    : null}
                {timepickerArray.length > 0
                    ? compList(timepickerArray, 'timepicker')
                    : null}
            </div>
            {checkboxArray.length > 0 ? (
                <div class="section-3">
                    {compList(checkboxArray, 'checkbox')}
                </div>
            ) : null}
        </div>
    );
}
/**
 * 13th standard card layout, buttons and text lines, used for debug window.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 13th standard layout virtual node.
 */
export function create13(component: KupCard): VNode {
    //Action buttons
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    const buttonArrayMdcw: GenericObject[] = component.data['buttonmdcw']
        ? component.data['buttonmdcw']
        : [];
    //Combobox list
    const comboboxArray: GenericObject[] = component.data['combobox']
        ? component.data['combobox']
        : [];
    //String list
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Textfield list
    const textfieldArray: GenericObject[] = component.data['textfield']
        ? component.data['textfield']
        : [];
    return (
        <div
            class={`standard-layout-${component.layoutNumber} ${
                buttonArray.length > 0 || buttonArrayMdcw.length > 0
                    ? KupCardCSSClasses.HAS_ACTIONS
                    : ''
            }`}
        >
            <div>
                {buttonArray.length > 0 ||
                buttonArrayMdcw.length > 0 ||
                textfieldArray.length > 0 ? (
                    <div class="section-1">
                        {compList(buttonArray, 'button')}
                        {compList(buttonArrayMdcw, 'buttonmdcw')}
                        {compList(textfieldArray, 'textfield')}
                        {compList(comboboxArray, 'combobox')}
                    </div>
                ) : null}
                {textArray.length > 0 ? (
                    <div class="section-2">{compList(textArray, 'text')}</div>
                ) : null}
            </div>
        </div>
    );
}
/**
 * 14th standard card layout, used for column menus in tree and data table (with tabs). This is a very specifically-designed layout, so correct ids are a must.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 14th standard layout virtual node.
 */
export function create14(component: KupCard): VNode {
    const autocompleteArray: GenericObject[] = component.data['autocomplete']
        ? component.data['autocomplete']
        : [];
    const buttonArray: GenericObject[] = component.data['button']
        ? component.data['button']
        : [];
    const checkboxArray: GenericObject[] = component.data['checkbox']
        ? component.data['checkbox']
        : [];
    const chipArray: GenericObject[] = component.data['chip']
        ? component.data['chip']
        : [];
    const datepickerArray: GenericObject[] = component.data['datepicker']
        ? component.data['datepicker']
        : [];
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    const objectArray: GenericObject[] = component.data['object']
        ? component.data['object']
        : [];
    const switchArray: GenericObject[] = component.data['switch']
        ? component.data['switch']
        : [];
    const tabbarArray: GenericObject[] = component.data['tabbar']
        ? component.data['tabbar']
        : [];
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    const textfieldArray: GenericObject[] = component.data['textfield']
        ? component.data['textfield']
        : [];
    const timepickerArray: GenericObject[] = component.data['timepicker']
        ? component.data['timepicker']
        : [];
    const treeArray: GenericObject[] = component.data['tree']
        ? component.data['tree']
        : [];
    // Setting up currently visible view.
    const tabsValues: string[] = [];
    let viewIndex: number = 1;
    let visibleView: number = 1;
    if (tabbarArray[0] && tabbarArray[0].data) {
        for (let index = 0; index < tabbarArray[0].data.length; index++) {
            const tab: KupTabBarData = tabbarArray[0].data[index];
            tabsValues.push(tab.value);
            if (tab.active) {
                visibleView = index + 1;
            }
        }
    }
    // Setting up buttons.
    const buttonsIds: string[] = [];
    for (let index = 0; index < buttonArray.length; index++) {
        const button: GenericObject = buttonArray[index];
        if (button['id']) {
            buttonsIds.push(button['id']);
        }
    }
    // Setting up switches.
    const switchesIds: string[] = [];
    for (let index = 0; index < switchArray.length; index++) {
        const switchEl: GenericObject = switchArray[index];
        if (switchEl['id']) {
            switchesIds.push(switchEl['id']);
        }
    }
    return (
        <div class={`standard-layout-${component.layoutNumber} `}>
            {objectArray[0] ? (
                <div class="section-1">
                    {imageArray[0] ? (
                        <FImage
                            id="image1"
                            {...imageArray[0]}
                            sizeX="84px"
                            sizeY="84px"
                        ></FImage>
                    ) : (
                        <div class="sub-spinner">
                            <kup-spinner
                                active={true}
                                dimensions="7px"
                                layout={14}
                            />
                        </div>
                    )}
                    <div class="sub-1">
                        {textArray[0] ? (
                            <div class="title">
                                <span
                                    class={`label ${KupCardCSSClasses.CLICKABLE_LINK}`}
                                    id="title-link"
                                >
                                    {textArray[0]}
                                </span>
                                {buttonsIds.includes(
                                    KupColumnMenuIds.BUTTON_OPEN_IN_NEW
                                ) ? (
                                    <kup-button
                                        {...buttonArray.find(
                                            (x) =>
                                                x.id ===
                                                KupColumnMenuIds.BUTTON_OPEN_IN_NEW
                                        )}
                                    />
                                ) : null}
                                {buttonsIds.includes(
                                    KupColumnMenuIds.BUTTON_SEARCH
                                ) ? (
                                    <kup-button
                                        {...buttonArray.find(
                                            (x) =>
                                                x.id ===
                                                KupColumnMenuIds.BUTTON_SEARCH
                                        )}
                                    />
                                ) : null}
                                {buttonsIds.includes(
                                    KupColumnMenuIds.BUTTON_NEW
                                ) ? (
                                    <kup-button
                                        {...buttonArray.find(
                                            (x) =>
                                                x.id ===
                                                KupColumnMenuIds.BUTTON_NEW
                                        )}
                                    />
                                ) : null}
                            </div>
                        ) : null}

                        {textArray[1] && textArray[2] ? (
                            <div class="info">
                                <span class="label">{textArray[1]}</span>
                                <span class="value">{textArray[2]}</span>
                            </div>
                        ) : null}

                        {textArray[3] && textArray[4] ? (
                            <div class="info">
                                <span class="label">{textArray[3]}</span>
                                <span class="value">{textArray[4]}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
            <div class="section-2">
                {tabbarArray[0] ? (
                    <kup-tab-bar
                        {...tabbarArray[0]}
                        id={KupCardIds.VIEW_SELECTOR}
                    />
                ) : null}
            </div>
            <div class="section-3">
                {tabsValues.includes(KupLanguageGeneric.FILTERS) ? (
                    <div
                        class={`${KupCardCSSClasses.CARD_VIEW} ${
                            KupCardCSSClasses.VIEW_PREFIX
                        }${viewIndex} ${
                            visibleView === viewIndex++
                                ? KupCardCSSClasses.VISIBLE
                                : ''
                        }`}
                    >
                        <div
                            class={`sub-field ${
                                textfieldArray.length > 0 ||
                                datepickerArray.length > 0 ||
                                timepickerArray.length > 0
                                    ? KupCardCSSClasses.HAS_CONTENT
                                    : ''
                            }`}
                        >
                            {datepickerArray.length > 0
                                ? compList(datepickerArray, 'datepicker')
                                : null}
                            {textfieldArray.length > 0
                                ? compList(textfieldArray, 'textfield')
                                : null}
                            {timepickerArray.length > 0
                                ? compList(timepickerArray, 'timepicker')
                                : null}
                        </div>
                        {checkboxArray.length > 0 ? (
                            <div class="sub-checkbox">
                                {compList(checkboxArray, 'checkbox')}
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {tabsValues.includes(KupLanguageColumn.COLUMNS) ? (
                    <div
                        class={`${KupCardCSSClasses.CARD_VIEW} ${
                            KupCardCSSClasses.VIEW_PREFIX
                        }${viewIndex} ${
                            visibleView === viewIndex++
                                ? KupCardCSSClasses.VISIBLE
                                : ''
                        }`}
                    >
                        <div class="sub-button">
                            {buttonsIds.includes(
                                KupColumnMenuIds.BUTTON_REMOVE
                            ) ? (
                                <kup-button
                                    {...buttonArray.find(
                                        (x) =>
                                            x.id ===
                                            KupColumnMenuIds.BUTTON_REMOVE
                                    )}
                                />
                            ) : null}
                            {buttonsIds.includes(
                                KupColumnMenuIds.BUTTON_DESCRIPTION
                            ) ? (
                                <kup-button
                                    {...buttonArray.find(
                                        (x) =>
                                            x.id ===
                                            KupColumnMenuIds.BUTTON_DESCRIPTION
                                    )}
                                />
                            ) : null}
                        </div>
                        <div class="sub-chip">
                            {chipArray[0] ? (
                                <kup-chip
                                    {...chipArray[0]}
                                    type={FChipType.INPUT}
                                    id={KupCardIds.COLUMNS_LIST}
                                />
                            ) : (
                                <kup-chip
                                    type={FChipType.INPUT}
                                    id={KupCardIds.COLUMNS_LIST}
                                />
                            )}
                            {buttonsIds.includes(
                                KupColumnMenuIds.BUTTON_APPLY
                            ) ? (
                                <kup-button
                                    {...buttonArray.find(
                                        (x) =>
                                            x.id ===
                                            KupColumnMenuIds.BUTTON_APPLY
                                    )}
                                />
                            ) : null}
                        </div>
                        {objectArray[0] ? (
                            <div class="sub-tree">
                                {treeArray[0] ? (
                                    <kup-tree
                                        class="kup-full-width"
                                        globalFilter
                                        {...treeArray[0]}
                                        id={KupCardIds.EXTRA_COLUMNS}
                                    />
                                ) : (
                                    <div class="sub-spinner">
                                        <kup-spinner
                                            active={true}
                                            dimensions="8px"
                                            layout={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {tabsValues.includes(KupLanguageGeneric.SETTINGS) ? (
                    <div
                        class={`${KupCardCSSClasses.CARD_VIEW} ${
                            KupCardCSSClasses.VIEW_PREFIX
                        }${viewIndex} ${
                            visibleView === viewIndex++
                                ? KupCardCSSClasses.VISIBLE
                                : ''
                        }`}
                    >
                        <div class="sub-autocomplete">
                            {autocompleteArray.length > 0
                                ? compList(autocompleteArray, 'autocomplete')
                                : null}
                        </div>
                        <div class="sub-switch">
                            {switchesIds.includes(
                                KupColumnMenuIds.SWITCH_KEY
                            ) ? (
                                <kup-switch
                                    {...switchArray.find(
                                        (x) =>
                                            x.id === KupColumnMenuIds.SWITCH_KEY
                                    )}
                                />
                            ) : null}
                            {switchesIds.includes(
                                KupColumnMenuIds.SWITCH_GROUP
                            ) ? (
                                <kup-switch
                                    {...switchArray.find(
                                        (x) =>
                                            x.id ===
                                            KupColumnMenuIds.SWITCH_GROUP
                                    )}
                                />
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
