import { Component, Prop, h } from '@stencil/core';

declare const d3: any;

@Component({
  tag: 'kup-gauge',
  styleUrl: 'kup-gauge.scss',
  shadow: true,
})
export class KupGauge {
  /**
   * Sets how much the arc of the gauge should be thick.
   * @namespace kup-gauge.arcThickness
   * @see kup-gauge.size
   */
  @Prop() arcThickness = 30;
  /**
   * Array of three elements to specify the color of the arcs.
   */
  @Prop() colors: string[] = ['#eb4d4d', '#f2b203', '#02a045'];
  /**
   * The first threshold, establishing the length of the first and second arc.
   */
  @Prop() firstThreshold?: number;
  /**
   * The distance the label and the value has from the gauge graph.
   */
  @Prop() labelDistance: number = 20;
  /**
   * The maximum value reachable in the current graph.
   */
  @Prop() maxValue: number = 100;
  /**
   * A string which will be appended to the displayed values of the component.
   */
  @Prop() measurementUnit: string = '';
  /**
   * The minimum value reachable in the current graph.
   */
  @Prop() minValue: number = -100;
  /**
   * If set to true, the colors inside the colors array are used in the reversed order.
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
  @Prop() value: number = 0;
  /**
   * The current size of gauge's value.
   * Correct values are: 0,1,2 or 3.
   */
  @Prop() valueSize: number = 0;
  /**
   * if true, shows a rounded needle.
   */
  @Prop() needleCircle: boolean = false;

  //---- Internal not reactive state ----

  // Arcs generator
  private arcGenerator = d3.arc();

  /**
   * Holds the maximum positive interval.
   * Percentages are calculated as it follows:
   * MIN = 0 = the value the prop minValue gets transformed to\
   * MAX = ABSOLUTE(minValue - maxValue) = the maxValuePositive holds this value
   * TVALUE = value - minValue = any value, which needs to be represented on the chart
   * @namespace kup-gauge.maxValuePositive
   */
  private maxValuePositive = 0;


  //---- Utility functions ----
  // Manipulates and transforms degrees to percentage and vice versa.

  percToDeg(perc) {
    return perc * 360;
  };

  degToRad(deg) {
    return deg * Math.PI / 180;
  };

  percToRad(perc) {
    return this.degToRad(this.percToDeg(perc));
  };

  /**
   * Given a valid value, minValue <= value <= maxValue, calculates this value as a percentage of the interval [minValue, maxValue]
   * @param {number} valueToPercentage - The value to be calculated as a percentage
   * @see kup-gauge.maxValuePositive
   */
  calculateValuePercentage(valueToPercentage: number = 0): number {
    return (valueToPercentage - this.minValue) / this.maxValuePositive;
  }

