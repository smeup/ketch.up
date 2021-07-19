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
  name: 'ComboboxDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-combobox-click',
          type: 'click',
        },
        {
          name: 'kup-combobox-change',
          type: 'change',
        },
        {
          name: 'kup-combobox-input',
          type: 'input',
        },
        {
          name: 'kup-combobox-focus',
          type: 'focus',
        },
        {
          name: 'kup-combobox-blur',
          type: 'blur',
        },
        {
          name: 'kup-combobox-iconclick',
          type: 'click',
        },
        {
          name: 'kup-combobox-itemclick',
          type: 'click',
        },
        {
          name: 'kup-combobox-textfieldsubmit',
          type: 'click',
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
          description: 'Props of the sub-components.',
          type: 'Object',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'disabled',
          description:
            'Defaults at false. When set to true, the component is disabled.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'displayMode',
          description:
            'Sets how to show the selected item value. Suported values: "code", "description", "both".',
          type: 'string',
          default: 'description',
          try: 'field',
        },
        {
          prop: 'initialValue',
          description: 'Sets the initial value of the component.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'isSelect',
          description: 'Lets the combobox behave as a select element.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'selectMode',
          description:
            'Sets how to return the selected item value. Suported values: "code", "description", "both".',
          type: 'string',
          default: 'description',
          try: 'field',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-full-height',
          description:
            'The color picker will fill all the available vertical space (needs a new render to be effective).',
        },
        {
          class: 'kup-full-width',
          description:
            'The color picker will fill all the available horizontal space (needs a new render to be effective).',
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
  let comp = document.createElement('kup-combobox');
  comp.id = 'demo-component';
  comp.data = {
    'kup-list': {
      data: [
        {
          text: 'First item',
          value: 'CODE_1',
        },
        {
          text: 'Second item',
          value: 'CODE_2',
        },
        {
          text: 'Third item',
          value: 'CODE_3',
        },
      ],
      displayMode: 'both',
      selectable: true,
    },
    'kup-text-field': {
      label: 'Demo',
    },
  };
  comp.displayMode = 'description';
  comp.initialValue = 'First item';
  comp.selectMode = 'description';
  return comp;
}
</script>
