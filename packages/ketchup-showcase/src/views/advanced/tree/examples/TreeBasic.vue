<template>
  <div class="max-width-container">
    <h3>Without configuration</h3>
    <kup-tree :columns.prop="basicData.columns" :data.prop="basicData.data" />

    <h3>Tree Nodes icons are hidden</h3>
    <kup-tree
      :columns.prop="basicData.columns"
      :data.prop="basicData.data"
      :showIcons.prop="false"
    />

    <h3>With selection on first item</h3>
    <h4>{{ labels.noSelectionOnDisabled }}</h4>
    <kup-tree
      :columns.prop="firstSelection.columns"
      :data.prop="firstSelection.data"
      :selectedNode.prop="selectedNodes.first"
      @kup-tree-nodeselected="hdlChangeSelected($event, 'first')"
    />

    <h3>With initial selection on 3 item and handler for selection</h3>
    <h5>{{ labels.noSelectionOnDisabled }}</h5>
    <kup-tree
      :columns.prop="complexSelection.columns"
      :data.prop="complexSelection.data"
      :selectedNode.prop="selectedNodes.complex"
      @kup-tree-nodeselected="hdlChangeSelected($event, 'complex')"
    />
    <div class="example-container">
      <div
        >The selected node is the one with the following index (0 based):</div
      >
      <code>[{{ selectedNodes.complex.toString() }}]</code>
    </div>

    <h3>Automatically expanded tree</h3>
    <kup-tree
      :columns.prop="expandedData.columns"
      :data.prop="expandedData.data"
      expanded
    />
  </div>
</template>

<script>
import { TreeFactory } from 'ketchup/src/components/kup-tree/kup-tree-faker';

export default {
  name: 'TBasic',
  data() {
    return {
      basicData: TreeFactory(),
      expandedData: TreeFactory(3, 3),
      firstSelection: TreeFactory(3, 3),
      complexSelection: TreeFactory(3, 3),
      optionObj: {
        cell: '',
        column: '',
        treeNode: '',
      },
      selectedNodes: {
        first: [0],
        complex: [3],
      },
      labels: {
        noSelectionOnDisabled:
          'Remember that when a node is disabled it cannot be selected.',
      },
    };
  },
  methods: {
    hdlChangeSelected({ detail }, selection) {
      if (this.selectedNodes[selection]) {
        this.selectedNodes[selection] = detail.treeNodePath;
      }
    },
  },
};
</script>
