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
import { baseData } from '@/mock/echarts';

export default {
  components: {
    Demo,
  },
  name: 'EchartDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kupEchartClick',
          type: 'click',
        },
      ],
      demoProps: [
        {
          prop: 'axis',
          description: 'Sets the axis of the chart.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'chartTitle',
          description: 'Title of the graph.',
          type: 'EchartTitle',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'data',
          description: 'The actual data of the chart.',
          type: 'object',
          default: '{}',
          try: 'json',
        },
        {
          prop: 'legend',
          description:
            'Sets the position of the legend. Supported values: bottom, left, right, top. Keep in mind that legend types are tied to chart types',
          type: 'string',
          default: 'right',
          try: 'field',
        },
        {
          prop: 'mapType',
          description:
            'It allows you to choose the type of map, between europe, america, asia, oceania, africa, world or pass a custom json to create a map.',
          type: 'any',
          default: 'world',
          try: 'field',
        },
        {
          prop: 'series',
          description:
            'The data series to be displayed. They must be of the same type.',
          type: 'string[]',
          default: 'undefined',
          try: 'array',
        },
        {
          prop: 'types',
          description:
            'The type of the chart. Supported formats: Bar, Line, Pie, Scatter, it is possible for line bar and scatter types to pass multiple values ​​to create series of different types',
          type: 'string[]',
          default: ['Line'],
          try: 'array',
        },
      ],
    };
  },
};

function createComp() {
  let comp = document.createElement('kup-echart');
  comp.axis = 'Col1';
  comp.chartTitle = {
    value: 'This is a title.',
    color: 'red',
    position: 'top',
    size: 16,
  };
  comp.data = baseData;
  comp.id = 'demo-component';
  comp.legend = 'bottom';
  comp.mapType = 'world';
  comp.types = ['Line'];
  return comp;
}
</script>
