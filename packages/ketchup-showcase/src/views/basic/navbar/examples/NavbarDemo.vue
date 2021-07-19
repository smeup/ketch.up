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
  name: 'CheckboxDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-navbar-menuitemclick',
          type: 'click',
        },
        {
          name: 'kup-navbar-optionitemclick',
          type: 'change',
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
          description: 'The actual data of the nav bar.',
          type: 'ComponentNavBarData',
          default: "title: 'default title'",
          try: 'json',
        },
        {
          prop: 'mode',
          description:
            "Defines how the bar will be displayed. Available options: DEFAULT = '', SHORT = 'short', SHORT_COLLAPSED = 'short-collapsed', FIXED = 'fixed', PROMINENT = 'prominent', DENSE = 'dense',",
          type: 'ComponentNavBarMode',
          default: "''",
          try: 'field',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The subcomponents will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-info',
          description:
            'The subcomponents will be rendered using the informational color of the app.',
        },
        {
          class: 'kup-secondary',
          description:
            'The subcomponents will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-success',
          description:
            'The subcomponents will be rendered using the success color of the app.',
        },
        {
          class: 'kup-warning',
          description:
            'The subcomponents will be rendered using the warning color of the app.',
        },
      ],
    };
  },
};

function createComp() {
  let comp = document.createElement('kup-nav-bar');
  comp.customStyle = '#kup-component .mdc-top-app-bar { position: unset; }';
  comp.data = {
    title: 'Demo',
    menuActions: [{ icon: 'search', value: 'AA', text: 'Search AA' }],
    optionActions: [
      {
        icon: 'favorite',
        value: 'f',
        tooltip: 'Favorites',
        visible: true,
      },
      { icon: 'search', value: 's', tooltip: 'Search', visible: true },
    ],
  };
  comp.id = 'demo-component';
  comp.style.position = 'absolute';
  return comp;
}
</script>
