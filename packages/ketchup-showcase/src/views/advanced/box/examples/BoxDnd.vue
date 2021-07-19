<template>
  <div>
    <h3>Box to box</h3>
    <p>Drag a box over another from left to right</p>
    <div class="row">
      <div class="column">
        <div class="multi">
          <label>enable multiselect:</label>
          <kup-checkbox
            :checked.prop="multi1"
            @kup-checkbox-change="changeMulti1"
          />
        </div>
        <kup-box
          id="box1"
          :data.prop="basicData"
          :sortEnabled.prop="true"
          :multiSelection.prop="multi1"
          pagination
          pageSize="10"
          :layout.prop="horizontalLayout"
          drag-enabled="true"
        ></kup-box>
      </div>
      <div class="column">
        <div class="multi">
          <label>enable multiselect:</label>
          <kup-checkbox
            :checked.prop="multi2"
            @kup-checkbox-change="changeMulti2"
          />
          <label>empty data:</label>
          <kup-checkbox
            :checked.prop="empty2"
            @kup-checkbox-change="changeEmpty2"
          />
          <label>enable drop on section:</label>
          <kup-checkbox
            :checked.prop="dropOnSection2"
            @kup-checkbox-change="changeDropOnSection2"
          />
        </div>
        <kup-box
          id="box2"
          :data.prop="data2"
          :sortEnabled.prop="true"
          :multiSelection.prop="multi2"
          pagination
          pageSize="10"
          :layout.prop="horizontalLayout"
          :dropEnabled.prop="true"
          :dropOnSection.prop="dropOnSection2"
          @kup-drop="onBoxDrop"
        ></kup-box>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <p>
          <b>History</b>
        </p>
        <ul id="history" />
      </div>
    </div>
  </div>
</template>

<script>
import { defaultData } from '@/mock/box';

export default {
  data() {
    return {
      basicData: defaultData,
      data2: defaultData,
      horizontalLayout: {
        sections: [
          {
            horizontal: true,
            sections: [{}, {}, {}, {}],
          },
        ],
      },
      multi1: false,
      multi2: false,
      empty2: false,
      dropOnSection2: false,
      eventType: null,
      fromId: null,
      fromRow: null,
      fromSelectedRows: null,
      toId: null,
      toRow: null,
      toSelectedRows: null,
    };
  },
  methods: {
    changeMulti1(e) {
      this.multi1 = e.detail.checked;
    },
    changeMulti2(e) {
      this.multi2 = e.detail.checked;
    },
    changeEmpty2(e) {
      this.empty2 = e.detail.checked;
      if (this.empty2) {
        this.data2 = {};
      } else {
        this.data2 = defaultData;
      }
    },
    changeDropOnSection2(e) {
      this.dropOnSection2 = e.detail.checked;
    },
    onBoxDrop(event) {
      console.log(event);
      this.appendEventToHistory('Dropped event', event);
      this.fromId = event.detail.fromId;
      this.fromRow = event.detail.fromRow;
      this.fromSelectedRows = event.detail.fromSelectedRows;
      this.toId = event.detail.toId;
      this.toRow = event.detail.toRow;
      this.toSelectedRows = event.detail.toSelectedRows;
    },
    appendEventToHistory(eventType, event) {
      var node = document.createElement('LI');
      var textnode = document.createTextNode(
        eventType + ': ' + JSON.stringify(event.detail)
      );
      node.appendChild(textnode);
      document.getElementById('history').appendChild(node);
    },
  },
};
</script>

<style>
.column {
  float: left;
  width: 50%;
  padding: 10px;
}

.row:after {
  content: '';
  display: table;
  clear: both;
}

.multi {
  display: flex;
  align-items: center;
}

kup-checkbox {
  margin-right: 15px;
}
</style>
