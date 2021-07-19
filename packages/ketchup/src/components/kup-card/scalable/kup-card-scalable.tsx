import { h, VNode } from '@stencil/core';
import type { KupCard } from '../kup-card';
import type { KupDom } from '../../../utils/kup-manager/kup-manager-declarations';
import { FImage } from '../../../f-components/f-image/f-image';
import { GenericObject } from '../../../types/GenericTypes';
import { KupThemeColorValues } from '../../../utils/kup-theme/kup-theme-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * 1st scalable card layout, column of 2 texts.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 1st scalable layout virtual node.
 */
export function create1(component: KupCard): VNode {
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
                <div class="descr">
                    <div>
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="value">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 2nd scalable card layout, used to display numerical values.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 2nd scalable layout virtual node.
 */
export function create2(component: KupCard): VNode {
    //Image color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Value, decimal value, measurement unit
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
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
                            sizeX="1.25em"
                            sizeY="1.25em"
                        ></FImage>
                    ) : null}
                </div>
                <div class="value-int">
                    <div>
                        {textArray[textIndex] ? textArray[textIndex] : ''},
                    </div>
                </div>
                <div class="value-dec">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="unit">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 3rd scalable card layout, column of 2 texts.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 3rd scalable layout virtual node.
 */
export function create3(component: KupCard): VNode {
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
                <div class="value">
                    <div>
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="descr">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 4th scalable card layout, used to display numerical values with subtitle.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 4th scalable layout virtual node.
 */
export function create4(component: KupCard): VNode {
    //Image color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Value, decimal value, measurement unit, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        [`--color-0`]: colorArray[0]
            ? colorArray[0]
            : `var(${KupThemeColorValues.PRIMARY})`,
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
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
                            sizeX="1.25em"
                            sizeY="1.25em"
                        ></FImage>
                    ) : null}
                </div>
                <div class="value-and-unit">
                    <div class="value-int">
                        <div>
                            {textArray[textIndex] ? textArray[textIndex] : ''},
                        </div>
                    </div>
                    <div class="value-dec">
                        <div>
                            {textArray[++textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>
                    <div class="unit">
                        <div>
                            {textArray[++textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>
                </div>
                <div class="empty-placeholder"></div>
                <div class="descr">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 5th scalable card layout, icon with title and subtitle.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 5th scalable layout virtual node.
 */
export function create5(component: KupCard): VNode {
    //Image color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
                <div class="text-wrapper">
                    <div class="descr">
                        <div>
                            {textArray[textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>

                    <div class="value">
                        <div>
                            {textArray[++textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>
                </div>
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
                            sizeX="1em"
                            sizeY="1em"
                        ></FImage>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
/**
 * 6th scalable card layout, icon with title and subtitle.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 6th scalable layout virtual node.
 */
export function create6(component: KupCard): VNode {
    //Image color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
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
                            sizeX="1em"
                            sizeY="1em"
                        ></FImage>
                    ) : null}
                </div>

                <div class="text-wrapper">
                    <div class="value">
                        <div>
                            {textArray[textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>
                    <div class="descr">
                        <div>
                            {textArray[++textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 * 7th scalable card layout, icon with title and subtitle.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 7th scalable layout virtual node.
 */
export function create7(component: KupCard): VNode {
    //Image color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
                <div class="text-wrapper">
                    <div class="value">
                        <div>
                            {textArray[textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>

                    <div class="descr">
                        <div>
                            {textArray[++textIndex] ? textArray[textIndex] : ''}
                        </div>
                    </div>
                </div>
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
                            sizeX="1em"
                            sizeY="1em"
                        ></FImage>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
/**
 * 8th scalable card layout, icon with title and subtitle.
 * @param {KupCard} component - Card component.
 * @returns {VNode} 8th scalable layout virtual node.
 */
export function create8(component: KupCard): VNode {
    //Image color
    const colorArray: string[] = component.data['color']
        ? component.data['color']
        : [];
    //Icon
    const imageArray: GenericObject[] = component.data['image']
        ? component.data['image']
        : [];
    //Title, subtitle
    let textIndex: number = 0;
    const textArray: string[] = component.data['text']
        ? component.data['text']
        : [];
    //Dynamic CSS variables
    let CSSVariables = {
        ['--multiplier']: '1',
    };
    return (
        <div
            class={`scalable-layout-${component.layoutNumber} scalable-card`}
            style={CSSVariables}
        >
            <div class="scalable-element">
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
                            sizeX="1em"
                            sizeY="1em"
                        ></FImage>
                    ) : null}
                </div>
                <div class="value">
                    <div>
                        {textArray[textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
                <div class="descr">
                    <div>
                        {textArray[++textIndex] ? textArray[textIndex] : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
