<template>
  <div>
    <demo
      :demoComp="demoComp"
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
  name: 'LazyDemo',
  data() {
    return {
      demoComp: createComp(),
      demoProps: [
        {
          prop: 'componentName',
          description: 'Sets the tag name of the component to be lazy loaded.',
          type: 'string',
          default: 'undefined',
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
          description: 'Sets the data of the component to be lazy loaded.',
          type: 'string',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'renderMode',
          description:
            'Decides when the sub-component should be rendered. By default when both the component props exist and the component is in the viewport.',
          type: 'string',
          default: 'both',
          try: 'field',
        },
        {
          prop: 'showPlaceholder',
          description:
            'Displays an animated SVG placeholder until the component is loaded.',
          type: 'boolean',
          default: 'true',
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
  let comp = document.createElement('kup-lazy');
  comp.componentName = 'kup-card';
  comp.data = {
    data: {
      button: [{ icon: 'favorite', flat: true }],
      image: [
        {
          resource: 'images/catz_small.jpg',
        },
      ],
      text: [
        'Lazy loaded!',
        'This card was rendered as soon as it was partially included inside the viewport.',
      ],
    },
  };
  comp.id = 'demo-component';
  comp.showPlaceholder = true;
  return comp;
}
</script>
