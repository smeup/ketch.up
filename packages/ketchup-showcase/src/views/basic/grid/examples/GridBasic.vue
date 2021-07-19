<template>
  <div>
    <div class="demo-wrapper">
      <p>
        The grid component receives a list of slots and places them inside a
        grid.<br />
        Slots should have a <span class="code-word">slot</span> attribute with
        the index of the slot (base 0) and an optional
        <span class="code-word">span</span> attribute which sets the number of
        columns the slot occupies (when not specified, the component will span 1
        column).
      </p>
      <br />
      <p class="centered">Sample slot</p>
      <code class="flat">{{ markupSlot }}</code>
      <br />
      <br />
      <p>
        The default behavior of the grid displays rows which are made of 12
        columns on pc, 8 columns on tablet and 4 on phone. The number of the
        rows can be changed through the
        <span class="code-word">columns</span> but responsiveness will be
        preserved.
      </p>
      <br />
      <p class="centered">Sample markup</p>
      <code class="flat">{{ markupBasic }}</code>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridBasic',
  data() {
    return {
      markupBasic: '<kup-grid></kup-grid>',
      markupSlot: '<kup-component slot="0" span="2"></kup-component>',
    };
  },
};
</script>
