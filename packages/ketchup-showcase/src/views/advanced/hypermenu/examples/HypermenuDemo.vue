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
import { accordionWithTrees } from '@/mock/hypermenu';

export default {
  components: {
    Demo,
  },
  name: 'HypermenuDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [],
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
          description: 'The actual data of the component.',
          type: '{ columns?: Column[]; rows?: BoxRow[]; }',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'globalFilter',
          description: 'When set to true it activates the global filter.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'globalFilterValue',
          description: 'The value of the global filter.',
          type: 'string',
          default: '',
          try: 'field',
        },
      ],
      demoClasses: [],
    };
  },
};

function createComp() {
  let comp = document.createElement('kup-hypermenu');
  comp.data = accordionWithTrees;
  comp.id = 'demo-component';
  return comp;
}
</script>
