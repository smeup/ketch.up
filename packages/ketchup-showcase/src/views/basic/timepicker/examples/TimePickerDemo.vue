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
  name: 'TimePickerDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-timepicker-click',
          type: 'click',
        },
        {
          name: 'kup-timepicker-change',
          type: 'change',
        },
        {
          name: 'kup-timepicker-cleariconclick',
          type: 'click',
        },
        {
          name: 'kup-timepicker-input',
          type: 'input',
        },
        {
          name: 'kup-timepicker-focus',
          type: 'focus',
        },
        {
          name: 'kup-timepicker-blur',
          type: 'blur',
        },
        {
          name: 'kup-timepicker-iconclick',
          type: 'click',
        },
        {
          name: 'kup-timepicker-itemclick',
          type: 'click',
        },
        {
          name: 'kup-timepicker-textfieldsubmit',
          type: 'click',
        },
      ],
      demoProps: [
        {
          prop: 'clockVariant',
          description:
            'When set to true, the drop down menu will display a clock.',
          type: 'boolean',
          default: 'true',
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
          description: 'Props of the sub-components.',
          type: 'Object',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'initialValue',
          description: 'Sets the initial value of the component.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'manageSeconds',
          description: 'Flag for set managing seconds too.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'timeMinutesStep',
          description: 'The minutes step for values of the time picker.',
          type: 'number',
          default: '10',
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
  let comp = document.createElement('kup-time-picker');
  comp.id = 'demo-component';
  comp.data = {
    'kup-text-field': {
      label: 'Demo',
    },
  };
  comp.clockVariant = true;
  return comp;
}
</script>
