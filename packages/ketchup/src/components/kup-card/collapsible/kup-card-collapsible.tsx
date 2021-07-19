import { h, VNode } from '@stencil/core';
import type { KupCard } from '../kup-card';
import type { GenericObject } from '../../../types/GenericTypes';
import type { KupDom } from '../../../utils/kup-manager/kup-manager-declarations';
import { FImage } from '../../../f-components/f-image/f-image';
import { collapsibleBar } from '../kup-card-helper';
import { KupCardCSSClasses } from '../kup-card-declarations';
import { KupThemeColorValues } from '../../../utils/kup-theme/kup-theme-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * 1st collapsible card layout, left bar and collapsible chips.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st collapsible layout virtual node.
 */
export function create1(component: KupCard): VNode {
    //Chips
    const chipArray: GenericObject[] = component.data['chip']
        ? component.data['chip']
        : [];
    //Bar color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
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
            class={`collapsible-layout-${component.layoutNumber} ${KupCardCSSClasses.COLLAPSIBLE_CARD}`}
            style={CSSVariables}
        >
            <div class="section-1"></div>
            <div class="section-2">
                <div class="sub-1">
                    <div class="text left">
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                    <div class="text right">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="sub-2">
                    <div class="text">
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class={`sub-3 ${KupCardCSSClasses.COLLAPSIBLE_WRAPPER}`}>
                    {chipArray[0] ? (
                        <kup-chip
                            class={KupCardCSSClasses.COLLAPSIBLE_ELEMENT}
                            id="chip1"
                            {...chipArray[0]}
                        ></kup-chip>
                    ) : null}
                </div>
            </div>
            {collapsibleBar()}
        </div>
    );
}
/**
 * 2nd collapsible card layout, colored text and icon in top right corner.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 2nd collapsible layout virtual node.
 */
export function create2(component: KupCard): VNode {
    //Chips
    const chipArray: GenericObject[] = component.data['chip']
        ? component.data['chip']
        : [];
    //Icon and text colors
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
            class={`collapsible-layout-${component.layoutNumber} ${KupCardCSSClasses.COLLAPSIBLE_CARD}`}
            style={CSSVariables}
        >
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
                <div class={`sub-4 ${KupCardCSSClasses.COLLAPSIBLE_WRAPPER}`}>
                    {chipArray[0] ? (
                        <kup-chip
                            class={KupCardCSSClasses.COLLAPSIBLE_ELEMENT}
                            id="chip1"
                            {...chipArray[0]}
                        ></kup-chip>
                    ) : null}
                </div>
            </div>
            {collapsibleBar()}
        </div>
    );
}
