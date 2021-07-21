<template>
  <div>
    <p
      >Hypermenu is a component that disposes other components in sections. It
      can be used for menus.</p
    ><h4>Vertical accordion with trees hypermenu</h4>
    <kup-hypermenu :data.prop="accordionWithTrees"></kup-hypermenu>
    <hr />

    <h4>Kitchen sink hypermenu</h4>
    <kup-hypermenu :data.prop="variousShapes"></kup-hypermenu>
    <hr />
  </div>
</template>

<script>
import { accordionWithTrees, variousShapes } from '@/mock/hypermenu';

export default {
  data() {
    return {
      accordionWithTrees: accordionWithTrees,
      variousShapes: variousShapes,
    };
  },
};
</script>
