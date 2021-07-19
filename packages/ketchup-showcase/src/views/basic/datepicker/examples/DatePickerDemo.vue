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
  name: 'DatePickerDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-datepicker-click',
          type: 'click',
        },
        {
          name: 'kup-datepicker-change',
          type: 'change',
        },
        {
          name: 'kup-datepicker-cleariconclick',
          type: 'click',
        },
        {
          name: 'kup-datepicker-input',
          type: 'input',
        },
        {
          name: 'kup-datepicker-focus',
          type: 'focus',
        },
        {
          name: 'kup-datepicker-blur',
          type: 'blur',
        },
        {
          name: 'kup-datepicker-iconclick',
          type: 'click',
        },
        {
          name: 'kup-datepicker-itemclick',
          type: 'click',
        },
        {
          name: 'kup-datepicker-textfieldsubmit',
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
            'Sets the component to disabled state, making it not interactable.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'firstDayIndex',
          description:
            'The initial day index for calendar (0 - Sunday, 1 - Monday, ...) .',
          type: 'number',
          default: '1',
          try: 'field',
        },
        {
          prop: 'initialValue',
          description: 'Sets the initial value of the component.',
          type: 'string',
          default: '""',
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
  let comp = document.createElement('kup-date-picker');
  comp.id = 'demo-component';
  comp.data = {
    'kup-text-field': {
      label: 'Demo',
    },
  };
  return comp;
}
</script>
