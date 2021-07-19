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
  name: 'BadgeDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-badge-click',
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
          prop: 'imageData',
          description:
            'The data of the image displayed inside the badge. It will displayed only when "text" is undefined.',
          type: 'Object',
          default: '{}',
          try: 'json',
        },
        {
          prop: 'text',
          description: 'The text displayed inside the badge.',
          type: 'string',
          default: '""',
          try: 'field',
        },
      ],
      demoClasses: [
        {
          class: 'kup-bottom-left',
          description:
            'The badge will be position to the bottom left corner of its container.',
        },
        {
          class: 'kup-bottom-right',
          description:
            'The badge will be position to the bottom right corner of its container.',
        },
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
          class: 'kup-top-right',
          description:
            'The badge will be position to the top right corner of its container.',
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
  let comp = document.createElement('div');
  let compSurface = document.createElement('span');
  let compEl = document.createElement('kup-badge');
  comp.classList.add('badge-anchor');
  compSurface.innerText = 'YOUR CONTAINER';
  compEl.id = 'demo-component';
  compEl.position = 'TR';
  compEl.text = 'Demo';
  comp.appendChild(compSurface);
  comp.appendChild(compEl);
  return comp;
}
</script>
