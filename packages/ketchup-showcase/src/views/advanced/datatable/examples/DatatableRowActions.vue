<template>
  <div>
    <kup-lazy
      ref="dataTable"
      component-name="kup-data-table"
      :data.prop="data"
    ></kup-lazy>

    <ul>
      <li v-if="action"
        >Clicked action: text: {{ action.text }} - icon: {{ action.icon }}</li
      >
      <li v-if="actionIndex >= 0">Action index: {{ actionIndex }}</li>
      <li v-if="actionType">Action type: {{ actionType }}</li>
      <li v-if="row">Row: {{ row }}</li>
    </ul>
  </div>
</template>

<script>
import { defaultDataTable } from '@/mock/dataTable';

export default {
  data() {
    return {
      data: {
        data: defaultDataTable,
        rowActions: [
          {
            text: 'Action #1',
            icon: 'folder',
          },
          {
            text: 'Action #2',
            icon: 'account',
          },
        ],
        ['onkup-datatable-rowactionclick']: (e) => {
          var action, index, type, row;
          action = e.detail.action;
          index = e.detail.index;
          type = e.detail.type;
          row = e.detail.row;
          this.actionType = type;
          this.row = row;

          if ('default' === type || 'variable' === type) {
            this.action = action;
            this.actionIndex = index;
          } else if ('expander' === type) {
            this.action = null;
            this.actionIndex = -1;

            // adding actions to row
            row.actions = [
              {
                text: 'Variable action #1',
                icon: 'plus',
              },
              {
                text: 'Variable action #2',
                icon: 'pencil',
              },
            ];
            e.target.data = { ...e.target.data };
          }
        },
      },
      action: null,
      actionIndex: -1,
      actionType: null,
      row: null,
    };
  },
};
</script>

<style scoped>
ul {
  margin-top: 1rem;
}
</style>
