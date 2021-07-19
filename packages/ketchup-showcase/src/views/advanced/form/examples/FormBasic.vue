<template>
  <div>
    <div class="try">
      <div>
        <label>Try with</label>
        <select
          name="sample-type"
          id="sample-type"
          @change="onSampleTypeChange"
        >
          <option value="simple">Simple</option>
          <option value="kitchenSink" selected>Kitchen Sink</option>
        </select>
      </div>
      <div>
        <details>
          <summary class="button">Read more...</summary>
          <div id="more"></div>
        </details>
      </div>
    </div>
    <div class="container">
      <div class="form">
        <kup-form
          ref="form"
          :refid.prop="jsonRefid"
          :extra.prop="jsonExtra"
          :config.prop="jsonConfig"
          :fields.prop="jsonFields"
          :sections.prop="jsonSections"
          :extraMessages.prop="jsonExtraMessages"
          :actions.prop="jsonActions"
          :cells.prop="jsonCells"
          @kup-form-actionsubmitted="onFormActionSubmitted"
          @kup-form-fieldfocused="onFormFieldFocused"
          @kup-form-fieldblurred="onFormFieldBlurred"
          @kup-form-fieldchanged="onFormFieldChanged"
          @kupAutocompleteFilterUpdate="onAutocompleteFilterUpdate"
          :autocompleteCallBackOnFilterUpdate.prop="
            autocompleteCallBackOnFilterUpdate
          "
          @kupSearchFilterSubmitted="onSearchFilterSubmitted"
          :searchCallBackOnFilterSubmitted.prop="
            searchCallBackOnFilterSubmitted
          "
          @kupCrudFormActionSubmitted="onCrudFormActionSubmitted"
          @kupCrudFormFieldChanged="onCrudFormFieldChanged"
          :crudCallBackOnFormActionSubmitted.prop="
            crudCallBackOnFormActionSubmitted
          "
          :crudCallBackOnFormFieldChanged.prop="crudCallBackOnFormFieldChanged"
        />
      </div>

      <div class="side">
        <v-tabs background-color="ligthgrey">
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-tab ripple>Schema</v-tab>
          <v-tab ripple>Events</v-tab>
          <v-tab ripple>Methods</v-tab>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <textarea
                  cols="50"
                  rows="50"
                  id="json"
                  @change="onJsonTextChange"
                  v-model="jsonText"
                ></textarea>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>See console log for more details...</p>
                <ul class="stack" id="stack"></ul>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>See console log...</p>
                <p>
                  <v-btn @click="onGetActualCells">Get actual cells</v-btn>
                </p>
                <p>
                  <v-btn @click="onGetOldCells">Get old cells</v-btn>
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>

    <div id="hidden" class="hidden">
      <div id="kitchenSinkMore">
        <p>Sample of almost all of the current features of kup-form.</p>
        <p>On submit actions some backend fake logic is performed:</p>
        <p>1) if you put in a field value:</p>
        <ul>
          <li>
            GEM, GWM, GIM, FEM, FWM, FIM -> you will obtain a Global or Field
            Error, Warning or Info Message
          </li>
          <li>
            GVM, FVM -> you will obtain a Global or a Field backend Value
            Modified
          </li>
          <li>
            GRS, GRU -> you will obtain a Set / Unset of Readonly prop for some
            fields
          </li>
        </ul>
        <p></p>
        <p>
          2) if you put country != IT your region field value will be blanked
          and region options will be updated
        </p>
        <p>
          If you want to activate backend fake logic also after a particular
          field has changed (for example for a backend check) you can put
          liveBackendCheck=true to the specific field you want. The sample
          backend function associated to form field changed event will read
          liveBackendCheck prop and if true it will perform the logic.
        </p>
      </div>
      <div id="simpleMore">
        <p>
          A very simple sample with the same backend logic of kitchenSink
          sample.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import kitchenSinkStructure from '@/mock/form/kitchenSink/kitchenSinkStructure.json';
