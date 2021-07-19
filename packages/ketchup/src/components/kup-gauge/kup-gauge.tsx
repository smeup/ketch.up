import {
    Component,
    Element,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
} from '@stencil/core';

import { GenericObject, KupComponent } from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { getProps, setProps, unformattedStringToFormattedStringNumber } from '../../utils/utils';
import { KupGaugeProps } from './kup-gauge-declarations';

import { arc } from 'd3-shape';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';

@Component({
    tag: 'kup-gauge',
    styleUrl: 'kup-gauge.scss',
    shadow: true,
})
export class KupGauge {
    @Element() rootElement: HTMLElement;

    /**
     * Sets how much the arc of the gauge should be thick.
     * @namespace kup-gauge.arcThickness
     * @see kup-gauge.size
     */
    @Prop() arcThickness: number = 30;
    /**
     * Array of three elements to specify the color of the arcs.
     */
    @Prop() colors: string[] = [
        `var(${KupThemeColorValues.SUCCESS})`,
        `var(${KupThemeColorValues.WARNING})`,
        `var(${KupThemeColorValues.DANGER})`,
    ];
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * The first threshold, establishing the length of the first and second arc.
     */
    @Prop() firstThreshold?: number;
    /**
     * The distance the label and the value has from the gauge graph.
     */
    @Prop({ mutable: true }) labelDistance: number = 20;
    /**
     * The maximum value reachable in the current graph.
     */
    @Prop({ mutable: true }) maxValue: number = 100;
    /**
     * A string which will be appended to the displayed values of the component.
     */
    @Prop() measurementUnit: string = '';
    /**
     * The minimum value reachable in the current graph.
     */
    @Prop({ mutable: true }) minValue: number = -100;
    /**
     * When true, shows a rounded needle.
     */
    @Prop() needleCircle: boolean = false;
    /**
     * When true, ignore thresholds in gauge and show colored value's arc.
     */
    @Prop() onlyValue: boolean = false;
    /**
     * When true, the colors inside the colors array are used in the reversed order.
     */
    @Prop() reverseColors: boolean = false;
    /**
     * The second threshold, establishing the length of the second and third arc.
     */
    @Prop() secondThreshold?: number;
    /**
     * If set to false, threshold values of the gauge are not displayed.
     */
    @Prop() showLabels: boolean = true;
    /**
     * If set to false, the maximum and minimum values of the gauge are not displayed.
     */
    @Prop() showMaxmin: boolean = true;
    /**
     * If set to false, the current value of the gauge is not displayed.
     */
    @Prop() showValue: boolean = true;
    /**
     * Con be used change the viewbox of the SVG.
     * By manipulating this value, some customizations of the aspect of the gauge is achievable.
     * @namespace kup-gauge.size
     * @see kup-gauge.arcThickness
     */
    @Prop() size: number = 300;
    /**
     * The current value of the gauge.
     * The gauge's needle points to the percentage based on this prop.
     */
    @Prop({ mutable: true }) value: number = 0;
    /**
     * The current size of gauge's value.
     * Correct values are: 0,1,2 or 3.
     */
    @Prop() valueSize: number = 0;
    /**
     * Set Width gauge.
     */
    @Prop() widthComponent: string = '100%';

    //---- Internal not reactive state ----
    // Arcs generator
    private arcGenerator = arc();

