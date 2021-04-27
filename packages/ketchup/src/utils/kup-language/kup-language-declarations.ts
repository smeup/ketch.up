/**
 * Master type extending all subtypes of keys.
 * Remember to edit "languages.json"
 */
export type KupLanguageKey =
    | KupLanguageCheckbox
    | KupLanguageColumn
    | KupLanguageDensity
    | KupLanguageFontsize
    | KupLanguageGeneric
    | KupLanguageGrid
    | KupLanguageGrouping
    | KupLanguagePage
    | KupLanguageRow
    | KupLanguageSearch
    | KupLanguageTotals;
/**
 * Default languages available.
 */
export enum KupLanguageDefaults {
    CN = 'chinese',
    EN = 'english',
    ES = 'spanish',
    FR = 'french',
    PL = 'polish',
    RU = 'russian',
}
/**
 * Checkbox statuses decodes (data table groups).
 */
export enum KupLanguageCheckbox {
    ALL = 'checkboxAll',
    CHECKED = 'checkboxChecked',
    INDETERMINATE = 'checkboxIndeterminate',
    UNCHECKED = 'checkboxUnchecked',
}
/**
 * Column related decodes.
 */
export enum KupLanguageColumn {
    ADD = 'columnAdd',
    ADD_DESCRIPTION = 'columnAddDescription',
    HIDE = 'columnHide',
}
/**
 * Density decodes (data table customization settings).
 */
export enum KupLanguageDensity {
    DENSE = 'densityDense',
    LABEL = 'densityLabel',
    MEDIUM = 'densityMedium',
    WIDE = 'densityWide',
}
/**
 * Font size decodes (data table customization settings).
 */
export enum KupLanguageFontsize {
    BIG = 'fontsizeBig',
    LABEL = 'fontsizeLabel',
    MEDIUM = 'fontsizeMedium',
    SMALL = 'fontsizeSmall',
}
/**
 * Generic user interface action/messages.
 */
export enum KupLanguageGeneric {
    COLLAPSE = 'geenericCollapse',
    DROP_YOUR_DATA = 'genericDropYourData',
    EDITABLE = 'genericEditable',
    EDITABLE_FIELD = 'genericEditableField',
    EMPTY_DATA = 'genericEmptyData',
    EXPAND = 'genericExpand',
    EXPERIMENTAL_FEAT = 'genericExperimentalFeat',
    INVALID_COLOR = 'genericInvalidColor',
    LAYOUT_NYI = 'genericLayoutNotYetImplemented',
    LOAD_MORE = 'genericLoadMoreData',
    OPEN_NAVIGATION_MENU = 'genericOpenNavigationMenu',
    OPTIONS = 'genericOptions',
    REMOVE_FILTERS = 'genericRemoveFilters',
    SHOW_ROW_OPTIONS = 'genericShowRowOptions',
    SHOW_TOOLTIP_INFO = 'genericShowTooltipInfo',
    SORT_BY = 'genericSortBy',
    TOGGLE = 'genericToggle',
    TOTALS_TABLE = 'genericTotalsTable',
    TRANSPOSE_DATA = 'genericTransposeData',
    VIEW_AS = 'genericViewAs',
}
/**
 * Grid decodes (data table customization settings).
 */
export enum KupLanguageGrid {
    COLUMN = 'gridColumn',
    COMPLETE = 'gridComplete',
    LABEL = 'gridLabel',
    NONE = 'gridNone',
    ROW = 'gridRow',
}
/**
 * Grouping decodes (data table groups).
 */
export enum KupLanguageGrouping {
    DISABLE = 'groupingDisable',
    ENABLE = 'groupingEnable',
}
/**
 * Page related decodes.
 */
export enum KupLanguagePage {
    PAGE = 'pagePage',
    TOTAL = 'pageTotal',
}
/**
 * Row related decodes.
 */
export enum KupLanguageRow {
    NEXT = 'rowNext',
    PREVIOUS = 'rowPrevious',
    RENDERED = 'rowRendered',
    KEY = 'rowKey',
    EDITABLE_KEY = 'rowEditableKey',
    ROWS = 'rowRows',
    SELECTED = 'rowSelected',
    TOTAL = 'rowTotal',
}
/**
 * Search decodes.
 */
export enum KupLanguageSearch {
    FROM = 'searchFrom',
    SEARCH = 'searchSearch',
    TO = 'searchTo',
}
/**
 * Footer totals decodes (tree and data table).
 */
export enum KupLanguageTotals {
    AVERAGE = 'totalsAverage',
    CALCULATE = 'totalsCalculate',
    CANCEL = 'totalsCancel',
    COUNT = 'totalsCount',
    DISTINCT = 'totalsDistinct',
    FORMULA = 'totalsFormula',
    MAXIMUM = 'totalsMaximum',
    MINIMUM = 'totalsMinimum',
    SUM = 'totalsSum',
}
