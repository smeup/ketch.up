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
  name: 'ChipDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-chip-click',
          type: 'click',
        },
        {
          name: 'kup-chip-focus',
          type: 'focus',
        },
        {
          name: 'kup-chip-blur',
          type: 'blur',
        },
        {
          name: 'kup-chip-iconclick',
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
          description:
            'Object array containing the data of the chips: value, icon, label to be shown and checked status.',
          type: 'FChipData[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'type',
          description:
            'The type of chip. Available types: input, filter, choice or empty for default.',
          type: 'FChipType',
          default: 'standard',
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
  let comp = document.createElement('kup-chip');
  comp.data = [
    {
      value: '1_chip',
      icon: 'filter_1',
      label: 'First chip',
      checked: false,
    },
    {
      value: '2_chip',
      icon: 'filter_2',
      label: 'Second chip',
      checked: true,
    },
    {
      value: '3_chip',
      icon: 'filter_3',
      label: 'Third chip',
      checked: false,
    },
  ];
  comp.id = 'demo-component';
  comp.type = 'standard';
  return comp;
}
</script>
