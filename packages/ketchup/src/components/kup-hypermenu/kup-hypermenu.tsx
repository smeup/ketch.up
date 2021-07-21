import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { Column } from '../kup-data-table/kup-data-table-declarations';

import { KupHypermenuProps } from './kup-hypermenu-declarations';

import {
    BoxRow,
    Layout,
    Section,
    CollapsedSectionsState,
    BoxObject,
} from '../kup-box/kup-box-declarations';

import {
    isEditor,
    isImage,
    isProgressBar,
    isRadio,
    isGauge,
    isTree,
    isKnob,
    isChart,
    getCellValueForDisplay,
} from '../../utils/cell-utils';

import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    getProps,
    identify,
    setProps,
    stringToNumber,
} from '../../utils/utils';
import {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import { FImage } from '../../f-components/f-image/f-image';
import { FButton } from '../../f-components/f-button/f-button';
import {
    KupLanguageGeneric,
    KupLanguageSearch,
} from '../../utils/kup-language/kup-language-declarations';

@Component({
    tag: 'kup-hypermenu',
    styleUrl: 'kup-hypermenu.scss',
    shadow: true,
})
export class KupHypermenu {
    //--------------------------------------------------------------------------
    // PROPS
    // -------------------------------------------------------------------------

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Data
     */
    @Prop() data: { columns?: Column[]; rows?: BoxRow[] };
    /**
     * When set to true it activates the global filter.
     */
    @Prop() globalFilter: boolean = false;
    /**
     * The value of the global filter.
     */
    @Prop({ reflect: true, mutable: true }) globalFilterValue = '';

    //--------------------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------------------

    @Event({
        eventName: 'kup-hypermenu-didload',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDidLoad: EventEmitter<KupEventPayload>;

    @Event({
        eventName: 'kup-hypermenu-didunload',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupDidUnload: EventEmitter<KupEventPayload>;

    //--------------------------------------------------------------------------
    // METHODS
    // -------------------------------------------------------------------------

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupHypermenuProps, descriptions);
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupHypermenuProps, props);
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }

    //--------------------------------------------------------------------------
    // INTERNAL
    // -------------------------------------------------------------------------

    @State()
    private collapsedSection: CollapsedSectionsState = {};

    @Element() rootElement: HTMLElement;

    private boxLayout: Layout;

    private visibleColumns: Column[] = [];

    private rows: BoxRow[] = [];

    private globalFilterTimeout: number;
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    //--------------------------------------------------------------------------
    // ON SOMETHING
    // -------------------------------------------------------------------------

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.language.register(this);
        this.kupManager.theme.register(this);
        this.onDataChanged();
    }

    componentDidLoad() {
        this.kupDidLoad.emit({ comp: this, id: this.rootElement.id });
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    @Watch('data')
    onDataChanged() {
        identify(this.getRows());
        this.initVisibleColumns();
        this.initRows();
        this.checkLayout();
    }

    //--------------------------------------------------------------------------
    // UTILS METHODS
    // -------------------------------------------------------------------------
    private getColumns(): Array<Column> {
        return this.data && this.data.columns
            ? this.data.columns
            : [{ title: '', name: '', size: undefined }];
    }

    private initVisibleColumns(): void {
        this.visibleColumns = this.getColumns().filter((column) => {
            if (column.hasOwnProperty('visible')) {
                return column.visible;
            }

            return true;
        });
    }

    private getRows(): BoxRow[] {
        return this.data && this.data.rows ? this.data.rows : [];
    }

    private initRows(): void {
        this.rows = this.getRows();
    }

    private checkLayout() {
        // only one section, containing all visible fields
        const section: Section = {
            horizontal: false,
            sections: [],
        };

        // adding box objects to section
        const visibleColumns = this.visibleColumns;
        let size = visibleColumns.length;
        let content = [];

        let cnt = 0;

        while (size-- > 0) {
            content.push({
                column: visibleColumns[cnt++].name,
            });
        }

        section.content = content;

        // creating a new layout
        this.boxLayout = {
            sections: [section],
        };
    }
    private onGlobalFilterChange({ detail }) {
        let value = '';
        if (detail && detail.value) {
            value = detail.value;
        }
        this.globalFilterValue = value;
    }

    private isSectionExpanded(row: BoxRow, section: Section): boolean {
        if (!row.id || !section.id) {
            return false;
        }

        return (
            this.collapsedSection[section.id] &&
            this.collapsedSection[section.id][row.id]
        );
    }

    private toggleSectionExpand(row: BoxRow, section: Section) {
        // check if section / row has id
        if (!section.id) {
            // error
            console.error('cannot expand / collapse a section withoun an ID');
            return;
        }

        if (!row.id) {
            // error
            console.error(
                'cannot expand / collapse a section of a row without ad id'
            );
            return;
        }

        // check if section already in collapsedSection
        if (!this.collapsedSection[section.id]) {
            // adding element and row, setting it to expanded
            this.collapsedSection[section.id] = {};
            this.collapsedSection[section.id][row.id] = true;
        } else {
            const s = this.collapsedSection[section.id];

            if (!s[row.id]) {
                s[row.id] = true;
            } else {
                s[row.id] = !s[row.id];
            }
        }

        // triggering rendering
        this.collapsedSection = { ...this.collapsedSection };
    }

    //--------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    private renderRow(row: BoxRow) {
        const visibleColumns = [...this.visibleColumns];

        let boxContent = null;

        // if layout in row, use that one
        let rowLayout = row.layout;
        if (!rowLayout) {
            // otherwise, use 'default' layout
            rowLayout = this.boxLayout;
        }

        let horizontal = false;
        if (rowLayout) {
            if (rowLayout.horizontal) {
                horizontal = true;
            }

            const sections = rowLayout.sections;
            let size = sections.length;

            let cnt = 0;
            if (size > 0) {
                boxContent = [];
            }

            // create fake parent section
            const parent: Section = {
                horizontal: horizontal,
            };

            while (size-- > 0) {
                boxContent.push(
                    this.renderSection(
                        sections[cnt++],
                        parent,
                        row,
                        visibleColumns
                    )
                );
            }
        }

        let rowObject = null;
        let badges = null;
        if (row.badgeData && row.badgeData.length > 0) {
            badges = row.badgeData.map((badge) => (
                <kup-badge
                    text={badge.text}
                    class={
                        badge['className']
                            ? `centered ${badge['className']}`
                            : 'centered'
                    }
                    imageData={badge.imageData}
                />
            ));
        }

        const boxClass = {
            box: true,
            column: !horizontal,
        };

        return (
            <div class="box-wrapper">
                <div class={boxClass}>
                    {boxContent}
                    {badges}
                </div>
                {rowObject}
            </div>
        );
    }

    private renderSection(
        section: Section,
        parent: Section,
        row: BoxRow,
        visibleColumns: Column[]
    ) {
        let sectionContent = null;

        if (section.sections && section.sections.length > 0) {
            // rendering child
            const sections = section.sections;
            let size = sections.length;

            let cnt = 0;
            if (size > 0) {
                sectionContent = [];
            }

            while (size-- > 0) {
                sectionContent.push(
                    this.renderSection(
                        sections[cnt++],
                        section,
                        row,
                        visibleColumns
                    )
                );
            }
        } else if (section.content) {
            // rendering box objects
            const content = section.content;
            let size = content.length;

            let cnt = 0;
            if (size > 0) {
                sectionContent = [];
            }

            while (size-- > 0) {
                sectionContent.push(
                    this.renderBoxObject({
                        boxObject: content[cnt++],
                        row,
                        visibleColumns,
                    })
                );
            }
        } else if (visibleColumns.length > 0) {
            // getting first column
            const column = visibleColumns[0];

            // removing first column
            visibleColumns.splice(0, 1);

            sectionContent = this.renderBoxObject({
                boxObject: { column: column.name },
                row,
                visibleColumns,
            });
        }

        const sectionExpanded = this.isSectionExpanded(row, section);

        const isGrid = !!section.columns;

        const sectionClass: { [index: string]: boolean } = {
            'box-section': true,
            open: sectionExpanded,
            column: !isGrid && !section.horizontal,
            grid: isGrid,
            titled: !!section.title,
            'last-child': !section.sections || section.sections.length === 0,
        };

        if (section.cssClass) {
            var classes = section.cssClass.split(' ');
            for (let index = 0; index < classes.length; index++) {
                sectionClass[classes[index]] = true;
            }
        }

        const sectionStyle: any = section.style || {};
        if (section.dim && parent) {
            sectionStyle.flex = `0 0 ${section.dim}`;

            if (parent.horizontal) {
                sectionStyle.maxWidth = section.dim;
            } else {
                sectionStyle.maxHeight = section.dim;
            }
        }

        if (isGrid) {
            sectionStyle[
                'grid-template-columns'
            ] = `repeat(${section.columns}, 1fr)`;
        }

        let sectionContainer = null;
        if (section.collapsible) {
            sectionClass['collapse-section'] = true;

            const contentClass = {
                content: true,
            };

            // TODO I18N
            let headerTitle = '';
            if (section.title) {
                headerTitle = section.title;
            } else if (sectionExpanded) {
                headerTitle = this.kupManager.language.translate(
                    KupLanguageGeneric.COLLAPSE
                );
            } else {
                headerTitle = this.kupManager.language.translate(
                    KupLanguageGeneric.EXPAND
                );
            }

            sectionContainer = (
                <div class={sectionClass} style={sectionStyle}>
                    <div class={contentClass}>{sectionContent}</div>
                    <div
                        class="header"
                        role="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            this.toggleSectionExpand(row, section);
                        }}
                    >
                        <div class="header-content">
                            <span>{headerTitle}</span>
                            <span class="mdi mdi-chevron-down" />
                        </div>
                    </div>
                </div>
            );
        } else {
            const title = section.title ? <h3>{section.title}</h3> : null;

            sectionContainer = (
                <div class={sectionClass} style={sectionStyle}>
                    {title}
                    {sectionContent}
                </div>
            );
        }

        return sectionContainer;
    }

    private renderBoxObject({
        boxObject,
        row,
        visibleColumns,
    }: {
        boxObject: BoxObject;
        row: BoxRow;
        visibleColumns: Column[];
    }) {
        let classObj: Record<string, boolean> = {
            'box-object': true,
        };
        let boContent = null;

        let boStyle = {};
        //let boInnerHTML = null;
        let cell = null;
        let column: Column = null;
        if (boxObject.column) {
            cell = row.cells[boxObject.column];
            column = null;
            if (cell) {
                // removing column from visibleColumns
                let index = -1;

                for (let i = 0; i < visibleColumns.length; i++) {
                    const c = visibleColumns[i];

                    if (c.name === boxObject.column) {
                        index = i;
                        break;
                    }
                }

                if (index >= 0) {
                    column = visibleColumns[index];
                    visibleColumns.splice(index, 1);
                }

                if (cell.style) {
                    boStyle = { ...cell.style };
                }
                let props: any = { ...cell.data };

                if (this.kupManager.objects.isButton(cell.obj)) {
                    if (props) {
                        boContent = (
                            <FButton class="cell-button" {...props}></FButton>
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (isChart(cell, boxObject)) {
                    if (props) {
                        boContent = <kup-chart class="cell-chart" {...props} />;
                    } else {
                        boContent = undefined;
                    }
                } else if (this.kupManager.objects.isCheckbox(cell.obj)) {
                    if (props) {
                        props['disabled'] = row;
                    } else {
                        props = { disabled: row };
                    }
                    boContent = (
                        <kup-checkbox
                            class="cell-checkbox"
                            {...props}
                        ></kup-checkbox>
                    );
                } else if (isEditor(cell, boxObject)) {
                    boContent = <kup-editor text={cell.value}></kup-editor>;
                } else if (this.kupManager.objects.isIcon(cell.obj)) {
                    if (props) {
                        if (!props.sizeX) {
                            props['sizeX'] = '18px';
                        }
                        if (!props.sizeY) {
                            props['sizeY'] = '18px';
                        }
                        boContent = (
                            <FImage wrapperClass="cell-icon" {...props} />
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (isImage(cell, boxObject)) {
                    if (props) {
                        if (!props.sizeY) {
                            props['sizeY'] = 'auto';
                        }
                        if (props.fit === undefined) {
                            props.fit = true;
                        }
                        if (props.badgeData) {
                            classObj['has-padding'] = true;
                        }
                        boContent = (
                            <FImage wrapperClass="cell-image" {...props} />
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (this.kupManager.objects.isPassword(cell.obj)) {
                    boContent = (
                        <kup-text-field
                            input-type="password"
                            initial-value={cell.value}
                            disabled={true}
                        ></kup-text-field>
                    );
                } else if (isProgressBar(cell, boxObject)) {
                    if (props) {
                        boContent = (
                            <kup-progress-bar
                                class="cell-progress-bar"
                                {...props}
                            ></kup-progress-bar>
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (isRadio(cell, boxObject)) {
                    if (props) {
                        props['disabled'] = true;
                        boContent = (
                            <kup-radio
                                class="cell-radio"
                                {...props}
                            ></kup-radio>
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (isGauge(cell, boxObject)) {
                    if (props) {
                        boContent = (
                            <kup-gauge
                                value={stringToNumber(cell.value)}
                                width-component="100%"
                                {...props}
                            ></kup-gauge>
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (isKnob(cell, boxObject)) {
                    if (props) {
                        boContent = (
                            <kup-progress-bar
                                class="cell-progress-bar"
                                value={stringToNumber(cell.value)}
                                {...props}
                            ></kup-progress-bar>
                        );
                    } else {
                        boContent = undefined;
                    }
                } else if (isTree(cell, boxObject)) {
                    boContent = <kup-tree {...props}></kup-tree>;
                } else {
                    boContent = getCellValueForDisplay(column, cell);
                }
            }
        } else if (boxObject.value) {
            // fixed value
            boContent = boxObject.value;
        }
        let title: string = undefined;

        return (
            <div
                data-cell={cell}
                data-row={row}
                data-column={boxObject.column}
                class={classObj}
                style={boStyle}
                title={title}
            >
                <span>{boContent}</span>
            </div>
        );
    }

    render() {
        let filterPanel = null;
        if (this.globalFilter) {
            filterPanel = (
                <div id="global-filter">
                    <kup-text-field
                        fullWidth={true}
                        isClearable={true}
                        label={this.kupManager.language.translate(
                            KupLanguageSearch.SEARCH
                        )}
                        icon="magnify"
                        initialValue={this.globalFilterValue}
                        onkup-textfield-input={(event) => {
                            window.clearTimeout(this.globalFilterTimeout);
                            this.globalFilterTimeout = window.setTimeout(
                                () => this.onGlobalFilterChange(event),
                                600
                            );
                        }}
                        onkup-textfield-cleariconclick={(event) =>
                            this.onGlobalFilterChange(event)
                        }
                    ></kup-text-field>
                </div>
            );
        }

        let boxContent = null;

        let containerStyle = {};

        if (this.rows.length === 0) {
            boxContent = (
                <p id="empty-data-message">
                    {this.kupManager.language.translate(
                        KupLanguageGeneric.EMPTY_DATA
                    )}
                </p>
            );
            containerStyle = { 'grid-template-columns': `repeat(1, 1fr)` };
        } else {
            containerStyle = {
                'grid-template-columns': `repeat(1, 1fr)`,
            };
            const rows = this.rows;
            let size = rows.length;

            let cnt = 0;
            boxContent = [];

            while (size-- > 0) {
                boxContent.push(this.renderRow(rows[cnt++]));
            }
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id="kup-component">
                    <div class={'box-component'}>
                        {filterPanel}
                        <div
                            id={'box-container'}
                            style={containerStyle}
                            onMouseLeave={(ev) => {
                                ev.stopPropagation();
                            }}
                        >
                            {boxContent}
                        </div>
                    </div>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.language.unregister(this);
        this.kupManager.theme.unregister(this);
        this.kupDidUnload.emit({ comp: this, id: this.rootElement.id });
    }
}
