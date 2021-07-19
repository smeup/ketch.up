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

export default {
  components: {
    Demo,
  },
  name: 'ListDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-list-click',
          type: 'click',
        },
        {
          name: 'kup-list-change',
          type: 'change',
        },
        {
          name: 'kup-list-input',
          type: 'input',
        },
        {
          name: 'kup-list-focus',
          type: 'focus',
        },
        {
          name: 'kup-list-blur',
          type: 'blur',
        },
      ],
      demoProps: [
        {
          prop: 'arrowDown',
          description:
            'Allows to execute arrow down operation on th list, from external component. Used in autocomplete field and combobox field.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'arrowUp',
          description:
            'Allows to execute arrow up operation on the list, from external component. Used in autocomplete field and combobox field.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
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
          description: 'The data of the list.',
          type: 'ComponentListElement',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'displayMode',
          description:
            'Selects how the items must display their label and how they can be filtered for. Supported values: "description", "code", "both".',
          type: 'string',
          default: 'description',
          try: 'field',
        },
        {
          prop: 'filter',
          description:
            'Keeps string for filtering elements when filter mode is active.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'hideText',
          description:
            "Hides rows' text, ideally to display a list of icons only.",
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'isMenu',
          description: 'Defines whether the list is a menu or not.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'menuVisible',
          description:
            "Sets the status of the menu, when false it's hidden otherwise it's visible.",
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'roleType',
          description:
            'Defines the type of selection. Values accepted: listbox, radiogroup or group.',
          type: 'string',
          default: 'listbox',
          try: 'field',
        },
        {
          prop: 'selectable',
          description: 'Defines whether items are selectable or not.',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'showIcons',
          description: 'Allows to view an icon image for each list item',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'twoLine',
          description:
            'The list elements descriptions will be arranged in two lines.',
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
          class: 'kup-info',
          description:
            'The component will be rendered using the informational color of the app.',
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
  let comp = document.createElement('kup-list');
  comp.data = [
    {
      text: 'First choice',
      value: '1',
      icon: 'add_alert',
      trailingIcon: true,
    },
    {
      text: 'Selected choice',
      value: '2',
      selected: true,
      icon: 'ac_unit',
    },
    {
      text: null,
      value: null,
      isSeparator: true,
    },
    {
      text: 'Third choice (below a separator)',
      value: '3',
      icon: '3d_rotation',
    },
  ];
  comp.id = 'demo-component';
  comp.selectable = true;
  return comp;
}
</script>
