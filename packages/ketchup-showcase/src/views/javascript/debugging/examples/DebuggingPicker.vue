<template>
  <div>
    <div id="debug-section"
      ><h1>Debug</h1>
      <p
        >In this section you can render any component by selecting the one you
        need and pasting in the textarea a valid JSON.</p
      >
      <kup-combobox
        :data.prop="comboboxData"
        is-select
        id="debug-changer"
        @kup-combobox-itemclick="createDebugComponent"/>
      <kup-text-field
        id="debug-props"
        label="Paste your JSON"
        full-width
        text-area
        @kup-textfield-change="createDebugComponent"/>
      <div
        id="debug-wrapper"
        title="Your component will be displayed here."
      ></div
    ></div>
  </div>
</template>

<style>
#debug-changer {
  margin-bottom: 1em;
  width: max-content;
}

#debug-props {
  padding-bottom: 2em;
}

#debug-section {
  border-bottom: 2px solid var(--kup-border-color);
  padding-bottom: 1em;
}

#debug-wrapper {
  border: 1px solid var(--kup-border-color);
  padding: 0.5em;
}
</style>

<script>
export default {
  name: 'DebuggingPicker',
  data() {
    return {
      comboboxData: {
        'kup-list': {
          data: [
            {
              text: 'kup-autocomplete',
              value: 'kup-autocomplete',
            },
            {
              text: 'kup-badge',
              value: 'kup-badge',
            },
            {
              text: 'kup-box',
              value: 'kup-box',
            },
            {
              text: 'kup-button-list',
              value: 'kup-button-list',
            },
            {
              text: 'kup-button',
              value: 'kup-button',
            },
            {
              text: 'kup-box',
              value: 'kup-box',
            },
            {
              text: 'kup-card',
              value: 'kup-card',
            },
            {
              text: 'kup-chart',
              value: 'kup-chart',
            },
            {
              text: 'kup-checkbox',
              value: 'kup-checkbox',
            },
            {
              text: 'kup-chip',
              value: 'kup-chip',
            },
            {
              text: 'kup-color-picker',
              value: 'kup-color-picker',
            },
            {
              text: 'kup-combobox',
              value: 'kup-combobox',
            },
            {
              text: 'kup-dash',
              value: 'kup-dash',
            },
            {
              text: 'kup-dash-list',
              value: 'kup-dash-list',
            },
            {
              text: 'kup-data-table',
              value: 'kup-data-table',
            },
            {
              text: 'kup-date-picker',
              value: 'kup-date-picker',
            },
            {
              text: 'kup-drawer',
              value: 'kup-drawer',
            },
            {
              text: 'kup-dropdown-button',
              value: 'kup-dropdown-button',
            },
            {
              text: 'kup-echart',
              value: 'kup-echart',
            },
            {
              text: 'kup-editor',
              value: 'kup-editor',
            },
            {
              text: 'kup-field',
              value: 'kup-field',
            },
            {
              text: 'kup-gauge',
              value: 'kup-gauge',
            },
            {
              text: 'kup-grid',
              value: 'kup-grid',
            },
            {
              text: 'kup-iframe',
              value: 'kup-iframe',
            },
            {
              text: 'kup-image',
              value: 'kup-image',
            },
            {
              text: 'kup-lazy',
              value: 'kup-lazy',
            },
            {
              text: 'kup-list',
              value: 'kup-list',
            },
            {
              text: 'kup-magic-box',
              value: 'kup-magic-box',
            },
            {
              text: 'kup-nav-bar',
              value: 'kup-nav-bar',
            },
            {
              text: 'kup-paginator',
              value: 'kup-paginator',
            },
            {
              text: 'kup-progress-bar',
              value: 'kup-progress-bar',
            },
            {
              text: 'kup-radio',
              value: 'kup-radio',
            },
            {
              text: 'kup-rating',
              value: 'kup-rating',
            },
            {
              text: 'kup-spinner',
              value: 'kup-spinner',
            },
            {
              text: 'kup-switch',
              value: 'kup-switch',
            },
            {
              text: 'kup-tab-bar',
              value: 'kup-tab-bar',
            },
            {
              text: 'kup-text-field',
              value: 'kup-text-field',
            },
            {
              text: 'kup-time-picker',
              value: 'kup-time-picker',
            },
            {
              text: 'kup-tree',
              value: 'kup-tree',
            },
          ],
        },
        'kup-text-field': {
          label: 'Select your component',
        },
      },
    };
  },
  methods: {
    createDebugComponent: (e) => {
      const promises = [
        document.querySelector('#debug-changer').getValue(),
        document.querySelector('#debug-props').getValue(),
      ];
      Promise.all(promises).then((responses) => {
        const compName = responses[0];
        let props = responses[1];
        const wrapper = document.querySelector('#debug-wrapper');
        const oldComp = document.querySelector('#debug-comp');
        if (oldComp) {
          oldComp.remove();
        }
        if (props && compName) {
          try {
            props = JSON.parse(props);
          } catch (error) {
            console.warn('Invalid JSON! ' + error);
            return;
          }
          const comp = document.createElement(compName);
          comp.id = 'debug-comp';
          for (const key in props) {
            comp[key] = props[key];
          }
          wrapper.append(comp);
        } else {
          const span = document.createElement('span');
          span.id = 'debug-comp';
          span.innerText = !props
            ? 'Did you forget to paste your props?'
            : 'Select a component.';
          wrapper.append(span);
        }
      });
    },
  },
};
</script>
