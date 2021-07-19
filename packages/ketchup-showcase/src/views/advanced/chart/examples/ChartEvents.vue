<template>
  <div class="wrapper">
    <!-- bar -->
    <kup-chart
      :data.prop="baseData"
      :axis.prop="'Col1'"
      :series.prop="series"
      @kup-chart-click="onBarChartClick"
    />

    <div>
      <ul v-if="barChartDetail">
        <li>Column: {{ barChartDetail.column }}</li>
        <li>Row: {{ barChartDetail.row }}</li>
      </ul>
    </div>

    <!-- pie -->
    <kup-chart
      :data.prop="baseData"
      :types.prop="['Pie']"
      axis="Col1"
      :series.prop="[{ code: 'Col3', decode: 'Col3' }]"
      @kup-chart-click="onPieChartClick"
    />

    <div>
      <ul v-if="pieChartDetail">
        <li>Column: {{ pieChartDetail.column }}</li>
        <li>Row: {{ pieChartDetail.row }}</li>
      </ul>
    </div>

    <!-- calendar -->
    <kup-chart
      :data.prop="calendarData"
      :types.prop="['Cal']"
      axis="Col1"
      :series.prop="[{ code: 'Col2', decode: 'Col2' }]"
      @kup-chart-click="onCalChartClick"
    />

    <div>
      <ul v-if="calChartDetail">
        <li>Column: {{ calChartDetail.datetime }}</li>
        <li>Row: {{ calChartDetail.row }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { baseData, calendarData } from '@/mock/chart';

export default {
  data() {
    return {
      baseData,
      calendarData,
      series: [
        { code: 'Col2', decode: 'Col2' },
        { code: 'Col3', decode: 'Col3' },
        { code: 'Col4', decode: 'Col4' },
      ],
      barChartDetail: null,
      pieChartDetail: null,
      calChartDetail: null,
    };
  },

  methods: {
    onBarChartClick({ detail }) {
      this.barChartDetail = {
        column: detail.column,
        row: detail.row,
      };
    },

    onPieChartClick({ detail }) {
      this.pieChartDetail = {
        column: detail.column,
        row: detail.row,
      };
    },

    onCalChartClick({ detail }) {
      this.calChartDetail = {
        datetime: new Date(detail.datetime),
        row: detail.row,
      };
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
