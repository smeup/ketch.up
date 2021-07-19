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
  name: 'FieldDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-field-change',
          type: 'CustomEvent',
        },
        {
          name: 'kup-field-submit',
          type: 'CustomEvent',
        },
      ],
      demoProps: [
        {
          prop: 'customStyle',
          description:
            'Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization',
          type: 'string',
          default: 'undefined',
          try: 'css',
        },
        {
          prop: 'data',
          description:
            'The actual data passed to the component, including its props.',
          type: 'Object',
          default: '{}',
          try: 'json',
        },
        {
          prop: 'label',
          description:
            'The text of the label. If set to empty or has only white space chars, the label will be removed.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'labelPos',
          description: "Sets the label's position, left right or top.",
          type: 'string',
          default: 'left',
          try: 'field',
        },
        {
          prop: 'showSubmit',
          description:
            'Sets whether the submit button must be displayed or not.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'submitLabel',
          description: "Sets the submit button's label.",
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'submitPos',
          description:
            "Sets the submit button's position, top right bottom or left.",
          type: 'string',
          default: 'right',
          try: 'field',
        },
        {
          prop: 'type',
          description:
            'The type of the component. Currently suppoted values: cmb (combobox), itx (text field), rad (radio).',
          type: 'string',
          default: 'undefined',
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
  let comp = document.createElement('kup-field');
  comp.data = { icon: 'widgets', label: 'demo' };
  comp.dataCMB = {
    textfieldData: {
      trailingIcon: true,
      icon: 'arrow_drop_down',
      label: 'demo',
    },
    listData: {
      data: [
        {
          text: 'First choice',
          value: '1',
          selected: true,
        },
        {
          text: 'Selected choice',
          value: '2',
        },
        {
          text: 'Third choice',
          value: '3',
        },
      ],
      selectable: true,
    },
  };
  comp.dataITX = { icon: 'widgets', label: 'demo' };
  comp.dataRAD = {
    data: [
      {
        value: '1',
        label: 'First',
        checked: false,
      },
      {
        value: '2',
        label: 'Second',
        checked: false,
      },
      {
        value: '3',
        label: 'Third',
        checked: true,
      },
      {
        value: '4',
        label: 'Fourth',
        checked: false,
      },
      {
        value: '5',
        label: 'Fifth',
        checked: false,
      },
    ],
  };
  comp.id = 'demo-component';
  comp.type = 'ITX';
  return comp;
}
</script>
