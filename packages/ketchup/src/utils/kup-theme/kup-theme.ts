import type { KupDom } from '../kup-manager/kup-manager-declarations';
import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupThemeCSSVariables,
    KupThemeIcons,
    KupThemeJSON,
    KupThemeVariables,
    masterCustomStyle,
} from './kup-theme-declarations';
import { getAssetPath } from '@stencil/core';
import * as themesJson from './themes.json';
import * as themeCSS from './kup-theme.css';
import { KupDebugCategory } from '../kup-debug/kup-debug-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * Theme manager, handles everything about theming, customStyles and color utilities.
 * @module KupTheme
 */
export class KupTheme {
    cssVars: Partial<KupThemeVariables> = {};
    list: KupThemeJSON =
        dom.ketchupInit && dom.ketchupInit.theme && dom.ketchupInit.theme.list
            ? dom.ketchupInit.theme.list
            : themesJson['default'];
    managedComponents: Set<KupComponent> = new Set();
    name: string =
        dom.ketchupInit && dom.ketchupInit.theme && dom.ketchupInit.theme.name
            ? dom.ketchupInit.theme.name
            : 'ketchup';
    styleTag: HTMLStyleElement = dom
        .querySelector('head')
        .appendChild(document.createElement('style'));
    /**
     * Sets the theme using this.name or the function's argument.
     * @param {string} name - When present, this theme will be set.
     */
    set(name?: string, list?: KupThemeJSON): void {
        if (name) {
            this.name = name;
        }
        if (list) {
            this.list = list;
        }
        dom.ketchup.debug.logMessage(
            'theme manager',
            'Setting theme to: ' + this.name + '.'
        );
        if (!this.list[this.name]) {
            dom.ketchup.debug.logMessage(
                'theme manager',
                'Invalid theme name, falling back to default ("ketchup").'
            );
            this.name = 'ketchup';
        }

        this.cssVars = {};
        this.styleTag.innerText =
            this.imports() +
            ' :root[kup-theme="' +
            this.name +
            '"]{' +
            this.cssVariables() +
            this.icons() +
            '}' +
            themeCSS['default'];
        this.customStyle();

        document.documentElement.setAttribute('kup-theme', this.name);
        document.dispatchEvent(new CustomEvent('kupThemeChange'));
    }
    /**
     * Gets the name of available themes (filters out themes named "test").
     * @returns {Array<string>} Array of themes' names.
     */
    getThemes(): Array<string> {
        const themes: Array<string> = [];
        for (var key in this.list) {
            if (this.list.hasOwnProperty(key)) {
                if (key !== 'test') {
                    themes.push(key);
                }
            }
        }
        return themes;
    }
    /**
     * Sets the CSS variables of the theme.
     */
    imports(): string {
        const imports: string[] = this.list[this.name].imports
            ? this.list[this.name].imports
            : [];
        let css: string = '';
        for (let index = 0; index < imports.length; index++) {
            css += '@import ' + imports[index] + ';';
        }
        return css;
    }
    /**
     * Sets the CSS variables of the theme.
     */
    cssVariables(): string {
        const variables: KupThemeCSSVariables =
            this.list[this.name].cssVariables;
        let css: string = '';
        for (var key in variables) {
            if (variables.hasOwnProperty(key)) {
                var val = variables[key];
                this.cssVars[key] = val;
                css += key + ': ' + val + ';';
                if (key.indexOf('color') > -1) {
                    let rgbKey = key + '-rgb';
                    let rgbVal = this.colorCheck(val).rgbValues;
                    this.cssVars[rgbKey] = rgbVal;
                    css += rgbKey + ': ' + rgbVal + ';';
                }
            }
        }
        return css;
    }
    /**
     * Sets the icon variables of the theme.
     */
    icons(): string {
        const icons: KupThemeIcons = this.list[this.name].icons;
        let css: string = '';
        for (var key in icons) {
            if (icons.hasOwnProperty(key)) {
                const val = `url('${getAssetPath(
                    `./assets/svg/${icons[key]}.svg`
                )}') no-repeat center`;
                this.cssVars[key] = val;
                css += key + ': ' + val + ';';
            }
        }
        return css;
    }
    /**
     * Refreshed managed components to apply theme customStyles.
     */
    customStyle(): void {
        this.managedComponents.forEach(function (comp) {
            if (comp.isConnected) {
                comp.refresh();
            }
        });
    }
    /**
     * This method will just refresh the current theme.
     */
    refresh(): void {
        try {
            this.styleTag.innerText =
                ':root[kup-theme="' +
                this.name +
                '"]{' +
                this.cssVariables() +
                this.icons() +
                '}';
            this.customStyle();
            dom.ketchup.debug.logMessage(
                'kup-theme',
                'Theme ' + dom.getAttribute('kup-theme') + ' refreshed.'
            );
            document.dispatchEvent(new CustomEvent('kupThemeRefresh'));
        } catch (error) {
            dom.ketchup.debug.logMessage(
                'kup-theme',
                'Theme not refreshed.',
                KupDebugCategory.WARNING
            );
        }
    }
    /**
     * Registers a KupComponent in KupTheme, in order to be properly handled whenever the theme changes.
     * @param {any} comp - The component calling this function.
     */
    register(comp: any): void {
        this.managedComponents.add(comp.rootElement);
    }
    /**
     * Unregisters a KupComponent, so it won't be handled when the theme changes.
     *
     * @param {any} comp - The component calling this function.
     */
    unregister(comp: any): void {
        if (this.managedComponents) {
            this.managedComponents.delete(comp.rootElement);
        }
    }
    /**
     * Combines theme's and component's customStyles, returning the result.
     * @param comp - The component calling this function.
     * @returns {string} Combined customStyle.
     */
    setCustomStyle(comp: KupComponent): string {
        const styles: GenericObject = this.list[this.name].customStyles;
        let completeStyle: string = '';
        if (styles && styles[masterCustomStyle]) {
            completeStyle += styles[masterCustomStyle];
        }
        if (styles && styles[comp.tagName]) {
            completeStyle += ' ' + styles[comp.tagName];
        }
        if (comp.customStyle) {
            completeStyle += ' ' + comp.customStyle;
        }
        return completeStyle ? completeStyle : null;
    }
    /**
     * Checks whether on a given color the text should be white or black.
     * @param {string} color - Color used to check the contrast.
     * @returns {string} "white" or "black".
     */
    colorContrast(color: string): string {
        color = this.colorCheck(color).rgbColor;
        const colorValues: string[] = color.replace(/[^\d,.]/g, '').split(',');
        const brightness: number = Math.round(
            (parseInt(colorValues[0]) * 299 +
                parseInt(colorValues[1]) * 587 +
                parseInt(colorValues[2]) * 114) /
                1000
        );
        return brightness > 125 ? 'black' : 'white';
    }
    /**
     * Generates a random HEX color.
     * @param {number} brightness - Brightness of the color generated (0-255).
     * @returns {string} Random HEX color.
     */
    randomColor(brightness: number): string {
        function randomChannel(brightness: number) {
            var r = 255 - brightness;
            var n = 0 | (Math.random() * r + brightness);
            var s = n.toString(16);
            return s.length == 1 ? '0' + s : s;
        }
        return (
            '#' +
            randomChannel(brightness) +
            randomChannel(brightness) +
            randomChannel(brightness)
        );
    }
    /**
     * Sets a random theme between those specified in this.list (excludes "print" and "test").
     */
    randomTheme(): void {
        let themes: string[] = [];
        for (var key in this.list) {
            if (this.list.hasOwnProperty(key)) {
                if (key !== 'test' && key !== 'print') {
                    themes.push(key);
                }
            }
        }
        if (themes.length > 0) {
            this.set(
                themes[Math.floor(Math.random() * Math.floor(themes.length))]
            );
        } else {
            dom.ketchup.debug.logMessage(
                'kup-theme',
                "Couldn't set a random theme: no themes available!",
                KupDebugCategory.WARNING
            );
        }
    }
    /**
     * Returns HEX, RGB and RGB values from a given color.
     * @param {string} color - Color.
     * @returns {{string, string, string}} Object of color values: hexColor ("#ffffff"), rgbColor ("rgb(255,255,255)"") and rgbValues ("255,255,255").
     */
    colorCheck(color: string): {
        hexColor: string;
        rgbColor: string;
        rgbValues: string;
    } {
        //Testing whether the color is transparent, if it is a fall back value will be returned matching the background-color
        if (color === 'transparent') {
            color = this.list[this.name].cssVariables['--kup-background-color'];
            dom.ketchup.debug.logMessage(
                'theme manager',
                'Received TRANSPARENT color, converted to ' +
                    color +
                    ' (theme background).'
            );
        }

        //Testing whether the color isn't "rgb" nor "hex" value, supposedly is a code word
        if (color.substr(0, 1) !== '#' && color.substr(0, 3) !== 'rgb') {
            let oldColor = color;
            color = this.codeToHex(color);
            dom.ketchup.debug.logMessage(
                'theme manager',
                'Received CODE NAME color ' +
                    oldColor +
                    ', converted to ' +
                    color +
                    '.'
            );
        }

        //Testing whether the color is "hex" value
        let hexColor: string = undefined;
        if (color.substr(0, 1) === '#') {
            hexColor = color;
            let oldColor = color;
            let rgbColor = this.hexToRgb(color);
            try {
                color =
                    'rgb(' +
                    rgbColor.r +
                    ',' +
                    rgbColor.g +
                    ',' +
                    rgbColor.b +
                    ')';
                dom.ketchup.debug.logMessage(
                    'theme manager',
                    'Received HEX color ' +
                        oldColor +
                        ', converted to ' +
                        color +
                        '.'
                );
            } catch (error) {
                dom.ketchup.debug.logMessage(
                    'theme-manager',
                    'Invalid color: ' + color + '.'
                );
            }
        }

        let rgbValues: string = undefined;
        var values = color.match(
            /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/
        );

        try {
            rgbValues = values[1] + ',' + values[2] + ',' + values[3];
        } catch (error) {
            dom.ketchup.debug.logMessage(
                'theme-manager',
                'Color not converted to rgb values: ' + color + '.'
            );
        }

        if (!hexColor) {
            try {
                hexColor = this.rgbToHex(
                    parseInt(values[1]),
                    parseInt(values[2]),
                    parseInt(values[3])
                );
            } catch (error) {
                dom.ketchup.debug.logMessage(
                    'theme-manager',
                    'Color not converted to hex value: ' + color + '.'
                );
            }
        }

        return { hexColor: hexColor, rgbColor: color, rgbValues: rgbValues };
    }
    /**
     * Converts an HEX color to its RGB values.
     * @param {string} hex - Hex code.
     * @returns {{number, number, number}} Object of color values: hexColor ("#ffffff"), rgbColor ("rgb(255,255,255)"") and rgbValues ("255,255,255").
     */
    hexToRgb(hex: string): { r: number; g: number; b: number } {
        var result: RegExpExecArray =
            /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }
    /**
     * Converts a color in RGB format to the corresponding HEX color.
     * @param {number} r - Red channel value.
     * @param {number} g - Green channel value.
     * @param {number} b - Blue channel value.
     * @returns {string} HEX color.
     */
    rgbToHex(r: number, g: number, b: number): string {
        return (
            '#' + this.valueToHex(r) + this.valueToHex(g) + this.valueToHex(b)
        );
    }
    /**
     * Converts a single RGB value to the corresponding HEX value.
     * @param {number} c - Color value.
     * @returns {string} HEX value.
     */
    valueToHex(c: number): string {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    /**
     * Converts a color code word to the corresponding HEX value.
     * @param {string} color - Color code word.
     * @returns {string} HEX value.
     */
    codeToHex(color: string): string {
        const colorCodes = {
            aliceblue: '#f0f8ff',
            antiquewhite: '#faebd7',
            aqua: '#00ffff',
            aquamarine: '#7fffd4',
            azure: '#f0ffff',
            beige: '#f5f5dc',
            bisque: '#ffe4c4',
            black: '#000000',
            blanchedalmond: '#ffebcd',
            blue: '#0000ff',
            blueviolet: '#8a2be2',
            brown: '#a52a2a',
            burlywood: '#deb887',
            cadetblue: '#5f9ea0',
            chartreuse: '#7fff00',
            chocolate: '#d2691e',
            coral: '#ff7f50',
            cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc',
            crimson: '#dc143c',
            cyan: '#00ffff',
            darkblue: '#00008b',
            darkcyan: '#008b8b',
            darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9',
            darkgreen: '#006400',
            darkgrey: '#a9a9a9',
            darkkhaki: '#bdb76b',
            darkmagenta: '#8b008b',
            darkolivegreen: '#556b2f',
            darkorange: '#ff8c00',
            darkorchid: '#9932cc',
            darkred: '#8b0000',
            darksalmon: '#e9967a',
            darkseagreen: '#8fbc8f',
            darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f',
            darkslategrey: '#2f4f4f',
            darkturquoise: '#00ced1',
            darkviolet: '#9400d3',
            deeppink: '#ff1493',
            deepskyblue: '#00bfff',
            dimgray: '#696969',
            dimgrey: '#696969',
            dodgerblue: '#1e90ff',
            firebrick: '#b22222',
            floralwhite: '#fffaf0',
            forestgreen: '#228b22',
            fuchsia: '#ff00ff',
            gainsboro: '#dcdcdc',
            ghostwhite: '#f8f8ff',
            goldenrod: '#daa520',
            gold: '#ffd700',
            gray: '#808080',
            green: '#008000',
            greenyellow: '#adff2f',
            grey: '#808080',
            honeydew: '#f0fff0',
            hotpink: '#ff69b4',
            indianred: '#cd5c5c',
            indigo: '#4b0082',
            ivory: '#fffff0',
            khaki: '#f0e68c',
            lavenderblush: '#fff0f5',
            lavender: '#e6e6fa',
            lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd',
            lightblue: '#add8e6',
            lightcoral: '#f08080',
            lightcyan: '#e0ffff',
            lightgoldenrodyellow: '#fafad2',
            lightgray: '#d3d3d3',
            lightgreen: '#90ee90',
            lightgrey: '#d3d3d3',
            lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a',
            lightseagreen: '#20b2aa',
            lightskyblue: '#87cefa',
            lightslategray: '#778899',
            lightslategrey: '#778899',
            lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0',
            lime: '#00ff00',
            limegreen: '#32cd32',
            linen: '#faf0e6',
            magenta: '#ff00ff',
            maroon: '#800000',
            mediumaquamarine: '#66cdaa',
            mediumblue: '#0000cd',
            mediumorchid: '#ba55d3',
            mediumpurple: '#9370db',
            mediumseagreen: '#3cb371',
            mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a',
            mediumturquoise: '#48d1cc',
            mediumvioletred: '#c71585',
            midnightblue: '#191970',
            mintcream: '#f5fffa',
            mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5',
            navajowhite: '#ffdead',
            navy: '#000080',
            oldlace: '#fdf5e6',
            olive: '#808000',
            olivedrab: '#6b8e23',
            orange: '#ffa500',
            orangered: '#ff4500',
            orchid: '#da70d6',
            palegoldenrod: '#eee8aa',
            palegreen: '#98fb98',
            paleturquoise: '#afeeee',
            palevioletred: '#db7093',
            papayawhip: '#ffefd5',
            peachpuff: '#ffdab9',
            peru: '#cd853f',
            pink: '#ffc0cb',
            plum: '#dda0dd',
            powderblue: '#b0e0e6',
            purple: '#800080',
            rebeccapurple: '#663399',
            red: '#ff0000',
            rosybrown: '#bc8f8f',
            royalblue: '#4169e1',
            saddlebrown: '#8b4513',
            salmon: '#fa8072',
            sandybrown: '#f4a460',
            seagreen: '#2e8b57',
            seashell: '#fff5ee',
            sienna: '#a0522d',
            silver: '#c0c0c0',
            skyblue: '#87ceeb',
            slateblue: '#6a5acd',
            slategray: '#708090',
            slategrey: '#708090',
            snow: '#fffafa',
            springgreen: '#00ff7f',
            steelblue: '#4682b4',
            tan: '#d2b48c',
            teal: '#008080',
            thistle: '#d8bfd8',
            tomato: '#ff6347',
            turquoise: '#40e0d0',
            violet: '#ee82ee',
            wheat: '#f5deb3',
            white: '#ffffff',
            whitesmoke: '#f5f5f5',
            yellow: '#ffff00',
            yellowgreen: '#9acd32',
        };
        if (colorCodes[color.toLowerCase()]) {
            return colorCodes[color.toLowerCase()];
        } else {
            dom.ketchup.debug.logMessage(
                'theme manager',
                'Could not decode color ' + color + '!'
            );
            return color;
        }
    }
}
