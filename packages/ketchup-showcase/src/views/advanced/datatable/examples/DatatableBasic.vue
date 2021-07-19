<template>
  <div>
    <h3>Without configuration</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="defaultData"
    ></kup-lazy>

    <h3>Hidden columns</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="hiddenColumnsData"
    ></kup-lazy>

    <h3>Without header</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="noHeaderData"
    ></kup-lazy>

    <h3>Without grid</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="noGridData"
    ></kup-lazy>

    <h3>Cell style</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="cellStyleData"
    ></kup-lazy>

    <h3>Border radius and writing mode</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="cellStyleData2"
    ></kup-lazy>

    <h3>Icons and images</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="iconImagesData"
    ></kup-lazy>

    <h3>With load more button</h3>
    <code>Load more elements: {{ loadQuantity }}</code>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="loadMoreData"
    ></kup-lazy>

    <kup-lazy
      component-name="kup-data-table"
      :data.prop="progressbarData"
    ></kup-lazy>
  </div>
</template>

<script>
import {
  defaultDataTable,
  cellStyleDataTable,
  cellStyleDataTable2,
  hiddenColumnsData,
  iconImagesDataTable,
} from '@/mock/dataTable';
import { pgbData } from '@/mock/box';

export default {
  name: 'dataTableBasic',

  data() {
    return {
      defaultData: {
        data: defaultDataTable,
      },
      hiddenColumnsData: {
        data: hiddenColumnsData,
      },
      cellStyleData: {
        data: cellStyleDataTable,
      },
      cellStyleData2: {
        data: cellStyleDataTable2,
      },
      iconImagesData: {
        data: iconImagesDataTable,
      },
      noHeaderData: {
        data: defaultDataTable,
        showHeader: false,
      },
      noGridData: {
        data: defaultDataTable,
        showGrid: false,
      },
      loadMoreData: {
        data: defaultDataTable,
        showLoadMore: true,
        onKupLoadMoreClick: (e) => {
          this.loadQuantity = e.detail.loadItems.toString();
        },
      },
      loadQuantity: '',
      progressbarData: {
        data: pgbData,
      },
    };
  },
};
</script>
