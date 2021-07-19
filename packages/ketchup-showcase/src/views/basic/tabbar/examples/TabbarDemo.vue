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
  name: 'TabbarDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-tabbar-click',
          type: 'click',
        },
        {
          name: 'kup-tabbar-focus',
          type: 'focus',
        },
        {
          name: 'kup-tabbar-blur',
          type: 'blur',
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
            'Object array containing the data of the tabs: text to be shown, optional icon and status (if active or not).',
          type: 'KupTabBarData[]',
          default: 'null',
          try: 'json',
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
  let comp = document.createElement('kup-tab-bar');
  comp.data = [
    {
      value: 'First',
      text: 'First',
      icon: 'filter_1',
      active: true,
    },
    {
      value: 'Second',
      text: 'Second',
      icon: 'filter_2',
      active: false,
    },
    {
      value: 'Third',
      text: 'Third',
      icon: 'filter_3',
      active: false,
    },
    {
      value: 'Fourth',
      text: 'Fourth',
      icon: 'filter_4',
      active: false,
    },
  ];
  comp.id = 'demo-component';
  return comp;
}
</script>