import kitchenSinkFather from '@/mock/form/kitchenSink/kitchenSinkFather.json';
import kitchenSinkRelatives from '@/mock/form/kitchenSink/kitchenSinkRelatives.json';
import kitchenSinkFormConfig from '@/mock/form/kitchenSink/kitchenSinkFormConfig.json';
import kitchenSinkFormExtra from '@/mock/form/kitchenSink/kitchenSinkFormExtra.json';
import kitchenSinkCrudRecords from '@/mock/crud/kitchenSink/kitchenSinkCrudRecords.json';
import simpleStructure from '@/mock/form/simple/simpleStructure.json';
import simpleFormConfig from '@/mock/form/simple/simpleFormConfig.json';
import simpleCrudRecords from '@/mock/crud/simple/simpleCrudRecords.json';
import {
  buildFormEventCallback,
  chooseAndApplyFakeBackendLogic,
} from '@/mock/form/form-utils';
import { buildAutocompleteFilterUpdateCallback } from '@/mock/autocomplete';
import { buildSearchFilterSubmittedCallback } from '@/mock/search/search-utils';

export default {
  data() {
    return {
      json: '',
      sampleType: '',
      count: 0,
      crudCallBackOnFormActionSubmitted: buildFormEventCallback(
        'FormActionSubmitted'
      ),
      crudCallBackOnFormFieldChanged: buildFormEventCallback(
        'FormFieldChanged'
      ),
      autocompleteCallBackOnFilterUpdate: buildAutocompleteFilterUpdateCallback(
        10
      ),
      searchCallBackOnFilterSubmitted: buildSearchFilterSubmittedCallback(),
    };
  },
  mounted() {
    this.sampleType = 'kitchenSink';
    this.loadKitchenSink();
    this.appendMore(this.sampleType);
  },

  computed: {
    jsonText() {
      return JSON.stringify(this.json, null, 4);
    },
    jsonRefid() {
      return this.json.refid;
    },
    jsonExtra() {
      return this.json.extra;
    },
    jsonConfig() {
      return this.json.config;
    },
    jsonCells() {
      return this.json.cells;
    },
    jsonFields() {
      return this.json.fields;
    },
    jsonSections() {
      return this.json.sections;
    },
    jsonExtraMessages() {
      return this.json.extraMessages;
    },
    jsonActions() {
      return this.json.actions;
    },
  },

  methods: {
    loadKitchenSink() {
      let json = {
        ...JSON.parse(JSON.stringify(kitchenSinkFormExtra)),
        ...JSON.parse(JSON.stringify(kitchenSinkFormConfig)),
        ...JSON.parse(JSON.stringify(kitchenSinkStructure)),
        ...{
          cells: JSON.parse(JSON.stringify(kitchenSinkCrudRecords)).records[0]
            .cells,
        },
      };
      json.fields['father'].config = JSON.parse(
        JSON.stringify(kitchenSinkFather)
      );
      json.fields['father'].config.fields['relatives'].config = JSON.parse(
        JSON.stringify(kitchenSinkRelatives)
      );
      this.json = json;
    },
    loadSimple() {
      let json = {
        ...JSON.parse(JSON.stringify(simpleFormConfig)),
        ...JSON.parse(JSON.stringify(simpleStructure)),
        ...{
          cells: JSON.parse(JSON.stringify(simpleCrudRecords)).records[0].cells,
        },
      };
      this.json = json;
    },
    onJsonTextChange(e) {
      let jsonText = e.target.value;
      try {
        this.json = JSON.parse(jsonText);
      } catch (e) {
        alert(e);
      }
    },
    onSampleTypeChange(e) {
      this.sampleType = e.target.value;
      if (this.sampleType == 'kitchenSink') {
        this.loadKitchenSink();
      } else if (this.sampleType == 'simple') {
        this.loadSimple();
      }
      this.appendMore(this.sampleType);
    },
    onGetActualCells(e) {
      this.$refs.form
        .getActualCells()
        .then((result) =>
          console.log('Actual cells:' + JSON.stringify(result))
        );
    },
    onGetOldCells(e) {
      this.$refs.form
        .getOldCells()
        .then((result) => console.log('Old cells: ' + JSON.stringify(result)));
    },
    onFormActionSubmitted(event) {
      this.appendEventToHistory('FormActionSubmitted', event);
      let result = chooseAndApplyFakeBackendLogic(
        'FormActionSubmitted',
        event.detail
      );
      this.updateForm(result);
    },
    onFormFieldFocused(event) {
      this.appendEventToHistory('FormFieldFocused', event);
    },
    onFormFieldBlurred(event) {
      this.appendEventToHistory('FormFieldBlurred', event);
    },
    onFormFieldChanged(event) {
      this.appendEventToHistory('FormFieldChanged', event);
      let result = chooseAndApplyFakeBackendLogic(
        'FormFieldChanged',
        event.detail
      );
      this.updateForm(result);
    },
    onAutocompleteFilterUpdate(event) {
      this.appendEventToHistory('AutocompleteFilterUpdate', event);
    },
    onSearchFilterSubmitted(event) {
      this.appendEventToHistory('SearchFilterSubmitted', event);
    },
    onCrudFormActionSubmitted(event) {
      this.appendEventToHistory('CrudFormActionSubmitted', event);
    },
    onCrudFormFieldChanged(event) {
      this.appendEventToHistory('CrudFormFieldChanged', event);
    },
    appendEventToHistory(eventType, event) {
      this.count++;
      var node = document.createElement('LI');
      var textnode = document.createTextNode(this.count + ' - ' + eventType);
      node.appendChild(textnode);
      document.getElementById('stack').prepend(node);
      console.log(
        'EVENT ' +
          this.count +
          ' - ' +
          eventType +
          ' event with detail : ' +
          JSON.stringify(event.detail)
      );
    },
    appendMore(sampleType) {
      let more = document.getElementById('more');
      let hidden = document.getElementById('hidden');
      let moreChild = more.firstChild;
      hidden.append(moreChild);
      more.append(document.getElementById(sampleType + 'More'));
    },
    updateForm(result) {
      console.log('FORM component update...');

      if (isEmpty(result)) {
        console.log('Nothing to update...');
      }

      if (result.extraMessages) {
        this.$refs.form.extraMessages = result.extraMessages;
      }

      // TODO: as default if you modify fields you have to return all fields
      // I added a fields.diff.override mode but is an INCOMPLETE sample
      // the impl is only for readonly and data props -> if can be useful extends it
      if (result.fields) {
        console.log('Updating fields...');
        if (result.diffTypes.includes('fields.diff.override')) {
          const keys = Object.keys(result.fields);
          keys.forEach((key) => {
            if (result.fields[key].hasOwnProperty('config')) {
              if (result.fields[key].config.hasOwnProperty('data')) {
                this.$refs.form.fields[key].config.data =
                  result.fields[key].config.data;
              }
            }

            if (result.fields[key].hasOwnProperty('readonly')) {
              this.$refs.form.fields[key].readonly =
                result.fields[key].readonly;
            }
          });
        } else {
          this.$refs.form.fields = result.fields;
        }
      }

      if (result.cells) {
        console.log('Updating cells...');
        this.$refs.form.cells = result.cells;
      }

      // todo: config, sections, actions
    },
  },
};
</script>

<style scoped lang="scss">
label {
  display: block;
  font-weight: bold;
}
select {
  -moz-appearance: menulist;
  -webkit-appearance: menulist;
}

textarea {
  border: solid 1px black;
  width: 100%;
}

.container {
  display: grid;
  grid-template-columns: 70% auto;
  gap: 10px;
  border: dotted 1px gray;
}
.stack {
  margin-top: 10px;
  width: 100%;
  font-size: 12px;
  word-wrap: break-word;
}

.stack li {
  width: 100%;
}

.side {
  grid-column-start: 2;
  grid-column-end: 2;
}

.form {
  grid-column-start: 1;
  grid-column-end: 1;
}

.try {
  margin-bottom: 5px;
  display: inline-grid;
  grid-template-columns: auto auto;
  gap: 10px;
}

.try label {
  display: inline;
  font-weight: bold;
  margin-right: 5px;
}

.try select {
  display: inline;
}

.button {
  font-weight: bold;
  font-style: italic;
  outline: none;
  cursor: pointer;
}

.hidden {
  display: none;
}
</style>
