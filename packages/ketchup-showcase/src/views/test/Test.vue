<template>
  <div>
    <div id="test-section">
      <h1>Test</h1>
      <p>Here a simple performance test made with kup-probe.</p>
      <div id="button-section">
        <kup-button id="print" label="Print lifecycle time"></kup-button>
        <kup-button
          id="autorun"
          styling="flat"
          label="autorun (50ms interval)"
        ></kup-button></div
      ><div id="average-section">
        <h1>Full lifecycle average time (milliseconds):</h1>
        <kup-combobox is-select id="feature-changer"></kup-combobox>
        <div class="counter-wrapper">
          <span class="label">Empty:</span>
          <span id="average-empty">0</span></div
        ><br />
        <div class="counter-wrapper">
          <span class="label">KupDebug:</span>
          <span id="average-debug">0</span></div
        >
        <div class="counter-wrapper">
          <span class="label">KupLanguage:</span>
          <span id="average-language">0</span></div
        >
        <div class="counter-wrapper">
          <span class="label">KupTheme:</span>
          <span id="average-theme">0</span></div
        ><br />
        <div class="counter-wrapper">
          <span class="label">Long cycle (props):</span>
          <span id="average-cycleprops">0</span></div
        >
        <div class="counter-wrapper">
          <span class="label">Long cycle (vars):</span>
          <span id="average-cyclevars">0</span></div
        ><br />
        <div class="counter-wrapper">
          <span class="label">Long cycle (KupObjects):</span>
          <span id="average-cycleobjects">0</span></div
        >
        <div class="counter-wrapper">
          <span class="label">Long cycle (object function):</span>
          <span id="average-cycleobjectsfunction">0</span></div
        ><br />
        <div class="counter-wrapper">
          <span class="label">Full:</span>
          <span id="average-full">0</span></div
        ><br />
        <div class="counter-wrapper">
          <span class="label">Total:</span>
          <span id="average-total">0</span></div
        >
      </div>
      <div id="misc-section">
        <h1>Additional info:</h1>
        <div class="counter-wrapper">
          <span class="label">Number of renders:</span>
          <span id="number">0</span>
        </div></div
      ></div
    >
  </div>
</template>

<style>
#button-section {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

#autorun {
  margin: 0 auto 0 5px;
}

#print {
  margin: 0 5px 0 auto;
}

kup-probe {
  text-align: center;
  width: 100%;
  height: auto;
  padding: 10px 0;
}

.counter-wrapper {
  display: flex;
  flex-direction: row;
}

.label {
  width: 20em;
  font-size: 1.2em;
  opacity: 0.75;
}

#test-section {
  padding-top: 1em;
}

#feature-changer {
  margin-bottom: 1em;
  width: max-content;
}
</style>

<script>
export default {
  name: 'Test',
  mounted() {
    // Elements selectors
    const printButton = document.querySelector('#print');
    const autorunButton = document.querySelector('#autorun');
    const combobox = document.querySelector('#feature-changer');
    const wrapper = document.querySelector('#test-section');
    const number = document.querySelector('#number');
    // Ids
    const totalID = 'total';
    const IDs = [
      'empty',
      'debug',
      'language',
      'theme',
      'cycleprops',
      'cyclevars',
      'cycleobjects',
      'cycleobjectsfunction',
      'full',
      totalID,
    ];
    const elements = {};
    for (let index = 0; index < IDs.length; index++) {
      const ID = IDs[index];
      elements[ID] = {
        averageEl: document.querySelector(`#average-${ID}`),
        values: [],
      };
    }
    // Print autorun
    let interval = null;
    let intervalTime = 50;
    // Combobox
    combobox.initialValue = 'full';
    combobox.data = {
      'kup-list': {
        data: [
          {
            text: 'No features',
            value: 'empty',
          },
          {
            text: 'KupDebug',
            value: 'debug',
          },
          {
            text: 'KupLanguage',
            value: 'language',
          },
          {
            text: 'KupTheme',
            value: 'theme',
          },
          {
            text: 'Long cycle (props)',
            value: 'cycleprops',
          },
          {
            text: 'Long cycle (variables)',
            value: 'cyclevars',
          },
          {
            text: 'Long cycle (KupObjects)',
            value: 'cycleobjects',
          },
          {
            text: 'Long cycle (object function)',
            value: 'cycleobjectsfunction',
          },
          {
            text: 'All features',
            value: 'full',
          },
        ],
      },
      'kup-text-field': {
        label: 'Select your feature',
      },
    };
    // Events handling
    combobox.addEventListener('kup-combobox-itemclick', () => {
      runTests();
    });
    printButton.onclick = () => runTests();
    autorunButton.onclick = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      } else {
        interval = setInterval(runTests, intervalTime);
      }
    };

    function runTests() {
      let comp = document.querySelector('kup-probe');
      if (comp) {
        comp.remove();
      }
      comp = document.createElement('kup-probe');
      combobox.getValue().then((res) => {
        comp.id = res;
        switch (res) {
          case 'empty':
            break;
          case 'debug':
            comp.features = {
              debug: true,
            };
            break;
          case 'language':
            comp.features = {
              language: true,
            };
            break;
          case 'theme':
            comp.features = {
              theme: true,
            };
            break;
          case 'cycleprops':
            comp.features = {
              longCycleProps: true,
            };
            break;
          case 'cyclevars':
            comp.features = {
              longCycleVars: true,
            };
            break;
          case 'cycleobjects':
            comp.features = {
              objects: true,
            };
            break;
          case 'cycleobjectsfunction':
            comp.features = {
              objectsFunction: true,
            };
            break;
          case 'full':
            comp.features = {
              debug: true,
              language: true,
              longCycleProps: true,
              longCycleVars: true,
              objects: true,
              objectsFunction: true,
              theme: true,
            };
            break;
          case 'total':
            break;
          case 'default':
            console.log(
              'Something wrong happened, feature not supported by kup-probe (' +
                res +
                ''
            );
            return;
        }
        wrapper.append(comp);
        if (comp) {
          comp.printLifecycleTime().then((res) => {
            const id = res.id;
            const time = res.featuresTime;
            number.innerText = (parseInt(number.innerText) + 1).toString();
            elementIteration([id, totalID], time);
          });
        }
      });
    }

    function elementIteration(ids, time) {
      for (let index = 0; index < ids.length; index++) {
        let sum = 0;
        const id = ids[index];
        elements[id].values.push(time);
        for (let index = 0; index < elements[id].values.length; index++) {
          sum += elements[id].values[index];
        }
        elements[id].averageEl.innerText = sum / elements[id].values.length;
      }
    }
  },
};
</script>