    /**
     * Holds the maximum positive interval.
     * Percentages are calculated as it follows:
     * MIN = 0 = the value the prop minValue gets transformed to\
     * MAX = ABSOLUTE(minValue - maxValue) = the maxValuePositive holds this value
     * TVALUE = value - minValue = any value, which needs to be represented on the chart
     * @namespace kup-gauge.maxValuePositive
     */
    private maxValuePositive = 0;
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
        return getProps(this, KupGaugeProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupGaugeProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    //---- Utility functions ----
    // Manipulates and transforms degrees to percentage and vice versa.

    percToDeg(perc) {
        return perc * 360;
    }

    degToRad(deg) {
        return (deg * Math.PI) / 180;
    }

    percToRad(perc) {
        return this.degToRad(this.percToDeg(perc));
    }

    /**
     * Given a valid value, minValue <= value <= maxValue, calculates this value as a percentage of the interval [minValue, maxValue]
     * @param {number} valueToPercentage - The value to be calculated as a percentage
     * @see kup-gauge.maxValuePositive
     */
    calculateValuePercentage(valueToPercentage: number = 0): number {
        return (valueToPercentage - this.minValue) / this.maxValuePositive;
    }

    calculateValueFontSize(): string {
        switch (this.valueSize) {
            case 3:
                return '350%';
            case 2:
                return '325%';
            case 1:
                return '300%';
            default:
            case 0:
                return '275%';
        }
    }

    //---- Rendering functions ----
    /**
     * Provided all the necessary data, returns the string necessary for a <path/> element to build the gauge needle.
     * @param needleLength - A pure number of viewbox units indicating the needle lenght.
     * @param needleBaseRadius - Sets the needle radius in viewbox units.
     * @param centerX - X coordinate of the center of the base needle.
     * @param centerY - Y coordinate of the center of the base needle.
     * @param rotationPercentage {number} - A percentage number setting the current rotation of the needle. (0 < rotationPercentage < 1)
     * @returns {string}
     */
    paintNeedle(
        needleLength: number,
        needleBaseRadius: number,
        centerX: number,
        centerY: number,
        rotationPercentage: number = 0
    ): string {
        let leftX, leftY, rightX, rightY, thetaRad, topX, topY;
        thetaRad = this.percToRad(rotationPercentage / 2); // Since the gauge is a semicircle, we must divide the percentage in half to have the correct angle
        topX = centerX - needleLength * Math.cos(thetaRad);
        topY = centerY - needleLength * Math.sin(thetaRad);
        leftX = centerX - needleBaseRadius * Math.cos(thetaRad - Math.PI / 2);
        leftY = centerY - needleBaseRadius * Math.sin(thetaRad - Math.PI / 2);
        rightX = centerX - needleBaseRadius * Math.cos(thetaRad + Math.PI / 2);
        rightY = centerY - needleBaseRadius * Math.sin(thetaRad + Math.PI / 2);
        return (
            'M ' +
            leftX +
            ' ' +
            leftY +
            ' L ' +
            topX +
            ' ' +
            topY +
            ' L ' +
            rightX +
            ' ' +
            rightY
        );
    }

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
        if (!this.labelDistance) {
            this.labelDistance = 20;
        }
        if (this.maxValue === undefined || this.maxValue === null) {
            this.maxValue = 100;
        }
        if (this.minValue === undefined || this.minValue === null) {
            this.minValue = -100;
        }
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        if (isNaN(this.value)) {
            this.kupManager.debug.logMessage(
                this,
                'Invalid value, not rendering!',
                KupDebugCategory.WARNING
            );
            return;
        }
        // mathematical operations
        this.maxValuePositive = Math.abs(this.minValue - this.maxValue);
        let tempValue = this.value;
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        if (this.value < this.minValue) {
            this.value = this.minValue;
        }

        // Svg constants
        let yValueMultiplier = 1;
        switch (this.valueSize) {
            case 3:
                yValueMultiplier = 3;
                break;
            case 2:
                yValueMultiplier = 2.75;
                break;
            case 1:
                yValueMultiplier = 2.5;
                break;
            default:
            case 0:
                yValueMultiplier = 2.25;
                break;
        }
        const halvedSize = this.size / 2; // The svg size ratio w : w / 2
        const needleCircleRadius = this.size / 20; // Arbitrary size of the base of the needle
        const needleLength = halvedSize - 2 * this.arcThickness; // Calculates the length of the needle in pure units
        const valueLabelYPosition =
            halvedSize +
            needleCircleRadius +
            this.labelDistance * yValueMultiplier;

        // User provided thresholds
        // TODO these thresholds will be given to the component by a user prop
        const givenThresholds = [];
        if (!this.onlyValue) {
            if (this.firstThreshold || 0 === this.firstThreshold) {
                givenThresholds.push(this.firstThreshold);
            }
            if (this.secondThreshold || 0 === this.secondThreshold) {
                givenThresholds.push(this.secondThreshold);
            }
        } else {
            givenThresholds.push(this.value);
        }

        // This creates the various point from which the arcs are generated
        const arcsThresholds = [
            this.minValue,
            ...givenThresholds,
            this.maxValue,
        ];

        // Creates arc elements and chooses their color orders
        const arcsElements = [];
        let arcsColors;
        if (!this.onlyValue) {
            arcsColors = !this.reverseColors
                ? this.colors
                : this.colors.slice().reverse();
        } else {
            let computedcolors = !this.reverseColors
                ? this.colors
                : this.colors.slice().reverse();
            let valuecolor =
                this.value < this.firstThreshold
                    ? computedcolors[0]
                    : this.value < this.secondThreshold
                    ? computedcolors[1]
                    : computedcolors[2];
            arcsColors = [
                valuecolor,
                `rgba(var(${KupThemeColorValues.TEXT}-rgb), .1)`,
            ];
        }

        for (let i = 0; i < arcsThresholds.length - 1; i++) {
            const currentArcPath = this.arcGenerator({
                innerRadius: halvedSize - this.arcThickness,
                outerRadius: halvedSize,
                startAngle:
                    this.calculateValuePercentage(arcsThresholds[i]) * Math.PI,
                endAngle:
                    this.calculateValuePercentage(arcsThresholds[i + 1]) *
                    Math.PI,
            });
            // If there is no color specified for that arc, we provide a black fallback
            arcsElements.push(
                <path
                    d={currentArcPath}
                    style={{ fill: arcsColors[i] ? arcsColors[i] : '#000000' }}
                />
            );
        }

        // Composes the threshold label elements, if labels must be displayed
        const textElements =
            this.showLabels || this.showMaxmin
                ? arcsThresholds.map((threshold) => {
                      // Given the
                      const thresholdPercentage =
                          this.calculateValuePercentage(threshold);
                      // Decides the position of the text
                      // @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
                      let textPosition = 'end';
                      if (thresholdPercentage > 0.5) {
                          textPosition = 'start';
                      } else if (thresholdPercentage === 0.5) {
                          textPosition = 'middle';
                      }
                      // Since the gauge is a semicircle, we must divide the percentage in half to have the correct angle
                      const thetaRad = this.percToRad(thresholdPercentage / 2);
                      let topX =
                          halvedSize - (needleLength + 2) * Math.cos(thetaRad);
                      let topY =
                          halvedSize - (needleLength + 2) * Math.sin(thetaRad);

                      let retValue = '';
                      if (thresholdPercentage > 0 && thresholdPercentage < 1) {
                          if (this.showLabels && !this.onlyValue) {
                              retValue = (
                                  <text
                                      class="gauge__label-text"
                                      text-anchor={textPosition}
                                      x={topX}
                                      y={topY}
                                  >
                                      {unformattedStringToFormattedStringNumber(
                                          String(threshold),
                                          -1,
                                          ''
                                      )}
                                  </text>
                              );
                          }
                      } else {
                          if (this.showMaxmin) {
                              if (thresholdPercentage === 0) {
                                  topX = this.arcThickness;
                                  topY = halvedSize + this.labelDistance;
                              } else {
                                  topX = this.size - this.arcThickness;
                                  topY = halvedSize + this.labelDistance;
                              }
                              retValue = (
                                  <text
                                      class="gauge__label-text"
                                      text-anchor={textPosition}
                                      x={topX}
                                      y={topY}
                                  >
                                      {unformattedStringToFormattedStringNumber(
                                          String(threshold),
                                          -1,
                                          ''
                                      )}
                                  </text>
                              );
                          }
                      }
                      return retValue;
                  })
                : [];

        const style = { fontSize: this.calculateValueFontSize() };
        let valueText = undefined;
        if (this.showValue) {
            valueText = (
                <text
                    class="gauge__label-text value"
                    text-anchor="middle"
                    x={halvedSize}
                    y={valueLabelYPosition}
                    style={style}
                >
                    {unformattedStringToFormattedStringNumber(
                        String(tempValue),
                        -1,
                        ''
                    ) +
                        ' ' +
                        this.measurementUnit}
                </text>
            );
        }

        const width = { width: this.widthComponent };

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component" class="gauge__container">
                    <svg
                        class="gauge"
                        style={width}
                        viewBox={`0 0 ${this.size} ${valueLabelYPosition}`}
                    >
                        <g
                            transform={`rotate(-90) translate(-${halvedSize}, ${halvedSize})`}
                        >
                            {arcsElements}
                        </g>
                        {this.needleCircle ? (
                            <circle
                                class="gauge__needle-base"
                                cx={halvedSize}
                                cy={halvedSize}
                                r={needleCircleRadius}
                            />
                        ) : null}
                        <path
                            class="gauge__needle"
                            d={this.paintNeedle(
                                needleLength,
                                needleCircleRadius,
                                halvedSize,
                                halvedSize,
                                this.calculateValuePercentage(this.value)
                            )}
                        />
                        {textElements}
                        {valueText}
                    </svg>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
    }
}
