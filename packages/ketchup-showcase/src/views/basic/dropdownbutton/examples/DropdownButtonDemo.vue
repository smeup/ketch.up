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

export default {
  components: {
    Demo,
  },
  name: 'DropdownButtonDemo',
  data() {
    return {
      demoComp: createComp(),
      demoEvents: [
        {
          name: 'kup-dropdownbutton-click',
          type: 'click',
        },
        {
          name: 'kup-dropdownbutton-focus',
          type: 'focus',
        },
        {
          name: 'kup-dropdownbutton-blur',
          type: 'blur',
        },
        {
          name: 'kup-dropdownbutton-change',
          type: 'change',
        },
        {
          name: 'kup-dropdownbutton-itemclick',
          type: 'click',
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
          description: 'Props of the sub-components.',
          type: 'Object',
          default: 'undefined',
          try: 'json',
        },
        {
          prop: 'disabled',
          description:
            'Sets the component to disabled state, making it not interactable.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'displayMode',
          description:
            'Sets how to show the selected item value. Suported values: "code", "description", "both".',
          type: 'string',
          default: 'description',
          try: 'field',
        },
        {
          prop: 'dropdownOnly',
          description:
            'Default value is false. When set to true, the arrow dropdown button is the only button displayed.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
        {
          prop: 'icon',
          description:
            'The button will be rendered with the specified Material Design icon.',
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'initialValue',
          description: 'Sets the initial value of the component.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'label',
          description:
            "The button's text. If no value is specified, the button will render as an icon button, in this variant specifying an icon is mandatory.",
          type: 'string',
          default: 'null',
          try: 'field',
        },
        {
          prop: 'selectMode',
          description:
            'Sets how to return the selected item value. Suported values: "code", "description", "both".',
          type: 'string',
          default: 'description',
          try: 'field',
        },
        {
          prop: 'styling',
          description:
            'Defines the style of the button. Available styles are "flat" and "outlined", "raised" is the default.',
          type: 'string',
          default: '""',
          try: 'field',
        },
        {
          prop: 'trailingIcon',
          description:
            'The button will display its associated icon after the text.',
          type: 'boolean',
          default: 'false',
          try: 'switch',
        },
      ],
      demoClasses: [
        {
          class: 'kup-danger',
          description:
            'The component will be rendered using the danger color of the app.',
        },
        {
          class: 'kup-full-width',
          description:
            'The button will fill all the available horizontal space.',
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
          class: 'kup-shaped',
          description: 'The borders of the button will be shaped.',
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
  let comp = document.createElement('kup-dropdown-button');
  comp.icon = 'widgets';
  comp.id = 'demo-component';
  comp.label = 'Demo';
  comp.data = {
    'kup-list': {
      data: [
        {
          text: 'Extra action #1',
          value: '1',
          icon: 'filter_1',
        },
        {
          text: 'Extra action #2',
          value: '2',
          icon: 'filter_2',
        },
        {
          text: 'Extra action #3',
          value: '3',
          icon: 'filter_3',
        },
      ],
    },
  };
  return comp;
}
</script>
