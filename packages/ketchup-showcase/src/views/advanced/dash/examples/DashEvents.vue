<template>
  <div>
    <div class="demo-wrapper">
      <p> The drawer component has only 1 event: </p>
      <ul>
        <li
          ><span class="code-word">{{ event }}</span
          >: it is launched every time the drawer is clicked.</li
        >
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashEvents',
  data() {
    return {
      event: 'kup-dash-clicked',
      type: 'CustomEvent<{ id: number; }>',
    };
  },
};
</script>
