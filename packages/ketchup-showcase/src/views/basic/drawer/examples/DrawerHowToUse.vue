<template>
  <div>
    <div class="demo-wrapper">
      <p>
        To get the Ketch.UP drawer visible it is possible to call the public
        method
        <span class="code-word">open</span>. This method simply set the drawer's
        prop <span class="code-word">opened</span> to true. In order to manage
        the drawer's visibility it is possible to call the public method
        <span class="code-word">toggle</span> which is able to open or close the
        drawer automatically.
      </p>
      <br />
      <p class="centered">
        In this example, when the button is pressed, the open method will be
        called.
      </p>
      <code class="flat"
        >{{ markupBasic1 }}<br />{{ markupBasic2 }}<br />{{ markupBasic3
        }}<br />{{ markupBasic4 }}<br
      /></code>
      <br />
      <br />
      <kup-button
        align="center"
        v-on:kup-button-click="openDrawer"
        label="Toggle drawer"
        id="side-drawer-btn"
        icon-off
      ></kup-button>
      <kup-drawer id="first-drawer">
        <span slot="title">Title</span>
        <span slot="subtitle">Subtitle</span>
        <div slot="main-content">
          <kup-list
            show-icons
            :data.prop="listdata"
            display-mode="description"
            filter
            role-type="listbox"
            selectable
          ></kup-list>
        </div>
      </kup-drawer>
    </div>
  </div>
</template>

<script>
document.addEventListener('kupDrawerOpen', () => {
  console.log('Drawer opened!');
});
document.addEventListener('kupDrawerClose', () => {
  console.log('Drawer closed!');
});
export default {
  name: 'ComboboxBasic',
  data() {
    return {
      markupBasic1:
        'const example_btn = document.querySelector("kup-button"); ',
      markupBasic2:
        'const example_drawer = document.querySelector("kup-drawer");',
      markupBasic3: 'function openDrawerExample(() => example_drawer.open());',
      markupBasic4:
        'example_btn.addEventListener("kup-button-click", openDrawerExample);',
      listdata: [
        {
          text: 'First choice',
          value: '1',
          icon: 'add_alert',
          trailingIcon: true,
          selected: false,
        },
        {
          text: 'Selected choice',
          value: '2',
          selected: false,
          icon: 'ac_unit',
        },

        {
          text: 'Third choice',
          value: '3',
          icon: '3d_rotation',
          selected: true,
        },
      ],
    };
  },
  methods: {
    openDrawer: function() {
      const sideDrawer = document.getElementById('first-drawer');
      sideDrawer.toggle();
    },
  },
};
</script>
