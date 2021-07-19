<template>
  <div id="kup-tooltip">
    <h3
      >Layout 1 (default layout)
      <span
        id="action-confirm-label"
        v-text="labelText"
        v-if="labelText !== ''"
      ></span
    ></h3>
    <div id="layout1">
      <kup-tooltip
        @kup-tooltip-loaddata="onLoadData($event, 1)"
        @kup-tooltip-loaddetail="loadBornToDie"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.bornToDie" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        @kup-tooltip-loaddata="onLoadData($event, 2)"
        @kup-tooltip-loaddetail="loadUltraviolence"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.ultra" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        @kup-tooltip-loaddata="onLoadData($event, 3)"
        @kup-tooltip-loaddetail="loadHoneymoon"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.honey" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        @kup-tooltip-loaddata="onLoadData($event, 4)"
        @kup-tooltip-loaddetail="loadLust"
      >
        <img :src="images.lust" width="64" height="64" />
      </kup-tooltip>
    </div>

    <h3>Layout 2</h3>
    <div id="layout2">
      <kup-tooltip
        layout="2"
        @kup-tooltip-loaddata="onLoadData($event, 1)"
        @kup-tooltip-loaddetail="loadBornToDie"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.bornToDie" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        layout="2"
        @kup-tooltip-loaddata="onLoadData($event, 2)"
        @kup-tooltip-loaddetail="loadUltraviolence"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.ultra" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        layout="2"
        @kup-tooltip-loaddata="onLoadData($event, 3)"
        @kup-tooltip-loaddetail="loadHoneymoon"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.honey" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        layout="2"
        @kup-tooltip-loaddata="onLoadData($event, 4)"
        @kup-tooltip-loaddetail="loadLust"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.lust" width="64" height="64" />
      </kup-tooltip>
    </div>

    <h3>Layout 3</h3>
    <div id="layout3">
      <kup-tooltip
        layout="3"
        @kup-tooltip-loaddata="onLoadData($event, 1)"
        @kup-tooltip-loaddetail="loadBornToDie"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.bornToDie" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        layout="3"
        @kup-tooltip-loaddata="onLoadData($event, 2)"
        @kup-tooltip-loaddetail="loadUltraviolence"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.ultra" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        layout="3"
        @kup-tooltip-loaddata="onLoadData($event, 3)"
        @kup-tooltip-loaddetail="loadHoneymoon"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.honey" width="64" height="64" />
      </kup-tooltip>

      <kup-tooltip
        layout="3"
        @kup-tooltip-loaddata="onLoadData($event, 4)"
        @kup-tooltip-loaddetail="loadLust"
        @kup-tooltip-actioncommandclicked="actionCommandClicked"
      >
        <img :src="images.lust" width="64" height="64" />
      </kup-tooltip>
    </div>

    <div class="tooltip-perf">
      <kup-tooltip
        v-for="index in 10000"
        :key="index"
        @kup-tooltip-loaddata="onLoadData($event, 1)"
        @kup-tooltip-loaddetail="loadBornToDie"
      >
        <p>{{ index }}</p>
      </kup-tooltip>
    </div>
  </div>
</template>

<script>
import {
  bornToDie,
  ultraviolence,
  honeymoon,
  lustForLife,
  imageUrls,
} from '@/mock/tooltip';

export default {
  data() {
    return {
      images: {
        ...imageUrls,
      },
      labelText: '',
    };
  },

  methods: {
    onLoadData(event, index) {
      this.labelText = '';
      let data;
      switch (index) {
        case 1:
          data = {
            image: this.images.bornToDie,
            title: 'Born to die',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2012,
              },
            },
          };
          break;

        case 2:
          data = {
            image: this.images.ultra,
            title: 'Ultraviolence',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2014,
              },
            },
          };
          break;

        case 3:
          data = {
            image: this.images.honey,
            title: 'Honeymoon',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2015,
              },
            },
          };
          break;

        case 4:
          data = {
            image: this.images.lust,
            title: 'Lust for life',
            content: {
              info1: {
                label: 'Author',
                value: 'Lana del Rey',
              },
              info2: {
                label: 'Year',
                value: 2017,
              },
            },
          };
          break;
      }

      event.target.data = data;
    },

    loadBornToDie(event) {
      setTimeout(() => (event.target.detailData = bornToDie), 250);
    },

    loadUltraviolence(event) {
      setTimeout(() => (event.target.detailData = ultraviolence), 250);
    },

    loadHoneymoon(event) {
      setTimeout(() => (event.target.detailData = honeymoon), 250);
    },

    loadLust(event) {
      setTimeout(() => (event.target.detailData = lustForLife), 250);
    },

    actionCommandClicked(event) {
      var message =
        "Hai premuto il bottone a cui è associata l'esecuzione dell'azione: " +
        JSON.stringify(event.detail.actionCommand.exec);
      this.labelText = message;
    },
  },
};
</script>

<style scoped>
[id^='layout'] {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

kup-tooltip h3,
kup-tooltip h4 {
  margin: 0;
}

.tooltip-perf {
  display: flex;
  flex-wrap: wrap;
}

.tooltip-perf kup-tooltip {
  margin: 0px 3px;
}

#action-confirm-label {
  font-size: 80%;
}
</style>
