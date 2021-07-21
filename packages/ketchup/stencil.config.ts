import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    buildEs5: false,
    extras: {
        cssVarsShim: true,
    },
    namespace: 'ketchup',
    outputTargets: [
        { type: 'dist' },
        { type: 'docs-readme' },
        {
            type: 'www',
            copy: [
                { src: 'autocomplete.html' },
                { src: 'box.html' },
                { src: 'box-performance.html' },
                { src: 'bpmn.html' },
                { src: 'button.html' },
                { src: 'button-list.html' },
                { src: 'card.html' },
                { src: 'card-performance.html' },
                { src: 'chart.html' },
                { src: 'checkbox.html' },
                { src: 'chip.html' },
                { src: 'color-picker.html' },
                { src: 'combobox.html' },
                { src: 'css-grid.html' },
                { src: 'dash.html' },
                { src: 'dash-list.html' },
                { src: 'data-table.html' },
                { src: 'data-table-performance.html' },
                { src: 'date-picker.html' },
                { src: 'debug.html' },
                { src: 'drawer.html' },
                { src: 'dropdown.html' },
                { src: 'echart.html' },
                { src: 'gauge.html' },
                { src: 'hypermenu.html' },
                { src: 'layout-component.html' },
                { src: 'list-box.html' },
                { src: 'magic-box.html' },
                { src: 'nav-bar.html' },
                { src: 'probe.html' },
                { src: 'radio.html' },
                { src: 'rating.html' },
                { src: 'switch.html' },
                { src: 'tab-bar.html' },
                { src: 'time-picker.html' },
                { src: 'text-field.html' },
                { src: 'tooltip.html' },
                { src: 'tree.html' },
            ],
            serviceWorker: null, // disable service workers
        },
    ],
    plugins: [
        sass({
            includePaths: ['./node_modules'],
            injectGlobalPaths: ['src/style/global.scss'],
        }),
    ],
};
