<template>
  <div class="max-width-container">
    <h2>Dynamic Expansion Features</h2>

    <h4>Console notification</h4>
    <p
      >While browsing through the contents of this page, you may want to keep
      the browser console open.</p
    >
    <p
      >This page contains a lot of logging operations to help understand better
      how the <code class="inline">collapse</code> and
      <code class="inline">expand</code> event of the TreeNodes are triggered
      and with which payload.</p
    >

    <h3>Dynamic expansion</h3>
    <h5
      >Dynamic expansion is active and no callback is set.<br />Update is
      triggered by the parent updating the reference of the data object.</h5
    >
    <p
      >Keep in mind that when your're not using a dynamicCallback, as presented
      down below in this page, the <code class="inline">expand</code> event will
      be triggered nonetheless.</p
    >
    <p
      >In other words this means that you always have to control the event
      payload field <code class="inline" v-text="childrenRequestProp" /> to
      check if the <code class="inline">kup-tree</code> is requiring TreeNode
      children to be fetched or if the current event is simply a notification of
      a node expansion.</p
    >

    <kup-tree
      :columns.prop="fakers.basic.columns"
      :data.prop="fakers.basic.data"
      use-dynamic-expansion
      @kup-tree-nodecollapse="hdlCollapseNode"
      @kup-tree-nodeexpand="hdlExpandNode($event, 'basic')"
    />

    <h4>Same example as the previous one but with showColumns</h4>
    <kup-tree
      :columns.prop="fakers.basicTable.columns"
      :data.prop="fakers.basicTable.data"
      show-columns
      show-header
      use-dynamic-expansion
      @kup-tree-nodecollapse="hdlCollapseNode"
      @kup-tree-nodeexpand="hdlExpandNode($event, 'basicTable')"
    />

    <h3>Dynamic expansion with callback set</h3>
    <h5>
      <p
        >Dynamic expansion is active and a callback is set.<br />Update is
        triggered by the parent updating the reference of the data object.</p
      >
    </h5>
    <kup-tree
      :columns.prop="fakers.useCallback.columns"
      :data.prop="fakers.useCallback.data"
      use-dynamic-expansion
      :dynamicExpansionCallback.prop="callbacks.useCallback"
      @kup-tree-nodecollapse="hdlCollapseNode"
      @kup-tree-nodeexpand="
        hdlExpandNode($event, 'useCallback', {
          method: treeUpdateMethods.treeHasCallback,
        })
      "
    />

    <h4>Same example as the previous one but with showColumns</h4>
    <kup-tree
      :columns.prop="fakers.useCallbackTable.columns"
      :data.prop="fakers.useCallbackTable.data"
      show-columns
      show-header
      use-dynamic-expansion
      :dynamicExpansionCallback.prop="callbacks.useCallbackTable"
      @kup-tree-nodecollapse="hdlCollapseNode"
      @kup-tree-nodeexpand="
        hdlExpandNode($event, 'useCallbackTable', {
          method: treeUpdateMethods.treeHasCallback,
        })
      "
    />
  </div>
</template>

<script>
import { DynamicExpansionFaker } from 'ketchup/src/components/kup-tree/kup-tree-faker';

function kupTreeDynamicCallbackFactory(currentFaker) {
  return (treeNodeToExpand, treeNodePath) =>
    currentFaker.getTreeNodeChildren(treeNodePath);
}

export default {
  name: 'TDynamicExpansion',
  data() {
    const basic = DynamicExpansionFaker(3, 5),
      basicTable = DynamicExpansionFaker(3, 5),
      useCallback = DynamicExpansionFaker(3, 3),
      useCallbackTable = DynamicExpansionFaker(3, 3),
      // TODO horrible name, change it
      useCallbackCallback = kupTreeDynamicCallbackFactory(useCallback),
      useCallbackTableCallback = kupTreeDynamicCallbackFactory(
        useCallbackTable
      );

    return {
      callbacks: {
        useCallback: useCallbackCallback,
        useCallbackTable: useCallbackTableCallback,
      },
      childrenRequestProp: 'dynamicExpansionRequireChildren',
      fakers: {
        basic,
        basicTable,
        useCallback,
        useCallbackTable,
      },
      treeUpdateMethods: {
        changeDataRef: 1,
        // useEventCallback: 2,
        treeHasCallback: 3,
      },
    };
  },
  mounted() {
    console.log('You can explore the fakers data', this.fakers);
  },
  methods: {
    hdlCollapseNode(e) {
      console.log('Collapse event: ', e);
    },
    hdlExpandNode(
      e,
      fakerIndex,
      options = {
        method: this.treeUpdateMethods.changeDataRef,
      }
    ) {
      const { detail } = e;
      console.group();
      console.log('Fired event: ', e);
      console.log('Event detail: ', detail);
      switch (options.method) {
        case this.treeUpdateMethods.changeDataRef:
          if (detail[this.childrenRequestProp]) {
            this.fakers.basic
              .getTreeNodeChildren(detail.treeNodePath)
              .then((children) => {
                // !Important must update both the children and the isExpanded state of the TreeNode
                detail.treeNode.children = children;
                detail.treeNode.isExpanded = true;
                // Changes reference of the data element to allow
                this.fakers[fakerIndex].data = [
                  ...this.fakers[fakerIndex].data,
                ];
                console.log(
                  'Succesful fetching',
                  '\noriginal event detail:',
                  detail,
                  '\nfetched children:',
                  children
                );
                console.groupEnd();
              })
              .catch((err) => {
                console.error('Error during fetch', err);
                console.groupEnd();
              });
          } else {
            console.log(
              'Expand does not have callback but the node already has children.'
            );
            console.groupEnd();
          }
          break;
        default:
          console.log('No need to trigger other operations.');
          console.groupEnd();
          break;
      }
    },
  },
};
</script>
