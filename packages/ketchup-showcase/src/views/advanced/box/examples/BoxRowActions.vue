<template>
  <div>
    <h3>Box with row actions enabled</h3>
    <kup-box
      ref="box"
      :data.prop="basicData"
      :enableRowActions.prop="true"
      @kup-box-rowactionmenuclick="onRowActionMenu"
      @kup-box-rowactionclick="onRowAction"
    ></kup-box>

    <ul>
      <li v-if="action">{{ action }}</li>
      <li v-if="row">{{ row }}</li>
    </ul>
  </div>
</template>

<script>
import { defaultData } from '@/mock/box';

export default {
  data() {
    return {
      basicData: defaultData,
      row: null,
      action: null,
    };
  },

  methods: {
    onRowActionMenu({ detail }) {
      this.$refs.box.loadRowActions(detail.row, [
        {
          text: 'Variable action #1',
          icon: 'mdi mdi-plus',
        },
        {
          text: 'Variable action #2',
          icon: 'mdi mdi-pencil',
        },
      ]);
    },

    onRowAction({ detail }) {
      this.row = detail.row;
      this.action = detail.action;
    },
  },
};
</script>

<style scoped>
ul {
  margin-top: 1rem;
}
</style>
