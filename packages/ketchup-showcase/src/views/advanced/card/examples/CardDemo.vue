<template>
  <div>
    <demo
      :demoComp="demoComp"
      :demoEvents="demoEvents"
      :demoProps="demoProps"
      :demoClasses="demoClasses"
    ></demo>
  </div>
</template>

<script>
import Demo from '@/views/advanced/page/templates/Demo';
import { baseData } from '@/mock/chart';

export default {
  components: {
    Demo,
  },
  name: 'CardDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-card-click',
          type: 'click',
        },
        {
          name: 'kup-card-event',
          type: 'custom',
        },
      ],
      demoProps: [
        {
          prop: 'customStyle',
          description:
            'Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization',
          type: 'string',
          default: '""',
          try: 'css',
        },
        {
          prop: 'data',
          description: 'The actual data of the card.',
          type: 'CardData',
          default: 'null',
          try: 'json',
        },
        {
          prop: 'isMenu',
          description: 'Defines whether the card is a menu or not.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'layoutFamily',
          description:
            'Sets the type of the card. Currently supported values: "collapsible", "dialog", "scalable", "standard".',
          type: 'CardFamily',
          default: 'standard',
          try: 'field',
        },
        {
          prop: 'layoutNumber',
          description: 'Sets the number of the layout.',
          type: 'number',
          default: '1',
          try: 'field',
        },
        {
          prop: 'menuVisible',
          description:
            "Sets the status of the menu, when false it's hidden otherwise it's visible.",
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'sizeX',
          description:
            'The width of the card, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).',
          type: 'string',
          default: '100%',
          try: 'field',
        },
        {
          prop: 'sizeY',
          description:
            'The height of the card, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
          type: 'string',
          default: '100%',
          try: 'field',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-info',
          description:
            'The component will be rendered using the informational color of the app.',
        },
        {
          class: 'kup-secondary',
          description:
            'The component will be rendered using the secondary color of the app.',
        },
        {
          class: 'kup-success',
          description:
            'The component will be rendered using the success color of the app.',
        },
        {
          class: 'kup-warning',
          description:
            'The component will be rendered using the warning color of the app.',
        },
      ],
    };
  },
};

function createComp() {
  let comp = document.createElement('kup-card');
  comp.data = {
    button: [
      { icon: 'play', flat: true },
      { icon: 'favorite', flat: true },
      { icon: 'share', label: 'share' },
    ],
    chart: [
      {
        title: 'chart1',
        data: baseData,
        series: ['Col2', 'Col3', 'Col4'],
        axis: 'Col1',
        offlineMode: { value: '1;7;-5;6;10;-5;3;4', shape: 'line' },
      },
    ],
    checkbox: [
      {
        label: 'checkbox[0]',
        title: 'checkbox[0]',
      },
      {
        label: 'checkbox[1]',
        title: 'checkbox[1]',
      },
      {
        label: 'checkbox[2]',
        title: 'checkbox[2]',
      },
      {
        label: 'checkbox[3]',
        title: 'checkbox[3]',
      },
      {
        label: 'checkbox[4]',
        title: 'checkbox[4]',
      },
      {
        label: 'checkbox[5]',
        title: 'checkbox[5]',
      },
      {
        label: 'checkbox[6]',
        title: 'checkbox[6]',
      },
    ],
    chip: [
      {
        title: 'chip1',
        data: [
          {
            value: '1_chip',
            icon: 'filter_1',
            label: 'First chip',
            checked: false,
          },
          {
            value: '2_chip',
            icon: 'filter_2',
            label: 'Second chip',
            checked: true,
          },
          {
            value: '3_chip',
            icon: 'filter_3',
            label: 'Third chip',
            checked: false,
          },
          {
            value: '4_chip',
            icon: 'filter_4',
            label: 'Fourth chip',
            checked: false,
          },
          {
            value: '5_chip',
            icon: 'filter_5',
            label: 'Fifth chip',
            checked: false,
          },
          {
            value: '6_chip',
            icon: 'filter_6',
            label: 'Sixth chip',
            checked: false,
          },
          {
            value: '7_chip',
            icon: 'filter_7',
            label: 'Seventh chip',
            checked: false,
          },
          {
            value: '8_chip',
            icon: 'filter_8',
            label: 'Eighth chip',
            checked: false,
          },
          {
            value: '9_chip',
            icon: 'filter_9',
            label: 'Ninth chip',
            checked: false,
          },
        ],
      },
    ],
    color: ['#498204', 'var(--kup-title-background-color)'],
    image: [
      {
        resource: 'images/catz_small.jpg',
      },
      { resource: 'widgets' },
    ],
    progressbar: [{ value: 75, centeredLabel: false }],
    text: [
      'I am a title',
      'I am a subtitle',
      'I am a description, so I need more words compared to other texts. I will contain some nonsense, apologies.',
      'Text #4',
      'Text #5',
      'Text #6',
    ],
    textfield: [
      {
        fullWidth: true,
        icon: 'widgets',
        isClearable: true,
        label: 'textfield[0]',
        title: 'textfield[0]',
      },
    ],
  };
  comp.id = 'demo-component';
  comp.layoutFamily = 'standard';
  comp.layoutNumber = '1';
  comp.sizeX = '100%';
  comp.sizeY = '100%';
  return comp;
}
</script>
