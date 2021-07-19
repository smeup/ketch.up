<template>
  <div>
    <h3>Small obj dataset - box form</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="buttonData"
    ></kup-lazy>
    <code id="button-small" />

    <h3>Larger dataset - With and without buttons</h3>
    <kup-lazy
      component-name="kup-data-table"
      :data.prop="buttonData2"
    ></kup-lazy>
    <code id="button-large" />
  </div>
</template>

<script>
import { j4btnData } from '@/mock/box';
import j4btnLargeData from '@/mock/j4btn_table_box_data.json';

export default {
  name: 'DTJ4btn',
  data() {
    return {
      buttonData: {
        data: j4btnData,
        dataCode: 'small',
        ['onkup-button-click']: (e) => {
          console.warn(
            'This message is displayed because the matrix component may not have blocked the button cell event.\n Check the event',
            e
          );
        },
        onKupCellButtonClicked: (e) => {
          const cell = JSON.stringify(e.detail.cell),
            row = JSON.stringify(e.detail.row),
            column = JSON.stringify(e.detail.column);
          let codeEl = document.querySelector('#button-small');
          codeEl.innerHTML = `Cell:<br>${cell}<br>Column:<br>${column}<br>Row:<br>${row}<br>`;
        },
      },
      buttonData2: {
        data: j4btnLargeData,
        dataCode: 'large',
        ['onkup-button-click']: (e) => {
          console.warn(
            'This message is displayed because the matrix component may not have blocked the button cell event.\n Check the event',
            e
          );
        },
        onKupCellButtonClicked: (e) => {
          const cell = JSON.stringify(e.detail.cell),
            row = JSON.stringify(e.detail.row),
            column = JSON.stringify(e.detail.column);
          let codeEl = document.querySelector('#button-large');
          codeEl.innerHTML = `Cell:<br>${cell}<br>Column:<br>${column}<br>Row:<br>${row}<br>`;
        },
      },
    };
  },
};
</script>

<style scoped></style>
