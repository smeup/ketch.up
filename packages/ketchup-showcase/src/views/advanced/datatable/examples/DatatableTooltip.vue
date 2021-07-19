<style scoped>
h3 {
  margin: 1rem 0;
}
</style>

<template>
  <div>
    <h3>With Fixed Tooltip</h3>
    <kup-lazy component-name="kup-data-table" :data.prop="data"></kup-lazy>
  </div>
</template>

<script>
import { defaultDataTable } from '@/mock/dataTable';

import { bornToDie, cellOptionsTree, imageUrls } from '@/mock/tooltip';

export default {
  name: 'dataTableBasic',

  data() {
    return {
      data: {
        data: defaultDataTable,

        ['onkup-datatable-optionclick']: (e) => {
          this.handleKupOptionClicked(e.detail);
        },
        ['onkup-tooltip-loaddata']: (e) => {
          this.onLoadData(e, 1);
        },
        ['onkup-tooltip-loaddetail']: (e) => {
          this.loadBornToDie(e);
        },
        ['onkup-tooltip-loadcelloptions']: (e) => {
          this.loadCellOptions(e);
        },
        ['onkup-tree-treenodebuttonclick']: (e) => {
          this.treeNodeButtonClicked(e);
        },
        ['onkup-tree-treenodeselected']: (e) => {
          this.treeNodeSelected(e);
        },
        ['onkup-tree-treenodeexpand']: (e) => {
          this.treeNodeExpand(e);
        },
        ['onkup-tree-treenodecollapse']: (e) => {
          this.treeNodeCollapse(e);
        },
      },
      images: {
        ...imageUrls,
      },
      loadQuantity: '',
    };
  },

  methods: {
    handleKupOptionClicked({ detail }) {
      console.log('KupOptionClicked detail', detail);
    },

    treeNodeButtonClicked({ detail }) {
      console.log('treeNodeButtonClicked detail', detail);
    },

    treeNodeSelected({ detail }) {
      console.log('treeNodeSelected detail', detail);
    },

    treeNodeExpand({ detail }) {
      console.log('treeNodeExpand detail', detail);
    },

    treeNodeCollapse({ detail }) {
      console.log('treeNodeCollapse detail', detail);
    },

    loadBornToDie(event) {
      setTimeout(() => (event.detail.comp.detailData = bornToDie), 400);
    },
    loadCellOptions(event) {
      setTimeout(() => (event.detail.comp.cellOptions = cellOptionsTree), 400);
    },

    onLoadData(event, index) {
      let data;
      switch (index) {
        case 1:
          data = {
            image: this.images.bornToDie,
            title: 'Born to die',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2012,
              },
            },
          };
          break;

        case 2:
          data = {
            image: this.images.ultra,
            title: 'Ultraviolence',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2014,
              },
            },
          };
          break;

        case 3:
          data = {
            image: this.images.honey,
            title: 'Honeymoon',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2015,
              },
            },
          };
          break;

        case 4:
          data = {
            image: this.images.lust,
            title: 'Lust for life',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2017,
              },
            },
          };
          break;
      }
      console.log(event);
      event.detail.comp.data = data;
    },
  },
};
</script>

<style lang="scss">
.persistent-header-wrapper {
  kup-data-table {
    --kup-data-table_header-offset: 0;
  }
}
</style>
