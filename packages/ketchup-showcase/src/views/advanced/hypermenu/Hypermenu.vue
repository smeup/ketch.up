<template>
  <comp :giturl="giturl" :headtitle="headtitle" :titles="titles">
    <template v-slot:0>
      <hypermenu-demo></hypermenu-demo>
    </template>
    <template v-slot:1>
      <hypermenu-basic></hypermenu-basic>
    </template>
  </comp>
</template>

<script>
import HypermenuDemo from '@/views/advanced/hypermenu/examples/HypermenuDemo';
import HypermenuBasic from '@/views/advanced/hypermenu/examples/HypermenuBasic';
import Comp from '@/views/advanced/page/templates/Comp';

export default {
  components: {
    HypermenuDemo,
    HypermenuBasic,
    Comp,
  },
  data() {
    return {
      giturl:
        'https://github.com/smeup/ketchup/tree/develop/packages/ketchup/src/components/kup-hypermenu',
      headtitle: 'Hypermenu',
      titles: ['Playground', 'Basic usage'],
    };
  },
};
</script>
