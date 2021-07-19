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
import { baseData } from '@/mock/chart';

export default {
  components: {
    Demo,
  },
  name: 'TreeDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-tree-nodecollapse',
          type: 'custom',
        },
        {
          name: 'kup-tree-nodeexpand',
          type: 'custom',
        },
        {
          name: 'kup-tree-nodeselected',
          type: 'custom',
        },
        {
          name: 'kup-tree-nodedblclick',
          type: 'dblclick',
        },
        {
          name: 'kup-tree-dynamicmassexpansion',
          type: 'custom',
        },
      ],
      demoProps: [
        {
          prop: 'autoSelectionNodeMode',
          description: 'Auto selection of the node.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'columns',
          description:
            'The columns of the tree when tree visualization is active.',
          type: 'Column[]',
          default: 'undefined',
          try: 'json',
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
          description: 'The actual data of the chart.',
          type: 'TreeNode[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'density',
          description:
            "The density of the rows, defaults at 'medium' and can also be set to 'dense' or 'wide'",
          type: 'string',
          default: 'medium',
          try: 'field',
        },
        {
          prop: 'dynamicExpansionCallback',
          description:
            'Function that gets invoked when a new set of nodes must be loaded as children of a node. When useDynamicExpansion is set, the tree component will have two different behaviors depending on the value of this prop. 1 - If this prop is set to null, no callback to download data is available: the component will emit an event requiring the parent to load the children of the given node. 2 - If this prop is set to have a callback, then the component will automatically make requests to load children of a given node. After the load has been completed, a different event will be fired to alert the parent of the change.',
          type: '?',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'expanded',
          description:
            'Flag: the nodes of the whole tree must be already expanded upon loading. Disabled nodes do NOT get expanded.',
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
          prop: 'scrollOnHover',
          description:
            'When the mouse move towards the left or right edge and there is an overflow, the tree will automatically scroll.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'selectedNode',
          description:
            'An array of integers containing the path to a selected child. Groups up the properties SelFirst, SelItem, SelName.',
          type: 'number[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'showColumns',
          description: 'Shows the tree data as a table.',
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
          prop: 'showHeader',
          description:
            'Flag: shows the header of the tree when the tree is displayed as a table.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'showIcons',
          description: 'Shows the icons of the nodes.',
          type: 'boolean',
          default: 'true',
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
        {
          prop: 'useDynamicExpansion',
          description:
            'When the component must use the dynamic expansion feature to open its nodes, it means that not all the nodes of the tree have been passed inside the data property. Therefore, when expanding a node, the tree must emit an event (or run a given callback) and wait for the child nodes to be downloaded from the server.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-full-width',
          description: 'The tree will fill all the available horizontal space.',
        },
        {
          class: 'kup-info',
          description:
            'The component will be rendered using the informational color of the app.',
        },
        {
          class: 'kup-layout-fixed',
          description:
            'Sets a fixed layout to improve performances (especially when using Google Chrome).',
        },
        {
          class: 'kup-secondary',
          description:
            'The component will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-shaped',
          description:
            'The right border of the cells will be shaped. It only applies when showColumns prop is set to false. ',
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
  let comp = document.createElement('kup-tree');
  comp.autoSelectionNodeMode = true;
  comp.data = [
    {
      cells: {
        Mat: {
          obj: { t: 'NR', p: '', k: '00Mat' },
          value: '00Mat',
          options: true,
        },
        Program: {
          obj: { t: 'NR', p: '', k: '00Program' },
          value: '00Program',
          options: false,
        },
        Attack: {
          obj: { t: 'NR', p: '', k: '00Attack' },
          value: '00Attack',
          options: true,
        },
      },
      children: [
        {
          cells: {
            Mat: {
              obj: { t: 'NR', p: '', k: '10Mat' },
              value: '10Mat',
              options: false,
            },
            Program: {
              obj: { t: 'NR', p: '', k: '10Program' },
              value: '10Program',
              options: false,
            },
            Attack: {
              obj: { t: 'NR', p: '', k: '10Attack' },
              value: '10Attack',
              options: true,
            },
          },
          children: [],
          disabled: false,
          expandable: false,
          npm: 'filter_1',
          id: '00100',
          isExpanded: false,
          obj: { t: 'TN', p: '', k: 'First node' },
          options: false,
          value: 'First node',
        },
        {
          cells: {
            Mat: {
              obj: { t: 'NR', p: '', k: '11Mat' },
              value: '11Mat',
              options: false,
            },
            Program: {
              obj: { t: 'NR', p: '', k: '11Program' },
              value: '11Program',
              options: true,
            },
            Attack: {
              obj: { t: 'NR', p: '', k: '11Attack' },
              value: '11Attack',
              options: false,
            },
          },
          children: [
            {
              cells: {
                Mat: {
                  obj: { t: 'NR', p: '', k: '20Mat' },
                  value: '20Mat',
                  options: true,
                },
                Program: {
                  obj: { t: 'NR', p: '', k: '20Program' },
                  value: '20Program',
                  options: false,
                },
                Attack: {
                  obj: { t: 'NR', p: '', k: '20Attack' },
                  value: '20Attack',
                  options: true,
                },
              },
              children: [
                {
                  cells: {
                    Mat: {
                      obj: { t: 'NR', p: '', k: '30Mat' },
                      value: '30Mat',
                      options: false,
                    },
                    Program: {
                      obj: { t: 'NR', p: '', k: '30Program' },
                      value: '30Program',
                      options: true,
                    },
                    Attack: {
                      obj: { t: 'NR', p: '', k: '30Attack' },
                      value: '30Attack',
                      options: false,
                    },
                  },
                  children: [],
                  disabled: false,
                  expandable: false,
                  icon: 'account',
                  id: '0010300',
                  isExpanded: false,
                  obj: { t: 'TN', p: '', k: 'FIOGIA30' },
                  options: false,
                  value: 'FIOGIA30',
                },
              ],
              disabled: true,
              expandable: true,
              icon: 'favorite',
              id: '001201',
              isExpanded: false,
              obj: { t: 'TN', p: '', k: 'Second node item' },
              options: true,
              value: 'Second node item',
            },
          ],
          disabled: false,
          expandable: true,
          icon: 'filter_2',
          id: '00111',
          isExpanded: true,
          obj: { t: 'TN', p: '', k: 'Second node' },
          options: false,
          value: 'Second node',
        },
      ],
      disabled: false,
      expandable: true,
      icon: 'widgets',
      id: '0005',
      isExpanded: true,
      obj: { t: '', p: '', k: 'Demo' },
      options: true,
      value: 'Demo',
    },
  ];
  comp.hoverScroll = true;
  comp.id = 'demo-component';
  comp.showIcons = true;
  comp.tooltipEnabled = true;
  return comp;
}
</script>