  calculateValueFontSize(): string {
    if (this.valueSize > 2)
      return '3vw';
    if (this.valueSize > 1)
      return '2.5vw';
    if (this.valueSize > 0)
      return '2vw';

    return '1.5vw';  
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
  paintNeedle(needleLength: number, needleBaseRadius: number, centerX: number, centerY: number, rotationPercentage: number = 0): string {
    let leftX, leftY, rightX, rightY, thetaRad, topX, topY;
    thetaRad = this.percToRad(rotationPercentage / 2); // Since the gauge is a semicircle, we must divide the percentage in half to have the correct angle
    topX = centerX - needleLength * Math.cos(thetaRad);
    topY = centerY - needleLength * Math.sin(thetaRad);
    leftX = centerX - needleBaseRadius * Math.cos(thetaRad - Math.PI / 2);
    leftY = centerY - needleBaseRadius * Math.sin(thetaRad - Math.PI / 2);
    rightX = centerX - needleBaseRadius * Math.cos(thetaRad + Math.PI / 2);
    rightY = centerY - needleBaseRadius * Math.sin(thetaRad + Math.PI / 2);
    return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
  }

  render() {
    // mathematical operations
    this.maxValuePositive = Math.abs(this.minValue - this.maxValue);

    // Svg constants
    const halvedSize = this.size / 2; // The svg size ratio w : w / 2
    const needleCircleRadius = this.size / 20; // Arbitrary size of the base of the needle
    const needleLength = halvedSize - 2*this.arcThickness; // Calculates the length of the needle in pure units
    const valueLabelYPosition = halvedSize + needleCircleRadius + this.labelDistance * 1;

    // User provided thresholds
    // TODO these thresholds will be given to the component by a user prop
    const givenThresholds = [];
    if (this.firstThreshold) {
      givenThresholds.push(this.firstThreshold);
    }
    if (this.secondThreshold) {
      givenThresholds.push(this.secondThreshold);
    }

    // This creates the various point from which the arcs are generated
    const arcsThresholds = [this.minValue, ...givenThresholds, this.maxValue];

    // Creates arc elements and chooses their color orders
    const arcsElements = [];
    const arcsColors = !this.reverseColors ? this.colors : this.colors.slice().reverse();

    for (let i = 0; i < arcsThresholds.length - 1; i++) {
      const currentArcPath = this.arcGenerator({
        innerRadius: halvedSize - this.arcThickness,
        outerRadius: halvedSize,
        startAngle: this.calculateValuePercentage(arcsThresholds[i]) * Math.PI,
        endAngle: this.calculateValuePercentage(arcsThresholds[i + 1]) * Math.PI
      });
      // If there is no color specified for that arc, we provide a black fallback
      arcsElements.push(<path d={currentArcPath} style={{ fill: arcsColors[i] ? arcsColors[i] : '#000000' }}/>);
    }

    // Composes the threshold label elements, if labels must be displayed
    const textElements = this.showLabels || this.showMaxmin ? arcsThresholds.map(threshold => {
      // Given the
        const thresholdPercentage = this.calculateValuePercentage(threshold);
        // Decides the position of the text
        // @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
        let textPosition = 'end';
        if (thresholdPercentage > .5) {
          textPosition = 'start';
        } else if (thresholdPercentage === .5) {
          textPosition = 'middle';
        }
        // Since the gauge is a semicircle, we must divide the percentage in half to have the correct angle
        const thetaRad = this.percToRad(thresholdPercentage / 2);
        let topX = halvedSize - (needleLength+2) * Math.cos(thetaRad);
        let topY = halvedSize - (needleLength+2) * Math.sin(thetaRad);
        
        let retValue = "";
        if (thresholdPercentage>0 && thresholdPercentage<1) {
          if (this.showLabels) {
            retValue = 
            <text
              class="gauge__label-text"
              text-anchor={textPosition}
              x={topX}
              y={topY}>{threshold}</text>;
          }
        } else {
          if (this.showMaxmin) {
            if (thresholdPercentage===0) {
              topX = this.arcThickness;
              topY = halvedSize + this.labelDistance;
            } else {
              topX = this.size - this.arcThickness;
              topY = halvedSize + this.labelDistance;
            }
            retValue = 
            <text
              class="gauge__label-text"
              text-anchor={textPosition}
              x={topX}
              y={topY}>{threshold}</text>;
          }
        }
        return retValue;
      })
      : [];

    const style = {fontSize: this.calculateValueFontSize()};

    return (
      <div class="gauge__container">
        <svg
          class="gauge"
          viewBox={`0 0 ${this.size} ${valueLabelYPosition}`}>
          <g transform={`rotate(-90) translate(-${halvedSize}, ${halvedSize})`}>
            {arcsElements}
          </g>
          {this.needleCircle ?
          <circle
            class="gauge__needle-base"
            cx={halvedSize}
            cy={halvedSize}
            r={needleCircleRadius}/> : null }
          <path
            class="gauge__needle"
            d={this.paintNeedle(needleLength, needleCircleRadius, halvedSize, halvedSize, this.calculateValuePercentage(this.value))}
          />
          {textElements}
        </svg>
        <div>
        {this.showValue ?
            <div
              class="gauge__value-text"
              text-anchor="middle"
              style={style}>{this.value + ' ' + this.measurementUnit}</div>
            : null}
       </div>
      </div>
    );
  }
}
