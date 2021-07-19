<template>
  <div>
    <demo
      :demoComp="demoComp"
      :demoEvents="demoEvents"
      :demoProps="demoProps"
    ></demo>
  </div>
</template>

<script>
import Demo from '@/views/advanced/page/templates/Demo';
import {
  defaultData,
  defaultValueColor,
  defaultTextColor,
  defaultIconColor,
} from '@/mock/dashList';

export default {
  components: {
    Demo,
  },
  name: 'DashListDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-dash-click',
          type: 'CustomEvent<{ idx: number; }>',
        },
      ],

      demoProps: [
        {
          prop: 'active',
          description: '',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'columnsNumber',
          description: 'Select number of columns',
          type: 'number',
          default: '1',
          try: 'field',
        },
        {
          prop: 'data',
          description: '',
          type: 'TableData',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'fontsize',
          description: 'Allows you to choose the size of the text',
          type: 'string',
          default: "''",
          try: 'field',
        },
        {
          prop: 'fullWidth',
          description: '',
          type: 'boolean',
          default: 'true',
          try: 'switch',
        },
        {
          prop: 'horizontal',
          description: 'Arranges the objects horizontally',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'iconColor',
          description: 'Allows you to choose the color of the icon',
          type: 'any[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'layout',
          description: 'Allows you to choose different layouts',
          type: 'string',
          default: "'1'",
          try: 'field',
        },
        {
          prop: 'textColor',
          description: 'Allows you to choose the color of the text',
          type: 'any[]',
          default: '[]',
          try: 'json',
        },
        {
          prop: 'valueColor',
          description: 'Allows you to choose the color of the value',
          type: 'any[]',
          default: '[]',
          try: 'json',
        },
      ],
    };
  },
};
function createComp() {
  let comp = document.createElement('kup-dash-list');
  comp.columnsNumber = '3';
  comp.data = defaultData;
  comp.valueColor = defaultValueColor;
  comp.textColor = defaultTextColor;
  comp.iconColor = defaultIconColor;
  comp.id = 'demo-component';
  return comp;
}
</script>
