<template>
  <div class="wrapper">
    <div style="width: 580px; height: 400px">
      <kup-echart
        :axis.prop="axis"
        :data.prop="baseData"
        :types.prop="types"
        @kupEchartClick="onBarChartClick"
      />
    </div>
    <div id="event">click on the graph to trigger the event</div>
    <div style="width: 580px; height: 400px">
      <kup-echart
        :axis.prop="axis"
        :data.prop="baseData"
        :types.prop="types1"
        @kupEchartClick="onPieChartClick()"
      />
    </div>
    <div id="event1">click on the graph to trigger the event</div>
  </div>
</template>

<script>
import { baseData } from '@/mock/echarts';

export default {
  data() {
    return {
      axis: 'Col1',
      baseData,
      types: ['Line'],
      types1: ['Pie'],
      cnt: 0,
      cnt1: 0,
    };
  },

  methods: {
    onBarChartClick() {
      this.cnt++;
      document.getElementById('event').innerHTML =
        'kupEchartClick event received' + '<br>' + 'N:' + this.cnt;
    },

    onPieChartClick() {
      this.cnt1++;
      document.getElementById('event1').innerHTML =
        'kupEchartClick event received' + '<br>' + 'N:' + this.cnt1;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
</style>
