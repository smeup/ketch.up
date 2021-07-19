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
  name: 'RadioDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-radio-change',
          type: 'change',
        },
        {
          name: 'kup-radio-focus',
          type: 'focus',
        },
        {
          name: 'kup-radio-blur',
          type: 'blur',
        },
      ],
      demoProps: [
        {
          prop: 'columns',
          description:
            'Number of columns. When undefined, radio fields will be displayed inline.',
          type: 'number',
          default: 'null',
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
          description:
            'Object array containing the data of the radio list: value, label to be shown and status (if checked or not).',
          type: 'KupRadioData[]',
          default: 'null',
          try: 'json',
        },
        {
          prop: 'disabled',
          description:
            'Sets the component to disabled state, making it not interactable.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'leadingLabel',
          description:
            'The label will be displayed to the left of the component.',
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
  let comp = document.createElement('kup-radio');
  comp.data = [
    {
      value: '1',
      label: 'First option',
      checked: true,
    },
    {
      value: '2',
      label: 'Second option',
      checked: false,
    },
  ];
  comp.id = 'demo-component';
  return comp;
}
</script>
