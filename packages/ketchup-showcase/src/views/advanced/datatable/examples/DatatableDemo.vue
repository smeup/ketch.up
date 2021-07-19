<template>
  <div>
    <demo
      :demoComp="demoComp"
      :demoEvents="demoEvents"
      :demoProps="demoProps"
      :demoClasses="demoClasses"
    ></demo>
  </div>
</template>

<script>
import Demo from '@/views/advanced/page/templates/Demo';
import { defaultDataTable } from '@/mock/dataTable';

export default {
  components: {
    Demo,
  },
  name: 'DatatableDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-datatable-resetselectedrows',
          type: 'CustomEvent',
        },
        {
          name: 'kup-datatable-autorowselect',
          type: 'CustomEvent',
        },
        {
          name: 'kup-datatable-rowselected',
          type: 'CustomEvent',
        },
        {
          name: 'kup-datatable-cellupdate',
          type: 'CustomEvent',
        },
        {
          name: 'kup-datatable-click',
          type: 'click',
        },
        {
          name: 'kup-datatable-contextmenu',
          type: 'click',
        },
        {
          name: 'kup-datatable-dblclick',
          type: 'dblclick',
        },
        {
          name: 'kup-datatable-columnmenu',
          type: 'CustomEvent',
        },
        {
          name: 'kup-datatable-optionclick',
          type: 'click',
        },
        {
          name: 'kup-datatable-rowactionclick',
          type: 'click',
        },
        {
          name: 'kup-datatable-loadmoreclick',
          type: 'click',
        },
        {
          name: 'kup-datatable-cellbuttonclick',
          type: 'click',
        },
        {
          name: 'kup-datatable-textfieldinput',
          type: 'input',
        },
      ],
      demoProps: [
        {
          prop: 'customStyle',
          description:
            'Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization',
          type: 'string',
          default: '""',
          try: 'css',
        },
        {
          prop: 'data',
          description: 'The data of the table.',
          type: 'TableData',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'density',
          description:
            'The density of the rows, defaults at "medium" and can be also set to "wide" or "dense".',
          type: 'string',
          default: 'dense',
          try: 'field',
        },
        {
          prop: 'editableData',
          description:
            'When set to true, editable cells will be rendered using input components.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'emptyDataLabel',
          description: 'Defines the label to show when the table is empty.',
          type: 'string',
          default: 'Empty data',
          try: 'field',
        },
        {
          prop: 'enableExtraColumns',
          description: 'Enables adding extra columns button.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'enableSortableColumns',
          description:
            'Enables the sorting of columns by dragging them into different columns.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'expandGroups',
          description: 'Expands groups when set to true.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'filters',
          description: 'List of filters set by the user.',
          type: 'GenericMap',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'fixedColumns',
          description: 'Amount of frozen columns.',
          type: 'number',
          default: '0',
          try: 'field',
        },
        {
          prop: 'fixedRows',
          description: 'Amount of frozen rows.',
          type: 'number',
          default: '0',
          try: 'field',
        },
        {
          prop: 'forceOneLine',
          description:
            'Forces cells with long text and a fixed column size to have an ellipsis set on their text. The reflect attribute is mandatory to allow styling.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'globalFilter',
          description: 'When set to true it activates the global filter.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'globalFilterValue',
          description: 'The value of the global filter.',
          type: 'string',
          default: '',
          try: 'field',
        },
        {
          prop: 'groupLabelDisplay',
          description:
            'How the label of a group must be displayed. Available modes: both, label, value. ',
          type: 'string',
          default: 'both',
          try: 'field',
        },
        {
          prop: 'groups',
          description: 'The list of groups.',
          type: 'GroupObject[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'headerIsPersistent',
          description:
            'When set to true the header will stick on top of the table when scrolling.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'isFocusable',
          description:
            'When set to true, clicked-on rows will have a visual feedback.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'lazyLoadRows',
          description:
            'When set to true, extra rows will be automatically loaded once the last row enters the viewport. When groups are present, the number of rows is referred to groups and not to their content.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'lineBreakCharacter',
          description:
            'Defines the placeholder character which will be replaced by a line break inside table header cells, normal or sticky.',
          type: 'string',
          default: '\\n',
          try: 'field',
        },
        {
          prop: 'loadMoreLimit',
          description:
            'Sets a maximum limit of new records which can be required by the load more functionality.',
          type: 'number',
          default: '1000',
          try: 'field',
        },
        {
          prop: 'loadMoreMode',
          description:
            'Establish the modality of how many new records will be downloaded.',
          type: 'LoadMoreMode',
          default: 'progressive_threshold',
          try: 'field',
        },
        {
          prop: 'loadMoreStep',
          description:
            'The number of records which will be requested to be downloaded when clicking on the load more button.',
          type: 'number',
          default: '60',
          try: 'field',
        },
        {
          prop: 'pageSelected',
          description: 'Current selected page set on component load.',
          type: 'number',
          default: '-1',
          try: 'field',
        },
        {
          prop: 'paginatorPos',
          description:
            'Sets the position of the paginator. Available values: Top, Bottom or Both.',
          type: 'string',
          default: 'Top',
          try: 'field',
        },
        {
          prop: 'removableColumns',
          description: 'Sets the possibility to remove the selected column.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'rowActions',
          description: 'Sets the actions of the rows.',
          type: 'rowAction[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'rowsPerPage',
          description: 'Sets the number of rows per page to display.',
          type: 'number',
          default: '10',
          try: 'field',
        },
        {
          prop: 'scrollOnHover',
          description:
            'When the mouse move towards the left or right edge and there is an overflow, the table will automatically scroll.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'selection',
          description: 'Set the type of the rows selection.',
          type: 'SelectionMode',
          default: 'single',
          try: 'field',
        },
        {
          prop: 'selectRow',
          description: 'Selects the specified row.',
          type: 'number',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'selectRowsById',
          description: 'Semicolon separated rows id to select.',
          type: 'string',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'showCustomization',
          description:
            'If set to true, displays the button to open the customization panel.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'showFilters',
          description: 'When set to true enables the column filters.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'showFooter',
          description: 'When set to true shows the footer.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'showGrid',
          description:
            'Can be used to customize the grid view of the table. Available settings: None, Row, Col, Complete.',
          type: 'string',
          default: 'Row',
          try: 'field',
        },
        {
          prop: 'showGroups',
          description: 'When set to true enables the column grouping.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'showHeader',
          description: 'Enables rendering of the table header.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'showLoadMore',
          description:
            'If set to true, displays the button to load more records.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'showTooltipOnRightClick',
          description:
            'If set to true, displays tooltip on right click event; if set to false, displays tooltip on mouseOver event.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'sort',
          description: 'Defines the current sorting options.',
          type: 'SortObject[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'sortableColumnsMutateData',
          description:
            'If set to true, when a column is dragged to be sorted the component directly mutates the data.columns property and then fires the event.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'sortEnabled',
          description: 'When set to true enables the sorting of the columns.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'tableHeight',
          description:
            'Sets the height of the table. If set, sticky header will behave through CSS and not JavaScript, scroll on hover will be disabled.',
          type: 'string',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'tableWidth',
          description:
            'Sets the width of the table. If set, sticky header will behave through CSS and not JavaScript, scroll on hover will be disabled.',
          type: 'string',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'tooltipDetailTimeout',
          description: 'Defines the timeout for tooltip detail.',
          type: 'number',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'tooltipEnabled',
          description: 'Enable tooltip.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'tooltipLoadTimeout',
          description: 'Defines the timeout for tooltip load.',
          type: 'number',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'totals',
          description: 'Defines the current sorting options.',
          type: 'TotalsMap',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'transpose',
          description: 'Transposes the data of the data table.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
      ],
      demoClasses: [
        {
          class: 'kup-cross-selection',
          description:
            'The selected cell will be highlighted by a cross-selection between its row and its column.',
        },
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-info',
          description:
            'The component will be rendered using the informational color of the app.',
        },
        {
          class: 'kup-layout-fixed',
          description:
            'Sets a fixed layout to improve performances (specifically when using Google Chrome, becasue every scroll triggers a repaint).',
        },
        {
          class: 'kup-secondary',
          description:
            'The component will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-success',
          description:
            'The component will be rendered using the success color of the app.',
        },
        {
          class: 'kup-warning',
          description:
            'The component will be rendered using the warning color of the app.',
        },
      ],
    };
  },
};

function createComp() {
  let comp = document.createElement('kup-data-table');
  comp.data = defaultDataTable;
  comp.density = 'dense';
  comp.groupLabelDisplay = 'both';
  comp.headerIsPersistent = true;
  comp.id = 'demo-component';
  comp.enableExtraColumns = true;
  comp.enableSortableColumns = true;
  comp.loadMoreLimit = '1000';
  comp.loadMoreStep = '60';
  comp.paginatorPos = 'Top';
  comp.rowsPerPage = '10';
  comp.showGrid = 'Row';
  comp.showCustomization = true;
  comp.showHeader = true;
  comp.sortableColumnsMutateData = true;
  comp.sortEnabled = true;
  comp.showTooltipOnRightClick = true;
  comp.tooltipEnabled = true;
  return comp;
}
</script>
