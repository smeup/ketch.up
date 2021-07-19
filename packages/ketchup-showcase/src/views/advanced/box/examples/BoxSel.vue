<template>
  <div>
    <h3>Dynamism</h3>
    <kup-box :data.prop="basicData" @kup-box-click="onBoxClick"></kup-box>

    <p v-if="clickedRow">Selected row: {{ clickedRow }}</p>
    <p v-if="clickedColumn">Selected column: {{ clickedColumn }}</p>

    <hr />

    <h3>Multi select</h3>
    <kup-box
      :data.prop="basicData"
      :multiSelection.prop="true"
      @kup-box-selected="onBoxSelected"
    ></kup-box>
    <div v-if="selectedRows && selectedRows.length > 0">
      <p>Selected rows</p>
      <ul>
        <li v-for="(row, index) in selectedRows" :key="index">{{ row }}</li>
      </ul>
    </div>

    <hr />

    <h3>SelectBox</h3>
    <p>The prop SelectBox allows to automatically select a Box</p>
    <p v-if="autoSelectedRow"
      >Automatically selected row: {{ autoSelectedRow }}</p
    >
    <kup-box
      :data.prop="basicData"
      :selectBox.prop="2"
      @kup-box-autoselect="onBoxAutoSelection"
    ></kup-box>

    <hr />

    <h3>ShowSelection</h3>
    <p
      >If the showSelection prop is false, the selected box/boxes will not be
      highlighted</p
    >
    <kup-box
      :data.prop="basicData"
      :multiSelection.prop="true"
      :showSelection.prop="false"
    ></kup-box>
  </div>
</template>

<script>
import { defaultData } from '@/mock/box';

export default {
  data() {
    return {
      basicData: defaultData,
      clickedRow: null,
      clickedColumn: null,
      selectedRows: null,
      autoSelectedRow: null,
    };
  },

  methods: {
    onBoxClick({ detail }) {
      this.clickedRow = detail.row;
      this.clickedColumn = detail.column;
    },

    onBoxSelected({ detail }) {
      this.selectedRows = detail.rows;
    },

    onBoxAutoSelection({ detail }) {
      this.autoSelectedRow = detail.row;
    },
  },
};
</script>
