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
  name: 'IframeDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-iframe-error',
          type: 'error',
        },
        {
          name: 'kup-iframe-load',
          type: 'load',
        },
      ],
      demoProps: [
        {
          prop: 'buttonData',
          description: 'Props of the button (when isButton is set to true).',
          type: 'Object',
          default: '{}',
          try: 'json',
        },
        {
          prop: 'isButton',
          description:
            'The component will be rendered as a button, which opens the link associated to the iframe in another tab/window when clicked.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'src',
          description: 'The address the iframe should be referencing to.',
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
  let comp = document.createElement('kup-iframe');
  comp.buttonData = {
    flat: true,
  };
  comp.id = 'demo-component';
  comp.src = 'https://ketchup.smeup.com';
  return comp;
}
</script>
