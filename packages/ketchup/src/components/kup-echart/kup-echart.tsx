import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    getAssetPath,
    Host,
    h,
    Method,
    Prop,
    State,
} from '@stencil/core';

import { EchartTitle, KupEchartProps } from './kup-echart-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import echarts, { EChartOption, ECharts } from 'echarts';
import {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import { KupThemeColorValues } from '../../utils/kup-theme/kup-theme-declarations';
import { getProps, setProps } from '../../utils/utils';

@Component({
    tag: 'kup-echart',
    assetsDirs: ['assets/maps'],
    styleUrl: 'kup-echart.scss',
    shadow: true,
})
export class KupEchart {
    @Element() rootElement: HTMLElement;
    @State() themeBorder: string = undefined;
    @State() themeColors: string[] = undefined;
    @State() themeFont: string = undefined;
    @State() themeText: string = undefined;

    /**
     * Sets the axis of the chart.
     */
    @Prop() axis: string = '';
    /**
     * Title of the graph.
     */
    @Prop() chartTitle: EchartTitle;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization.
     */
    @Prop() customStyle: string = '';
    /**
     * The actual data of the chart.
     */
    @Prop() data: object = {};
    /**
     * Sets the position of the legend. Supported values: bottom, left, right, top. Keep in mind that legend types are tied to chart types, some combinations might not work.
     */
    @Prop() legend: string;
    /**
     * Choose which map you want to view, supported values: "europe", "africa", "asia", "oceania", "america" and "world". You can also provide your own JSON.
     */
    @Prop() mapType: any;
    /**
     * The data series to be displayed. They must be of the same type.
     */
    @Prop() series: string[];
    /**
     * The type of the chart. Supported formats: Line, Pie, Map, Scatter
     */
    @Prop() types: String[] = ['Line'];

    private chartContainer?: HTMLDivElement;
    private chartEl: ECharts;
    private echartOption: EChartOption;
    private echartSeries: EChartOption.Series[];
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    /**
     * Used to prevent too many resizes callbacks at once.
     */
    private resizeTimeout: number;
    private nameMap: any;
    private jsonMap: any;

    @Event() kupEchartClick: EventEmitter<KupEventPayload>;

    //---- Methods ----

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupEchartProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupEchartProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }
    /**
     * This method is invoked by KupManager whenever the component changes size.
     */
    @Method()
    async resizeCallback(): Promise<void> {
        window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(() => this.refresh(), 300);
    }

    private onKupClick() {
        this.kupEchartClick.emit({ comp: this, id: this.rootElement.id });
    }

    private initChart() {
        this.echartOption = {};
        this.echartSeries = [];
        this.nameMap = '';
        this.jsonMap = {};

        if (this.chartEl) {
            echarts.dispose(this.chartContainer);
        }
        this.chartEl = echarts.init(this.chartContainer);
        this.createChart();
    }

    private prepMap(): void {
        let y = {};
        echarts.registerMap(this.nameMap, this.jsonMap);
        y = this.createMapY();
        this.setMapSeries(y);
        this.setMapOption();
        this.chartEl.setOption(this.echartOption, true);
    }

    private createChart() {
        let x: string[] = [],
            y = {};

        switch (this.types[0].toLowerCase()) {
            case 'map':
                if (typeof this.mapType === 'string') {
                    fetch(getAssetPath(`./assets/maps/${this.mapType}.json`))
                        .then((res) =>
                            res.text().then((res) => {
                                this.jsonMap = JSON.parse(res);
                                this.nameMap = this.mapType;
                                this.prepMap();
                            })
                        )
                        .catch((err) => {
                            this.kupManager.debug.logMessage(
                                this,
                                "Couldn't fetch map JSON: " + err,
                                KupDebugCategory.WARNING
                            );
                        });
                } else {
                    this.jsonMap = this.mapType;
                    this.nameMap = 'custom';
                    this.prepMap();
                }
                break;
            case 'pie':
                y = this.createY();
                this.setPieSeries(y);
                this.setPieOption(y);
                this.chartEl.setOption(this.echartOption, true);
                break;
            default:
                x = this.createX();
                y = this.createY();
                this.setOption(x, y);
                this.chartEl.setOption(this.echartOption, true);
                break;
        }
    }

    private createX() {
        let x = [];
        let rows = this.data['rows'];

        if (!this.axis) {
            for (let i = 0; i < rows.length; i++) {
                x[i] = rows[i].cells[0].value;
            }
        } else {
            for (let i = 0; i < rows.length; i++) {
                x[i] = rows[i].cells[this.axis].value;
            }
        }

        return x;
    }

    private createY() {
        let y = {};
        let rows = this.data['rows'];

        if (this.series) {
            for (const row of rows) {
                for (const key of Object.keys(row.cells)) {
                    if (key != this.axis) {
                        if (this.series.indexOf(key) != -1) {
                            // Temporary - waiting for axes selection prop.
                            const cell = row.cells[key];
                            const value = cell.value;
                            if (!y[key]) {
                                y[key] = [];
                            }
                            y[key].push(value);
                        }
                    }
                }
            }
        } else {
            for (const row of rows) {
                for (const key of Object.keys(row.cells)) {
                    if (key !== this.axis) {
                        // Temporary - waiting for axes selection prop.
                        const cell = row.cells[key];
                        const value = cell.value;
                        if (!y[key]) {
                            y[key] = [];
                        }
                        y[key].push(value);
                    }
                }
            }
        }

        return y;
    }

    private createMapY() {
        // Creates an object that contains all the information needed to derive the values ​​and keys needed to create the chart map.
        let y = {};
        let rows = this.data['rows'];
        let objKey: string;

        for (const row of rows) {
            for (const key of Object.keys(row.cells)) {
                if (key == this.axis) {
                    objKey = row.cells[key].value;
                    if (!y[objKey]) {
                        y[objKey] = [];
                    }
                } else {
                    const cell = row.cells[key];
                    const value = cell.value;
                    y[objKey].push(value);
                }
            }
        }

        return y;
    }

    private createLegend(y: {}) {
        let arr: string[] = [];
        for (let key in y) {
            arr.push(key);
        }
        return arr;
    }

    private setPieSeries(y: {}) {
        let data = [];
        for (let key in y) {
            let sum: number = 0;
            for (let j = 0; j < y[key].length; j++) {
                sum = sum + parseFloat(y[key][j]);
            }
            data.push({
                name: key,
                value: sum,
            });
        }

        this.echartSeries = [
            {
                name: 'echart',
                type: 'pie',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ];
    }

    private setMapSeries(y: {}) {
        let data = [];
        for (let i in y) {
            data.push({
                name: i,
                itemStyle: {
                    color: y[i][0],
                },
            });
        }

        this.echartSeries = [
            {
                name: 'estimate',
                type: 'map',
                roam: true,
                map: this.nameMap,
                emphasis: {
                    label: {
                        show: true,
                    },
                },

                data: data,
            },
        ];
    }

    private setOption(x: string[], y: {}) {
        // Line, bar, scatter
        let i: number = 0;
        for (const key in y) {
            let type: string;
            if (this.types[i]) {
                type = this.types[i].toLowerCase();
            } else {
                type = 'line';
            }
            this.echartSeries.push({
                data: y[key],
                name: key,
                type: type,
            });
            i++;
        }

        this.echartOption = {
            color: this.themeColors,
            title: {
                text: this.chartTitle ? this.chartTitle.value : undefined,
                [this.chartTitle && this.chartTitle.position
                    ? this.chartTitle.position
                    : 'left']: 0,
                textStyle: {
                    color:
                        this.chartTitle && this.chartTitle.color
                            ? this.chartTitle.color
                            : 'black',
                    fontFamily: this.themeFont,
                    fontSize:
                        this.chartTitle && this.chartTitle.size
                            ? this.chartTitle.size
                            : 16,
                },
            },
            legend: {
                data: this.createLegend(y),
                [this.legend]: 0,
                textStyle: {
                    color: this.themeText,
                    fontFamily: this.themeFont,
                },
            },
            xAxis: {
                axisLine: { lineStyle: { color: this.themeText } },
                axisLabel: {
                    color: this.themeText,
                    fontFamily: this.themeFont,
                },
                axisTick: { lineStyle: { color: this.themeBorder } },
                data: x,
                splitLine: { lineStyle: { color: this.themeBorder } },
                type: 'category',
            },
            tooltip: {
                textStyle: {
                    fontFamily: this.themeFont,
                },
                trigger: 'axis',
            },
            yAxis: {
                axisLine: { lineStyle: { color: this.themeText } },
                axisLabel: {
                    color: this.themeText,
                    fontFamily: this.themeFont,
                },
                axisTick: { lineStyle: { color: this.themeBorder } },
                splitLine: { lineStyle: { color: this.themeBorder } },
                type: 'value',
            },
            series: this.echartSeries,
        };
    }

    private setPieOption(y: {}) {
        this.echartOption = {
            color: this.themeColors,
            title: {
                text: this.chartTitle ? this.chartTitle.value : undefined,
                [this.chartTitle && this.chartTitle.position
                    ? this.chartTitle.position
                    : 'left']: 0,
                textStyle: {
                    color:
                        this.chartTitle && this.chartTitle.color
                            ? this.chartTitle.color
                            : 'black',
                    fontFamily: this.themeFont,
                    fontSize:
                        this.chartTitle && this.chartTitle.size
                            ? this.chartTitle.size
                            : 16,
                },
            },
            legend: {
                data: this.createLegend(y),
                [this.legend]: 0,
                textStyle: {
                    color: this.themeText,
                    fontFamily: this.themeFont,
                },
            },
            tooltip: {
                textStyle: {
                    fontFamily: this.themeFont,
                },
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            series: this.echartSeries,
        };
    }

    private fetchThemeColors() {
        let colorArray: string[] = [];
        let key: string = '--kup-chart-color-';
        for (
            let index = 1;
            this.kupManager.theme.cssVars[key + index];
            index++
        ) {
            colorArray.push(this.kupManager.theme.cssVars[key + index]);
        }
        this.themeBorder =
            this.kupManager.theme.cssVars[KupThemeColorValues.BORDER];
        this.themeFont = this.kupManager.theme.cssVars['--kup-font-family'];
        this.themeText =
            this.kupManager.theme.cssVars[KupThemeColorValues.TEXT];

        this.themeColors = colorArray;
    }

    private setMapOption() {
        // Create the right json for creating map-like graphics
        this.echartOption = {
            title: {
                text: this.chartTitle ? this.chartTitle.value : undefined,
                [this.chartTitle && this.chartTitle.position
                    ? this.chartTitle.position
                    : 'left']: 0,
                textStyle: {
                    color:
                        this.chartTitle && this.chartTitle.color
                            ? this.chartTitle.color
                            : 'black',
                    fontFamily: this.themeFont,
                    fontSize:
                        this.chartTitle && this.chartTitle.size
                            ? this.chartTitle.size
                            : 16,
                },
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                formatter: function (params: any) {
                    let value;
                    if (params.color != '#c23531') {
                        value = params.color;
                    } else {
                        value = 'no value';
                    }

                    return (
                        params.seriesName + '<br/>' + params.name + ': ' + value
                    );
                },
            },
            series: this.echartSeries,
        };
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.fetchThemeColors();
    }

    componentDidLoad() {
        this.kupManager.resize.observe(this.rootElement);
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
        this.fetchThemeColors();
    }

    componentDidRender() {
        this.initChart();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div
                    id="kup-component"
                    onClick={() => this.onKupClick()}
                    ref={(chartContainer) =>
                        (this.chartContainer = chartContainer)
                    }
                ></div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
        this.kupManager.resize.unobserve(this.rootElement);
    }
}
