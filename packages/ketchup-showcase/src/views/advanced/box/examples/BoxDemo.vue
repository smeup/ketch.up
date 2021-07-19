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
import { defaultData } from '@/mock/box';

export default {
  components: {
    Demo,
  },
  name: 'BoxDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-box-autoselect',
          type: 'CustomEvent',
        },
        {
          name: 'kup-box-click',
          type: 'CustomEvent',
        },
        {
          name: 'kup-box-dragended',
          type: 'CustomEvent',
        },
        {
          name: 'kup-box-dragstarted',
          type: 'CustomEvent',
        },
        {
          name: 'kupBoxDropped',
          type: 'CustomEvent',
        },
        {
          name: 'kup-box-selected',
          type: 'CustomEvent',
        },
        {
          name: 'kup-box-rowactionclick',
          type: 'CustomEvent',
        },
        {
          name: 'kup-box-rowactionmenuclick',
          type: 'CustomEvent',
        },
      ],
      demoProps: [
        {
          prop: 'cardData',
          description:
            'When present, the box will be rendered using the card component. This prop contains the card props which will be spread on the kup-card.',
          type: 'ComponentCardElement',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'columns',
          description: 'Number of columns.',
          type: 'number',
          default: '1',
          try: 'field',
        },
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
          description: 'The actual data of the box.',
          type: '{ columns?: Column[]; rows?: BoxRow[]; }',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'dragEnabled',
          description: 'Enable dragging.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'dropEnabled',
          description: 'Enable dropping.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'dropOnSection',
          description: 'Drop can be done in section.',
          type: 'boolean',
          default: 'undefined',
          try: 'switch',
        },
        {
          prop: 'enableRowActions',
          description:
            'If enabled, a button to load / display the row actions will be displayed on the right of every box.',
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
          prop: 'kanban',
          description: 'Displays the boxlist as a Kanban.',
          type: 'BoxKanban',
          default: 'null',
          try: 'json',
        },
        {
          prop: 'layout',
          description:
            'How the field will be displayed. If not present, a default one will be created.',
          type: 'Layout',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'multiSelection',
          description: 'Enable multi selection.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'pageSelected',
          description: 'Current page number.',
          type: 'number',
          default: '1',
          try: 'field',
        },
        {
          prop: 'pageSize',
          description: 'Number of boxes per page.',
          type: 'number',
          default: '10',
          try: 'field',
        },
        {
          prop: 'pagination',
          description: 'Enables pagination.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'rowsPerPage',
          description: 'Number of current rows per page.',
          type: 'number',
          default: 'undefined',
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
          prop: 'selectBox',
          description: 'Automatically selects the box at the specified index.',
          type: 'number',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'selectedRowsState',
          description: 'Multiple selection.',
          type: 'BoxRow[]',
          default: '[]',
          try: 'array',
        },
        {
          prop: 'showSelection',
          description: 'If enabled, highlights the selected box/boxes.',
          type: 'boolean',
          default: 'true',
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
          prop: 'sortBy',
          description: 'If sorting is enabled, specifies which column to sort.',
          type: 'string',
          default: 'undefined',
          try: 'field',
        },
        {
          prop: 'sortEnabled',
          description: 'Enable sorting.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'swipeDisabled',
          description: 'Disable swipe.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
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
      ],
      demoClasses: [
        {
          class: 'kup-borderless',
          description: 'Displays boxes without borders.',
        },
        {
          class: 'kup-bottom-aligned',
          description:
            "Content will be vertically aligned to section's bottom.",
        },
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-dashed-sections',
          description: 'Setions will have a dashed border.',
        },
        {
          class: 'kup-flat-on-hover',
          description: 'Disables the box shadow effect on hover.',
        },
        {
          class: 'kup-info',
          description:
            'The component will be rendered using the informational color of the app.',
        },
        {
          class: 'kup-left-aligned',
          description:
            "Content will be horizontally aligned to section's left.",
        },
        {
          class: 'kup-paddingless',
          description: 'Removes padding from box sections.',
        },
        {
          class: 'kup-right-aligned',
          description:
            "Content will be horizontally aligned to section's right.",
        },
        {
          class: 'kup-round',
          description: 'Boxes borders will be heavily rounded.',
        },
        {
          class: 'kup-secondary',
          description:
            'The component will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-shaped',
          description: 'Boxes borders will be slightly rounded.',
        },
        {
          class: 'kup-success',
          description:
            'The component will be rendered using the success color of the app.',
        },
        {
          class: 'kup-top-aligned',
          description: "Content will be vertically aligned to section's top.",
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
  let comp = document.createElement('kup-box');
  comp.columns = '4';
  comp.data = defaultData;
  comp.id = 'demo-component';
  comp.showSelection = true;
  comp.showTooltipOnRightClick = true;
  comp.tooltipEnabled = true;
  return comp;
}
</script>
